const baseConfig = {
  name: ['金风科技'],
  n: 5,
  g1: 0.14,
  g2: 0.04,
  incomeTaxRate: 0.25, // 公司实际所得税税率
  expectedReturnOnEquity: 0.09, // 股权期望回报率
  wacc: 0.06375,
  fcf0: 1125214.04, // 第0年的自由现金流
  financeCash: 456600, // 金融资产
  longStockInvestment: 71800, // 长期股权投资
  longTermLiabilities: 0, // 长期债务
  shortTermLiabilities: 0, // 短期债务
  interestExpense: 9, // 利息支出
  liabilities: 5293400, // 公司债务
  stockHolderEquity: 4393100, // 股东权益合计
  minorityInterest: 156700, // 少数股东权益
  stockNumber: 314000 // 发行的股份数量
}
/*
债务资金资本成本: 5%
股权资本成本率: 9%
企业实际所得税税率取：25%
*/

module.exports = {
  baseConfig
}