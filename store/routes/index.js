var express = require('express');
var router = express.Router();

// デフォルトルーティング
router.get('/', function (req, res) {
  // パラメータに値を設定、設定したパラメータはejs内で参照可能となる
  res.render('index', { title: 'NodeSample01', message: 'Hello Node.js' });
});

// router.get('/about', function (req, res) {
//   // パラメータに値を設定、設定したパラメータはejs内で参照可能となる
//   res.render('accordion', { title: 'NodeSample01', message: 'Hello Node.js' });
// });

module.exports = router;