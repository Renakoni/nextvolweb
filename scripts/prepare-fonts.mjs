// Self-hosts the three faces as WOFF2 subsets cut from Google Fonts.
// Rerun after changing any visible Chinese copy: `node scripts/prepare-fonts.mjs`.
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
};
const cjk = /[—‘-”…　-〿㐀-鿿＀-￯]/g;
const unique = (text) => [...new Set(text.match(cjk) ?? [])].join("");

const paths = (await readdir("src", { recursive: true })).filter((p) =>
  /\.(astro|ts)$/.test(p),
);
const sources = (
  await Promise.all(paths.map((p) => readFile(`src/${p}`, "utf8")))
).join("");

// Vertical title logos are the only text set in the serif face.
const site = await readFile("src/data/site.ts", "utf8");
const titles = [...site.matchAll(/title:\s*\[([^\]]*)\]/g)]
  .map((m) => m[1])
  .join("");

// Latin runs are product names, versions and file names: printable ASCII is enough.
const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join("") + "·–→↓×";

const faces = [
  ["archivo-latin", "Archivo:wdth,wght@72..115,500..900", ascii],
  ["noto-sans-sc", "Noto Sans SC:wght@400..900", unique(sources)],
  ["noto-serif-sc-title", "Noto Serif SC:wght@900", unique(titles) + "，。、"],
];

await mkdir("public/fonts", { recursive: true });
for (const [name, family, text] of faces) {
  const query = `family=${family.replace(/ /g, "+")}&display=swap${text ? "&text=" + encodeURIComponent(text) : ""}`;
  const css = await fetch(`https://fonts.googleapis.com/css2?${query}`, {
    headers,
  }).then((r) => r.text());
  const asset = [...css.matchAll(/url\((.*?)\)/g)].at(-1)?.[1];
  if (!asset) throw new Error(`${name}: ${css.slice(0, 300)}`);
  const response = await fetch(asset);
  if (!response.ok) throw new Error(`${name}: download failed`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(`public/fonts/${name}.woff2`, bytes);
  console.log(name, bytes.length, "bytes", `${[...text].length} glyphs`);
}

await mkdir("public/licenses", { recursive: true });
const licenses = [];
for (const [name, family] of [
  ["archivo", "Archivo"],
  ["notosanssc", "Noto Sans SC"],
  ["notoserifsc", "Noto Serif SC"],
]) {
  const response = await fetch(
    `https://raw.githubusercontent.com/google/fonts/main/ofl/${name}/OFL.txt`,
  );
  if (!response.ok) throw new Error(`${name}: license unavailable`);
  const text = await response.text();
  await writeFile(`public/licenses/${name}-OFL.txt`, text);
  licenses.push(`${family}\n${"=".repeat(family.length)}\n\n${text.trim()}\n`);
}
// One page for the footer link: every shipped face and its licence.
await writeFile("public/licenses/fonts-OFL.txt", licenses.join("\n\n"));
