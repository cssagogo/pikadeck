pikaDeck.events = {};

(function() {
    "use strict";

    this.init = function() {

        console.log('Binding Events');

        _clickEvents();

        $(document).on('store_query_done', function(e, query) {

            $('#poke_search').val(query.name);

            if (query.deck) {

                pikaDeck.store.push('cart', query.deck);

                delete query.deck;

                pikaDeck.store.push('query', query);

                var cart = pikaDeck.store.get('cart');

                $('.count', '#view_deck').html('(' + cart.length + ')');
            }

            pikaDeck.drawSearchOptionsCount(query);

            pikaDeck.getSimpleData('types');
            pikaDeck.getSimpleData('subtypes');
            pikaDeck.getSimpleData('supertypes');
            pikaDeck.getSets();

        });

        $(document).on('draw_sets_done', function() {

            var params = pikaDeck.query.get();

            if (params.indexOf('deck=') !== -1) {

                var cart = pikaDeck.store.get('cart');

                pikaDeck.getDeck(cart);

            } else {

                pikaDeck.getCards(params);

                var query = pikaDeck.store.get('query');

                $('#poke_set').val(query.setCode).trigger('change');

            }

        });

        $(document).on('get_sets_done', function(e, data, lookup, tournamentSets) {

            pikaDeck.store.push('sets', lookup);
            pikaDeck.store.push('tournamentSets', tournamentSets);

            pikaDeck.drawSets(data);

        });

        $(document).on('get_types_done', function(e, data) {
            var items = pikaDeck.getTypeOptions(data);
            if (items) {
                pikaDeck.drawTypes(items);
            }
        });

        $(document).on('get_subtypes_done', function(e, data) {
            var items = pikaDeck.getTypeOptions(data);
            if (items) {
                pikaDeck.drawSubtypes(items);
            }
        });

        $(document).on('get_supertypes_done', function(e, data) {
            var items = pikaDeck.getTypeOptions(data);
            if (items) {
                pikaDeck.drawSupertypes(items);
            }
        });

        $(document).on('get_cards_done', function(e, data, lookup) {
            pikaDeck.store.push('cards', lookup);
            pikaDeck.drawCards(data);
        });

        $(document).on('draw_types_done', function() {
            var query = pikaDeck.store.get('query');
            pikaDeck.drawSelectedTypesFromQuery(query.types);
        });

        $(document).on('draw_subtypes_done', function() {
            var query = pikaDeck.store.get('query');
            pikaDeck.drawSelectedSubtypesFromQuery(query.subtype);
        });

        $(document).on('draw_supertypes_done', function() {
            var query = pikaDeck.store.get('query');
            pikaDeck.drawSelectedSupertypesFromQuery(query.supertype);
        });

        $(document).on('getting_cards', function () {
            pikaDeck.drawPageLoader($('#poke_cards'));
        });

    };

    var _clickEvents = function () {

        $(document).on('click', 'button#pika_search', function() {
            pikaDeck.getSearchResults();
        });

        $(document).on('click', 'button#view_deck', function() {
            pikaDeck.getCurrentDeck();
        });

        $(document).on('click', 'button[data-add]', function() {
            pikaDeck.addCardToDeck($(this));
        });

        $(document).on('click', 'button[data-print]', function() {

            var id = $(this).data().print;
            var cards = pikaDeck.store.get('cards');
            var card = cards[id];

            pikaDeck.pdf.printPlaySet(card);

        });

        $(document).on('click', '[data-info]', function() {

            // TODO: Move this into a draw statement...
            var id = $(this).data().info;
            var cards = pikaDeck.store.get('cards');
            var card = cards[id];

            var template = Handlebars.compile($('#hb_card_info').html());
            $('.modal-content', '.modal--info').html(template(card));

        });

        $(document).on('click', '[data-zoom]', function() {

            // TODO: Move this into a draw statement...
            var id = $(this).data().zoom;
            var cards = pikaDeck.store.get('cards');
            var card = cards[id];

            $('[data-zoomed]', '.modal--zoomed').attr('src', card.imageUrlHiRes);

        });

    };

}).apply(pikaDeck.events);