pikaDeck.stats = {};

(function() {
    "use strict";

    var data = {
        ptcgoDeckList: {
            pokemon: {
                "cardName deckPtcgoCode cardNumber" : 0
            },
            trainer: {},
            energy: {}
        },
        types: {},
        superType: {
            pokemon: 0,
            trainer: 0,
            energy: 0
        },
        subType: {},
        tournament: {
            standard: 0,
            expanded: 0,
            unlimited: 0
        },
        tournamentDeck: '',
        overall: {
            cards: 0,
            hp: 0,
            retreatCost: 0,

            // Will need to consider all attacks on a card
            // to come up with these numbers. Also evolutions?
            convertedEnergyCost: 0,
            engeryCost: {}
        },
        rarity: {},
        weaknesses: {},
        artists: {},
        firstHandChance: {
            superType: {
                pokemon: 0,
                trainer: 0,
                energy: 0
            },
            subType: {}
        }
    };

    this.get = function(deck) {

        console.log('Deck');
        console.log(deck);

        return data;

    };

}).apply(pikaDeck.stats);