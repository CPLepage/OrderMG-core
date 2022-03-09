import Service from "src/Services/Service";
import {Router} from "express";
import * as fs from "fs";
import path from "path";

export default class Orders extends Service {
    readonly langDir = path.resolve(__dirname, "i18n");

    register(): Router {
        const router = super.register();

        router.get("/", (req, res) => {
            return res.json(this.list())
        });

        router.get("/:langCode", (req, res) => {
            return res.json(this.get(req.params.langCode));
        });

        return router;
    }

    list(){
        const langFiles = fs.readdirSync(this.langDir);
        const langCodes = langFiles.filter(file => file.endsWith(".json")).map(file => file.slice(0, -5));
        return ["en", ...langCodes];
    }

    get(langCode: string){
        if(!fs.existsSync(this.langDir + "/" + langCode + ".json"))
            return {};

        return JSON.parse(fs.readFileSync(this.langDir + "/" + langCode + ".json", {encoding: "utf8"}));
    }
}
