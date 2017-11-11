pikaDeck.hb = {};

(function() {
    "use strict";

    this.init = function () {

        _initHelpers();

    };

    this.drawView = function(id) {

        var view = Handlebars.compile($(id).html());
        $('#app').html(view());

        var header = Handlebars.compile($('#hb_header_main').html());
        $('#header_main').html(header());

        var footer = Handlebars.compile($('#hb_footer_main').html());
        $('#footer_main').html(footer());

    };

    var _initHelpers =  function () {

        Handlebars.registerHelper('setData', function(setCode, key) {

            setCode = Handlebars.Utils.escapeExpression(setCode);
            key = Handlebars.Utils.escapeExpression(key);

            // TODO: Should check for existence of nodes in object...
            var sets = pikaDeck.store.get('sets');
            var value = sets[setCode][key];

            return new Handlebars.SafeString(value);
        });

        Handlebars.registerHelper('tournamentType', function(setCode) {

            setCode = Handlebars.Utils.escapeExpression(setCode);

            // TODO: Should check for existence of nodes in object...
            var sets = pikaDeck.store.get('sets');
            var standardLegal = sets[setCode].standardLegal;
            var expandedLegal = sets[setCode].expandedLegal;
            var value = (standardLegal) ? 'Standard' : (expandedLegal) ? 'Expanded' : 'Unlimited';

            return new Handlebars.SafeString(value);
        });

        Handlebars.registerHelper('setSymbolUrl', function(setCode) {

            setCode = Handlebars.Utils.escapeExpression(setCode);

            // TODO: Should check for existence of nodes in object...
            var sets = pikaDeck.store.get('sets');
            var symbolUrl = sets[setCode].symbolUrl;

            return new Handlebars.SafeString(symbolUrl);
        });

        Handlebars.registerHelper('ifAny', function(v1, v2, v3, options) {
            return (v1 || v2 || v3) ? options.fn(this) : options.inverse(this);
        });

        Handlebars.registerHelper('energyType', function(type) {

            type = type.toLowerCase();

            type = Handlebars.Utils.escapeExpression(type);

            var result = '<i class="icon-energy icon-' + type + '"></i>';

            return new Handlebars.SafeString(result);

        });

    };

}).apply(pikaDeck.hb);
