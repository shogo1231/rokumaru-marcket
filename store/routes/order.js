let express = require('express');
let router = express.Router();
let path = require('path');
const mysql = require('mysql');
const util = require('util');
require('date-utils');
let {createObjectCsvWriter} = require('csv-writer');



/***********************************************************************/
// 注文ダウンロード押したとき
router.get('/order_download', function (req, res) {
  if (req.session.user) {
    res.render('order/order', { title: 'ろくまる農園'});
  }
  else {
    res.redirect('/');
  }
});

// 注文ダウンロードリクエスト受け取ったとき
router.post('/order_download_done', async function (req, res) {
  let records;
// csvファイル作成用
var dt = new Date();
var formatted = dt.toFormat("YYYYMMDDHH24MISS");
let csvfilepath =  path.resolve()+'/csv/chumon'+ formatted +'.csv'; // ファイル名可変にする
let csvWriter = createObjectCsvWriter({
    path: csvfilepath,
    header: [
      //Headerつける場合
      // {id: 'name', title: 'NAME'}
      //Headerなしの場合
      'code','date','code_member','salesname','email', //'postal1',
      'postal','address','code_product','productname','tel',
      'price','quantity'
    ],
    encoding:'utf8',
    append :false, // append : no header if true
});  
  // DB接続
  let connection = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database : 'shop'
  });
  connection.query = util.promisify(connection.query)
  // データ取得
  try {
    let a = req.body.year;
    let b = req.body.month;
    let c = req.body.day;

    if(b < 10) { b = '0' + b };
    if(c < 10) { c = '0' + c };

    let result = await connection.query(
      `SELECT	dat_sales.code,     
        dat_sales.date,
        dat_sales.code_member,
        dat_sales.name AS dat_sales_name,
        dat_sales.email,
        dat_sales.postal1,
        dat_sales.postal2,
        dat_sales.address,
        dat_sales.tel,
        dat_sales_product.code_product,
        mst_product.name AS mst_product_name,
        dat_sales_product.price,
        dat_sales_product.quantity
      FROM dat_sales,dat_sales_product,mst_product
      WHERE dat_sales.code=dat_sales_product.code_sales
      AND dat_sales_product.code_product=mst_product.code
      AND substr(dat_sales.date,1,4)=?
      AND substr(dat_sales.date,6,2)=?
      AND substr(dat_sales.date,9,2)=?`,[a,b,c]
    );
    
    if(result.length === 0) {
      res.json("一致するデータが存在しません");
      return;
    }

    // 時間の情報を生成
    let date = result[0].date;
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // 月だけ0~11扱い　1月は０、12月は１１
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();

    let nitizi = year + '/' + month + '/' + day + ' ' + hour + ':' + minute;

    records = result.map((row) => {
      let data = {
        code: row.code,
        date: nitizi,
        code_member: row.code_member,
        salesname: row.dat_sales_name,
        email: row.email,
        postal: row.postal1 + '-' + row.postal2,
        // postal1: row.postal1,
        // postal2: row.postal2,
        address: row.address,
        code_product: row.code_product,
        productname: row.mst_product_name,
        tel: row.tel,
        price: row.price,
        quantity: row.quantity
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
  //Write CSV file
  csvWriter.writeRecords(records)       // returns a promise
      .then(() => {
          console.log('...Done');
      });
  res.render('order/order_download_done', { title: 'ろくまる農園'});
});

module.exports = router;