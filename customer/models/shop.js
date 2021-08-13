const mysql = require('mysql');
const util = require('util');
// const { delete } = require('../routes/shop');
// require('array-foreach-async');

module.exports.index = function(req, res){
  let name = req.body.name;
  let price = req.body.price;

  if( name === '') {
    name = '商品名が入力されていません。';
  };

 if( /[^0-9]/.test(price)){
    price = 'husei';
  }

  let data = {
      name: name,
      price: price,
      // _csrf: request.body._csrf
  };
  return data;
};

module.exports.edit = function(req, res){
  let code = req.body.code;
  let name = req.body.name;
  let price = req.body.price;
  let gazou_old = req.body.gazou_name_old;

  if( name === '') {
    name = '商品名が入力されていません。';
  };

 if( /[^0-9]/.test(price)){
    price = 'husei';
  }

  let data = {
    code: code,
    name: name,
    price: price,
    gazou_old: gazou_old
    // _csrf: request.body._csrf
  };
  return data;
};

module.exports.ref = async function(req, res, code){
  let a;

  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });
    
  // connection.connect(); ここ不要
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query)
  try {
    let columns = ['name', 'price', 'gazou'];
    let result = await connection.query('SELECT ?? FROM mst_product WHERE code = ?', [columns, code]);
    a = result.map((row) => {
      let data = {
        code: code,
        name: row.name,
        price: row.price,
        gazou: row.gazou
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
  return a;
};

module.exports.product = async function(req, res){
  let name = req.body.name;
  let price = req.body.price;
  let gazou = req.body.gazou_name;

  let product_data = {
      name: name,
      price: price,
      gazou: gazou
      // _csrf: request.body._csrf
  };

  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });
  
  connection.connect();

  connection.query('insert into mst_product set ?', product_data, (err) => {
    if (err) throw err;
  });

  // 切断
  connection.end((err) => {
    if (err) throw err;
    console.log('切断 to mysql');
  });
}

module.exports.update = function(req, res){
  let code = req.body.code;
  let name = req.body.name;
  let price = req.body.price;
  let gazou = req.body.gazou_name;

  let product_data = {
    code: code,
    name: name,
    price: price,
    gazou: gazou
    // _csrf: request.body._csrf
  };

  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });
    
    connection.connect();
    
    connection.query('UPDATE mst_product SET name = ?,price = ?,gazou = ? WHERE code = ?', [name, price, gazou, code], (err, res) => {
    if (err) throw err;

    // 切断
    connection.end((err) => {
      if (err) throw err;
        console.log('切断 to mysql');
      });
    });
    return product_data;
};

module.exports.deleteData = function (req, res) {
  let code = req.body.code;
  let a;
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });
      
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query)

  try {
    connection.query('DELETE FROM mst_product WHERE code = ?', [code], (err, res) => {
    if (err) throw err;

    // 切断
    connection.end((err) => {
      if (err) throw err;
        console.log('切断 to mysql');
      });
    });
    a='削除しました。';
  }
  catch (err) {
    throw new Error(err)
  }
  return a;
};

module.exports.getProductData = async function (req, res) {
  let a;
  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });
  // let test = require('./database.js');
  // let connection = await mysql.createPool({ test });

  // let connection = require('./database');

  // connection.connect(); ここ不要
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query)
  try {
    let dbData = await connection.query('SELECT code,name,price,gazou FROM mst_product');
    result = dbData.map((row) => {
      let data = {
        code: row.code,
        name: row.name,
        price: row.price,
        gazou: row.gazou
      };
  
      return data;
    });
    // 切断
    connection.end((err) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log('切断 to mysql');
    });
  }
  catch (err) {
    throw new Error(err)
  }
  return result;
};

