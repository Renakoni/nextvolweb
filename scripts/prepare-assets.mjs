// Real Android captures → WebP plates for the site.
// Emulator captures (MuMu instance A) are 900×1600. Phone captures are stored
// at 1200 wide without the system status bar and cut to the same 9:16 plate.
// Captures and the CC0 demo covers live in evidence/product/.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/images", { recursive: true });
const screens = [
  { name: "library" },
  { name: "sources" },
  { name: "volumes" },
  { name: "reader-sage" },
  // immersive reading while it plays: the player chip and the sentence being read
  { name: "listen", crop: { left: 0, top: 150, width: 1200, height: 2133 } },
  // the voice list, from its title down to the key-only sources
  { name: "voices", crop: { left: 0, top: 0, width: 1200, height: 2133 } },
];
for (const { name, crop } of screens) {
  const source = sharp(`evidence/product/captures/${name}.png`);
  const plate = await (crop ? source.extract(crop) : source).toBuffer();
  // smart subsampling keeps text edges crisp at a lower quality setting
  const webp = (quality) => ({ quality, effort: 6, smartSubsample: true });
  await sharp(plate).resize(720).webp(webp(76)).toFile(`public/images/${name}.webp`);
  await sharp(plate).resize(440).webp(webp(72)).toFile(`public/images/${name}-440.webp`);
}
for (let i = 0; i < 4; i++) {
  await sharp(`evidence/product/fixture/cover-${i}.png`)
    .resize(480)
    .webp({ quality: 84, effort: 6 })
    .toFile(`public/images/cover-${i}.webp`);
}
// The header shows the icon at 32px; a 2x copy keeps it sharp without the 192px file.
await sharp("public/images/app-icon.webp").resize(64).webp({ quality: 90, effort: 6 }).toFile("public/images/app-icon-64.webp");
console.log("Screens and covers prepared.");
