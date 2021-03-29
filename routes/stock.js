const fs = require('fs');
const path = require('path');
const router = require('koa-router')()
const Papa = require('papaparse');

const { FreeCashFlowEstimate, StockDataProcess } = require('../utils')

const wanhuaConfig = {
    n: 5, // 第一阶段预测期
    g1: 0.05, // 第一阶段预测增长率
    g2: 0.035, // 第二阶段预测增长率
    wacc: 0.0616, // 加权平均资本成本
    fcf0: 1125214.04, // 第0年的自由现金流
    financeCash: 456600, // 金融资产
    longStockInvestment: 71800, // 长期股权投资
    liabilities: 5293400, // 公司债务
    stockHolderEquity: 4393100, // 股东权益合计
    minorityInterest: 156700, // 少数股东权益
    stockNumber: 314000 // 发行的股份数量
}

const stockEstimator = new FreeCashFlowEstimate();
const stockDataProcessor = new StockDataProcess();

function getFilePath(fileName) {
  return path.join(__dirname, `../stockData/${fileName}/${fileName}.csv`)
}

function getStockBaseConfig(name) {
  return require(path.join(__dirname, `../stockData/${name}`))
}

function getBaseStockInfo(name) {
  const csvData = fs.readFileSync(getFilePath(name), 'utf-8');
  const parsedRes = Papa.parse(csvData)
  const { baseConfig } = getStockBaseConfig(name)
  return {
    baseConfig,
    yearlyData: parsedRes.data
  }
}

function getAllStockBaseInfo() {
  const allStockDirs = fs.readdirSync(path.join(__dirname, '../stockData'));
  return allStockDirs.map(item => getStockBaseConfig(item).baseConfig)
}

router.prefix('/stock')

router.get('/', async (ctx, next) => {
  const allStockInfo = getAllStockBaseInfo();
  console.log('allStockInfo:', allStockInfo)
  const allStockName = allStockInfo.reduce((res, cur) => {
    res += cur.name;
    return res
  }, '')
  console.log('allStockName:', allStockName)
  await ctx.render('stockIndex', {
    title: allStockName
  })
})
/* sanyizhonggong
   wanhuahuaxue
   shengnongfazhan
   dongfangdianlan
   jinfengkeji
   zhongguozhongmian
   tiantanshengwu
   hongluganggou
   huacejiance
   yunnanbaiyao
*/
const targetStock = 'jinfengkeji'

router.get('/data', async (ctx, next) => {
  const { baseConfig, yearlyData } = getBaseStockInfo(targetStock);

  const jsonRes = stockDataProcessor.toJson(yearlyData);
  const stockConfig = stockDataProcessor.getStockBaseConfig(jsonRes, baseConfig);
  const res = stockEstimator.computeStockPriceByFCF(stockConfig)
  await ctx.render('stock', {
    name: baseConfig.name[0],
    price: `估计股票价值: ${res.toFixed(2)}元/股`,
    n: `预估第一阶段时间: ${baseConfig.n}年`,
    g1: `预估第一阶段增长率: ${baseConfig.g1 * 100}%`,
    g2: `预估第二阶段增长率: ${baseConfig.g2 * 100}%`,
    wacc: `加权资本成本率: ${(stockConfig.wacc * 100).toFixed(2)}%`
  })
})

router.get('/hello', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Stock!'
  })
})

module.exports = router
