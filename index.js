const puppeteer = require('puppeteer');
const dayjs = require('dayjs')
const axios = require('axios')
const wxConfig = require('./config/wx')
setInterval(async () => {
    let currentTime = dayjs(new Date()).format('HH:mm')
    console.log(currentTime)
    /*每天10点执行一次*/
    if (currentTime == '10:00') {
        const browser = await puppeteer.launch({ headless: false })
        const browserWSEndpoint = browser.wsEndpoint();
        browser.disconnect();
        // 使用节点来重新建立连接
        const browser2 = await puppeteer.connect({ browserWSEndpoint });
        let page = await browser2.newPage()
        await page.goto('https://nba.hupu.com/');
        const newsUrl = await page.evaluate(() => {
            let ele = document.getElementsByClassName('list-news')[0].children[0].children[0]
            return {
                url: ele.href
            }
        });
        console.log('url:', newsUrl.url)
        await page.goto(newsUrl.url);
        const newsContent = await page.evaluate(() => {
            let ele = document.getElementsByClassName('quote-content')[0]
            return {
                content: ele.innerText
            }
        });
        await browser2.close()
        console.log('新闻内容:', newsContent)
        axios.post(wxConfig.wxWebhook, newsContent)
    }
}, 1000 * 60);



