import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  integrations: [svelte(), tailwind()],
  vite: {
    ssr: {
      noExternal: ['fast-glob']
    }
  }
});