import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const appDirectory = path.resolve(".next/server/app");
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? walk(path.join(directory, entry.name))
          : [path.join(directory, entry.name)],
      ),
    )
  ).flat();
}
const limits = { javascriptGzipBytes: 180 * 1024, cssGzipBytes: 20 * 1024 };
const results = [];
for (const filename of (await walk(appDirectory)).filter(
  (name) =>
    name.endsWith(".html") &&
    !path
      .relative(appDirectory, name)
      .split(path.sep)
      .some((segment) => segment.startsWith("_")),
)) {
  const html = await readFile(filename, "utf8");
  const assets = [
    ...new Set(
      [
        ...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"?#]+\.(?:js|css))(?:[?#][^"]*)?"/g),
      ].map((match) => match[1]),
    ),
  ];
  let javascriptGzipBytes = 0;
  let cssGzipBytes = 0;
  for (const asset of assets) {
    const bytes = gzipSync(
      await readFile(path.join(".next", decodeURIComponent(asset).replace("/_next/", ""))),
    ).byteLength;
    if (asset.endsWith(".js")) javascriptGzipBytes += bytes;
    else cssGzipBytes += bytes;
  }
  if (!assets.some((asset) => asset.endsWith(".js")))
    throw new Error(`No script assets detected for ${filename}; update the bundle parser`);
  const route = path
    .relative(appDirectory, filename)
    .replace(/index\.html$/, "")
    .replace(/\.html$/, "");
  results.push({ route: `/${route}`, javascriptGzipBytes, cssGzipBytes, assets: assets.length });
}
if (results.length === 0) throw new Error("No built HTML found; run npm run build first");
await mkdir("test-results/quality", { recursive: true });
await writeFile(
  "test-results/quality/bundles.json",
  JSON.stringify({ limits, routes: results }, null, 2),
);
for (const result of results) {
  console.log(
    `${result.route}: JS ${(result.javascriptGzipBytes / 1024).toFixed(1)} KiB gzip, CSS ${(result.cssGzipBytes / 1024).toFixed(1)} KiB gzip`,
  );
}
if (
  results.some(
    (result) =>
      result.javascriptGzipBytes > limits.javascriptGzipBytes ||
      result.cssGzipBytes > limits.cssGzipBytes,
  )
) {
  throw new Error("Client asset budget exceeded; see test-results/quality/bundles.json");
}
