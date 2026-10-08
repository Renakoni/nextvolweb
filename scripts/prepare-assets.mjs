// Real Android captures (MuMu instance A, 900×1600) → WebP for the site.
// Captures and the CC0 demo covers live in evidence/product/.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/images", { recursive: true });
const screens = [
  "library",
  "sources",
  "volumes",
  "book-detail",
  "directory",
  "reader-sage",
];
for (const name of screens) {
  const src = `evidence/product/captures/${name}.png`;
  await sharp(src).resize(720).webp({ quality: 84 }).toFile(`public/images/${name}.webp`);
  await sharp(src).resize(440).webp({ quality: 80 }).toFile(`public/images/${name}-440.webp`);
}
for (let i = 0; i < 4; i++) {
  await sharp(`evidence/product/fixture/cover-${i}.png`)
    .resize(480)
    .webp({ quality: 86 })
    .toFile(`public/images/cover-${i}.webp`);
}
// The header shows the icon at 32px; a 2x copy keeps it sharp without the 192px file.
await sharp("public/images/app-icon.webp").resize(64).webp({ quality: 90 }).toFile("public/images/app-icon-64.webp");
console.log("Screens and covers prepared.");
