$(function () {

  var $header = $('.js-header');
  var $body = $('body');
  var $indexCarousel = $('.js-index-carousel');
  var $indexCarouselItems = $('.js-index-carousel-item');
  var $headerWrapper = $('.js-header-wrapper');
  var $bgBox = $('.b-bg');

  var $sortSection = $('.js-sort-section');
  var $sortSectionOverlay = $('.js-sort-section-overlay');
  var $sortBoxVisibilityOn = $('.js-sort-visibility');
  var $sortInput = $('.js-sort');
  var $product = $('.js-product');
  var $productSection = $('.js-product-section');
  var $productAppendBlock = $('.js-product-section-append');
  var $showMore = $('.js-show-more');

  var $sortCallPopup = $('.js-sort-call-popup');
  var $sortPopupClose = $('.js-sort-popup-close');
  var $sortPopup = $('.js-sort-popup');

  var $specsCarousel = $('.js-specs-carousel');

  var SORT_ALL = 'sort_all';
  var SORT_ALL_FINANCIAL = 'financial_literacy_all';
  var SORT_ALL_NEWS = 'news_all';
  var windowWidth = $(window).width();
  var windowHeight = $(window).height();
  var sortArr = [];
  var numPage = 1;

  var $sortBox = $('.js-sort-box');


  $sortBox.on('mouseenter', function () {
    var $this = $(this);
    var thisHeight = 0;
    $('.b-index-sort', $this).each(function () {
      thisHeight = thisHeight + $(this).outerHeight(true);
    });
    $this.css('height', thisHeight+'px');
  }).on('mouseleave', function () {
    $(this).css('height', '50px');
  });

    /**
     * init top slider
     */
    $(document).ready(function () {
        setTimeout(function () {
            $indexCarousel.slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true,
                arrows: true,
                touchThreshold: 20,
                fade: true
            });
        },500)

    });
  /**
   * cpecs carousel init
   */
  $specsCarousel.slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    dots: false,
    arrows: true,
    touchThreshold: 20,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 754,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  /**
   * open popup with sorts
   */
  $sortCallPopup.on('click', function (e) {
    e.preventDefault();

    $sortSection.addClass('open');
    $sortPopup.fadeIn(250);
    $body.addClass('overflow');
  });

  /**
   * close sort popup
   */
  $sortPopupClose.on('click', function (e) {
    e.preventDefault();
    closeSortPopup();
  });

  /**
   * close popup if esc
   */
  $(document).keyup(function (e) {
    if (e.which == 27) {
      closeSortPopup();
    }
  });

  /**
   * fn closing sort popup
   */
  function closeSortPopup() {
    if ($sortPopup.is(":visible")){
      $sortSection.removeClass('open');
      $sortPopup.fadeOut(250);
      $body.removeClass('overflow');
    }
  }

  /**
   * parallax effects on bg scroll blocks
   */
  function scrollParallaxBg() {
    if ($bgBox.length){
      $bgBox.each(function () {
        if (!$(this).hasClass('js-index-carousel-item')){
          var thisVal = $(this)[0].getBoundingClientRect();
          var thisBgImg = $('.b-bg__pic', $(this));
          if (thisVal.top < 0 && thisVal.top > thisVal.height * -1){
            var moveVal = parseInt(thisVal.top / -2);
            thisBgImg.css('transform', 'translate(0,'+moveVal+'px)');
          } else if (thisVal.top > 0) {
            thisBgImg.css('transform', 'translate(0,0)');
          }
        }
      });
    }
  }
  scrollParallaxBg();

  /**
   * get second page products
   */
  $showMore.on('click', function (e) {
    e.preventDefault();
    var url = $(this).attr('data-action') + numPage;
    numPage++;

    $.get(url, numPage, function (data) {
      // append products
      if (data)
        $productAppendBlock.append(data);

      // check if it will be more products next time
      hideShowMore(data);

      // hide blocks by sort when append new and make new layout
      visibilityProductsCheck();
    });
  });

  /**
   * hide show more button block if numPage == 0
   * @param data
   */
  function hideShowMore(data) {
    if (data.length < 1)
      $productSection.addClass('hide-show-more')
  }

  /**
   * show/hide overlay on hover sort section if fixed
   */
  if (windowWidth > 1199){
    $('.b-index-sort__wrapper', $sortSection).on('mouseenter', function () {
        if (!$sortSection.hasClass('fixed') || $sortSection.hasClass('fixed') && $sortSection.hasClass('no-opacity')){
          $sortSectionOverlay.fadeIn(100);
        }
    }).on('mouseleave', function () {
      if ($sortSectionOverlay.is(':visible')) {
        $sortSectionOverlay.fadeOut(100);
      }
    });
  }

  /**
   * change sort array and call show/hide product function
   */
  $sortInput.on('change', function () {
    var thisId = $(this).attr('id');

    if (thisId != SORT_ALL && thisId != SORT_ALL_FINANCIAL && thisId != SORT_ALL_NEWS){

      if (!$(this).is(':checked') ){
        removeA(sortArr, thisId);
      } else if ($(this).is(':checked') && $.inArray(thisId, sortArr) < 0){
        sortArr.push(thisId);
      }

    } else if (thisId == SORT_ALL || thisId == SORT_ALL_FINANCIAL || thisId == SORT_ALL_NEWS) {

      var $thisSortBox = $(this).closest('.js-sort-box');
      if (!$(this).is(':checked')){
        $('.js-sort:not(#'+thisId+')', $thisSortBox).each(function () {
          if (sortArr.length > 1)
            $(this).prop( "checked", false ).trigger('change');
        });

      } else if ($(this).is(':checked')){
        $('.js-sort:not(#'+thisId+')', $thisSortBox).prop( "checked", true ).trigger('change')
      }
    }
    visibilityProductsCheck();

    localStorage.setItem('indexSort', JSON.stringify(sortArr));

    // lock last sort to off
    sortArr.length < 2 ? $('#'+sortArr[0]).prop('disabled', true) : $sortInput.prop('disabled', false);
  });

  /**
   * each visible elem
   * @param i
   * @returns {number}
   */
  function getNum(index, i) {
    var num = index * (i - 1);
    return num;
  }

  /**
   * create big layout of visible products (made for each 5 and 6 elem)
   */
  var setBigProduct_status = true;

  function makeBigProducts() {
    if (windowWidth >= 1200 && setBigProduct_status){
      var productsVisibleIndexArr = [];
      $('.js-product').removeClass('b-product__big');

      $('.js-product').each(function (index) {
        if (!$(this).hasClass('not-show'))
          productsVisibleIndexArr.push(index)
      });

      var iterationAmount = parseInt(productsVisibleIndexArr.length / 6);
      for (var i = 1; i <= iterationAmount; i++){
        var plusNum1 = getNum(3, i);
        // var plusNum2 = getNum(2, i);
        var index1 = productsVisibleIndexArr[i*4+plusNum1];
        // var index2 = productsVisibleIndexArr[i*5+plusNum2];
        $('.js-product').eq(index1).addClass('b-product__big');
        // $('.js-product').eq(index2).addClass('b-product__big');
      }
      setBigProduct_status = false;
    } else if (windowWidth < 1200 && !setBigProduct_status) {
      $('.js-product').removeClass('b-product__big');
      setBigProduct_status = true;
    }
  }
  makeBigProducts();


  /**
   * show/hide product function
   */
  function visibilityProductsCheck() {
    $('.js-product').each(function () {
      var $thisProduct = $(this);
      var showThisStatus = false;

      $.each(sortArr, function (index, value) {
        if ($thisProduct.hasClass(value)){
          showThisStatus = true;
          return false;
        }
      });

      // showThisStatus ? $thisProduct.fadeIn(250).removeClass('not-show') : $thisProduct.fadeOut(250).addClass('not-show');
    });

    setBigProduct_status = true;

    makeBigProducts();
  }

  /**
   * func to remove from arr by value
   * @param arr
   * @returns {*}
   */
  function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax= arr.indexOf(what)) !== -1) {
        arr.splice(ax, 1);
      }
    }
    return arr;
  }

  /**
   * fix sort section on scroll and hide it
   */
  var sortContainerTop = 0;
  function sortFix() {
    var sortVal = $sortSection[0].getBoundingClientRect();
    var $sortBoxVisibilityOn_top = $sortBoxVisibilityOn[0].getBoundingClientRect().top;

    //fix status
    if (sortVal.top <= 0 && !$sortSection.hasClass('fixed')){
      $sortSection.addClass('fixed');
    } else if (sortVal.top > 0 && $sortSection.hasClass('fixed')){
      $sortSection.removeClass('fixed');
    }

    // back scroll opacity 1

    if ($sortSection.hasClass('fixed') && sortContainerTop > $('.b-index-sort__container', $sortSection).offset().top){
      sortContainerTop = $('.b-index-sort__container', $sortSection).offset().top;
      $sortSection.addClass('no-opacity');
    } else if ($sortSection.hasClass('fixed') && sortContainerTop <= $('.b-index-sort__container', $sortSection).offset().top){
      sortContainerTop = $('.b-index-sort__container', $sortSection).offset().top;
      $sortSection.removeClass('no-opacity');
    }

    // visibility status
    if ($sortBoxVisibilityOn_top - sortVal.height <= 0 && !$sortSection.hasClass('visibility')){
      $sortSection.addClass('visibility');
    } else if ($sortBoxVisibilityOn_top - sortVal.height > 0 && $sortSection.hasClass('visibility')){
      $sortSection.removeClass('visibility');
    }
  }
  sortFix();

  /**
   * default values set
   */
  function defaultValues() {
    $header.addClass('b-header__white');
    $body.addClass('header-white');
  }
  defaultValues();


  /**
   * set sortArr o ger LocalStorage to sortArr
   */
  function getLocalStorageSort() {
    if (!localStorage || localStorage.getItem("indexSort") == null ){

      // set array of sorts type
      $sortInput.each(function () {
        var thisId = $(this).attr('id');
        if (thisId != SORT_ALL && thisId != SORT_ALL_FINANCIAL && thisId != SORT_ALL_NEWS)
          sortArr.push(thisId);
      });
    } else if (localStorage && localStorage.getItem("indexSort") != null) {

      sortArr = JSON.parse(localStorage.getItem("indexSort"));
      $sortInput.prop('checked', false);
      $.each(sortArr, function (index, value) {
        $('#'+value).prop('checked', true);
      });
      allSortStatus();
      visibilityProductsCheck();
    }
  }
  getLocalStorageSort();


  /**
   * check amount of box input checked and set ALL to status
   */
  function allSortStatus() {
    $sortBox.each(function () {
      var $thisSorts = $('.js-sort', $(this));
      var thisSortsLength = $thisSorts.length-1;
      var amountOn = 0;
      var thisAllId;

      $thisSorts.each(function () {
        var thisId = $(this).attr('id');
        if (thisId == SORT_ALL || thisId == SORT_ALL_FINANCIAL || thisId == SORT_ALL_NEWS){
          thisAllId = thisId
        }
        if ($(this).is(':checked') && (thisId != SORT_ALL && thisId != SORT_ALL_FINANCIAL && thisId != SORT_ALL_NEWS))
          amountOn++;
      });

      if (amountOn >= parseInt(thisSortsLength/2) && thisAllId.length > 0){
        $('#'+thisAllId).prop('checked', true);
      }
    })
  }



  /**
   * set max width to nav index slider
   */
  function widthNavIndexSlider() {
    if (windowWidth <= 768){
      var length = $indexCarouselItems.length;
      var widthDots = 100 / length;
      $('.slick-dots li', $indexCarousel).css('max-width', widthDots+'%');
    }
  }
  widthNavIndexSlider();

  /**
   * set width to slider index dots
   */
  function setArrowsSliderPosition() {
    var headerWrapperWidth = $headerWrapper.width();
    var menuCallLeftPos = parseInt((windowWidth - headerWrapperWidth) / 4);

    if (windowWidth <= 1200){
      $('.slick-prev', $indexCarousel).css('left', '37px');
      $('.slick-next', $indexCarousel).css('right', '37px');
    } else {
      $('.slick-prev', $indexCarousel).css('left', menuCallLeftPos+'px');
      $('.slick-next', $indexCarousel).css('right', menuCallLeftPos+'px');
    }
  }
  setArrowsSliderPosition();


  $(window).on('scroll', function () {
    sortFix();
    scrollParallaxBg();
  });

  $(window).on('resize', function () {
    windowWidth = $(window).width();
    windowHeight = $(window).height();

    setArrowsSliderPosition();
    sortFix();
    scrollParallaxBg();
    makeBigProducts();
  });

  $('.headText').removeClass('.hide');
  $('.b-button__box').removeClass('.hide');

});