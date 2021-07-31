const fs = require("fs");

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
  } catch (error) {
    console.log("No such file, creating new file...");
  }
  fileData.push(objectData);
  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
}

module.exports = {
  isObjectEmpty,
  randomIntFromInterval,
  writeObjectDataToJson,
};
