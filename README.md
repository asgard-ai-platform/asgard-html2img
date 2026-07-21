# asgard-html2img

A web-based HTML-to-image rendering tool with a live preview editor and production-grade server-side screenshot pipeline powered by Cloudflare Browser Rendering.

## Features

- **Live Preview** — Edit HTML on the left, see the rendered result on the right in real time
- **Client Download** — Capture the preview as PNG directly in the browser via [dom-to-image-more](https://github.com/feathers-studio/dom-to-image-more) (SVG foreignObject-based)
- **CORS Proxy** — External images are automatically proxied to avoid CORS restrictions in the client-side download
- **Server API** — `/api/html2img` renders the HTML with a headless browser on Cloudflare's edge and returns a high‑resolution PNG
- **Google Fonts** — Automatically resolves `@import` rules by inlining `@font-face` declarations before capture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Client Capture | dom-to-image-more |
| Server Capture | Cloudflare Browser Rendering REST API |
| Deployment | Cloudflare Workers via @opennextjs/cloudflare |

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port shown in the terminal).

## Environment Variables

Required for the server screenshot API:

| Variable | Description |
|----------|-------------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `CLOUDFLARE_BROWSER_RENDERING_API_TOKEN` | API token with Browser Rendering Edit permission |

Copy `.env.example` to `.env` and fill them in. The client-side download does not require these.

## API

### `POST /api/html2img`

Renders HTML into a PNG using Cloudflare Browser Rendering.

**Body**

```json
{
  "html": "<div>…</div>",
  "width": 480,
  "height": 720,
  "deviceScaleFactor": 2
}
```

`width`, `height`, and `deviceScaleFactor` are optional. Dimensions are auto-detected from CSS when possible.

**Response** — `image/png` binary.

### `GET /api/proxy?url=…`

Proxies an external image with CORS headers. Used internally by the client-side preview.

## Deployment

```bash
# Build for Cloudflare Workers
pnpm cf:build

# Build + deploy
pnpm cf:deploy
```

The build output goes to `.open-next/`. Connect the GitHub repository via Cloudflare Dashboard → Workers & Pages → asgard-html2img → Settings → Git integration for automatic deployments on push.

## Project Structure

```
src/
  app/
    page.tsx               — Main UI (editor + preview + client download)
    api/
      html2img/route.ts    — Cloudflare Browser Rendering screenshot endpoint
      proxy/route.ts       — CORS image proxy
    globals.css            — Dark theme CSS variables
    layout.tsx             — Root layout (Inter font)
wrangler.jsonc             — Cloudflare Workers config
```
