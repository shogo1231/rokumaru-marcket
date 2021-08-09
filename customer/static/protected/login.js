$('.logo').on('click', () => {
  location.href = '/';
});

$(".submit").on('click', (e) => {
  let address = $('[name = "address"]').val();
  let pass = $('[name = "pass"]').val();
  let data = {}

  if( !($('[name = "address"]').val()) && !($('[name = "pass"]').val()) ) {
    alert("メールアドレスまたはパスワードを入力");
    return false;
  }

  data.address = address;
  data.pass = pass;

  $.ajax('./member_login_check',{
    type: 'POST',
    data: data
  })
  .done(function(){
    $.removeCookie("key");
    location.href = '/';
  })
  .fail(function() {
    // alert('メールアドレスまたはパスワードが間違っています。');
    document.cookie = "key=value";
    location.href = './login';
  })
});