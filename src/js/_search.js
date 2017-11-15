pikaDeck.search = {};

(function() {
    "use strict";

    this.init = function() {

        pikaDeck.search.getSimpleData('types');
        pikaDeck.search.getSimpleData('subtypes');
        pikaDeck.search.getSimpleData('supertypes');
        pikaDeck.search.getSets();

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

    this.getSets = function () {

        // Else get new data...
        $.ajax({
            dataType: 'json',
            url: pikaDeck.apiPath + 'sets',
            success: function(data) {

                // Show latest set first...
                if (data && data.sets && data.sets.length > 0) {
                    data.sets.reverse();
                }

                pikaDeck.store.push('sets', pikaDeck.getLookupTable(data.sets, 'code'));

                pikaDeck.store.push('tournamentSets', pikaDeck.getTournamentSets(data.sets));

                pikaDeck.store.push('setsData', data.sets);

            },
            error: function(xhr, status, error) {
                console.log([xhr, status, error]);
            }
        });

    };
    this.getSimpleData = function (endpoint) {

        // TODO: Consider checking localStore and load into memory store if it exists and not out of date.
        //If exists in localstore...
        // var data = store.get(endpoint) || [];
        // if (data[endpoint] && data[endpoint].length > 0) {
        //
        //     pikaDeck.store.push(endpoint, data[endpoint]);
        //     return;
        //
        // }

        $.ajax({
            dataType: 'json',
            url: pikaDeck.apiPath + endpoint,
            success: function(data) {

                // TODO: Consider saving to localStore.
                pikaDeck.store.push(endpoint, data[endpoint]);
            },
            error: function(xhr, status, error) {
                console.log([xhr, status, error]);
            }
        });

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
    this.drawSets = function (data) {

        var items = _getSetOptions(data);

        $('#poke_set').html(items).select2({
            placeholder: 'Select a set',
            allowClear: true,
            templateResult: _getSelect2SetOptions,
            templateSelection: _getSelect2SetOptions
        });

        $(document).trigger('set.draw_done');

    };
    this.drawTypes = function (items) {

        items = pikaDeck.search.getTypeOptions(items);

        $('#poke_type').html(items).select2({
            placeholder: 'Select a Type',
            allowClear: true
        });

        $(document).trigger('types.draw_done');

    };
    this.drawSubtypes = function (items) {

        items = pikaDeck.search.getTypeOptions(items);

        $('#poke_subtype').html(items).select2({
            placeholder: 'Select a Subtype',
            allowClear: true
        });

        $(document).trigger('subtypes.draw_done');

    };
    this.drawSupertypes = function (items) {

        items = pikaDeck.search.getTypeOptions(items);

        $('#poke_supertype').html(items).select2({
            placeholder: 'Select a Supertype',
            allowClear: true
        });

        $(document).trigger('supertypes.draw_done');

    };
    this.drawQuerySet = function (setCode) {
        $('#poke_set').val(setCode).trigger('change');
    };
    this.drawQueryTypes = function (types) {
        $('#poke_type').val(types).trigger('change');
    };
    this.drawQuerySubtype = function (subtype) {
        $('#poke_subtype').val(subtype).trigger('change');
    };
    this.drawQuerySupertype = function (supertype) {
        $('#poke_supertype').val(supertype).trigger('change');
    };

    var _getSelect2SetOptions = function(state) {

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
    var _getSetOptions = function (data) {

        var items = [];

        $.each(data, function(key, val) {
            items.push('<option value="' + val.code + '">' + val.name + ' (' + val.ptcgoCode + ')</option>');
        });

        return items.join('');

    };

}).apply(pikaDeck.search);