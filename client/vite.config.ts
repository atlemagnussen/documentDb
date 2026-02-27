import path from "node:path"
import { defineConfig } from "vite"
import { viteStaticCopy } from "vite-plugin-static-copy"

const thisFolder = path.resolve(__dirname)
const srcFolder = path.join(thisFolder, "src")
const publicFolder = path.join(thisFolder, "public")
const apiFolder = path.join(thisFolder, "api")

const outputDir = "../server/wwwroot"

export default defineConfig({
  publicDir: publicFolder,
  build: {
    outDir: outputDir,
    emptyOutDir: true,
    sourcemap: true,
    copyPublicDir: true,
    lib: {
      name: "mylib",
      formats: ["es"],
      entry: ["src/main.ts"],
      fileName: (format, entryName) => `${entryName}.js`,
      cssFileName: "site",
    },
  },
  resolve: {
    alias: {
      "@db/client": srcFolder,
      "@db/api": apiFolder
    }
  },
  plugins: viteStaticCopy({
    targets: [
      {
        src: path.resolve(srcFolder, "index.html"),
        dest: ".",
      }
    ]
  })
})