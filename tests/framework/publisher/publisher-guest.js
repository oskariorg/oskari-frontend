describe('Test Suite for Publisher - Guest user', function() {
    
    var appSetup = null,
        appConf = null;

    before(function(done) {
        if(!appSetup) {
            
            appSetup = getStartupSequence([
                'openlayers-default-theme', 
                'mapfull', 
                'divmanazer',
                {
                    "instanceProps": {

                    },
                    "title": "Publisher",
                    "bundleinstancename": "publisher",
                    "fi": "Publisher",
                    "sv": "Publisher",
                    "en": "Publisher", 
                    "bundlename": "publisher",
                    "metadata": {
                        "Import-Bundle": {
                            "publisher": {
                                "bundlePath": "packages/framework/bundle/"
                            }
                        },
                        "Require-Bundle-Instance": [

                        ]
                    }
                }
            ]);
        
            var mapfullConf = getConfigForMapfull();
            appConf = {
                "mapfull" : mapfullConf
            }; 
        }
        done();
    });

    beforeEach(function(done) {
        jQuery("body").html(getDefaultHTML()); 
        setupOskari(appSetup, appConf, done);
    });
 
    afterEach(function() {
        // The Flyout is injected into the DOM and needs to be removed manually as testacular doesn't do that
        jQuery("body > div").remove();
    });

    describe('Bundle tests', function() {

        it('should setup correctly Publisher', function(done) {
            checkPublisherStartup(done);
        });

        it("should show login message to guest users", function(done) {
            var sandbox = Oskari.$("sandbox"),
                publisherModule = sandbox.findRegisteredModuleInstance('Publisher'); 


            var notLoggedInView = jQuery('div.publisher').find('div.notLoggedIn');
            expect(notLoggedInView.length).to.be(3);
            done();
        });
    });
});