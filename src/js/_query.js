pikaDeck.query = {};

(function() {
    "use strict";

    this.get = function () {
        return this._stripQuestionMark(window.location.search);
    };

    this.store = function () {

        var query = this._toObject(this.get());

        pikaDeck.store.push('query', query);

        $(document).trigger('store_query_done', [query]);

    };

    this.push = function (params) {

        // TODO: Look at params coming in.  This might be the place to convert multiple items to single with ~NUM?

        // TODO: Need to swap this out with router.
        queryString.removeAll();

        params = params.split('&');

        for (var i = 0; i < params.length; i++) {

            var item = params[i].split('=');

            var name = item[0];

            var value = decodeURIComponent(item[1]);

            // TODO: Need to swap this out with router.
            queryString.push(name, value);

        }

        $(document).trigger('push_query_done');

    };

    this._toObject = function (query) {

        // TODO: Handle ~NUM passed in via query here.

        var queryObj = {};

        if (query === '') {
            return queryObj;
        }

        query = this._stripQuestionMark(query);

        query = query.split('&');

        for (var i = 0; i < query.length; i++) {

            var item = query[i].split('=');

            var name = item[0];

            var value = decodeURIComponent(item[1]);

            value = value.split('|');

            queryObj[name] = value;

        }

        return queryObj;

    };

    this._stripQuestionMark = function (query) {
        return (query.indexOf('?') === 0) ? query.replace('?', '') : query;
    };

}).apply(pikaDeck.query);