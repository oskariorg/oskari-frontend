describe('Test Suite for Publisher - Guest user', function() {
    
    var appSetup = null,
        appConf = null;

    var publisherModule = null,
        sandbox = null, 
        flyout = null,
        localization = null,
        publisherContent = null;

    before(function() {
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
    });


    var startApplication = function(done) {
        printDebug('setup page & oskari app');
        //setup HTML
        jQuery("body").html(getDefaultHTML()); 
        // startup Oskari
        setupOskari(appSetup, appConf, function() {
            sandbox = Oskari.$("sandbox");
            publisherModule = sandbox.findRegisteredModuleInstance('Publisher');
            flyout = publisherModule.plugins['Oskari.userinterface.Flyout']; 
            localization = publisherModule.getLocalization('StartView');
            publisherContent = jQuery('div.publisher');
            done();
        });
    };

    describe('Flyout', function() {

        before(function(done) {
            printDebug('test 1 - before');
            startApplication(done);
        });

        after(function() {
            printDebug('test 1 - after');
            teardown();
        });

        it("should show login message to guest users", function() {
            var notLoggedInView = publisherContent.find('div.notLoggedIn');
            expect(notLoggedInView.length).to.be(3);
        });
    });
});