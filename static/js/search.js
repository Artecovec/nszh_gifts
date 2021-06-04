$(function () {

  var $body = $('body');
  var $searchCall = $('.js-search-call');
  var $popupSearchOverlay = $('.js-search-overlay');
  var $searchInput = $('.js-search-input');
  var $searchCloseLink = $('.js-search-close');
  var $appendSearchBlock = $('.js-append-search');
  var $form = $('.js-search-form');
  var $errorField = $('.js-search-form-error');
  var $menuCallLink = $('.js-toggle-menu');
  var $searchFaq = $('.js-search-form-faq');
  var $searchDropdown = $('.js-search-dropdown');
  var sttm;
  var auReq = null;

  /**
   * send dorm on input
   */
  $searchInput.on('keyup paste', function (e) {
    if (sttm) {
      clearTimeout(sttm);
    }
    var key = 'which' in e ? e.which : e.keyCode;
    if (key === 13) {
      return;
    }
    var thisVal = $(this).val();
    if (thisVal.length > 0){
      sttm = setTimeout(function () {
        $searchDropdown.html('').addClass('hidden');
        submitDropdown($form);
      }, 200);
    }
  });

  $("#search").inlineComplete({list: SearchTagList});

  /**
   * show products on dropdown search link click
   */
  $($searchDropdown).on('click', '.js-all-result-show', function (e) {
    e.preventDefault();
    submit($form);
    return false;
  });

  $form.on("submit", function (e) {
    e.preventDefault();
    submit($form);
    return false;
  });

  /**
   * submit fn to get products
   * @param $this
   */
  function submit($this) {
    if (auReq) {
      auReq.abort();
    }
    $.ajax({
      url: $this.attr('action'),
      method: $this.attr('method'),
      data: $this.serialize(),
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccess(data.html) : showError();
      },
      error: function () {
        showError();
      }
    });
  }

  /**
   * submit fn to get dropdown list
   * @param $this
   */
  function submitDropdown($this) {
    auReq = $.ajax({
      url: $this.data('autocomplete'),
      method: $this.attr('method'),
      data: $this.serialize(),
      dataType: "JSON",
      success: function (data) {
        auReq = null;
        data.result === 'ok' ? showSuccessDropdown(data.html) : showError();
      },
      error: function () {
        auReq = null;
        //showError()
      }
    });
  }

  /**
   * set dropdown result to html
   * @param html
   */
  function showSuccessDropdown(html){
    $searchFaq.addClass('hidden');
    $appendSearchBlock.addClass("hidden");
    $searchDropdown.html(html).removeClass('hidden');
  }

  /**
   * set product result to html
   */
  function showSuccess(html) {
    $searchFaq.addClass('hidden');
    $searchDropdown.addClass('hidden');
    $appendSearchBlock.html(html).removeClass('hidden');
    $appendSearchBlock.prepend('<h2>Результат поиска</h2>')
  }

  function showError() {
    $errorField.removeClass('hidden');
    setTimeout(function () {
      $errorField.addClass('hidden');
    }, 3000)
  }

  /**
   * open search
   */
  $searchCall.on('click', function (e) {
    e.preventDefault();
    if ($menuCallLink.hasClass('open')){
      $menuCallLink.trigger('click');
    }
    $popupSearchOverlay.fadeIn(250, function () {
      $searchInput.focus();
    }).addClass('show');
    $menuCallLink.addClass('z-index');
    $body.addClass('overflow');
  });

  /**
   * func close popup
   */
  function closePopup() {
    $popupSearchOverlay.fadeOut(250, function () {
      $searchInput.val('').trigger('change');
      $menuCallLink.removeClass('z-index');
    }).removeClass('show');
    $body.removeClass('overflow');
  }

  /**
   * close popup if esc
   */
  $(document).keyup(function (e) {
    if (e.which == 27 && $popupSearchOverlay.is(':visible')) {
      closePopup();
    }
  });

  /**
   * close on click
   */
  $searchCloseLink.on('click', function (e) {
    e.preventDefault();
    closePopup();
  });





});