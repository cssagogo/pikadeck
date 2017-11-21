pikaDeck.pdf = {};

(function() {
    "use strict";

    var _pdfConfig = {
        pageWidth:   8.5,
        pageHeight:  11,
        cardHeight:  3.46,
        cardWidth:   2.48,
        gutter:      0.01
    };


    this.printDeck = function () {

        var deckSorted  = pikaDeck.store.get('deckSorted');
        var cardsLookup = pikaDeck.store.get('cardsLookup');

        for (var i = 0; i < deckSorted.length; i++) {

            var id = deckSorted[i];
            var img = cardsLookup[id].imageUrlHiRes;

            this.imgToBase64x2(id, img, this);

        }

    };

    this.imgToBase64x2 = function (id, imgUrl, scope) {

        var xhr = new XMLHttpRequest();

        xhr.onload = function() {

            var reader = new FileReader();

            reader.onloadend = function() {

                scope.storeDataUrl(id, reader.result);

            };

            reader.readAsDataURL(xhr.response);
        };

        xhr.open('GET', imgUrl);

        xhr.responseType = 'blob';

        xhr.send();

    };

    this.storeDataUrl = function (scopeId, dataUrl) {

        var deckSorted          = pikaDeck.store.get('deckSorted');
        var deckDataUrlsTemp    = pikaDeck.store.get('deckDataUrlsTemp') || {};
        var deckDataUrlsIds     = pikaDeck.store.get('deckDataUrlsIds') || [];

        deckDataUrlsTemp[scopeId] = dataUrl;
        deckDataUrlsIds.push(scopeId);

        pikaDeck.store.push('deckDataUrlsIds', deckDataUrlsIds);
        pikaDeck.store.push('deckDataUrlsTemp', deckDataUrlsTemp);

        deckDataUrlsIds = pikaDeck.store.get('deckDataUrlsIds');

        if (JSON.stringify(deckDataUrlsIds.sort()) === JSON.stringify(deckSorted.sort())) {
            pikaDeck.store.push('deckDataUrls', deckDataUrlsTemp);
        }

    };

    this.loadingButton = function ($target) {
        $target.data('resetText', $target.html().trim());
        $target.html($target.data('loadingText'))
            .attr('disabled', 'disabled')
            .removeClass('btn-primary btn--icon-tada')
            .addClass('btn-secondary');
    };

    this.resetButton = function ($target) {
        $target.html($target.data('resetText'))
            .removeAttr('disabled')
            .removeClass('btn-secondary')
            .addClass('btn-primary btn--icon-tada');
    };

    this.printDeckPDF = function () {

        var topMargin   = (_pdfConfig.pageHeight - (_pdfConfig.cardHeight * 3) - (_pdfConfig.gutter * 2)) / 2;
        var leftMargin  = (_pdfConfig.pageWidth - (_pdfConfig.cardWidth * 3) - (_pdfConfig.gutter * 2)) / 2;

        var row1 = topMargin;
        var row2 = row1 + _pdfConfig.cardHeight + _pdfConfig.gutter;
        var row3 = row2 + _pdfConfig.cardHeight + _pdfConfig.gutter;

        var col1 = leftMargin;
        var col2 = col1 + _pdfConfig.cardWidth + _pdfConfig.gutter;
        var col3 = col2 + _pdfConfig.cardWidth + _pdfConfig.gutter;

        var place = {
            row1: row1,
            row2: row2,
            row3: row3,
            col1: col1,
            col2: col2,
            col3: col3
        };

        var doc = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: [_pdfConfig.pageHeight, _pdfConfig.pageWidth]
        });

        var deckSortedFull  = pikaDeck.store.get('deckSortedFull');
        var deckDataUrls    = pikaDeck.store.get('deckDataUrls');

        var colCount = 1;
        var rowCount = 1;

        for (var i = 0; i < deckSortedFull.length; i++) {

            var id = deckSortedFull[i];
            var dataUrl = deckDataUrls[id];

            var col = place['col' + colCount];
            var row = place['row' + rowCount];

            doc.addImage(dataUrl, 'PNG', col, row, _pdfConfig.cardWidth, _pdfConfig.cardHeight);

            if (colCount <= 2) {
                colCount++;
            } else {
                colCount = 1;

                if (rowCount <= 2) {
                    rowCount++;
                } else {
                    rowCount = 1;
                    doc.addPage();
                }

            }

        }

        // doc.text('Pokemon Name Here', leftMargin, topMargin);
        // doc.setDrawColor(255, 0, 0) // draw red lines
        // doc.setLineWidth(0.1)
        // doc.line(100, 20, 100, 60) // vertical line

        doc.save('PikaDeck.pdf');

        $(document).trigger('pdfDeck.draw_done');

    };


    this.drawLoadingCounter = function () {

        var deck       = pikaDeck.store.get('deckSorted');
        var loaded     = pikaDeck.store.get('deckDataUrlsIds') || [];

        deck    = deck.length;
        loaded  = loaded.length;

        var percent = parseInt((loaded/deck) * 100);

        $('#loading_count').html(' (' + percent + '%)');

    };




    this.printPlaySetPDF = function (dataUrl) {

        var topMargin   = (_pdfConfig.pageHeight - (_pdfConfig.cardHeight * 2) - _pdfConfig.gutter) / 2;
        var leftMargin  = (_pdfConfig.pageWidth - (_pdfConfig.cardWidth * 2) - _pdfConfig.gutter) / 2;

        var row1 = topMargin;
        var row2 = row1 + _pdfConfig.cardHeight + _pdfConfig.gutter;

        var col1 = leftMargin;
        var col2 = col1 + _pdfConfig.cardWidth + _pdfConfig.gutter;

        var doc = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: [_pdfConfig.pageHeight, _pdfConfig.pageWidth]
        });

        doc.addImage(dataUrl, 'PNG', col1, row1, _pdfConfig.cardWidth, _pdfConfig.cardHeight);
        doc.addImage(dataUrl, 'PNG', col2, row1, _pdfConfig.cardWidth, _pdfConfig.cardHeight);

        doc.addImage(dataUrl, 'PNG', col1, row2, _pdfConfig.cardWidth, _pdfConfig.cardHeight);
        doc.addImage(dataUrl, 'PNG', col2, row2, _pdfConfig.cardWidth, _pdfConfig.cardHeight);

        doc.save('PikaDeck.pdf');

    };

    this.printPlaySet = function (id) {

        var cards = pikaDeck.store.get('cardsLookup');
        var imgUrl = cards[id].imageUrlHiRes;

        _imgToBase64(imgUrl, function(dataUrl) {

            pikaDeck.pdf.printPlaySetPDF(dataUrl);

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





}).apply(pikaDeck.pdf);






