let express = require('express');
let router = express.Router();
let fs = require('fs');
const mysql = require('mysql');
const util = require('util');
const sgMail = require('@sendgrid/mail');
let dayjs = require('dayjs');
let product_check = require('../models/shop');

var Tokens = require("csrf");
var tokens = new Tokens();

// 画像アップロードモジュール
let multer = require('multer');
let storage = multer.diskStorage({
  //ファイルの保存先を指定(ここでは保存先は./public/images) 
  //Express4の仕様で画像(静的)なファイルを保存するときはpublic/以下のフォルダに置かないとダメらしい
  //詳しくは express.static public でググろう！
  destination: function(req, file, cb){
    cb(null, './static/public/images/')
  },
  //ファイル名を指定
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
});
let upload = multer({storage: storage});
// カート内の計算に使う変数　現状では、カート内空にしたりログアウトするときにリセットする必要がある。
let syouhin = [];

// 勉強用
// let path = require('path');

/***********************************************************************/
// 商品リンク選択
router.get('/shop_product', upload.single('gazou'), async function (req, res) {
  // 新規に 秘密文字 と トークン を生成
  let secret = tokens.secretSync();
  let token = tokens.create(secret);

  // 秘密文字はセッションに保存
  req.session._csrf = secret;
  // トークンはクッキーに保存
  res.cookie("_csrf", token);

  let data = await product_check.getProductOneData(req,res);
  // 画像データのみ抽出
  let gazouData = [];
  if (data[0].gazou) {
    gazouData.push(data[0].gazou);
  }
  if (data[0].gazou1) {
    gazouData.push(data[0].gazou1);
  }
  if (data[0].gazou2) {
    gazouData.push(data[0].gazou2);
  }
  let member = req.session.member;
  let search = req.session.search;
  let status = req.query.status;
  // let fileName = req.file.originalname
  res.render('shop/shop_product', { data, gazouData, member, search, status });
});

// 商品一覧画面
router.get('/', async function (req, res) {
  // ゲストユーザがトップ戻った時、いったんform内容を空にする
  if (req.session.formData) { req.session.formData = ''; }

  let rows = await product_check.getProductData(req,res);
  let member = req.session.member;
  // トップページにアクセスした場合検索内容をリセットさせる
  req.session.search = '';
  let search = '';
  res.render('shop/shop', { rows, member, search });
});

// カートに入れる選択
router.get('/shop_cartin', async function (req, res) {
  let secret = req.session._csrf;
  let token = req.cookies._csrf;
  
  // 秘密文字 と トークン の組み合わせが正しいか検証
  // ページリロード　ブラウザバックからのカート追加押したとき
  // セッションに入ってるカート情報を表示
  if (tokens.verify(secret, token) === false) {
    let data = await product_check.getProductOneData(req,res);
    let price = req.session.price || 0;
    let member = req.session.member;
    let syouhin = req.session.cart;
    let search = req.session.search;
    return res.render('shop/shop_cartin', { syouhin, data, price, member, search });
  }

  // 会員ログインしてる場合、セッション内の商品ＩＤ追加
  let member = req.session.member;
  if(member) {
    syouhin = !req.session.cart ? [] : req.session.cart;
  }

  // セッションにコードを入れて色んな画面で参照可能にする。
  syouhin.push(req.query.code);
  // syouhin.sort();
  // 重複はsetでまとめる
  syouhin = [...new Set(syouhin)].sort(); // カートに入れた商品をまとめる

  // req.session.cart = code;
  // カート内に商品がないとき
  if(!req.session.kazu || req.session.kazu.length === 0) {
    let num = syouhin.map((item) => {
      let count = 0;
      syouhin.forEach((tannpin) => {
        if(item===tannpin){
          count++;
        }
      });
      return count;
    });
    req.session.kazu = num;
  }
  // カート内に商品があるとき(ゲストユーザの場合)
  else if (!member) {
    // カート内に存在する商品と同じ商品が追加された場合
    let total = req.session.kazu; // 現在のカート内の各商品数量取得
    if(req.session.cart.length === syouhin.length) {
      let code = req.query.code;
      // 追加された商品の数量のみ＋１する
      for(let i=0; i<req.session.cart.length; i++) {
        if(req.session.cart[i] === code ){
          total[i] = Number(req.session.kazu[i]) + 1;
        }
      }
    }
    // カート内に存在しない商品が追加された場合
    else {
      total = [];
      let i=0;
      let j=0;
      syouhin.forEach((item) => {
        if(req.query.code === item ){
          total[i] = 1;
        }
        else {
          total[i] = Number(req.session.kazu[j]);
          j++;
        }
        i++;
      })
    }
    req.session.kazu = total;
  }
  // カート内に商品があるとき(会員ユーザの場合)
  else {
    // カート内に存在する商品と同じ商品が追加された場合
    let total = req.session.kazu; // 現在のカート内の各商品数量取得
    if(req.session.cart.length !== syouhin.length) {
      let code = req.query.code;
      // 追加された商品の数量のみ＋１する
      for(let i=0; i<syouhin.length; i++) {
        if(syouhin[i] === code ){
          total[i] = Number(req.session.kazu[i]) + 1;
        }
      }
    }
    // カート内に存在しない商品が追加された場合
    else {
      total = [];
      let i=0;
      let j=0;
      syouhin.forEach((item) => {
        if(req.query.code === item ){
          total[i] = 1;
        }
        else {
          total[i] = Number(req.session.kazu[j]);
          j++;
        }
        i++;
      })
    }
    req.session.kazu = total;
  }
  req.session.cart = syouhin;

  let data = await product_check.cartin(req,res);
  let price = req.session.price || 0;
  price += data[0].price;
  req.session.price = price;
  // let data = await product_check.getProductOneData(req,res);
  // let fileName = req.file.originalname

  // 使用済み 秘密文字 と トークン の無効化
  delete req.session._csrf;
  res.clearCookie("_csrf");

  let search = req.session.search;
  res.render('shop/shop_cartin', { syouhin, data, price, member, search });
});

