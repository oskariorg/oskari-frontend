describe('Test Suite for MapModule', function() {
    var appSetup = null,
        appConf = null; 
 
    var module = null,
        sandbox = null;

    before(function() {
        // startup the oskari application with publisher bundle, 2 test layers and signed in user
        appSetup = getStartupSequence([
            'openlayers-default-theme', 
            'mapfull'
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
            module = sandbox.findRegisteredModuleInstance('MainMapModule');
            done();
        });
    };


    describe('should be localized', function() { 
 
        before(function(done) {
            startApplication(done);
        });

        after(function() {
            teardown();
        }); 

        it("and localization should have same structures for fi, sv and en", function() {
            var result = matchLocalization('MapModule', ['fi', 'sv', 'en']);
            expect(result).to.be(true);
        });

    });
});