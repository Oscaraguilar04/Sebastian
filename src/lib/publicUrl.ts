/** Prefix a public-folder path with Vite's repository base. */
export function publicUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
