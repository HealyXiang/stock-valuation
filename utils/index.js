function computeFreeMoneyValue(config, stockData) {
    let res = 0;
    let fcf0 = 303385.10;
    const {
        n,
        g1,
        g2,
        WACC
    } = config;
    // stockData.forEach(item => {

    // })
    const step1Value = fcf0 * (1 + g1);
    let step1AllTieXian = 0;
    for (let i = 1; i <= n; i++) {
        const currentStep1Value = (fcf0 * Math.pow(1 + g1, i) / Math.pow(1 + WACC, i));
        console.log('currentStep1Value:', currentStep1Value)
        step1AllTieXian += currentStep1Value;
    }

    console.log('step1AllTieXian:', step1AllTieXian)
    const step2FenZi = fcf0 * Math.pow(1 + g1, n) * (1 + g2);
    const step2FenMu = (WACC - g2) * Math.pow(1 + WACC, n + 1);
    const step2AllTieXian = step2FenZi / step2FenMu;
    console.log('step2AllTieXian:', step2AllTieXian)
    // const step1AllTieXian = 0
    res = step1AllTieXian + step2AllTieXian;
    return res
}

const wanhuaConfig = {
    n: 5,
    g1: 0.15,
    g2: 0.04,
    WACC: 0.0616
}

const res = computeFreeMoneyValue(wanhuaConfig)
console.log('compute res:', res)