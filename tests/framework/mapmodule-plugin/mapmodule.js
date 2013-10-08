describe('Test Suite for MapModule', function () {
    var appSetup = null,
        appConf = null,
        module = null,
        sandbox = null;

    before(function () {
        var mapfullConf = getConfigForMapfull();
        // startup the oskari application with publisher bundle, 2 test layers and signed in user
        appSetup = getStartupSequence([
            'openlayers-default-theme',
            'mapfull'
        ]);

        appConf = {
            "mapfull": mapfullConf
        };
    });

    var startApplication = function (done) {
        //setup HTML
        jQuery("body").html(getDefaultHTML());
        // startup Oskari
        setupOskari(appSetup, appConf, function () {
            Oskari.setSupportedLocales(['fi_FI', 'sv_SE', 'en_US']);
            sandbox = Oskari.$("sandbox");
            module = sandbox.findRegisteredModuleInstance('MainMapModule');
            done();
        });
    };


    describe('should be localized', function () {

        before(function (done) {
            startApplication(done);
        });

        after(function () {
            teardown();
        });

        it("and localization should have same structures for fi, sv and en", function() {
            var result = matchLocalization('MapModule', ['fi', 'sv', 'en']);
            expect(result).to.be(true);
        });

    });
});