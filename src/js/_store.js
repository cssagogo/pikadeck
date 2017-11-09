(function() {
    pikaDeck.store = {
        data: {},
        update: function (key, value) {
            "use strict";

            var current = this.data;
            var updated = this._updateObject(current, key, value);

            if (!this._sameObject(current, updated)) {

                // TODO: Add a history for an undo feature.

                this.data = updated;

                $(document).trigger(key + '.store_updated', [key, value]);

            }

        },
        get: function (key) {
            "use strict";

            return this.data[key];
        },
        _updateObject: function (obj, key, value) {
            "use strict";

            var update = {};
            update[key] = value;

            return Object.assign({}, obj, update);

        },
        _sameObject: function (obj1, obj2) {
            "use strict";

            return JSON.stringify(obj1) === JSON.stringify(obj2);
        }
    };
})();