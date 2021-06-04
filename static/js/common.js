$(function () {

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var $headerWrapper = $('.js-header-wrapper');
    var $headerLine = $('.js-header-line');
    var $menuCallLink = $('.js-toggle-menu');
    var $header = $('.js-header');
    var headerHeight = $header.height();
    var $body = $('body');
    var $headerMain = $('.js-header-main');
    var statusTransition = false;
    var $headerTabsLinks = $('.js-header-tab-link');
    var $headerTabs = $('.js-header-tab');
    var $headerCircle = $('.js-header-circle');
    var $headerCircleInsertPic = $('.js-header-circle-insert-pic');
    var $headerCircleInsertText = $('.js-header-circle-insert-text');
    var $headerProductLink = $('.js-header-product-link');
    var $minHeightFullScreen = $('.js-min-full-page');
    var $scrollToLink = $('.js-scroll-to-block');
    var $accordionLink = $('.js-accordion-link');
    var $accordionItem = $('.js-accordion-item');
    var $accordionText = $('.js-accordion-text');
    var $tabContainer = $('.js-tabs-container');
    var $tabsLink = $('.js-tabs');
    var $tabsArrowLink = $('.js-open-mob-tab');
    var $tabResult = $('.js-tabs-result');
    var $footerProductsCarousel = $('.js-footer-product-carousel');
    var $footerProducts = $('.js-footer-product');
    var $productTag = $('.js-product-tag');
    var $popupSearchOverlay = $('.js-search-overlay');

    var $headerLoginCall = $('.js-header-login-call');
    var $headerLoginOverlay = $('.js-header-login-overlay');
    var $headerLoginPopup = $('.js-header-login-popup');

    var ID_HIDE_CIRCLE = '#menu-main';
    var defUrlFooterPic = '';
    var resp_accrordion = false;
    var MAGIC_MENU_CALL_OFFSET = 40;
  $(document).on("click", ".b-footer__agreement_link2", function (event) {
      $(this).toggleClass('active')
  });
    if ($('.headTextColor').length) {
        $('.js-header').addClass($('.headTextColor').val());
    }

    if (windowWidth < 768) {
        $body = $('html, body');
    }

    /**
     * open login popup
     */
    $headerLoginCall.on('click', function (e) {
        e.preventDefault();
        $header.toggleClass('login-open');
        $body.toggleClass('overflow');
        $headerLoginPopup.fadeToggle(250);
    });

    /**
     * close login header on click overlay
     */
    $headerLoginOverlay.on('click', function (e) {
        e.preventDefault();
        closeLoginHeader();
    });

    /**
     * fn for close login header
     */
    function closeLoginHeader() {
        if ($header.hasClass('login-open')) {
            $header.removeClass('login-open');
            $body.removeClass('overflow');
            $headerLoginPopup.fadeOut(250);
        }
    }


    /**
     * make overlay for table in text
     */
    function makeTextTableOverlay() {
        if ($('.b-text__wrapper table').length) {
            $('.b-text__wrapper table').each(function () {
                if (!$(this).closest('.b-text__wrapper').hasClass('b-careers')) {
                    $('<div class="b-table"></div>').insertBefore($(this));
                    $(this).prev('.b-table').append($(this));
                }
            });
        }
    }

    makeTextTableOverlay();

    /**
     * make overlay for iframe youtube in text
     */
    function makeVideoOverlay() {
        if ($('.b-text__wrapper iframe').length) {
            $('.b-text__wrapper iframe').each(function () {
                if ($(this).attr('src').indexOf('www.youtube.com') > -1) {
                    $('<div class="js-video-block b-video-block"></div>').insertBefore($(this));
                    $(this).prev('.js-video-block').append($(this));
                }
            });
        }
    }

    makeVideoOverlay();


    /**
     * make scrollbar for right open menu part
     */
    $('.b-header-main__r').mCustomScrollbar({
        axis: "y",
        theme: "minimal-dark"
    });

    $('.b-header__bottom').mCustomScrollbar({
        axis: "x",
        theme: "minimal-dark"
    });

    /**
     * set scroll bar position move ro right part of window
     */
    function setScrollBarMenuRightPosition() {
        var rightPos = parseInt((windowWidth - $headerWrapper.width()) / -2);
        $('.mCSB_scrollTools', $headerMain).css('right', rightPos + 'px');
    }

    setScrollBarMenuRightPosition();

    /**
     * menu call link posiotion on scroll
     */
    function menuCallPosition() {
        var scrollTop = $(window).scrollTop();

        if (scrollTop >= MAGIC_MENU_CALL_OFFSET && !$menuCallLink.hasClass('fixed')) {
            $menuCallLink.addClass('fixed')
        } else if (scrollTop < MAGIC_MENU_CALL_OFFSET && $menuCallLink.hasClass('fixed')) {
            $menuCallLink.removeClass('fixed')
        }
    }

    menuCallPosition();

    /**
     * count tabs for their width
     */
    function widthTabsMain() {
        $('.b-main-tabs__tabs').each(function () {
            var $thisTabs = $('a', $(this));
            var heightTab = 0;

            if ($thisTabs.hasClass('b-main-tabs__tabs_link')) {
                $thisTabs.css({'min-height': '0px'});

                var width = 100 / $thisTabs.length;
                $thisTabs.closest('li').css({'max-width': width + '%'});

                $thisTabs.css('min-height', 0);
                $thisTabs.each(function () {
                    if ($(this).outerHeight(true) > heightTab)
                        heightTab = $(this).outerHeight(true)
                });
                $thisTabs.css({'min-height': heightTab + 'px'});
            }
        });
    }

    widthTabsMain();

    /**
     * set max width to nav footer slider
     */
    function widthNavFooterSlider() {
        if ($footerProductsCarousel) {
            var lengthProduct = $footerProducts.length;
            var widthDots = 100 / lengthProduct;
            $('.slick-dots li', $footerProductsCarousel).css('max-width', widthDots + '%');
        }
    }

    /**
     * relocate 2nd level inside tabs results content to the box of this tab link
     */
    function changeAccordionPositionInTabs() {
        var $insideTabsResult = $('.js-tabs-result', $tabResult);

        if (windowWidth <= 1199 && $insideTabsResult.length && !resp_accrordion) {
            resp_accrordion = true;
            $insideTabsResult.each(function () {
                var thisId = $(this).attr('id');
                $(this).appendTo($('.js-tabs[href="#' + thisId + '"]').closest('li'));
            })
        } else if (windowWidth > 1199 && $insideTabsResult.length && resp_accrordion) {
            resp_accrordion = false;
            $insideTabsResult.each(function () {
                var $thisResultBox = $(this).parents($tabResult);
                $(this).appendTo($('.b-inside-tabs__result_box', $thisResultBox));
            });
        }
    }

    changeAccordionPositionInTabs();

    /**
     * set dots width after slick init
     */
    $footerProductsCarousel.on('init', function (event, slick) {
        widthNavFooterSlider();
    });

    /**
     * footer products carousel slick
     */
    if ($footerProductsCarousel) {
        $footerProductsCarousel.slick({
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 4,
            dots: true,
            arrows: true,
            touchThreshold: 20,
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 754,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }


    /**
     * tabs
     */
    $tabsLink.on('click', function (e) {
        e.preventDefault();

        var $thisTabsContainer = $(this).closest($tabContainer);
        var thisHref = $(this).attr('href');
        var $thisTabsUl = $(this).closest('.b-main-tabs__tabs');

        if (!$(this).hasClass('active')) {
            $('.js-tabs-result', $thisTabsContainer).fadeOut(0);
            $('.js-tabs', $thisTabsContainer).removeClass('active');
            $(this).addClass('active');
            $(thisHref).fadeIn(250);

            // if tabs inside
            if ($('.js-tabs-container', $(thisHref)).length) {
                $('.js-tabs-container', $(thisHref)).each(function () {
                    $('.js-tabs', $(this)).eq(0).addClass('active');
                    $('.js-tabs-result', $(this)).eq(0).fadeIn(0);
                });
            }

            $thisTabsUl.removeClass('open');

        } else if ($(this).hasClass('active') && windowWidth < 1025 && ($(this).hasClass('b-inside-tabs__tabs_link') || $(this).hasClass('b-header-main__link'))) {
            $(this).removeClass('active');
            $(thisHref).fadeOut(250);
        } else if ($(this).hasClass('active') && windowWidth < 768) {
            $thisTabsUl.toggleClass('open');
        }

    });

    /**
     * open mobile arrows tab
     */
    $tabsArrowLink.on('click', function (e) {
        e.preventDefault();
        var $thisTabsUl = $(this).closest('.b-main-tabs__tabs');
        $thisTabsUl.toggleClass('open');
    });

    /**
     * default values blocks
     */
    function defaultSizesBlock() {
        $minHeightFullScreen.css('min-height', windowHeight + 'px');
    }

    defaultSizesBlock();

    /**
     * accordion
     */
    $accordionLink.on('click', function (e) {
        e.preventDefault();

        // if ($(this).closest('.js-accordion-single').length){
        //
        //   var $thisAccordionBox = $(this).closest('.js-accordion-single');
        //
        //   if ($(this).closest($accordionItem).hasClass('active')){
        //     $(this).next($accordionText).slideUp(250);
        //     $(this).closest($accordionItem).removeClass('first-active').removeClass('active');
        //   } else {
        //     $('.js-accordion-text', $thisAccordionBox).slideUp(0);
        //     $('.js-accordion-item', $thisAccordionBox).removeClass('first-active').removeClass('active');
        //     $(this).next($accordionText).slideToggle(250);
        //     $(this).closest($accordionItem).toggleClass('active');
        //   }
        //
        // } else {
        if ($(this).closest($accordionItem).hasClass('first-active')) {
            $(this).next($accordionText).slideUp(250);
        } else {
            $(this).next($accordionText).slideToggle(250);
        }
        $(this).closest($accordionItem).removeClass('first-active').toggleClass('active');
        // }


    });

    /**
     * scroll to block by link href
     */
    $scrollToLink.on('click', function (e) {
        e.preventDefault();
        var $block = $(this).attr('href');
        scrollTo($block);
    });


    /**
     * show product header info on hover link
     */
    $headerProductLink.on('mouseenter', function () {
        if ($('.js-header-product-get-text', $(this)).length) {
            var $thisGetInfo = $('.js-header-product-get-text', $(this));
            var thisHtml = $thisGetInfo.html();
            var thisPic = $thisGetInfo.attr('data-pic');

            $headerCircleInsertPic.css('background-image', 'url("' + thisPic + '")');
            $headerCircleInsertText.html(thisHtml);
            $headerCircle.addClass('open');
        }
    }).on('mouseleave', function () {
        $headerCircle.removeClass('open');
    });

    /**
     * header mobile tabs reconstruction
     */
    var headerTabReconstStatus = false;

    function resconstructHeaderTabs() {

        if (windowWidth < 768 && !headerTabReconstStatus) {
            headerTabReconstStatus = true;

            $headerTabs.each(function () {
                var thisId = $(this).attr('id');
                var $thisLinkId = $('.js-header-tab-link[href="#' + thisId + '"]');
                if ($thisLinkId.parents('li')) {
                    $(this).appendTo($thisLinkId.parents('li'));
                }

            })

        } else if (windowWidth > 767 && headerTabReconstStatus) {
            headerTabReconstStatus = false;
            // $headerTabs.appendTo('.b-header-main__r');
        }
    }

    resconstructHeaderTabs();

    /**
     * header product tabs click
     */
    $headerTabsLinks.on('click', function (e) {
        e.preventDefault();
        var thisHref = $(this).attr('href');

        if (!$(this).hasClass('active')) {
            $headerTabsLinks.removeClass('active');
            $headerTabs.addClass('active').fadeOut(0);

            $(this).addClass('active');
            $(thisHref).removeClass('active').fadeIn(250);

            // show | hide circle-hover product block
            if (thisHref != ID_HIDE_CIRCLE && !$headerCircle.hasClass('show')) {
                $headerCircle.addClass('show');
            } else if (thisHref == ID_HIDE_CIRCLE && $headerCircle.hasClass('show')) {
                $headerCircle.removeClass('show');
            }
        } else if ($(this).hasClass('active') && windowWidth < 768) {
            $(this).removeClass('active');
            $(thisHref).removeClass('active').fadeOut(250);
        }
    });

    /**
     * header line resize of window width and header width
     */
    function headerLineSizing() {
        var headerWrapperWidth = $headerWrapper.width();
        var lineWidth = parseInt((windowWidth - headerWrapperWidth) / 2 + headerWrapperWidth);
        var loginWidth = windowWidth - windowWidth * 0.1;

        //login max-width
        $headerLoginPopup.css('max-width', loginWidth + 'px');

        //header max height for mob
        $header.css('max-height', windowHeight + 'px');

        // menu link position
        var menuCallLeftPos = parseInt((windowWidth - headerWrapperWidth) / 4);
        windowWidth <= 1200 ? $menuCallLink.css('left', '37px') : $menuCallLink.css('left', menuCallLeftPos + 'px');
        $headerLine.css('width', lineWidth + 'px');

        //header main box size
        $headerMain.css({'min-height': windowHeight + 'px', height: windowHeight + 'px'});

    }

    headerLineSizing();


    /**
     * header fix
     */
    function headerFix() {
        var scrollTop = $(window).scrollTop();

        if (scrollTop >= headerHeight && !$header.hasClass('fixed')) {
            $header.addClass('fixed');
            statusTransition = true;
        } else if (scrollTop < headerHeight && $header.hasClass('fixed')) {
            $header.removeClass('fixed').removeClass('transition');
            statusTransition = false;
        }
    }

    headerFix();

    /**
     * if tag click open menu and than show
     */
    $productTag.on('click', function (e) {
        var thisHref = $(this).attr('href');
        var $thisMenuLink = $('.js-header-tab-link[href="' + thisHref + '"]');

        if ($thisMenuLink.length) {
            e.preventDefault();

            $menuCallLink.trigger('click');
            setTimeout(function () {
                $thisMenuLink.trigger('click');
            }, 250)

        }

    });

    var difWidthBody = 0;

    function getScrollBarWidth() {
        var firstWidth = $body.width();
        $body.addClass('overflow');
        var secondWidth = $body.width();
        $body.removeClass('overflow');
        difWidthBody = secondWidth - firstWidth;
    }

    getScrollBarWidth();

    /**
     * toggle open menu
     */
    $menuCallLink.on('click', function (e) {
        e.preventDefault();

        if ($popupSearchOverlay.is(':visible') && !$header.hasClass('open')) {
            $popupSearchOverlay.fadeOut(250).removeClass('show');
            $body.removeClass('overflow');
        }

        $(this).toggleClass('open');
        $header.hasClass('open') ? $body.removeClass('overflow') : $body.addClass('overflow');
        $header.toggleClass('open');


        if ($header.hasClass('open')) {
            setTimeout(function () {
                $('.js-header-tab-link[href="' + ID_HIDE_CIRCLE + '"]').trigger('click');
            }, 200);
            $header.css('padding-right', difWidthBody + 'px');
            $('.b-content').css('padding-right', difWidthBody + 'px');
            $headerMain.css('padding-right', difWidthBody + 'px');
        } else {
            $header.css('padding-right', '0');
            $('.b-content').css('padding-right', '0');
            $headerMain.css('padding-right', '0');
        }

        if ($body.hasClass('header-white')) {
            $header.toggleClass('b-header__white');
        }

        // for transition header appear
        if (!$header.hasClass('transition') && statusTransition) {
            $header.addClass('transition');
        } else if (!statusTransition) {
            $body.animate({
                scrollTop: 0
            }, 0);
        }
    });

    function closeMenu() {
        if ($header.hasClass('open')) {
            $menuCallLink.toggleClass('open');
            $header.toggleClass('open');
            $body.toggleClass('overflow');
            if ($body.hasClass('header-white')) {
                $header.addClass('b-header__white');
            }
            setTimeout(function () {
                $('.js-header-tab-link[href="' + ID_HIDE_CIRCLE + '"]').trigger('click');
            }, 200);
        }
    }

    /**
     * close menu if esc
     */
    $(document).keyup(function (e) {
        if (e.which == 27) {
            closeMenu();
            closeLoginHeader();
        }
    });

    $(window).on('scroll', function () {
        headerFix();
        menuCallPosition();
    });

    $(window).on('resize', function () {
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        headerLineSizing();
        headerFix();
        defaultSizesBlock();
        changeAccordionPositionInTabs();
        resconstructHeaderTabs();
        widthTabsMain();
        menuCallPosition();
        setScrollBarMenuRightPosition();
    });

    /**
     * dropdown open | close func
     * @param parent
     */
    function toggleDropdown(parent) {
        if (parent.hasClass('b-dropdown_open')) {
            parent.removeClass('b-dropdown_open');
        } else {
            $('.b-dropdown').each(function () {
                if (!$(this).hasClass('first-open')) {
                    $(this).removeClass('b-dropdown_open');
                }
            });
            parent.addClass('b-dropdown_open');
            $('b-dropdown__text', parent).removeClass('js-link-stop');
        }
    }

    /**
     * dropdow
     */
    $(document).click(function (e) {
        var $target = $(e.target),
            $parent = undefined;

        if ($target.is('.b-dropdown *')) {
            $parent = $target.parents('.b-dropdown');
            if ($target.is('.b-dropdown__item')) {
                $('.b-dropdown__item', $parent).removeClass('hidden active');
                $parent.removeClass('b-dropdown__first').removeClass('first-open');
                $target.addClass('active');
                $('.b-dropdown__text', $parent)
                    .html($target.html())
                    .data('link', $target.data('link'))
                    .data('icon', $target.data('icon'))
                    .addClass('js-link-stop');

                // if next input set value
                if ($('.js-input-for-select', $parent.closest('.b-dropdown__box')).length) {
                    if ($target.data('value') != undefined) {
                        $('.js-input-for-select', $parent.closest('.b-dropdown__box')).val($target.data('value')).trigger('change');
                    } else {
                        $('.js-input-for-select', $parent.closest('.b-dropdown__box')).val($target.text()).trigger('change');
                    }
                }

                // if data-link go by url
                if ($target.data('link') != undefined)
                    window.location = $target.data('link');
            }
            toggleDropdown($parent)
        } else {
            $('.b-dropdown').each(function () {
                if (!$(this).hasClass('first-open')) {
                    $(this).removeClass('b-dropdown_open');
                }
            })
        }
    });

});


/**
 * scroll to block
 * @param selector
 */
scrollTo = function (selector, offset, scrollElem, position) {
    setTimeout(function () {
        !offset ? offset = 0 : offset;
        if (!position == true) {
            var scroll = $(selector).offset().top - offset;
        } else {
            var scroll = $(selector).position().top - offset;
        }

        if (!scrollElem) {
            scrollElem = $('html,body');
        }
        scrollElem.animate({
            scrollTop: scroll
        }, 500);
    }, 10);
};

/**
 * format price
 * @param val
 * @returns {string}
 */
formating = function (val) {
    return String(val).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
};

/**
 * declension words adjective
 */
declensionAdj = function (number, one, two) {
    number %= 100;
    if (number == 11) return two;
    number %= 10;
    if (number == 1) return one;
    return two;
};

/**
 * declension words
 */
declension = function (number, one, two, five) {
    number = Math.abs(number);
    number %= 100;
    if (number >= 5 && number <= 20) {
        return five;
    }
    number %= 10;
    if (number == 1) {
        return one;
    }
    if (number >= 2 && number <= 4) {
        return two;
    }
    return five;
};

$(document).ready(function () {
    if($('.corpPromo').length) {
        $('input').on('input', function () {
            $(this).removeClass('error');
            $('.error-text').html('');
        })

        $(document).on("submit", ".corpPromo form", function (event) {
            event.preventDefault()
            var form = $(this);
            $.ajax({
                type: 'POST',
                url: '/corporate-promo',
                data: form.serialize(),
                dataType: "json",
                beforeSend: function () {
                    form.find('[type=submit]').prop('disabled', true)
                },
                complete: function () {
                    form.find('[type=submit]').prop('disabled', false)
                },
                success: function (data) {
                    console.log(data);
                    if (data.status == 200) {
                        $('.corpPromo .popap-over').show();
                    } else {
                        if (data.error.email) {
                            form.find('#email').addClass('error')
                            form.find('.error-text').html(data.error.email[0])
                        }
                        if (data.error.private_email) {
                            $('.corpPromo .hidden').removeClass('hidden');
                        }
                    }

                },
                errors: function (errors) {
                    console.log(errors);

                }
            });
        });

        $('.corpPromo .popap-over, .corpPromo .popap-close').on('click', function () {
            window.location.reload();
        })
    }
    
    $(document).on("click",".scrollTop",function(event) {
        event.preventDefault()
        $('html, body').animate({
            scrollTop: 0
        });
    });
});