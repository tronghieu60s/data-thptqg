const fs = require("fs");
const puppeteer = require("puppeteer");
const tienPhong = require("./src/crawlers/tienphong.vn");
const thanhNien = require("./src/crawlers/thanhnien.vn");
const questionsToStart = require("./src/helpers/questionsToStart");

(async () => {
  const options = await questionsToStart();
  const { type_crawler } = options;

  /* create folder if not exists */
  const dirName = "data";
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }

  /* headless config */
  let headless = true;
  if (process.env.NODE_ENV.trim() === "development") {
    headless = false;
  } else if (type_crawler.indexOf("perform") > -1) {
    headless = false;
  }

  const browser = await puppeteer.launch({
    headless,
    args: ["--start-maximized"],
    // devtools: true,
  });

  /* crawlers data */
  if (type_crawler.indexOf("tienphong") > -1) {
    await tienPhong(browser, options);
  } else if (type_crawler.indexOf("thanhnien") > -1) {
    await thanhNien(browser, options);
  }

  await browser.close();
})();
