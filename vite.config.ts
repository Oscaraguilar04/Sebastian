import { copyFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** github.com/Oscaraguilar04/Sebastian */
const REPO_NAME = "Sebastian";

function githubPagesBase() {
  const fromEnv = process.env.BASE_PATH;
  if (fromEnv) {
    return fromEnv.endsWith("/") ? fromEnv : `${fromEnv}/`;
  }

  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? REPO_NAME;
  if (repo.endsWith(".github.io")) return "/";
  return `/${repo}/`;
}

const base = githubPagesBase();

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
  base,
  publicDir: "static",
  server: {
    open: base,
  },
  preview: {
    open: base,
  },
});
