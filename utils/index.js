const wanhuaConfig = {
    n: 5,
    g1: 0.15,
    g2: 0.04,
    wacc: 0.0616,
    fcf0: 303385.10,
    financeCash: 208636.18,
    longStockInvestment: 18612.81,
    liabilities: 2313423.57,
    stockHolderEquity: 1482323.44,
    minorityInterest: 325226.15,
    stockNumber: 216223
}
class FreeCashFlowEstimate {
  computeValueByFCF(config) {
    let res = 0;
    const { n, g1, g2, fcf0, wacc } = config;
    let [step1AllValue, step2AllValue] = [0, 0];
    for (let i = 1; i <= n; i++) {
      const currentStep1Value = (fcf0 * Math.pow(1 + g1, i) / Math.pow(1 + wacc, i));
      step1AllValue += currentStep1Value;
    }
    const step2FenZi = fcf0 * Math.pow(1 + g1, n) * (1 + g2);
    const step2FenMu = (wacc - g2) * Math.pow(1 + wacc, n + 1);
    step2AllValue = step2FenZi / step2FenMu;

    res = step1AllValue + step2AllValue;
    return res
  }
  computeStockPriceByFCF(config) {
    const { financeCash, longStockInvestment, liabilities, stockHolderEquity, minorityInterest, stockNumber } = config;
    const allStockRightsValue = financeCash + longStockInvestment + this.computeValueByFCF(config) - liabilities;
    const allStockValue = allStockRightsValue * (1 - minorityInterest / stockHolderEquity);
    return allStockValue / stockNumber;
  }
}

class StockDataProcess {
  transpose(a) {
  // Calculate the width and height of the Array
    var w = a.length || 0;
    var h = a[0] instanceof Array ? a[0].length : 0;
    // In case it is a zero matrix, no transpose routine needed.
    if(h === 0 || w === 0) { return []; }
    /**
      * @var {Number} i Counter
      * @var {Number} j Counter
      * @var {Array} t Transposed data is stored in this array.
      */
    var i, j, t = [];
    // Loop through every item in the outer array (height)
    for(i=0; i<h; i++) {
      // Insert a new row (array)
      t[i] = [];
      // Loop through every item per item in outer array (width)
      for(j=0; j<w; j++) {
        // Save transposed data.
        t[i][j] = a[j][i];
      }
    }
    return t;
  }
  toJson(arr) {
    const transposed = this.transpose(arr)
    const headers = transposed.shift();
    const res = transposed.map(row => row.reduce((acc, col, ind) => {
      acc[headers[ind]] = !Number.isNaN(+col) ? +col : col;
      return acc;
    }, {}))
    return res;
  }
}

module.exports = {
 FreeCashFlowEstimate,
 StockDataProcess
}