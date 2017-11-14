pikaDeck.ctrl = pikaDeck.ctrl || {};
pikaDeck.ctrl.deck = {};

(function() {
    "use strict";

    this.init = function() {

        pikaDeck.hb.drawView('#hb_view_deck');

        pikaDeck.search.init();

        pikaDeck.drawDeckButtonDisabled();

    };

    this.get = function (deck) {

        // TODO: loading_deck or deck.loading maybe?
        $(document).trigger('getting_deck');

        // TODO: Handle when no IDs are passed.
        // TODO: Pass params as data.
        $.ajax({
            dataType: 'json',
            url: pikaDeck.apiPath + 'cards?id=' + ((deck) ? deck.join('|') : ''),
            success: function(data) {
                pikaDeck.store.push('deck', data.cards);
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

        // TODO: deck.draw_done?
        $(document).trigger('deck.draw_done');

    };

    this.drawCount = function (deckList) {
        $('.count', '#view_deck').html('(' + deckList.length + ')');
        $(document).trigger('deckCount.draw_done');
    };

    this.getUniqueList = function (longList) {

        return longList.filter(function(item, pos) {
            return longList.indexOf(item) === pos;
        }).sort();

    };

    this.getShortList = function (longList) {

        return JSON.stringify(_getCounts(longList))
            .replace(/,"/g,'|')
            .replace(/":/g,'~')
            .replace(/{"/g,'')
            .replace(/}/g,'');

    };

    this.getCountList = function (shortList) {
        return JSON.parse('{"' + shortList.replace(/~/g,'":').replace(/[|]/g,',"')  + '}');
    };

    this.getLongList = function (shortList) {
        return _getArray(this.getCountList(shortList)).sort();
    };

    this.storeDeck = function (value) {

        var route = pikaDeck.store.get('route');

        if (route === 'deck' && value && value.list && value.list.length > 0) {

            pikaDeck.store.push('deckShort', value.list.join('|'));

            var deckCounts = this.getCountList(value.list.join('|'));
            pikaDeck.store.push('deckCounts', deckCounts);

            var deckList = this.getLongList(value.list.join('|'));
            pikaDeck.store.push('deckList', deckList);

            var deckUnique = this.getUniqueList(deckList);
            pikaDeck.store.push('deckUnique', deckUnique);

        }

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