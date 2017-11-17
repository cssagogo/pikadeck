pikaDeck.router =  {};

(function() {
    "use strict";

    this.init = function() {

        var hash   = window.location.hash.split('?');
        var search = window.location.search.replace('?', '');

        var rawQuery    = _getQuery(hash[1], search);
        var query       = _queryToObject(rawQuery);
        var route       = _getRoute(hash[0]);
        var path        = _getPath(hash[0]);

        pikaDeck.store.push('route', route);
        pikaDeck.store.push('path',  path);
        pikaDeck.store.push('rawQuery', rawQuery);
        pikaDeck.store.push('query', query);

        pikaDeck.hb.drawShell();

        pikaDeck.store.push('deckList', store.get('deckList'));

        if (!(_inRoutes(hash[0]))) {
            pikaDeck.ctrl.index.init();
            return;
        }

        pikaDeck.ctrl[route].init();

    };

    var _getRoute = function (hash) {
        return _splitHash(hash)[0] || 'index';
    };

    var _getPath = function (hash) {
        return _splitHash(hash)[1] || '';
    };

    var _getQuery = function (hash, search) {
        return (hash) ? hash : ((search) ? search : '');
    };

    var _inRoutes = function (hash) {

        hash = hash || '';

        var route = _splitHash(hash)[0];
        var ctrl = pikaDeck.ctrl;

        return (_isRoute(hash) && ctrl && typeof ctrl[route] === 'object' && typeof ctrl[route].init === 'function') ? true : false;

    };

    var _queryToObject = function (query) {

        // TODO: Handle ~NUM passed in via query here.

        var queryObj = {};

        if (query === '') {
            return queryObj;
        }

        query = _stripQuestionMark(query);

        query = query.split('&');

        for (var i = 0; i < query.length; i++) {

            var item = query[i].split('=');

            var name = item[0];

            var value = decodeURIComponent(item[1]);

            value = value.split('|').sort();

            queryObj[name] = value;

        }

        return queryObj;

    };

    var _stripQuestionMark = function (query) {
        return (query.indexOf('?') === 0) ? query.replace('?', '') : query;
    };

    var _isRoute = function (hash) {
        return (hash && hash.indexOf('#!') === 0) ? true : false;
    };

    var _splitHash = function (hash) {
        return (hash) ? hash.toLowerCase().replace('#!','').split('/') : '';
    };


    // Start - For Unit Testing Only
    // this._inRoutes   = _inRoutes;
    // this._isRoute    = _isRoute;
    // this._splitHash  = _splitHash;
    // this._getPath    = _getPath;
    // End - For Unit Testing Only

}).apply(pikaDeck.router);
