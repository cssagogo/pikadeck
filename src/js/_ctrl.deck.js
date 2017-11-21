pikaDeck.ctrl = pikaDeck.ctrl || {};
pikaDeck.ctrl.deck = {};

(function() {
    "use strict";

    this.init = function() {

        document.title = document.title + " - Untitled Deck";

        pikaDeck.hb.drawView('#hb_view_deck');
        pikaDeck.drawDeckButtonDisabled();

    };

    this.view = function () {

        var deckList = pikaDeck.store.get('deckList');
        deckList = this.getShortList(deckList);

        window.location.href = "/#!deck?list=" + deckList;
        window.location.reload();

    };

    this.get = function (deck) {

        $(document).trigger('deck.loading');

        // TODO: Handle when no IDs are passed.
        // TODO: Pass params as data.
        $.ajax({
            dataType: 'json',
            url: pikaDeck.apiPath + 'cards?id=' + ((deck) ? deck.join('|') : ''),
            success: function (data) {
                pikaDeck.store.push('deck', data.cards);
            },
            error: function (xhr, status, error) {
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

        $(document).trigger('deck.draw_done');

    };

    this.drawCount = function (deckList) {
        if (deckList) {
            $('.count', '#view_deck').html('(' + deckList.length + ')');
            $(document).trigger('deckCount.draw_done');
        }
    };

    this.drawStats = function (data) {
        if (data.length !== 0) {

            var template = Handlebars.compile($('#hb_deck_stats').html());
            $('#deck_stats').html(template(data));

        }

        $(document).trigger('deckStats.draw_done');
    };

    this.getDeckSorted = function () {

        // TODO: Rename to getDeckSortedUnique

        var deckCounts  = pikaDeck.store.get('deckCounts');
        var deckSorted  = pikaDeck.sortObjects(pikaDeck.objectToObjectArray(deckCounts), 'value');
        var cardsLookup = pikaDeck.store.get('cardsLookup');

        var pokemon = [];
        var trainer = [];
        var energy  = [];

        for (var i = 0; i < deckSorted.length; i++) {

            var id = deckSorted[i].name;
            var supertype = cardsLookup[id].supertype;

            if (supertype === 'Energy') {
                energy.push(id);
            }

            if (supertype === 'Trainer') {
                trainer.push(id);
            }

            if (supertype === 'Pokémon') {
                pokemon.push(id);
            }

        }

        deckSorted = pokemon.concat(trainer).concat(energy);

        pikaDeck.store.push('deckSorted', deckSorted);

    };

    this.getDeckSortedFull = function () {

        var deckCounts  = pikaDeck.store.get('deckCounts');
        var deckSorted  = pikaDeck.store.get('deckSorted');

        var deckSortedFull = [];

        for (var i = 0; i < deckSorted.length; i++) {
            var count = deckCounts[deckSorted[i]];
            for (var x = 0; x < count; x++) {
                deckSortedFull.push(deckSorted[i]);
            }
        }

        pikaDeck.store.push('deckSortedFull', deckSortedFull);

    };

    this.getShortList = function (longList) {

        return JSON.stringify(pikaDeck.getCounts(longList))
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

    this.storeDeck = function () {

        var query = pikaDeck.store.get('query');
        var route = pikaDeck.store.get('route');

        if (route === 'deck' && query && query.list && query.list.length > 0) {

            pikaDeck.store.push('deckShort', query.list.join('|'));

            var deckCounts = this.getCountList(query.list.join('|'));
            pikaDeck.store.push('deckCounts', deckCounts);

            var deckList = this.getLongList(query.list.join('|'));
            pikaDeck.store.push('deckList', deckList);

            var deckUnique = pikaDeck.getUniqueList(deckList);
            pikaDeck.store.push('deckUnique', deckUnique);

        }

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