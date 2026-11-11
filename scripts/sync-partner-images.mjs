// Копіює фото техніки сайту-партнера в public/images/partner/ поточного сайту перед dev/build.
// Так блок «Техніка <партнер>» не залежить від DNS/доступності іншого домену.
// usage: node ../scripts/sync-partner-images.mjs <bobcat|jcb>   (запускається з папки сайту)
import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const site = process.argv[2];
const partner = { bobcat: "jcb", jcb: "bobcat" }[site];
if (!partner) throw new Error(`невідомий сайт: ${site}`);

const src = join(root, partner, "public", "images", "products");
const dst = join(root, site, "public", "images", "partner");
rmSync(dst, { recursive: true, force: true });
mkdirSync(dst, { recursive: true });
let n = 0;
for (const f of readdirSync(src)) {
  if (!/\.(webp|png|jpe?g|avif)$/i.test(f)) continue;
  cpSync(join(src, f), join(dst, f));
  n++;
}
console.log(`[partner-images] ${partner} → ${site}: ${n} фото`);
