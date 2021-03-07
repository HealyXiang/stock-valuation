const fs = require('fs');
const path = require('path');
const router = require('koa-router')()
const Papa = require('papaparse');

const { FreeCashFlowEstimate, StockDataProcess } = require('../utils')

const wanhuaConfig = {
    n: 5, // 第一阶段预测期
    g1: 0.05, // 第一阶段预测增长率
    g2: 0.03, // 第二阶段预测增长率
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

router.prefix('/stock')

router.get('/', function (ctx, next) {
  const csvData = fs.readFileSync(getFilePath('wanhuahuaxue'), 'utf-8');
  const parsedRes = Papa.parse(csvData)
  // console.log('resArr:', resArr)
  const jsonRes = stockDataProcessor.toJson(parsedRes.data);
  // TODO: 计算stock config by jsonRes
  console.log('jsonRes:', jsonRes)
  const res = stockEstimator.computeStockPriceByFCF(wanhuaConfig)
  ctx.body = res.toFixed(2) + ' 元/股'
})

router.get('/bar', function (ctx, next) {
  let res = 'this is a users/bar response';
  ctx.body = res;
})

module.exports = router
