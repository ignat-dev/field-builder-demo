import { execSync } from "node:child_process"
import { createHash } from "node:crypto"
import { existsSync } from "node:fs"
import { readdir, readFile, rename, writeFile, mkdir, unlink } from "node:fs/promises"
import { resolve, basename, join } from "node:path"

const themesDir = resolve(import.meta.dirname, "../styles/themes")
const publicDir = resolve(import.meta.dirname, "../../public/themes")
const themesJsonPath = resolve(import.meta.dirname, "../../public/themes.json")

// Remove old files before building new ones.
if (existsSync(publicDir)) {
  const oldFiles = await readdir(publicDir)

  await Promise.all(oldFiles.map((x) => unlink(join(publicDir, x))))
} else {
  await mkdir(publicDir, { recursive: true })
}

const themeFiles = (await readdir(themesDir)).filter(f => f.endsWith(".scss"))
const themesJson = {}

for (const file of themeFiles) {
  const themeName = basename(file, ".scss")
  const srcPath = join(themesDir, file)
  const tmpPath = join(publicDir, `${themeName}.css`)

  // Build SCSS to CSS (requires sass installed).
  execSync(`npx sass --load-path=node_modules ${srcPath} ${tmpPath}`)

  // Read CSS and generate hash.
  const cssContent = await readFile(tmpPath)
  const hash = createHash("md5").update(cssContent).digest("hex").slice(0, 8)
  const outFile = `${themeName}.${hash}.css`
  const outPath = join(publicDir, outFile)

  // Rename file to include hash.
  await rename(tmpPath, outPath)

  themesJson[themeName] = `/themes/${outFile}`
}

await writeFile(themesJsonPath, JSON.stringify(themesJson, null, 2))

console.log("Themes built:", themesJson)
