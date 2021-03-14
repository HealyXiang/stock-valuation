const baseConfig = {
  name: ['万华化学'],
  n: 5, // 第一阶段预测期
  g1: 0.11, // 第一阶段预测增长率
  g2: 0.035, // 第二阶段预测增长率
  incomeTaxRate: 0.25, // 公司实际所得税税率
  expectedReturnOnEquity: 0.09, // 股权期望回报率
  wacc: 0.0616, // 加权平均资本成本
  fcf0: 1125214.04, // 第0年的自由现金流
  financeCash: 456600, // 金融资产
  longStockInvestment: 71800, // 长期股权投资
  liabilities: 5293400, // 公司债务
  stockHolderEquity: 4393100, // 股东权益合计
  minorityInterest: 156700, // 少数股东权益
  stockNumber: 314000 // 发行的股份数量
}

module.exports = {
  baseConfig
}