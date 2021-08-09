$(function() {
  $('#back').on('click', (e) => {
    history.back();
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

  $('.cartLink').on('click', () => {
    let data = $('input[name="code"]').val();
    location.href = './shop_cartin?code=' + data;
  });

  $('.addWishList').on('click', () => {
    let getjson = localStorage.getItem('wishList');
    // null回避対策
    if (!getjson) { 
      getjson = '[{}]';
    }

    let getData = JSON.parse(getjson);
    let obj = {
      'code': $('input[name="code"]').val(),
      'name': $('input[name="name"]').val()
    };

    let codeList = [];
    getData.forEach((dataCode) => {
      codeList.push(dataCode.code);
    });

    // 先頭が空なら削除
    if (!getData[0].code) {
      getData.shift();
    }
    // ほしいものリストに存在する商品が押されたときは追加しない
    if (!codeList.includes(obj.code)) {
      getData.push(obj);
      let setjson = JSON.stringify(getData);
      localStorage.setItem('wishList', setjson);
      location.href ='./shop_product?code=' + obj.code + '&status=success'
    } else {
      location.href ='./shop_product?code=' + obj.code + '&status=fail'
    }
  });

  // 画像切り替え
  $('li img').hover(
    function(e) {
      let linkHtml =e.target.outerHTML;
      $('.m-lens-container img').remove();
      $('.m-lens-container').append(linkHtml);
    },
    function() {
      // ホバーした画像を表示しておきたいから何もしない
    }
  );

  var zoomArea = document.querySelector('.zoom-area');
  var zoomImage = zoomArea.querySelector('img');
  var size = 120; // ここでm-lensの値を設定
  var scale = 520 / size;
  Array.prototype.forEach.call(document.querySelectorAll('.m-lens-container'), function(container){
    var lens = container.querySelector('.m-lens');
    var img = container.querySelector('img');
    container.addEventListener('mouseenter', function(){
      var image = container.querySelector('img');
      zoomArea.classList.add('active');
      zoomImage.setAttribute('src', image.src);
      zoomImage.style.width = (image.offsetWidth * scale) + 'px';
    });
    container.addEventListener('mouseleave', function(){
      zoomArea.classList.remove('active');
    });
    var xmax, ymax;
    img.addEventListener('load', function(){
       xmax = img.offsetWidth - size;
       ymax = img.offsetHeight - size;
    });
    container.addEventListener('mousemove', function(e){
      var rect = container.getBoundingClientRect();
      var mouseX = e.pageX;
      var mouseY = e.pageY;
      var positionX = rect.left + window.pageXOffset;
      var positionY = rect.top + window.pageYOffset;
      var offsetX = mouseX - positionX; /* コンテナの左上からの相対x座標 */
      var offsetY = mouseY - positionY; /* コンテナの左上からの相対y座標 */
      var left = offsetX - (size / 2);
      var top = offsetY - (size / 2);

      if(left > xmax){
        left = xmax;
      }
      if(top > ymax){
        top = ymax;
      }
      if(left < 0){
        left = 0;
      }
      if(top < 0){
        top = 0;
      }
      lens.style.top = top + 'px';
      lens.style.left = left + 'px';
      zoomImage.style.marginLeft = -(left * scale) + 'px';
      zoomImage.style.marginTop = -(top * scale) + 'px';
    });
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

  $(document).on('click', '.testtest', (e) => {
    alert('押されたよ');
  });
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