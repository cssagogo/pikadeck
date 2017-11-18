pikaDeck.stats = {};

(function() {
    "use strict";

    var _data = {};

    this.init = function() {

        //var deckUnique  = pikaDeck.store.get('deckUnique');
        var deckList    = pikaDeck.store.get('deckList');
        var deckCounts  = pikaDeck.store.get('deckCounts');
        var cardsLookup = pikaDeck.store.get('cardsLookup');
        var sets        = pikaDeck.store.get('sets');


        _data = _getStats(deckList, cardsLookup, deckCounts, sets);


        pikaDeck.store.push('deckStats', _data);

        console.log(pikaDeck.store.get('deckStats'));


    };

    var _getStats = function (deckList, cardsLookup, deckCounts, sets) {

        var pctgoList = {
            energy: [],
            pokemon: [],
            trainer: [],
        };

        var counts = {
            artist: {},
            rarity: {},
            series: {},
            set: {},
            subtype: {},
            supertype: {},
            type: {},
            tournament: {},
            resistances: {},
            weaknesses: {},
            attacks: {}

        };

        var types = [];

        var hp = 0;


        for (var i = 0; i < deckList.length; i++) {

            var id      = deckList[i];
            var card    = cardsLookup[id];
            var count   = deckCounts[id];

            if (card) {

                var setData = sets[card.setCode];
                var supertype = (card.supertype).toLowerCase().replace('é','e');
                var item = count + ' ' + card.name + ' ' + setData.ptcgoCode;


                //= Tournament Set Types
                if (setData.standardLegal) {
                    counts.tournament.Standard = counts.tournament.Standard || 0;
                    counts.tournament.Standard += 1;
                } else if (setData.expandedLegal) {
                    counts.tournament.Expanded = counts.tournament.Expanded || 0;
                    counts.tournament.Expanded += 1;
                } else {
                    counts.tournament.Unlimited = counts.tournament.Unlimited || 0;
                    counts.tournament.Unlimited += 1;
                }

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
                    counts.artist[card.artist] = counts.artist[card.artist] || 0;
                    counts.artist[card.artist] += 1;
                }

                //= Artist Counts
                if (card.rarity) {
                    counts.rarity[card.rarity] = counts.rarity[card.rarity] || 0;
                    counts.rarity[card.rarity] += 1;
                }

                //= Series Counts
                if (card.series) {
                    counts.series[card.series] = counts.series[card.series] || 0;
                    counts.series[card.series] += 1;
                }

                //= Set Counts
                if (card.set) {
                    counts.set[card.set] = counts.set[card.set] || 0;
                    counts.set[card.set] += 1;
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
                        counts.weaknesses[type1] = counts.weaknesses[type1] || 0;
                        counts.weaknesses[type1] += 1;
                    }
                }

                //= Resistances
                if (card.resistances) {
                    for (var b = 0; b < card.resistances.length; b++) {
                        var type2 = card.resistances[b].type;
                        counts.resistances[type2] = counts.resistances[type2] || 0;
                        counts.resistances[type2] += 1;
                    }
                }


                // if (card.subtype === 'EX') {
                //     debugger;
                // }

                //= Attack Cost
                if (card.attacks) {
                    for (var c = 0; c < card.attacks.length; c++) {
                        var cost = card.attacks[c].cost;

                        for (var d = 0; d < cost.length; d++) {
                            counts.attacks[cost[d]] = counts.attacks[cost[d]] || 0;
                            counts.attacks[cost[d]] += 1;
                        }

                    }
                }



            }

        }


        //= Types
        counts.type = pikaDeck.getCounts(types);
        types = pikaDeck.getUniqueList(types);



        return {
            counts: counts,
            hp: hp,
            pctgoList: pctgoList,
            types: types
        };

    };

}).apply(pikaDeck.stats);