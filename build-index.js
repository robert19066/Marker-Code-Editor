// build-main.js
const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["./src/index.js"],
  outfile: "./src/index.js", // Overwrites original
  bundle: true,
  allowOverwrite: true,
  minify: true,
  platform: "node",
  external: ["electron", "@google/genai"], // Don't bundle native/electron deps
}).catch(() => process.exit(1));
