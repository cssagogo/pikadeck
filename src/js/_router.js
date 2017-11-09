pikaDeck.router = function () {
    return {
        routes: {
            index: {
                init: function (path) {
                    "use strict";
                    pikaDeck.controller.index().init(path);
                }
            },
            deck: {
                init: function (path) {
                    "use strict";
                    pikaDeck.controller.deck().init(path);
                }
            }
        },
        init: function () {
            "use strict";

            // TODO: Consider passing this in.  Might be able to page
            // TODO: within the app without full page reload.

            var hash = window.location.hash;

            if (!(this._inRoutes(hash, this.routes))) {
                this.routes.index.init();
                return;
            }

            var route = this._splitHash(hash)[0];
            var path  = this._getPath(hash);


            pikaDeck.store.update('route', route);
            pikaDeck.store().update('path', path);


            this.routes[route].init(path);

        },
        _inRoutes: function (hash, routes) {
            "use strict";

            hash = hash || '';
            return this._isRoute(hash) && (this._splitHash(hash)[0] in routes);

        },
        _isRoute: function (hash) {
            "use strict";

            hash = hash || '';
            return (hash && hash.indexOf('#!') === 0) ? true : false;

        },
        _splitHash: function (hash) {
            "use strict";

            hash = hash || '';
            return hash.toLowerCase().slice(2, hash.length).split('/');

        },
        _getPath: function (hash) {
            "use strict";

            hash = hash || '';
            var path = this.splitHash(hash)[1];
            return (path) ? path : undefined;

        }
    };
};