// カートの中身を見る
router.get('/shop_list', upload.single('gazou'), async function (req, res) {
  let rows = await product_check.getList(req,res);
  let kazu = req.session.kazu;
  let member = req.session.member;
  let search = req.session.search;
  // let fileName = req.file.originalname
  res.render('shop/shop_list', { rows, kazu, member, search });
});

// カートを空にする
router.get('/shop_clear', function (req, res) {
  product_check.reset_cartin(req, res);

  // セッションにあるカート関連情報リセット
  req.session.cart = '';
  req.session.kazu = '';
  req.session.price = '';
  syouhin = [];
  // let fileName = req.file.originalname
  res.render('shop/shop_clear');
});

// カートの数量変更
router.post('/changeKazu', async function(req, res) {
  // セッション内の数量情報更新
  let num = req.body.kazu;
  let index = req.body.index;
  req.session.kazu[index] = num;

  // セッション情報からカート内の情報取得
  let rows = await product_check.getList(req,res);

  // 再計算のため一度リセットしてから価格情報更新
  req.session.price = 0; 
  let i = 0;
  for( row of rows) {
    req.session.price += row.price * req.session.kazu[i];
    i++;
  }

  // 会員ログインしてる場合、cartテーブルの数量更新
  if(req.session.member){
    product_check.changeCartKazu(req,res);
  }
  res.send('更新しました');
});

// カート内の商品削除
router.delete('/deleteIndex', async function(req, res) {
  let index = req.body.index;
  for(let i = index.length; i>0; i--) {
    req.session.cart.splice(index[i-1], 1);
    syouhin.splice(index[i-1], 1);
    req.session.kazu.splice(index[i-1], 1);
  }

  // セッション情報からカート内の情報取得
  let rows = await product_check.getList(req,res);

  // 再計算のため一度リセットしてから価格情報更新
  req.session.price = 0; 
  let i = 0;
  for( row of rows) {
    req.session.price += row.price * req.session.kazu[i];
    i++;
  }

  product_check.delCartProduct(req,res);
  res.send('カート内から商品を削除しました。');
});

// 購入手続き画面へ
router.get('/shop_form', function (req, res) {
  res.render('shop/shop_form');
});

