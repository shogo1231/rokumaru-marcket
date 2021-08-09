var express = require('express');
var router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
let staff_logon = require('../models/logon');

// デフォルトルーティング
router.get('/', function (req, res) {
  // パラメータに値を設定、設定したパラメータはejs内で参照可能となる
  res.render('staff_logon', { title: 'ろくまる農園' });
});

router.post('/staff_login_check', async function(req, res) {
  let data = await staff_logon.check(req, res);
  if(data.length === 0) {
    res.render('staff_logon_fail', { title: 'ろくまる農園' });
  }
  else {
    // セッション情報設定
    req.session.user = { name: data[0].name };
    res.render('staff_logon_done', { title: 'ろくまる農園', message: 'Hello Node.js' });
  }
  res.json('ok');
});

router.get('/logout', function (req, res) {
  req.session.destroy(function(err) {
    // cannot access session here
    res.render('staff_logon', { title: 'ろくまる農園' });
  })
});



// router.get('/about', function (req, res) {
//   // パラメータに値を設定、設定したパラメータはejs内で参照可能となる
//   res.render('accordion', { title: 'NodeSample01', message: 'Hello Node.js' });
// });

module.exports = router;