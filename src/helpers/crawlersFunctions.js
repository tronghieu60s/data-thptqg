const { writeDataToJson, writeDataToCsv } = require("./commonFunctions");

/* identification number consists of 8 digits
here only create the first 6 digits, the last 2 digits will run from 00 - 99 */
function getIdfNumber(frontNumber, rearNumber) {
  const frontIdfNum = ("00" + frontNumber).slice(-2);
  const rearIdfNum = ("0000" + rearNumber).slice(-4);
  return `${frontIdfNum}${rearIdfNum}`;
}

function writeDataToFile(typeExport, resultData) {
  switch (typeExport) {
    case "file json":
      writeDataToJson("./data/DiemThi2021.json", resultData);
      break;
    case "file csv":
      writeDataToCsv("./data/DiemThi2021.csv", resultData);
      break;
    default:
      break;
  }
}

module.exports = { getIdfNumber, writeDataToFile };
