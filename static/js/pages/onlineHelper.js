$(document).ready(function () {
    if ($('.onlineHelper').length) {
        var interval, checkProgramm;

        $(document).on("click",".pageQuest .answer_el",function() {
            if(!$('.pageQuest .answer_el.active').length) {
                $('.pageQuest .answer_el').addClass('noHover')
                $(this).addClass('active')
                if($(this).hasClass('no')){
                    $('.pageQuest_area textarea').attr('placeholder', 'Что мы могли бы улучшить?')
                }else{
                    $('.pageQuest_area textarea').attr('placeholder', 'Будем рады любому вашему комментарию или предложению')
                }
                $('.pageQuest_area').slideDown().css('display', 'flex')
            }
        });

        $(document).on("input",".pageQuest .textarea",function() {
            $('.pageQuest .button').attr('disabled', $(this).val().length === 0)
        });
        
        $(document).on("click",".pageQuest_area .button",function() {
            $.ajax({
                type: 'POST',
                url: '/ajax/set-useful',
                data: {
                    _csrf: $('[name=_csrf]').val(),
                    answer: $('.pageQuest .answer_el.active').hasClass('yes') ? 1 : 0,
                    comment: $('.pageQuest_area .textarea').val()
                },

                dataType: "json",
                beforeSend: function () {
                    $('.pageQuest_area .textarea').attr('disabled', true)
                    $('.pageQuest_area .button').attr('disabled', true)
                },
                complete: function () {

                },
                success: function (data) {
                    console.log(data);
                    $('.pageQuest').html(
                        ' <div class="pageQuest_head">\n' +
                        '                        Спасибо за Ваш ответ!\n' +
                        '                    </div>'
                    );
                },
                errors: function (errors) {
                    console.log(errors);
                }
            });
        });

        $('.sendEmail').on('click', function () {
            $('.emailInput').slideDown();
        })

        $('[name=series_order], [name=number_order]').on('input', function (e) {
            var input = $(this);
            var valSeries = $('[name=series_order]').val().toLowerCase().replace('_', '');
            var valNumber = $('[name=number_order]').val().toLowerCase().replace('_', '');
            input.parents('.inputRow').find('.btn').attr('disabled', true)
            $.each($('.productsCode'), function (index, value) {
                var valProduct = $(this).val().toLowerCase();
                if (valSeries.indexOf(valProduct) >= 0 && valNumber.length == 10) {
                    // $('.head.series').html(valInput)
                    $('.head.name').html($(this).attr('data-product'))
                    input.parents('.inputRow').find('.btn').attr('disabled', false)
                }
            });
        })



        $('.changeStep').on('click', function (e) {
            e.preventDefault();
            // console.log(555, $('div[data-code="ББМР0"]'))
            $('.step').hide();
            $('.step' + $(this).attr('data-step')).show();
            if ($(this).hasClass('select_el')) {
                $('.select_el').removeClass('select_el_active');
                $(this).addClass('select_el_active')
            }
            if($(this).attr('data-step') == 2){
                $('.step2 .select').hide();
                $( $('.step2 .select') ).each(function( index ) {
                    // console.log($(this).attr('data-programm').indexOf($('.head.name').html()))

                    if($(this).attr('data-programm').indexOf($('.head.name').html()) >= 0){
                        $(this).show();
                    }
                });
            }
            clearInterval(interval);

            if ($(this).attr('data-step') == 3) {
                startShow($('.select_el_active').attr('data-type'));
                interval = setInterval(function () {
                    $.each($('.btn[data-show=1]'), function (index, value) {
                        var showBlock = $(this).attr('data-show-block');
                        if ($(this).hasClass('btn_green')) {
                            $('.dn.dn' + showBlock).slideDown();
                        } else {
                            $('.dn.dn' + showBlock).slideUp();
                        }
                    });
                    if ($('.step3 .label_black:visible').length == $('.step3 .btn_green:visible').length) {
                        $('.step').hide();
                        $('.step4').show();
                        $('.mainImgRight').hide()
                        $('.btn_back').attr('data-step', 3);
                        createTable($('.select_el_active').attr('data-type'));
                        $.each($('.step4 table tr.dn'), function (index, value) {
                            var answerId = $(this).attr('data-answerId');
                            if ($('.step3 .btn#' + answerId).hasClass('btn_green')) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        });
                        clearInterval(interval);
                    }

                }, 1000)
                if($('.head.name').html() === 'Страхование жизни заемщиков кредитов Сбербанка') {
                    $( '.step3 .label_black' ).each(function( index ) {
                        if($(this).html() === 'Кто будет подавать заявление?'){
                            var clone = $('.b-information__tel .infoPhoneHelper').clone()
                            clone.find('.infoPopap').html(
                                "Выгодоприобретатель – лицо, в пользу которого заключен Договор страхования, и которое обладает правом на получение страховой выплаты. <br>" +
                                "По программе ДСЖ в части рисков: уход из жизни (смерть любая причина) и инвалидность 1,2 гр. выгодоприобретателем является банк в части задолженности на дату наступления страхового события, в остальной части клиент, либо его наследники."
                            )
                            $(this).next().append(
                                clone
                            )
                        }
                    });
                }else{
                    $('.infoPopap').html($('.infoPopap').attr('oldHtml'))
                }
            } else {
                clearInterval(checkProgramm);
                $('.infoPopap').html($('.infoPopap').attr('oldHtml'))
                clearInterval(interval);
            }
            if ($(this).attr('data-step') == 4) {
                $('.mainImgRight').hide()

            } else {
                $('.mainImgRight').show()
            }

            $('.btn-block .btn').removeClass('btn_green').addClass('btn_gray');
            $('.dn').hide();
            $('html, body').animate({
                    scrollTop: $('.onlineHelper').offset().top // прокручиваем страницу к требуемому элементу
                }, 500 // скорость прокрутки
            );
            if ($(this).attr('data-step') > 1) {
                $('.btn_back').show().attr('data-step', $(this).attr('data-step') - 1);
                $('.head.name, .head.series').show();
            } else {
                $('.btn_back').hide();
                $('.head.name, .head.series').hide();

            }

        })

        $(document).on("click", ".btn-block .btn", function (event) {
            event.preventDefault();
            var par = $(this).parents('.btn-block');
            par.find('.btn').removeClass('btn_green').addClass('btn_gray');
            $(this).removeClass('btn_gray').addClass('btn_green');
            var active = 0
            $.each($('.btn-block'), function (index, value) {
                if ($(this).find('.btn_green').length) {
                    active++;
                }
            });
            if ((active == 2 && $('.btn2').is(':hidden'))
                || (active == 3 && $('.btn2').is(':visible'))
            ) {
                $('.step').hide();
                $('.step4').show();
                $('.btn_back').attr('data-step', 3);

            }
        })

        $('[name=email]').on('input', function () {
            if (valid_email($(this))) {
                $('.emailDone').attr('disabled', false)
            } else {
                $('.emailDone').attr('disabled', true)
            }
        })

        $('.emailDone').on('click', function (e) {
            console.log(123)
            $.ajax({
                type: 'POST',
                url: '/online-helper',
                data: {
                    email: $('.mask-email').val()
                },

                dataType: "json",
                beforeSend: function () {

                },
                complete: function () {

                },
                success: function (data) {
                    console.log(data);
                },
                errors: function (errors) {
                    console.log(errors);
                }
            });
        })

        $('[name=name]').on('focus', function () {
            $(this).parents('.selectInput').find('.selectInputOption').slideDown();
        })
        $('[name=name]').on('blur', function () {
            $(this).parents('.selectInput').find('.selectInputOption').slideUp();
        })

        $('.selectInputEl').on('click', function () {
            $(this).parents('.selectInput').find('input[name=name]').val($(this).html().trim());
            if ($(this).parents('.selectInput').find('input[name=name]').val()) {
                $(this).parents('.inputRow').find('.btn').attr('disabled', false);
                $(this).parents('.inputRow').find('.btn').attr('id', translate($(this).html().trim()));
                $('.head.name').html($(this).html().trim())
            } else {
                $(this).parents('.inputRow').find('.btn').attr('disabled', true);
                $(this).parents('.inputRow').find('.btn').attr('id', '');
            }
            $(this).parents('.selectInput').find('.selectInputOption').slideUp();
            // console.log(translate($(this).html().trim()))

        })

        $('input[name=name]').on('input', function () {
            if ($(this).val()) {
                $(this).parents('.inputRow').find('.btn').attr('disabled', false);
            } else {
                $(this).parents('.inputRow').find('.btn').attr('disabled', true);
            }
        })

        function valid_email(el) {
            var regRus = /^[а-яё.]+@[а-яё-]+\.[a-яё]{2,10}$/i;
            if (regRus.test(el.val())) {
                $(el).next('.errorDiv').html('Email должен быть на английском');
                return false
            }
            // $(el).next('.errorDiv').html('Укажите свой настоящий адрес, иначе мы не сможем с вами связаться');
            var reg = /^[a-z-\._0-9]+@[a-z-_0-9]+\.[a-z0-9]{2,10}$/i;
            return reg.test(el.val())
        }

        var docform = {
            // <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="xraypictures" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>
            statement: "#", // Заявление на участие в программе страхования
            inscontract: "#", // Договор страхования/Страховой полис (в зависимости от продукта)
            contractzashchishchennyyzayemshchik: "/static/i/new/docForm/contract-zashchishchennyy-zayemshchik.pdf", // Договор страхования/Страховой полис Защищенный заемщик
            contractzashchitablizkikhplyus: "/static/i/new/docForm/contract-zashchita-blizkikh-plyus.pdf", // Договор страхования/Страховой полис Защита близких плюс
            statementpayment: "/static/i/new/docForm/statement-payment.pdf", // Заявление о страховой выплате с указанием банковских реквизитов.
            document: "#", // Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя)
            deathcertificate: "/static/i/new/docForm/death-certificate.pdf", // Свидетельство о смерти Застрахованного лица
            extractbook: "#", // Выписка из Книги государственной регистрации актов гражданского состояния
            deathjudgment: "#", // Решение суда о признании умершим или без вести пропавшим
            deathreference: "/static/i/new/docForm/death-reference.pdf", // Справка о смерти
            medicaldeathcertificate: "/static/i/new/docForm/medical-death-certificate.pdf", // Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти
            conclusionmedical: "/static/i/new/docForm/conclusion-medical.pdf", // Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа
            epicrisis: "/static/i/new/docForm/epicrisis.png", // Посмертный эпикриз (в случае смерти в лечебном учреждении)
            extractmedicalrecord: "/static/i/new/docForm/extract-medical-record.pdf", // Выписка из медицинской карты Застрахованного лица за 5 (пять)
            extractoutpatientcard: "#", // Выписка из амбулаторной карты
            emergencyroom: "/static/i/new/docForm/emergency-room.pdf", // Справка из травмпункта
            dischargereport: "/static/i/new/docForm/discharge-report.pdf", // Выписной эпикриз
            disabilitycertificate: "/static/i/new/docForm/disability-certificate.pdf", // Справка об установлении Застрахованному лицу группы инвалидности
            expertreport: "/static/i/new/docForm/expert-report.pdf", // Протокол проведения медико-социальной экспертизы
            examinationcoupon: "/static/i/new/docForm/examination-coupon.pdf", // Обратный талон медико-социальной экспертизы или Сведения о результатах проведенной медико-социальной экспертизы
            directionexpertise: "/static/i/new/docForm/direction-expertise.pdf", // Направление на медико-социальную экспертизу организацией, оказывающей лечебно-профилактическую помощь
            operationprotocol: "#", // протокол операции с указанием диагноза, даты несчастного случая, приведшего к хирургическому вмешательству...
            insurancepolicy: "#", // Страховой полис
            beneficiarystatement: "#", // Заявление от ВП о наступлении дожития с указанием полных реквизитов Выгодоприобретателя
            personalive: "#", // Документ, подтверждающий нахождение Застрахованного лица в живых
            dismissalorder: "/static/i/new/docForm/dismissal-order.pdf", // Приказ об увольнении/выписка из приказа об увольнении
            employmenthistory: "/static/i/new/docForm/employment-history.pdf", // Приказ об увольнении/выписка из приказа об увольнении
            nowork: "/static/i/new/docForm/no-work.pdf", // Листки нетрудоспособности по заявляемому событию, в т.ч. закрытый листок нетрудоспособности
            laborcontract: "/static/i/new/docForm/labor-contract.pdf", // Трудовой договор со всеми дополнительными соглашениями
            alcoholinblood: "/static/i/new/docForm/alcohol-in-blood.png", // Документ подтверждающий наличиеотсутствие алкоголя в крови на момент наступления события в оригинале
            unhappycase: "/static/i/new/docForm/unhappy-case.pdf", // Акт о несчастном случае на производстве
            refusalcriminalcase: "/static/i/new/docForm/refusal-criminal-case.pdf", // постановление о возбуждении/отказе в возбуждении уголовного дела
            xraypictures: "/static/i/new/docForm/xray-pictures.pdf", // описание рентгеновских снимков
			paymentdocument: "#", // Трудовой договор или дополнительное соглашение к трудовому договору, содержащие информацию об окладе и предыдущем окладе
        }

        function addDocForm () {
            var docType = $('.onlineHelper_doctype')
            $.each(docType, function (index, item) {

                switch ($(this).attr('data-doctype')) {
                    case 'statement':
                        $(this).attr('href', docform.statement)
                        break;
                    case 'inscontract':
                        $(this).attr('href', docform.inscontract)
                        break;
                    case 'statementpayment':
                        $(this).attr('href', docform.statementpayment)
                        break;
                    case 'document':
                        $(this).attr('href', docform.document)
                        break;
                    case 'deathcertificate':
                        $(this).attr('href', docform.deathcertificate)
                        break;
                    case 'extractbook':
                        $(this).attr('href', docform.extractbook)
                        break;
                    case 'deathjudgment':
                        $(this).attr('href', docform.deathjudgment)
                        break;
                    case 'deathreference':
                        $(this).attr('href', docform.deathreference)
                        break;
                    case 'medicaldeathcertificate':
                        $(this).attr('href', docform.medicaldeathcertificate)
                        break;
                    case 'conclusionmedical':
                        $(this).attr('href', docform.conclusionmedical)
                        break;
                    case 'epicrisis':
                        $(this).attr('href', docform.epicrisis)
                        break;
                    case 'extractmedicalrecord':
                        $(this).attr('href', docform.extractmedicalrecord)
                        break;
                    case 'extractoutpatientcard':
                        $(this).attr('href', docform.extractoutpatientcard)
                        break;
                    case 'emergencyroom':
                        $(this).attr('href', docform.emergencyroom)
                        break;
                    case 'dischargereport':
                        $(this).attr('href', docform.dischargereport)
                        break;
                    case 'disabilitycertificate':
                        $(this).attr('href', docform.disabilitycertificate)
                        break;
                    case 'expertreport':
                        $(this).attr('href', docform.expertreport)
                        break;
                    case 'examinationcoupon':
                        $(this).attr('href', docform.examinationcoupon)
                        break;
                    case 'directionexpertise':
                        $(this).attr('href', docform.directionexpertise)
                        break;
                    case 'operationprotocol':
                        $(this).attr('href', docform.operationprotocol)
                        break;
                    case 'insurancepolicy':
                        $(this).attr('href', docform.insurancepolicy)
                        break;
                    case 'beneficiarystatement':
                        $(this).attr('href', docform.beneficiarystatement)
                        break;
                    case 'personalive':
                        $(this).attr('href', docform.personalive)
                        break;
                    case 'dismissalorder':
                        $(this).attr('href', docform.dismissalorder)
                        break;
                    case 'employmenthistory':
                        $(this).attr('href', docform.employmenthistory)
                        break;
                    case 'nowork':
                        $(this).attr('href', docform.nowork)
                        break;
                    case 'laborcontract':
                        $(this).attr('href', docform.laborcontract)
                        break;
                    case 'alcoholinblood':
                        $(this).attr('href', docform.alcoholinblood)
                        break;
                    case 'unhappycase':
                        $(this).attr('href', docform.unhappycase)
                        break;
                    case 'contractzashchishchennyyzayemshchik':
                        $(this).attr('href', docform.contractzashchishchennyyzayemshchik)
                        break;
                    case 'contractzashchitablizkikhplyus':
                        $(this).attr('href', docform.contractzashchitablizkikhplyus)
                        break;
                    case 'refusalcriminalcase':
                        $(this).attr('href', docform.refusalcriminalcase)
                        break;
                    case 'xraypictures':
                        $(this).attr('href', docform.xraypictures)
                        break;
					case 'paymentdocument':
                        $(this).attr('href', docform.paymentdocument)
                        break;
                }

                if (docform[$(this).attr('data-doctype')] === "#") {
                    $(this).parent('.onlineHelper_docblock').css('display', 'none')
                }
            })
        }

        var questions = {
            1: {
                11: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        111: {answerText: 'Представитель выгодоприобретателя/наследника'},
                        112: {answerText: 'выгодоприобретатель/Наследник'},
                    },
                },
                12: {
                    question: 'Указан ли выгодоприобретатель в договоре?',
                    answer: {
                        121: {answerText: 'Да'},
                        122: {answerText: 'Нет'},
                    },
                }
            },
            2: {
                21: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        211: {answerText: 'Представитель выгодоприобретателя/наследника'},
                        212: {answerText: 'выгодоприобретатель/Наследник'},
                    },
                },
                23: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        231: {
                            answerText: 'Да',
                            2311 : {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    23111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    23112: {answerText: 'Да, Водитель не застрахованный'},
                                    23113: {answerText: 'Нет'},
                                }
                            },
                        },
                        232: {
                            answerText: 'Нет',
                            2321: {
                                question: 'Было ли это отравление неустановленным ядом/неизвестным веществом?',
                                answer: {
                                    23211: {answerText: 'Да'},
                                    23212: {answerText: 'Нет'},
                                }
                            }
                        },
                    },
                },
                24: {
                    question: 'Указан ли выгодоприобретатель в договоре?',
                    answer: {
                        241: {answerText: 'Да'},
                        242: {answerText: 'Нет'},
                    },
                },
            },
            3: {
                31: {
                    question: 'Получена костная травма или травма сустава?',
                    answer: {
                        311: {answerText: 'да'},
                        312: {answerText: 'нет'},
                    },
                },
                32: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)?',
                    answer: {
                        321: {
                            answerText: 'Да',
                            3211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    32111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    32112: {answerText: 'Да, Водитель не застрахованный'},
                                    32113: {answerText: 'Нет'},
                                }
                            }
                        },
                        322: {answerText: 'Нет'},
                    },
                },
                33: {
                    question: 'С кем произошло событие?',
                    answer: {
                        331: {answerText: 'со Страхователем'},
                        332: {answerText: 'с Застрахованным из следующей категории лиц:  Супругой/Супругом,Родителем, Ребенком или Внуком Страхователя'},
                    },
                },
                34: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        341: {answerText: 'Представитель выгодоприобретателя/наследника'},
                        342: {answerText: 'выгодоприобретатель/Наследник'},
                    },
                },
            },
            4: {
                41: {
                    question: 'Группа инвалидности установлена впервые',
                    answer: {
                        412: {
                            answerText: 'Да',
                        },
                        411: {
                            answerText: 'Нет',
                        },
                    },
                },

                42: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        421: {
                            answerText: 'Да',
                            4211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    42111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    42112: {answerText: 'Да, Водитель не застрахованный'},
                                    42113: {answerText: 'Нет'},
                                }
                            }
                        },
                        422: {
                            answerText: 'Нет'
                        }
                    },
                },
                43: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        431: {
                            answerText: 'Представитель выгодоприобретателя/наследника',
                        },
                        432: {
                            answerText: 'выгодоприобретатель/Наследник',
                        },
                    },
                },
            },
            5: {
                51: {
                    question: 'Группа инвалидности установлена впервые',
                    answer: {
                        512: {
                            answerText: 'Да',
                        },
                        511: {
                            answerText: 'Нет',
                        },
                    },
                },
                52: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        521: {
                            answerText: 'Представитель выгодоприобретателя/наследника',
                        },
                        522: {
                            answerText: 'выгодоприобретатель/Наследник'
                        },
                    },
                },
            },
            6: {
                61: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        611: {
                            answerText: 'Представитель выгодоприобретателя/наследника',
                        },
                        612: {
                            answerText: 'выгодоприобретатель/Наследник',
                        },
                    },
                },
            },
            7: {
                71: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        711: {
                            answerText: 'Представитель выгодоприобретателя/наследника',
                        },
                        712: {
                            answerText: 'выгодоприобретатель/Наследник',
                        },
                    },
                },
                73: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        731: {
                            answerText: 'Да',
                            7311: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    73111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    73112: {answerText: 'Да, Водитель не застрахованный'},
                                    73113: {answerText: 'Нет'},
                                }
                            }
                        },
                        732: {answerText: 'Нет'},
                    },
                },

            },
            8: {
                81: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        811: {
                            answerText: 'Представитель выгодоприобретателя/наследника',
                        },
                        812: {
                            answerText: 'выгодоприобретатель/Наследник',
                        },
                    },
                },
                83: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        831: {
                            answerText: 'Да',
                            8311: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    83111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    83112: {answerText: 'Да, Водитель не застрахованный'},
                                    83113: {answerText: 'Нет'},
                                }
                            }
                        },
                        832: {answerText: 'Нет'},
                    },
                },

            },
            9: {
                91: {
                    question: 'Вы являетесь Застрахованным?',
                    answer: {
                        911: {
                            answerText: 'Да',
                        },
                        912: {
                            answerText: 'Нет',
                            9121: {
                                question: 'Кто будет подавать заявление?',
                                answer: {
                                    91211: {answerText: 'выгодоприобретатель/Наследник'},
                                    91212: {answerText: 'Представитель выгодоприобретателя/наследника'},
                                }
                            }
                        },
                    },
                },
                92: {
                    question: 'Является ли Застрахованный выгодоприобретателем?',
                    answer: {
                        921: {
                            answerText: 'да',
                        },
                        922: {
                            answerText: 'Нет',
                        },
                    },
                },
                93: {
                    question: 'Договор страхования заключен после 01.01.2014?',
                    answer: {
                        931: {
                            answerText: 'да',
                            9311: {
                                question: 'Является ли плательщик Выгодоприобретателем?',
                                answer: {
                                    93111: {answerText: 'да'},
                                    93112: {answerText: 'нет'},
                                }
                            }
                        },
                        932: {
                            answerText: 'Нет',
                        },
                    },
                },


            },

            11: {
                111: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        1111: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        1112: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                // 112: {
                //     question: 'Указан ли выгодоприобретатель в договоре?',
                //     answer: {
                //         1121: {
                //             answerText: 'Да',
                //         },
                //         1122: {
                //             answerText: 'нет',
                //         },
                //     },
                // },


            },
            12: {
                121: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        1211: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        1212: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                122: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        1221: {
                            answerText: 'Да',
                            12211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    122111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    122112: {answerText: 'Да, Водитель не застрахованный'},
                                    122113: {answerText: 'Нет'},
                                }
                            },

                        },
                        1222: {
                            answerText: 'нет',
                            12221: {
                                question: 'Было ли это отравление неустановленным ядом/неизвестным веществом?',
                                answer: {
                                    122211: {answerText: 'Да'},
                                    122212: {answerText: 'Нет'},
                                }
                            }

                        },
                    },
                },
                // 123: {
                //     question: 'Указан ли выгодоприобретатель в договоре?',
                //     answer: {
                //         1231: {
                //             answerText: 'да',
                //         },
                //         1232: {
                //             answerText: 'нет',
                //         },
                //     },
                // },

            },
            13: {
                131: {
                    question: 'Группа инвалидности установлена впервые',
                    answer: {
                        1312: {
                            answerText: 'да',
                        },
                        1311: {
                            answerText: 'нет',
                        },
                    },
                },
                132: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        1321: {
                            answerText: 'да',
                            13211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    132111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    132112: {answerText: 'Да, Водитель не застрахованный'},
                                    132113: {answerText: 'Нет'},
                                }
                            }

                        },
                        1322: {
                            answerText: 'нет',
                        },
                    },
                },
                133: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        1331: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',

                        },
                        1332: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },

            },
            14: {
                141: {
                    question: 'Группа инвалидности установлена впервые',
                    answer: {
                        1412: {
                            answerText: 'да',
                        },
                        1411: {
                            answerText: 'нет',
                        },
                    },
                },
                143: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        1431: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',

                        },
                        1432: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
            },
            15: {
                151: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        1511: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',

                        },
                        1512: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
            },
            16: {
                161: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        1611: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',

                        },
                        1612: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                162: {
                    question: 'Программа оформлена до 06.04.2015?',
                    answer: {
                        1621: {
                            answerText: 'Да',

                        },
                        1622: {
                            answerText: 'Нет',
                        },
                    },
                },
            },

            111: {
                1111: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        11111: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        11112: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                // 1112: {
                //     question: 'Указан ли выгодоприобретатель в договоре?',
                //     answer: {
                //         11121: {
                //             answerText: 'Да',
                //         },
                //         11122: {
                //             answerText: 'нет',
                //         },
                //     },
                // },


            },
            112: {
                1121: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        11211: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        11212: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                1122: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        11221: {
                            answerText: 'Да',
                            112211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    1122111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    1122112: {answerText: 'Да, Водитель не застрахованный'},
                                    1122113: {answerText: 'Нет'},
                                }
                            },

                        },
                        11222: {
                            answerText: 'нет',
                            112221: {
                                question: 'Было ли это отравление неустановленным ядом/неизвестным веществом?',
                                answer: {
                                    1122211: {answerText: 'Да'},
                                    1122212: {answerText: 'Нет'},
                                }
                            }

                        },
                    },
                },
                // 1123: {
                //     question: 'Указан ли выгодоприобретатель в договоре?',
                //     answer: {
                //         11231: {
                //             answerText: 'да',
                //         },
                //         11232: {
                //             answerText: 'нет',
                //         },
                //     },
                // },

            },
            113: {
                1131: {
                    question: 'Группа инвалидности установлена впервые',
                    answer: {
                        11312: {
                            answerText: 'да',
                        },
                        11311: {
                            answerText: 'нет',
                        },
                    },
                },
                1132: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        11321: {
                            answerText: 'да',
                            113211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    1132111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    1132112: {answerText: 'Да, Водитель не застрахованный'},
                                    1132113: {answerText: 'Нет'},
                                }
                            }

                        },
                        11322: {
                            answerText: 'нет',
                        },
                    },
                },
                1133: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        11331: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',

                        },
                        11332: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },

            },
            114: {
                1141: {
                    question: 'Группа инвалидности установлена впервые',
                    answer: {
                        11412: {
                            answerText: 'да',
                        },
                        11411: {
                            answerText: 'нет',
                        },
                    },
                },
                1143: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        11431: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',

                        },
                        11432: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
            },
            115: {
                1151: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        11511: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',

                        },
                        11512: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
            },
            116: {
                1161: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        11611: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',

                        },
                        11612: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                1162: {
                    question: 'Программа оформлена до 06.04.2015?',
                    answer: {
                        11621: {
                            answerText: 'Да',

                        },
                        11622: {
                            answerText: 'Нет',
                        },
                    },
                },
            },
            117: {
                1171: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        11711: {
                            answerText: 'Представитель выгодоприобретателя/наследника',
                        },
                        11712: {
                            answerText: 'выгодоприобретатель/Наследник',
                        },
                    },
                },
            },
            118: {
                1181: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        11811: {
                            answerText: 'Представитель выгодоприобретателя/наследника',
                        },
                        11812: {
                            answerText: 'выгодоприобретатель/Наследник',
                        },
                    },
                },
                1183: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        11831: {
                            answerText: 'Да',
                            118311: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    1183111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    1183112: {answerText: 'Да, Водитель не застрахованный'},
                                    1183113: {answerText: 'Нет'},
                                }
                            }
                        },
                        11832: {answerText: 'Нет'},
                    },
                },

            },
			119: {
                1191: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        11911: {
                            answerText: 'Представитель выгодоприобретателя/наследника',
                        },
                        11912: {
                            answerText: 'выгодоприобретатель/Наследник',
                        },
                    },
                },
                1193: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        11931: {
                            answerText: 'Да',
                            118911: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    1193111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    1193112: {answerText: 'Да, Водитель не застрахованный'},
                                    1193113: {answerText: 'Нет'},
                                }
                            }
                        },
                        11932: {answerText: 'Нет'},
                    },
                },

            },
            120: {
                1201: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        12011: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        12012: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
            },
            121: {
                1201: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        12111: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        12112: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
            },

            211: {
                2111: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        21111: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        21112: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                2112: {
                    question: 'Указан ли выгодоприобретатель в договоре?',
                    answer: {
                        21121: {
                            answerText: 'Да',
                        },
                        21122: {
                            answerText: 'нет',
                        },
                    },
                },


            },
            212: {
                2121: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        21211: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        21212: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                2122: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        21221: {
                            answerText: 'Да',
                            212211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    2122111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    2122112: {answerText: 'Да, Водитель не застрахованный'},
                                    2122113: {answerText: 'Нет'},
                                }
                            },

                        },
                        21222: {
                            answerText: 'нет',
                            212221: {
                                question: 'Было ли это отравление неустановленным ядом/неизвестным веществом?',
                                answer: {
                                    2122211: {answerText: 'Да'},
                                    2122212: {answerText: 'Нет'},
                                }
                            }

                        },
                    },
                },
                2123: {
                    question: 'Указан ли выгодоприобретатель в договоре?',
                    answer: {
                        21231: {
                            answerText: 'да',
                        },
                        21232: {
                            answerText: 'нет',
                        },
                    },
                },

            },
            213: {
                2131: {
                    question: 'Группа инвалидности установлена впервые',
                    answer: {
                        21312: {
                            answerText: 'да',
                        },
                        21311: {
                            answerText: 'нет',
                        },
                    },
                },
                2132: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        21321: {
                            answerText: 'да',
                            213211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    2132111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    2132112: {answerText: 'Да, Водитель не застрахованный'},
                                    2132113: {answerText: 'Нет'},
                                }
                            }

                        },
                        21322: {
                            answerText: 'нет',
                        },
                    },
                },
                2133: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        21331: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',

                        },
                        21332: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },

            },
            214: {
                2141: {
                    question: 'Группа инвалидности установлена впервые',
                    answer: {
                        21412: {
                            answerText: 'да',
                        },
                        21411: {
                            answerText: 'нет',
                        },
                    },
                },
                2143: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        21431: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',

                        },
                        21432: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
            },

            511: {
                5111: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        51111: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        51112: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                5112: {
                    question: 'Указан ли выгодоприобретатель в договоре?',
                    answer: {
                        51121: {
                            answerText: 'Да',
                        },
                        51122: {
                            answerText: 'нет',
                        },
                    },
                },


            },
            512: {
                5121: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        51211: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        51212: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                5122: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        51221: {
                            answerText: 'Да',
                            512211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    5122111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    5122112: {answerText: 'Да, Водитель не застрахованный'},
                                    5122113: {answerText: 'Нет'},
                                }
                            },

                        },
                        51222: {
                            answerText: 'нет',
                            512221: {
                                question: 'Было ли это отравление неустановленным ядом/неизвестным веществом?',
                                answer: {
                                    5122211: {answerText: 'Да'},
                                    5122212: {answerText: 'Нет'},
                                }
                            }

                        },
                    },
                },
                5123: {
                    question: 'Указан ли выгодоприобретатель в договоре?',
                    answer: {
                        51231: {
                            answerText: 'да',
                        },
                        51232: {
                            answerText: 'нет',
                        },
                    },
                },

            },
            513: {
                5131: {
                    question: 'Группа инвалидности установлена впервые',
                    answer: {
                        51312: {
                            answerText: 'да',
                        },
                        51311: {
                            answerText: 'нет',
                        },
                    },
                },
                5132: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        51321: {
                            answerText: 'да',
                            513211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    5132111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    5132112: {answerText: 'Да, Водитель не застрахованный'},
                                    5132113: {answerText: 'Нет'},
                                }
                            }

                        },
                        51322: {
                            answerText: 'нет',
                        },
                    },
                },
                5133: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        51331: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',

                        },
                        51332: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },

            },
            514: {
                5141: {
                    question: 'Группа инвалидности установлена впервые',
                    answer: {
                        51412: {
                            answerText: 'да',
                        },
                        51411: {
                            answerText: 'нет',
                        },
                    },
                },
                5143: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        51431: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',

                        },
                        51432: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
            },

            53: {
                531: {
                    question: 'Получена костная травма или травма сустава?',
                    answer: {
                        5311: {answerText: 'да'},
                        5312: {answerText: 'нет'},
                    },
                },
                532: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)?',
                    answer: {
                        5321: {
                            answerText: 'Да',
                            53211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    532111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    532112: {answerText: 'Да, Водитель не застрахованный'},
                                    532113: {answerText: 'Нет'},
                                }
                            }
                        },
                        5322: {answerText: 'Нет'},
                    },
                },
                533: {
                    question: 'С кем произошло событие?',
                    answer: {
                        5331: {answerText: 'со Страхователем'},
                        5332: {answerText: 'с Застрахованным из следующей категории лиц:  Супругой/Супругом,Родителем, Ребенком или Внуком Страхователя'},
                    },
                },
                534: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        5341: {answerText: 'Представитель выгодоприобретателя/наследника'},
                        5342: {answerText: 'выгодоприобретатель/Наследник'},
                    },
                },
            },
            54: {
                541: {
                    question: 'Группа инвалидности установлена впервые',
                    answer: {
                        5412: {
                            answerText: 'Да',
                        },
                        5411: {
                            answerText: 'Нет',
                        },
                    },
                },

                542: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        5421: {
                            answerText: 'Да',
                            54211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    542111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    542112: {answerText: 'Да, Водитель не застрахованный'},
                                    542113: {answerText: 'Нет'},
                                }
                            }
                        },
                        5422: {
                            answerText: 'Нет'
                        }
                    },
                },
                543: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        5431: {
                            answerText: 'Представитель выгодоприобретателя/наследника',
                        },
                        5432: {
                            answerText: 'выгодоприобретатель/Наследник',
                        },
                    },
                },
            },

            21: {
                211: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        2111: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        2112: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                212: {
                    question: 'Указан ли выгодоприобретатель в договоре?',
                    answer: {
                        2121: {
                            answerText: 'Да',
                        },
                        2122: {
                            answerText: 'нет',
                        },
                    },
                },


            },
            22: {
                221: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        2211: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        2212: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                222: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        2221: {
                            answerText: 'Да',
                            22211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    222111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    222112: {answerText: 'Да, Водитель не застрахованный'},
                                    222113: {answerText: 'Нет'},
                                }
                            },

                        },
                        2222: {
                            answerText: 'нет',
                            22221: {
                                question: 'Было ли это отравление неустановленным ядом/неизвестным веществом?',
                                answer: {
                                    222211: {answerText: 'Да'},
                                    222212: {answerText: 'Нет'},
                                }
                            }

                        },
                    },
                },
                223: {
                    question: 'Указан ли выгодоприобретатель в договоре?',
                    answer: {
                        2231: {
                            answerText: 'да',
                        },
                        2232: {
                            answerText: 'нет',
                        },
                    },
                },

            },

            41: {
                411: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        4111: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        4112: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                412: {
                    question: 'Указан ли выгодоприобретатель в договоре?',
                    answer: {
                        4121: {
                            answerText: 'Да',
                        },
                        4122: {
                            answerText: 'нет',
                        },
                    },
                },


            },
            42: {
                421: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        4211: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        4212: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                422: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        4221: {
                            answerText: 'Да',
                            42211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    422111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    422112: {answerText: 'Да, Водитель не застрахованный'},
                                    422113: {answerText: 'Нет'},
                                }
                            },

                        },
                        4222: {
                            answerText: 'нет',
                            42221: {
                                question: 'Было ли это отравление неустановленным ядом/неизвестным веществом?',
                                answer: {
                                    422211: {answerText: 'Да'},
                                    422212: {answerText: 'Нет'},
                                }
                            }

                        },
                    },
                },
                423: {
                    question: 'Указан ли выгодоприобретатель в договоре?',
                    answer: {
                        4231: {
                            answerText: 'да',
                        },
                        4232: {
                            answerText: 'нет',
                        },
                    },
                },

            },



            133: {
                1331: {
                    question: 'Получена костная травма или травма сустава?',
                    answer: {
                        13311: {answerText: 'да'},
                        13312: {answerText: 'нет'},
                    },
                },
                1332: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)?',
                    answer: {
                        13321: {
                            answerText: 'Да',
                            133211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    1332111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    1332112: {answerText: 'Да, Водитель не застрахованный'},
                                    1332113: {answerText: 'Нет'},
                                }
                            }
                        },
                        13322: {answerText: 'Нет'},
                    },
                },
                1333: {
                    question: 'С кем произошло событие?',
                    answer: {
                        13331: {answerText: 'со Страхователем'},
                        13332: {answerText: 'с Застрахованным из следующей категории лиц:  Супругой/Супругом,Родителем, Ребенком или Внуком Страхователя'},
                    },
                },
                1334: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        13341: {answerText: 'Представитель выгодоприобретателя/наследника'},
                        13342: {answerText: 'выгодоприобретатель/Наследник'},
                    },
                },
            },
            134: {
                1341: {
                    question: 'Группа инвалидности установлена впервые',
                    answer: {
                        13412: {
                            answerText: 'Да',
                        },
                        13411: {
                            answerText: 'Нет',
                        },
                    },
                },

                1342: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        13421: {
                            answerText: 'Да',
                            134211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    1342111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    1342112: {answerText: 'Да, Водитель не застрахованный'},
                                    1342113: {answerText: 'Нет'},
                                }
                            }
                        },
                        13422: {
                            answerText: 'Нет'
                        }
                    },
                },
                1343: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        13431: {
                            answerText: 'Представитель выгодоприобретателя/наследника',
                        },
                        13432: {
                            answerText: 'выгодоприобретатель/Наследник',
                        },
                    },
                },
            },
            31: {
                311: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        3111: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        3112: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                312: {
                    question: 'Указан ли выгодоприобретатель в договоре?',
                    answer: {
                        3121: {
                            answerText: 'Да',
                        },
                        3122: {
                            answerText: 'нет',
                        },
                    },
                },


            },
            32: {
                321: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        3211: {
                            answerText: 'Представитель Выгодоприобретателя/наследника',
                        },
                        3212: {
                            answerText: 'Выгодоприобретатель/Наследник',
                        },
                    },
                },
                322: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        3221: {
                            answerText: 'Да',
                            32211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    322111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    322112: {answerText: 'Да, Водитель не застрахованный'},
                                    322113: {answerText: 'Нет'},
                                }
                            },

                        },
                        3222: {
                            answerText: 'нет',
                            32221: {
                                question: 'Было ли это отравление неустановленным ядом/неизвестным веществом?',
                                answer: {
                                    322211: {answerText: 'Да'},
                                    322212: {answerText: 'Нет'},
                                }
                            }

                        },
                    },
                },
                323: {
                    question: 'Указан ли выгодоприобретатель в договоре?',
                    answer: {
                        3231: {
                            answerText: 'да',
                        },
                        3232: {
                            answerText: 'нет',
                        },
                    },
                },

            },
            33: {
                331: {
                    question: 'Получена костная травма или травма сустава?',
                    answer: {
                        3311: {answerText: 'да'},
                        3312: {answerText: 'нет'},
                    },
                },
                332: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)?',
                    answer: {
                        3321: {
                            answerText: 'Да',
                            33211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    332111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    332112: {answerText: 'Да, Водитель не застрахованный'},
                                    332113: {answerText: 'Нет'},
                                }
                            }
                        },
                        3322: {answerText: 'Нет'},
                    },
                },
                333: {
                    question: 'С кем произошло событие?',
                    answer: {
                        3331: {answerText: 'со Страхователем'},
                        3332: {answerText: 'с Застрахованным из следующей категории лиц:  Супругой/Супругом,Родителем, Ребенком или Внуком Страхователя'},
                    },
                },
                334: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        3341: {answerText: 'Представитель выгодоприобретателя/наследника'},
                        3342: {answerText: 'выгодоприобретатель/Наследник'},
                    },
                },
            },
            34: {
                341: {
                    question: 'Группа инвалидности установлена впервые',
                    answer: {
                        3412: {
                            answerText: 'Да',
                        },
                        3411: {
                            answerText: 'Нет',
                        },
                    },
                },

                342: {
                    question: 'Обстоятельства события зафиксированы или должны быть зафиксированы в соответствии с Законодательством (например: ДТП, травма на производстве, уголовные деяния и тд.)',
                    answer: {
                        3421: {
                            answerText: 'Да',
                            34211: {
                                question: 'Было ли это ДТП?',
                                answer: {
                                    342111: {answerText: 'Да, Застрахованный являлся водителем'},
                                    342112: {answerText: 'Да, Водитель не застрахованный'},
                                    342113: {answerText: 'Нет'},
                                }
                            }
                        },
                        3422: {
                            answerText: 'Нет'
                        }
                    },
                },
                343: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        3431: {
                            answerText: 'Представитель выгодоприобретателя/наследника',
                        },
                        3432: {
                            answerText: 'выгодоприобретатель/Наследник',
                        },
                    },
                },
            },
            35: {
                351: {
                    question: 'Группа инвалидности установлена впервые',
                    answer: {
                        3512: {
                            answerText: 'Да',
                        },
                        3511: {
                            answerText: 'Нет',
                        },
                    },
                },
                352: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        3521: {
                            answerText: 'Представитель выгодоприобретателя/наследника',
                        },
                        3522: {
                            answerText: 'выгодоприобретатель/Наследник'
                        },
                    },
                },
            },
            36: {
                361: {
                    question: 'Кто будет подавать заявление?',
                    answer: {
                        3611: {
                            answerText: 'Представитель выгодоприобретателя/наследника',
                        },
                        3612: {
                            answerText: 'выгодоприобретатель/Наследник',
                        },
                    },
                },
            },


        }

        var documents = {
            1: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br/>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования'
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика'
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 111
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий право на получение выплаты (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о праве на наследство по закону на страховую выплату <br>' +
                            '2. Справка о круге наследников, выданная по истечении 6 месяцев со дня смерти. <br>' +
                            '<br>' +
                            '<u>При этом справка должна удовлетворять следующим критериям:</u><br>' +
                            '- указаны наследник/наследники с полным ФИО и датой рождения<br>' +
                            '- указаны ФИО и дата рождения/дата смерти умершего лица<br>' +
                            '- содержатся данные нотариуса: ФИО, юридический адрес, подпись, печать<br>',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 122
                    }
                }
            },
            2: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования'
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика'
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: ''
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию'
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2.Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)'
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 211
                    }
                },
                2: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 23111
                    }
                },
                3: {
                    1: {
                        name: 'Акт (выписка из акта) судебно-медицинского исследования трупа с приложением результатов судебно-химического исследования',
                        form: 'копия, заверенная выдавшим органом',
                        where: 'Бюро судебно-медицинской экспертизы ',
                        hidden: true,
                        answerId: 23211
                    }
                },
                4: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 231
                    }
                },
                5: {
                    1: {
                        name: 'Документ, подтверждающий право на получение выплаты (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о праве на наследство по закону на страховую выплату <br>' +
                            '2. Справка о круге наследников, выданная по истечении 6 месяцев со дня смерти. <br>' +
                            '<br>' +
                            '<u>При этом справка должна удовлетворять следующим критериям:</u><br>' +
                            '- указаны наследник/наследники с полным ФИО и датой рождения<br>' +
                            '- указаны ФИО и дата рождения/дата смерти умершего лица<br>' +
                            '- содержатся данные нотариуса: ФИО, юридический адрес, подпись, печать<br>',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 242
                    }
                },
            },
            3: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'Оригинал по форме Страховщика.<br/>' +
                            'Если предполагается выплата по травме ребенка одному из родителей, обязательно в заявлении заполнить раздел "согласие второго родителя".',
                        where: '1. в отделении Банка<br/>' +
                            '2. На сайте Страховщика<br/>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Медицинский документ с указанием  даты телесного повреждения, установленного диагноза, описанием проведенного лечения и продолжительностью лечения, и позволяющий сделать заключение о причинах травмы (один из): <br/>' +
                            '<br/>' +
                            '1. Выписка из амбулаторной карты <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractoutpatientcard" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br/>' +
                            '2. Справка из травмпункта <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="emergencyroom" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br/>' +
                            '3. Выписной эпикриз <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="dischargereport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                    },
                },
                1: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 32111

                    }
                },
                2: {
                    1: {
                        name: 'Описание лабораторных и инструментальных исследований (один из):<br>' +
                            '1. описание рентгеновских снимков <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="xraypictures" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. описание МРТ <br>' +
                            '3. протоколы выполненных операций и манипуляций',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                        hidden: true,
                        answerId: 311

                    }
                },
                3: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 321

                    }
                },
                4: {
                    1: {
                        name: 'Документы, устанавливающие родство между Страхователем и Застрахованным лицом, получившим травму (один из, что применимо в зависимости от программы страхования):<br>' +
                            '<br>' +
                            '1. Свидетельство о рождении<br>' +
                            '2. Свидетельство о заключении брака',
                        form: 'копия',
                        where: '',
                        hidden: true,
                        answerId: 332

                    }
                },
                5: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия/копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 341

                    }
                },
            },
            4: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события:<br>' +
                            '<br>' +
                            '1. Справка об установлении Застрахованному лицу группы инвалидности  (по текущей группе инвалидности) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="disabilitycertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: ' нотариально заверенная копия',
                        where: 'Оригинал выдается в Бюро Медико-социальной экспертизы, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине инвалидности (один из): <br>' +
                            '<br>' +
                            '1. Протокол проведения медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="expertreport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Обратный талон медико-социальной экспертизы или Сведения о результатах проведенной медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="examinationcoupon" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Направление на медико-социальную экспертизу организацией, оказывающей лечебно-профилактическую помощь <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="directionexpertise" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. Бюро медико-социальной экспертизы; <br>' +
                            '2. ЛПУ, выдавшее направление на МСЭ',
                    },
                },
                1: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 42111,
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 431,
                    }
                },
                3: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 421,
                    }
                },
                4: {
                    1: {
                        name: 'Справки, выданные федеральным государственным учреждением медико-социальной экспертизы, об установленных ранее группах инвалидности',
                        form: 'копия',
                        where: 'Бюро Медико-социальной экспертизы',
                        hidden: true,
                        answerId: 411,
                    }
                },


            },
            5: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события:<br>' +
                            '<br>' +
                            '1. Справка об установлении Застрахованному лицу группы инвалидности  (по текущей группе инвалидности) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="disabilitycertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: ' нотариально заверенная копия',
                        where: 'Оригинал выдается в Бюро Медико-социальной экспертизы, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине инвалидности (один из): <br>' +
                            '<br>' +
                            '1. Протокол проведения медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="expertreport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Обратный талон медико-социальной экспертизы или Сведения о результатах проведенной медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="examinationcoupon" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Направление на медико-социальную экспертизу организацией, оказывающей лечебно-профилактическую помощь <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="directionexpertise" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. Бюро медико-социальной экспертизы; <br>' +
                            '2. ЛПУ, выдавшее направление на МСЭ',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Справки, выданные федеральным государственным учреждением медико-социальной экспертизы, об установленных ранее группах инвалидности',
                        form: 'копия',
                        where: 'Бюро Медико-социальной экспертизы',
                        hidden: true,
                        answerId: 511,
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 521,
                    }
                },
            },
            6: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Медицинский документ с указанием установленного диагноза, даты его установления  (один из):<br>' +
                            '1. выписной эпикриз <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="dischargereport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. выписка из амбулаторной карты/истории болезни <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractoutpatientcard" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '<br>' +
                            'В документе также необходимо наличие результатов исследований, подтверждающий установленный диагноз (результаты гистопатологического анализа; результаты компьютерной томографии (КТ) и/или магнитно-резонансной томографии (МРТ); результаты коронарной ангиографии и т.п.) ',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 611,
                    }
                },
            },
            7: {
                0: {
                    1: {
                        name: 'Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, содержащий информацию о причинах заявляемого события: <br>' +
                            '<br>' +
                            '1.выписной эпикриз из медицинской карты стационарного больного с указанием даты несчастного случая и сроки госпитализации <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="dischargereport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                    },
                },
                1: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 73111,
                    }
                },
                2: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 731,
                    }
                },
                3: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 711,
                    }
                },
            },
            8: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, содержащий информацию о причинах заявляемого события (один из): <br>' +
                            '<br>' +
                            '1. выписной эпикриз из медицинской карты стационарного больного  с указанием диагноза, даты несчастного случая, приведшего к хирургическому вмешательству, даты проведения хирургической операции, названия и результатов операции и информацией, позволяющей сделать заключение о причинах проведения оперативного вмешательства <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="dischargereport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2.  протокол операции с указанием диагноза, даты несчастного случая, приведшего к хирургическому вмешательству, даты проведения хирургической операции, названия и результатов операции и информацией, позволяющей сделать заключение о причинах проведения оперативного вмешательства <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="operationprotocol" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором было проведено хирургическое вмешательство',
                    },
                },
                1: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 83111,
                    }
                },
                2: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 831,
                    }
                },
                3: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 811,
                    }
                },
            },
            9: {
                0: {
                    1: {
                        name: 'Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="insurancepolicy" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'выдается на руки при оформлении договора страхования',
                    },
                    2: {
                        name: 'Заявление от ВП о наступлении дожития с указанием полных реквизитов Выгодоприобретателя. При обращении нескольких Выгодоприобретателей заявление предоставляется на каждого заявителя отдельно <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="beneficiarystatement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. В отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, подтверждающий нахождение Застрахованного лица в живых <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="personalive" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, заверенная сотрудником Банка/нотариально заверенная копия',
                        where: 'выдается на руки при оформлении договора страхования',
                    },
                },
                1: {
                    1: {
                        name: 'Заявление от каждого наследника о наступлении дожития с указанием полных реквизитов каждого наследника',
                        form: 'оригинал по форме Страховщика',
                        where: '1. В отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                        hidden: true,
                        answerId: 91211,
                    },
                },
                2: {
                    1: {
                        name: 'Заявление от представителя Выгодоприобретателя о наступлении дожития с указанием полных реквизитов Выгодоприобретателя или его законного представителя',
                        form: 'оригинал по форме Страховщика',
                        where: '1. В отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                        hidden: true,
                        answerId: 91212,
                    },
                },
                3: {
                    1: {
                        name: 'Документ, удостоверяющего личность представителя',
                        form: 'копия',
                        where: '',
                        hidden: true,
                        answerId: 922,
                    },
                },
                4: {
                    1: {
                        name: 'Документ, подтверждающий родственную связь Плательщика (лица уплатившего взносы) и Выгодоприобретателя (получателя выплаты) ',
                        form: 'копия',
                        where: '',
                        hidden: true,
                        answerId: 93112,
                    },
                },
            },

            11: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br/>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования'
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика'
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 1111
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий право на получение выплаты (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о праве на наследство по закону на страховую выплату <br>' +
                            '2. Справка о круге наследников, выданная по истечении 6 месяцев со дня смерти. <br>' +
                            '<br>' +
                            '<u>При этом справка должна удовлетворять следующим критериям:</u><br>' +
                            '- указаны наследник/наследники с полным ФИО и датой рождения<br>' +
                            '- указаны ФИО и дата рождения/дата смерти умершего лица<br>' +
                            '- содержатся данные нотариуса: ФИО, юридический адрес, подпись, печать<br>',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 1122
                    }
                }

            },
            12: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. В отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 1211
                    }
                },
                2: {
                    1: {
                        name: 'Свидетельство о праве на наследство по закону на страховую выплату',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 1122
                    }
                },
                3: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 1221
                    }
                },
                4: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 122111
                    }
                },
                5: {
                    1: {
                        name: 'Акт (выписка из акта) судебно-медицинского исследования трупа с приложением результатов судебно-химического исследования',
                        form: 'копия, заверенная выдавшим органом',
                        where: 'Бюро судебно-медицинской экспертизы ',
                        hidden: true,
                        answerId: 122211
                    }
                },
                6: {
                    1: {
                        name: 'Свидетельство о праве на наследство по закону на страховую выплату',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 1231
                    }
                },



            },
            13: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события:<br>' +
                            '<br>' +
                            '1. Справка об установлении Застрахованному лицу группы инвалидности  (по текущей группе инвалидности) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="disabilitycertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: ' нотариально заверенная копия',
                        where: 'Оригинал выдается в Бюро Медико-социальной экспертизы, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине инвалидности (один из): <br>' +
                            '<br>' +
                            '1. Протокол проведения медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="expertreport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Обратный талон медико-социальной экспертизы или Сведения о результатах проведенной медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="examinationcoupon" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Направление на медико-социальную экспертизу организацией, оказывающей лечебно-профилактическую помощь <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="directionexpertise" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. Бюро медико-социальной экспертизы; <br>' +
                            '2. ЛПУ, выдавшее направление на МСЭ',
                    },
                },
                1: {
                    1: {
                        name: 'Справки, выданные федеральным государственным учреждением медико-социальной экспертизы, об установленных ранее группах инвалидности',
                        form: 'копия',
                        where: 'Бюро Медико-социальной экспертизы',
                        hidden: true,
                        answerId: 1311,
                    }
                },
                2: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 1321,
                    }
                },
                3: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 132111
                    }
                },
                4: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 1331,
                    }
                },


            },
            14: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события:<br>' +
                            '<br>' +
                            '1. Справка об установлении Застрахованному лицу группы инвалидности  (по текущей группе инвалидности) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="disabilitycertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: ' нотариально заверенная копия',
                        where: 'Оригинал выдается в Бюро Медико-социальной экспертизы, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине инвалидности (один из): <br>' +
                            '<br>' +
                            '1. Протокол проведения медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="expertreport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Обратный талон медико-социальной экспертизы или Сведения о результатах проведенной медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="examinationcoupon" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Направление на медико-социальную экспертизу организацией, оказывающей лечебно-профилактическую помощь <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="directionexpertise" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. Бюро медико-социальной экспертизы; <br>' +
                            '2. ЛПУ, выдавшее направление на МСЭ',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Справки, выданные федеральным государственным учреждением медико-социальной экспертизы, об установленных ранее группах инвалидности',
                        form: 'копия',
                        where: 'Бюро Медико-социальной экспертизы',
                        hidden: true,
                        answerId: 1411,
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 1431,
                    }
                },


            },
            15: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br/>' +
                            '<br/>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br/>' +
                            '2. На сайте Страховщика<br/>' +
                            '3. В офисе Страховщика'
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Листки нетрудоспособности по заявляемому событию, в т.ч. закрытый листок нетрудоспособности <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="nowork" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копии, заверенные работодателем или выдавшим лечебным учреждением',
                        where: '',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причинах заявляемого события (один из): <br/>' +
                            '<br/>' +
                            '1. выписка из медицинской карты амбулаторного больного, содержащая точную дату установления диагноза, назначенное и проводимое лечение заболевания (включая сроки), в результате которого наступила временная нетрудоспособность (если медицинская помощь была оказана в амбулаторных условиях); <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractoutpatientcard" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br/>' +
                            '2. выписной эпикриз из медицинской карты стационарного больного, содержащий точную дату установления диагноза, назначенное и проводимое лечение заболевания (включая сроки), в результате которого наступила временная нетрудоспособность (если медицинская помощь была оказана в стационарных условиях) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="dischargereport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 1511,
                    }
                },


            },
            16: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. В отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Листки нетрудоспособности по заявляемому событию, в т.ч. закрытый листок нетрудоспособности <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="nowork" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копии, заверенные работодателем или выдавшим лечебным учреждением',
                        where: '',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причинах заявляемого события (один из): <br>' +
                            '1. выписка из медицинской карты амбулаторного больного, содержащая точную дату установления диагноза, назначенное и проводимое лечение заболевания (включая сроки), в результате которого наступила временная нетрудоспособность (если медицинская помощь была оказана в амбулаторных условиях); <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractoutpatientcard" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br/>' +
                            '2. выписной эпикриз из медицинской карты стационарного больного, содержащий точную дату установления диагноза, назначенное и проводимое лечение заболевания (включая сроки), в результате которого наступила временная нетрудоспособность (если медицинская помощь была оказана в стационарных условиях) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="dischargereport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 1611,
                    }
                },
                2: {
                    1: {
                        name: 'Кредитный договор с информацией о датах и суммах ежемесячных платежей',
                        form: 'копия',
                        where: 'Выдается на руки при заключении кредитного договора ',
                        hidden: true,
                        answerId: 1621,
                    },
                    2: {
                        name: 'Первоначальный график платежей',
                        form: 'копия',
                        where: 'Выдается на руки при заключении кредитного договора ',
                        hidden: true,
                        answerId: 1621,
                    }
                },


            },

            111: {
                0: {
                    1: {
                        name: 'Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования'
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика'
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 11111
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий право на получение выплаты (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о праве на наследство по закону на страховую выплату <br>' +
                            '2. Справка о круге наследников, выданная по истечении 6 месяцев со дня смерти. <br>' +
                            '<br>' +
                            '<u>При этом справка должна удовлетворять следующим критериям:</u><br>' +
                            '- указаны наследник/наследники с полным ФИО и датой рождения<br>' +
                            '- указаны ФИО и дата рождения/дата смерти умершего лица<br>' +
                            '- содержатся данные нотариуса: ФИО, юридический адрес, подпись, печать<br>',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 11122
                    }
                }

            },
            112: {
                0: {
                    1: {
                        name: 'Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования'
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика'
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: ''
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию'
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)'
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 11211
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий право на получение выплаты (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о праве на наследство по закону на страховую выплату <br>' +
                            '2. Справка о круге наследников, выданная по истечении 6 месяцев со дня смерти. <br>' +
                            '<br>' +
                            '<u>При этом справка должна удовлетворять следующим критериям:</u><br>' +
                            '- указаны наследник/наследники с полным ФИО и датой рождения<br>' +
                            '- указаны ФИО и дата рождения/дата смерти умершего лица<br>' +
                            '- содержатся данные нотариуса: ФИО, юридический адрес, подпись, печать<br>',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 11122
                    }
                },
                3: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 11221
                    }
                },
                4: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 1122111
                    }
                },
                5: {
                    1: {
                        name: 'Акт (выписка из акта) судебно-медицинского исследования трупа с приложением результатов судебно-химического исследования',
                        form: 'копия, заверенная выдавшим органом',
                        where: 'Бюро судебно-медицинской экспертизы ',
                        hidden: true,
                        answerId: 1122211
                    }
                },
                6: {
                    1: {
                        name: 'Документ, подтверждающий право на получение выплаты (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о праве на наследство по закону на страховую выплату <br>' +
                            '2. Справка о круге наследников, выданная по истечении 6 месяцев со дня смерти. <br>' +
                            '<br>' +
                            '<u>При этом справка должна удовлетворять следующим критериям:</u><br>' +
                            '- указаны наследник/наследники с полным ФИО и датой рождения<br>' +
                            '- указаны ФИО и дата рождения/дата смерти умершего лица<br>' +
                            '- содержатся данные нотариуса: ФИО, юридический адрес, подпись, печать<br>',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 11231
                    }
                },



            },
            113: {
                0: {
                    1: {
                        name: 'Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события:<br>' +
                            '<br>' +
                            '1. Справка об установлении Застрахованному лицу группы инвалидности  (по текущей группе инвалидности) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="disabilitycertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: ' нотариально заверенная копия',
                        where: 'Оригинал выдается в Бюро Медико-социальной экспертизы, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине инвалидности (один из): <br>' +
                            '<br>' +
                            '1. Протокол проведения медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="expertreport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Обратный талон медико-социальной экспертизы или Сведения о результатах проведенной медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="examinationcoupon" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Направление на медико-социальную экспертизу организацией, оказывающей лечебно-профилактическую помощь <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="directionexpertise" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. Бюро медико-социальной экспертизы; <br>' +
                            '2. ЛПУ, выдавшее направление на МСЭ',
                    },
                },
                1: {
                    1: {
                        name: 'Справки, выданные федеральным государственным учреждением медико-социальной экспертизы, об установленных ранее группах инвалидности',
                        form: 'копия',
                        where: 'Бюро Медико-социальной экспертизы',
                        hidden: true,
                        answerId: 11311,
                    }
                },
                2: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 11321,
                    }
                },
                3: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 1132111
                    }
                },
                4: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 11331,
                    }
                },


            },
            114: {
                0: {
                    1: {
                        name: 'Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события:<br>' +
                            '<br>' +
                            '1. Справка об установлении Застрахованному лицу группы инвалидности  (по текущей группе инвалидности) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="disabilitycertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: ' нотариально заверенная копия',
                        where: 'Оригинал выдается в Бюро Медико-социальной экспертизы, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине инвалидности (один из): <br>' +
                            '<br>' +
                            '1. Протокол проведения медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="expertreport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Обратный талон медико-социальной экспертизы или Сведения о результатах проведенной медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="examinationcoupon" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Направление на медико-социальную экспертизу организацией, оказывающей лечебно-профилактическую помощь <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="directionexpertise" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. Бюро медико-социальной экспертизы; <br>' +
                            '2. ЛПУ, выдавшее направление на МСЭ',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Справки, выданные федеральным государственным учреждением медико-социальной экспертизы, об установленных ранее группах инвалидности',
                        form: 'копия',
                        where: 'Бюро Медико-социальной экспертизы',
                        hidden: true,
                        answerId: 11411,
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 11431,
                    }
                },


            },
            115: {
                0: {
                    1: {
                        name: 'Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '"1. в отделении Банка\n' +
                            '2. На сайте Страховщика\n' +
                            '3. В офисе Страховщика"',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Листки нетрудоспособности по заявляемому событию, в т.ч. закрытый листок нетрудоспособности <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="nowork" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копии, заверенные работодателем или выдавшим лечебным учреждением',
                        where: '',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причинах заявляемого события (один из): <br>' +
                            '1. выписка из медицинской карты амбулаторного больного, содержащая точную дату установления диагноза, назначенное и проводимое лечение заболевания (включая сроки), в результате которого наступила временная нетрудоспособность (если медицинская помощь была оказана в амбулаторных условиях); <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractoutpatientcard" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br/>' +
                            '2. выписной эпикриз из медицинской карты стационарного больного, содержащий точную дату установления диагноза, назначенное и проводимое лечение заболевания (включая сроки), в результате которого наступила временная нетрудоспособность (если медицинская помощь была оказана в стационарных условиях) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="dischargereport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 11511,
                    }
                },


            },
            116: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '"1. в отделении Банка\n' +
                            '2. На сайте Страховщика\n' +
                            '3. В офисе Страховщика"'
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: ' Документ, подтверждающий факт заключения трудового договора:<br/>' +
                            '<br>' +
                            '1. Трудовой договор со всеми дополнительными соглашениями (необходим договор, действующий на момент подписания заявления на страхование и договор с последнего места работы) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="laborcontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная работодателем',
                        where: '',
                    },
                    5: {
                        name: '"Документ, подтверждающий факт прекращения/расторжения трудового договора с последнего места работы (один из):\n' +
                            '1. Приказ об увольнении/выписка из приказа об увольнении <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="dismissalorder" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>\n' +
                            '2. Уведомление о сокращении\n' +
                            '3. Решение суда, вступившее в силу"',
                        form: 'нотариально заверенная копия/копия, заверенная работодателем',
                        where: '',
                    },
                    6: {
                        name: 'Трудовая книжка (все страницы) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="employmenthistory" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная работодателем',
                        where: '',
                    },
                    7: {
                        name: '"Документ, подтверждающий регистрацию в качестве безработного или гражданина, ищущего работу:\n' +
                            '1. справка из центра занятости населения, выданная по истечении временной франшизы, предусмотренной Договором страхования"',
                        form: 'оригинал',
                        where: 'Центр занятости населения',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 11611,
                    },
					2: {
                        name: 'Кредитный договор с информацией о датах и суммах ежемесячных платежей',
                        form: 'копия',
                        where: 'Выдается на руки при заключении кредитного договора ',
                        hidden: true,
                        answerId: 11621,
                    },
                    3: {
                        name: 'Первоначальный график платежей',
                        form: 'копия',
                        where: 'Выдается на руки при заключении кредитного договора ',
                        hidden: true,
                        answerId: 11621,
                    }
                },

            },
            117: {
                0: {
                    1: {
                        name: 'Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Медицинский документ с указанием установленного диагноза, даты его установления  (один из):<br>' +
                            '1. выписной эпикриз <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractoutpatientcard" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. выписка из амбулаторной карты/истории болезни <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="dischargereport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '<br>' +
                            'В документе также необходимо наличие результатов исследований, подтверждающий установленный диагноз (результаты гистопатологического анализа; результаты компьютерной томографии (КТ) и/или магнитно-резонансной томографии (МРТ); результаты коронарной ангиографии и т.п.) ',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 11711,
                    }
                },
            },
            118: {
                0: {
                    1: {
                        name: 'Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, содержащий информацию о причинах заявляемого события: <br>' +
                            '<br>' +
                            '1.выписной эпикриз из медицинской карты стационарного больного с указанием даты несчастного случая и сроки госпитализации <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractoutpatientcard" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                    },
                },
                1: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 1183111,
                    }
                },
                2: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 11831,
                    }
                },
                3: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 11811,
                    }
                },
            },
			119: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Листки нетрудоспособности по заявляемому событию, в т.ч. закрытый листок нетрудоспособности <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="nowork" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копии, заверенные работодателем или выдавшим лечебным учреждением',
                        where: '',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причинах заявляемого события (один из): <br/>' +
                            '<br/>' +
                            '1. выписка из медицинской карты амбулаторного больного, содержащая точную дату установления диагноза, назначенное и проводимое лечение заболевания (включая сроки), в результате которого наступила временная нетрудоспособность (если медицинская помощь была оказана в амбулаторных условиях); <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractoutpatientcard" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br/>' +
                            '2. выписной эпикриз из медицинской карты стационарного больного, содержащий точную дату установления диагноза, назначенное и проводимое лечение заболевания (включая сроки), в результате которого наступила временная нетрудоспособность (если медицинская помощь была оказана в стационарных условиях) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="dischargereport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                    },
                },
                1: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 1193111,
                    }
                },
                2: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 11931,
                    }
                },
                3: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 11911,
                    }
                },
            },
            120: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная работодателем',
                        where: '',
                    },
                    4: {
                        name: 'Документы, подтверждающие размер предыдущего оклада, факт снижения оклада: <br>' +
                            '1. Трудовой договор или дополнительное соглашение к трудовому договору, содержащие информацию об окладе и предыдущем окладе <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="paymentdocument" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 12011,
                    }
                },
            },
            121: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная работодателем',
                        where: '',
                    },
                    4: {
                        name: 'Документ, содержащий информацию о причинах заявляемого события: <br>' +
                            '<br>' +
                            '1.выписной эпикриз из медицинской карты стационарного больного с указанием даты несчастного случая и сроки госпитализации <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="dischargereport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                    },
                    5: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 12111,
                    }
                },
            },

            211: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br/>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования'
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика'
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 21111
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий право на получение выплаты (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о праве на наследство по закону на страховую выплату <br>' +
                            '2. Справка о круге наследников, выданная по истечении 6 месяцев со дня смерти. <br>' +
                            '<br>' +
                            '<u>При этом справка должна удовлетворять следующим критериям:</u><br>' +
                            '- указаны наследник/наследники с полным ФИО и датой рождения<br>' +
                            '- указаны ФИО и дата рождения/дата смерти умершего лица<br>' +
                            '- содержатся данные нотариуса: ФИО, юридический адрес, подпись, печать<br>',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 21122
                    }
                }

            },
            212: {
                0: {
                    1: {
                        name: 'Документ, подтверждающий факт заключения договора страхования - Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="insurancepolicy" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. В отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 21211
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий право на получение выплаты (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о праве на наследство по закону на страховую выплату <br>' +
                            '2. Справка о круге наследников, выданная по истечении 6 месяцев со дня смерти. <br>' +
                            '<br>' +
                            '<u>При этом справка должна удовлетворять следующим критериям:</u><br>' +
                            '- указаны наследник/наследники с полным ФИО и датой рождения<br>' +
                            '- указаны ФИО и дата рождения/дата смерти умершего лица<br>' +
                            '- содержатся данные нотариуса: ФИО, юридический адрес, подпись, печать<br>',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 21122
                    }
                },
                3: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 21221
                    }
                },
                4: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 2122111
                    }
                },
                5: {
                    1: {
                        name: 'Акт (выписка из акта) судебно-медицинского исследования трупа с приложением результатов судебно-химического исследования',
                        form: 'копия, заверенная выдавшим органом',
                        where: 'Бюро судебно-медицинской экспертизы ',
                        hidden: true,
                        answerId: 2122211
                    }
                },
                6: {
                    1: {
                        name: 'Документ, подтверждающий право на получение выплаты (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о праве на наследство по закону на страховую выплату <br>' +
                            '2. Справка о круге наследников, выданная по истечении 6 месяцев со дня смерти. <br>' +
                            '<br>' +
                            '<u>При этом справка должна удовлетворять следующим критериям:</u><br>' +
                            '- указаны наследник/наследники с полным ФИО и датой рождения<br>' +
                            '- указаны ФИО и дата рождения/дата смерти умершего лица<br>' +
                            '- содержатся данные нотариуса: ФИО, юридический адрес, подпись, печать<br>',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 21231
                    }
                },



            },
            213: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br/>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события:<br>' +
                            '<br>' +
                            '1. Справка об установлении Застрахованному лицу группы инвалидности  (по текущей группе инвалидности) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="disabilitycertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: ' нотариально заверенная копия',
                        where: 'Оригинал выдается в Бюро Медико-социальной экспертизы, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине инвалидности (один из): <br>' +
                            '<br>' +
                            '1. Протокол проведения медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="expertreport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Обратный талон медико-социальной экспертизы или Сведения о результатах проведенной медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="examinationcoupon" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Направление на медико-социальную экспертизу организацией, оказывающей лечебно-профилактическую помощь <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="directionexpertise" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. Бюро медико-социальной экспертизы; <br>' +
                            '2. ЛПУ, выдавшее направление на МСЭ',
                    },
                },
                1: {
                    1: {
                        name: 'Справки, выданные федеральным государственным учреждением медико-социальной экспертизы, об установленных ранее группах инвалидности',
                        form: 'копия',
                        where: 'Бюро Медико-социальной экспертизы',
                        hidden: true,
                        answerId: 21311,
                    }
                },
                2: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 21321,
                    }
                },
                3: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 2132111
                    }
                },
                4: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 21331,
                    }
                },


            },
            214: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br/>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события:<br>' +
                            '<br>' +
                            '1. Справка об установлении Застрахованному лицу группы инвалидности  (по текущей группе инвалидности) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="disabilitycertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: ' нотариально заверенная копия',
                        where: 'Оригинал выдается в Бюро Медико-социальной экспертизы, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине инвалидности (один из): <br>' +
                            '<br>' +
                            '1. Протокол проведения медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="expertreport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Обратный талон медико-социальной экспертизы или Сведения о результатах проведенной медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="examinationcoupon" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Направление на медико-социальную экспертизу организацией, оказывающей лечебно-профилактическую помощь <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="directionexpertise" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. Бюро медико-социальной экспертизы; <br>' +
                            '2. ЛПУ, выдавшее направление на МСЭ',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Справки, выданные федеральным государственным учреждением медико-социальной экспертизы, об установленных ранее группах инвалидности',
                        form: 'копия',
                        where: 'Бюро Медико-социальной экспертизы',
                        hidden: true,
                        answerId: 21411,
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 21431,
                    }
                },


            },

            511: {
                0: {
                    1: {
                        name: 'Договор страхования/Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="contractzashchishchennyyzayemshchik" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования'
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика'
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 51111
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий право на получение выплаты (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о праве на наследство по закону на страховую выплату <br>' +
                            '2. Справка о круге наследников, выданная по истечении 6 месяцев со дня смерти. <br>' +
                            '<br>' +
                            '<u>При этом справка должна удовлетворять следующим критериям:</u><br>' +
                            '- указаны наследник/наследники с полным ФИО и датой рождения<br>' +
                            '- указаны ФИО и дата рождения/дата смерти умершего лица<br>' +
                            '- содержатся данные нотариуса: ФИО, юридический адрес, подпись, печать<br>',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 51122
                    }
                }

            },
            512: {
                0: {
                    1: {
                        name: 'Документ, подтверждающий факт заключения договора страхования - Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="contractzashchishchennyyzayemshchik" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. В отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 51211
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий право на получение выплаты (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о праве на наследство по закону на страховую выплату <br>' +
                            '2. Справка о круге наследников, выданная по истечении 6 месяцев со дня смерти. <br>' +
                            '<br>' +
                            '<u>При этом справка должна удовлетворять следующим критериям:</u><br>' +
                            '- указаны наследник/наследники с полным ФИО и датой рождения<br>' +
                            '- указаны ФИО и дата рождения/дата смерти умершего лица<br>' +
                            '- содержатся данные нотариуса: ФИО, юридический адрес, подпись, печать<br>',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 51122
                    }
                },
                3: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 51221
                    }
                },
                4: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 5122111
                    }
                },
                5: {
                    1: {
                        name: 'Акт (выписка из акта) судебно-медицинского исследования трупа с приложением результатов судебно-химического исследования',
                        form: 'копия, заверенная выдавшим органом',
                        where: 'Бюро судебно-медицинской экспертизы ',
                        hidden: true,
                        answerId: 5122211
                    }
                },
                6: {
                    1: {
                        name: 'Документ, подтверждающий право на получение выплаты (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о праве на наследство по закону на страховую выплату <br>' +
                            '2. Справка о круге наследников, выданная по истечении 6 месяцев со дня смерти. <br>' +
                            '<br>' +
                            '<u>При этом справка должна удовлетворять следующим критериям:</u><br>' +
                            '- указаны наследник/наследники с полным ФИО и датой рождения<br>' +
                            '- указаны ФИО и дата рождения/дата смерти умершего лица<br>' +
                            '- содержатся данные нотариуса: ФИО, юридический адрес, подпись, печать<br>',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 51231
                    }
                },



            },
            513: {
                0: {
                    1: {
                        name: 'Договор страхования/Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="contractzashchishchennyyzayemshchik" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события:<br>' +
                            '<br>' +
                            '1. Справка об установлении Застрахованному лицу группы инвалидности  (по текущей группе инвалидности) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="disabilitycertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: ' нотариально заверенная копия',
                        where: 'Оригинал выдается в Бюро Медико-социальной экспертизы, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине инвалидности (один из): <br>' +
                            '<br>' +
                            '1. Протокол проведения медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="expertreport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Обратный талон медико-социальной экспертизы или Сведения о результатах проведенной медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="examinationcoupon" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Направление на медико-социальную экспертизу организацией, оказывающей лечебно-профилактическую помощь <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="directionexpertise" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. Бюро медико-социальной экспертизы; <br>' +
                            '2. ЛПУ, выдавшее направление на МСЭ',
                    },
                },
                1: {
                    1: {
                        name: 'Справки, выданные федеральным государственным учреждением медико-социальной экспертизы, об установленных ранее группах инвалидности',
                        form: 'копия',
                        where: 'Бюро Медико-социальной экспертизы',
                        hidden: true,
                        answerId: 51311,
                    }
                },
                2: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 51321,
                    }
                },
                3: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 5132111
                    }
                },
                4: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 51331,
                    }
                },


            },
            514: {
                0: {
                    1: {
                        name: 'Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="contractzashchishchennyyzayemshchik" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события:<br>' +
                            '<br>' +
                            '1. Справка об установлении Застрахованному лицу группы инвалидности  (по текущей группе инвалидности) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="disabilitycertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: ' нотариально заверенная копия',
                        where: 'Оригинал выдается в Бюро Медико-социальной экспертизы, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине инвалидности (один из): <br>' +
                            '<br>' +
                            '1. Протокол проведения медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="expertreport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Обратный талон медико-социальной экспертизы или Сведения о результатах проведенной медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="examinationcoupon" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Направление на медико-социальную экспертизу организацией, оказывающей лечебно-профилактическую помощь <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="directionexpertise" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. Бюро медико-социальной экспертизы; <br>' +
                            '2. ЛПУ, выдавшее направление на МСЭ',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Справки, выданные федеральным государственным учреждением медико-социальной экспертизы, об установленных ранее группах инвалидности',
                        form: 'копия',
                        where: 'Бюро Медико-социальной экспертизы',
                        hidden: true,
                        answerId: 51411,
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 51431,
                    }
                },


            },

            53: {
                0: {
                    1: {
                        name: 'Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="contractzashchitablizkikhplyus" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'Оригинал по форме Страховщика.<br/>' +
                            'Если предполагается выплата по травме ребенка одному из родителей, обязательно в заявлении заполнить раздел "согласие второго родителя".',
                        where: '1. в отделении Банка<br/>' +
                            '2. На сайте Страховщика<br/>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Медицинский документ с указанием  даты телесного повреждения, установленного диагноза, описанием проведенного лечения и продолжительностью лечения, и позволяющий сделать заключение о причинах травмы (один из): <br/>' +
                            '<br/>' +
                            '1. Выписка из амбулаторной карты <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractoutpatientcard" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br/>' +
                            '2. Справка из травмпункта <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="emergencyroom" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br/>' +
                            '3. Выписной эпикриз <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="dischargereport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                    },
                },
                1: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 532111

                    }
                },
                2: {
                    1: {
                        name: 'Описание лабораторных и инструментальных исследований (один из):<br>' +
                            '1. описание рентгеновских снимков <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="xraypictures" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. описание МРТ <br>' +
                            '3. протоколы выполненных операций и манипуляций',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                        hidden: true,
                        answerId: 5311

                    }
                },
                3: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 5321

                    }
                },
                4: {
                    1: {
                        name: 'Документы, устанавливающие родство между Страхователем и Застрахованным лицом, получившим травму (один из, что применимо в зависимости от программы страхования):<br>' +
                            '<br>' +
                            '1. Свидетельство о рождении<br>' +
                            '2. Свидетельство о заключении брака',
                        form: 'копия',
                        where: '',
                        hidden: true,
                        answerId: 5332

                    }
                },
                5: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия/копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 5341

                    }
                },
            },
            54: {
                0: {
                    1: {
                        name: 'Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="contractzashchitablizkikhplyus" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события:<br>' +
                            '<br>' +
                            '1. Справка об установлении Застрахованному лицу группы инвалидности  (по текущей группе инвалидности) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="disabilitycertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: ' нотариально заверенная копия',
                        where: 'Оригинал выдается в Бюро Медико-социальной экспертизы, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине инвалидности (один из): <br>' +
                            '<br>' +
                            '1. Протокол проведения медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="expertreport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Обратный талон медико-социальной экспертизы или Сведения о результатах проведенной медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="examinationcoupon" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Направление на медико-социальную экспертизу организацией, оказывающей лечебно-профилактическую помощь <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="directionexpertise" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. Бюро медико-социальной экспертизы; <br>' +
                            '2. ЛПУ, выдавшее направление на МСЭ',
                    },
                },
                1: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 542111,
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 5431,
                    }
                },
                3: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 5421,
                    }
                },
                4: {
                    1: {
                        name: 'Справки, выданные федеральным государственным учреждением медико-социальной экспертизы, об установленных ранее группах инвалидности',
                        form: 'копия',
                        where: 'Бюро Медико-социальной экспертизы',
                        hidden: true,
                        answerId: 5411,
                    }
                },


            },

            21: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br/>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. В отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 2111
                    }
                },
                2: {
                    1: {
                        name: 'Свидетельство о праве на наследство по закону на страховую выплату',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 2122
                    }
                }

            },
            22: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. В отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 2211
                    }
                },
                2: {
                    1: {
                        name: 'Свидетельство о праве на наследство по закону на страховую выплату',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 2122
                    }
                },
                3: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 2221
                    }
                },
                4: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 222111
                    }
                },
                5: {
                    1: {
                        name: 'Акт (выписка из акта) судебно-медицинского исследования трупа с приложением результатов судебно-химического исследования',
                        form: 'копия, заверенная выдавшим органом',
                        where: 'Бюро судебно-медицинской экспертизы ',
                        hidden: true,
                        answerId: 222211
                    }
                },
                6: {
                    1: {
                        name: 'Свидетельство о праве на наследство по закону на страховую выплату',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 2231
                    }
                },


            },

            41: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования - Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. В отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 4111
                    }
                },
                2: {
                    1: {
                        name: 'Свидетельство о праве на наследство по закону на страховую выплату',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 4122
                    }
                }

            },
            42: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования - Договор страхования/Страховой полис (в зависимости от продукта) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. В отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 4211
                    }
                },
                2: {
                    1: {
                        name: 'Свидетельство о праве на наследство по закону на страховую выплату',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 4122
                    }
                },
                3: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 4221
                    }
                },
                4: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 422111
                    }
                },
                5: {
                    1: {
                        name: 'Акт (выписка из акта) судебно-медицинского исследования трупа с приложением результатов судебно-химического исследования',
                        form: 'копия, заверенная выдавшим органом',
                        where: 'Бюро судебно-медицинской экспертизы ',
                        hidden: true,
                        answerId: 422211
                    }
                },
                6: {
                    1: {
                        name: 'Свидетельство о праве на наследство по закону на страховую выплату',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 2231
                    }
                },


            },

            133: {
                0: {
                    1: {
                        name: 'Документ, подтверждающий факт заключения договора страхования - Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br/>' +
                            'Если предполагается выплата по травме ребенка одному из родителей, обязательно в заявлении заполнить раздел "согласие второго родителя".',
                        form: 'оригинал по форме Страховщика.',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: ' Медицинский документ с указанием  даты телесного повреждения, установленного диагноза, описанием проведенного лечения и продолжительностью лечения, и позволяющий сделать заключение о причинах травмы (один из): <br>' +
                            '<br>' +
                            '1. Выписка из амбулаторной карты <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractoutpatientcard" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br/>' +
                            '2. Справка из травмпункта <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="emergencyroom" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br/>' +
                            '3. Выписной эпикриз <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="dischargereport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                    },
                },
                1: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 1332111

                    }
                },
                2: {
                    1: {
                        name: 'Описание лабораторных и инструментальных исследований (один из):<br>' +
                            '1. описание рентгеновских снимков <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="xraypictures" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. описание МРТ <br>' +
                            '3. протоколы выполненных операций и манипуляций',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                        hidden: true,
                        answerId: 13311

                    }
                },
                3: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 13321

                    }
                },
                4: {
                    1: {
                        name: 'Документы, устанавливающие родство между Страхователем и Застрахованным лицом, получившим травму (один из, что применимо в зависимости от программы страхования):<br>' +
                            '<br>' +
                            '1. Свидетельство о рождении<br>' +
                            '2. Свидетельство о заключении брака',
                        form: 'копия',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 13332

                    }
                },
                5: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия/копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 13341

                    }
                },
            },
            134: {
                0: {
                    1: {
                        name: 'Документ, подтверждающий факт заключения договора страхования - Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события:<br>' +
                            '<br>' +
                            '1. Справка об установлении Застрахованному лицу группы инвалидности  (по текущей группе инвалидности) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="disabilitycertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: ' нотариально заверенная копия',
                        where: 'Оригинал выдается в Бюро Медико-социальной экспертизы, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине инвалидности (один из): <br>' +
                            '<br>' +
                            '1. Протокол проведения медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="expertreport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Обратный талон медико-социальной экспертизы или Сведения о результатах проведенной медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="examinationcoupon" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Направление на медико-социальную экспертизу организацией, оказывающей лечебно-профилактическую помощь <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="directionexpertise" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. Бюро медико-социальной экспертизы; <br>' +
                            '2. ЛПУ, выдавшее направление на МСЭ',
                    },
                },
                1: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 1342111,
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 13431,
                    }
                },
                3: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 13421,
                    }
                },
                4: {
                    1: {
                        name: 'Справки, выданные федеральным государственным учреждением медико-социальной экспертизы, об установленных ранее группах инвалидности',
                        form: 'копия',
                        where: 'Бюро Медико-социальной экспертизы',
                        hidden: true,
                        answerId: 13411,
                    }
                },


            },
            31: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. В отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 3111
                    }
                },
                2: {
                    1: {
                        name: 'Свидетельство о праве на наследство по закону на страховую выплату',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 3122
                    }
                }

            },
            32: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            'В случае нескольких Выгодоприобретателей – заявление должно быть предоставлено от каждого из Выгодоприобретателей.',
                        form: 'оригинал по форме Страховщика',
                        where: '1. В отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события (один из):<br>' +
                            '<br>' +
                            '1. Свидетельство о смерти Застрахованного лица <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Выписка из Книги государственной регистрации актов гражданского состояния <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractbook" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Решение суда о признании умершим или без вести пропавшим <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathjudgment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/ нотариально заверенная копия',
                        where: 'Оригинал выдается в ЗАГСе, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине смерти (один из): <br>' +
                            '<br>' +
                            '1. Справка о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="deathreference" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Медицинское свидетельство о смерти/Корешок медицинского свидетельства о смерти <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="medicaldeathcertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Заключение судебно-медицинской экспертизы или Акт патологоанатомического исследования трупа <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="conclusionmedical" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '4. Посмертный эпикриз (в случае смерти в лечебном учреждении) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="epicrisis" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. ЗАГС<br>' +
                            '2. Больница, госпиталь, клиника<br>' +
                            '3. Бюро судебно-медицинской экспертизы или Патологоанатомическое отделение заболеваниеУ/Морг заболеваниеУ<br>' +
                            '4. Больница, госпиталь, клиника (ЦРБ, ГБ, ГКБ, ОКБ, МСЧ)',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 3211
                    }
                },
                2: {
                    1: {
                        name: 'Свидетельство о праве на наследство по закону на страховую выплату',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 3122
                    }
                },
                3: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 3221
                    }
                },
                4: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 322111
                    }
                },
                5: {
                    1: {
                        name: 'Акт (выписка из акта) судебно-медицинского исследования трупа с приложением результатов судебно-химического исследования',
                        form: 'копия, заверенная выдавшим органом',
                        where: 'Бюро судебно-медицинской экспертизы ',
                        hidden: true,
                        answerId: 322211
                    }
                },
                6: {
                    1: {
                        name: 'Свидетельство о праве на наследство по закону на страховую выплату',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 3231
                    }
                },


            },
            33: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика.<br>' +
                            'Если предполагается выплата по травме ребенка одному из родителей, обязательно в заявлении заполнить раздел ""согласие второго родителя"".',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: ' Медицинский документ с указанием  даты телесного повреждения, установленного диагноза, описанием проведенного лечения и продолжительностью лечения, и позволяющий сделать заключение о причинах травмы (один из): <br>' +
                            '<br>' +
                            '1. Выписка из амбулаторной карты <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractoutpatientcard" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br/>' +
                            '2. Справка из травмпункта <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="emergencyroom" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br/>' +
                            '3. Выписной эпикриз <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="dischargereport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                    },
                },
                1: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 332111

                    }
                },
                2: {
                    1: {
                        name: 'Описание лабораторных и инструментальных исследований (один из):<br>' +
                            '1. описание рентгеновских снимков <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="xraypictures" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. описание МРТ <br>' +
                            '3. протоколы выполненных операций и манипуляций',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                        hidden: true,
                        answerId: 3311

                    }
                },
                3: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 3321

                    }
                },
                4: {
                    1: {
                        name: 'Документы, устанавливающие родство между Страхователем и Застрахованным лицом, получившим травму (один из, что применимо в зависимости от программы страхования):<br>' +
                            '<br>' +
                            '1. Свидетельство о рождении<br>' +
                            '2. Свидетельство о заключении брака',
                        form: 'копия',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 3332

                    }
                },
                5: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия/копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 3341

                    }
                },
            },
            34: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события:<br>' +
                            '<br>' +
                            '1. Справка об установлении Застрахованному лицу группы инвалидности  (по текущей группе инвалидности) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="disabilitycertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: ' нотариально заверенная копия',
                        where: 'Оригинал выдается в Бюро Медико-социальной экспертизы, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине инвалидности (один из): <br>' +
                            '<br>' +
                            '1. Протокол проведения медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="expertreport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Обратный талон медико-социальной экспертизы или Сведения о результатах проведенной медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="examinationcoupon" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Направление на медико-социальную экспертизу организацией, оказывающей лечебно-профилактическую помощь <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="directionexpertise" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. Бюро медико-социальной экспертизы; <br>' +
                            '2. ЛПУ, выдавшее направление на МСЭ',
                    },
                },
                1: {
                    1: {
                        name: '1. Водительские права с двух сторон<br>' +
                            '2. Документ, подтверждающий наличие/отсутствие алкоголя в крови на момент наступления события <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="alcoholinblood" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: '1. Копия<br>' +
                            '2. Оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '',
                        hidden: true,
                        answerId: 342111,
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 3431,
                    }
                },
                3: {
                    1: {
                        name: 'Документ с обстоятельствами события (один из):<br>' +
                            '<br>' +
                            '1. постановление о  возбуждении/отказе в возбуждении уголовного дела <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="refusalcriminalcase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. акт о несчастном случае на производстве <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="unhappycase" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. иной документ компетентных органов ',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Отдел/управление МВД/Работодатель',
                        hidden: true,
                        answerId: 3421,
                    }
                },
                4: {
                    1: {
                        name: 'Справки, выданные федеральным государственным учреждением медико-социальной экспертизы, об установленных ранее группах инвалидности',
                        form: 'копия',
                        where: 'Бюро Медико-социальной экспертизы',
                        hidden: true,
                        answerId: 3411,
                    }
                },


            },
            35: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Документ, подтверждающий факт наступления события:<br>' +
                            '<br>' +
                            '1. Справка об установлении Застрахованному лицу группы инвалидности  (по текущей группе инвалидности) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="disabilitycertificate" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: ' нотариально заверенная копия',
                        where: 'Оригинал выдается в Бюро Медико-социальной экспертизы, далее нотариус может подготовить нотариально заверенную копию',
                    },
                    5: {
                        name: 'Документ, содержащий информацию о причине инвалидности (один из): <br>' +
                            '<br>' +
                            '1. Протокол проведения медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="expertreport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Обратный талон медико-социальной экспертизы или Сведения о результатах проведенной медико-социальной экспертизы <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="examinationcoupon" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '3. Направление на медико-социальную экспертизу организацией, оказывающей лечебно-профилактическую помощь <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="directionexpertise" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: '1. Бюро медико-социальной экспертизы; <br>' +
                            '2. ЛПУ, выдавшее направление на МСЭ',
                    },
                    6: {
                        name: 'Выписка из медицинской карты Застрахованного лица за 5 (пять) лет до заключения договора страхования, содержащая информацию об имевшихся заболеваниях и даты их установления. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractmedicalrecord" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал/нотариально заверенная копия/копия, заверенная выдавшим органом',
                        where: 'Поликлиника по месту жительства, либо другое медицинское учреждение, в котором наблюдалось Застрахованное лицо',
                    },
                },
                1: {
                    1: {
                        name: 'Справки, выданные федеральным государственным учреждением медико-социальной экспертизы, об установленных ранее группах инвалидности',
                        form: 'копия',
                        where: 'Бюро Медико-социальной экспертизы',
                        hidden: true,
                        answerId: 3511,
                    }
                },
                2: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 3521,
                    }
                },
            },
            36: {
                0: {
                    1: {
                        name: ' Документ, подтверждающий факт заключения договора страхования (один из, в зависимости от того, что выдавалось на руки при оформлении страховки):<br>' +
                            '<br>' +
                            '1. Заявление на участие в программе страхования <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statement" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. Договор страхования/Страховой полис <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="inscontract" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия',
                        where: 'Оформляется при заключении договора страхования/подключения к программе страхования',
                    },
                    2: {
                        name: 'Заявление о страховой выплате с указанием банковских реквизитов. <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="statementpayment" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'оригинал по форме Страховщика',
                        where: '1. в отделении Банка<br>' +
                            '2. На сайте Страховщика<br>' +
                            '3. В офисе Страховщика',
                    },
                    3: {
                        name: 'Документ, удостоверяющий личность заявителя и получателя выплаты (если отличается от заявителя) <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="document" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span>',
                        form: 'копия, страница с фотографией и пропиской',
                        where: '',
                    },
                    4: {
                        name: 'Медицинский документ с указанием установленного диагноза, даты его установления  (один из):<br>' +
                            '1. выписной эпикриз <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="extractoutpatientcard" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '2. выписка из амбулаторной карты/истории болезни <span class="onlineHelper_docblock">(<a class="onlineHelper_doctype" data-doctype="dischargereport" href="#" target="_blank" rel="noopener noreferrer">образец</a>)</span><br>' +
                            '<br>' +
                            'В документе также необходимо наличие результатов исследований, подтверждающий установленный диагноз (результаты гистопатологического анализа; результаты компьютерной томографии (КТ) и/или магнитно-резонансной томографии (МРТ); результаты коронарной ангиографии и т.п.) ',
                        form: 'оригинал/нотариально заверенная копия',
                        where: 'Медицинское учреждение, в котором Застрахованное лицо проходило лечение',
                    },
                },
                1: {
                    1: {
                        name: 'Документ, подтверждающий полномочия представителя Выгодоприобретателя/наследника',
                        form: 'нотариально заверенная копия',
                        where: 'Нотариус',
                        hidden: true,
                        answerId: 3611,
                    }
                },
            },

        }


        function createTable(document) {
            console.log(999, document)
            $('.step4 table tr:not(.notRemove)').remove();
            var doc = documents[document]; // определяем документа
            Object.keys(doc).map(function (docIndex) { //Перебираем типы доки
                var docDetail = doc[docIndex] // по строкам доки
                Object.keys(docDetail).map(function (docRow) { // перебираем строки доков
                    var dn = docDetail[docRow].hidden == true ? 'dn' : ''
                    var answerId = docDetail[docRow].answerId != undefined ? docDetail[docRow].answerId : ''
                    $('.step4 table').append(
                        '<tr class="' + dn + '" data-answerId="' + answerId + '">' +
                        '<td>' + docDetail[docRow].name + '</td>>' +
                        '<td>' + docDetail[docRow].form + '</td>>' +
                        '<td>' + docDetail[docRow].where + '</td>>' +
                        '</tr>>'
                    )
                })

            })
            addDocForm()

        }

        function startShow(question) {
            $('.step3').html('')
            var line1 = questions[question] // определяем номер вопроса
            Object.keys(line1).map(function (btnIndex) { // Пеоебираем все вопросы
                addLabel(line1[btnIndex].question); // добавляем вопрос на сайт
                addBtnBlock(btnIndex); // добовляем блок для кнопок, с передачей id вопроса
                var line1Answer = line1[btnIndex].answer // определяем ответы для вопроса
                Object.keys(line1Answer).map(function (answerIndex) { // перебираем ответы
                    addBtn(answerIndex, line1Answer[answerIndex], btnIndex, (Object.keys(line1Answer[answerIndex]).length > 1 ? answerIndex : undefined)) // добавляем кнопки с ответами в блок для кнопок, передача ответа и id вопроса
                    if (Object.keys(line1Answer[answerIndex]).length > 1) { // Если есть подвопросы
                        Object.keys(line1Answer[answerIndex]).map(function (line2) { // перебираем подвопросы
                            if (line2 != 'answerText') {
                                addHiddenBlock(answerIndex); // добавляем скрытый блок с индексом подвопроса
                                addLabel(line1Answer[answerIndex][line2].question, answerIndex); // добавляем подвопрос на сайт
                                addBtnBlock(btnIndex.toString() + line2.toString(), answerIndex); // добовляем блок для кнопок, с передачей id вопроса и id подвопроса
                                Object.keys(line1Answer[answerIndex][line2].answer).map(function (answer2, answer2Index) { // перебираем подответы
                                    addBtn(answer2, line1Answer[answerIndex][line2].answer[answer2], btnIndex.toString() + line2.toString()) // добавляем подответы в блок для кнопок.
                                })
                            }
                        })

                    }
                })
            })
        }


        var hash = window.location.hash.slice(1)
        var nextStepButton = $('.changeStep')[1]
        if (hash.length) {

            switch (hash) {
                case 'bilet_v_budushee':
                    $('div[data-code="ББМР0"]').click();
                    nextStepButton.click();
                    break;
                case 'budushchiy_kapital':
                    $('div[data-code="БКАСР00"]').click();
                    nextStepButton.click();
                    break;
                case 'detskiy_obrazovatelnyy_plan':
                    $('div[data-code="ОМР0"]').click();
                    nextStepButton.click();
                    break;
                case 'dokhodnyy_kurs':
                    $('div[data-code="КАСР301"]').click();
                    nextStepButton.click();
                    break;
                case 'zashchita_blizkikh':
                    $('div[data-code="ЗПКРР002"]').click();
                    nextStepButton.click();
                    break;
                case 'zashchishchennyy_zayemshchik':
                    $('div[data-code="ЗМССР101"]').click();
                    nextStepButton.click();
                    break;
                case 'strakhovaniye_zhizni_zayemshchikov_kreditov_sberbanka':
                    $('div[data-code="ЗМАСР001"]').click();
                    nextStepButton.click();
                    break;
                case 'kak_zarplata':
                    $('div[data-code="ПНПРР002"]').click();
                    nextStepButton.click();
                    break;
                case 'naslediye_forsazh':
                    $('div[data-code="НВР0"]').click();
                    nextStepButton.click();
                    break;
                case 'pervyy_kapital':
                    $('div[data-code="ДМР0"]').click();
                    nextStepButton.click();
                    break;
                case 'podushka_bezopasnosti':
                    $('div[data-code="РИР1"]').click();
                    nextStepButton.click();
                    break;
                case 'rante':
                    $('div[data-code="ПДБР0"]').click();
                    nextStepButton.click();
                    break;
                case 'sberegatelnoye_strakhovaniye':
                    $('div[data-code="ССКРР302"]').click();
                    nextStepButton.click();
                    break;
                case 'semeynyy_aktiv':
                    $('div[data-code="ВМР0"]').click();
                    nextStepButton.click();
                    break;
                case 'smartpolis_kuponnyy':
                    $('div[data-code="КПГС5Р0"]').click();
                    nextStepButton.click();
                    break;
                case 'strakhovaniye_zhizni_derzhatelya_kreditnoy_karty':
                    $('div[data-code="ДККСБОЛ"]').click();
                    nextStepButton.click();
                    break;
                case 'fond_zdorovya':
                    $('div[data-code="ФЗСБР101"]').click();
                    nextStepButton.click();
                    break;
				case 'setelem':
                    $('div[data-code="001"]').click();
                    nextStepButton.click();
                    break;
                case 'glava_semi':
                    $('div[data-code="002"]').click();
                    nextStepButton.click();
                    break;
                case 'zashhita_semi':
                    $('div[data-code="003"]').click();
                    nextStepButton.click();
                    break;
            }
        }

        function addLabel(label, dn) {
            $('.step3' + (dn != undefined ? ' .dn' + dn : '')).first().append(
                '<div class="label_black">' +
                label +
                '</div>'
            )
        }

        function addBtnBlock(btnIndex, dn) {
            $('.step3' + (dn != undefined ? ' .dn' + dn : '')).first().append(
                '<div class="rowFlex left btn-block btn' + btnIndex + '"></div>'
            )
        }

        function addHiddenBlock(hiddenIndex) {
            $('.step3').append(
                '<div class="dn dn' + hiddenIndex + '"></div>'
            )
        }

        function addBtn(id, btn, btnIndex, dn) {
            $('.step3 .btn' + btnIndex).append(
                '<button id="' + id + '" class="btn btn_gray" ' + (dn != undefined ? 'data-show="1" data-show-block="' + dn + '"' : '') + '>' +
                btn.answerText +
                '</button>'
            )
        }

        // $('.js-accordion-link').on('click', function () {
        //     if($(this).parents('.js-accordion-item').hasClass('active')){
        //         $(this).parents('.js-accordion-item').removeClass('active')
        //         $(this).parents('.js-accordion-item').find('.js-accordion-text').slideUp()
        //     }else{
        //         $(this).parents('.js-accordion-item').addClass('active')
        //         $(this).parents('.js-accordion-item').find('.js-accordion-text').slideDown()
        //     }
        // })

        // $('[name=series_order]').inputmask('a{3}9')
        $('[name=number_order]').inputmask('9{10}')
        


        function translate (text) {
            var transl = new Array();
            transl['А']='A';     transl['а']='a';
            transl['Б']='B';     transl['б']='b';
            transl['В']='V';     transl['в']='v';
            transl['Г']='G';     transl['г']='g';
            transl['Д']='D';     transl['д']='d';
            transl['Е']='E';     transl['е']='e';
            transl['Ё']='Yo';    transl['ё']='yo';
            transl['Ж']='Zh';    transl['ж']='zh';
            transl['З']='Z';     transl['з']='z';
            transl['И']='I';     transl['и']='i';
            transl['Й']='J';     transl['й']='j';
            transl['К']='K';     transl['к']='k';
            transl['Л']='L';     transl['л']='l';
            transl['М']='M';     transl['м']='m';
            transl['Н']='N';     transl['н']='n';
            transl['О']='O';     transl['о']='o';
            transl['П']='P';     transl['п']='p';
            transl['Р']='R';     transl['р']='r';
            transl['С']='S';     transl['с']='s';
            transl['Т']='T';     transl['т']='t';
            transl['У']='U';     transl['у']='u';
            transl['Ф']='F';     transl['ф']='f';
            transl['Х']='X';     transl['х']='x';
            transl['Ц']='C';     transl['ц']='c';
            transl['Ч']='Ch';    transl['ч']='ch';
            transl['Ш']='Sh';    transl['ш']='sh';
            transl['Щ']='Shh';   transl['щ']='shh';
            transl['Ъ']='';     transl['ъ']='';
            transl['Ы']='Y';     transl['ы']='y';
            transl['Ь']='';      transl['ь']='';
            transl['Э']='E';     transl['э']='e';
            transl['Ю']='Yu';    transl['ю']='yu';
            transl['Я']='Ya';    transl['я']='ya';
            transl[' ']='-';

            var result = '';
            for(i=0;i<text.length;i++) {
                if(transl[text[i]] != undefined) { result += transl[text[i]]; }
                else { result += text[i]; }
            }
            return result
        }

    }

});


