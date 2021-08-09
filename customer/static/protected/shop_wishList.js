$(function() {
  $('#top').on('click', (e) => {
    location.href = '/';
  });

  $('#refBtn').on('click', () => {
    let val = $('input:radio[name="productcode"]:checked').val();
    let url = './reference?code=' + encodeURIComponent(val);
    location.href = url;
  });

  $('.sakuzyo').on('click', (e) => {
    let getjson = localStorage.getItem('wishList');
    let getData = JSON.parse(getjson);

    let codeList = [];
    getData.forEach((dataCode) => {
      codeList.push(dataCode.code);
    });

    let input = e.target.parentNode.children[3];
    let code = $(input).val();

    for(let i = codeList.length-1; i >= 0; i--) {
      if (codeList[i] === code) {
        getData.splice(i,1);
      }
    }

    if (getData.length === 0) {
      localStorage.removeItem('wishList');
      location.href ='./shop_wishList?list=[{}]';

    } else {
      let setjson = JSON.stringify(getData);
      localStorage.setItem('wishList', setjson);
      location.href ='./shop_wishList?list=' + setjson;
    }
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

  // URLのクエリパラメータを隠す
  $(window).on('load' , () => {
    window.history.replaceState('','','shop_wishList');
  })

  $('.cartLink').on('click', (e) => {
    let input = e.target.parentNode.children[3];
    let data = $(input).val();
    location.href = './shop_cartin?code=' + data;
  });
 
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