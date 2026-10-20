# v1.0 release candidate

[Download the built browser game](world-kaiju-tournament-v1.0.0-rc.1.zip). Extract it, open a terminal in the extracted `world-kaiju-tournament` folder, run `python -m http.server 8080` if Python is installed, and visit **http://localhost:8080**. Any static HTTP/HTTPS server works; no Node build step is needed for this download. Opening via `file://` does not work reliably.

This is the same runtime bundle produced by `npm run build`. It contains only HTML, JS, CSS, original WebP artwork, local fonts and font licenses. [Per-file hashes](build-manifest.json) and [archive SHA-256](SHA256SUMS) are included. Repackage with `python scripts/package-release.py` after building.

[Source launch and GitHub Pages instructions](../docs/release/DEPLOYMENT.md) · [Release review / known limitations](../docs/release/REVIEW.md)
