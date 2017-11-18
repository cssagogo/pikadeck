var pikaDeck = pikaDeck || {};

(function() {
    'use strict';

    this.apiPath = 'https://api.pokemontcg.io/v1/';

    this.init = function() {

        pikaDeck.toastr.init();
        pikaDeck.bootstrap.init();
        pikaDeck.hb.init();
        pikaDeck.events.init();
        pikaDeck.router.init();

    };

    this.addCardToDeck = function ($target) {

        var deckList = pikaDeck.store.get('deckList') || [];
        var cardsLookup = pikaDeck.store.get('cardsLookup') || {};

        var id = $target.data().add;

        var data = cardsLookup[id];

        var inCart = this.countInArray(deckList, id);


        var isCartMaxReached = deckList.length >= 60;
        if (isCartMaxReached) {
            toastr.warning('You have 60 cards selected which is the max allowed within a deck.');
            return;
        }

        var isBasicEnergy = (data.supertype === 'Energy' && data.subtype === 'Basic');
        var isItemMaxReached = (!isBasicEnergy && inCart >= 4);
        if (isItemMaxReached) {
            toastr.warning('When you are building a deck, you can have only 4 copies of a card with the same name in it, except for basic Energy cards.');
            return;
        }

        $target.closest('.card--tile').animateCss('fadeOutDownBig super-z', function (el) {
            $(el).animateCss('rotateIn super-z');
        });


        deckList.push(id);

        pikaDeck.store.push('deckList', deckList);

        inCart = inCart + 1;

        var text = data.name + ' Added';
        if (!isBasicEnergy) {
            text = text + ' <br><small>(' + inCart + ' of 4)</small>';
        } else {
            text = text + ' <br><small>(' + inCart + ' in deck)</small>';
        }

        toastr.success(text);

    };

    // Draw Functions
    // ------------------------------------------
    this.drawDeckButtonDisabled = function () {

        $('button#view_deck')
            .attr('disabled', 'disabled')
            .removeClass('btn-primary btn--icon-tada')
            .addClass('btn-secondary');

    };
    this.drawDeckButtonEnabled = function () {

        $('button#view_deck')
            .removeAttr('disabled')
            .removeClass('btn-secondary')
            .addClass('btn-primary btn--icon-tada');

    };
    this.drawPageLoader = function ($target) {
        var loader = Handlebars.compile($('#hb_loading_cards').html());
        $target.html(loader());
    };
    this.drawInfoModal = function (id) {
        var cards = pikaDeck.store.get('cardsLookup');
        var card = cards[id];
        var template = Handlebars.compile($('#hb_card_info').html());
        $('.modal-content', '.modal--info').html(template(card));
    };
    this.drawZoomModal = function (id) {
        var cards = pikaDeck.store.get('cardsLookup');
        var card = cards[id];
        $('[data-zoomed]', '.modal--zoomed').attr('src', card.imageUrlHiRes);
    };

    // Pure Functions
    // ------------------------------------------
    // TODO: Add Unit Tests
    this.getLookupTable = function (data, lookupKey) {

        var lookup = {};

        for (var i = 0; i < data.length; i++) {
            lookup[data[i][lookupKey]] = data[i];
        }

        return lookup;

    };
    this.getTournamentSets = function (data) {

        var standard = [];
        var expanded = [];

        for (var i = 0; i < data.length; i++) {

            if (data[i].standardLegal) {
                standard.push(data[i].code);
            }

            if (data[i].expandedLegal) {
                expanded.push(data[i].code);
            }

        }

        return {
            standard: standard,
            expanded: expanded
        };

    };
    this.countInArray = function (array, what) {
        var count = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i] === what) {
                count++;
            }
        }
        return count;
    };
    this.removeFromArray = function (data, item) {

        var index = data.indexOf(item);

        if (index > -1) {
            data.splice(index, 1);
        }

        return data;
    };

    this.getUniqueList = function (longList) {

        return longList.filter(function(item, pos) {
            return longList.indexOf(item) === pos;
        }).sort();

    };


    this.getCounts = function (list) {

        var counts = {};

        for (var i = 0; i < list.length; i++) {
            var num = list[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }

        return counts;

    };



}).apply(pikaDeck);


$(function() {
    'use strict';

    pikaDeck.init();

});