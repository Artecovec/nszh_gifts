$(function () {

  var $body = $('body');
  var $form = $('.js-feedback-form');
  var $errorField = $('.js-feedback-form-error');
  var $successField = $('.js-feedback-form-success');
  var $popupFeedbackOverlay = $('.js-feedback-overlay');
  var $popupFeedbackCall = $('.js-feedback-call');
  var $popupCloseLink = $('.js-popup-close', $popupFeedbackOverlay);
  var $feedbackTitleSelect = $('.js-feedback-title');
  var $feedbackTime = $('.js-feedback-time');
  var needHash = 'feedback';

  /**
   * open popup by hash
   */
  function getHash() {
    var hash = window.location.hash;

    if (hash.replace('#','') == needHash){
      $popupFeedbackOverlay.fadeIn(0).addClass('show');
      $body.addClass('overflow');
    }
  }
  getHash();

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
    window.location.hash = '#'+needHash;
  });

  /**
   * func close popup
   */
  function closePopup() {
    $popupFeedbackOverlay.fadeOut(250).removeClass('show');
    $body.removeClass('overflow');
    window.location.hash = '';
  }

  /**
   * close popup if esc
   */
  $(document).keyup(function (e) {
    if (e.which == 27 && $popupFeedbackOverlay.is(':visible')) {
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
    } else if ($('.phone', $form).val().length < 17) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else if (!validEmail){
      $('.b-button', $form).attr('disabled', 'disabled');
    } else if(!$('#feedback_agreement', $form).is(':checked')){
      $('.b-button', $form).attr('disabled', 'disabled');
    } else if(!$('#feedback_agreement2', $form).is(':checked')){
      $('.b-button', $form).attr('disabled', 'disabled');
    } else {
      $('.b-button', $form).removeAttr('disabled');
    }
    if($('[name=g-recaptcha-response]', $form).length) {
      if (valid_capcha($('[name=g-recaptcha-response]', $form))) {
        $('.b-button', $form).attr('disabled', 'disabled');
      } else {
        $('.b-button', $form).removeAttr('disabled');
      }
    }
  }
  function valid_capcha(el) {
    var val = el.val();
    var $return = (val === '' || val === undefined)
    if($return){
      $(el).parents('.recaptcha').addClass('error');
    }
    return $return
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
        $('input[type="checkbox"], input[type="radio"]', $form).prop('checked',false).trigger('change');
        $feedbackTitleSelect.addClass('b-dropdown_open first-open');
        var lastTimeIndex = $('.b-dropdown__item', $feedbackTime).length - 1;
        $('.b-dropdown__item', $feedbackTime).eq(lastTimeIndex).trigger('click');
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