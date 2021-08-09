$(function() {

  $('.pass-check').on('click', (e) => {
    let pwd = document.getElementById("pass")
    if( $(".pass-check:checked").val() ) {
      pwd.setAttribute('type', 'text');
      // $('#pass').setAttribute('type', 'text');
    }
    else {
      pwd.setAttribute('type', 'password');
      // $('#pass').setAttribute('type', 'text');
    } 
  });

  $('#back').on('click', (e) => {
    history.back();
  });
});