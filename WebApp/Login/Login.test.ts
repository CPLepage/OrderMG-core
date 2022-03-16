import {describe} from "mocha";
import {init} from "Server/init";
import puppeteer from "puppeteer";
import Server from "Server/Server";
import assert from "assert";
import {puppeteerToNYC} from "WebApp/Utils/Puppeteer-to-Istanbul";
import {loginTest} from "WebApp/Login/LoginTest";

describe('Login', function () {
    let browser, page;

    before(async () => {
        await init(true);
        browser = await puppeteer.launch();
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await puppeteerToNYC.start(page);
        await page.goto("http://localhost:9005");
    });

    it("Should Login", async () => {
        assert.ok(await loginTest(page));
    });

    afterEach(async () => {
        await puppeteerToNYC.convert(page);
        await browser.close();
    });

    after(() => {
        Server.httpServer.close();
    })
});
