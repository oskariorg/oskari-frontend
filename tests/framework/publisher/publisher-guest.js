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
                'publisher'
            ]);
    
        var mapfullConf = getConfigForMapfull();
        appConf = {
            "mapfull" : mapfullConf
        }; 
    });


    var startApplication = function(done) {
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
            startApplication(done);
        });

        after(function() {
            teardown();
        });

        it("should show login message to guest users", function() {
            var notLoggedInView = publisherContent.find('div.notLoggedIn');
            expect(notLoggedInView.length).to.be(3);
        });
    });
});