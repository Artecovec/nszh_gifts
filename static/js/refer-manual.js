$(function () {

  var $body = $('body');
  var $form = $('.js-refer-manual-form');
  var $errorField = $('.js-refer-manual-form-error');
  var $successField = $('.js-refer-manual-form-success');
  var $popupFeedbackOverlay = $('.js-refer-manual-overlay');
  var $popupFeedbackCall = $('.js-refer-manual-call');
  var $popupCloseLink = $('.js-popup-close', $popupFeedbackOverlay);
  var $selectTitle = $('.js-refer-manual-select');


  /**
   * on close click
   */
  $popupCloseLink.on('click', function (e) {
    e.preventDefault();
    closePopup();
  });

  /**
   * call popup
   */
  $popupFeedbackCall.on('click', function (e) {
    e.preventDefault();
    $popupFeedbackOverlay.fadeIn(250).addClass('show');
    $body.addClass('overflow');
  });

  /**
   * func close popup
   */
  function closePopup() {
    $popupFeedbackOverlay.fadeOut(250).removeClass('show');
    $body.removeClass('overflow');
  }

  /**
   * close popup if esc
   */
  $(document).keyup(function (e) {
    if (e.which == 27 && $popupFeedbackOverlay.is(':visible')) {
      closePopup();
    }
  });

  $('.js-file', $form).on('change', function () {
    var filenameSplit = $(this).val().split('\\');
    var filename = filenameSplit[filenameSplit.length-1];
    var $thisBox = $(this).closest('.js-file-box');
    $('.js-file-insert', $thisBox).html(filename).removeClass('hidden');

    if ($(this).val() == '')
      $('.js-file-insert', $thisBox).addClass('hidden');
  });



  // VALIDATION

  /**
   * validate form for amount of filled required felds
   * @param $form - form dom
   */
  function chkform($form) {
    var emailMask = /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-zA-Z0-9]{1}[a-zA-Z0-9\-]{0,62}[a-zA-Z0-9]{1})|[a-zA-Z])\.)+[a-zA-Z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/;
    var validEmail = emailMask.test($('.email', $form).val());

    if ($('.js-required.js-filled', $form).length < $('.js-required', $form).length) {
      $('button.b-button', $form).attr('disabled', 'disabled');
    } else if ($('.phone', $form).val().length < 17) {
      $('button.b-button', $form).attr('disabled', 'disabled');
    } else if (!validEmail){
      $('button.b-button', $form).attr('disabled', 'disabled');
    } else if (!$('#refer-manual_agreement', $form).is(':checked')){
      $('button.b-button', $form).attr('disabled', 'disabled');
    } else if (!$('#refer-manual_agreement2', $form).is(':checked')){
      $('button.b-button', $form).attr('disabled', 'disabled');
    }else {
      $('button.b-button', $form).removeAttr('disabled');
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
    var formData = new FormData($this[0]);

    $.ajax({
      url: $this.attr('action'),
      method: "POST",
      processData: false,
      contentType: false,
      data: formData,
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
        $('input, textarea', $form).each(function () {
          if ($(this).attr('name') != '_csrf'){
            $(this).val('').trigger('change');
          }
        });
        $('input[type="checkbox"], input[type="radio"]', $form).prop('checked',false).trigger('change');
        $selectTitle.addClass('b-dropdown_open first-open');
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