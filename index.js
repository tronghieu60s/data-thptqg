const fs = require("fs");
const puppeteer = require("puppeteer");
const tienPhong = require("./src/crawlers/tienphong.vn");
const questionsToStart = require("./src/helpers/questionsToStart");

(async () => {
  const options = await questionsToStart();

  /* create folder if not exists */
  const dirName = "data";
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }

  if (options) {
    const browser = await puppeteer.launch({
      headless: options.headless,
      args: ["--start-maximized"],
      // devtools: true,
    });
    await tienPhong(browser, options);
    await browser.close();
  }
})();
