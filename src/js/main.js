$(function () {

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

    $('.header__navbar .hamb').on('click', function () {
        $(this).toggleClass('active');
    })

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

});