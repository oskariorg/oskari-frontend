define(['oskari', 'jquery'], function(Oskari) {

    describe('Oskari should contain the basic functionality', function() {

        it('Oskari should exist', function() {
            expect(Oskari).toBeDefined();
        });

        it('Oskari.Application should exist', function() {
            expect(Oskari.Application).toBeDefined();
        });
    });
});