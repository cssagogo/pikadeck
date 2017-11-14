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

        var cart = pikaDeck.store.get('cart') || [];
        var cards = pikaDeck.store.get('cards');

        var id = $target.data().add;

        var data = cards[id];
        var inCart = this.countInArray(cart, id);
        var isBasicEnergy = (data.supertype === 'Energy' && data.subtype === 'Basic');

        var isCartMaxReached = cart.length >= 60;
        if (isCartMaxReached) {
            toastr.warning('You have 60 cards selected which is the max allowed within a deck.');
            return;
        }

        var isItemMaxReached = (!isBasicEnergy && inCart >= 4);
        if (isItemMaxReached) {
            toastr.warning('When you are building a deck, you can have only 4 copies of a card with the same name in it, except for basic Energy cards.');
            return;
        }


        // TODO: Look over animate.css docs. Look for reusable way of doing this...
        $target.closest('.card--tile').addClass('fadeOutDownBig animated super-z').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass('fadeOutDownBig animated super-z');
            $(this).addClass('rotateIn animated super-z').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).removeClass('rotateIn animated super-z');
            });
        });


        cart.push(id);

        pikaDeck.store.push('cart', cart);

        inCart = inCart + 1;



        var text = data.name + ' Added';
        if (!isBasicEnergy) {
            text = text + ' <br><small>(' + inCart + ' of 4)</small>';
        } else {
            text = text + ' <br><small>(' + inCart + ' in deck)</small>';
        }

        toastr.success(text);

    };


    this.getParams = function () {

        var data = $('#pika_filters').serializeArray();

        if (data && data.length > 0) {

            var newData = {};

            for (var i = 0; i < data.length; i++) {

                if (newData[data[i].name]) {

                    newData[data[i].name] = newData[data[i].name] + '|' + data[i].value;

                } else {

                    if (data[i].value) {

                        newData[data[i].name] = data[i].value;

                    }
                }

            }

            newData = $.param(newData, true);

            return newData;

        }

        return null;

    };
    this.drawSearchOptionsCount = function (query) {

        var queryCount = Object.keys(query).length;

        if (queryCount === 1 && !query.name || queryCount >= 2) {

            var count = (query.name) ? queryCount - 1 : queryCount;

            $('#search_options_count').html(' ('+ count +')');

        } else {

            $('#search_options_count').html('');

        }

    };

    // TODO: Pure DOM updates
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

    // TODO: Add Unit Tests
    // ------------------------------------------
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
    this.getDefaultParams = function (standardSets) {

        // SHAME: This is not pretty.
        // TODO: Ugh. Some of the cards in the DB do not include a rarity. So either need to live with it, or
        // Pull back all raritys and then remove common and uncommon cards post get. :(
        // Removing Generations and Evolutions as artwork is ugly ;P
        standardSets = this.removeFromArray(standardSets, 'g1');
        standardSets = this.removeFromArray(standardSets, 'xy12');
        standardSets = standardSets.join('|');

        return 'supertype=Pokemon|Trainer' +
            '&subtype=GX|EX|Mega|Supporter' +
            '&rarity=Rare%20Ultra|Rare%20Holo%20gx|Rare%20Holo%20EX' +
            '&setCode=' + standardSets;

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

}).apply(pikaDeck);


$(function() {
    'use strict';

    pikaDeck.init();

});