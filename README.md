# NexaWeb

A premium, static developer showcase (HTML, CSS and vanilla JavaScript only). Every section is generated from one
file, `js/projects.js`, so adding a project never means touching HTML.

## Add a project

1. Save a screenshot (16:10, for example 1440x900, JPEG or WebP) to `assets/images/projects/`.
2. Open `js/projects.js` and copy any object in the `projects` array. Give it a new unique `id` and fill in the fields.
3. Save. The project appears in the grid, its category chip, the technology filter, the counters, the categories
   section, the tech-stack counts and the detail modal automatically.

| field | notes |
| --- | --- |
| `id` | unique number; also used for links such as `index.html#project-3` |
| `name`, `description` | shown on the card |
| `category` | any text; new categories are created automatically (order them in `siteConfig.categories`) |
| `thumbnail`, `gallery` | main screenshot and optional extras for the detail modal |
| `technologies` | array of tags; `HTML` counts towards the `HTML5` badge via `siteConfig.techAliases` |
| `liveUrl` | your Netlify URL. Empty = "Coming soon" instead of a button |
| `githubUrl` | the GitHub button only appears when this is a valid github.com URL |
| `featured` | `true` to show in the large Featured section (2 or 3 works best) |
| `details`, `features`, `year` | optional, used in the detail modal |
| `sample` | `true` shows a "Sample" badge; remove it for real projects |

## Before publishing

- **Replace placeholder links.** Every `liveUrl` containing `your-...` and the LinkedIn and email addresses in `siteConfig`
  are placeholders (they are labelled on the site). The GitHub profile `https://github.com/NexaWeb-dev` and two
  repository links came from your local git remotes: check them.
- **Replace or delete the sample entries** (ids 8 to 16). Their thumbnails are generic wireframes.
- Set `siteConfig.owner`, `role`, `about` and, optionally, `profileImage` (put a photo in `assets/images/profile/`).
- Update the `og:image` and add a canonical URL in `index.html` once you have a domain.

## Contact form

The form validates and confirms but sends nothing by default. In `siteConfig.contactForm` set `mode` to `'netlify'`
(Netlify Forms, once deployed on Netlify) or `'endpoint'` with a form-service URL such as Formspree.

## Structure

    index.html
    css/      style.css  animations.css  responsive.css
    js/       projects.js (your data)  filters.js  project-details.js  main.js
    assets/   images/projects  images/profile  icons

Animations respect `prefers-reduced-motion`. External links use `target="_blank" rel="noopener noreferrer"`.
