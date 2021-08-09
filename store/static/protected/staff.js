$(function() {
  $('#back').on('click', (e) => {
    history.back();
  });

  $('#deleteBtn').on('click', (e) => {
    if(!confirm('削除します。')) { return; }

    let code = $('input:radio[name="staffcode"]:checked').val();
    let deleteCode = {
      code: code
    };
    $.ajax('./list/delete',{
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
    let val = $('input:radio[name="staffcode"]:checked').val();
    let url = './staff/reference?code=' + encodeURIComponent(val);
    location.href = url;
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

  $(document).on('click', '.test', (e) => {
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