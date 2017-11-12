pikaDeck.ctrl = pikaDeck.ctrl || {};
pikaDeck.ctrl.deck = {};

(function() {
    "use strict";

    this.init = function(path) {

        console.log(path);

        pikaDeck.hb.drawView('#hb_view_deck');

        var deck = this.getQuery();

        this.get(deck);
    };

    this.getQuery = function () {

        var query = window.location.hash;
        query = query.slice((query.indexOf('?') + 1), query.length);

        pikaDeck.query.store(query);

        pikaDeck.store.get('cart');

        return pikaDeck.store.get('cart');


    };


    this.get = function (deck) {

        $(document).trigger('getting_cards');

        pikaDeck.drawDeckButtonDisabled();

        // TODO: Look at stripping duplicate items from deck here.
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

    this.getCurrent = function () {

        var cart = pikaDeck.store.get('cart');

        if (cart && cart.length > 0) {

            var cartQuery = cart.join('|');

            queryString.removeAll();
            queryString.push('deck', cartQuery);

            this.get(cart);

        } else {

            toastr.warning('No cards have been added to your deck!');

        }

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


}).apply(pikaDeck.ctrl.deck);