import { readdir, readFile, rename, writeFile, mkdir, unlink } from "node:fs/promises"
import { existsSync } from "node:fs"
import { resolve, basename, join } from "node:path"
import { execSync } from "node:child_process"
import { createHash } from "node:crypto"

const themesDir = resolve(import.meta.dirname, "../styles/themes")
const publicDir = resolve(import.meta.dirname, "../../public/themes")
const themesJsonPath = resolve(import.meta.dirname, "../../public/themes.json")

// Clean outDir before generating new files
if (existsSync(publicDir)) {
  const oldFiles = await readdir(publicDir)

  for (const file of oldFiles) {
    await unlink(join(publicDir, file))
  }
} else {
  await mkdir(publicDir, { recursive: true })
}

const themeFiles = (await readdir(themesDir)).filter(f => f.endsWith(".scss"))
const themeMap = {}

for (const file of themeFiles) {
  const themeName = basename(file, ".scss")
  const srcPath = join(themesDir, file)
  const tempOutPath = join(publicDir, `${themeName}.css`)

  // Build SCSS to CSS (requires sass installed)
  execSync(`npx sass --load-path=node_modules ${srcPath} ${tempOutPath}`)

  // Read CSS and generate hash
  const cssContent = await readFile(tempOutPath)
  const hash = createHash("md5").update(cssContent).digest("hex").slice(0, 8)
  const outFileName = `${themeName}.${hash}.css`
  const outPath = join(publicDir, outFileName)

  // Rename file to include hash
  await rename(tempOutPath, outPath)

  themeMap[themeName] = `/themes/${outFileName}`
}

await writeFile(themesJsonPath, JSON.stringify(themeMap, null, 2))
console.log("Themes built:", themeMap)
