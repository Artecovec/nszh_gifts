$(function () {

  var $body = $('body');
  var $form = $('.js-question-form');
  var $errorField = $('.js-question-form-error');
  var $successField = $('.js-question-form-success');
  var $popupQuestionOverlay = $('.js-question-overlay');
  var $popupQuestionCall = $('.js-question-popup-call');
  var $popupCloseLink = $('.js-popup-close', $popupQuestionOverlay);

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
  $popupQuestionCall.on('click', function (e) {
    e.preventDefault();
    $popupQuestionOverlay.fadeIn(250).addClass('show');
    $body.addClass('overflow');
  });

  /**
   * func close popup
   */
  function closePopup() {
    $popupQuestionOverlay.fadeOut(250).removeClass('show');
    $body.removeClass('overflow');
  }

  /**
   * close popup if esc
   */
  $(document).keyup(function (e) {
    if (e.which == 27 && $popupQuestionOverlay.is(':visible')) {
      closePopup();
    }
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
      $('.b-button', $form).attr('disabled', 'disabled');
    } else if (!validEmail){
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
        $('input, textarea', $form).each(function () {
          if ($(this).attr('name') != '_csrf'){
            $(this).val('').trigger('change');
          }
        });
        $form.removeClass('hidden');
        $successField.addClass('hidden');
      }, 250);
    }, 3000)
  }


});