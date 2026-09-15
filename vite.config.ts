import { copyFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const DEFAULT_REPO = "sebastian-alvarez";

function githubPagesBase() {
  const fromEnv = process.env.BASE_PATH;
  if (fromEnv) {
    return fromEnv.endsWith("/") ? fromEnv : `${fromEnv}/`;
  }

  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? DEFAULT_REPO;
  if (repo.endsWith(".github.io")) return "/";
  return `/${repo}/`;
}

const base = githubPagesBase();

function githubPagesSupport(basePath: string): Plugin {
  return {
    name: "github-pages-support",
    transform(code, id) {
      if (!id.includes(".css")) return;
      return code.replaceAll('url("/', `url("${basePath}`);
    },
    closeBundle() {
      const dist = resolve(process.cwd(), "dist");
      copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));
      writeFileSync(resolve(dist, ".nojekyll"), "");
    },
  };
}

export default defineConfig({
  plugins: [react(), githubPagesSupport(base)],
  base,
  // Serve from ./static so asset URLs stay lowercase. The workspace Public/
  // folder is an OneDrive reparse point whose Images directory is case-sensitive in Vite.
  publicDir: "static",
  server: {
    open: base,
  },
  preview: {
    open: base,
  },
});
