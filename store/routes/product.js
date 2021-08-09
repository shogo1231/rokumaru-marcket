let express = require('express');
let router = express.Router();
let fs = require('fs');
let path = require('path');
let product_check = require('../models/product');

// 画像アップロードモジュール
let multer = require('multer');
let storage = multer.diskStorage({
  //ファイルの保存先を指定(ここでは保存先は./public/images) 
  //Express4の仕様で画像(静的)なファイルを保存するときはpublic/以下のフォルダに置かないとダメらしい
  //詳しくは express.static public でググろう！
  destination: function(req, file, cb){
    cb(null, './store/static/public/images/')
  },
  //ファイル名を指定
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
});
let upload = multer({storage: storage});

/***********************************************************************/
// 入力データ送信
router.post('/', upload.single('gazou'), function (req, res) {
  let data = product_check.index(req,res);
  let fileName = req.file.originalname
  res.render('product/product_check', { title: 'ろくまる農園', data, fileName});
});

// 入力画面
router.get('/', function (req, res) {
  if (req.session.user) {
    res.render('product/product', { title: 'ろくまる農園'});
  }
  else {
    res.redirect('/');
  }
});

// 確認OK後の画面
router.post('/product_add_done', async function (req, res) {
  await product_check.product(req,res);
  let addData = req.body;
  res.render('product/product_add_done', { title: 'ろくまる農園', addData});
});

// 商品一覧
router.get('/list', async function(req,res) {
  if (req.session.user) {
    let rows = await product_check.getProductData(req,res);
    res.render('product/product_list', { title: 'ろくまる農園', rows});
  }
  else {
    res.redirect('/');
  }
});

// 編集画面
router.post('/product_edit', async function (req, res) {
  let row = await product_check.getProductOneData(req,res);
  res.render('product/product_edit', { title: 'ろくまる農園', row});
});

// 編集内容確認
router.post('/product_edit_check', upload.single('gazou'), function (req, res) {
  let data = product_check.edit(req,res);
  let oldFile = req.body.gazou_name_old;
  let fileName = req.file.originalname;
  if(oldFile !== fileName && oldFile !== '') {

    // 
    fs.unlink(path.resolve()+'/store/static/public/images/'+oldFile, (err) => {
      if (err) return;
    });

  }
  res.render('product/product_edit_check', { title: 'ろくまる農園', data, fileName});
});

// 編集内容OK
router.post('/product_edit_done', function (req, res) {
  let updateData = product_check.update(req,res);
  
  res.render('product/product_edit_done', { title: 'ろくまる農園', updateData});
});

// 削除
router.delete('/delete', function(req, res) {
  let data = product_check.deleteData(req, res);
  res.send(data);
});

// 参照
router.get('/reference', async function(req,res) {
  if (req.session.user) {
    let code = req.query.code;
    let data = await product_check.ref(req,res,code);
    res.render('product/product_reference',{ title: 'ろくまる農園', data});
  }
  else {
    res.redirect('/');
  }
});


module.exports = router;