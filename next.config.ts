import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const config: NextConfig = {
  poweredByHeader: false,
  async headers() {
    const indexable =
      process.env.VERCEL_ENV === "production" && Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());
    return indexable
      ? []
      : [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  pageExtensions: ["ts", "tsx", "mdx"],
};
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter"],
    rehypePlugins: [
      "rehype-slug",
      [
        "@shikijs/rehype",
        { theme: "github-dark-high-contrast", langs: ["java", "javascript", "sql", "text"] },
      ],
    ],
  },
});
export default withMDX(config);
