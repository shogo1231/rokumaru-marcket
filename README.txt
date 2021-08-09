1.npm initでモジュール読み込み
2.npm install explessでモジュール読み込み
3.各質問に対して回答
4.npm install ejsでモジュール読み込み
5.app.jsファイルを一番外に作成
6.node app.jsでデバッグ
7.mysqlモジュールインストール　npm install mysql

クライアントが入力されたデータをサーバで取得(POST)するとき、bodyの中身を取り出すために必要。
app.jsに記述。
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


パスの参照について
path.resolve() 現在動かしてるファイルのカレント（EC）のところまでを絶対パスで取る
__dirName 現在動かしてるファイルの一行上のフォルダまでを絶対パスで指す
__fileName 現在動かしてるファイルまでをを絶対パスで指す