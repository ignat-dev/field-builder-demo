import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  sassOptions: {
    api: "modern-compiler",
    silenceDeprecations: ["color-functions", "global-builtin", "import", "legacy-js-api"],
  },
}

export default nextConfig
