const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
const glob = require("glob");

// check for watcher
const watcher = process.argv.includes("--watch") ? require("./watch") : false;

// define our services files
const servicesPath = process.env.SERVICES_PATH ?? path.resolve(__dirname, "../Faker");
const servicesFiles = glob.sync("**/*.ts", {cwd: servicesPath});

// source : https://github.com/evanw/esbuild/issues/438#issuecomment-704644999
let define = {};
for (const k in process.env) {
    define[`process.env.${k}`] = JSON.stringify(process.env[k])
}

// source file path
const sourcePath = path.resolve(__dirname, "src");

(async function(){
    const buildResult = await esbuild.build({
        entryPoints: [ sourcePath + "/index.ts" ],
        outdir: path.resolve(__dirname, "../dist"),

        platform: "node",

        watch: watcher,

        plugins: [{
            name: "services-loader",
            setup(build) {
                build.onStart(() => {
                });

                build.onLoad({ filter:  /index\.ts$/}, async (args) => {
                    let content = await fs.promises.readFile(args.path, 'utf8');
                    content += "\r\n" + servicesFiles.map(file => "import \"" + servicesPath + "/" + file + "\"").join("\r\n");
                    return {
                        contents: content,
                        loader: "ts"
                    }
                });
            }
        }],

        tsconfig: path.resolve(__dirname, "tsconfig.json"),

        bundle: true,
        minify: process.env.NODE_ENV === 'production',
        sourcemap: process.env.NODE_ENV !== 'production',
        define
    });

    if(buildResult.errors.length === 0)
        console.log('\x1b[32m%s\x1b[0m', "Completed Server build");
})()
