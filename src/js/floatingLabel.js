
(function ($) {

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    $.fn.floatingLabel = function () {

        $(this).each(function (index, item) {
            const id = uuidv4();
            const el = $(this);
            const label = el.attr('label');
            const isAlwaysFocused = el.data('focused-always');

            el.addClass('floating-input__input').attr({ id });

            const wrap = $(`
                <label for="${id}" class="floating-input">
                    <span class="floating-input__label"></span>
                </label>
            `);

            wrap.find('.floating-input__label').text(label);

            el.after(wrap).prependTo(wrap);

            if (el.val() !== '' || isAlwaysFocused) {
                wrap.addClass('focus');
            }

            el.focus(() => wrap.addClass('focus'));
            el.blur(() => {
                if (el.val() === '' && !isAlwaysFocused) {
                    wrap.removeClass('focus');
                }
            });
        });

        return this;
    };

}(jQuery));