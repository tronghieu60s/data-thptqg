function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = { isObjectEmpty, randomIntFromInterval };
