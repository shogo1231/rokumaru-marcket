let express = require('express');
let router = express.Router();

// デフォルトルーティング
router.get('/', function (req, res) {
  // パラメータに値を設定、設定したパラメータはejs内で参照可能となる
  res.render('about/about', { title: 'NodeSample01', message: 'Hello Node.js' });
});
router.post('/about', function (req, res) {
  // パラメータに値を設定、設定したパラメータはejs内で参照可能となる
  res.render('about/about copy', { title: 'NodeSample01', message: 'Hello Node.js' });
});
// router.get('/about', function (req, res) {
//   // パラメータに値を設定、設定したパラメータはejs内で参照可能となる
//   res.render('accordion', { title: 'NodeSample01', message: 'Hello Node.js' });
// });

module.exports = router;