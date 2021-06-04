$(function () {

    console.log(123)
    $(document).on("click", ".insuranceFilter-el", function (event) {
        var checkedCount = 0
        $('.js-product').hide();
        $.each($('.insuranceFilter-el'), function( key, value ) {
            var code = $(this).find('input').val();
            var checked = $(this).find('input').is(':checked');
            if(checked){
                checkedCount++;
            }
            if(checked){
                $.each($('.js-product'), function (key, value) {
                    if($(this).hasClass(code)) {
                        $(this).show()
                    }
                });
            }
        });

        if(checkedCount == 0){
            $('.js-product').show();
        }

    });


});