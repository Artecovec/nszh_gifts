$(function () {

    $(document).on("click", ".insuranceFilter-el", function (event) {
        var checkedCount = 0
        $('.js-product').hide();
        $.each($('.insuranceFilter-el'), function( key, value ) {
            var code = $(this).find('label').html();
            var checked = $(this).find('input').is(':checked');
            if(checked){
                checkedCount++;
            }
            if(checked){
                $.each($('.js-product'), function (key, value) {

                    if($(this).find('.js-product-tag').html().toLowerCase().trim() == code.toLowerCase().trim()) {
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