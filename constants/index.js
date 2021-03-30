const csvKeyMap = {
  '项目/年份': 'year',
  '经营活动产生的现金流量净额': 'businessActivityNetCash',
  '资产减值准备': 'assetsDepreciationPreparation',
  '资产折旧': 'assetsDepreciation',
  '无形资产摊销': 'intangibleAssetsDepreciation',
  '长期待摊费用摊销': 'longTermPrepaid',
  '处置资产的损失': 'lossOnDisposalOfAssets',
  '经营资产自由现金流': 'cashFlowFromOperation',
  '货币资金': 'financeCash',
  '长期股权投资': 'longStockInvestment',
  '短期债务': 'shortTermLiabilities',
  '一年内到期的长期负债': 'longTermLiabilitiesDueWithin1year',
  '长期债务': 'longTermLiabilities',
  '应付债券': 'bondsPayable',
  '长期应付款': 'longTermPayable',
  '公司债务': 'liabilities',
  '利息支出': 'interestExpense',
  '股东权益合计': 'stockHolderEquity',
  '少数股东权益': 'minorityInterest',
  '发行股数量': 'stockNumber'
}

const defaultStockConfig = {
  n: 5,
  g1: 0,
  g2: 0,
  wacc: 0,
  fcf0: 0,
  financeCash: 0,
  longStockInvestment: 0,
  liabilities: 0,
  stockHolderEquity: 0,
  minorityInterest: 0,
  stockNumber: 1
}

module.exports = {
  csvKeyMap,
  defaultStockConfig
}