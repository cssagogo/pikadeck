pikaDeck.pdf = {};

(function() {
    "use strict";

    this.printDeck = function(deck) {
        console.log(deck);
    };

    this.printPlaySet = function (card) {

        var imgUrl = card.imageUrlHiRes;

        _imgToBase64(imgUrl, function(dataUrl) {

            var pageWidth   = 8.5;
            var pageHeight  = 11;
            var cardHeight  = 3.46;
            var cardWidth   = 2.48;
            var gutter      = 0.01;

            var topMargin   = (pageHeight - (cardHeight * 3) - (gutter * 2)) / 2;
            var leftMargin  = (pageWidth - (cardWidth * 3) - (gutter * 2)) / 2;

            var row1 = topMargin;
            var row2 = row1 + cardHeight + gutter;
            var row3 = row2 + cardHeight + gutter;

            var col1 = leftMargin;
            var col2 = col1 + cardWidth + gutter;
            var col3 = col2 + cardWidth + gutter;

            var doc = new jsPDF({
                orientation: 'portrait',
                unit: 'in',
                format: [pageHeight, pageWidth]
            });

            //doc.text('Pokemon Name Here', leftMargin, topMargin);

            doc.addImage(dataUrl, 'PNG', col1, row1, cardWidth, cardHeight);
            doc.addImage(dataUrl, 'PNG', col2, row1, cardWidth, cardHeight);
            doc.addImage(dataUrl, 'PNG', col3, row1, cardWidth, cardHeight);

            doc.addImage(dataUrl, 'PNG', col1, row2, cardWidth, cardHeight);
            doc.addImage(dataUrl, 'PNG', col2, row2, cardWidth, cardHeight);
            doc.addImage(dataUrl, 'PNG', col3, row2, cardWidth, cardHeight);

            doc.addImage(dataUrl, 'PNG', col1, row3, cardWidth, cardHeight);
            doc.addImage(dataUrl, 'PNG', col2, row3, cardWidth, cardHeight);
            doc.addImage(dataUrl, 'PNG', col3, row3, cardWidth, cardHeight);

            //doc.addPage();

            // doc.setDrawColor(255, 0, 0) // draw red lines
            //
            // doc.setLineWidth(0.1)
            // doc.line(100, 20, 100, 60) // vertical line

            doc.save('PikaDeck.pdf');

            //$(document).trigger('card_ready', [dataUrl]);

        });

    };

    var _imgToBase64 = function (imgUrl, callback) {

        var xhr = new XMLHttpRequest();

        xhr.onload = function() {

            var reader = new FileReader();

            reader.onloadend = function() {

                callback(reader.result);

            };

            reader.readAsDataURL(xhr.response);
        };

        xhr.open('GET', imgUrl);

        xhr.responseType = 'blob';

        xhr.send();

    };


    // getDeckImages: function (deck) {
    //
    //     //$(document).trigger('getting_cards');
    //
    //     var that = this;
    //     var promises = [];
    //     var cards = [];
    //
    //     for (var i = 0; i < deck.length; i++){
    //
    //         var endpoint = this.apiPath + 'cards/' + deck[i];
    //
    //         var request = $.getJSON(endpoint, function (data) {
    //
    //             that.lookup.cards = that.lookup.cards || {};
    //
    //             that.lookup.cards[data.card.id] = data.card;
    //
    //             cards.push(data.card);
    //
    //             //$(document).trigger('get_cards_done', [data.cards, lookup]);
    //
    //         });
    //
    //         promises.push(request);
    //     }
    //
    //     $.when.apply(null, promises).done(function(){
    //
    //         that.drawCards(cards);
    //
    //     });
    //
    // }


}).apply(pikaDeck.pdf);






