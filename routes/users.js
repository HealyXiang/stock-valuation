const router = require('koa-router')()

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  let res = 'this is a users/bar response';
  ctx.body = res;
})

module.exports = router
