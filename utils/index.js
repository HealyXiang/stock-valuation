const { csvKeyMap, defaultStockConfig } = require('../constants')

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


function getStandardKey(nonStandardKey) {
  return csvKeyMap[nonStandardKey] || nonStandardKey;
}

function computeCFFOYearly(yearlyData) {
  //   {
  //   year: 2012,
  //   businessActivityNetCash: 380600,
  //   assetsDepreciationPreparation: 3512.85,
  //   assetsDepreciation: 73100,
  //   intangibleAssetsDepreciation: 1185.67,
  //   longTermPrepaid: 766.52,
  //   lossOnDisposalOfAssets: 17000,
  //   cashFlowFromOperation: 292060.66
  // },
  const {
    businessActivityNetCash,
    assetsDepreciationPreparation,
    assetsDepreciation,
    intangibleAssetsDepreciation,
    longTermPrepaid,
    lossOnDisposalOfAssets
  } = yearlyData;
  const res = businessActivityNetCash + assetsDepreciationPreparation - assetsDepreciation - intangibleAssetsDepreciation - longTermPrepaid - lossOnDisposalOfAssets
  return res;
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
    const { financeCash, longStockInvestment, liabilities, stockHolderEquity, minorityInterest, stockNumber, interestBearingDebt } = config;
    const allStockRightsValue = financeCash + longStockInvestment + this.computeValueByFCF(config) - interestBearingDebt;
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
      acc[getStandardKey(headers[ind])] = !Number.isNaN(+col) ? +col : col;
      return acc;
    }, {}))
    return res;
  }

  computeInterestBearingDebt(oneYearData) {
    console.log('oneYearData:', oneYearData)
    return oneYearData.shortTermLiabilities
      + oneYearData.longTermLiabilitiesDueWithin1year
      + oneYearData.longTermLiabilities
      + oneYearData.bondsPayable
      + oneYearData.longTermPayable
  }

  getStockBaseConfig(jsonArrData, defaultStockConfig) {
  // const wanhuaConfig = {
  //     n: 5,
  //     g1: 0.15,
  //     g2: 0.04,
  //     wacc: 0.0616,
  //     fcf0: 303385.10,
  //     financeCash: 208636.18,
  //     longStockInvestment: 18612.81,
  //     longTermLiabilities: 0, // 长期债务
  //     shortTermLiabilities: 0, // 短期债务
  //     interestExpense: 0, // 利息支出
  //     liabilities: 2313423.57,
  //     stockHolderEquity: 1482323.44,
  //     minorityInterest: 325226.15,
  //     stockNumber: 216223
  // }
    const resConfig = { ...defaultStockConfig }
    const n = defaultStockConfig.n;
    const cashFlowFromOperationArr = jsonArrData.slice(0, n).map(item => {
      return computeCFFOYearly(item);
    })
    resConfig.fcf0 = cashFlowFromOperationArr.reduce((res, item) => res + item, 0) / n
    resConfig.financeCash = jsonArrData[0].financeCash;
    resConfig.longStockInvestment = jsonArrData[0].longStockInvestment;
    resConfig.longTermLiabilities = jsonArrData[0].longTermLiabilities;
    resConfig.shortTermLiabilities = jsonArrData[0].shortTermLiabilities;
    resConfig.interestExpense = jsonArrData[0].interestExpense;
    resConfig.liabilities = jsonArrData[0].liabilities;
    resConfig.interestBearingDebt = this.computeInterestBearingDebt(jsonArrData[0])
    resConfig.stockHolderEquity = jsonArrData[0].stockHolderEquity;
    resConfig.minorityInterest = jsonArrData[0].minorityInterest;
    resConfig.stockNumber = jsonArrData[0].stockNumber;
    function computeWacc(config) {
      /*
        计算WACC, 即加权资本成本率
        对债权 股权占资产的比例进行了调整，债权占比不超过50%，股权占比不低于50%
      */
      const { incomeTaxRate, expectedReturnOnEquity } = config;
      const totalCapital = resConfig.stockHolderEquity + resConfig.liabilities;
      const preTaxDebtCostRate = resConfig.interestExpense / (resConfig.interestBearingDebt); // 分母使用有息负债
      // const stockRatio = resConfig.stockHolderEquity / totalCapital;
      // const debtRatio = resConfig.liabilities / totalCapital;
      const stockRatio = Math.max(0.5, resConfig.stockHolderEquity / totalCapital); // 股权占比 <= 0.5
      const debtRatio = Math.min(0.5, resConfig.liabilities / totalCapital); // 债权占比 >= 0.5
      console.log('未调整的债权占比: ', `${resConfig.liabilities * 100 / totalCapital}%`)
      const weightedCapitalCostRateByEquity = expectedReturnOnEquity * stockRatio;
      const weightedCapitalCostRateByDebt = (1 - incomeTaxRate) * preTaxDebtCostRate * debtRatio;
      return weightedCapitalCostRateByEquity + weightedCapitalCostRateByDebt;
    }
    resConfig.wacc = computeWacc(defaultStockConfig);
    return resConfig
  }
}

module.exports = {
 FreeCashFlowEstimate,
 StockDataProcess
}