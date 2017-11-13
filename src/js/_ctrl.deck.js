pikaDeck.ctrl = pikaDeck.ctrl || {};
pikaDeck.ctrl.deck = {};

(function() {
    "use strict";

    this.init = function() {

        pikaDeck.hb.drawView('#hb_view_deck');

        pikaDeck.search.init();

        var deck = pikaDeck.store.get('cart');

        this.get(deck);
    };

    this.get = function (deck) {

        $(document).trigger('getting_deck');

        pikaDeck.drawDeckButtonDisabled();

        // TODO: Look into how to handle when no IDs are passed in.
        deck = (deck) ? deck.join('|') : '';

        // TODO: Pass params as data...
        var endpoint = pikaDeck.apiPath + 'cards?id=' + deck;

        // Else get new data...
        $.ajax({
            dataType: 'json',
            url: endpoint,
            success: function(data) {

                // Create lookup table...
                var lookup = pikaDeck.getLookupTable(data.cards, 'id');

                $(document).trigger('get_deck_done', [data.cards, lookup]);

            },
            error: function(xhr, status, error) {
                console.log([xhr, status, error]);
            }
        });

    };

    this.draw = function (data) {

        if (data.length !== 0) {

            var template = Handlebars.compile($('#hb_deck_cards').html());
            $('#deck_cards').html(template(data));

        } else {

            var nodata = Handlebars.compile($('#hb_no_results').html());
            $('#deck_cards').html(nodata());

        }

        $(document).trigger('draw_deck_done');

    };

    this.getUniqueList = function (longList) {

        return longList.filter(function(item, pos) {
            return longList.indexOf(item) === pos;
        });

    };

    // getShortList
    this.getShortList = function (longList) {

        return JSON.stringify(_getCounts(longList))
            .replace(/,"/g,'|')
            .replace(/":/g,'~')
            .replace(/{"/g,'')
            .replace(/}/g,'');

    };

    this.getLongList = function (shortList) {
        return _getArray(JSON.parse('{"' + shortList.replace(/~/g,'":').replace(/[|]/g,',"')  + '}'));
    };

    var _getCounts = function (list) {

        var counts = {};

        for (var i = 0; i < list.length; i++) {
            var num = list[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }

        return counts;

    };

    var _getArray = function (listObj) {

        var list = [];

        for (var prop in listObj) {
            if (listObj.hasOwnProperty(prop)) {

                for (var i = 0; i < listObj[prop]; i++) {
                    list.push(prop);
                }

            }
        }

        return list;

    };



}).apply(pikaDeck.ctrl.deck);