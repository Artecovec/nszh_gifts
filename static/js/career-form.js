$(function () {

  var $body = $('body');
  var $form = $('.js-сareer-form');
  var $errorField = $('.js-сareer-form-error');
  var $successField = $('.js-сareer-form-success');
  var $popupOverlay = $('.js-сareer-overlay');
  var $popupCall = $('.js-сareer-call');
  var $popupCloseLink = $('.js-сareer-close');
  var $careerTitle = $('.js-career-title');

  /**
   * on close click
   */
  $popupCloseLink.on('click', function (e) {
    e.preventDefault();
    closePopup();
  });

  $('.js-file', $form).on('change', function () {
    var filenameSplit = $(this).val().split('\\');
    var filename = filenameSplit[filenameSplit.length-1];
    var $thisBox = $(this).closest('.js-file-box');
    $('.js-file-insert', $thisBox).html(filename).removeClass('hidden');

    if ($(this).val() == '')
      $('.js-file-insert', $thisBox).addClass('hidden');
  });

  /**
   * call popup
   */
  $popupCall.on('click', function (e) {
    e.preventDefault();
    $careerTitle.val($(this).attr('data-career')).trigger('change');
    $popupOverlay.fadeIn(250).addClass('show');
    $body.addClass('overflow');
  });

  /**
   * func close popup
   */
  function closePopup() {
    $popupOverlay.fadeOut(250).removeClass('show');
    $body.removeClass('overflow');
  }

  /**
   * close popup if esc
   */
  $(document).keyup(function (e) {
    if (e.which == 27 && $popupOverlay.is(':visible')) {
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
      $('.b-button_submit', $form).attr('disabled', 'disabled');
    } else if (!validEmail){
      $('.b-button_submit', $form).attr('disabled', 'disabled');
    } else {
      $('.b-button_submit', $form).removeAttr('disabled');
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

    // for (var pair of formData.entries())
    // {
    //   console.log(pair[0]+ ', '+ pair[1]);
    // }

    $.ajax({
      url: $this.attr('action'),
      processData: false,
      contentType: false,
      type: "POST",
      data: formData,
      dataType: "json",
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