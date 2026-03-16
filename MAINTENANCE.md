# Matyan UI – maintenance checklist

Use this when the UI has been untouched for a while or before a release.

## 1. Security audit

From the repo root:

```bash
cd extra/matyan-ui/web
npm ci --legacy-peer-deps
npm run audit
```

- If there are **high/critical** issues: fix or upgrade the affected deps, then re-run `npm run audit`.
- `npm run audit:fix` can apply safe fixes; review changes and re-run tests/build afterward.

## 2. Check outdated dependencies

```bash
cd extra/matyan-ui/web
npm outdated
```

- Prefer updating **patch/minor** first and re-running tests and a production build.
- **Major** upgrades (e.g. React 18, replacing react-scripts) need broader testing and may require code changes.

## 3. Verify build and runtime

- **Local:** `npm run build` (with `NODE_OPTIONS=--openssl-legacy-provider` if on Node 17+).
- **Docker:** Build the UI image (prod or dev Dockerfile) and smoke-test the app in the browser.

## 4. Current workarounds (why they exist)

- **`--legacy-peer-deps`** in Dockerfiles: some deps (e.g. react-virtualized) declare peer ranges that don’t include React 17; the app runs fine, so we use legacy resolution.
- **`NODE_OPTIONS=--openssl-legacy-provider`** in Dockerfiles: Node 17+ / OpenSSL 3.0 removed algorithms that Webpack 4 (react-scripts 4) uses for hashing.
- **`GENERATE_SOURCEMAP=false`** in Dockerfiles: disables source maps to speed up the image build and reduce size.

If you upgrade away from react-scripts 4 (e.g. to Vite or CRA5), you can re-evaluate dropping these.
