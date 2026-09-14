import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  // Serve from ./static so asset URLs stay lowercase. The workspace Public/
  // folder is an OneDrive reparse point whose Images directory is case-sensitive in Vite.
  publicDir: "static",
});
