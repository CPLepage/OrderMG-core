const path = require("path");
const glob = require("glob");
const esbuild = require("esbuild");
const fs = require("fs");
const postBuildWebApp = require("./postBuildWebApp");
const version = require(path.resolve(__dirname, "../version"));

const outdir = path.resolve(__dirname, "../dist/");
fs.rmSync(outdir, {recursive: true, force: true});

// check for watcher
const watcher = process.argv.includes("--watch") ? require("./watch")(outdir) : false;

// check for faker flag
const useFaker = process.argv.includes("--faker");

if(useFaker)
    console.log('\x1b[33m%s\x1b[0m', "Using Faker data");

// define our constants file
const constantsFile = useFaker ? path.resolve(__dirname, "../Faker/Constants.ts") :
    process.env.CONSTANTS_FILE;

const constantsDefinition = {
    'process.env.CONSTANTS_FILE' : JSON.stringify(constantsFile)
}

// define our services files
const servicesPath = useFaker ? path.resolve(__dirname, "../Faker/Services") : process.env.SERVICES_DIR;
const servicesFiles = servicesPath ? glob.sync("**/*.ts", {cwd: servicesPath}) : [];

const serverDir = path.resolve(__dirname, "../Server");
const webAppDir = path.resolve(__dirname, "../WebApp");

async function buildServer(
    filename,
    dir = null,
    preventOverrides = false,
    srcDir = null
) {
    const file = (srcDir ?? serverDir) + "/" + filename;

    const outname = filename.endsWith(".test.ts") ?
        "Tests/" + dir + "/" + filename.replace(".test.ts", "") + (preventOverrides ? ".noOverride" : "") :
        filename;

    const buildResult = await esbuild.build({
        entryPoints: [ file ],
        outfile: outdir + "/" + outname + ".js",

        platform: "node",

        watch: watcher.server,

        plugins: [{
            name: "services-loader",
            setup(build) {
                build.onLoad({ filter:  /include\.ts$/}, async (args) => {
                    if(preventOverrides)
                        return;

                    let content = await fs.promises.readFile(args.path, 'utf8');
                    content += "\r\n" + servicesFiles.map(file => "import \"" + servicesPath + "/" + file + "\"").join("\r\n");
                    return {
                        contents: content,
                        loader: "ts"
                    }
                });
            }
        }],

        bundle: true,
        minify: process.env.NODE_ENV === 'production',
        sourcemap: process.env.NODE_ENV !== 'production',
        external: ["mocha", "puppeteer", "v8-to-istanbul"],

        loader: {
            ".png": "dataurl"
        },

        define: constantsDefinition
    });

    if(buildResult.errors.length === 0)
        console.log('\x1b[32m%s\x1b[0m', "Built " + file);

    if(watcher)
        watcher.server.onRebuild(null);

    return outname;
}

async function buildWebApp(dir = ""){
    const adjustedOutDir = outdir + (dir ? "/" + dir : "");
    const webAppOutdir = adjustedOutDir + "/webapp";

    const buildResult = await esbuild.build({
        entryPoints: [ webAppDir + "/index"],
        outdir: webAppOutdir,

        format: "esm",
        splitting: true,

        watch: watcher.webapp,

        bundle: true,
        minify: process.env.NODE_ENV === 'production',
        sourcemap: process.env.NODE_ENV !== 'production',

        loader: {
            '.png': 'file'
        },

        // define our constant file
        define : constantsDefinition
    });

    // check for errors
    if(buildResult.errors.length > 0)
        return;

    // setup index.html file
    const versionString = version.getCurrentVersion() + "-" + version.getCurrentGITHash();
    const indexHTMLContent = fs.readFileSync(webAppDir + "/index.html", {encoding: "utf-8"});
    const indexHTMLContentUpdated = indexHTMLContent.replace("{VERSION}", versionString);
    fs.writeFileSync(webAppOutdir + "/index.html", indexHTMLContentUpdated);

    // copy bootstrap css
    // esbuild does not support css module import yet
    const cssFile = "bootstrap.min.css";
    const cssMapFile = "bootstrap.min.css.map";
    fs.copyFileSync(path.resolve(__dirname, "../node_modules/bootstrap/dist/css/" + cssFile), webAppOutdir + "/" + cssFile);
    fs.copyFileSync(path.resolve(__dirname, "../node_modules/bootstrap/dist/css/" + cssMapFile), webAppOutdir + "/" + cssMapFile);

    postBuildWebApp(adjustedOutDir);

    console.log('\x1b[32m%s\x1b[0m', "Built " + webAppOutdir);
}

function buildTests(){
    console.log('\x1b[33m%s\x1b[0m', "Building Tests");

    const testsFilesServer = glob.sync("**/*.test.ts", {cwd: serverDir});

    testsFilesServer.forEach(file => {
        buildServer(file, "Server");

        if(servicesFiles.length)
            buildServer(file, "Server", true);
    });

    const testFilesWebApp = glob.sync("**/*.test.ts", {cwd: webAppDir});

    testFilesWebApp.forEach(async file => {
        const outname = await buildServer(file, "WebApp", false, webAppDir);
        buildWebApp(outname.split("/").slice(0, -1).join("/"));
    })
}

buildServer("index");
buildWebApp();

// check if for testing
if(process.argv.includes("--test"))
    buildTests();
