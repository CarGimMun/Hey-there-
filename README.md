# HEARTBEAT — A living portfolio

A creative, responsive portfolio concept built with HTML, CSS, JavaScript and Three.js. Designed for GitHub Pages.

## What is included
- Dark editorial design with a red anatomical / scientific visual language.
- Animated 3D heart. A custom stylised 3D heart is included as a fallback, so the page works before you download a model.
- Four selectable markers: three project cards and an About marker.
- Selected work, future projects, a reading list and About section.
- Responsive layout for mobile and desktop.
- Optional loading of a real `.glb` model from `assets/heart.glb`.

## 1. Preview locally
Because the page uses JavaScript modules, do not open `index.html` by double-clicking it. From this folder run:

```bash
python -m http.server 8000
```

Then open http://localhost:8000

## 2. Add a real heart model
Recommended starting point:
- Sketchfab: https://sketchfab.com/3d-models/beating-heart-d9845afb1ee64ad094adc96320c67d98
- The model page lists a CC BY 4.0 license. Follow the download page's attribution requirements and retain a credit to the author in your portfolio.

Download the model in glTF format, extract the `.glb`, and place it here:

`assets/heart.glb`

The code will attempt to load that model. If the file is missing, the custom stylised 3D heart remains visible. If the model has no baked animation, it will still pulse subtly as a whole; realistic anatomical deformation requires a model with an animation or a prepared deformation rig.

**Attribution:** Add a visible credit in this README or the website footer naming the model author, model title and license, and linking to the source. Check the source page at the time you download it.

## 3. Replace the sample projects
Open `script.js`. At the top, edit the `projects` array:
- `title`
- `category`
- `description`
- `tags`
- `url`

The example cards are placeholders. Replace their links with the exact URLs for your three repositories. Also update the three card designs in `index.html` if you want the project grid to mirror your actual projects.

Search the HTML for:
- `your.email@example.com`
- `Carmen`
- `Signals & Stories`
- `Human in Motion`

Update your email and profile text before publishing.

## 4. Publish with GitHub Pages
1. Create a new GitHub repository, for example `heartbeat-portfolio`.
2. Upload `index.html`, `styles.css`, `script.js`, `README.md` and the `assets` folder.
3. Open **Settings → Pages** in the repository.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`, then Save.
6. Wait for GitHub to publish the site; it will show the live URL in Pages settings.

The project uses Three.js from a CDN, so the visitor needs an internet connection for the 3D module and Google Fonts. For a more robust public portfolio, consider self-hosting dependencies later.

## Notes
- The heart's four markers are navigation hotspots positioned around the model, not anatomical segmentation of the actual mesh. This makes them reliable across different downloaded models.
- The example project links point to the GitHub profile as placeholders. Replace them with exact repository URLs.
- The linked reading resources are starting points, not endorsements.
