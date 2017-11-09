pikaDeck.router = function () {
    return {
        init: function () {
            "use strict";

            var hash = window.location.hash;

            if (!(this.inRoutes(hash, this.routes))) {
                this.routes.index.init();
                return;
            }

            var route = this.splitHash(hash)[0];

            var path  = this.getPath(hash);

            this.routes[route].init(path);

        },
        inRoutes: function (hash, routes) {
            "use strict";
            hash = hash || '';
            return this.isRoute(hash) && (this.splitHash(hash)[0] in routes);
        },
        isRoute: function (hash) {
            "use strict";
            hash = hash || '';
            return (hash && hash.indexOf('#!') === 0) ? true : false;
        },
        splitHash: function (hash) {
            "use strict";
            hash = hash || '';
            return hash.toLowerCase().slice(2, hash.length).split('/');
        },
        getPath: function (hash) {
            "use strict";
            hash = hash || '';
            var path = this.splitHash(hash)[1];
            return (path) ? path : undefined;
        },
        routes: {
            index: {
                init: function (path) {
                    "use strict";
                    console.log('Home Page');
                    console.log(path);
                }
            },
            deck: {
                init: function (path) {
                    "use strict";
                    console.log('Deck');
                    console.log(path);
                }
            }
        }

    };
};
