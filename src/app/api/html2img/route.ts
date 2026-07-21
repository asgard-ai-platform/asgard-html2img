import { NextRequest, NextResponse } from "next/server";

function extractDimensions(html: string): {
  width: number;
  height: number;
} | null {
  const m = html.match(/width:(\d+)px;height:(\d+)px/);
  return m ? { width: parseInt(m[1]), height: parseInt(m[2]) } : null;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { html, width, height, deviceScaleFactor = 2 } = body;

  if (!html || typeof html !== "string") {
    return NextResponse.json({ error: "html is required" }, { status: 400 });
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_BROWSER_RENDERING_API_TOKEN;

  if (!accountId || !apiToken) {
    return NextResponse.json(
      { error: "Cloudflare credentials not configured" },
      { status: 500 }
    );
  }

  const dims = extractDimensions(html);
  const vw = typeof width === "number" ? width : dims?.width ?? 1200;
  const vh = typeof height === "number" ? height : dims?.height ?? 800;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/browser-rendering/screenshot`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html,
          viewport: {
            width: vw,
            height: vh,
            deviceScaleFactor,
          },
          gotoOptions: {
            waitUntil: "networkidle0",
          },
          addStyleTag: [
            {
              content:
                "html,body{margin:0;padding:0}*,*::before,*::after{box-sizing:border-box}",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer();
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="screenshot.png"',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
