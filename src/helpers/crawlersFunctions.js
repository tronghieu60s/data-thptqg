function getIdfNumber(frontNumber, rearNumber) {
  const frontIdfNum = ("00" + frontNumber).slice(-2);
  const rearIdfNum = ("000000" + rearNumber).slice(-6);
  return `${frontIdfNum}${rearIdfNum}`;
}

module.exports = { getIdfNumber };
