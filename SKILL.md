# asgard-html2img API

Convert HTML to a high-resolution PNG via Cloudflare Browser Rendering.

## Endpoint

```
POST https://asgard-html2img.jjchen.workers.dev/api/html2img
```

## Request Body (JSON)

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `html` | `string` | yes | — | The HTML content to render. Supports `<style>`, `<link>`, Google Fonts `@import`, external images, etc. |
| `width` | `number` | no | auto-detected | Viewport width in CSS pixels. When omitted, the API parses the first `width:XXXpx` in the HTML. Falls back to `1200`. |
| `height` | `number` | no | auto-detected | Viewport height in CSS pixels. When omitted, the API parses the first `height:XXXpx` in the HTML. Falls back to `800`. |
| `deviceScaleFactor` | `number` | no | `2` | Pixel ratio. `2` produces a Retina-quality image (e.g. 480×720 CSS → 960×1440 px). Set to `1` for 1:1 output. |

## Response

- **Content-Type:** `image/png`
- **Body:** Raw PNG binary

On error, returns `{ "error": "..." }` with an appropriate HTTP status.

## Usage

### With explicit dimensions and 1x resolution

```bash
curl -s -o output.png \
  -X POST https://asgard-html2img.jjchen.workers.dev/api/html2img \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<div style=\"width:400px;height:300px;background:linear-gradient(135deg,#667eea,#764ba2)\"></div>",
    "width": 400,
    "height": 300,
    "deviceScaleFactor": 1
  }'
```

### Full HTML with Google Fonts and external image

```bash
curl -s -o output.png \
  -X POST https://asgard-html2img.jjchen.workers.dev/api/html2img \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<style>@import url(\"https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap\");</style><div style=\"width:600px;height:400px;background:url('https://picsum.photos/600/400');background-size:cover;display:flex;align-items:center;justify-content:center;font-family:Inter\"><h1 style=\"color:white;text-shadow:0 2px 8px rgba(0,0,0,0.6)\">Hello from asgard</h1></div>",
    "deviceScaleFactor": 2
  }'
```

## Notes

- `@import` rules in `<style>` tags are automatically resolved server-side — you don't need to inline Google Fonts CSS manually.
- External images are fetched directly by Cloudflare's headless browser; no CORS proxy is needed.
- The `width`/`height` auto-detection looks for the pattern `width:(\d+)px;height:(\d+)px` in the HTML string. Specify them explicitly when auto-detection might match the wrong element.
- The output image dimensions are `width × height × deviceScaleFactor` (e.g. 480 × 720 × 2 = 960 × 1440).
