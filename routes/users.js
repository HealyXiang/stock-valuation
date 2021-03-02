const router = require('koa-router')()
const Limit = 100;
router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  let res = 'this is a users/bar response';
  for (let i = 0; i < Limit; i++) {
    res = i;
    // console.log('iiii:', i)
  }
  ctx.body = res;
})

module.exports = router