module.exports.getProductOneData = async function(req,res) {
  let code = req.query.code;
  let a;
  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });
    
  // connection.connect(); ここ不要
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query)
  try {
    let result = await connection.query('SELECT code,name,price,gazou,gazou1,gazou2 FROM mst_product WHERE code = ?',[code]);
    a = result.map((row) => {
      let data = {
        code: row.code,
        name: row.name,
        price: row.price,
        gazou: row.gazou,
        gazou1: row.gazou1,
        gazou2: row.gazou2
      };

      return data;
    });
    // 切断
    connection.end((err) => {
      if (err) throw err;
      console.log('切断 to mysql データ取得');
    });
  }
  catch (err) {
    throw new Error(err)
  }
  return a;
};

/**
 * ログイン時セッション情報にcartテーブル使って合計額計算して追加する
 * @param {*} cart 
 * @param {*} kazu 
 * @param {*} res 
 */
module.exports.editSessionPrice = async function (req, res) {
  let cart = req.session.cart;
  let kazu = req.session.kazu;
  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });
    
  // connection.connect(); ここ不要
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query);
  try {
    // この時点でprice未定義であり、NaN回避のため初期値０とする
    req.session.price = 0;
    let i = 0;
    for (productCode of cart) {
      let result = await connection.query('SELECT price FROM mst_product WHERE code = ?', [productCode]);
      req.session.price += result[0].price * kazu[i];
    };
    // 切断
    connection.end((err) => {
      if (err) throw err;
      console.log('切断 to mysql データ取得');
    });
  }
  catch (err) {
    throw new Error(err)
  }
};

module.exports.cartin = async function(req,res) {
  // 選択した商品のコード取得
  let code = req.query.code;
  // 上のコードと一致する商品情報オブジェクトリターン用変数
  let result;
  let member = req.session.member;

  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });
    
  // connection.connect(); ここ不要
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query)
  try {
    // 選択した商品のコードから情報取得
    let getData = await connection.query('SELECT code,name,price,gazou FROM mst_product WHERE code = ?',[code]);
    result = getData.map((row) => {
      let data = {
        code: row.code,
        name: row.name,
        price: row.price,
        gazou: row.gazou
      };
      return data;
    });

    // cartテーブルにカート内の商品コードとユーザコードを格納
    if (member) {
      // ここでセッションのカート情報取得する
      let addData = {};
      for (let i = 0; i < req.session.cart.length; i++ ) {
        let cart = req.session.cart[i];
        let kazu = req.session.kazu[i];
        let col1 = 'cart' + Number(i + 1);
        let col2 = 'kazu' + Number(i + 1);
        addData[col1] = cart;
        addData[col2] = kazu;
      }
      addData.memberCode = String(req.session.code);
      addData.name = member

      let loginUserData = await connection.query('SELECT * FROM cart WHERE memberCode = ?',[req.session.code]);
      if (loginUserData.length === 0) {
        connection.query('insert into cart set ?', addData, (err) => {
          if (err) throw err;
        });
      }
      else {
        connection.query('UPDATE cart set ? WHERE memberCode = ?', [addData, req.session.code], (err) => {
          if (err) throw err;
        });
      }
    }
    // 切断
    // connection.end((err) => {
    //   if (err) throw err;
    //   console.log('切断 to mysql データ取得');
    // });
  }
  catch (err) {
    throw new Error(err)
  }

  return result;
};

