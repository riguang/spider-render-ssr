const express = require('express')
const path = require('path')
const app = express();
const puppeteer = require('puppeteer');
app.use("*", async(request, response, next) => { //判断是否蜘蛛中间件
    let SEOUAS = ["Baiduspider"]; //搜索引擎ua
    let clientUA = request.headers["user-agent"];
    for (let i = 0; i < SEOUAS.length; i++) {
        if (clientUA.indexOf(SEOUAS[i]) != -1) {
            await puppeteer.launch().then(async browser => {
                let page = await browser.newPage();
                await page.goto(`http://localhost:8080/spider.html`, {
                    timeout: 5000
                });
                let html = await page.evaluate(() => {
                    let webCode = document.getElementsByTagName("html")[0].outerHTML;
                    return webCode;
                });
                response.send(html);
                await page.close();
                await browser.close();
            });
            //response.send("返回动态渲染后的页面");
            return;
        }
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public')))

app.listen(8080, () => {
    console.log(`App listening at port 8080`);
})