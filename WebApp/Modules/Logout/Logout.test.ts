import {describe} from "mocha";
import {init} from "Server/init";
import puppeteer from "puppeteer";
import Server from "Server/Server";
import assert from "assert";
import {puppeteerToNYC} from "WebApp/Utils/Puppeteer-to-Istanbul";
import {sleep} from "Server/Utils/utils";
import {loginTest} from "WebApp/Login/LoginTest";

describe('Logout', function () {
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

    it("Should logout", async () => {
        await loginTest(page)
        const logoutBtn = await page.$('#logout');

        // todo: check in window.localStorage.accessToken make sure its really empty
        if(!logoutBtn && await page.$("#nav-bar"))
            return;

        await page.click('#logout');
        await sleep(2000);
        assert.ok(!await page.$("#nav-bar"));
    });

    afterEach(async () => {
        await puppeteerToNYC.convert(page);
        await browser.close();
    });

    after(() => {
        Server.httpServer.close();
    })
});
