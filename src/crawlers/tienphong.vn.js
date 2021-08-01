const {
  getIdfNumber,
  writeDataToFile,
} = require("../helpers/crawlersFunctions");

/* max rearNumber 1012-88 when frontNumber = 1 => infNum = 011012-88 */
const crawlerUrl = "https://tienphong.vn/tra-cuu-diem-thi.tpo";
const timeout = 3000; // timeout milliseconds
const timeoutPerReq = 500;
const minFrontIdf = 1;
const maxFrontIdf = 64; // total provinces and cities

const main = async (browser, options) => {
  const { type_export } = options;
  let frontNumber = minFrontIdf,
    rearNumber = 0;

  const page = await browser.newPage();
  await page.goto(crawlerUrl);
  await page.setViewport({ width: 1366, height: 768 });

  while (frontNumber <= maxFrontIdf) {
    const idfNum = getIdfNumber(frontNumber, rearNumber);
    const resultData = await getData(page, idfNum);

    /* reset rearNumber and 
    increase frontNumber + 1 */
    if (resultData.length === 0) {
      frontNumber += 1;
      rearNumber = 0;
      continue;
    }

    rearNumber += 1;
    writeDataToFile(type_export, resultData);
  }

  console.log("Hoàn tất, vui lòng kiểm tra thư mục data.");
};

const getData = async (page, idfNum) => {
  /* when this function run will pass data to input 
  and click button load data */
  await page.evaluate(
    (args) => {
      document.querySelector("#txtkeyword").value = args.idfNum;
      document.querySelector("#btnresult").click();
    },
    { idfNum }
  );

  /* wait function run and find elements includes identification number */
  await page.waitForTimeout(timeoutPerReq);
  const waitFunc = `document.querySelector("#resultcontainer .point:nth-child(2)")
  .innerText.includes("${idfNum}")`;
  await page
    .waitForFunction(waitFunc, { timeout })
    .then(() => console.log(`${idfNum}00 - ${idfNum}99`))
    .catch(() => console.log(`${idfNum}00 - ${idfNum}99 not found!`));

  const resultData = await page.evaluate(() => {
    const result = document.querySelectorAll("#resultcontainer tr");
    if (result.length === 0) return [];

    const arrData = [];
    /* the data is sorted backwards, the loop must be run backwards */
    for (let index = result.length - 1; index >= 0; index -= 1) {
      const children = result[index].children;
      arrData.push({
        SBD: children[1].innerText,
        Toan: children[2].innerText,
        Ngu_Van: children[3].innerText,
        Ngoai_Ngu: children[4].innerText,
        Vat_Ly: children[5].innerText,
        Hoa_Hoc: children[6].innerText,
        Sinh_Hoc: children[7].innerText,
        Lich_Su: children[8].innerText,
        Dia_Ly: children[9].innerText,
        GDCD: children[10].innerText,
        Cum_Thi: children[1].innerText.slice(0, 2),
      });
    }

    return arrData;
  });

  return resultData;
};

module.exports = main;
