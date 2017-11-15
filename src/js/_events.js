pikaDeck.events = {};

(function() {
    "use strict";

    this.init = function() {

        _storeEvents();

        _drawEvents();

        _loadingEvents();

        _clickEvents();

    };

    var _drawEvents = function () {

        $(document).on('view.draw_done', function() {
            var deckList = pikaDeck.store.get('deckList');
            pikaDeck.ctrl.deck.drawCount(deckList);
        });

        $(document).on('set.draw_done', function() {
            var setCode = pikaDeck.store.get('query').setCode || [];
            pikaDeck.search.drawQuerySet(setCode);
        });

        $(document).on('types.draw_done', function() {
            var types = pikaDeck.store.get('query').types || [];
            pikaDeck.search.drawQueryTypes(types);
        });

        $(document).on('subtypes.draw_done', function() {
            var subtype = pikaDeck.store.get('query').subtype || [];
            pikaDeck.search.drawQuerySubtype(subtype);
        });

        $(document).on('supertypes.draw_done', function() {
            var supertype = pikaDeck.store.get('query').supertype || [];
            pikaDeck.search.drawQuerySupertype(supertype);
        });

        //$(document).on('deck.draw_done', function() {});

    };

    var _storeEvents = function () {

        // $(document).on('query.store_updated', function (e, key, value) {
        // });

        $(document).on('tournamentSets.store_updated', function () {
            // TODO: Consider how best to handle different routes.
            pikaDeck.ctrl.deck.storeDeck();
            pikaDeck.ctrl.index.get();
        });

        $(document).on('deckUnique.store_updated', function (e, key, value) {
            pikaDeck.ctrl.deck.get(value);
        });

        $(document).on('deckList.store_updated', function (e, key, value) {
            pikaDeck.ctrl.deck.drawCount(value);
        });

        $(document).on('deck.store_updated', function (e, key, value) {

            //Create and store card lookup table...
            var cardsLookup = pikaDeck.getLookupTable(value, 'id');
            pikaDeck.store.push('cardsLookup', cardsLookup);

            // Create and store deck stats...

            // Create and store ordered deck...

            pikaDeck.ctrl.deck.draw(value);

        });

        $(document).on('cards.store_updated', function (e, key, value) {

            var cardsLookup = pikaDeck.getLookupTable(value, 'id');
            pikaDeck.store.push('cardsLookup', cardsLookup);

            pikaDeck.ctrl.index.draw(value);
        });

        $(document).on('types.store_updated', function (e, key, value) {
            pikaDeck.search.drawTypes(value);
        });

        $(document).on('subtypes.store_updated', function (e, key, value) {
            pikaDeck.search.drawSubtypes(value);
        });

        $(document).on('supertypes.store_updated', function (e, key, value) {
            pikaDeck.search.drawSupertypes(value);
        });

        $(document).on('setsData.store_updated', function (e, key, value) {
            pikaDeck.search.drawSets(value);
        });

        // $(document).on('cardsLookup', function (e, key, value) {
        //     pikaDeck.ctrl.deck.processDeck(value);
        // });

        // $(document).on('cart.store_updated', function (e, key) {
        //     console.log(key);
        // });
        //

        // $(document).on('query.store_updated', function (e, key, value) {
        //     console.log(key);
        //     console.log(value);
        // });

        // $(document).on('route.store_updated', function (e, key) {
        //     console.log(key);
        // });
        //

        // $(document).on('tournamentSets.store_updated', function (e, key) {
        //     console.log(key);
        // });


    };


    var _clickEvents = function () {

        $(document).on('click', 'button#search_cards', function() {
            //pikaDeck.hb.drawView('#hb_view_index');
            pikaDeck.ctrl.index.getSearchResults();
        });

        $(document).on('click', 'button#view_deck', function() {
            var cart = pikaDeck.store.get('cart');
            cart = cart.join('|');
            location.href = "/#!deck?deck=" + cart;
        });

        $(document).on('click', 'a[data-info]', function() {

            // TODO: Move this into a draw statement...
            var id = $(this).data().info;
            var cards = pikaDeck.store.get('cardsLookup');
            var card = cards[id];

            var template = Handlebars.compile($('#hb_card_info').html());
            $('.modal-content', '.modal--info').html(template(card));

        });

        $(document).on('click', 'button[data-add]', function() {
            pikaDeck.addCardToDeck($(this));
        });

        $(document).on('click', 'button[data-print]', function() {

            var id = $(this).data().print;
            var cards = pikaDeck.store.get('cardsLookup');
            var card = cards[id];

            pikaDeck.pdf.printPlaySet(card);

        });

        $(document).on('click', 'button[data-zoom]', function() {

            // TODO: Move this into a draw statement...
            var id = $(this).data().zoom;
            var cards = pikaDeck.store.get('cardsLookup');
            var card = cards[id];

            $('[data-zoomed]', '.modal--zoomed').attr('src', card.imageUrlHiRes);

        });

    };

    var _loadingEvents = function () {

        $(document).on('cards.loading', function () {
            pikaDeck.drawPageLoader($('#index_cards'));
        });

        $(document).on('deck.loading', function () {
            pikaDeck.drawPageLoader($('#deck_cards'));
        });
    };


}).apply(pikaDeck.events);