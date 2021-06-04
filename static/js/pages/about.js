$(function () {

  var $menuFixBlock = $('.js-about-menu-fix');
  var $menu = $('.js-about-menu');
  var $menuColumn = $('.js-about-menu-column');
  var menuHeight = $menu.outerHeight(true);
  var $body = $('body');

  var $docsPopup = $('.js-docs-popup');
  var $docsPopupClose = $('.b-docs-popup__close');
  var $docsPopupAppend = $('.js-docs-popup-append');
  var $docsCall = $('.js-doc-call');

  var windowHeight = $(window).height();
  var windowWidth = $(window).width();

  var MAGIC_OFFSET_MENU = 50;

  /**
   * call popup docs
   */
  $docsCall.on('click', function (e) {
    e.preventDefault();
    var $thisLi = $(this).closest('li');
    var text = $('p', $thisLi).html();
    $docsPopupAppend.append(text);
    $docsPopup.fadeIn(250);
    $body.addClass('overflow');
  });

  /**
   * close docs popup on click
   */
  $docsPopupClose.on('click', function (e) {
    e.preventDefault();
    closeDocsPopup();
  });

  /**
   * close docs popup if esc
   */
  $(document).keyup(function (e) {
    if (e.which == 27) {
      closeDocsPopup();
    }
  });

  /**
   * fn to close docs popup
   */
  function closeDocsPopup() {
    if ($docsPopup.is(':visible')){
      $body.removeClass('overflow');
      $docsPopup.fadeOut(250);
    }
  }

  /**
   * fix menu
   */
  function fixMenu() {
    if (windowWidth >= 768){
      var menuBoxVals = $menuFixBlock[0].getBoundingClientRect();

      if (menuBoxVals.top <= 0 && menuBoxVals.top * -1 + menuHeight <= menuBoxVals.height - MAGIC_OFFSET_MENU ){
        var scrollVal = parseInt(menuBoxVals.top * -1);
        $menu.css('transform', 'translate(0,'+scrollVal+'px)')
      } else if (menuBoxVals.top > 0){
        $menu.css('transform', 'translate(0,0)');
      }

    } else {
      $menuColumn.each(function () {
        var menuColumnVals = $(this)[0].getBoundingClientRect();

        if (menuColumnVals.top * -1 > menuColumnVals.height && !$('.js-about-menu', $(this)).hasClass('fixed')){
          $('.js-about-menu', $(this)).addClass('fixed')
        } else if (menuColumnVals.top * -1 <= menuColumnVals.height && $('.js-about-menu', $(this)).hasClass('fixed')){
          $('.js-about-menu', $(this)).removeClass('fixed')
        }
      });

      if ($menu.hasClass('open'))
        $menu.removeClass('open')
    }

  }
  fixMenu();

  /**
   * open menu on mobile
   */
  $('.active', $menu).on('click', function (e) {
    e.preventDefault();
    $menu.toggleClass('open');
  });

  $(document).on('click', function (e) {
    var $target = $(e.target);

    if (!$target.is('.b-about-section__menu_link') && $menu.hasClass('open')){
      $menu.removeClass('open')
    }
  });



  $(window).on('scroll', function () {
    fixMenu();
  });

  $(window).on('resize', function () {
    windowHeight = $(window).height();
    windowWidth = $(window).width();
    fixMenu();
  });

});