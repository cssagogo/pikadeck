pikaDeck.events = {};

(function() {
    "use strict";

    this.init = function() {

        _clickEvents();

        _storeEvents();

        _drawEvents();

        _loadingEvents();

        // $(document).on('store_query_done', function(e, query) {
        //
        //     console.log(query);
        //
        //     $('#poke_search').val(query.name);
        //
        //     if (query.deck) {
        //
        //         pikaDeck.store.push('cart', query.deck);
        //
        //         delete query.deck;
        //
        //         pikaDeck.store.push('query', query);
        //
        //         var cart = pikaDeck.store.get('cart');
        //
        //         $('.count', '#view_deck').html('(' + cart.length + ')');
        //     }
        //
        //     pikaDeck.drawSearchOptionsCount(query);
        // });

        // $(document).on('get_cards_done', function(e, data, lookup) {
        //     pikaDeck.store.push('cards', lookup);
        //     pikaDeck.ctrl.index.draw(data);
        // });

        // $(document).on('get_deck_done', function(e, data, lookup) {
        //     pikaDeck.store.push('cards', lookup);
        //     pikaDeck.ctrl.deck.draw(data);
        // });




    };



    var _drawEvents = function () {

        $(document).on('draw_sets_done', function() {
            var setCode = pikaDeck.store.get('query').setCode || [];
            pikaDeck.search.drawQuerySet(setCode);
        });

        $(document).on('draw_types_done', function() {
            var types = pikaDeck.store.get('query').types || [];
            pikaDeck.search.drawQueryTypes(types);
        });

        $(document).on('draw_subtypes_done', function() {
            var subtype = pikaDeck.store.get('query').subtype || [];
            pikaDeck.search.drawQuerySubtype(subtype);
        });

        $(document).on('draw_supertypes_done', function() {
            var supertype = pikaDeck.store.get('query').supertype || [];
            pikaDeck.search.drawQuerySupertype(supertype);
        });

    };

    var _storeEvents = function () {

        $(document).on('query.store_updated', function (e, key, value) {

            var route = pikaDeck.store.get('route');

            if (route === 'deck' && value && value.list && value.list.length > 0) {
                // console.log('Stored List:');
                // console.log(value.list);

                // Store unique list
                pikaDeck.store.push('deck', value.list);

                var deckUnique = pikaDeck.ctrl.deck.getUniqueList(value.list);
                pikaDeck.store.push('deckUnique', deckUnique);

                var deckShort = pikaDeck.ctrl.deck.getShortList(value.list);
                pikaDeck.store.push('deckShort', deckShort);


                // var longList = pikaDeck.ctrl.deck.getLongList(shortList);
                // console.log('Long List:');
                // console.log(longList);



            }


            //console.log('query:' + JSON.stringify(value));




        });

        $(document).on('deck.store_updated', function (e, key, value) {
            pikaDeck.ctrl.deck.draw(value);
        });

        $(document).on('cards.store_updated', function (e, key, value) {
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

        // $(document).on('sets.store_updated', function (e, key, value) {
        //     console.log(key);
        //     console.log(value);
        // });

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

    var _loadingEvents = function () {

        $(document).on('getting_cards', function () {
            pikaDeck.drawPageLoader($('#index_cards'));
        });

        $(document).on('getting_deck', function () {
            pikaDeck.drawPageLoader($('#deck_cards'));
        });
    };


}).apply(pikaDeck.events);