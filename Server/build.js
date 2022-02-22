const esbuild = require("esbuild");
const path = require("path");

(async function(){
    const buildResult = await esbuild.build({
        entryPoints: [ path.resolve(__dirname, "src/index.ts") ],
        outdir: path.resolve(__dirname, "../dist"),

        platform: "node",

        bundle: true,
        minify: process.env.NODE_ENV === 'production',
        sourcemap: process.env.NODE_ENV !== 'production',
    });

    if(buildResult.errors.length === 0)
        console.log('\x1b[32m%s\x1b[0m', "Completed Server build");
})()
