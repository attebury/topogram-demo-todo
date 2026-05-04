import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
  preprocess: vitePreprocess(),
  kit: {
    files: {
      assets: "static"
    }
  }
};

export default config;
