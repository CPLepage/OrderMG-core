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

async function buildServer(
    filename,
    preventOverrides = false
) {
    const serverPath = path.resolve(__dirname, "../Server");

    const outname = filename + (preventOverrides ? ".noOverride" : "")

    const buildResult = await esbuild.build({
        entryPoints: [ serverPath + "/" + filename + ".ts" ],
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
        external: ["mocha"],

        loader: {
            ".png": "dataurl"
        },

        define: constantsDefinition
    });

    if(buildResult.errors.length === 0)
        console.log('\x1b[32m%s\x1b[0m', "Completed " + (filename === "index" ? "Server" : outname) + " build");

    if(watcher)
        watcher.server.onRebuild(null);
}

async function buildWebApp(){
    const webAppPath = path.resolve(__dirname, "../WebApp");
    const webAppOutdir = outdir + "/webapp";

    const buildResult = await esbuild.build({
        entryPoints: [ webAppPath + "/index.tsx"],
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
    const indexHTMLContent = fs.readFileSync(webAppPath + "/index.html", {encoding: "utf-8"});
    const indexHTMLContentUpdated = indexHTMLContent.replace("{VERSION}", versionString);
    fs.writeFileSync(webAppOutdir + "/index.html", indexHTMLContentUpdated);

    // copy bootstrap css
    // esbuild does not support css module import yet
    const cssFile = "bootstrap.min.css";
    const cssMapFile = "bootstrap.min.css.map";
    fs.copyFileSync(path.resolve(__dirname, "../node_modules/bootstrap/dist/css/" + cssFile), webAppOutdir + "/" + cssFile);
    fs.copyFileSync(path.resolve(__dirname, "../node_modules/bootstrap/dist/css/" + cssMapFile), webAppOutdir + "/" + cssMapFile);

    postBuildWebApp(outdir);

    console.log('\x1b[32m%s\x1b[0m', "Completed WebApp build");
}


buildServer("index");

// check if for testing
const withTests = process.argv.includes("--test");

if(withTests)
    console.log('\x1b[33m%s\x1b[0m', "Building Tests");

if(withTests){
    const testsPath =  path.resolve(__dirname, "../Server/src/Tests");
    const testsFiles = glob.sync("**/*.ts", {cwd: testsPath});

    testsFiles.forEach(file => {
        buildServer("Tests/" + file.slice(0, -3));

        if(servicesFiles.length)
            buildServer("Tests/" + file.slice(0, -3), true);
    });
}



buildWebApp();
