// $(function() {
  function kazu (e) {
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
  };

export { kazu };
// });
  
