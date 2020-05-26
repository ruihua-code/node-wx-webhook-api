const puppeteer = require('puppeteer');
const dayjs = require('dayjs')
const axios = require('axios')
const wxConfig = require('./config/wx')
setInterval(async () => {
    let currentTime = dayjs(new Date()).format('HH')
    //每天10点以后执行一次
    if (currentTime == '10') {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('https://nba.hupu.com/');
        const newsUrl = await page.evaluate(() => {
            let ele = document.getElementsByClassName('list-news')[0].children[0].children[0]
            return {
                url: ele.href
            }
        });
        console.log('新闻内容url:', newsUrl.url);
        await page.goto(newsUrl.url);
        const newsContent = await page.evaluate(() => {
            let ele = document.getElementsByClassName('quote-content')[0]
            return {
                content: ele.innerText
            }
        });
        await browser.close();
        let data = {
            msgtype: 'text',
            text: {
                content: newsContent.content
            }
        }
        console.log('新闻内容:', data)
        axios.post(wxConfig.wxWebhook, data)
    }
}, 1000 * 60 * 60);



