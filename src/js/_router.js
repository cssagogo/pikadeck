pikaDeck.router = function () {
    return {
        init: function () {

            var hash = window.location.hash;
            var route = this.splitHash(hash)[0];

            if (!(this.isRoute(hash)) && !(route in this.routes)) {
                this.routes.index.init();
                return;
            }


            var path  = this.getPath(hash);

            this.routes[route].init(path);

        },
        isRoute: function (hash) {
            return (hash && hash.indexOf('#!') === 0) ? true : false;
        },
        splitHash: function (hash) {
            return hash.toLowerCase().slice(2, hash.length).split('/');
        },
        getPath: function (hash) {
            var path = this.splitHash(hash)[1];
            return (path) ? path : undefined;
        },
        routes: {
            index: {
                init: function (path) {
                    console.log('Home Page');
                    console.log(path);
                }
            },
            deck: {
                init: function (path) {
                    console.log('Deck');
                    console.log(path);
                }
            }
        }

    };
};
