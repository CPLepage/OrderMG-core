const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
const version = require(path.resolve(__dirname, "../version"));

// folder paths
const folderSource = path.resolve(__dirname, "src");
const folderOutput = path.resolve(__dirname, "../dist/webapp");

(async function(){
    const buildResult = await esbuild.build({
        entryPoints: [ folderSource + "/index.tsx" ],
        outdir: folderOutput,

        format: "esm",
        splitting: true,

        bundle: true,
        minify: process.env.NODE_ENV === 'production',
        sourcemap: process.env.NODE_ENV !== 'production',
    });

    // check for errors
    if(buildResult.errors.length > 0)
        return;

    // setup index.html file
    const versionString = version.getCurrentVersion() + "-" + version.getCurrentGITHash();
    const indexHTMLContent = fs.readFileSync(folderSource + "/index.html", {encoding: "utf-8"})
        .replace("{VERSION}", versionString);
    fs.writeFileSync(folderOutput + "/index.html", indexHTMLContent);

    console.log('\x1b[32m%s\x1b[0m', "Completed WebApp build");
})()
