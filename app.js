const express = require("express");
const cookie = require("cookie-parser");
const session = require("express-session");
const mysql = require('mysql');
const app  = express();
const port = process.argv[2];
const PORT = process.env.PORT || 5000

// テンプレートエンジンをEJSに設定
// store,customerの様に複数プロジェクトがある場合は第2、第3引数にpathを記述
// if(port === "3001") {
  app.set('views', './customer/views');
  app.set('view engine', 'ejs');
// }
// else if( port === "3002") {
//   app.set('views', './store/views');
//   app.set('view engine', 'ejs');
// }

// public配下の静的ファイルは無条件に公開
// app.use('/store/static', express.static(__dirname+'/store/static'));
app.use('/customer/static', express.static(__dirname+'/customer/static'));

// ミドルウエアの設定
app.use(cookie());
app.use(session({
  secret: "YOUR SECRET SALT",
  resave: false, 
  saveUninitialized: true,
  cookie:{
    httpOnly: true, // クライアント側でクッキー値を見れない、書きかえれないようにするオプション
    secure: false, // httpsで使用する場合はtrueにする。今回はhttp通信なのでfalse
    maxAge: 1000 * 60 * 30 // セッションの消滅時間。単位はミリ秒。ミリ秒は千分の一秒なので1000 * 60 * 30で30分と指定。
    }
}));
// req.bodyをとるために必要
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ルーティングの設定
// app.use('/', require('./routes/index.js'));
// app.use('/', require('./customer/routes/shop.js'));
// app.use('/staff', require('./store/routes/staff.js'));
// app.use('/list', require('./store/routes/list.js'));
// app.use('/product', require('./store/routes/product.js'));
// app.use('/order', require('./store/routes/order.js'));

app.listen(PORT, () => {
  app.use('/', require('./customer/routes/shop.js'));
  console.log(`Listening on ${PORT}`);
});

// app.use('/about', require('./routes/about.js'));
// app.use('/', require('./routes/'));
// app.use('/', require('./routes/index.js'));
// app.use('/', require('./staff_product/routes/logon.js'));
// DB接続
// let connection = mysql.createConnection({
//   host : 'localhost',
//   user : 'root',
//   password : '',
//   port : 3306,
//   database : 'shop'
//   });
  
//   connection.connect();
  
//   connection.query('SELECT * from mst_staff;', (err, rows, fields) => {
//   if (err) throw err;
  
//   console.log('The solution is: ', rows);
//   });
  
  // connection.end();

// HTTPサーバを起動する
// 3001:販売サイト側　3002:商品設定側
// if(process.argv[2] === "3001") {
//   app.listen(port, () => {
//     app.use('/', require('./customer/routes/shop.js'));
//     console.log(`listening at http://localhost:${port}`);
//   });
// }
// else if (process.argv[2] === "3002") {
//   app.listen(port, () => {
//     app.use('/', require('./store/routes/logon.js'));
//     console.log(`listening at http://localhost:${port}`);
//   });
// }