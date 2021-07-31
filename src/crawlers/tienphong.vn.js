const {
  isObjectEmpty,
  writeObjectDataToJson,
} = require("../helpers/commonFunctions");
const { getIdfNumber } = require("../helpers/crawlersFunctions");

const crawlerUrl = "https://tienphong.vn/tra-cuu-diem-thi.tpo";
const timeout = 3000; // timeout milliseconds
const timeoutPerReq = 500;
const minFrontIdf = 1;
const maxFrontIdf = 64; // total provinces and cities
const maxTimesOverData = 5;

const main = async (browser) => {
  const page = await browser.newPage();
  await page.goto(crawlerUrl);
  await page.setViewport({ width: 1366, height: 768 });

  /* max rearNumber 101288 when frontNumber = 1 
    => infNum = 01101288 */
  let frontNumber = minFrontIdf,
    rearNumber = 1;
  let timesOverData = 0;

  while (frontNumber <= maxFrontIdf) {
    const idfNum = getIdfNumber(frontNumber, rearNumber);
    const resultData = await getData(page, idfNum);
    if (isObjectEmpty(resultData)) {
      timesOverData += 1;

      if (timesOverData >= maxTimesOverData) {
        frontNumber += 1;
        rearNumber = 0;
        timesOverData = 0;
      }
    } else {
      timesOverData = 0;

      writeObjectDataToJson("data.json", resultData);
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

  await page.waitForTimeout(timeoutPerReq);

  /* wait function run and find elements includes identification number */
  const waitFunc = `document.querySelector("#resultcontainer .point:nth-child(2)")
  .innerText.includes("${idfNum}")`;
  await page
    .waitForFunction(waitFunc, { timeout })
    .then(() => console.log(idfNum))
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
