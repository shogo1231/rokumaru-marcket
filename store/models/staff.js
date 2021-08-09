const mysql = require('mysql');
const util = require('util');

module.exports.index = function(req, res){
  let name = req.body.name;
  let pass = req.body.pass;
  let pass2 = req.body.pass2;

  if( name === '') {
    name = 'スタッフ名が入力されていません。';
  };

  if( pass === '') {
    pass = '';
  };

  if( pass !== pass2) {
    pass2 = 'not equall';
  };

  let data = {
      name: name,
      pass: pass,
      pass2: pass2
      // _csrf: request.body._csrf
  };
  return data;
};

module.exports.edit = function(req, res){
  let code = req.body.code;
  let name = req.body.name;
  let pass = req.body.pass;
  let pass2 = req.body.pass2;

  if( name === '') {
    name = 'スタッフ名が入力されていません。';
  };

  if( pass === '') {
    pass = '';
  };

  if( pass !== pass2) {
    pass2 = 'not equall';
  };

  let data = {
    code: code,
    name: name,
    pass: pass,
    pass2: pass2
    // _csrf: request.body._csrf
  };
  return data;
};

module.exports.ref = async function(req, res, code){
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
    let columns = ['name', 'password'];
    let result = await connection.query('SELECT ?? FROM mst_staff WHERE code = ?', [columns, code]);
    a = result.map((row) => {
      let data = {
        code: code,
        name: row.name,
        pass: row.password
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

module.exports.staff = function(req, res){
  let name = req.body.name;
  let pass = req.body.pass;

  let staff_data = {
      name: name,
      password: pass,
      // _csrf: request.body._csrf
  };

  // DB接続
  let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database : 'shop'
    });
    
    connection.connect();
    
    connection.query('insert into mst_staff set ?', staff_data, (err, res) => {
    if (err) throw err;
    
    console.log(staff_data.name);
    console.log(staff_data.password);

    // 切断
    connection.end((err) => {
      if (err) throw err;
        console.log('切断 to mysql');
      });
    });
    return staff_data;
};

module.exports.update = function(req, res){
  let code = req.body.code;
  let name = req.body.name;
  let pass = req.body.pass;

  let staff_data = {
    code: code,
    name: name,
    password: pass,
    // _csrf: request.body._csrf
  };

  // DB接続
  let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database : 'shop'
    });
    
    connection.connect();
    
    connection.query('UPDATE mst_staff SET name = ?,password = ? WHERE code = ?', [name, pass, code], (err, res) => {
    if (err) throw err;
    
    console.log(staff_data.name);
    console.log(staff_data.password);

    // 切断
    connection.end((err) => {
      if (err) throw err;
        console.log('切断 to mysql');
      });
    });
    return staff_data;
};

module.exports.deleteData = function (req, res) {
  let code = req.body.code;
  let a;
  let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database : 'shop'
    });
    
  // この行がポイント！ queryが非同期だからここの処理が完了するまでreturnに進まないようにしている？
  connection.query = util.promisify(connection.query)

  try {
    connection.query('DELETE FROM mst_staff WHERE code = ?', [code], (err, res) => {
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