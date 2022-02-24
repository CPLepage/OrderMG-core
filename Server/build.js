const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
const glob = require("glob");

const serviceLoaderPath = path.resolve(__dirname, "src/servicesLoader.ts");
const servicesPath = process.env.SERVICES_PATH ?? path.resolve(__dirname, "../Faker");
const servicesFiles = glob.sync("**/*.ts", {cwd: servicesPath});

let define = {};
for (const k in process.env) {
    define[`process.env.${k}`] = JSON.stringify(process.env[k])
}

const sourcePath = path.resolve(__dirname, "src");

const overrideableMethods = [];
let overrideableMethodsRegex;

(async function(){
    const buildResult = await esbuild.build({
        entryPoints: [ sourcePath + "/index.ts" ],
        outdir: path.resolve(__dirname, "../dist"),

        platform: "node",

        plugins: [{
            name: "services-loader",
            setup(build) {
                build.onStart(() => {
                    const declarations = fs.readFileSync(path.resolve(__dirname, "d.ts"), {encoding: "utf-8"});
                    const declaredMethods = declarations.split(/\r?\n/);

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

                    overrideableMethodsRegex = new RegExp(`(?<!global\.)(await\\s*)?(${overrideableMethods.join("|")})\\(((.|\\r?\\n)*?)\\)`,"g");

                    fs.writeFileSync(serviceLoaderPath, servicesFiles.map(file => "import \"" + servicesPath + "/" + file + "\"").join("\r\n"));
                });

                build.onLoad({ filter:  /\.ts$/}, async (args) => {
                    const content = await fs.promises.readFile(args.path, 'utf8');
                    return {
                        contents: content.replace(overrideableMethodsRegex, (methodToOverride) => {
                            return `typeof ${methodToOverride.match(/\w*\(/g)[0].slice(0,-1)} === 'undefined' ? null : ${methodToOverride}`;
                        }),
                        loader: "ts"
                    }
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
