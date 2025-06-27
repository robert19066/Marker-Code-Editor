const { minify } = require("html-minifier-terser");
const fs = require("fs");

async function minifyHTML() {
  const input = fs.readFileSync("index.html", "utf8");
  const output = await minify(input, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    minifyCSS: true,
    minifyJS: true,
  });
  fs.writeFileSync("index.html", output);
}

minifyHTML();
