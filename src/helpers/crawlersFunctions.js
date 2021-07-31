const {
  writeObjectDataToJson,
  writeObjectDataToCsv,
} = require("./commonFunctions");

function getIdfNumber(frontNumber, rearNumber) {
  const frontIdfNum = ("00" + frontNumber).slice(-2);
  const rearIdfNum = ("000000" + rearNumber).slice(-6);
  return `${frontIdfNum}${rearIdfNum}`;
}

function writeDataToFile(typeExport, resultData) {
  switch (typeExport) {
    case "file json":
      writeObjectDataToJson("./data/DiemThi2021.json", resultData);
      break;
    case "file csv":
      writeObjectDataToCsv("./data/DiemThi2021.csv", resultData);
      break;
    default:
      break;
  }
}

module.exports = { getIdfNumber, writeDataToFile };
