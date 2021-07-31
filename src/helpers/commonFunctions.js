const fs = require("fs");
const ObjectsToCsv = require("objects-to-csv");

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function writeObjectDataToJson(filePath, objectData) {
  let fileData = [];
  try {
    fileData = JSON.parse(fs.readFileSync(filePath));
  } catch (err) {}
  fileData.push(objectData);
  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
}

function writeObjectDataToCsv(filePath, objectData) {
  const csv = new ObjectsToCsv([objectData]);
  return csv.toDisk(filePath, { append: true });
}

module.exports = {
  isObjectEmpty,
  randomIntFromInterval,
  writeObjectDataToJson,
  writeObjectDataToCsv,
};