module.exports.delCartProduct = async function(req,res) {
  // 選択した商品のコード取得
  let code = req.query.code;
  // 上のコードと一致する商品情報オブジェクトリターン用変数
  let result;
  let member = req.session.member;

  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });
    
  // connection.connect(); ここ不要
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query)
  try {
    // 選択した商品のコードから情報取得
    let getData = await connection.query('SELECT code,name,price,gazou FROM mst_product WHERE code = ?',[code]);
    result = getData.map((row) => {
      let data = {
        code: row.code,
        name: row.name,
        price: row.price,
        gazou: row.gazou
      };
      return data;
    });

    // cartテーブルにカート内の商品コードとユーザコードを格納
    if (member) {
      // ここでセッションのカート情報取得する
      let addData = {};
      for (let i = 0; i < 10; i++ ) {
        let cart = req.session.cart[i];
        let kazu = req.session.kazu[i];
        let col1 = 'cart' + Number(i + 1);
        let col2 = 'kazu' + Number(i + 1);
        addData[col1] = cart;
        addData[col2] = kazu;
      }
      addData.memberCode = String(req.session.code);
      addData.name = member

      connection.query('UPDATE cart set ? WHERE memberCode = ?', [addData, req.session.code], (err) => {
        if (err) throw err;
      });
    }
    // 切断
    // connection.end((err) => {
    //   if (err) throw err;
    //   console.log('切断 to mysql データ取得');
    // });
  }
  catch (err) {
    throw new Error(err)
  }
};



module.exports.getList = async function(req,res) {
  let code;
  if(!req.session.cart) {
    code = '';
  }
  else {
    code = req.session.cart; // 商品のコード取得
  }
  let a = [];
  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });
    
  // connection.connect(); ここ不要
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query)
  try {
    // code.forEach( async(item) => {
      for(item of code) {
      let result =  await connection.query('SELECT code,name,price,gazou FROM mst_product WHERE code = ?',[item]);
      // let b = result.map((row) => {
        let data = {
          code: result[0].code,
          name: result[0].name,
          price: result[0].price,
          gazou: result[0].gazou
        };
        // return data;
      // });
      a.push(data);
    };
    // });
    // 切断
    connection.end((err) => {
      if (err) throw err;
      console.log('切断 to mysql');
    });
  }
  catch (err) {
    throw new Error(err)
  }
  return a;
};

module.exports.shopFormCheck = function(req, res){
  let name = req.body.name;
  let mail = req.body.mail;
  let postal1 = req.body.postal1;
  let postal2 = req.body.postal2;
  let address = req.body.address;
  let tel = req.body.tel;
  
  let chumon = req.body.chumon;
  let pass = req.body.pass;
  let pass2 = req.body.pass2;
  let danjo = req.body.danjo;
  let birth = req.body.birth;

  let postal;
  let miss = false; // 不要な可能性高い
  let data;

  // 会員登録する場合の追加確認事項
  if(chumon === "chumontouroku") {
    if(danjo === 'dan') {
      danjo ='男性';
    }
    else {
      danjo = '女性';
    }

    data = {
      name: name,
      mail: mail,
      postal1: postal1,
      postal2: postal2,
      address: address,
      tel: tel,
      pass: pass,
      danjo: danjo,
      birth: birth + '年代',
      chumon: true,
      postal: postal,
      miss: miss
      // _csrf: request.body._csrf
    };
  }
  // 会員登録しない場合
  else if(chumon === 'chumonkonkai'){
    data = {
        name: name,
        mail: mail,
        postal1: postal1,
        postal2: postal2,
        address: address,
        tel: tel,
        postal: postal,
        miss: miss
        // _csrf: request.body._csrf
    };
  }
  return data;
};

module.exports.dat_sales = async function(req, res) {
  let data = {
    code_member: 0,
    name: req.body.name,
    email: req.body.mail,
    postal1: req.body.postal1,
    postal2: req.body.postal2,
    address: req.body.address,
    tel: req.body.tel
    // _csrf: request.body._csrf
  };

  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });

  // connection.connect();
  connection.query('insert into dat_sales set ?', data, (err, res) => {
    if (err) throw err;
  });

  // 会員登録する場合、dat_memberコレクションにデータを登録
  if(req.body.chumon === 'true'){
    let addData = {
      password: req.body.pass,
      tel: req.body.tel,
      danjo: req.body.danjo,
      birth: req.body.birth
    }
    Object.assign(data,addData);
    delete data.code_member;

    connection.query('insert into dat_member set ?', data, (err, res) => {
      if (err) throw err;
    });  
  }

  let lastcode;
  connection.query = util.promisify(connection.query);
  try {
    // ここで上のqueryみたいに関数作れないからtry,catchでエラー判定を行う。ここで関数作ると処理待ちで止まる。
    lastcode = await connection.query('SELECT code FROM dat_sales ORDER BY code DESC LIMIT 1');
    // 会員登録する場合、dat_salesコレクションのcode_memberレコード更新
    if(req.body.chumon === 'true'){
      let saisinCode = await connection.query('SELECT code FROM dat_member ORDER BY code DESC LIMIT 1');
      await connection.query('UPDATE shop.dat_sales SET code_member = ? WHERE code = ?',[saisinCode[0].code, lastcode[0].code]);
    }

    // 切断
    connection.end((err) => {
      if (err) throw err;
      console.log('切断 to mysql');
    });
  }  
  catch (err) {
    throw new Error(err)
  }
  return lastcode[0].code;
};

