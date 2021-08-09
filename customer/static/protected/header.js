$(function() {
  $('.title').on('click', () => {
    location.href = '/';
  });
  
  $('.searchBtn').on('click', (e) => {
    search();
  });

  $('.searchBox').on('keypress', (e) => {
    if (e.keyCode === 13) {
      search();
    }
  });

  $(".menu li").hover(
    function() {
      $(this).addClass('addtest');
      $(this).children(".menuSub").addClass("open");
      $('#fadeLayer').css('visibility','visible');
      //hoverが外れた場合
    }, function() {
      $(this).removeClass('addtest');
      $(this).children(".menuSub").removeClass("open");
      $('#fadeLayer').css('visibility','hidden');
    }
  );

  // ほしいものリストを見る
  $('.wishList').on('click', () => {
    let getjson = localStorage.getItem('wishList');
    location.href ='./shop_wishList?list=' + encodeURIComponent(getjson);
  });

  // ユーザ情報を編集する
  $('.userEdit').on('click', () => {
    location.href ='./edit_account';
  });

  // 🍔メニュークリック処理
  $('.burger-btn').on('click',function(){
    $('.burger-btn').toggleClass('close');
    $('.nav-wrapper').toggleClass('slide-in');
    // $('.nav-wrapper').fadeToggle(300);
  });

  // 🍔メニュー表示・非表示の切り替え
  $(window).resize(function () {
    let width = $(this).width();
    judgmentMenu(width);
  });

  $(window).on('load', function () {
    let width = $(this).width();
    judgmentMenu(width);
  });
});

function search () {
  let search = $('.searchBox').val();
  // 未入力ならトップに戻る
  if (!search) { return location.href ='/'; }
  
  location.href = './shop_search?search=' + encodeURIComponent(search);    
};

function judgmentMenu(width) {
  if (width === 820) {
    $('.nav-wrapper').removeClass('slide-in');
    $('.burger-btn').removeClass('close');
    $('.burger-btn').removeClass('hidden');
    $('.login').addClass('hidden');
  }
  else if(width < 820) {
    // 820px以下の場合
    $('.nav-wrapper').removeClass('hidden');
    $('.burger-btn').removeClass('hidden');
    $('.burger-btn').removeClass('close');
    $('.login').addClass('hidden');
  }
  else { 
    // 820px以上の場合
    $('.nav-wrapper').removeClass('slide-in');
    $('.burger-btn').addClass('hidden');
    $('.login').removeClass('hidden');
  }
}