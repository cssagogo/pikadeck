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


    this.getSearchResults = function () {

        $('#search_options').collapse('hide');

        var params = this.getParams();

        pikaDeck.query.push(params);

        pikaDeck.query.store();

        this.getCards(params);

    };
    this.getCards = function (params) {

        $(document).trigger('getting_cards');

        this.drawDeckButtonEnabled();

        var tournamentSets = pikaDeck.store.get('tournamentSets');

        params = (params) ? params : this.getDefaultParams(tournamentSets.standard);

        // TODO: Pass params as data...
        var endpoint = this.apiPath + 'cards' + '?pageSize=60&' + params;

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
    this.drawCards = function (data) {

        if (data.length !== 0) {

            var template = Handlebars.compile($('#hb_card_tile').html());
            $('#poke_cards').html(template(data));

        } else {

            var nodata = Handlebars.compile($('#hb_no_results').html());
            $('#poke_cards').html(nodata());

        }

        $(document).trigger('draw_cards_done');

    };



    this.getSets = function () {

        var that = this;

        // If exists in localstore...
        var data = store.get('sets') || [];
        if (data.sets && data.sets.length > 0) {

            // Create lookup table...
            var lookup = this.getLookupTable(data.sets, 'code');

            // Get standard sets...
            // TODO: Consider a combined loop with getLookupTable...
            var tournamentSets = this.getTournamentSets(data.sets);

            $(document).trigger('get_sets_done', [data.sets, lookup, tournamentSets]);
            return;
        }

        // Else get new data...
        $.ajax({
            dataType: 'json',
            url: this.apiPath + 'sets',
            success: function(data) {

                // Show latest set first...
                if (data && data.sets && data.sets.length > 0) {
                    data.sets.reverse();
                }

                // Save response to localStore...
                store.set('sets', data);

                // Call getSets again, data should be in localStore now...
                // TODO: This is a bit dangerous.  Need to consider better method.
                that.getSets();

            },
            error: function(xhr, status, error) {
                console.log([xhr, status, error]);
            }
        });

    };
    this.getSetOptions = function (data) {

        var items = [];

        $.each(data, function(key, val) {
            items.push('<option value="' + val.code + '">' + val.name + ' (' + val.ptcgoCode + ')</option>');
        });

        return items.join('');

    };
    this.getSelect2SetOptions = function(state) {

        if (!state.id) {
            return state.text;
        }

        var baseUrl = 'https://images.pokemontcg.io';

        var html = $(
            '<span class="img-set">' +
            '<span><img src="' + baseUrl + '/' + state.element.value.toLowerCase() + '/symbol.png" /></span> ' +
            state.text +
            '</span>'
        );

        return html;
    };
    this.drawSets = function (data) {

        var items = this.getSetOptions(data);

        $('#poke_set').html(items).select2({
            placeholder: 'Select a set',
            allowClear: true,
            templateResult: this.getSelect2SetOptions,
            templateSelection: this.getSelect2SetOptions
        });

        $(document).trigger('draw_sets_done');

    };
    this.getSimpleData = function (endpoint) {

        var that = this;

        // If exists in localstore...
        var data = store.get(endpoint) || [];
        if (data[endpoint] && data[endpoint].length > 0) {

            $(document).trigger('get_' + endpoint + '_done', [data[endpoint]]);
            return;

        }

        $.ajax({
            dataType: 'json',
            url: this.apiPath + endpoint,
            success: function(data) {

                // Save response to localStore...
                store.set(endpoint, data);

                // Call getSets again, data should be in localStore now...
                // TODO: This is a bit dangerous.  Need to consider better method.
                that.getSimpleData(endpoint);

            },
            error: function(xhr, status, error) {
                console.log([xhr, status, error]);
            }
        });

    };
    this.drawTypes = function (items) {

        $('#poke_type').html(items).select2({
            placeholder: 'Select a Type',
            allowClear: true
        });

        $(document).trigger('draw_types_done');

    };
    this.getTypeOptions = function (data) {

        if (data && data.length > 0) {

            var items = [];

            for (var i = 0; i < data.length; i++) {
                items.push('<option value="' + data[i] + '">' + data[i] + '</option>');
            }

            return items.join('');
        }

        return null;

    };
    this.drawSelectedTypesFromQuery = function (types) {
        $('#poke_type').val(types).trigger('change');
    };
    this.drawSubtypes = function (items) {

        $('#poke_subtype').html(items).select2({
            placeholder: 'Select a Subtype',
            allowClear: true
        });

        $(document).trigger('draw_subtypes_done');

    };
    this.drawSelectedSubtypesFromQuery = function (subtypes) {
        $('#poke_subtype').val(subtypes).trigger('change');
    };
    this.drawSupertypes = function (items) {

        $('#poke_supertype').html(items).select2({
            placeholder: 'Select a Supertype',
            allowClear: true
        });

        $(document).trigger('draw_supertypes_done');

    };
    this.drawSelectedSupertypesFromQuery = function (supertypes) {
        $('#poke_supertype').val(supertypes).trigger('change');
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

        $('.count', '#view_deck').html('(' + cart.length + ')');

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