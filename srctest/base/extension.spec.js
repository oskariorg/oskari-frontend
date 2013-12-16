define(['src/oskari/oskari', 'src/framework/divmanazer/extension/BaseExtension'], function(Oskari, Extension) {

    describe('Extension should contain the basic functionality', function() {

        it('Oskari should exist', function() {
            expect(Oskari).toBeDefined();
        });

        it('Extension should exist', function() {
        	console.log('here', Extension);
            expect(Extension).toBeDefined();
        });

    });
});