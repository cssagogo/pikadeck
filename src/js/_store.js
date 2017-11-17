pikaDeck.store = {};

(function() {
    "use strict";

    var _data = {};

    this.push = function(key, value) {

        if (key && value) {

            var current = JSON.parse(JSON.stringify(_data));
            var updated = _updateObject(current, key, value);

            if (!_sameObject(current, updated)) {

                // TODO: Add a history for an undo feature.

                _data = updated;

                $(document).trigger(key + '.store_updated', [key, value]);

            }

        }

    };

    this.get = function (key) {
        var data = JSON.parse(JSON.stringify(_data));
        return (key) ? data[key] : data;
    };

    var _updateObject = function (obj, key, value) {

        var update = {};
        update[key] = value;

        return Object.assign({}, obj, update);

    };

    var _sameObject = function (obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };

    // Start - For Unit Testing Only
    //this._updateObject  = _updateObject;
    //this._sameObject    = _sameObject;
    // End - For Unit Testing Only


}).apply(pikaDeck.store);