const puppeteer = require("puppeteer");
const tienPhong = require("./src/crawlers/tienphong.vn");

const browserConfig = {
  headless: false,
  args: ["--start-maximized"],
  // devtools: true,
};

(async () => {
  const browser = await puppeteer.launch(browserConfig);

  await tienPhong(browser);

  await browser.close();
})();
