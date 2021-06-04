$(function () {

  var $body = $('body');
  var $header = $('.js-header');
  var windowHeight = $(window).height();
  var windowWidth = $(window).width();
  var $accumulateSection = $('.js-accumulate-section');
  var $accumulateBox = $('.js-accumulate-box');
  var accumulateBoxOffset = $accumulateBox.offset().top;
  var accumulateBoxPositionTop = $accumulateBox.position().top;
  var $accumulateSectionStop = $('.js-accumulate-section-stop');
  var $fixRazvLinks = $('.js-fix-razv-links');
  var $fixRazvLinksStop = $('.js-stop-fix-razv-links');
  var $line1 = $('.js-line-1');
  var $line2 = $('.js-line-2');
  var $razvStepsCarousel = $('.js-razv-steps');
  var $openLinksBar = $('.js-open-links');

  var LINKS_SCROLL = 160;
  var ACOOM_HEIGHT_FIRST = 190;
  var MAGIC_BOTTOM_OFFSET = 210;
  var MAGIC_BOTTOM_LINE_OFFSET = 100;
  var statusCarousel = false;

  /**
   * open links menu on mobile
   */

  $openLinksBar.on('click', function (e) {
    e.preventDefault();
    $fixRazvLinks.toggleClass('open');
  });

  /**
   * carousel for mobile or destroy
   */
  function initCarouselHowBuy() {
    if (windowWidth <= 767 && !statusCarousel){
      statusCarousel = true;
      $razvStepsCarousel.slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        touchThreshold: 20,
        adaptiveHeight: true
      });
    } else if (windowWidth > 767 && statusCarousel){
      $razvStepsCarousel.slick('unslick');
    }
  }
  initCarouselHowBuy();


  /**
   * fix scroll links razv
   */
  function foxRazvLinks() {
    var $fixRazvLinks_top = $fixRazvLinks[0].getBoundingClientRect().top;
    var $fixRazvLinksStop_top = $fixRazvLinksStop[0].getBoundingClientRect().top;

    if (windowWidth < 1200 && windowWidth >= 768){
      LINKS_SCROLL = 110;
    } else if (windowWidth < 768){
      LINKS_SCROLL = $fixRazvLinks[0].getBoundingClientRect().height
    }

    if ($fixRazvLinks_top <= LINKS_SCROLL * -1 && $fixRazvLinksStop_top >= windowHeight && !$fixRazvLinks.hasClass('fixed')){
      $fixRazvLinks.addClass('fixed').removeClass('visibility');
    } else if ($fixRazvLinks_top <= LINKS_SCROLL * -1 && $fixRazvLinksStop_top >= windowHeight && $fixRazvLinks.hasClass('visibility')){
      $fixRazvLinks.removeClass('visibility');
    } else if ($fixRazvLinks_top > LINKS_SCROLL * -1 && ($fixRazvLinks.hasClass('fixed') || $fixRazvLinks.hasClass('visibility'))){
      $fixRazvLinks.removeClass('fixed').removeClass('visibility');
    } else if ($fixRazvLinksStop_top < windowHeight && !$fixRazvLinks.hasClass('visibility')){
      $fixRazvLinks.addClass('visibility');
    }
  }
  foxRazvLinks();

  /**
   * set height to animate section
   */
  function setHeightSection() {
    var heightSection = windowHeight * 2;
    var maxHeightFirstColumn = windowHeight - accumulateBoxPositionTop;
    var line2Top = parseInt(accumulateBoxPositionTop + ACOOM_HEIGHT_FIRST + windowHeight / 2 - MAGIC_BOTTOM_LINE_OFFSET);

    $accumulateSection.css('height', heightSection+'px');
    $('.b-accumulate__column_1', $accumulateSection).css('max-height', maxHeightFirstColumn+'px');
    $line2.css('top', line2Top+'px');
  }
  setHeightSection();

  var minPrice = 1000;
  var middlePrice = 490000;
  var maxPrice = 5500000;

  /**
   * animation on scroll
   */
  function animateAccomulate() {
    var scrollTop = $(window).scrollTop();
    var $accumulateSectionStopVals = $accumulateSectionStop[0].getBoundingClientRect();
    var accumulateSection_top = $accumulateSection[0].getBoundingClientRect().top;
    var heightLast =  parseInt(windowHeight * 2 - MAGIC_BOTTOM_OFFSET - accumulateBoxPositionTop);
    var line2Top = parseInt(accumulateBoxPositionTop + ACOOM_HEIGHT_FIRST + windowHeight / 2 - MAGIC_BOTTOM_LINE_OFFSET);

    // animation height columns and stop it
    if (scrollTop >= parseInt(accumulateBoxOffset + ACOOM_HEIGHT_FIRST - windowHeight/2) && $accumulateSectionStopVals.top >= parseInt(windowHeight/2) + MAGIC_BOTTOM_OFFSET){
      var moveLine = scrollTop - parseInt(accumulateBoxOffset + ACOOM_HEIGHT_FIRST - windowHeight/2);
      var height = ACOOM_HEIGHT_FIRST + moveLine;
      $accumulateBox.css('height', height+'px');

      // line 2 motion
      if ($accumulateSectionStopVals.top > parseInt(windowHeight + MAGIC_BOTTOM_LINE_OFFSET)){
        $line2.css({'transform': 'translate(0,'+moveLine+'px)', top: line2Top+'px'});
      } else {
        var lineTopLast = heightLast + accumulateBoxPositionTop;
        $line2.css({'transform': 'translate(0,0)', top: lineTopLast+'px'});
      }

    } else if (scrollTop < parseInt(accumulateBoxOffset + ACOOM_HEIGHT_FIRST - windowHeight/2)){
      $accumulateBox.css('height', ACOOM_HEIGHT_FIRST+'px');
      $line2.css('transform', 'translate(0,0)');

    } else if ($accumulateSectionStopVals.top < parseInt(windowHeight/2) + MAGIC_BOTTOM_OFFSET){
      $accumulateBox.css('height', heightLast+'px');
    }

    // show line 1
    if (accumulateSection_top * -1 >= parseInt(windowHeight / 2) - MAGIC_BOTTOM_LINE_OFFSET && !$line1.hasClass('show')){
      $line1.addClass('show');

    } else if (accumulateSection_top * -1 < parseInt(windowHeight / 2) - MAGIC_BOTTOM_LINE_OFFSET && $line1.hasClass('show')){
      $line1.removeClass('show');
    }

    // show last point text
    if ($accumulateSectionStopVals.top <= parseInt(windowHeight/2) + MAGIC_BOTTOM_OFFSET && !$accumulateBox.hasClass('last')){
      $accumulateBox.addClass('last');
    } else if ($accumulateSectionStopVals.top > parseInt(windowHeight/2) + MAGIC_BOTTOM_OFFSET && $accumulateBox.hasClass('last')){
      $accumulateBox.removeClass('last');
    }

    // show middle text blocks and hide text on line on mobile
    if (accumulateSection_top < 0 && accumulateSection_top * -1 >= parseInt(windowHeight / 2)  && !$accumulateBox.hasClass('middle')){
      $accumulateBox.addClass('middle');
      $line1.addClass('hide-text');
    } else if (accumulateSection_top < 0 && accumulateSection_top * -1 < parseInt(windowHeight / 2) && $accumulateBox.hasClass('middle')){
      $accumulateBox.removeClass('middle');
      $line1.removeClass('hide-text');
    }

    // show middle text blocks and hide text on line on mobile
    if (scrollTop > parseInt(accumulateBoxOffset + ACOOM_HEIGHT_FIRST - windowHeight/2) && accumulateSection_top * -1 < parseInt(windowHeight / 2)){

      var scrollingPX = scrollTop - parseInt(accumulateBoxOffset + ACOOM_HEIGHT_FIRST - windowHeight/2);
      var allScrolledPX = parseInt((windowHeight - ACOOM_HEIGHT_FIRST - accumulateBoxPositionTop));
      var cof = parseInt((middlePrice - minPrice) / allScrolledPX);
      var needPrice = parseInt(minPrice + scrollingPX * cof);

      $('.js-accumulate-price-1').html(formating(needPrice));
      $('.js-accumulate-price-2').html(formating(needPrice));

    } else if (accumulateSection_top * -1 >= parseInt(windowHeight / 2) && $accumulateSectionStopVals.top > parseInt(windowHeight/2) + MAGIC_BOTTOM_OFFSET){

      $('.js-accumulate-price-1').html(formating(middlePrice));

      var scrollingPX2 = scrollTop - parseInt(accumulateBoxOffset + ACOOM_HEIGHT_FIRST - windowHeight/2);
      var allScrolledPX2 = parseInt(heightLast - ACOOM_HEIGHT_FIRST);
      var cof2 = parseInt((maxPrice - minPrice) / allScrolledPX2);
      var needPrice2 = parseInt(minPrice + scrollingPX2 * cof2);

      $('.js-accumulate-price-2').html(formating(needPrice2));

    } else if ($accumulateSectionStopVals.top <= parseInt(windowHeight/2) + MAGIC_BOTTOM_OFFSET){
      $('.js-accumulate-price-2').html(formating(maxPrice));
    } else if (scrollTop <= parseInt(accumulateBoxOffset + ACOOM_HEIGHT_FIRST - windowHeight/2)){
      $('.js-accumulate-price-1').html(formating(minPrice));
      $('.js-accumulate-price-2').html(formating(minPrice));
    }


  }
  if (windowHeight > 767){
    animateAccomulate();
  } else {
    setPricesMobile();
  }

  function setPricesMobile() {
    $('.js-accumulate-price-1').html(formating(middlePrice));
    $('.js-accumulate-price-2').html(formating(maxPrice));
  }


  /**
   * default values set
   */
  function defaultValues() {
    $header.addClass('b-header__white');
    $body.addClass('header-white');
  }
  defaultValues();

  $(window).on('scroll', function () {
    if (windowHeight > 767) {
      animateAccomulate();
    }
    foxRazvLinks();
  });

  $(window).on('resize', function () {
    windowHeight = $(window).height();
    windowWidth = $(window).width();

    if (windowHeight > 767){
      animateAccomulate();
    }
    setHeightSection();
    foxRazvLinks();
    initCarouselHowBuy();
  });

});