// 購入手続き確認画面へ
router.post('/shop_form_check', function (req, res) {
  let data = req.body;

  // 新規に 秘密文字 と トークン を生成
  // ページリロードしたときクエリ情報を持てない為これを使用する
  let secret = tokens.secretSync();
  let token = tokens.create(secret);

  // 秘密文字はセッションに保存
  req.session._csrf = secret;
  // トークンはクッキーに保存
  res.cookie("_csrf", token);

  res.send(data);
});

router.get('/shop_form_check', async function (req, res) {
  // 一週間後の年月日をデフォルトのお届け予定日に設定
  let now = dayjs().add(0,'hour').add(7,'days');
  let date = {
    year:now.format('YYYY'),
    month:now.format('M'),
    day:now.format('D'),
  }

  let rows = await product_check.getList(req,res);
  let kazu = req.session.kazu;

  let secret = req.session._csrf;
  let token = req.cookies._csrf;
  
  // 秘密文字 と トークン の組み合わせが正しいか検証
  // ページリロード　ブラウザバックからの入力フォームのボタン押したとき
  // セッションに入ってる入力フォーム情報を取得して確認画面へ遷移する
  if (tokens.verify(secret, token) === false) {
    let data = req.session.formData;
    return res.render('shop/shop_form_check', { data, date, rows, kazu });
  }

  let data = JSON.parse(req.query.data);
  req.session.formData = data;

  // 使用済み 秘密文字 と トークン の無効化
  delete req.session._csrf;
  res.clearCookie("_csrf");

  res.render('shop/shop_form_check', { data, date, rows, kazu });
});

// 購入手続き完了画面へ
router.post('/shop_form_done', async function (req, res) {
  // DBに価格追加処理
  let lastcode = await product_check.dat_sales(req, res);
  let contents = await product_check.dat_sales_product(req, res, lastcode);

  let text = '';
  let goukei = 0;

  // メール本文作成
  for (let i=0; i<contents.length; i++) {
    let total = contents[i].price*contents[i].quantity;
    text = text + 
           contents[i].name +' '+ 
           contents[i].price +'円×' + 
           contents[i].quantity + '個='+
           total +'円<br>'
    goukei += total;
  }

  // メール送信
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    substitutions: {
      customer: req.session.formData.name,
      // productName: contents.name,
      // price: contents.price,
      // quantity: contents.quantity,
      text: text,
      goukei: goukei
  },
   to: 'shogo123198@gmail.com',
  //  from: 'test@example.com',
  //  name: 'ろくまる農園',
   from: {
     email: 'test@example.com',
     name: 'ろくまる農園'
   },
   subject: '商品のご購入が確定いたしました。',
  //  text: 'and easy to do anywhere,<br> even with Node.js< ',
   html: '<strong>{{customer}}様<br><br>'+
         'この度はご注文ありがとうございました。<br><br>'+
         'ご注文商品一覧<br>'+
         '-------------------------------------<br>'+
        //  '{{productName}} {{price}}円×{{quantity}}個<br>'+
        //  '合計:{{price*quantity}}円<br>'+
         '{{text}}'+
         '合計:{{goukei}}円<br>'+
         '-------------------------------------'+
        //  ''+
        //  ''+
        //  ''+
         '</strong>',
  };
  sgMail.send(msg);

  // セッション情報とカートを空にする
  req.session.cart = '';
  req.session.kazu = '';
  req.session.price = '';

  syouhin = [];

  // 新規に 秘密文字 と トークン を生成
  // ページリロードしたときクエリ情報を持てない為これを使用する
  let secret = tokens.secretSync();
  let token = tokens.create(secret);

  // 秘密文字はセッションに保存
  req.session._csrf = secret;
  // トークンはクッキーに保存
  res.cookie("_csrf", token);
  
  res.send(req.body);
});

router.get('/shop_form_done', function(req, res) {
  let data = req.session.formData;
  let secret = req.session._csrf;
  let token = req.cookies._csrf;

  // 秘密文字 と トークン の組み合わせが正しいか検証
  // ページリロード　（ブラウザバックからの注文確定ボタン押したとき）
  // セッションに入ってる入力フォーム情報を取得して購入完了画面へ遷移する
  if (tokens.verify(secret, token) === false) {
    // let data = req.session.formData;
    return res.render('shop/shop_form_done', { data });
  }

  // req.session.formData = '';
  // 使用済み 秘密文字 と トークン の無効化
  delete req.session._csrf;
  res.clearCookie("_csrf");

  res.render('shop/shop_form_done', { data });
});

