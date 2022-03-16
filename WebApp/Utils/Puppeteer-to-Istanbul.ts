import {Page} from "puppeteer";
import v8toIstanbul from "v8-to-istanbul";
import fs from "fs";

export namespace puppeteerToNYC {
    export async function start(page: Page){
        await page.coverage.startJSCoverage({
            includeRawScriptCoverage: true,
            resetOnNavigation: false
        });
    }

    export async function convert(page: Page){
        const jsCoverage = (await page.coverage.stopJSCoverage()).map(({rawScriptCoverage: coverage}) => {
            const file = (new URL(coverage.url)).pathname;
            return {
                ...coverage,
                url: __dirname + "/webapp" + file
            }
        });

        for (let i = 0; i < jsCoverage.length; i++) {
            const script = v8toIstanbul(jsCoverage[i].url);
            await script.load();
            script.applyCoverage(jsCoverage[i].functions);
            fs.writeFileSync(process.cwd() + "/.nyc_output/webapp-" +
                Math.floor(Math.random() * 10000) + "-" + Date.now() + ".json", JSON.stringify(script.toIstanbul()))
            script.destroy();
        }
    }
}
