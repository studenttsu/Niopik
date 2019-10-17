$(function () {

    var cities = ['Томск', 'Москва'];
    var industries = ['Медицина', 'Промышленность'];
    var industry_types = ['Стоматологическая клиника', 'Офтальмологическая клиника'];

    jQuery.validator.addMethod("phoneValidator", function (value, element) {
        return value.length > 0 ? /\+\d{1}\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}/g.test(value) : true;
    });

    jQuery.validator.addMethod("cityValidator", function (value, element) {
        return cities.findIndex(x => x.toLocaleLowerCase() === value.toLocaleLowerCase()) !== -1;
    });

    $('.goods-card__basket-control .btn').on('click', function () {
        const btn = $(this);
        const controlWrap = btn.closest('.goods-card__basket-control');
        const control = $('<input type="number" pattern="[0-9]*" value="1" min="0" />');

        controlWrap.append(control);
        $('input[type=number]').styler();

        btn.hide();

        control.on('change', event => {
            var value = event.target.value;

            if (value == 0) {
                control.closest('.jq-number').remove();
                btn.show();
            }
        });
    });

    $('.goods-card .select__dropdown li').on('click', function () {
        const basketControl = $(this).closest('.goods-card').find('.goods-card__basket-control');

        if (basketControl.find('.btn').css('display') == 'none') {
            basketControl.find('.jq-number').remove();
            basketControl.find('.btn').show();
        }
    });

    $('input.form-control').floatingLabel();

    $('input.phone-input').inputmask({
        mask: '+7 (999) 999-99-99'
    });

    $('input[type=number]').styler();

    $('.city-select').autocomplete({
        lookup: cities,
        minChars: 0,
        showNoSuggestionNotice: true,
        noSuggestionNotice: 'Город не найден, проверьте название',
        onSelect: function () {
            $(this).parent('.floating-input').addClass('focus');
        }
    });

    $('.industry-select').autocomplete({
        lookup: industries,
        minChars: 0,
        showNoSuggestionNotice: true,
        noSuggestionNotice: 'Отрасль не найдена, проверьте название',
        onSelect: function () {
            $(this).parent('.floating-input').addClass('focus');
        }
    });
    $('.industry-type-select').autocomplete({
        lookup: industry_types,
        minChars: 0,
        showNoSuggestionNotice: true,
        noSuggestionNotice: 'Тип не найден, проверьте название',
        onSelect: function () {
            $(this).parent('.floating-input').addClass('focus');
        }
    });

    $('form.contact-form:not(#basket-order)').each(function () {
        $(this).validate({
            rules: {
                name: 'required',
                phone: {
                    required: true,
                    phoneValidator: true
                },
                policy: 'required'
            },
            errorPlacement: function (error, element) { },
            submitHandler: function (form) {
                form.submit();
            }
        });
    });

    $('form#basket-order').validate({
        rules: {
            city: {
                required: true,
                cityValidator: true
            },
            name: 'required',
            phone: {
                required: true,
                phoneValidator: true
            },
            policy: 'required'
        },
        errorPlacement: function (error, element) { },
        submitHandler: function (form) {
            form.submit();
        }
    });

    $('input[type=checkbox]').on('input', function (event) {
        if (event.target.checked && $(this).next().hasClass('error')) {
            $(this).next().remove();
        }
    });

    $('.basket-list__remove').on('click', function () {
        $(this).closest('.basket-list__item').remove();
    });

    $('.basket-list__control input').on('change', function (event) {
        var value = event.target.value;

        if (value == 0) {
            $(this).closest('.basket-list__item').remove();
        }
    });

    (function () {
        var outsideSelectClickListener = function (event) {
            $('.select').removeClass('opened');
            $(document).off('click', outsideSelectClickListener);
            event.stopPropagation();
        };

        $('.select__current').on('click', function () {
            $(this).parent().toggleClass('opened');

            event.stopPropagation();
            $(document).on('click', outsideSelectClickListener);
            $('.select').not($(this).parent()).removeClass('opened');
        });

        $('.select__dropdown li').on('click', function () {
            var text = $(this).text();
            $(this).parent().siblings('.select__current').text(text);
            $(this).closest('.select').removeClass('opened');
            $(document).off('click', outsideSelectClickListener);
        });
    })();

    $('.goods-card .select__dropdown li').on('click', function () {
        var price = $(this).data('price');

        $(this).closest('.goods-card').find('.goods-card__price').text(price + ' Р');
    });

    $('#open-filters').on('click', function () {
        $('.goods-filters').addClass('opened');
        $('body').addClass('hide-scroll');
    });

    $('#hide-filters').on('click', function () {
        $('.goods-filters').removeClass('opened');
        $('body').removeClass('hide-scroll');
    });

    $().fancybox({
        selector: '.docs-slider .slick-slide:not(.slick-cloned) .doc-img'
    });

    $('.hero-slider').slick({ dots: true });

    $('.docs-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    $('#mobile-hamb').on('click', function () {
        $(this).toggleClass('active');
        $('#mobile-menu').toggleClass('opened');
        $('body').toggleClass('hide-scroll');
    });

    $('#mobile-menu .drop').on('click', function () {
        $(this).toggleClass('active');
        $(this).find('.mobile-menu__sub-nav').slideToggle();
    });

    var outsideClickListener = function (event) {
        if ($(event.target).closest(".categories").length) return;

        $('#catalog-btn').removeClass('active')
            .find('.hamb').removeClass('active');

        $('.wrapper__inner').removeClass('overlay');
        $('.categories').removeClass('opened');

        $(document).off('click', outsideClickListener);
        event.stopPropagation();
    };

    $('#catalog-btn').on('click', function (event) {
        $(this).toggleClass('active');
        $(this).find('.hamb').toggleClass('active');

        $('.wrapper__inner').toggleClass('overlay');
        $('.categories').toggleClass('opened');

        if ($(this).hasClass('active')) {
            event.stopPropagation();

            initFirstCategory();
            $(document).on('click', outsideClickListener);
        }
    });

    var categoriesListItems = $('.categories-list li');
    var categoryItems = $('.category-items');

    categoriesListItems.on('mouseenter', function () {
        var that = $(this);

        if (!that.hasClass('active')) {
            var id = that.data('id');

            categoriesListItems.removeClass('active');
            that.addClass('active');

            categoryItems.removeClass('active');
            $('.category-items[data-target=' + id + ']').addClass('active');
        }
    });

    function initFirstCategory() {
        var firstCategory = categoriesListItems.first();
        var firstCategoryId = firstCategory.data('id');

        categoriesListItems.removeClass('active');
        firstCategory.addClass('active');

        categoryItems.removeClass('active');
        $('.category-items[data-target=' + firstCategoryId + ']').addClass('active');
    }

    function newsScroll(el) {
        if ($('.wrapper__inner').find(el).length) {
            if ($(window).width() > 768) {
                var vg = $('.news__wrapper').offset().top - 120;
                var ng = vg + $('.news__wrapper').outerHeight() - $(el).outerHeight();
                var st = $(window).scrollTop();

                $('.news__wrapper').css('min-height', $('.news__wrapper').find(el).outerHeight());

                if (st > vg) {
                    if (st > ng) {
                        $(el).removeClass('scroll');
                        $(el).addClass('bottom');
                    } else {
                        $(el).addClass('scroll');
                        $(el).removeClass('bottom');
                    }
                } else {
                    $(el).removeClass('scroll');
                    $(el).removeClass('bottom');
                }
            } else {
                $('.news__wrapper').css('min-height', 'auto');
                $(el).removeClass('scroll');
                $(el).removeClass('bottom');
            }
        }
    }

    newsScroll('.news__nav');

    function selectionScroll() {
        var el = '.selection-fix';
        if ($('.wrapper__inner').find(el).length) {
            if ($(window).width() > 768) {
                var vg = $('.selection-section').offset().top - 70;
                var ng = vg + $('.selection-section').outerHeight() - $(el).outerHeight() - 100;
                var st = $(window).scrollTop();

                $('.selection-section').css('min-height', $('.selection-section').find(el).outerHeight());

                if (st > vg) {
                    if (st > ng) {
                        $(el).removeClass('scroll');
                        $(el).addClass('bottom');
                    } else {
                        $(el).addClass('scroll');
                        $(el).removeClass('bottom');
                    }
                } else {
                    $(el).removeClass('scroll');
                    $(el).removeClass('bottom');
                }
            } else {
                $('.news__wrapper').css('min-height', 'auto');
                $(el).removeClass('scroll');
                $(el).removeClass('bottom');
            }
        }
    }

    selectionScroll();

    var hh = $('.header').outerHeight();
    var hnh = $('.header__navbar').outerHeight();
    function headerScroll(){
        var st = $(window).scrollTop();

        if ($(window).width() > 768){
            if (st > hnh){
                $('body').css('padding-top',hh);
                $('.header').addClass('scroll');
            } else {
                $('body').css('padding-top',0);
                $('.header').removeClass('scroll');
            }
        } else {
            $('body').css('padding-top',0);
            $('.header').removeClass('scroll');
        }
    }

    headerScroll();

    $(window).on('scroll', function () {
        newsScroll('.news__nav');
        selectionScroll();
        headerScroll();
    });

    $(window).resize(function () {
        newsScroll('.news__nav');
        selectionScroll();

        $('.header').removeClass('scroll');
        hh = $('.header').outerHeight();
        hnh = $('.header__navbar').outerHeight();
        headerScroll();
    });

});