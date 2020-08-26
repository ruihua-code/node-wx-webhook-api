const puppeteer = require('puppeteer');
const dayjs = require('dayjs')
const axios = require('axios')
const wxConfig = require('./config/wx')
setInterval(async () => {
    let currentTime = dayjs(new Date()).format('HH:mm')
    console.log(currentTime)
    /*每天10点执行一次*/
    if (currentTime !== '10:00') {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'], timeout: 50000 })
        const browserWSEndpoint = browser.wsEndpoint();
        browser.disconnect();
        /* 使用节点来重新建立连接 */
        const browser2 = await puppeteer.connect({ browserWSEndpoint });
        let page = await browser2.newPage()
        await page.goto('https://nba.hupu.com/', { timeout: 0 });
        const newsContent = await page.evaluate(() => {
            let ele = document.querySelectorAll('.list-news .list-item a')
            return [...ele].map((item) => {
                return {
                    content: item.innerText
                }
            })
        })

        let con = ''
        newsContent.forEach(ele => {
            con += `${ele.content}\r\n\r\n`
        })
        let data = {
            msgtype: 'text',
            text: {
                content: con
            }
        }
        await browser2.close()
        console.log('新闻内容:', data)
        axios.post(wxConfig.wxWebhook, data)
    }
}, 1000 * 60);



