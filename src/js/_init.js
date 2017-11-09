// TODO: Look into sorting cards by number.
// TODO: Using local store across sessions is problematic.  Need to flush localstore on startup?

var pikaDeck = {
    apiPath: 'https://api.pokemontcg.io/v1/',
    lookup: {},
    init: function() {

        this.router().init();

        this.initToaster();
        this.initBootstrap();
        this.initHandlebarsHelpers();
        this.bindEvents();
        this.query().store();

    },
    getSearchResults: function () {

        $('#search_options').collapse('hide');

        var params = this.getParams();

        this.query().push(params);

        this.query().store();

        this.getCards(params);

    },
    getCurrentDeck: function () {

        if (this.lookup && this.lookup.cart && this.lookup.cart.length > 0) {

            var cart = this.lookup.cart.join('|');

            queryString.removeAll();
            queryString.push('deck', cart);

            this.getDeck(this.lookup.cart);

        } else {

            toastr.warning('No cards have been added to your deck!');

        }

    },

    bindEvents: function() {

        var that = this;

        $(document).on('click', 'button#pika_search', function() {
            that.getSearchResults();
        });

        $(document).on('click', 'button#view_deck', function() {
            that.getCurrentDeck();
        });

        $(document).on('store_query_done', function(e, query) {

            $('#poke_search').val(that.lookup.query.name);

            if (that.lookup.query.deck) {
                that.lookup.cart = that.lookup.query.deck || [];
                delete that.lookup.query.deck;
                $('.count', '#view_deck').html('(' + that.lookup.cart.length + ')');
            }

            that.drawSearchOptionsCount(query);

            that.getSimpleData('types');
            that.getSimpleData('subtypes');
            that.getSimpleData('supertypes');

            that.getSets();

        });

        $(document).on('draw_sets_done', function() {

            var params = that.query().get();

            if (params.indexOf('deck=') !== -1) {

                that.getDeck(that.lookup.cart);

            } else {

                that.getCards(params);
                $('#poke_set').val(that.lookup.query.setCode).trigger('change');

            }

        });

        $(document).on('click', 'button[data-add]', function() {
            that.addCardToDeck($(this));
        });

        $(document).on('click', 'button[data-print]', function() {
            var card = pikaDeck.lookup.cards[$(this).data().print];
            that.pdf().printPlaySet(card);
        });

        $(document).on('click', '[data-info]', function() {

            // TODO: Move this into a draw statement...
            var id = $(this).data().info;
            var data = that.lookup.cards[id];

            var template = Handlebars.compile($('#hb_card_info').html());
            $('.modal-content', '.modal--info').html(template(data));

        });

        $(document).on('click', '[data-zoom]', function() {

            var id = $(this).data().zoom;
            var imageUrlHiRes = that.lookup.cards[id].imageUrlHiRes;
            $('[data-zoomed]', '.modal--zoomed').attr('src', imageUrlHiRes);

        });

        $(document).on('get_sets_done', function(e, data, lookup, tournamentSets) {
            that.lookup.sets = lookup;
            that.lookup.tournamentSets = tournamentSets;
            that.drawSets(data);

        });

        $(document).on('get_types_done', function(e, data) {
            var items = that.getTypeOptions(data);
            if (items) {
                that.drawTypes(items);
            }
        });

        $(document).on('get_subtypes_done', function(e, data) {
            var items = that.getTypeOptions(data);
            if (items) {
                that.drawSubtypes(items);
            }
        });

        $(document).on('get_supertypes_done', function(e, data) {
            var items = that.getTypeOptions(data);
            if (items) {
                that.drawSupertypes(items);
            }
        });

        $(document).on('get_cards_done', function(e, data, lookup) {
            that.lookup.cards = lookup;
            that.drawCards(data);
        });



        $(document).on('draw_types_done', function() {
            that.drawSelectedTypesFromQuery(that.lookup.query.types);
        });

        $(document).on('draw_subtypes_done', function() {
            that.drawSelectedSubtypesFromQuery(that.lookup.query.subtype);
        });

        $(document).on('draw_supertypes_done', function() {
            that.drawSelectedSupertypesFromQuery(that.lookup.query.supertype);
        });

        $(document).on('getting_cards', function () {
            that.drawPageLoader($('#poke_cards'));
        });

    },




    addCardToDeck: function ($target) {

        this.lookup.cart = this.lookup.cart || [];

        var id = $target.data().add;

        var data = this.lookup.cards[id];
        var inCart = this.countInArray(this.lookup.cart, id);
        var isBasicEnergy = (data.supertype === 'Energy' && data.subtype === 'Basic');

        var isCartMaxReached = this.lookup.cart.length >= 60;
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


        this.lookup.cart.push(id);
        inCart = inCart + 1;

        $('.count', '#view_deck').html('(' + this.lookup.cart.length + ')');

        var text = data.name + ' Added';
        if (!isBasicEnergy) {
            text = text + ' <br><small>(' + inCart + ' of 4)</small>';
        } else {
            text = text + ' <br><small>(' + inCart + ' in deck)</small>';
        }

        toastr.success(text);

    },

    getSets: function () {

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

    },
    getSimpleData: function (endpoint) {

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

    },
    getCards: function (params) {

        $(document).trigger('getting_cards');

        this.drawDeckButtonEnabled();

        params = (params) ? params : this.getDefaultParams(this.lookup.tournamentSets.standard);

        var that = this;


        // TODO: Pass params as data...
        var endpoint = this.apiPath + 'cards' + '?pageSize=60&' + params;


        // Else get new data...
        $.ajax({
            dataType: 'json',
            url: endpoint,
            success: function(data) {

                // Create lookup table...
                var lookup = that.getLookupTable(data.cards, 'id');

                $(document).trigger('get_cards_done', [data.cards, lookup]);

            },
            error: function(xhr, status, error) {
                console.log([xhr, status, error]);
            }
        });

    },
    getDeck: function (deck) {

        $(document).trigger('getting_cards');

        this.drawDeckButtonDisabled();

        var that = this;

        // TODO: Look at stripping duplicate items from deck here.
        // TODO: Look into how to handle when no IDs are passed in.
        deck = (deck) ? deck.join('|') : '';

        // TODO: Pass params as data...
        var endpoint = this.apiPath + 'cards?id=' + deck;

        // Else get new data...
        $.ajax({
            dataType: 'json',
            url: endpoint,
            success: function(data) {

                // Create lookup table...
                var lookup = that.getLookupTable(data.cards, 'id');

                $(document).trigger('get_cards_done', [data.cards, lookup]);

                //that.drawCards(data.cards);

            },
            error: function(xhr, status, error) {
                console.log([xhr, status, error]);
            }
        });

    },


    getParams: function () {

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

    },



    drawSets: function (data) {

        var items = this.getSetOptions(data);

        $('#poke_set').html(items).select2({
            placeholder: 'Select a set',
            allowClear: true,
            templateResult: this.getSelect2SetOptions,
            templateSelection: this.getSelect2SetOptions
        });

        $(document).trigger('draw_sets_done');

    },
    drawCards: function (data) {

        if (data.length !== 0) {

            var template = Handlebars.compile($('#hb_card_tile').html());
            $('#poke_cards').html(template(data));

        } else {

            var nodata = Handlebars.compile($('#hp_no_results').html());
            $('#poke_cards').html(nodata());

        }

        $(document).trigger('draw_cards_done');

    },
    drawSearchOptionsCount: function (query) {

        var queryCount = Object.keys(query).length;

        if (queryCount === 1 && !query.name || queryCount >= 2) {

            var count = (query.name) ? queryCount - 1 : queryCount;

            $('#search_options_count').html(' ('+ count +')');

        } else {

            $('#search_options_count').html('');

        }

    },

    // TODO: Pure DOM updates
    // ------------------------------------------
    drawDeckButtonDisabled: function () {

        $('button#view_deck')
            .attr('disabled', 'disabled')
            .removeClass('btn-primary btn--icon-tada')
            .addClass('btn-secondary');

    },
    drawDeckButtonEnabled: function () {

        $('button#view_deck')
            .removeAttr('disabled')
            .removeClass('btn-secondary')
            .addClass('btn-primary btn--icon-tada');

    },
    drawSelectedTypesFromQuery: function (types) {
        $('#poke_type').val(types).trigger('change');
    },
    drawSelectedSubtypesFromQuery: function (subtypes) {
        $('#poke_subtype').val(subtypes).trigger('change');
    },
    drawSelectedSupertypesFromQuery: function (supertypes) {
        $('#poke_supertype').val(supertypes).trigger('change');
    },
    drawTypes: function (items) {

        $('#poke_type').html(items).select2({
            placeholder: 'Select a Type',
            allowClear: true
        });

        $(document).trigger('draw_types_done');

    },
    drawSubtypes: function (items) {

        $('#poke_subtype').html(items).select2({
            placeholder: 'Select a Subtype',
            allowClear: true
        });

        $(document).trigger('draw_subtypes_done');

    },
    drawSupertypes: function (items) {

        $('#poke_supertype').html(items).select2({
            placeholder: 'Select a Supertype',
            allowClear: true
        });

        $(document).trigger('draw_supertypes_done');

    },
    drawPageLoader: function ($target) {
        var loader = Handlebars.compile($('#hp_loading_cards').html());
        $target.html(loader());
    },


    initHandlebarsHelpers: function() {

        var that = this;

        Handlebars.registerHelper('energyType', function(type) {

            type = type.toLowerCase();

            type = Handlebars.Utils.escapeExpression(type);

            var result = '<i class="icon-energy icon-' + type + '"></i>';

            return new Handlebars.SafeString(result);

        });

        Handlebars.registerHelper('setData', function(setCode, key) {

            setCode = Handlebars.Utils.escapeExpression(setCode);
            key = Handlebars.Utils.escapeExpression(key);

            // TODO: Should check for existence of nodes in object...
            var value = that.lookup.sets[setCode][key];

            return new Handlebars.SafeString(value);
        });

        Handlebars.registerHelper('tournamentType', function(setCode) {

            setCode = Handlebars.Utils.escapeExpression(setCode);

            // TODO: Should check for existence of nodes in object...
            var standardLegal = that.lookup.sets[setCode].standardLegal;
            var expandedLegal = that.lookup.sets[setCode].expandedLegal;

            var value = (standardLegal) ? 'Standard' : (expandedLegal) ? 'Expanded' : 'Unlimited';

            return new Handlebars.SafeString(value);
        });

        Handlebars.registerHelper('setSymbolUrl', function(setCode) {

            setCode = Handlebars.Utils.escapeExpression(setCode);

            // TODO: Should check for existence of nodes in object...
            var symbolUrl = that.lookup.sets[setCode].symbolUrl;

            return new Handlebars.SafeString(symbolUrl);
        });

        Handlebars.registerHelper('ifAny', function(v1, v2, v3, options) {
            return (v1 || v2 || v3) ? options.fn(this) : options.inverse(this);
        });

    },
    initToaster: function () {

        toastr.options = {
            'closeButton': true,
            'debug': false,
            'newestOnTop': false,
            'progressBar': false,
            'positionClass': 'toast-bottom-right',
            'preventDuplicates': false,
            'onclick': null,
            'showDuration': '300',
            'hideDuration': '1000',
            'timeOut': '5000',
            'extendedTimeOut': '1000',
            'showEasing': 'swing',
            'hideEasing': 'linear',
            'showMethod': 'fadeIn',
            'hideMethod': 'fadeOut'
        };

    },
    initBootstrap: function () {

        $('[data-toggle="tooltip"]').tooltip();

    },





    // TODO: Add Unit Tests
    // ------------------------------------------
    getLookupTable: function (data, lookupKey) {

        var lookup = {};

        for (var i = 0; i < data.length; i++) {
            lookup[data[i][lookupKey]] = data[i];
        }

        return lookup;

    },
    getTournamentSets: function (data) {

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

    },
    getDefaultParams: function (standardSets) {

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

    },
    getTypeOptions: function (data) {

        if (data && data.length > 0) {

            var items = [];

            for (var i = 0; i < data.length; i++) {
                items.push('<option value="' + data[i] + '">' + data[i] + '</option>');
            }

            return items.join('');
        }

        return null;

    },
    getSetOptions: function (data) {

        var items = [];

        $.each(data, function(key, val) {
            items.push('<option value="' + val.code + '">' + val.name + ' (' + val.ptcgoCode + ')</option>');
        });

        return items.join('');

    },
    getSelect2SetOptions: function(state) {

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
    },

    countInArray: function (array, what) {
        var count = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i] === what) {
                count++;
            }
        }
        return count;
    },
    removeFromArray: function (data, item) {

        var index = data.indexOf(item);

        if (index > -1) {
            data.splice(index, 1);
        }

        return data;
    }

};

$(function() {
    pikaDeck.init();
});