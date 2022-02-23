const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

const serviceLoaderPath = path.resolve(__dirname, "src/servicesLoader.ts");
const servicesPath = process.env.SERVICES_PATH ?? path.resolve(__dirname, "../Faker");
const files = fs.readdirSync(servicesPath);

let define = {};
for (const k in process.env) {
    define[`process.env.${k}`] = JSON.stringify(process.env[k])
}

(async function(){
    const buildResult = await esbuild.build({
        entryPoints: [ path.resolve(__dirname, "src/index.ts") ],
        outdir: path.resolve(__dirname, "../dist"),

        platform: "node",

        plugins: [{
            name: "services-loader",
            setup(build) {
                build.onStart(() => {
                    fs.writeFileSync(serviceLoaderPath, files.map(file => "import \"" + servicesPath + "/" + file + "\"").join("\r\n"));
                });
                build.onEnd(() => {
                    fs.writeFileSync(serviceLoaderPath, "");
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
