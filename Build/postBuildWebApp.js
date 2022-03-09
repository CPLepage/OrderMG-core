const fs = require("fs");
const glob = require("glob");
const path = require("node:path");
const Parser = require('i18next-scanner').Parser;

module.exports = (outdir) => {
    const outputFolder = path.resolve(__dirname, "../i18n");
    if(!fs.existsSync(outputFolder))
        fs.mkdirSync(outputFolder);

    const translationFiles = glob.sync(outputFolder + "/**.json");
    const languages = {};

    translationFiles.forEach(file => {
        const langCode = file.split("/").pop().slice(0, -5);
        languages[langCode] = JSON.parse(fs.readFileSync(file, {encoding: "utf-8"}));
    });

    const files = glob.sync(path.resolve(__dirname, "../WebApp/**/*.{ts,tsx}"));
    const parser = new Parser();

    const currentKeys = [];

    function handleTranslation(key){
        currentKeys.push(key);
        Object.values(languages).forEach(translations => {
            translations[key] = translations[key] ?? "";
        });
    }

    files.forEach(file => {
        parser.parseFuncFromString(
            fs.readFileSync(file, 'utf-8'),
            { list: ['t'] },
            handleTranslation
        )
    });

    const langFiles = Object.entries(languages).map(([langCode, translations]) => {
        Object.keys(translations).forEach(key => {
            if(!currentKeys.includes(key))
                delete translations[key];
        });

        const outFile = langCode + ".json"
        const outPath = outputFolder + "/" + outFile;

        fs.writeFileSync(outPath, JSON.stringify(translations, null, 2));

        return [outPath, outFile];
    });

    if(langFiles.length){
        const i18nFolder = outdir + "/i18n";

        if(!fs.existsSync(i18nFolder))
            fs.mkdirSync(i18nFolder);

        langFiles.forEach(([path, file]) => {
            fs.copyFileSync(path, i18nFolder + "/" + file);
        });
    }
}
