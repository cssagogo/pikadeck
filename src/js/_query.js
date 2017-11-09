pikaDeck.query = function () {
    return {
        get: function () {
            return this.stripQuestionMark(window.location.search);
        },
        store: function () {

            var query = this.toObject(this.get());

            pikaDeck.lookup.query = query;

            $(document).trigger('store_query_done', [query]);

        },
        push: function (params) {

            // TODO: Look at params coming in.  This might be the place to convert multiple items to single with ~NUM?

            queryString.removeAll();

            params = this.splitOn(params, '&');

            for (var i = 0; i < params.length; i++) {

                var item = this.splitOn(params[i], '=');

                var name = item[0];

                var value = decodeURIComponent(item[1]);

                queryString.push(name, value);

            }

            $(document).trigger('push_query_done');

        },
        toObject: function (query) {

            // TODO: Handle ~NUM passed in via query here.

            var queryObj = {};

            if (query === '') {
                return queryObj;
            }

            query = this.stripQuestionMark(query);

            query = this.splitOn(query, '&');

            for (var i = 0; i < query.length; i++) {

                var item = this.splitOn(query[i], '=');

                var name = item[0];

                var value = decodeURIComponent(item[1]);

                value = this.splitOn(value, '|');

                queryObj[name] = value;

            }

            return queryObj;

        },
        stripQuestionMark: function (query) {
            return (query.indexOf('?') === 0) ? query.replace('?', '') : query;
        },
        splitOn: function (string, point) {
            return (string.indexOf(point) >= 0) ? string.split(point) : [string];
        }

    };
};