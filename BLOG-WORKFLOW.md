# Create a Blog Post (Essential Chiropractic)

How to add a new blog post to this site. This is adapted from a generic Hugo/PaperMod
workflow to match **this** project, which is **hand-coded static HTML** — no Hugo, no
markdown, no build step, no git deploy. Posts are standalone `.html` files that share
the same inline-CSS design as the rest of the site.

## How this site actually works
- Every page is a self-contained `.html` file with its own `<style>` block. There is no
  shared CSS file or templating engine — the look is kept consistent by copying the same
  nav, hero, and footer markup into each file.
- The blog lives in:
  - `blog.html` — the listing page (featured post + 3-card grid + CTA)
  - `blog-<slug>.html` — one file per article (all identical templates)
- Images live in `Photos/`. The logo is loaded from a GitHub raw URL; everything else is
  a local file path like `Photos/whatever.jpeg`.
- Preview is a local Python static server (`.claude/launch.json` → `static`, port 8131),
  **not** `hugo server`.
- This folder is **not** a git repository, so there is no `git push` / GitHub Actions
  deploy step. Publishing means uploading the new/changed files to wherever the live site
  is hosted (confirm the host before treating a post as "live").

---

## Steps

### 1. Pick a slug and copy a template
Each existing post is a complete, identical template. Duplicate one:
```bash
cp "blog-what-is-softwave-therapy.html" "blog-<slug>.html"
```
Use a short, descriptive, hyphenated slug, e.g. `blog-back-pain-from-sitting.html`.

### 2. Get the content from the user
Ask the user for the post content (or write a draft and get approval). Don't invent
medical claims — keep it consistent with how the existing service pages describe care.
Once you have the content, fill in the article body (see step 4).

### 3. Find and download a header image (free stock + attribution)
There is **no Unsplash integration** in this environment, so do it manually:

1. Use **WebSearch** to find a relevant free image on Unsplash or Pexels
   (landscape orientation works best for the header). Note the **photographer name**,
   the **photo page URL**, and the **direct image URL**.
2. **Confirm with the user before downloading** — state the filename, source, and rough
   size. Downloading a file is an action that needs an explicit OK each time.
3. Download into `Photos/` with a slug-based name:
```bash
curl -L -o "Photos/blog-<slug>.jpg" "<direct-image-url>"
```
4. (Optional) Crop to a clean header ratio if ImageMagick is available:
```bash
magick "Photos/blog-<slug>.jpg" -gravity Center -resize 1600x900^ -extent 1600x900 "Photos/blog-<slug>.jpg"
```
The article template image is styled `aspect-ratio: 16/9; object-fit: cover`, so cropping
is cosmetic, not required.

**Attribution is required for stock photos.** Put the credit in the `<figcaption>` that
already exists under the feature image (see step 4).

### 4. Edit the new `blog-<slug>.html`
Update these spots (search for the existing placeholder text from the template):

- `<title>` and `<meta name="description">` — post title + 1-sentence SEO description.
- **Article tag / breadcrumb / category** — set to `Chiropractic`, `SoftWave Therapy`,
  `Neuropathy`, or `Wellness` (whatever fits). Appears in `.breadcrumb`, `.article-tag`.
- `<h1>` inside `.article-hero` — the headline.
- `.article-byline` — author (`Dr. Kristen Ras-Davis, D.C.` or `Dr. Greg Davis, D.C.`),
  the avatar `src` (`Dr_ K Headshot_JPG (1).avif` or `Headshot.avif`), date, and read time.
  **Use a real, current-or-past date** in a friendly format, e.g. `June 4, 2026`.
- `.article-feature` — set the `<img src>` to `Photos/blog-<slug>.jpg`, write descriptive
  `alt` text, and put the credit in `<figcaption>`, e.g.:
  `Photo by <a class="inline" href="PHOTO_PAGE_URL">Name</a> on Unsplash.`
- `.article-body` — replace the body content. Available building blocks already styled:
  `<p class="lead">` (intro), `<h2>`, `<h3>`, `<p>`, `<ul><li>`, and
  `<div class="callout"><p>…</p></div>` for a highlighted tip.
- Leave the `.article-cta`, back-link, nav, and footer as-is — they're already correct.

### 5. Add the post to the listing page (`blog.html`)
Add a card to the top of the `.post-grid` so the newest post shows first:
```html
<article class="post-card">
  <div class="post-card-media">
    <img src="Photos/blog-<slug>.jpg" alt="...">
    <span class="post-card-tag">Chiropractic</span>
  </div>
  <div class="post-card-body">
    <h3><a href="blog-<slug>.html">Post Title</a></h3>
    <p>1–2 sentence teaser.</p>
    <div class="post-meta">
      <span>June 4, 2026</span>
      <span class="dot"></span>
      <span>5 min read</span>
    </div>
  </div>
</article>
```
Optionally promote it to the **featured** slot at the top of `blog.html` (the
`.featured-post` block) and demote the previous featured post into a card.

### 6. Preview locally
```
preview_start  → name: "static"  (serves on http://localhost:8131)
```
Open `http://localhost:8131/blog.html` and the new `blog-<slug>.html`. Verify:
- The header image loads (no broken image).
- Headline, byline, date, and category are correct.
- The attribution link works.
- The new card appears in the grid and links to the post.
- Nav still shows **Blog** highlighted.

> Tip: the page uses `scroll-behavior: smooth`, which interferes with scripted scrolling
> during automated checks — set `scrollBehavior='auto'` first if you need to jump-scroll.

### 7. Publish
This folder isn't under git, so there's no automated deploy. Upload the new and changed
files to the live host (confirm the host/method with the user first):
- `blog-<slug>.html` (new)
- `blog.html` (edited — new card)
- `Photos/blog-<slug>.jpg` (new image)

---

## Common issues
- **Broken header image** — check the `src` path is `Photos/blog-<slug>.jpg` and the file
  actually downloaded (non-zero size). Spaces in filenames must be URL-encoded in `src`.
- **Missing attribution** — every stock photo needs a credit line in the `<figcaption>`
  and a working link back to the photo page.
- **Inconsistent look** — don't hand-write a new layout; always start by copying an
  existing `blog-*.html` so the nav/hero/footer/CSS stay identical.
- **Post not first in the list** — new cards go at the **top** of `.post-grid`.
- **Future-dated posts** — fine for a static site (they show regardless), but use real
  dates so the byline isn't misleading.

## File structure
```
Essential Chiropractic/
├── blog.html                 # listing page
├── blog-<slug>.html          # one per article
├── BLOG-WORKFLOW.md          # this file
└── Photos/
    └── blog-<slug>.jpg       # header image for the post
```

## Tools used (in this environment)
- `WebSearch` — find a relevant free stock photo + its attribution details
- `curl` — download the chosen image into `Photos/`
- `ImageMagick` (`magick`) — optional cropping/resizing
- `preview_start` / preview tools — local preview on port 8131
- (No Unsplash MCP, no Hugo, no git/GitHub Actions in this project)
