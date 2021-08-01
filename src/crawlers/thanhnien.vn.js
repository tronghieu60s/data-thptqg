const {
  getIdfNumber,
  writeDataToFile,
} = require("../helpers/crawlersFunctions");

/* max rearNumber 1012-88 when frontNumber = 1 => infNum = 011012-88 */
const crawlerUrl =
  "https://thanhnien.vn/giao-duc/tuyen-sinh/2021/tra-cuu-diem-thi-thpt-quoc-gia.html";
const minFrontIdf = 1;
const maxFrontIdf = 64; // total provinces and cities

const main = async (browser, options) => {
  const { type_export } = options;
  let frontNumber = minFrontIdf,
    rearNumber = 0;

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(crawlerUrl);

  while (frontNumber <= maxFrontIdf) {
    const idfNum = getIdfNumber(frontNumber, rearNumber);
    const resultData = await getData(page, idfNum);

    /* reset rearNumber and 
    increase frontNumber + 1 */
    if (resultData.length === 0) {
      frontNumber += 1;
      rearNumber = 0;
      console.log(`${idfNum}00 - ${idfNum}99 not found!`);
      continue;
    }

    console.log(`${idfNum}00 - ${idfNum}99`);
    rearNumber += 1;
    writeDataToFile(type_export, resultData);
  }

  console.log("Hoàn tất, vui lòng kiểm tra thư mục data.");
};

const getData = (page, idfNum) => {
  return page.evaluate(
    async (args) => {
      const { idfNum } = args;

      /* fetch data and convert to html */
      const fetchUrl = `https://thanhnien.vn/ajax/diemthi.aspx?kythi=THPT&nam=2021&city=DDT&text=${idfNum}&top=no`;
      const fetchData = await fetch(fetchUrl).then((res) => res.text());
      const domElements = new DOMParser().parseFromString(
        `<div>${fetchData}</div>`,
        "text/xml"
      );

      const result = domElements.querySelectorAll("div tr");
      if (result.length === 0) return [];

      const arrData = [];
      /* the data is sorted backwards, the loop must be run backwards */
      for (let index = result.length - 1; index >= 0; index -= 1) {
        const children = result[index].children;
        arrData.push({
          SBD: children[3].innerHTML,
          Toan: children[6].innerHTML,
          Ngu_Van: children[7].innerHTML,
          Ngoai_Ngu: children[16].innerHTML,
          Vat_Ly: children[8].innerHTML,
          Hoa_Hoc: children[9].innerHTML,
          Sinh_Hoc: children[10].innerHTML,
          Lich_Su: children[12].innerHTML,
          Dia_Ly: children[13].innerHTML,
          GDCD: children[14].innerHTML,
          Cum_Thi: children[3].innerHTML.slice(0, 2),
        });
      }

      return arrData;
    },
    { idfNum }
  );
};

module.exports = main;