module.exports.dat_sales_product = async function(req, lastcode) {
  let code = req.session.cart;
  let res = [];
  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });

  connection.query = util.promisify(connection.query)
  try {
    let i = 0;
    for(item of code) {
      // let lastcode = await connection.query('SELECT code FROM dat_sales ORDER BY code DESC LIMIT 1');

      let result =  await connection.query('SELECT name,price FROM mst_product WHERE code = ?',[item]);
      // let b = result.map((row) => {
        // let data = {
        //   price: result[i].price,
        // };
        // return data;
      // });
      let data = {
        code_sales: lastcode,
        code_product: req.session.cart[i],
        price: result[0].price,
        quantity: req.session.kazu[i]
      }

      let textData = {
        name: result[0].name,
        price: result[0].price,
        quantity: req.session.kazu[i]
      }
      res.push(textData);

      connection.query('insert into dat_sales_product set ?', data, (err) => {
        if (err) throw err;
      });
      i++;
      // a.push(result[i].price);
    };

    // 切断
    connection.end((err) => {
      if (err) throw err;
      console.log('切断 to mysql');
    });
  }
  catch (err) {
    throw new Error(err)
  }

  return res;
};

/**
 * cartテーブルの登録内容リセット
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports.reset_cartin = async function(req, res) {
  let addData = {};
  for (let i = 0; i < 10; i++ ) {
    let col1 = 'cart' + Number(i + 1);
    let col2 = 'kazu' + Number(i + 1);
    addData[col1] = '';
    addData[col2] = '';
  }
  // addData.memberCode = String(req.session.code);
  // addData.name = member

  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });
  
  connection.query = util.promisify(connection.query)
  try {
      connection.query('UPDATE cart set ? WHERE memberCode = ?', [addData, req.session.code], (err) => {
        if (err) throw err;
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
};

/**
 * cart内の数量更新
 * @param {*} req 
 * @param {*} res 
 */
