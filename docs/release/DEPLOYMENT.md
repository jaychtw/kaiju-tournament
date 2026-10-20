# Play and publish the v1.0 release candidate

The game is static HTML/CSS/JS/WebP. No backend, secrets, account system, analytics, or runtime external API is needed. Fonts and sound synthesis are local. Do not run the repository's historical trial viewer as the game.

## Local play

Requires Node 24 and npm:

```sh
git clone https://github.com/jaychtw/kaiju-tournament.git
cd kaiju-tournament
npm ci
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). For a phone on the same network, use the computer's LAN address with port 5173. Some firewalls require allowing that development port. The game does not require WebGL.

For the actual production bundle:

```sh
npm run build
npm run preview
```

Open `http://localhost:4173`. An included release ZIP contains the same `dist/` files; extract it and serve its directory with any static HTTP server. Opening `index.html` directly via `file://` does not load the JavaScript modules and manifest reliably. For example, if Python is installed, use `python -m http.server 8080` inside the extracted directory and open `http://localhost:8080`.

## Recommended hosting: GitHub Pages

A manually triggered [Pages workflow](../../.github/workflows/pages.yml) is included. It builds only the runtime app, using relative asset URLs so a repository subpath works. It does not publish the raw source-art/review archive.

1. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions**.
2. Open **Actions → Publish browser release → Run workflow**, on `main`.
3. Follow the URL in the deployment result. The expected project address is `https://jaychtw.github.io/kaiju-tournament/`, but it is **not a verified live deployment** until the workflow succeeds.

Repository contents could be pushed from the cloud, but its GitHub Pages management API returned `Forbidden`; Pages has not been enabled or claimed live by this delivery. No deployment secrets are required. You can also upload the contents of `dist/` to any HTTPS static host.

## Checks

```sh
npm test
npm run test:balance
npm run test:browser
npm run build
```

Browser tests require Chromium. On this cloud machine `/usr/bin/chromium` is available. Elsewhere run `npx playwright install chromium` and set `CHROMIUM_PATH` to your browser path, or run with `CI=1` to use Playwright's installed browser. Physical phone/Safari coverage remains a review task.