// 会員ログイン
router.get('/login', function(req, res) {
  let address = !req.session.address ? '' : req.session.address;
  let token = ""
  
  // ログイン画面が遷移元の場合、Cookie取得
  if(req.header('Referer') === 'http://localhost:3001/login' ) {
    token = req.cookies.key;
  }

  res.render('shop/member_login',{ address, token });
});

// 会員ログインチェック
router.post('/member_login_check', async function(req, res) {
  let address = req.body.address;
  let pass = req.body.pass;
  let member;
  let memberZyoho

  // 失敗してもメールアドレスだけ入力した内容を表示させるために使用
  req.session.address = address;

  // DB接続
  let connection = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database : 'shop'
  });

  // connection.connect(); ここ不要
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query)
  try {
    // 会員名取得
    let result1 = await connection.query('SELECT name,code FROM dat_member WHERE email = ? AND password = ?',[address, pass]);

    if (result1.length === 0) {
      res.sendStatus(500);
      return false;
    }

    memberZyoho = result1.map((row) => {
      let data = {
        name: row.name,
        code: row.code
      };
      return data;
    });

    // セッションに会員名と会員コードを追加
    req.session.member = memberZyoho[0].name;
    req.session.code = memberZyoho[0].code;
    member = req.session.member;

    // cartテーブルからログインユーザのカートの中身を取得
    let cartData = await connection.query('SELECT * FROM cart WHERE memberCode = ?',[req.session.code]);
    let getCartData = [];
    let getKazuData = [];
    // cartテーブルに情報があればセッションに追加
    if(cartData.length !== 0) {
      for (let i = 1; i < 11; i++) {
        let cart = 'cart' + i;
        let kazu = 'kazu' + i;
        if(cartData[0][cart] && cartData[0][kazu]) {
          getCartData.push(cartData[0][cart]);
          getKazuData.push(cartData[0][kazu]);
        }
      }
      req.session.cart = getCartData;
      req.session.kazu = getKazuData;
      await product_check.editSessionPrice(req, res);
    }

    // 商品情報取得
    // ログイン成功ならルートに戻るため、不要
    // let result2 = await connection.query('SELECT code,name,price FROM mst_product');
    // rows = result2.map((row) => {
    //   let data = {
    //     code: row.code,
    //     name: row.name,
    //     price: row.price
    //   };
    //   return data;
    // });

    // 切断
    connection.end((err) => {
      if (err) throw err;
      console.log('切断 to mysql');
    });

    res.send('200');
  }
  catch (err) {
    throw new Error (err);
  }
});

// 会員ログアウト
router.get('/logout', function(req, res) {
  req.session.destroy(async function(err) {
    let rows = await product_check.getProductData(req,res);
    let member = '';
    syouhin = [];
    let search = ''
    res.render('shop/shop', { rows, member, search });
  });
});

// 会員簡単注文押したとき
router.get('/shop_kantan_check', async function(req, res) {
    let code = req.session.code;
    let member;
    let search = req.session.search;

    // DB接続
    let connection = mysql.createPool({
      host : 'localhost',
      user : 'root',
      password : '',
      port : 3306,
      database : 'shop'
    });
      
    // connection.connect(); ここ不要
    // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
    connection.query = util.promisify(connection.query)
    try {
      // 会員情報取得
      let result = await connection.query('SELECT name,email,postal1,postal2,address,tel FROM dat_member WHERE code=?',[code]);
      // 会員情報の抜出
      member= result.map((row) => {
        let data = {
          name: row.name,
          email: row.email,
          postal1: row.postal1,
          postal2: row.postal2,
          address: row.address,
          tel: row.tel
        };
        return data;
      });
      // 切断
      connection.end((err) => {
        if (err) throw err;
        console.log('切断 to mysql');
      });
    }
    catch (err) {
      throw new Error(err)
    }

    let rows = await product_check.getList(req,res);
    let kazu = req.session.kazu;

    // 一週間後の年月日をデフォルトのお届け予定日に設定
    let now = dayjs().add(0,'hour').add(7,'days');
    let date = {
      year:now.format('YYYY'),
      month:now.format('M'),
      day:now.format('D'),
    }

    // let rows = await product_check.getProductData(req,res);
    // let member = 'guest';
    res.render('shop/shop_kantan_check', { member, search, rows, kazu, date });
});

