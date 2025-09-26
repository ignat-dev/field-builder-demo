import type { NextConfig } from "next"

const isProductionBuild = process.env.NODE_ENV === "production"

const nextConfig: NextConfig = {
  distDir: isProductionBuild ? "dist" : undefined,
  output: isProductionBuild ? "export" : undefined,
  pageExtensions: isProductionBuild ? ["tsx"] : undefined,
  sassOptions: {
    api: "modern-compiler",
    silenceDeprecations: ["color-functions", "global-builtin", "import", "legacy-js-api"],
  },
  skipTrailingSlashRedirect: true,
}

export default nextConfig
