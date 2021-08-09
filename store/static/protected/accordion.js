$(function() {
  // $('.hamburger').click(function() {
  //     $(this).toggleClass('active');

  //     if ($(this).hasClass('active')) {
  //         $('.globalMenuSp').addClass('active');
  //     } else {
  //         $('.globalMenuSp').removeClass('active');
  //     }
  // });

  $('.js-menu__item__link').hover(function(e) {
    $(this).toggleClass('active');

    if ($(this).hasClass('active')) {
        $('.globalMenuSp').addClass('active');
    } else {
        $('.globalMenuSp').removeClass('active');
    }    
  });
});