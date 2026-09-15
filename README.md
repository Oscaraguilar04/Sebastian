# Sebastian Alvarez — Acre & Signal

A complete residential Realtor personal-brand portfolio concept for Bakersfield, California. Sebastian Alvarez is fictional. Property names, prices, details, and explicitly labeled testimonial samples demonstrate presentation; they are not real listings, business credentials, or client endorsements.

Built with React, Vite, TypeScript, custom CSS, Framer Motion, and Lucide React. No CMS, database, IDX, or paid API is required.

## Run locally

Use Node.js 20.19+ or 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. Create and inspect a production build with:

```sh
npm run build
npm run preview
```

The build checks TypeScript and writes the static website to `dist/`.

## Browser checks

The optional scripts `scripts/verify-layouts.cjs` and `scripts/verify-interactions.cjs` use Playwright and a locally installed Chrome browser. They check the responsive layouts from 320px through 1920px, property dialogs, keyboard focus, mobile navigation, inquiry prefilling, and the demonstration form. Install Playwright separately for development if needed; it is not a site dependency. Set `PLAYWRIGHT_MODULE` to an external Playwright module path if using a shared installation. Set `SITE_URL` for layout checks and `SITE_TEST_URL` for interaction checks to test a deployed or preview URL. Reports and screenshots are written to the ignored `.tmp-screens/` directory.

## Website behavior

- Responsive editorial sections, mobile navigation, and buyer/seller pathways.
- Property details open in an accessible modal; showing requests lead into the inquiry form.
- The contact form validates inputs and displays a demonstration confirmation. It does **not** transmit, email, or persist submitted information. No consultation or showing is actually booked.
- Keyboard focus styles, semantic labels, reduced-motion support, responsive WebP images, and local web fonts.
- Fictional portfolio disclosure in the property presentation, contact experience, footer, page metadata, and CreativeWork structured data.

## Deploy

Deploy the contents of `dist/` to any static host. Typical settings for Vercel, Netlify, or Cloudflare Pages are build command `npm run build` and output directory `dist`. No environment variables or server process are needed.

### GitHub Pages

The site is configured as a project site at `/sebastian-alvarez/`, matching the npm package and intended repository name. Images, fonts, and other public assets use `import.meta.env.BASE_URL` or `%BASE_URL%` so they resolve under that subdirectory. Section hashes (`#about`, `#contact`) stay on the same page, and the build also writes `404.html` and `.nojekyll` so unknown paths and Jekyll-sensitive files still work on Pages.

1. Create a GitHub repository named `sebastian-alvarez` (or set `BASE_PATH` in the workflow if the repo name differs).
2. Push this project to the `main` branch.
3. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` builds with Node.js 22 and publishes `dist/`.

If the repository is named something other than `sebastian-alvarez`, the workflow sets `BASE_PATH` from the GitHub repository name. User or organization sites named `*.github.io` publish from `/`.

Preview the production subdirectory locally after a build:

```sh
npm run build
npm run preview
```

Then open the `/sebastian-alvarez/` path printed by Vite.

After choosing the final public URL, add an accurate canonical link and `og:url` to `index.html`, and replace the Open Graph and Twitter image paths with the absolute public URL of `social-preview.jpg`. The base-prefixed preview path is portable, but some sharing crawlers require an absolute URL. No invented domain or real-business schema is included.

Before connecting this design to a real agent, replace the concept identity and illustrative content with approved information and connect the form to an actual inquiry endpoint. The included demo form intentionally makes no network submission.

## Content and assets

- `src/data/`: editable site content and illustrative property information.
- `src/components/`: reusable presentation and interaction components.
- `static/`: deployment assets copied by Vite, including images, fonts, favicon, and robots file.
- `Public/Images/`: untouched source photography provided in this workspace. Vite deliberately serves `static/` to avoid case and OneDrive reparse-point inconsistencies in the original source folder.
- `scripts/optimize-images.py`: reproducible image preparation using Python 3 and Pillow.

To regenerate responsive photography:

```sh
python -m pip install Pillow
python scripts/optimize-images.py
```

The script creates 640px and 1200px maximum-width WebPs, plus 1800px variants for Sebastian photography, without upscaling. The hero source is 864×1152, so its 1200 and 1800 filenames both contain an 864px-wide image. Original photos remain unchanged. The script also creates the 1200×630 social preview.

Photography was supplied by the user. Property source filenames credit Curtis Adams/Pexels; this repository does not establish additional license or model-release clearance. Confirm source permissions for intended use when publishing or adapting the site.

Cormorant Garamond and Manrope Latin WOFF2 fonts are self-hosted from Google Fonts. Their SIL Open Font License texts are included in `static/fonts/`. The website does not need a runtime Google Fonts connection.
