describe('Test Suite for Mapstats', function() {
    var appSetup = null,
        appConf = null,
        mapmodule = null,
        sandbox = null;

    before(function() {

        // startup the oskari application with publisher bundle, 2 test layers and signed in user
        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull', {
            "instanceProps": {},
            "title": "Mapstats",
            "bundleinstancename": "mapstats",
            "fi": "mapstats",
            "sv": "?",
            "en": "?",
            "bundlename": "mapstats",
            "metadata": {
                "Import-Bundle": {
                    "mapstats": {
                        "bundlePath": "packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": []
            }
        }]);

        var mapfullConf = getConfigForMapfull();
        appConf = {
            "mapfull": mapfullConf,
            "mapstats": {
                "state": {},
                "conf": {}
            }
        };
    });

    var startApplication = function(done) {
        //setup HTML
        jQuery("body").html(getDefaultHTML());
        // startup Oskari
        setupOskari(appSetup, appConf, function() {
            sandbox = Oskari.getSandbox();
            mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
            done();
        });
    };

    describe('initialization', function() {
        before(function(done) {
            startApplication(done);
        });

        after(function() {
            teardown();
        });

        it('should be defined', function() {

        });

        it('should be present in the DOM', function() {

        });
    });
});