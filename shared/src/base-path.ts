/**
 * Префікс шляху для деплою в підпапку (GitHub Pages: /landing-igor/jcb).
 * Задається змінною NEXT_PUBLIC_BASE_PATH під час білду; локально — порожній.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Додає basePath до абсолютних шляхів на файли з /public */
export function withBase(path: string): string {
  return path.startsWith("/") && !path.startsWith("//") ? `${BASE_PATH}${path}` : path;
}