module.exports.changeCartKazu = async function(req, res) {
  let addData = {};
  for (let i = 0; i < req.session.kazu.length; i++ ) {
    let kazu = req.session.kazu[i];
    let col = 'kazu' + Number(i + 1);
    addData[col] = kazu;
  }
  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });

  connection.query = util.promisify(connection.query)
  try {
      connection.query('UPDATE cart set ? WHERE memberCode = ?', [addData, req.session.code], (err) => {
        if (err) throw err;
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
};

/**
 * 新規登録時のDB追加処理
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports.dat_member = async function(req, res) {
  let data = {
    name: req.body.name,
    email: req.body.mail,
    postal1: req.body.postal1,
    postal2: req.body.postal2,
    address: req.body.address,
    tel: req.body.tel,
    password: req.body.pass,
    tel: req.body.tel,
    danjo: req.body.danjo,
    birth: req.body.birth
    // _csrf: request.body._csrf
  };

  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });

  connection.query = util.promisify(connection.query);
  try {
    // 会員登録するため、dat_memberコレクションにデータを登録
    connection.query('insert into dat_member set ?', data, (err, res) => {
      if (err) throw err;
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
  let result = 'ok';
  return result;
};

module.exports.dat_search = async function(req,res) {
  // 部分一致検索
  let search = '%' + req.query.search + '%';

  let a;
  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });
    
  // connection.connect(); ここ不要
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query)
  try {
    let result = await connection.query('SELECT code,name,price,gazou FROM mst_product WHERE name LIKE ?',[search]);
    a = result.map((row) => {
      let data = {
        code: row.code,
        name: row.name,
        price: row.price,
        gazou: row.gazou
      };

      return data;
    });
    // 切断
    connection.end((err) => {
      if (err) throw err;
      console.log('切断 to mysql データ取得');
    });
  }
  catch (err) {
    throw new Error(err)
  }
  return a;
};

module.exports.getWishlistData =async function (req, res) {
  let getData = JSON.parse(req.query.list);
  if(getData) {
    let codeList = [];
    getData.forEach((dataCode) => {
      codeList.push(Number(dataCode.code));
    });

    // DB接続
    let connection = mysql.createConnection({
      host : 'us-cdbr-east-04.cleardb.com',
      user : 'bd9097b5094aa6',
      password : 'e06a3bc0',
      port : 3306,
      database : 'heroku_aeab7196c54ceac'
    });
          
    // connection.connect(); ここ不要
    // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
    connection.query = util.promisify(connection.query)
    try {
      let dbData = await connection.query('SELECT code,name,price,gazou FROM mst_product');
      result = dbData.filter((row) => {
        if (codeList.includes(row.code)) {
          let data = {
            code: row.code,
            name: row.name,
            price: row.price,
            gazou: row.gazou
          };
          return data;
        }
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
  } else {
    result = '';
  }
  return result;
};

/**
 * ログインユーザの情報を取得する
 */
module.exports.getUserData = async function(req, res) {
  let name = req.session.member;
  let code = req.session.code;

  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });
    
  // connection.connect(); ここ不要
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query)

  let userData = await connection.query('SELECT * FROM dat_member WHERE name = ? AND code = ?',[name, code]);
  let result = {};
  userData.forEach(row => {
    result.password = row.password;
    result.name = row.name;
    result.email = row.email;
    result.postal1 = row.postal1;
    result.postal2 = row.postal2;
    result.address = row.address;
    result.tel = row.tel;
    result.danjo = row.danjo;
    result.birth = row.birth;
  });
  // 切断
  connection.end((err) => {
    if (err) throw err;
    console.log('切断 to mysql データ取得');
  });

  return result;
}

/**
 * 新規登録時のDB追加処理
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 module.exports.edit_dat_member = async function(req, res) {
  let data = {
    name: req.body.name,
    email: req.body.mail,
    postal1: req.body.postal1,
    postal2: req.body.postal2,
    address: req.body.address,
    tel: req.body.tel,
    password: req.body.pass,
    danjo: req.body.danjo,
    birth: req.body.birth
    // _csrf: request.body._csrf
  };
  let code = req.session.code;

  // DB接続
  let connection = mysql.createConnection({
    host : 'us-cdbr-east-04.cleardb.com',
    user : 'bd9097b5094aa6',
    password : 'e06a3bc0',
    port : 3306,
    database : 'heroku_aeab7196c54ceac'
  });

  connection.query = util.promisify(connection.query);
  // dat_memberコレクションにある会員情報の更新
  connection.query(
    `UPDATE dat_member 
     SET name = ?,email = ?,postal1 = ?,postal2 = ?,address = ?,
         tel = ? ,password = ?,danjo = ?,birth = ? 
     WHERE code = ?`, 
     [data.name, data.email, data.postal1, data.postal2, data.address,
      data.tel, data.password, data.danjo, data.birth, code], (err, res) => {
    if (err) throw err;
  });  

  // 切断
  connection.end((err) => {
    if (err) throw err;
    console.log('切断 to mysql');
  });

  let result = 'ok';
  return result;
};