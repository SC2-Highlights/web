$(".side-bar-button").click(function() {
  $("#side-bar").toggleClass('active');
  $("#side-bar-remainder").toggleClass('active');
});

$("#side-bar-remainder").click(function() {
  $("#side-bar").toggleClass('active');
  $("#side-bar-remainder").toggleClass('active');
});

$(".nav-button").click(function() {
  $("#side-bar").removeClass('active');
  $("#side-bar-remainder").removeClass('active');
});
