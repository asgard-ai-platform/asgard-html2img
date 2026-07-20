import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;

import("next").then(({ default: next }) => {
  if (process.env.NODE_ENV === "development") {
    import("@opennextjs/cloudflare").then(m => m.initOpenNextCloudflareForDev());
  }
});
