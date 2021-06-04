$(function () {

  var $bgBox = $('.b-bg');
  var $showMore = $('.js-show-more');
  var $productAppendBlock = $('.js-product-section-append');
  var $productSection = $('.js-product-section');
  var $product = $('.js-product');
  var $sortLink =  $('.js-common-sort');
  var $productTag = $('.js-product-tag');

  var numPage = 1;
  var SORT_ALL = '#sort_all';
  var sortHref = SORT_ALL;
  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  /**
   * product tag click
   */
  $productTag.on('click', function (e) {
    e.preventDefault();
    var thisHref = $(this).attr('href');
    var $thisLink = $('.js-common-sort[href="'+thisHref+'"]');
    if ($thisLink.length && !$thisLink.hasClass('active')){
      $thisLink.trigger('click');
    }
  });

  /**
   * click sort
   */
  $sortLink.on('click', function (e) {
    e.preventDefault();

    if (!$(this).hasClass('active')){
      sortHref = $(this).attr('href');
      $sortLink.removeClass('active');
      $(this).addClass('active');
      if (sortHref == SORT_ALL){
        $product.fadeIn(250).removeClass('not-show');
        visibilityProductsCheck();
      } else {
        visibilityProductsCheck(sortHref);
      }
    }
  });

  /**
   * make sort by hash
   */
  function hashForSort(){
    var hash = window.location.hash;
    var $thisLink = $('.js-common-sort[href="'+hash+'"]');
    if (hash && $thisLink.length && !$thisLink.hasClass('active')){
      $thisLink.trigger('click');
    }
  }
  hashForSort();

  /**
   * show/hide product function
   */
  function visibilityProductsCheck(sortHref) {
    if (sortHref){
      var sort = sortHref.replace('#','');
      $('.js-product').each(function () {
        var thisData = $(this).attr('data-sort');
        thisData.indexOf(sort) > -1 ? $(this).fadeIn(250).removeClass('not-show') : $(this).fadeOut(250).addClass('not-show');
      });
    }

    setBigProduct_status = true;

    makeBigProducts();
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
   * @param numPage
   */
  function hideShowMore(data) {
    if (data.length < 1)
      $productSection.addClass('hide-show-more')
  }

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

  $(window).on('scroll', function () {
    scrollParallaxBg();
  });

  $(window).on('resize', function () {
    windowWidth = $(window).width();
    windowHeight = $(window).height();

    scrollParallaxBg();
    makeBigProducts();
  });

});