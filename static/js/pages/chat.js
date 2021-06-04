$(document).ready(function () {

        if ($('#chat_div').length) {
		console.log(1112222)

          !!window.sberCareChat && window.sberCareChat.init({
                chatEnabled: true,
                startForm: 'Icon', // 'Chat' | 'Icon' | 'Bot' | 'Elena' | 'Conversations'
                conversations: ['Bot','Chat'], //каждый должен быть описан в конфиге | 'Elena'
                applicationName: 'sberCareChat', // для вызова публичных методов
                mainBundlePath: 'https://www.sberbank-insurance.ru/static/js/chat/5.5.2/',// путь до js файла
                mountContainerId: 'chat_div', // id контейнера для рендера чата
                headerIsEnabled: true,
                logMetrika: true,
                yandexCounterId: 28425471, //счетчик для метрики
				yandexCounterName: 'sberCareChat', //название корня
				formsOption: {
                    Conversations: {
                        withPicture: false,
						text: "С радостью ответим на ваши вопросы в чате! Если бот не сможет помочь – к чату подключиться оператор.",
						title: "Чат поддержки"
                    },
					Icon: {
					   formAfterClick: "Bot"
					},
                },
                search: {
                    enabled: false,
                    minLength: 2,
                },
                Chat: {
                    type: 'messanger',
                    name: 'Чат с оператором',
					iconImgUrl: './sber_logo.png',
                    apiRestUrl: 'https://messenger.sberbank.ru/api/device/auth_prelogin',
                    apiWSUrl: 'wss://messenger.sberbank.ru/api/',
                    firstMessage: {
                        text: 'Здравствуйте! Здесь вы можете задать общие вопросы по продуктам и услугам Сбербанк страхование жизни. Обращаем внимание, что в части финансовой информации мы можем проконсультировать вас об общем подходе к расчёту. Персонализированную финансовую информацию (например, расчёт суммы выплаты по убытку) вы можете получить, позвонив на номер 900.',
                        suggestions: []
                    },
                    domain: 'lifeins.sberbank.ru', // по умолчанию location.host
                    initTimeout: 30,
                    dictionary: {
                        headerTitle: 'Чат поддержки',
                        botName: 'Сбербанк страхование жизни',
                        inputPlaceholder: 'Напишите сообщение...',
                        techBreakTitle: 'На данный момент отправка сообщений невозможна',
                        techBreakText: 'или позвоните по номеру 900'
                    }
                },
				Bot: {
                    type: 'chatBotFlow',
                    name: 'Бот Сбер Страхование',
                    crossOrigin: true,
                    botScenarioName: 'start.json',
                    jsonSrc: '/static/js/chat/',
                    dictionary: {
                        headerTitle: 'Чат СберБанк страхование жизни',
                        botName: 'СберБанк страхование жизни',
                        inputPlaceholder: 'Напишите сообщение...',
                        techBreakTitle: 'На данный момент отправка сообщений невозможна',
                        techBreakText: 'Попробуйте зайти позже',
                    },
                }
            });

            setTimeout(function () {
                //$('.chat-retail-icons__container').append(
                //    '<a href="/about/contacts" target="_blank" class="chat-retail-icons iconPhone"></a>' +
                //    '<a href="https://sberbank-insurance.ru/inclaim" target="_blank" class="chat-retail-icons iconSecurety"></a>'
                //)
                //$('.chat-retail-icons__container').slick({
                //    arrows: false,
                //    dots: false,
                //    slidesToShow: 1,
                //    slidesToScroll: 1,
                //    autoplay: true,
                //    autoplaySpeed: 2000,
                //});

                $(document).on("click",".chat-retail-close",function() {
                    setTimeout(function () {
                        //$('.chat-retail-icons__container').append(
                        //    '<a href="/about/contacts" target="_blank" class="chat-retail-icons iconPhone"></a>' +
                        //    '<a href="https://sberbank-insurance.ru/inclaim" target="_blank" class="chat-retail-icons iconSecurety"></a>'
                        //)
                        //$('.chat-retail-icons__container').slick({
                        //    arrows: false,
                        //    dots: false,
                        //    slidesToShow: 1,
                        //    slidesToScroll: 1,
                        //    autoplay: true,
                        //    autoplaySpeed: 2000,
                        //});

                    })
                });
            }, 1500)



        }

    }
);