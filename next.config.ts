import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence the build warning about the stray lockfile outside the repo:
  // pin Turbopack's workspace root to this project (== cwd at build time).
  turbopack: {
    root: process.cwd(),
  },

  // No version disclosure in responses.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // No embeds, no clickjacking surface: nothing here is framed.
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Deliberately no HSTS: Vercel already sends its own
          // `strict-transport-security` on deployments; a second value here
          // would only duplicate it.
          // Deliberately no CSP yet: the no-FOUC theme script is inline by
          // design (it must run before paint) and analytics inject scripts,
          // so a strict policy needs a nonce strategy first. Revisit with
          // one — a half-policy is worse than none.
        ],
      },
    ];
  },
};

export default nextConfig;
