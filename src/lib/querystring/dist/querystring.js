!function () {
    "use strict";
    var n = {};
    n.delayedPush = "";
    n.get = function (n) {

        if (n === undefined || n === 'undefined') {

            var search = location.search;

            if (!search) {
                return {};
            }

            search = JSON.parse('{"' + decodeURI(search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

            for (var key in search) {
                if (search.hasOwnProperty(key)) {
                    search[key] = decodeURIComponent(search[key]);
                }
            }

            return search;

        }

        var e = new RegExp("[?&]" + n + "=([^&#]*)").exec(window.location.href);
        return null === e ? null : decodeURIComponent(e[1]) || 0;

    };
    n.parse = function (n) {
        return "string" != typeof n ? {} : (n = n.trim().replace(/^\?/, ""), n ? n.trim().split("&").reduce(function (n, e) {
            var o = e.replace(/\+/g, " ").split("="), r = o[0], t = o[1];
            return r = decodeURIComponent(r), t = void 0 === t ? null : decodeURIComponent(t), n.hasOwnProperty(r) ? Array.isArray(n[r]) ? n[r].push(t) : n[r] = [n[r], t] : n[r] = t, n;
        }, {}) : {});
    };
    n.stringify = function (n) {
        return n ? Object.keys(n).map(function (e) {
            var o = n[e];
            return Array.isArray(o) ? o.map(function (n) {
                return encodeURIComponent(e) + "=" + encodeURIComponent(n);
            }).join("&") : encodeURIComponent(e) + "=" + encodeURIComponent(o);
        }).join("&") : "";
    };
    n.clean = function (s) {
        if (s) {
            var t = s.split("&");
            var u = [];
            for (var i = 0; i < t.length; i++) {
                if (t[i].indexOf('=') + 1 != t[i].length && t[i].indexOf('undefined') < 0) {
                    u.push(t[i]);
                }
            }
            return u.join("&");
        } else {
            return "";
        }
    };
    n.remove = function (e) {
        var u = [];
        var t = location.search.replace("?", "").split("&");
        for (var i = 0; i < t.length; i++) {
            if (t[i].indexOf(e + "=") < 0) {
                u.push(t[i]);
            }
        }
        u = n.clean(u.join("&"));
        history.replaceState({}, "", window.location.pathname + "?" + u);
    };
    n.removeAll = function () {
        history.replaceState({}, "", window.location.pathname);
    };
    n.add = function (e, o) {
        n.push(e, o);
    };
    n.push = function (e, o) {
        var u = [];
        var r = n.parse(location.search);
        r[e] = o;
        for (var v in r) {
            u.push(v + "=" + encodeURIComponent(r[v]));
        }
        var t = n.clean(u.join("&"));

        try {
            history.replaceState({}, "", window.location.pathname + "?" + t);
        } catch(e) {
            if (e.toString().indexOf("DOM Exception 18") !== -1) {
                window.location.reload();
            }
        }
    };
    "undefined" != typeof module && module.exports ? module.exports = n : window.queryString = n;
}();
