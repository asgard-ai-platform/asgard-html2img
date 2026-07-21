"use client";

import { useRef, useState } from "react";
import domtoimage from "dom-to-image-more";

function proxyExternalUrls(html: string): string {
  return html.replace(
    /(https?:\/\/[^\s"')]+\.(?:jpg|jpeg|png|gif|webp|svg)(?:\?[^\s"')]*)?)/gi,
    (match) => `/api/proxy?url=${encodeURIComponent(match)}`
  );
}

async function resolveStyleImports(container: HTMLElement) {
  for (const el of container.querySelectorAll("style")) {
    const text = el.textContent || "";
    if (!text.includes("@import")) continue;
    let resolved = text;
    for (const match of text.matchAll(
      /@import\s+(?:url\()?["']([^"']+)["'](?:\))?;/g
    )) {
      try {
        const resp = await fetch(match[1]);
        resolved = resolved.replace(match[0], await resp.text());
      } catch {}
    }
    el.textContent = resolved;
  }
}

function defaultHtml() {
  return (
    '<style>@import url("https://fonts.googleapis.com/css2?family=Cactus+Classical+Serif&display=swap");@import url("https://fonts.googleapis.com/css2?family=LXGW+WenKai+Mono+TC&display=swap");</style>' +
    '<div style="width:480px;height:720px;position:relative;background-image:url(\'https://indianewengland.com/wp-content/uploads/2020/04/Satya-Nadella.jpg\');background-size:cover;background-position:center;font-family:\'Cactus Classical Serif\'">' +
    '<div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:0 16px;top:66.67%;bottom:52px">' +
    '<span style="display:inline-block;white-space:nowrap;font-family:\'LXGW WenKai Mono TC\';background:#0147a6;color:#f9f2e0;font-size:13px;font-weight:700;padding:4px 14px;border-radius:4px;letter-spacing:0.5px;align-self:flex-start;margin-bottom:12px">微軟執行長 Nadella</span>' +
    '<div style="width:100%;height:2px;background:#f9f2e0;margin-bottom:14px;flex-shrink:0"></div>' +
    '<div style="flex:1;background:rgba(128,128,128,0.35);border-radius:6px;display:flex;align-items:center;justify-content:center;padding:20px 16px;box-sizing:border-box">' +
    '<p style="color:#f9f2e0;font-size:26px;font-weight:700;margin:0;line-height:1.5;text-align:center;text-shadow:0 1px 4px rgba(0,0,0,0.6)">用別人的模型，<br>是在為智慧付兩次錢。</p>' +
    "</div></div>" +
    '<div style="position:absolute;bottom:0;left:0;right:0;text-align:center;padding:16px 0">' +
    '<span style="color:#f9f2e0;font-size:14px;font-weight:600;letter-spacing:1px">www.asgard-ai.com</span>' +
    "</div></div>"
  );
}

export default function Home() {
  const [html, setHtml] = useState(defaultHtml);
  const previewRef = useRef<HTMLDivElement>(null);
  const proxiedHtml = proxyExternalUrls(html);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    await resolveStyleImports(previewRef.current);
    await document.fonts.ready;
    const blob = await domtoimage.toBlob(previewRef.current, {
      bgColor: "#ffffff",
      scale: window.devicePixelRatio || 2,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "screenshot.png";
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-border bg-background flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <span className="text-xs text-muted-foreground tracking-wide uppercase">
            asgard rendering tool
          </span>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          <a className="flex items-center h-8 rounded-lg px-3 text-xs text-foreground bg-muted cursor-default">
            html to img
          </a>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex items-center justify-end px-5 py-2.5 border-b border-border">
          <button
            onClick={handleDownload}
            className="h-7 rounded-lg bg-primary text-primary-foreground px-3 text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Download PNG
          </button>
        </div>

        <div className="flex-1 flex gap-px">
          <div className="flex-1 flex flex-col bg-background min-w-0">
            <div className="px-5 py-3 border-b border-border">
              <span className="text-xs text-muted-foreground">html</span>
            </div>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="flex-1 w-full bg-background text-xs text-foreground p-4 font-mono resize-none outline-none"
              spellCheck={false}
            />
          </div>

          <div className="flex-1 flex flex-col bg-background min-w-0">
            <div className="px-5 py-3 border-b border-border">
              <span className="text-xs text-muted-foreground">Preview</span>
            </div>
            <div className="flex-1 flex items-center justify-center p-4 bg-[#111] overflow-auto">
              <div
                ref={previewRef}
                dangerouslySetInnerHTML={{ __html: proxiedHtml }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
