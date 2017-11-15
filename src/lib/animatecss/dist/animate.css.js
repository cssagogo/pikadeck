$.fn.extend({
    animateCss: function (animationName, callback) {
        'use strict';

        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
                callback(this);
            }
        });

        return this;
    }
});