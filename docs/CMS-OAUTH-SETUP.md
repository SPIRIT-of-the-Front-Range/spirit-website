# Cloudflare Workers OAuth proxy for Decap CMS

This is a one-time setup that lets your team sign in to the live CMS at `/admin/` with their GitHub accounts. It costs **$0** (Cloudflare Workers free tier handles way more than this site needs).

## What you're building

Decap CMS runs entirely in the browser, but it needs a small server-side OAuth proxy to exchange a GitHub OAuth code for an access token (the `client_secret` step can't happen in the browser for security reasons). The Cloudflare Worker is that proxy — about 80 lines of code, deployed to a free worker URL.

```
Editor's browser  →  Decap CMS  →  CF Worker (OAuth proxy)  →  GitHub  →  back to editor
```

## You'll need

- A Cloudflare account (free signup at https://dash.cloudflare.com/sign-up)
- 15 minutes
- Push access to the `SPIRIT-of-the-Front-Range/spirit-website` repo

---

## Step 1 — Create a GitHub OAuth App

1. Sign in to GitHub as the SPIRIT org owner (or any account that can authorize on behalf of the org).
2. Go to **https://github.com/settings/developers** (or for org-owned: **https://github.com/organizations/SPIRIT-of-the-Front-Range/settings/applications**).
3. Click **OAuth Apps → New OAuth App**.
4. Fill in:
   - **Application name:** `SPIRIT of the Front Range — CMS`
   - **Homepage URL:** `https://www.spiritofthefrontrange.org` (or the github.io URL while DNS isn't switched)
   - **Authorization callback URL:** `https://spirit-decap-oauth.YOUR-CF-SUBDOMAIN.workers.dev/callback` — you'll get the real URL in step 3, come back and update this then.
5. Click **Register application**.
6. On the next page, copy the **Client ID** somewhere safe.
7. Click **Generate a new client secret**. Copy the secret immediately — GitHub only shows it once.

---

## Step 2 — Install Cloudflare's `wrangler` CLI

```sh
npm install -g wrangler
wrangler login        # opens browser, signs you in
```

---

## Step 3 — Create the Worker

In any directory (not the website repo — keep it separate):

```sh
mkdir spirit-decap-oauth && cd spirit-decap-oauth
```

Create **`wrangler.toml`**:

```toml
name = "spirit-decap-oauth"
main = "src/index.js"
compatibility_date = "2025-01-01"
```

Create **`src/index.js`**:

```js
// Decap CMS GitHub OAuth proxy — runs on Cloudflare Workers (free tier)
// Based on the official Decap docs pattern.

const SCOPE = 'repo,user';
const ALLOWED_ORIGINS = [
  'https://www.spiritofthefrontrange.org',
  'https://spirit-of-the-front-range.github.io',
  'http://localhost:4321',
  'http://localhost:4322',
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Editor visits /auth → redirect to GitHub OAuth
    if (url.pathname === '/auth' || url.pathname === '/') {
      const state = crypto.randomUUID();
      const authUrl = new URL('https://github.com/login/oauth/authorize');
      authUrl.searchParams.set('client_id', env.OAUTH_CLIENT_ID);
      authUrl.searchParams.set('scope', SCOPE);
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
      return Response.redirect(authUrl.toString(), 302);
    }

    // 2. GitHub redirects back to /callback with a code
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('Missing code', { status: 400 });

      // Exchange code for access token
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: env.OAUTH_CLIENT_ID,
          client_secret: env.OAUTH_CLIENT_SECRET,
          code,
        }),
      });

      const data = await tokenRes.json();
      const token = data.access_token;
      const error = data.error;

      // Decap CMS expects the token via window.opener.postMessage
      // The HTML below is loaded in a popup; on success it messages
      // the parent window (which is the /admin/ page).
      const status = error ? 'error' : 'success';
      const payload = error ? { error } : { token, provider: 'github' };

      const html = `<!doctype html>
<html><head><meta charset="utf-8"></head><body>
<script>
(function() {
  function send(msg) {
    window.opener.postMessage('authorization:github:${status}:' + JSON.stringify(${JSON.stringify(payload)}), '*');
  }
  window.addEventListener('message', function(e) {
    if (e.data === 'authorizing:github') send();
  }, false);
  send();
})();
</script>
<p>Authentication complete — you can close this window.</p>
</body></html>`;

      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return new Response('Decap OAuth proxy · routes: /auth, /callback', { status: 200 });
  },
};
```

---

## Step 4 — Set the secrets and deploy

From the `spirit-decap-oauth` directory:

```sh
wrangler secret put OAUTH_CLIENT_ID
# paste the Client ID from step 1, hit enter

wrangler secret put OAUTH_CLIENT_SECRET
# paste the Client Secret from step 1, hit enter

wrangler deploy
```

After deploy, wrangler prints the worker URL — something like:
```
https://spirit-decap-oauth.YOUR-CF-SUBDOMAIN.workers.dev
```

Copy that URL.

---

## Step 5 — Update the GitHub OAuth App callback

Go back to **https://github.com/settings/developers** → your OAuth App → edit:

- **Authorization callback URL:** `https://spirit-decap-oauth.YOUR-CF-SUBDOMAIN.workers.dev/callback`

Save.

---

## Step 6 — Wire the worker URL into Decap

In `public/admin/config.yml`, uncomment and update the `base_url` line:

```yaml
backend:
  name: github
  repo: SPIRIT-of-the-Front-Range/spirit-website
  branch: main
  base_url: https://spirit-decap-oauth.YOUR-CF-SUBDOMAIN.workers.dev
  auth_endpoint: /auth
```

Also remove `local_backend: true` (or leave it — Decap will only use it when the local proxy at port 8081 is running).

Commit + push:

```sh
git add public/admin/config.yml
git commit -m "Wire Decap CMS to Cloudflare OAuth proxy"
git push
```

---

## Step 7 — Test

1. Wait ~90 seconds for the GH Pages deploy to publish your config change.
2. Visit `https://www.spiritofthefrontrange.org/admin/index.html` (or the github.io subpath URL while DNS isn't switched).
3. Click **Login with GitHub** → a popup opens → you authorize → popup closes → you're in the CMS.
4. Try editing a Steward bio or a Catalog entry → Publish → a PR opens on the repo → merge it → site rebuilds.

---

## Troubleshooting

**"Failed to load config.yml"**
- Make sure the `repo:` value matches your actual GitHub `org/repo` exactly (case-sensitive).

**"Unauthorized" or token exchange fails**
- Re-check the OAuth App callback URL matches the worker URL exactly.
- Confirm the secrets are set: `wrangler secret list`

**Popup blocked**
- Most browsers allow popups from localhost / first-time use. If blocked, the editor can click the address-bar icon to allow.

**Worker logs**
- `wrangler tail` (run from the worker directory) — streams live request logs

---

## Adding editors

Editors just need:
1. A GitHub account
2. **Push or maintain access to `SPIRIT-of-the-Front-Range/spirit-website`** (org admins can grant this via the repo's Settings → Collaborators)

Once they have repo access, they can sign in at `/admin/` with their own GitHub account. Their commits show up in the git history under their username.

If you set `publish_mode: editorial_workflow` in `config.yml` (already on), editors create drafts → mark "Ready" → maintainer publishes (merges PR). Otherwise they push directly to `main`.
