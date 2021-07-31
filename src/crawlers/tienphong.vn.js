const {
  isObjectEmpty,
  writeObjectDataToCsv,
} = require("../helpers/commonFunctions");
const { getIdfNumber } = require("../helpers/crawlersFunctions");

const crawlerUrl = "https://tienphong.vn/tra-cuu-diem-thi.tpo";
const timeout = 3000; // timeout milliseconds
const timeoutPerReq = 500;
const minFrontIdf = 1;
const maxFrontIdf = 64; // total provinces and cities
const maxTimesOverData = 10;

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

      /* increase frontNumber + 1 next cluster */
      if (timesOverData >= maxTimesOverData) {
        frontNumber += 1;
        rearNumber = 0;
        timesOverData = 0;
      }
    } else {
      timesOverData = 0;
      // writeObjectDataToJson("DiemThi2021.json", resultData);
      writeObjectDataToCsv("./data/DiemThi2021.csv", resultData);
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

    const SBD = result[1].innerText;
    const Toan = result[2].innerText;
    const Ngu_Van = result[3].innerText;
    const Ngoai_Ngu = result[4].innerText;
    const Vat_Ly = result[5].innerText;
    const Hoa_Hoc = result[6].innerText;
    const Sinh_Hoc = result[7].innerText;
    const Lich_Su = result[8].innerText;
    const Dia_Ly = result[9].innerText;
    const GDCD = result[10].innerText;
    const Cum_Thi = result[1].innerText.slice(0, 2);
    return {
      SBD,
      Toan,
      Ngu_Van,
      Ngoai_Ngu,
      Vat_Ly,
      Hoa_Hoc,
      Sinh_Hoc,
      Lich_Su,
      Dia_Ly,
      GDCD,
      Cum_Thi,
    };
  });

  return resultData;
};

module.exports = main;
