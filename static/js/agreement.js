$(function () {

  var $popupOverlay = $('.js-agreement-overlay');
  var $popupCall = $('.js-call-agreement');
  var $popupCloseLink = $('.js-popup-close', $popupOverlay);

  /**
   * call popup
   */
  $popupCall.on('click', function (e) {
    e.preventDefault();
    $popupOverlay.fadeIn(250).addClass('show');
  });

  /**
   * func close popup
   */
  function closePopup() {
    $popupOverlay.fadeOut(250).removeClass('show');
  }

  /**
   * on close click
   */
  $popupCloseLink.on('click', function (e) {
    e.preventDefault();
    closePopup();
  });

  /**
   * close popup if esc
   */
  $(document).keyup(function (e) {
    if (e.which == 27 && $popupOverlay.is(':visible')) {
      closePopup();
    }
  });

});