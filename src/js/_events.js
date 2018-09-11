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

            var query = pikaDeck.store.get('query');
            pikaDeck.search.drawSearchOptionsCount(query);

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

        $(document).on('deckStats.draw_done', function() {
            pikaDeck.chart.supertype();
        });

        $(document).on('pdfDeck.draw_done', function() {
            pikaDeck.pdf.resetButton($('button#print_deck'));
        });

    };

    var _storeEvents = function () {

        $(document).on('deckDataUrls.store_updated', function () {
            pikaDeck.store.remove('deckDataUrlsIds');
            pikaDeck.store.remove('deckDataUrlsTemp');

            pikaDeck.pdf.printDeckPDF();
        });

        $(document).on('deckDataUrlsIds.store_updated', function () {
            pikaDeck.pdf.drawLoadingCounter();
        });

        $(document).on('tournamentSets.store_updated', function () {
            // TODO: Consider how best to handle different routes.
            pikaDeck.ctrl.deck.storeDeck();
            pikaDeck.ctrl.index.get();
        });

        $(document).on('deckUnique.store_updated', function (e, key, value) {
            pikaDeck.ctrl.deck.get(value);
        });

        $(document).on('deckList.store_updated', function (e, key, value) {

            localStorage.setItem('deckList', value);
            pikaDeck.ctrl.deck.drawCount(value);
        });

        $(document).on('deck.store_updated', function (e, key, value) {
            var cardsLookup = pikaDeck.getLookupTable(value, 'id');
            pikaDeck.store.push('cardsLookup', cardsLookup);
        });

        $(document).on('cardsLookup.store_updated', function () {

            var route = pikaDeck.store.get('route');

            if (route === 'deck') {

                // Create and store deck stats...
                pikaDeck.stats.init();

                // Create and store ordered deck...
                pikaDeck.ctrl.deck.getDeckSorted();
            }

        });

        $(document).on('deckSorted.store_updated', function (e, key, value) {

            pikaDeck.ctrl.deck.getDeckSortedFull();

            pikaDeck.ctrl.deck.draw(value);
        });

        $(document).on('deckStats.store_updated', function (e, key, value) {
            pikaDeck.ctrl.deck.drawStats(value);
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

        // $(document).on('query.store_updated', function (e, key, value) {});
        // $(document).on('cart.store_updated', function (e, key) {});
        // $(document).on('query.store_updated', function (e, key, value) {});
        // $(document).on('route.store_updated', function (e, key) {});
        // $(document).on('tournamentSets.store_updated', function (e, key) {});

    };

    var _clickEvents = function () {



        $(document).on('click', 'button#search_cards', function() {
            pikaDeck.ctrl.index.view();
        });

        $(document).on('keypress', 'input#poke_search', function (e) {
            if(e.which === 13){
                pikaDeck.ctrl.index.view();
            }
        });

        $(document).on('click', 'button#view_deck', function() {

            // TODO: This is duplicated in clear deck.
            var deckList = pikaDeck.store.get('deckList');
            if (!deckList) {
              toastr.warning('You have no cards in your deck yet.');
              return;
            }

            pikaDeck.ctrl.deck.view();

        });

        $(document).on('click', 'button#clear_deck', function (e) {

            e.preventDefault();


            // TODO: This is duplicated in view deck.
            var deckList = pikaDeck.store.get('deckList');
            if (!deckList) {
              toastr.warning('You have no cards in your deck yet.');
              return;
            }

            localStorage.removeItem('deckList');
            window.location.href = '/';

        });

        $(document).on('click', 'button#print_deck', function() {

            pikaDeck.pdf.loadingButton($(this));

            pikaDeck.pdf.printDeck();

        });

        $(document).on('click', 'a[data-info]', function() {
            var id = $(this).data().info;
            pikaDeck.drawInfoModal(id);
        });

        $(document).on('click', 'button[data-add]', function() {
            pikaDeck.addToDeck($(this));
        });

        $(document).on('click', 'button[data-remove]', function() {
            var id = $(this).data().remove;
            pikaDeck.removeFromDeck(id);
        });

        $(document).on('click', 'button[data-print]', function() {
            var id = $(this).data().print;
            pikaDeck.pdf.printPlaySet(id);
        });

        $(document).on('click', 'button[data-zoom]', function() {
            var id = $(this).data().zoom;
            pikaDeck.drawZoomModal(id);
        });

        $(document).on('click', 'a[href^="/#!"]', function (e) {
            e.preventDefault();
            window.location.href = $(this).attr('href');
            window.location.reload();
        });

        $(window).on('popstate', function () {
            window.location.reload();
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