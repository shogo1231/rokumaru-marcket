const mysql = require('mysql');
const util = require('util');

module.exports.getStaffData =async function (req, res) {
  let a;
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
    let result = await connection.query('SELECT code,name FROM mst_staff');
    a = result.map((row) => {
      let data = {
        code: row.code,
        name: row.name,
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

module.exports.getStaffOneData = async function(req,res) {
  let staffcode = req.body.staffcode;
  let a;
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
    let result = await connection.query('SELECT code,name FROM mst_staff WHERE code = ?',[staffcode]);
    a = result.map((row) => {
      let data = {
        code: row.code,
        name: row.name,
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