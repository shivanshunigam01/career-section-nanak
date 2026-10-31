/**
 * Regenerate /public/model-heroes/*.jpg from src/assets/model-heroes (2560px wide, high JPEG quality).
 * Requires ffmpeg on PATH. Run: node scripts/buildModelHeroes.mjs
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "model-heroes");
const pairs = [
  { src: "vf6-hero-banner.jpg", out: "vf6-hero.jpg" },
  { src: "vf7-hero-banner.jpg", out: "vf7-hero.jpg" },
  { src: "mpv7-hero-banner.jpg", out: "mpv7-hero.jpg" },
];

fs.mkdirSync(outDir, { recursive: true });

for (const { src, out } of pairs) {
  const input = path.join(root, "src", "assets", "model-heroes", src);
  const output = path.join(outDir, out);
  if (!fs.existsSync(input)) {
    console.warn("Skip (missing):", src);
    continue;
  }
  execFileSync(
    "ffmpeg",
    ["-y", "-hide_banner", "-loglevel", "error", "-i", input, "-vf", "scale=2560:-2:flags=lanczos", "-q:v", "1", output],
    { stdio: "inherit" },
  );
  console.log("Wrote", out);
}
