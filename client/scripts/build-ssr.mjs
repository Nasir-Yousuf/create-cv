import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientRoot = path.resolve(__dirname, '..');
const generatedDir = path.resolve(clientRoot, '../server/src/generated');
const distAssetsDir = path.resolve(clientRoot, 'dist/assets');

async function buildSSR() {
  fs.mkdirSync(generatedDir, { recursive: true });

  await build({
    configFile: false,
    root: clientRoot,
    publicDir: false,
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(clientRoot, 'src'),
        '@shared': path.resolve(clientRoot, '../shared'),
      },
    },
    ssr: {
      // Bundle React/Redux/lucide/shared cleanly so Vercel/server runs standalone without client/node_modules
      noExternal: true,
    },
    build: {
      ssr: path.resolve(clientRoot, 'src/templates/ssrEntry.jsx'),
      outDir: generatedDir,
      emptyOutDir: false,
      minify: true,
      rollupOptions: {
        output: {
          format: 'cjs',
          exports: 'named',
          entryFileNames: 'renderTemplateSSR.cjs',
        },
      },
    },
    logLevel: 'warn',
  });

  // Sync compiled Tailwind + custom CSS bundle into server/src/generated/styles.css
  if (fs.existsSync(distAssetsDir)) {
    const cssFiles = fs
      .readdirSync(distAssetsDir)
      .filter((name) => name.endsWith('.css'))
      .sort();

    if (cssFiles.length > 0) {
      const combinedCss = cssFiles
        .map((file) => fs.readFileSync(path.join(distAssetsDir, file), 'utf8'))
        .join('\n');
      fs.writeFileSync(path.join(generatedDir, 'styles.css'), combinedCss, 'utf8');
      console.log(`Synced ${cssFiles.join(', ')} -> server/src/generated/styles.css (${combinedCss.length} bytes)`);
    }
  } else {
    console.warn('Notice: client/dist/assets not found yet; run `vite build` first to populate styles.css');
  }
}

buildSSR().catch((err) => {
  console.error('SSR template build failed:', err);
  process.exit(1);
});
