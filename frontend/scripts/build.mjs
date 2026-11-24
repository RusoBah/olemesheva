import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { build, createServer } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
const projectRoot = resolve(root, '..')
const dist = resolve(root, 'dist')
const config = { root, configFile: false, publicDir: false, plugins: [vue({ template: { transformAssetUrls: false } })] }

await build({
  ...config,
  build: { outDir: dist, manifest: true, rolldownOptions: { input: resolve(root, 'src/main.ts') } },
})

const manifest = JSON.parse(await readFile(resolve(dist, '.vite/manifest.json'), 'utf8'))
const clientEntry = '/' + manifest['src/main.ts'].file
const renderer = await createServer({
  ...config,
  plugins: [vue({ template: { transformAssetUrls: false } })],
  server: { middlewareMode: true, watch: null, ws: false },
})

try {
  const { pages, renderPage } = await renderer.ssrLoadModule('/src/entry-server.ts')
  for (const path of Object.keys(pages)) {
    const template = await readFile(resolve(root, 'templates', path), 'utf8')
    const markup = await renderPage(path)
    const output = resolve(dist, path)
    await mkdir(dirname(output), { recursive: true })
    await writeFile(output, template.replace('<!--app-->', () => markup).replace('<!--client-->', clientEntry))
  }
} finally {
  await renderer.close()
}

for (const path of ['assets', 'send.php', 'csrf.php', 'session-bootstrap.php', 'robots.txt', 'sitemap.xml']) {
  await cp(resolve(projectRoot, path), resolve(dist, path), { recursive: true })
}

await cp(resolve(root, 'src/assets/publications.css'), resolve(dist, 'assets/css/publications.css'))
await cp(resolve(root, 'hosting/.htaccess'), resolve(dist, '.htaccess'))
