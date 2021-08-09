$(function() {
  $('#top').on('click', (e) => {
    location.href = '/';
  });

  $('#deleteBtn').on('click', (e) => {
    if(!confirm('削除します。')) { return; }

    let code = $('input:radio[name="productcode"]:checked').val();
    let deleteCode = {
      code: code
    };
    $.ajax('./delete',{
      type: 'DELETE',
      data: deleteCode
    })
    .done(function(data){
      alert(data);
      location.reload();
    })
    .fail(function() {
      alert('error');
    })
  });

  $('#refBtn').on('click', () => {
    let val = $('input:radio[name="productcode"]:checked').val();
    let url = './reference?code=' + encodeURIComponent(val);
    location.href = url;
  });

  $('#changeKazu').on('click', () => {
    let sendKazu = {};
    let num = [];
    let stop= false;
    $('input[name=kazu').each((index, element) => {
      if(/[^0-9]/.test(element.value)) {
        alert("数字以外入ってるよ");
        stop = true;
        return;
      }
      if(element.value<1) {
        alert("0はダメ");
        stop = true;
        return;
      }

      num.push(element.value);
    });
    if(stop === true) { return;}
    sendKazu.kazu = num;

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
  });

  $('#sakuzyo').on('click', () => {
    let deleteIndex = {};
    let elemNo = [];
    $('input[name=sakuzyo]').each((index, element) => {
      if( ($(element).prop('checked')) ) {
        elemNo.push(index);
      }
    });
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

  // 画像クリック時ページ遷移
  $('.img').on('click', (e) => {
    let imgNumber =　e.target.name;
    location.href = './shop_product?code=' + imgNumber;
  })

  // 150*150のリサイズ
  $(window).on('load', function() {
    let data = document.getElementsByClassName('img');

    for(img of data) {
      let width = img.width;
      let height = img.height;

      if (width > 150) {
        img.width = 150;
      }
      if (height > 150) {
        img.height = 150;
      }
    };
  });

  // ブラウザバック時の処理　画像のリサイズ
  window.onunload = function(){
    let data = document.getElementsByClassName('img');
    for(img of data) {
      let width = img.width;
      let height = img.height;

      if (width > 150) {
        img.width = 150;
      }
      if (height > 150) {
        img.height = 150;
      }
    };
  }
/**************************************/
// 勉強用
  $("#button").on('click', (e) => {
    let testText = $('<p>', {
      class: 'data',
      text: '表示'
    });
    let test = $('<button/>', {
      text: 'テスト',
      class: 'test'
    });

    $('.add').append(test);
    // $(testText).append(test);
  });

  // $(document).on('click', '.test', (e) => {
  //   alert('押されたよ');
  // });
  // 動的に生成された要素はdocumentから探索しないと見つからない。
  // $('.test').on('click', (e) => {

  //   alert('押されたよ');
  // });
});

// jsとcssでツールチップ出す勉強
// $(".aaa").on({
//   'mouseenter':function(){
//     var text = 'txt,pngは使えませんtxt,pngは使えません';
//     $(this).append('<div class="sample3-tooltips">'+text+'</div>');
//   },
//   'mouseleave':function(){
//     $(this).find(".sample3-tooltips").remove();
//   }
// });