pikaDeck.ctrl = pikaDeck.ctrl || {};
pikaDeck.ctrl.index = {};

(function() {
    "use strict";

    this.init = function(path) {

        console.log(path);

        pikaDeck.hb.drawView('#hb_view_index');

        pikaDeck.getSearchResults();

    };

}).apply(pikaDeck.ctrl.index);
