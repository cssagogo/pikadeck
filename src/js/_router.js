pikaDeck.router =  {};

(function() {
    "use strict";

    var _inRoutes = function (hash) {

        hash = hash || '';

        var route = _splitHash(hash)[0];
        var ctrl = pikaDeck.controller;

        return (_isRoute(hash) && ctrl && typeof ctrl[route].init === 'function') ? true : false;

    };

    var _isRoute = function (hash) {

        hash = hash || '';
        return (hash && hash.indexOf('#!') === 0) ? true : false;

    };

    var _splitHash = function (hash) {

        hash = hash || '';
        return hash.toLowerCase().slice(2, hash.length).split('/');

    };

    var _getPath = function (hash) {

        hash = hash || '';
        var path = _splitHash(hash)[1];
        return (path) ? path : undefined;

    };

    this.init = function(hash) {

        hash = hash || window.location.hash;

        if (!(_inRoutes(hash))) {
            pikaDeck.controller.index.init();
            return;
        }

        var route = _splitHash(hash)[0];
        var path = _getPath(hash);

        pikaDeck.store.push('route', route);
        pikaDeck.store.push('path', path);

        pikaDeck.controller[route].init(path);

    };

    // Start - For Unit Testing Only
    // this._inRoutes   = _inRoutes;
    // this._isRoute    = _isRoute;
    // this._splitHash  = _splitHash;
    // this._getPath    = _getPath;
    // End - For Unit Testing Only

}).apply(pikaDeck.router);
