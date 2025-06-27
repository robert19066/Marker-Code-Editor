// build-preload.js
const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["preload.js"],
  outfile: "preload.js", // Overwrites original
  bundle: true,
    allowOverwrite: true,
  minify: true,
  platform: "node",
  external: ["electron"], // Don't bundle native module
}).catch(() => process.exit(1));
