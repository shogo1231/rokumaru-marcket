$(function() {
  $('#top').on('click', () => {
    location.href = '/';
  });

  // 削除押したとき
  $('.sakuzyo').on('click', () => {
    let deleteIndex = {};
    let elemNo = [];
    $('input[name="sakuzyo"]').each((index, element) => {
      if( ($(element).prop('checked')) ) {
        elemNo.push(index);
      }
    });

    // チェックがない場合処理を終了
    if (elemNo.length === 0) {
      alert('商品が選択されていません。');
      return false;
    }

    deleteIndex.index = elemNo;

    $.ajax('./deleteIndex',{
      type: 'DELETE',
      data: deleteIndex
    })
    .done(function(data){
      alert(data);
      location.reload();
    })
    .fail(function() {
      alert('error');
    })
  });

  // 数量変更したとき
  $('.kazu').on('change', (e) => {
    let sendKazu = {};
    let deleteIndex = {};
    let stop= false;
    let index = $('.kazu').index(e.currentTarget);

    let val = e.target.value;
    if (/[^0-9]/.test(val)) {
      alert("数字以外入ってるよ");
      stop = true;
      return;
    }
    if (!val) {
      alert("数量を入力してください。");
      stop = true;
      return;
    }

    // 入力ミスがある場合処理を終了
    if (stop === true) { return; }

    // 数量=0ならカートから消す
    if (val === "0") {
      if(confirm('削除します。よろしいですか？')) {
        deleteIndex.index = index;
        $.ajax('./deleteIndex',{
          type: 'DELETE',
          data: deleteIndex
        })
        .done(function(data){
          alert(data);
          location.reload();
        })
        .fail(function() {
          alert('error');
        })
      }
    }
    // 数量が0以上なら更新
    else {
      sendKazu.kazu = val;
      sendKazu.index = index;
  
      $.ajax('./changeKazu',{
        type: 'POST',
        data: sendKazu
      })
      .done(function(data){
        alert(data);
        location.reload();
      })
      .fail(function() {
        alert('error');
      })
    }
  });

  // 注文を確定する押したとき
  $('#order').on('click', () => {
    let formData = $("form").serialize();
    console.log(formData);

    $.ajax('./shop_kantanform_done', {
      type: 'POST',
      data: formData
    })
    .done(function() {
      location.href = './shop_kantanform_done';
    })
    .fail(function() {
      alert('error');
    })

  });
});
