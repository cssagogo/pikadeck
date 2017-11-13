pikaDeck.ctrl = pikaDeck.ctrl || {};
pikaDeck.ctrl.index = {};

(function() {
    "use strict";

    this.init = function() {

        pikaDeck.hb.drawView('#hb_view_index');

        pikaDeck.search.init();

        //this.getSearchResults();

    };

    this.getSearchResults = function () {

        $('#search_options').collapse('hide');

        var params = pikaDeck.getParams();

        pikaDeck.router.queryPush(params);

        pikaDeck.router.queryStore();

        this.get(params);

    };

    this.get = function (params) {

        $(document).trigger('getting_cards');

        pikaDeck.drawDeckButtonEnabled();

        var tournamentSets = pikaDeck.store.get('tournamentSets');

        params = (params) ? params : pikaDeck.getDefaultParams(tournamentSets.standard);

        // TODO: Pass params as data...
        var endpoint = pikaDeck.apiPath + 'cards' + '?pageSize=60&' + params;

        // Else get new data...
        $.ajax({
            dataType: 'json',
            url: endpoint,
            success: function(data) {

                // Create lookup table...
                var lookup = pikaDeck.getLookupTable(data.cards, 'id');

                $(document).trigger('get_cards_done', [data.cards, lookup]);

            },
            error: function(xhr, status, error) {
                console.log([xhr, status, error]);
            }
        });

    };

    this.draw = function (data) {

        if (data.length !== 0) {

            var template = Handlebars.compile($('#hb_card_tile').html());
            $('#poke_cards').html(template(data));

        } else {

            var nodata = Handlebars.compile($('#hb_no_results').html());
            $('#poke_cards').html(nodata());

        }

        $(document).trigger('draw_cards_done');

    };

}).apply(pikaDeck.ctrl.index);
