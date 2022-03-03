const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
const version = require(path.resolve(__dirname, "../version"));

const watcher = process.argv.includes("--watch") ? require("./watch") : false;

// define our constant file
const constantsFile = process.env.CONSTANT_PATH ?? path.resolve(__dirname, "../Faker/FakerConstants.ts");

// folder paths
const folderSource = path.resolve(__dirname, "src");
const folderOutput = path.resolve(__dirname, "../dist/webapp");

(async function(){
    const buildResult = await esbuild.build({
        entryPoints: [ folderSource + "/index.tsx"],
        outdir: folderOutput,

        format: "esm",
        splitting: true,

        watch: watcher,

        bundle: true,
        minify: process.env.NODE_ENV === 'production',
        sourcemap: process.env.NODE_ENV !== 'production',

        plugins: [{
            name: "constants-override",
            setup(build) {
                build.onLoad({ filter:  /constants\.ts$/}, async (args) => {
                    let content = await fs.promises.readFile(args.path, 'utf8');
                    content += "\r\n" + "(async () => (await import(\"" + constantsFile + "\")))()";
                    return {
                        contents: content,
                        loader: "ts"
                    }
                });
            }
        }],
    });

    // check for errors
    if(buildResult.errors.length > 0)
        return;

    // setup index.html file
    const versionString = version.getCurrentVersion() + "-" + version.getCurrentGITHash();
    const indexHTMLContent = fs.readFileSync(folderSource + "/index.html", {encoding: "utf-8"});
    const indexHTMLContentUpdated = indexHTMLContent.replace("{VERSION}", versionString);
    fs.writeFileSync(folderOutput + "/index.html", indexHTMLContentUpdated);

    console.log('\x1b[32m%s\x1b[0m', "Completed WebApp build");
})()
