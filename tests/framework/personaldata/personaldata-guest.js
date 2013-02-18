describe('Test Suite for PersonalData - Guest user', function() {
    var appSetup = null,
        appConf = null; 
 
    var module = null,
        sandbox = null;

    before(function() {
        printDebug('setup application config');
        // startup the oskari application with publisher bundle, 2 test layers and signed in user
        appSetup = getStartupSequence([
            'openlayers-default-theme', 
            'mapfull', 
            'divmanazer',
            {
                "bundleinstancename": "personaldata",
                "bundlename": "personaldata",
                "metadata": { 
                    "Import-Bundle": {
                        "personaldata": {
                            "bundlePath": "packages/framework/bundle/"
                        } 
                    }
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
            module = sandbox.findRegisteredModuleInstance('PersonalData'); 
            done();
        });
    };

    describe('should be localized', function() { 
 
        before(function(done) {
            printDebug('test loc - before');
            startApplication(done);
        });

        after(function() {
            printDebug('test loc - after');
            teardown();
        }); 

        it("and localization should have same structures for fi, sv and en", function() {
            var result = matchLocalization(module.getName(), ['fi', 'sv', 'en']);
            expect(result).to.be(true);
        });

    });

});