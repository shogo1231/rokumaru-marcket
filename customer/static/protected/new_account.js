$(function(){
  // 登録ボタン有効フラグ
  let registerFlg = false;

  // タイトルロゴクリック時
  $('.logo').on('click', () => {
    location.href = '/';
  });

  // 入力フォーム確認
  $('input').on('change', (e) => {
    let inputArea = e.target.name;
    // クラス
    const error_class       = 'errors';

    // エラーメッセージ
    const required_message  = '必須入力です。';
    const mail_message      = 'メールアドレスの形式で入力して下さい。';
    const tel_message       = '電話番号は半角数字で入力して下さい。';
    const postcode_message  = '郵便番号は半角数字で入力して下さい。';
    const pass_message       = 'パスワードが一致しません。';
    const checkbox_message  = 'いずれか１つをチェックして下さい。';

    // 正規表現
    // const mail_check = "^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
    const mail_check    = /[a-zA-Z0-9_-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9\.]+/;
    const tel_check     = /[0-9]/; // 1もじいじょうでOK
    const postal1_check = /[0-9]{3}/; // 3もじいじょうならOK 
    const postal2_check = /[0-9]{4}/; // 4もじいじょうならOK 
    // const postcode_check    = "^[0-9]{3}-[0-9]{4}$";
  
    const funcs = {
      'name': require.bind(this, $('#name'),required_message),
      'mail': validate.bind(this, $('#mail'),mail_message,mail_check),
      'postal1': validate.bind(this, $('#postal1'),postcode_message,postal1_check),
      'postal2': validate.bind(this, $('#postal2'),postcode_message,postal2_check),
      'address': require.bind(this, $('#address'),required_message),
      'tel': validate.bind(this, $('#tel'),tel_message,tel_check),
      'pass': password.bind(this, $('#pass'),pass_message),
      'pass2': password.bind(this, $('#pass2'),pass_message)
    }

    if(inputArea !== 'danjo' || inputArea !== 'birth') {
      if(funcs.inputArea !== null) {
        funcs[inputArea]();
      }
    }

    // メール・郵便番号・電話番号の入力確認（内容によってバリデーションの表示を切り替える）
    function validate(attr,message,check) {
      if(!attr.val()) {
        attr.addClass(error_class);
        attr.next('span').text(required_message);
        registerFlg = true;
      }
      else if (!check.test(attr.val())) {
        attr.addClass(error_class);
        if (attr[0].id === "postal1" || attr[0].id === "postal2") {
          $('span[name="postal"]').text(message);
          registerFlg = true;
        }
        else {
          attr.next('span').text(message);
          registerFlg = true;
        }
      }
      else {
        attr.removeClass(error_class);
        attr.next('span').text('');
        registerFlg = false;
      }
    }

    // 名前・住所の入力確認（柔軟性上げるため特に入力制限はしない）
    function require(attr,message) {
      if(!attr.val()) {
        attr.addClass(error_class);
        attr.next('span').text(message);
        registerFlg = true;
      } else {
        attr.removeClass(error_class);
        attr.next('span').text('');
        registerFlg = false;
      }
    }

    // パスワードの確認（必須であること、一致していないこと）
    function password(attr,message) {
      if(!attr.val()) {
        $('#pass').addClass(error_class);
        attr.next('span').text(required_message);
        registerFlg = true;
      }
      else if ($('#pass').val() !== $('#pass2').val()) {
        $('#pass').addClass(error_class);
        $('#pass').next('span').text(message);
        registerFlg = true;
  }
      else {
        $('#pass').removeClass(error_class);
        attr.next('span').text('');
        registerFlg = false;
      }
    }

    // 登録ボタン有効化チェック
    checkRegister(error_class);
    
    //チェックボックスの必須チェック（１つ以上）
    // $('input[type="checkbox"]').each(function () {
    //   let checkedsum;
    //   let name = $(this).attr('name');
    //   checkedsum = $("input[name='" + name + "']:checked").length;
    //   if (checkedsum > 0) {
    //     $(this).parent().removeClass(error_class);
    //     $(this).parent().find('span').text('');
    //   } else {
    //     $(this).parent().addClass(error_class);
    //     $(this).parent().find('span').text(checkbox_message);
    //   }
    // });
    
    // エラーがあればフラグ変更
    // $('input').each(function() {
    //   for(let i=0; i<this.classList.length; i++) {
    //     console.log($(this.classList[i]));
    //     if($(this.classList[i]) === 'errors') {
    //       registerFlg = true;
    //       return;
    //     }
    //     else{
    //       registerFlg = false;
    //     }
    //   }
    // });
  });

  // 登録処理
  $(".register").on('click', (e) => {
    // エラーか未入力項目があれば中断
    let count = 0;
    if(registerFlg === true) {　return false;　}

    $('input').each(function(index, val) {
      if(!val.value) {
        count++;      
      }
    });
    if(count !== 0) {　
      alert('未入力項目があります。');
      return false;
    }

    if (confirm('入力内容で登録します。よろしいですか？')) {
      // formタグ内のデータを文字列データに変換
      let formData = $("form").serialize();
      console.log(formData);

      $.ajax('./newAccount_register',{
        type: 'POST',
        data: formData
      })
      .done(function(){
        alert('登録しました。');
        location.href = './login';
      })
      .fail(function() {
        alert('失敗しました。');
      })
    }
  });

  // 更新処理
  $(".edit").on('click', (e) => {
    // エラーか未入力項目があれば中断
    let count = 0;
    if(registerFlg === true) {　return false;　}

    $('input').each(function(index, val) {
      if(!val.value) {
        count++;      
      }
    });
    if(count !== 0) {　
      alert('未入力項目があります。');
      return false;
    }

    if (confirm('入力内容で登録します。よろしいですか？')) {
      // formタグ内のデータを文字列データに変換
      let formData = $("form").serialize();
      console.log(formData);

      $.ajax('./editAccount',{
        type: 'POST',
        data: formData
      })
      .done(function(){
        alert('登録しました。');
      })
      .fail(function() {
        alert('失敗しました。');
      })
    }
  });


  /**
   * 入力不備か未入力が１個でもあれば登録ボタンを無効化する
   * @param {*} error_class 
   */
  function checkRegister(error_class) {
    if($('input').hasClass(error_class)) {
      $("button[name='register']").prop('disabled', true);
      $("button[name='edit']").prop('disabled', true);
    }
    else {
      $("button[name='register']").prop('disabled', false);
      $("button[name='edit']").prop('disabled', false);
    }
    
    for (input of $('input')) {
      if (!input.value) {
        $("button[name='register']").prop('disabled', true);
        $("button[name='edit']").prop('disabled', true);
      };
    };
  }

  // 勉強用（関数配列の作り方）
  // $(window).on('load' ,() => {
  //   let which = 'huga';
  //   const funcs = {
  //     'hoge': showAlert.bind(),
  //     'huga': showAlert.bind(this, 'hugahuga'),
  //     'piyo': showAlert.bind(this, 'piyopiyo'),
  //   }
  //   function showAlert(msg='aaa') {
  //     alert(msg);
  //   }
  //   if(funcs.which !== null) {
  //     funcs[which]();
  //   }
  // });
});