const puppeteer = require('puppeteer');
const dayjs = require('dayjs')
const axios = require('axios')
setInterval(async () => {
    let currentTime = dayjs(new Date()).format('HH')
    let execTime = '10'
    if (currentTime == execTime) {
        console.log("开始执行任务...")
    }
    console.log("正在获取新闻内容...", currentTime, execTime)
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
    console.log('新闻内容:', newsContent)
    await browser.close();
}, 1000 * 60 * 60);



