const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
const glob = require("glob");

// check for watcher
const watcher = process.argv.includes("--watch") ? require("./watch") : false;

// define our services files
const serviceLoaderPath = path.resolve(__dirname, "src/servicesLoader.ts");
const servicesPath = process.env.SERVICES_PATH ?? path.resolve(__dirname, "../Faker");
const servicesFiles = glob.sync("**/*.ts", {cwd: servicesPath});

// source : https://github.com/evanw/esbuild/issues/438#issuecomment-704644999
let define = {};
for (const k in process.env) {
    define[`process.env.${k}`] = JSON.stringify(process.env[k])
}

// source file path
const sourcePath = path.resolve(__dirname, "src");

// methods to be overridden
const overrideableMethods = [];
let overrideableMethodsRegex;

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
                    // scan declarations
                    const declarations = fs.readFileSync(path.resolve(__dirname, "d.ts"), {encoding: "utf-8"});
                    const declaredMethods = declarations.match(/declare function.*;/g);

                    declaredMethods.forEach(declaration => {
                        if(!declaration)
                            return;

                        let methodName = declaration.match(/function.*\(/g);

                        if(!methodName)
                            return console.error("wrong method name declaration");

                        methodName = methodName[0];
                        methodName = methodName.substring(8, methodName.length - 1).trim();

                        overrideableMethods.push(methodName);
                    });

                    overrideableMethodsRegex = new RegExp(`@overrideable.*(\r?\n).*(${overrideableMethods.join("|")})\\(((.|\\r?\\n)*?)\\)`,"g");
                    // overrideableMethodsRegex = new RegExp(`(?<!global\.)(await\\s*)?(${overrideableMethods.join("|")})\\(((.|\\r?\\n)*?)\\)`,"g");
                });

                build.onLoad({ filter:  /\.ts$/}, async (args) => {
                    // replace overridable methods with ternary check
                    let content = await fs.promises.readFile(args.path, 'utf8');

                    if(args.path.endsWith("/src/index.ts"))
                        content += "\r\n" + servicesFiles.map(file => "import \"" + servicesPath + "/" + file + "\"").join("\r\n")

                    return {
                        contents: content.replace(overrideableMethodsRegex, (methodToOverride) => {
                            const regex = new RegExp(`(await\\s*)?(${overrideableMethods.join("|")})\\(((.|\\r?\\n)*?)\\)`,"g");

                            return methodToOverride.replace(regex, (methodCall) => {
                                return `(typeof ${methodCall.match(/\w*\(/g)[0].slice(0,-1)} === 'undefined' ? null : ${methodCall})`
                            });
                        }),
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