// 会員簡単注文OKのとき
router.post('/shop_kantanform_done', async function(req, res) {
  let lastcode = await product_check.dat_sales(req, res);
  let contents = await product_check.dat_sales_product(req, res, lastcode);
  product_check.reset_cartin(req, res);
  let data = req.body;
  let text = '';
  let goukei = 0;

  // メール本文作成
  for (let i=0; i<contents.length; i++) {
    let total = contents[i].price*contents[i].quantity;
    text = text + 
           contents[i].name +' '+ 
           contents[i].price +'円×' + 
           contents[i].quantity + '個='+
           total +'円<br>'
    goukei += total;
  }
  // メール送信
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    substitutions: {
      customer: data.name,
      // productName: contents.name,
      // price: contents.price,
      // quantity: contents.quantity,
      text: text,
      goukei: goukei
  },
   to: 'shogo123198@gmail.com',
  //  from: 'test@example.com',
  //  name: 'ろくまる農園',
   from: {
     email: 'test@example.com',
     name: 'ろくまる農園'
   },
   subject: '商品のご購入が確定いたしました。',
  //  text: 'and easy to do anywhere,<br> even with Node.js< ',
   html: '<strong>{{customer}}様<br><br>'+
         'この度はご注文ありがとうございました。<br><br>'+
         'ご注文商品一覧<br>'+
         '-------------------------------------<br>'+
        //  '{{productName}} {{price}}円×{{quantity}}個<br>'+
        //  '合計:{{price*quantity}}円<br>'+
         '{{text}}'+
         '合計:{{goukei}}円<br>'+
         '-------------------------------------'+
        //  ''+
        //  ''+
        //  ''+
         '</strong>',
  };
  sgMail.send(msg);

  // セッション情報とカートを空にする
  req.session.cart = '';
  req.session.kazu = '';
  req.session.price = '';

  syouhin = [];

  res.send(200);
});

// 会員簡単注文OKステータスの時
router.get('/shop_kantanform_done', async function(req, res) {
  let data = {
    name:req.session.member
  }
  res.render('shop/shop_form_done', { data });
});

// 新規登録
router.get('/newAccount', function(req, res) {
  res.render('shop/new_account');
});

// 新規登録DB追加
router.post('/newAccount_register', async function(req, res) {
  let data = await product_check.dat_member(req, res);
  if(data) {
    res.send(200);
  }
});

// 検索
router.get('/shop_search', async function (req, res) {
  let result = await product_check.dat_search(req, res);
  let member = req.session.member;
  let search = req.query.search;
  req.session.search = search;
  res.render('shop/shop_search', { result, member, search });
});

// ほしいものリスト画面
router.get('/shop_wishList', async function (req, res) {
  // ゲストユーザがトップ戻った時、いったんform内容を空にする
  // if (req.session.formData) { req.session.formData = ''; }

  // 新規に 秘密文字 と トークン を生成
  let secret = tokens.secretSync();
  let token = tokens.create(secret);

  // 秘密文字はセッションに保存
  req.session._csrf = secret;
  // トークンはクッキーに保存
  res.cookie("_csrf", token);

  let now = dayjs();
  let date = {
    year:now.format('YYYY'),
    month:now.format('M'),
    day:now.format('D'),
  };

  let rows = await product_check.getWishlistData(req,res);
  let member = req.session.member;
  let search = req.session.search;
  res.render('shop/shop_wishList', { rows, member, search,date });
});

// ユーザ情報編集画面
router.get('/edit_account', async function(req, res) {
  try {
    let data = await product_check.getUserData(req,res);
    res.render('shop/edit_account', {data});
  }
  catch (err) {
    throw new Error(err)
  }
});

// ユーザ情報のDB更新処理
router.post('/editAccount', async function(req, res) {
  try {
    let data = await product_check.edit_dat_member(req, res);
    if(data) {
      res.send(200);
    }
  }
  catch (err) {
    throw new Error(err)
  }
});

module.exports = router;