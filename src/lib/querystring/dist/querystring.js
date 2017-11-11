(function() {

    "use strict";

    var queryString = {};

    queryString.get = function(key) {

        if (key === undefined || key === 'undefined') {

            var search = location.search;

            if (!search) {
                return {};
            }

            search = JSON.parse('{"' + decodeURI(search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

            for (key in search) {
                if (search.hasOwnProperty(key)) {
                    search[key] = decodeURIComponent(search[key]);
                }
            }

            return search;

        }

        var target = new RegExp("[?&]" + key + "=([^&#]*)").exec(window.location.href);
        return null === target ? null : decodeURIComponent(target[1]) || 0;

    };

    queryString.parse = function(query) {
        return "string" !== typeof query ? {} : (

            query = query.trim().replace(/^\?/, ""),
            query ? query.trim().split("&").reduce(function(query, e) {

                var o = e.replace(/\+/g, " ").split("=");
                var r = o[0];
                var t = o[1];

                return r = decodeURIComponent(r),
                    t = void 0 === t ? null : decodeURIComponent(t),
                    query.hasOwnProperty(r) ? Array.isArray(query[r]) ? query[r].push(t) : query[r] = [query[r], t] : query[r] = t, query;
            }, {}) : {}

        );
    };

    queryString.stringify = function(queryObject) {
        return queryObject ? Object.keys(queryObject).map(function(index) {
            var item = queryObject[index];
            return Array.isArray(item) ? item.map(function(queryObject) {
                return encodeURIComponent(index) + "=" + encodeURIComponent(queryObject);
            }).join("&") : encodeURIComponent(index) + "=" + encodeURIComponent(item);
        }).join("&") : "";
    };

    queryString.clean = function (query) {
        if (query) {
            var params = query.split("&");
            var keepers = [];
            for (var i = 0; i < params.length; i++) {
                if (params[i].indexOf('=') + 1 !== params[i].length && params[i].indexOf('undefined') < 0) {
                    keepers.push(params[i]);
                }
            }
            return keepers.join("&");
        } else {
            return "";
        }
    };

    queryString.remove = function (target) {
        var keepers = [];
        var params = location.search.replace("?", "").split("&");
        for (var i = 0; i < params.length; i++) {
            if (params[i].indexOf(target + "=") < 0) {
                keepers.push(params[i]);
            }
        }
        keepers = queryString.clean(keepers.join("&"));
        history.replaceState({}, "", window.location.pathname + "?" + keepers);
    };

    queryString.removeAll = function () {
        history.replaceState({}, "", window.location.pathname);
    };

    queryString.push = function (name, value) {
        var newQuery = [];
        var query = queryString.parse(location.search);
        query[name] = value;
        for (var key in query) {
            if (query.hasOwnProperty(key)) {
                newQuery.push(key + "=" + encodeURIComponent(query[key]));
            }
        }
        newQuery = queryString.clean(newQuery.join("&"));
        try {
            history.replaceState({}, "", window.location.pathname + "?" + newQuery);
        } catch(e) {
            if (e.toString().indexOf("DOM Exception 18") !== -1) {
                window.location.reload();
            }
        }
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = queryString;
    } else {
        window.queryString = queryString;
    }


})();
