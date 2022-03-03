const path = require("path");
const glob = require("glob");
const esbuild = require("esbuild");
const fs = require("fs");
const version = require(path.resolve(__dirname, "../version"));

// check for watcher
const watcher = process.argv.includes("--watch") ? require("./watch") : false;

// check for faker flag
const useFaker = process.argv.includes("--faker");
// define our constants file
const constantsFile = useFaker ? path.resolve(__dirname, "../Faker/FakerConstants.ts") :
    process.env.CONSTANTS_FILE;
// define our services files
const servicesPath = useFaker ? path.resolve(__dirname, "../Faker/FakerServices") : process.env.SERVICES_PATH;
const servicesFiles = servicesPath ? glob.sync("**/*.ts", {cwd: servicesPath}) : [];


async function buildServer(){
    const serverPath = path.resolve(__dirname, "../Server");
    const sourcePath = serverPath + "/src";

    const buildResult = await esbuild.build({
        entryPoints: [ sourcePath + "/index.ts" ],
        outdir: path.resolve(__dirname, "../dist"),

        platform: "node",

        watch: watcher.server,

        plugins: [{
            name: "services-loader",
            setup(build) {
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

        tsconfig: serverPath + "/tsconfig.json",

        bundle: true,
        minify: process.env.NODE_ENV === 'production',
        sourcemap: process.env.NODE_ENV !== 'production',
        define: {
            'process.env.CONSTANTS_FILE' : JSON.stringify(constantsFile)
        }
    });

    if(buildResult.errors.length === 0)
        console.log('\x1b[32m%s\x1b[0m', "Completed Server build");
}

async function buildWebApp(){
    const webAppPath = path.resolve(__dirname, "../WebApp");
    const sourcePath = webAppPath + "/src";
    const outDir = path.resolve(__dirname, "../dist/webapp");

    const buildResult = await esbuild.build({
        entryPoints: [ sourcePath + "/index.tsx"],
        outdir: outDir,

        format: "esm",
        splitting: true,

        watch: watcher.webapp,

        bundle: true,
        minify: process.env.NODE_ENV === 'production',
        sourcemap: process.env.NODE_ENV !== 'production',

        tsconfig: webAppPath + "/tsconfig.json",

        // define our constant file
        define : {
            'process.env.CONSTANTS_FILE' : JSON.stringify(constantsFile)
        }
    });

    // check for errors
    if(buildResult.errors.length > 0)
        return;

    // setup index.html file
    const versionString = version.getCurrentVersion() + "-" + version.getCurrentGITHash();
    const indexHTMLContent = fs.readFileSync(sourcePath + "/index.html", {encoding: "utf-8"});
    const indexHTMLContentUpdated = indexHTMLContent.replace("{VERSION}", versionString);
    fs.writeFileSync(outDir + "/index.html", indexHTMLContentUpdated);

    console.log('\x1b[32m%s\x1b[0m', "Completed WebApp build");
}

buildServer();
buildWebApp();
