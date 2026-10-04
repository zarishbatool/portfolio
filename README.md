# Zarish Batool | Portfolio

Animated portfolio with a milky way and 4D (tesseract) space theme.
Plain HTML, CSS and JavaScript. No build step.

## Files

| File | What it does |
|---|---|
| `index.html` | Page content: hero, about, skills, projects, journey, certificate, contact |
| `style.css` | All styling, colors (see `:root` at the top) and animations |
| `script.js` | Star field, milky way, 4D tesseract, typing text, scroll effects |
| `assets/` | Profile picture and certificate images |

## Run locally

Open `index.html` in a browser, or in VS Code install the **Live Server**
extension, right click `index.html` and choose **Open with Live Server**.

## Deploy

1. Push this folder to a GitHub repository.
2. On vercel.com choose **Add New, Project**, import the repository.
3. Framework Preset: **Other**. Leave build command and output directory empty.
4. Click **Deploy**. Every later push to GitHub deploys automatically.

## Quick edits

- Change text: edit `index.html`.
- Change colors: edit the variables in `:root` in `style.css`.
- Change the typed roles: edit the `roles` list in `script.js`.
- Replace the picture or certificate: overwrite the files in `assets/` with the same names.

## Live demo links

Each project card with a "Live demo" button is a plain link in the projects
section of `index.html`. To change a link, edit the `href` of that card's
`<a class="demo">`.
