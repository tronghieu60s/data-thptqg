const fs = require("fs");
const puppeteer = require("puppeteer");
const tienPhong = require("./src/crawlers/tienphong.vn");
const questionsToStart = require("./src/helpers/questionsToStart");

(async () => {
  const options = await questionsToStart();
  const { type_crawler } = options;

  /* create folder if not exists */
  const dirName = "data";
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }

  const headless = type_crawler.indexOf("perform") === -1;
  const browser = await puppeteer.launch({
    headless,
    args: ["--start-maximized"],
    // devtools: true,
  });

  if (type_crawler.indexOf("tienphong") > -1) {
    await tienPhong(browser, options);
  }

  await browser.close();
})();
