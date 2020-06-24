const puppeteer = require('puppeteer');
const { PendingXHR } = require('pending-xhr-puppeteer')

async function scrapeProduct(url, xpath, callback, err) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        const [el] = await page.$x(xpath);
        const src = await (await el.getProperty('src')).jsonValue();

        await browser.close();

        callback(src);
    } catch (e) {
        err(e);
    }
}


async function scrapeID(url, callback, err) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const pendingXHR = new PendingXHR(page);
        await page.goto('https://fb-search.com/find-my-facebook-id');

        await page.focus('#home > div > input');
        await page.keyboard.type(url);
        await page.click('#home > div > button');

        await pendingXHR.waitForAllXhrFinished();

        const [el] = await page.$x('//*[@id="home"]/div[2]/div[1]/b');
        const id = await (await el.getProperty('textContent')).jsonValue();

        await browser.close();

        callback(id);

    } catch (e) {
        err(e);
    }
}


module.exports = { scrapeProduct, scrapeID }

// scrapeID('https://www.facebook.com/nouran.abdeen.73');
// scrapeProduct('https://www.facebook.com/photo.php?fbid=345435083105571&id=100029172463688&set=a.109024950079920&refid=13&__tn__=%2B%3E', '//*[@id="u_0_e"]/div[1]/img', console.log)
// scrapeProduct('https://www.facebook.com/photo/?fbid=345435083105571&set=a.109024950079920', '//*[@id="u_0_e"]/div[1]/img')
// scrapeProduct('https://www.facebook.com/photo?fbid=135191771084949&set=a.100145354589591', '//*[@id="u_0_e"]/div[1]/img')
// scrapeProduct('https://www.instagram.com/p/B816V4Zgz1r/', '//*[@id="react-root"]/section/main/div/div/article/div[1]/div/div/div[1]/div[1]/img', console.log, console.log)
