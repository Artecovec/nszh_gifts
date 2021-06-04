$(function () {

  var $body = $('body');
  var $activationCall = $('.js-activation-call');
  var $popupActivationOverlay = $('.js-activation-overlay');
  var $activationFaq = $('.js-activation-faq');
  var windowWidth = $(window).width();
  var needHash = 'activation';


  /**
   * open popup by hash
   */
  function getHash() {
    var hash = window.location.hash;

    if (hash.replace('#','') == needHash){
      $popupActivationOverlay.fadeIn(0).addClass('show');
      $body.addClass('overflow');
      widthTabsMain();
    }
  }
  getHash();


  /**
   * on close click
   */
  $('.js-popup-close', $popupActivationOverlay).on('click', function (e) {
    e.preventDefault();
    closePopup();
  });

  /**
   * count tabs for their width
   */
  function widthTabsMain() {
    $('.b-main-tabs__tabs').each(function () {
      var $thisTabs = $('.js-tabs', $(this));
      var heightTab = 0;
      $thisTabs.css({'min-height': '0px'});

      if ($thisTabs.hasClass('b-main-tabs__tabs_link')){
        var width = 100 / $thisTabs.length;
        $thisTabs.closest('li').css({'max-width': width+'%'});

        $thisTabs.css('min-height', 0);
        $thisTabs.each(function () {
          if ($(this).outerHeight(true) > heightTab)
            heightTab = $(this).outerHeight(true)
        });
        $thisTabs.css({'min-height': heightTab+'px'});
      }
    });
  }

  /**
   * open popup activation
   */
  $activationCall.on('click', function (e) {
    e.preventDefault();
    $popupActivationOverlay.fadeIn(250).addClass('show');
    $body.addClass('overflow');
    widthTabsMain();
    window.location.hash = '#'+needHash;
  });

  /**
   * func close popup
   */
  function closePopup() {
    $popupActivationOverlay.fadeOut(250).removeClass('show');
    $body.removeClass('overflow');
    window.location.hash = '';
  }

  /**
   * close popup if esc
   */
  $(document).keyup(function (e) {
    if (e.which == 27 && $popupActivationOverlay.is(':visible')) {
      closePopup();
    }
  });

  $(window).on('resize', function () {
    windowWidth = $(window).width();
  });

});