const fs = require("fs");
const ObjectsToCsv = require("objects-to-csv");

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function writeDataToJson(filePath, data) {
  let fileData = [];
  try {
    fileData = JSON.parse(fs.readFileSync(filePath));
  } catch (err) {}

  if (Array.isArray(data)) {
    fileData.push(...data);
  } else if (typeof data === "object") {
    fileData.push(data);
  }

  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
}

function writeDataToCsv(filePath, data) {
  let csv = new ObjectsToCsv([]);
  if (Array.isArray(data)) {
    csv = new ObjectsToCsv([...data]);
  } else if (typeof data === "object") {
    csv = new ObjectsToCsv([data]);
  }
  return csv.toDisk(filePath, { append: true });
}

module.exports = {
  isObjectEmpty,
  randomIntFromInterval,
  writeDataToJson,
  writeDataToCsv,
};
