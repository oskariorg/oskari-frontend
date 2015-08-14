define(['src/framework/divmanazer/extension/EnhancedExtension'], function(EnhancedExtension) {

    describe('EnhancedExtension should contain the basic functionality', function() {

        it('EnhancedExtension should exist', function() {
            expect(EnhancedExtension).toBeDefined();
        });

        it('Oskari.ui.Extension should be createable', function() {
            console.log('ext is', EnhancedExtension);
            var Extension = EnhancedExtension
                .extend({
                    startPlugin: function() {
                        this.setDefaultTile(this.getLocalization('tile').title);
                        this.setFlyout(Flyout.create(this, this.getLocalization('flyout')));
                    }
                });
            expect(Extension).toBeDefined;
        });
    });
});