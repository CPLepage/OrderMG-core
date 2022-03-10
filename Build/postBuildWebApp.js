const fs = require("fs");
const glob = require("glob");
const path = require("node:path");
const Parser = require('i18next-scanner').Parser;

module.exports = (outdir) => {
    const outputFolder = path.resolve(__dirname, "../i18n");
    if(!fs.existsSync(outputFolder))
        fs.mkdirSync(outputFolder);

    const translationFiles = glob.sync(outputFolder + "/**.json");

    const extraTranslationFiles = process.env.LANGUAGES_DIR;
    if(extraTranslationFiles && fs.existsSync(extraTranslationFiles)){
        translationFiles.concat(glob.sync(extraTranslationFiles + "/**.json"));
    }

    const languages = {};

    translationFiles.forEach(file => {
        const langCode = file.split("/").pop().slice(0, -5);
        languages[langCode] = {
            filePath: file,
            translations: JSON.parse(fs.readFileSync(file, {encoding: "utf-8"}))
        };
    });

    const files = glob.sync(path.resolve(__dirname, "../WebApp/**/*.{ts,tsx}"));
    const parser = new Parser();

    const currentKeys = [];

    function handleTranslation(key){
        currentKeys.push(key);
        Object.values(languages).forEach(lang => {
            lang.translations[key] = lang.translations[key] ?? "";
        });
    }

    files.forEach(file => {
        parser.parseFuncFromString(
            fs.readFileSync(file, 'utf-8'),
            { list: ['t'] },
            handleTranslation
        )
    });

    const langFiles = Object.entries(languages).map(([langCode, {filePath, translations}]) => {
        Object.keys(translations).forEach(key => {
            if(!currentKeys.includes(key))
                delete translations[key];
        });

        fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));

        return [filePath, langCode + ".json"];
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
