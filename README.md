# Matyan UI

React single-page application for browsing runs, metrics, params, and artifacts. Part of the Matyan experiment-tracking stack (fork of Aim). The UI talks only to the **matyan-backend** REST API (never to the frontier).

## Layout

- **`web/`** — React app (TypeScript, React 17, react-scripts 4, Material-UI, Highcharts, etc.). All frontend source and `package.json` live here.
- **`src/matyan_ui/`** — Python package that serves the built static files and injects config at runtime via a Jinja-rendered `index-template.html`.
- **Build output**: `npm run build` in `web/` writes assets into `src/matyan_ui/static/` (and produces `index-template.html` with placeholders for base path and API host).

## Prerequisites

- **Build**: Node.js and npm (e.g. Node 20; see [MAINTENANCE.md](MAINTENANCE.md) for known workarounds on Node 17+).
- **Run**: Python 3.12+. The package uses `uv` in the repo; `uv run matyan-ui` or install then `matyan-ui` CLI.

## Development

- **Option A — React dev server**: From `web/`, run `npm install --legacy-peer-deps` (or `npm ci`) then `npm start`. Configure the app to use the backend (e.g. proxy or `API_HOST_BASE`); the app reads `window.API_HOST_BASE` / `window.API_BASE_PATH_SUFFIX` from the served HTML (in production these come from the Python server's Jinja template).
- **Option B — Production-like**: Build once (`npm run build` from `web/`), then run the Python server so it serves from `src/matyan_ui/static/` with the same env vars you would use in deployment.

The backend must be running (e.g. on `http://localhost:53800`) for the UI to load runs and metrics.

## Build (production)

From repo root (or from `extra/matyan-ui`):

```bash
cd extra/matyan-ui/web && npm ci --legacy-peer-deps && npm run build
```

On Node 17+, if the build fails with OpenSSL errors, set `NODE_OPTIONS=--openssl-legacy-provider` (see [MAINTENANCE.md](MAINTENANCE.md)).

Result: `src/matyan_ui/static/` is populated (and committed or not per `.gitignore`; Docker builds do this in the image).

## Run (production-like)

From the matyan-ui package directory: `uv run matyan-ui` (or `matyan-ui` if the package is installed).

Options: `--host`, `--port` (defaults from env: `MATYAN_UI_HOST`, `MATYAN_UI_PORT`). Default port: 8000. The app is served under `MATYAN_UI_BASE_PATH` (default empty = root).

## Configuration (environment variables)

| Variable | Default | Purpose |
|----------|---------|---------|
| `MATYAN_UI_BASE_PATH` | `""` | URL path prefix where the UI is served (e.g. `/matyan`). |
| `MATYAN_UI_API_BASE_PATH` | `/api/v1` | Path suffix for backend API (used with `MATYAN_UI_API_HOST_BASE`). |
| `MATYAN_UI_API_HOST_BASE` | `http://localhost:53800` | Backend base URL; UI sends REST requests here. |
| `MATYAN_UI_API_AUTH_TOKEN` | `""` | Optional bearer token for UI → backend requests. |
| `MATYAN_UI_HOST` | `0.0.0.0` | Bind address for the server. |
| `MATYAN_UI_PORT` | `8000` | Bind port. |

These are injected into the HTML so the React app can call the correct backend; for subpath or multi-domain setups, set `MATYAN_UI_BASE_PATH` and/or `MATYAN_UI_API_HOST_BASE` accordingly.

## Deployment

- **Docker**: Use [Dockerfile.dev](Dockerfile.dev) or [Dockerfile.prod](Dockerfile.prod) (context from repo root; build copies `web/` and produces an image with Python + pre-built static).
- **Kubernetes/Helm**: The main chart in `deploy/helm/matyan` deploys the UI as a separate deployment; configure `ui.hostBase`, `ui.apiHostBase`, and optionally `ui.basePath` and auth. See the chart README for values.

The UI is deployed independently from the backend; CORS and `ui.hostBase` are configured so the backend allows requests from the UI origin.

## Maintenance and workarounds

See [MAINTENANCE.md](MAINTENANCE.md) for: security audit, outdated deps, build verification, and current workarounds (`--legacy-peer-deps`, `NODE_OPTIONS=--openssl-legacy-provider`, `GENERATE_SOURCEMAP=false`).

## Related

- **Backend**: matyan-backend serves the REST API; the UI is API-compatible with the Aim UI contract.
- **Monorepo**: This package lives under `extra/matyan-ui` in the matyan-core repo.
