$(function () {

  var $body = $('body');
  var $form = $('.js-order-form');
  var $errorField = $('.js-order-form-error');
  var $successField = $('.js-order-form-success');
  var $popupOrderOverlay = $('.js-popup-overlay');
  var $popupOrderCall = $('.js-buy-polis-popup-link');
  var $popupOrderCloseLink = $('.js-popup-close');
  var $header = $('.js-header');
  var $sectionCalc = $('.js-section-calc');

  /**
   * default values set
   */
  function defaultValues() {
    $header.addClass('b-header__white');
    $body.addClass('header-white');
  }
  defaultValues();

  /**
   * on close click
   */
  $popupOrderCloseLink.on('click', function (e) {
    e.preventDefault();
    closePopup();
  });

  /**
   * call popup
   */
  $popupOrderCall.on('click', function (e) {
    e.preventDefault();
    $popupOrderOverlay.fadeIn(250).addClass('show');
    $body.addClass('overflow');
  });

  /**
   * func close popup
   */
  function closePopup() {
    $popupOrderOverlay.fadeOut(250).removeClass('show');
    $body.removeClass('overflow');
  }

  /**
   * close popup if esc
   */
  $(document).keyup(function (e) {
    if (e.which == 27 && $popupOrderOverlay.is(':visible')) {
      closePopup();
    }
  });



  // VALIDATION

  /**
   * validate form for amount of filled required felds
   * @param $form - form dom
   */
  function chkform($form) {
    if ($('.js-required.js-filled', $form).length < $('.js-required', $form).length) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else if ($('.phone', $form).val().length < 17) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else {
      $('.b-button', $form).removeAttr('disabled');
    }
  }

  /**
   * set status filled of value more than 0
   */
  $('input, textarea', $form).on('keyup paste change input', function () {
    var $this = $(this);
    this.value.length > 0 ? $this.addClass('js-filled') : $this.removeClass('js-filled');
    chkform($form);
  });

  /**
   * submit form
   */
  $form.on('submit', function(e) {
    var $this = $(this);
    e.preventDefault();
    e.stopPropagation();

    submit($this);
    return false;
  });

  function submit($this) {
    $.ajax({
      url: $this.attr('action'),
      method: "POST",
      data: $this.serialize(),
      dataType: "JSON",
      success: function (data) {
        data.result == 'ok' ? showSuccess() : showError();
      },
      error: function () {
        showError();
      }
    });
  }

  /**
   * show error text
   * @param text
   */
  function showError(text) {
    $errorField.removeClass('hidden');
    setTimeout(function () {
      $errorField.addClass('hidden');
    }, 3000)
  }

  /**
   * reset form of success submit
   * @param $this - form
   */
  function showSuccess(num) {
    $form.addClass('hidden');
    $successField.removeClass('hidden');
    setTimeout(function () {
      closePopup();
      setTimeout(function () {
        $('input, textarea', $form).val('').trigger('change');
        $form.removeClass('hidden');
        $successField.addClass('hidden');
      }, 250);
    }, 3000)
  }

  /**
   * phone mask
   */
  $('.phone', $form).mask('+7 (000) 000-0000');


});