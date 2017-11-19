pikaDeck.stats = {};

(function() {
    "use strict";

    var _data = {};

    this.init = function() {

        var deckList    = pikaDeck.store.get('deckList');
        var deckCounts  = pikaDeck.store.get('deckCounts');
        var cardsLookup = pikaDeck.store.get('cardsLookup');
        var sets        = pikaDeck.store.get('sets');

        _data = _getStats(deckList, cardsLookup, deckCounts, sets);

        pikaDeck.store.push('deckStats', _data);

    };

    var _getStats = function (deckList, cardsLookup, deckCounts, sets) {

        var pctgoList = {
            energy: [],
            pokemon: [],
            trainer: []
        };

        var counts = {
            rarity: {},
            setCode: {},
            subtype: {},
            supertype: {}
        };

        var types = [];
        var hp = 0;
        var artists = [];
        var weaknesses = [];
        var resistances = [];

        for (var i = 0; i < deckList.length; i++) {

            var id      = deckList[i];
            var card    = cardsLookup[id];
            var count   = deckCounts[id];

            if (card) {

                var setData = sets[card.setCode];
                var supertype = (card.supertype).toLowerCase().replace('é','e');
                var item = count + ' ' + card.name + ' ' + setData.ptcgoCode;

                //= Deck List
                if (pctgoList[supertype].indexOf(item) < 0) {
                    pctgoList[supertype].push(item);
                    pctgoList[supertype].sort().reverse();
                }

                //= Supertype Counts
                counts.supertype[supertype] = counts.supertype[supertype] || 0;
                counts.supertype[supertype] += 1;

                //= Subtype Counts
                if (card.subtype) {
                    counts.subtype[card.subtype] = counts.subtype[card.subtype] || 0;
                    counts.subtype[card.subtype] += 1;
                }

                //= Artist Counts
                if (card.artist) {
                    artists.push(card.artist);
                }

                //= Artist Counts
                if (card.rarity) {
                    counts.rarity[card.rarity] = counts.rarity[card.rarity] || 0;
                    counts.rarity[card.rarity] += 1;
                }

                //= Set Code Counts
                if (card.setCode) {
                    counts.setCode[card.setCode] = counts.setCode[card.setCode] || 0;
                    counts.setCode[card.setCode] += 1;
                }

                //= Types Counts
                if (card.types) {
                    types = types.concat(card.types);
                }

                //= hp
                if (card.hp) {
                    hp += (card.hp * 1);
                }

                //= Weaknesses
                if (card.weaknesses) {
                    for (var a = 0; a < card.weaknesses.length; a++) {
                        var type1 = card.weaknesses[a].type;
                        weaknesses.push(type1);
                    }
                }

                //= Resistances
                if (card.resistances) {
                    for (var b = 0; b < card.resistances.length; b++) {
                        var type2 = card.resistances[b].type;
                        resistances.push(type2);
                    }
                }

            }

        }

        counts.setCode = pikaDeck.sortObjects(pikaDeck.objectToObjectArray(counts.setCode), 'value');
        counts.rarity = pikaDeck.sortObjects(pikaDeck.objectToObjectArray(counts.rarity), 'value');
        counts.subtype = pikaDeck.sortObjects(pikaDeck.objectToObjectArray(counts.subtype), 'value');

        return {
            artists:        pikaDeck.getUniqueList(artists),
            supertypes:     counts.supertype,
            hp:             hp,
            pctgoList:      pctgoList,
            rarity:         counts.rarity,
            resistances:    pikaDeck.getUniqueList(resistances),
            setCode:        counts.setCode,
            subtypes:       counts.subtype,
            types:          pikaDeck.getUniqueList(types),
            weaknesses:     pikaDeck.getUniqueList(weaknesses)
        };

    };




}).apply(pikaDeck.stats);