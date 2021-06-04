$(function () {

  var windowWidth = $(window).width();
  var $leftColumn = $('.js-about-menu-column');
  var $sectionTabsContent = $('.b-about-section');
  var $backMobile = $('.js-back-mobile');
  var $aboutContent = $('.js-about-menu-fix');
  var $tabs = $('.b-main-tabs__tabs');
  var $questionDop = $('.js-question-dop');
  var $insertQuestionBox = $('.js-insert-question');
  var $firstState = $('.js-question-first');
  var $questionTabItem = $('.js-question-tab-item');
  var $questionTab = $('.js-question-tab');
  var $tabContent = $('.js-question-menu');
  var $aboutSection = $('.js-about-section');
  var $aboutMenuBox = $('.js-about-menu');

  $questionTab.on('click', function (e) {
    e.preventDefault();
    var thisHref = $(this).attr('href').replace('#','');

    if (!$(this).hasClass('current') && !$firstState.length){
      $aboutSection.addClass('b-about-section__first-state');
    } else if ($(this).hasClass('current') && !$firstState.length) {
      $aboutSection.removeClass('b-about-section__first-state');
    }

    $questionTab.removeClass('active');
    $(this).addClass('active');
    $tabContent.addClass('hidden');
    $('.js-question-menu[data-id="'+thisHref+'"]').removeClass('hidden');


  });

  /**
   * luch first state of has class
   */
  function sirstState() {
    if ($firstState.length && windowWidth >= 768){
      $aboutSection.addClass('b-about-section__first-state');
      var $firstItem = $questionTabItem.eq(0);
      $('.js-question-tab', $firstItem).trigger('click');
    } else if (!$firstState.length){
      var thisID = $('.b-about-section__menu_link.active').closest($tabContent).attr('data-id');
      $('.js-question-tab[href="#'+thisID+'"]').addClass('current').trigger('click');

      (windowWidth < 768) ? $tabs.addClass('hidden') : $tabs.removeClass('hidden');

    }
  }
  sirstState();

  /**
   * active tab reload
   */
  $('.b-about-section__menu_link.active').on('click', function (e) {
    e.preventDefault();
    var href = $(this).attr('href');
    window.location = href;
  });

  /**
   * append question block to another box if it appear on page
   */
  function questionPos() {
    if ($questionDop.length){
      $questionDop.appendTo($insertQuestionBox);
    }
  }
  questionPos();

  /**
   * show back tabs on mobile
   */
  $backMobile.on('click', function (e) {
    e.preventDefault();
    $aboutContent.addClass('hide');
    $tabs.removeClass('hidden');
  });

  /**
   * mobile tabs reconstruction
   */
  var tabReconstStatus = false;
  function resconstructTabs() {

    if (windowWidth < 768 && !tabReconstStatus){

      tabReconstStatus = true;

      $tabContent.each(function () {
        var thisId = $(this).attr('data-id');
        $(this).insertAfter($('.js-question-tab[href="#'+thisId+'"]'));
      });

    } else if (windowWidth > 767 && tabReconstStatus) {

      $tabContent.each(function () {
        $(this).appendTo($aboutMenuBox);
      });

    }
  }
  resconstructTabs();

  $(window).on('resize', function () {
    windowWidth = $(window).width();
    resconstructTabs();

  });

});