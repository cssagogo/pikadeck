pikaDeck.controller = pikaDeck.controller || {};
pikaDeck.controller.deck = {};

(function() {
    "use strict";

    this.init = function(path) {

        console.log('Deck');
        console.log(path);

        pikaDeck.hb.drawView('#hb_view_deck');

    };

}).apply(pikaDeck.controller.deck);