import { copyFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function githubPagesSupport(): Plugin {
  return {
    name: "github-pages-support",
    closeBundle() {
      const dist = resolve(process.cwd(), "dist");
      copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));
      writeFileSync(resolve(dist, ".nojekyll"), "");
    },
  };
}

export default defineConfig({
  plugins: [react(), githubPagesSupport()],
  base: "/Sebastian/",
  publicDir: "static",
  server: {
    open: "/Sebastian/",
  },
  preview: {
    open: "/Sebastian/",
  },
});
