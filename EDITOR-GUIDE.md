# Editor's Guide — SPIRIT website

This is the guide for non-technical collaborators who want to edit the website. You don't need to know any code. You only need a free [GitHub account](https://github.com/signup).

## Signing in (production)

1. Go to **https://www.spiritofthefrontrange.org/admin/**
2. Click "Login with GitHub"
3. Authorize the app (you'll see this once)

> **Note for site admins:** the production CMS sign-in requires a GitHub OAuth proxy to be configured. See `README.md` § "CMS — production OAuth setup" for the one-time setup steps.

## Local editing (developers)

If you're running the site locally:
```sh
npm run dev      # in one terminal — runs the site at localhost:4321
npm run cms      # in another terminal — runs the Decap proxy server
```

Then open `http://localhost:4321/admin/index.html` — no GitHub auth needed in dev mode.

You'll land in the editor — a clean dashboard with three sections you can edit:

- **Stewards** — team members
- **Programs** — Commons Teach-Ins, Solidarity Suppers, Neighborhood Resiliency, Allocation Rounds
- **Catalog Entries** — the Whole Earth–style index of bioregional resources

## The editing workflow

The editor uses an **editorial workflow** — your changes don't go live immediately. Here's the flow:

1. **Edit or create a draft** — any changes start as a draft
2. **Save it** — the draft is preserved, but not published
3. **Mark "Ready"** — when you're confident, mark it ready for review
4. **Publish** — a steward with publish rights merges it. The site rebuilds in ~1–2 minutes.

This means you can experiment freely. Nothing goes live by accident.

## Adding a new Catalog entry

The Catalog is the heart of what makes our site distinctive — a curated, opinionated index of resources. Each entry has a personal recommendation from one of us.

To add one:

1. Click **Catalog Entries → New Catalog Entry**
2. Fill in the fields:
   - **Title** — the name of the book/org/tool/place/practice
   - **Kind** — pick one (book, organization, tool, practice, place, podcast, essay)
   - **Author / By** — who made it (optional)
   - **Source / Publisher** — e.g. "Cambridge University Press · 1990" or the website
   - **URL** — link to where people can find it
   - **Price** — "$28", "Free", "Open" — whatever's accurate
   - **Year** — when it was published or founded
   - **Pillars** — which of our four pillars this connects to
   - **Curator** — who on the team is recommending this
   - **Color tone** — clay/creek/sage/grass — pick one that fits the vibe
   - **Display order** — lower numbers appear first; put something like 50 if you don't care
   - **Curator's note** — *this is the important part* — a few sentences in your own voice about why this belongs in the catalog. What did it teach you? Why do you trust it?

The note can use **bold**, *italic*, and links. Write it the way you'd talk about the resource to a friend.

## Editing a Steward bio

1. Click **Stewards → [the steward name]**
2. Edit the bio — keep it personal, keep it grounded
3. Save → Mark Ready → Publish

## Editing a Program description

Same as above. The program cards on the Programs page pull from these files. The "short description" appears on the home page; the longer body appears on the Programs page.

## Image guidelines

When uploading images:

- **JPGs for photos**, PNGs for illustrations with transparency
- **Keep file sizes reasonable** — under 2MB each. The site's build pipeline will optimize them automatically, but huge raw uploads bloat the repo.
- **Use descriptive file names** — `josie-portrait.jpg`, not `IMG_1234.jpg`. (Decap will rename them slightly when committing.)

## Voice & tone notes

The site has a distinctive voice. When you write or edit:

- **Reverent without being precious.** We talk about the land like it's family. We don't get mystical-mushy.
- **Specific, not abstract.** "The red rocks of the South" beats "our beautiful region."
- **Plural.** "We," "our," "the denizens of the Commons" — never "you should."
- **Embodied.** "We come together," "we walk," "we listen" — verbs of presence.
- **Avoid SaaS marketing-speak.** Never "Get started," "Learn more," or 🙈 emojis-as-jokes.

Sample of the voice from our own writing:

> Our mutual relationship to where we live implies our mutual responsibility for that place. This relationship cannot be enclosed because it is, by definition, a commons.

## "Something looks broken"

If a page looks wrong after you edit:

1. Check that all required fields are filled in
2. Make sure your image uploads completed
3. Check the "Workflow" tab — your draft might not be published yet
4. If still broken, message Cameron or Ben

You can't actually break the live site through normal editing — every change goes through a PR before publishing, and even if a bad change merged, we can revert it from git history with one click.

## Where this guide lives

The latest version of this guide is always at `EDITOR-GUIDE.md` in the website's GitHub repo. If something's unclear, suggest an edit there too.
