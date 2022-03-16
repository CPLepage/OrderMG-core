import {Page} from "puppeteer";
import {sleep} from "Server/Utils/utils";
import constants from "Shared/constants";

export async function loginTest(page: Page){
    await sleep(1000);
    const navBar = await page.$("#nav-bar");
    if(navBar)
        return true;

    const usernameInput = await page.$("#username");
    if(!usernameInput)
        return false;
    await page.type('#username', constants.testUser);
    await page.type('#password', constants.testPass);
    await page.click('#login');
    await sleep(2000);
    return await page.$("#nav-bar");
}
