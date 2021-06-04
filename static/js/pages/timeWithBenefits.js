$(document).ready(function () {

    if($('.timeWithBenefits').length || $('.timeWithBenefitsNew').length){
        var wg = document.body.clientWidth;
        $('#number').inputmask('серия a{1,8}9{1,5} номер 9{10}')
        $('#email').inputmask({
            mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
            greedy: false,
            onBeforePaste: function (pastedValue, opts) {
                pastedValue = pastedValue.toLowerCase();
                return pastedValue.replace("mailto:", "");
            },
            definitions: {
                '*': {
                    validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
                    casing: "lower"
                }
            }
        });
        $(document).on("click","#prezent",function() {
            $(this).parents('.inputBlock').find('.option').slideToggle();
            $(this).parents('.inputBlock').toggleClass('active')
        });

        $(document).on("click",".option__el",function() {
            var val = $(this).find('span').html();
            $(this).parents('.inputBlock').find('.option__el').removeClass('selected')
            $(this).addClass('selected')
            $(this).parents('.inputBlock').find('input').val(val.trim());
            $(this).parents('.inputBlock').find('.option').slideUp();
            $(this).parents('.inputBlock').removeClass('active')
        });

        $(document).on("click", ".form_btn", function (event) {
            event.preventDefault()
            var seriesNumber = $('#number').val().replace('серия ', '').replace('номер ', '');
            if(!seriesNumber.length){
                $('#number').next('.errorDiv').html('Укажите номер договора').show();
                setTimeout(function () {
                    $('#number').next('.errorDiv').hide()
                }, 3000)
                return false
            }
            var series = seriesNumber.split(' ')[0].replace(/_/g, '')
            var number = seriesNumber.split(' ')[1].replace(/_/g, '')
            console.log('s', series.length)
            console.log('n', number.length)
            if(series.length >= 3 && number.length && valid_email($('#email'))){
                $.ajax({
                    type: 'POST',
                    url: '/ajax/send-promo',
                    data: {
                        _csrf: $('#_csrf').val(),
                        number: number,
                        series: series,
                        email: $('#email').val(),
                        type: $('#prezent').val(),
                    },

                    dataType: "json",
                    beforeSend: function () {
                        $('.form_btn').attr('disabled', true)

                    },
                    complete: function () {

                    },
                    success: function (data) {
                        $('.form_btn').attr('disabled', false)
                        console.log(data);
                        if(data.res.status == 400){
                            $('#email').next('.errorDiv').html('Указанный договор уже получил промокод').show();
                        }else if(data.res.status == 404){
                            $('#email').next('.errorDiv').html('Номер договора не найден').show();
                        }else if(data.res.status == 200){
                            $('#email').next('.errorDiv').html('Спасибо! Письмо успешно отправленно').show().addClass('success');
                        }
                        setTimeout(function () {
                            $('#email').next('.errorDiv').hide().removeClass('success')
                        }, 3000)
                    },
                    errors: function (errors) {
                        $('.form_btn').attr('disabled', false)
                        console.log(errors);
                    }
                });
            }else if(series.length >=3 && number.length ){
                $('#number').next('.errorDiv').html('Не верный договор').show();
                setTimeout(function () {
                    $('#number').next('.errorDiv').hide()
                }, 3000)
            }
        });

        $(document).on("click",".li_btn",function() {
            var value = $(this).attr('data-value');
            $('.select .option__el:nth-child('+value+')').click();
            var destination = $('#form').offset().top;
            $('html, body').animate({ scrollTop: destination }, 600);

        });

        function valid_email(el) {
            if(!el.val().length){
                $(el).next('.errorDiv').html('Укажите Email').show();
                setTimeout(function () {
                    $(el).next('.errorDiv').hide()
                }, 3000)
                return false
            }
            var regRus = /^[а-яё.]+@[а-яё-]+\.[a-яё]{2,10}$/i;
            if(regRus.test(el.val())){
                $(el).next('.errorDiv').html('Email должен быть на английском').show();
                setTimeout(function () {
                    $(el).next('.errorDiv').hide()
                }, 3000)
                return false
            }
            var reg = /^[a-z-\._0-9]+@[a-z-_0-9]+\.[a-z0-9]{2,10}$/i;
            if(!reg.test(el.val())){
                $(el).next('.errorDiv').html('Не верный Email').show();
                setTimeout(function () {
                    $(el).next('.errorDiv').hide()
                }, 3000)
                return false
            }
            return true
        }

        $(document).on("click", ".newBanner .btn_white", function (event) {
            var elementClick = $(this).attr("href");
            var destination = $(elementClick).offset().top;
            $('html, body').animate({ scrollTop: destination }, 600);
            return false;
        });


        if (wg < 768){
            $('.wrap .ul .slick').slick({
                arrows: true,
                dots: false,
                infinite: true,
                adaptiveHeight: true
            });
        }





    }

});