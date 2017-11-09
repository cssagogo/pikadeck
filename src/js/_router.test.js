(function () {
    'use strict';

    var path = pikaDeck.router();

    describe('pikaDeck.router()', function () {

        describe('_inRoutes(hash, routes)', function () {

            it('If match found in routes object return true.', function () {
                assert.equal(path._inRoutes('#!test/me', {test: {init: function () {}}}), true);
            });

        });

        describe('_isRoute(hash)', function () {

            it('Return true if hash contains #!', function () {
                assert.equal(path._isRoute('#!test/me'), true);
            });

            it('Return false if hash does not contains #!', function () {
                assert.equal(path._isRoute('#test/me'), false);
            });

            it('Return false if no hash exists', function () {
                assert.equal(path._isRoute(''), false);
            });

            it('Return false if no hash exists', function () {
                assert.equal(path._isRoute(null), false);
            });

            it('Return false if no hash exists', function () {
                assert.equal(path._isRoute(undefined), false);
            });

        });

        describe('_splitHash(hash)', function () {

            it('Strip !# and return parts of hash as an array.', function () {
                assert.equal(JSON.stringify(path._splitHash('!#test/me')), JSON.stringify(['test','me']));
                assert.equal(JSON.stringify(path._splitHash('!#test')), JSON.stringify(['test']));
            });

            it('Strip !# and return empty string in array if nothing else passed.', function () {
                assert.equal(JSON.stringify(path._splitHash('!#')), JSON.stringify(['']));
            });

            it('Return empty string in array if empty string passed.', function () {
                assert.equal(JSON.stringify(path._splitHash('')), JSON.stringify(['']));
            });

            it('Return empty string in array if undefined passed.', function () {
                assert.equal(JSON.stringify(path._splitHash(undefined)), JSON.stringify(['']));
            });

            it('Return empty string in array if null passed.', function () {
                assert.equal(JSON.stringify(path._splitHash(null)), JSON.stringify(['']));
            });

        });

        describe('_getPath(hash)', function () {

            it('If a path exists in hash, return it.', function () {
                assert.equal(path._getPath('!#test/me'), 'me');
            });

            it('If a path does not exist in hash, return undefined.', function () {
                assert.equal(path._getPath('!#test'), undefined);
            });

        });

    });

}());



