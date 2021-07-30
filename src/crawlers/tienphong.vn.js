const { isObjectEmpty } = require("../helpers/commonFunctions");

const crawlerUrl = "https://tienphong.vn/tra-cuu-diem-thi.tpo";
const timeout = 3000; // timeout milliseconds
const minFrontIdf = 1;
const maxFrontIdf = 64; // total provinces and cities

const main = async (browser) => {
  const page = await browser.newPage();
  await page.goto(crawlerUrl);
  await page.setViewport({ width: 1366, height: 768 });

  let frontNumber = minFrontIdf,
    rearNumber = 1;

  while (frontNumber <= maxFrontIdf) {
    const frontIdfNum = ("00" + frontNumber).slice(-2);
    const rearIdfNum = ("000000" + rearNumber).slice(-6);
    const idfNum = `${frontIdfNum}${rearIdfNum}`;

    const resultData = await getData(page, idfNum);
    if (!isObjectEmpty(resultData)) {
      console.log(resultData.idfNum + " - " + resultData.literature);
    } else {
      
    }
    if (rearNumber === 100) {
      break;
    }
    rearNumber += 1;
  }
};

const getData = async (page, idfNum) => {
  /* fill identification number on input and click the button  */
  await page.evaluate(
    (args) => {
      document.querySelector("#txtkeyword").value = args.idfNum;
      document.querySelector("#btnresult").click();
    },
    { idfNum }
  );

  await page.waitForSelector("#resultcontainer .point");

  /* wait function run and find elements includes identification number */
  const waitFunc = `document.querySelector("#resultcontainer .point:nth-child(2)")
  .innerText.includes("${idfNum}")`;
  await page
    .waitForFunction(waitFunc, { timeout })
    .catch(() => console.log(`${idfNum} not found!`));

  const resultData = await page.evaluate(() => {
    const result = document.querySelectorAll("#resultcontainer .point");
    if (result.length === 0) {
      return {};
    }

    const idfNum = result[1].innerText;
    const math = result[2].innerText;
    const literature = result[3].innerText;
    const foreignLang = result[4].innerText;
    const physics = result[5].innerText;
    const chemistry = result[6].innerText;
    const biology = result[7].innerText;
    const history = result[8].innerText;
    const geography = result[9].innerText;
    const civicEdu = result[10].innerText;
    return {
      idfNum,
      math,
      literature,
      foreignLang,
      physics,
      chemistry,
      biology,
      history,
      geography,
      civicEdu,
    };
  });

  return resultData;
};

module.exports = main;
