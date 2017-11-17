pikaDeck.ctrl = pikaDeck.ctrl || {};
pikaDeck.ctrl.index = {};

(function() {
    "use strict";

    this.init = function() {

        document.title = document.title + " - Pokemon Deck Builder";

        pikaDeck.hb.drawView('#hb_view_index');
        pikaDeck.drawDeckButtonEnabled();

    };

    this.view = function () {

        var params = pikaDeck.search.getParams();
        // TODO: Validate params exist, else return alert/growl.
        window.location.href = '/#!index?' + params;
        window.location.reload();

    };

    this.get = function () {

        var route = pikaDeck.store.get('route');

        if (route === 'index') {

            $(document).trigger('cards.loading');

            var tournamentSets = pikaDeck.store.get('tournamentSets');

            var params = pikaDeck.store.get('rawQuery') || _getDefaultParams(tournamentSets.standard);

            // TODO: Pass params as data...
            var endpoint = pikaDeck.apiPath + 'cards?pageSize=60&' + params;

            // Else get new data...
            $.ajax({
                dataType: 'json',
                url: endpoint,
                success: function (data) {
                    pikaDeck.store.push('cards', data.cards);
                },
                error: function (xhr, status, error) {
                    console.log([xhr, status, error]);
                }
            });

        }

    };

    this.draw = function (data) {

        if (data.length !== 0) {

            var template = Handlebars.compile($('#hb_card_tile').html());
            $('#index_cards').html(template(data));

        } else {

            var nodata = Handlebars.compile($('#hb_no_results').html());
            $('#poke_cards').html(nodata());

        }

        $(document).trigger('draw_cards_done');

    };

    var _getDefaultParams = function (standardSets) {

        // SHAME: This is not pretty.
        // TODO: Ugh. Some of the cards in the DB do not include a rarity. So either need to live with it, or
        // Pull back all raritys and then remove common and uncommon cards post get. :(
        // Removing Generations and Evolutions as artwork is ugly ;P
        standardSets = pikaDeck.removeFromArray(standardSets, 'g1');
        standardSets = pikaDeck.removeFromArray(standardSets, 'xy12');
        standardSets = standardSets.join('|');

        return 'supertype=Pokemon|Trainer' +
            '&subtype=GX|EX|Mega|Supporter' +
            '&rarity=Rare%20Ultra|Rare%20Holo%20gx|Rare%20Holo%20EX' +
            '&setCode=' + standardSets;

    };

}).apply(pikaDeck.ctrl.index);
