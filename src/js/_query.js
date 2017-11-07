pikaDeck.query = function () {
    return {
        get: function () {

            var query = window.location.search;

            return (query.indexOf('?') === 0) ? query.replace('?', '') : query;

        },
        store: function () {

            var query = this.toObject(this.get());

            pikaDeck.lookup.query = query;

            $(document).trigger('store_query_done', [query]);

        },
        push: function (params) {

            queryString.removeAll();

            params = params.split('&');

            for (var i = 0; i < params.length; i++) {

                var item = params[i].split('=');

                var name = item[0];

                var value = decodeURIComponent(item[1]);

                queryString.push(name, value);

            }

        },
        toObject: function (query) {

            var queryObj = {};

            if (query === '') {
                return queryObj;
            }

            if (query.indexOf('?') === 0) {
                query = query.replace('?', '');
            }

            if (query.indexOf('&') >= 0) {
                query = query.split('&');
            } else {
                query = [query];
            }

            for (var i = 0; i < query.length; i++) {

                var item = query[i].split('=');

                var name = item[0];

                var value = decodeURIComponent(item[1]);

                if (value.indexOf('|') >= 0) {
                    value = value.split('|');
                } else {
                    value = [value];
                }

                queryObj[name] = value;

            }

            return queryObj;

        }

    };
};