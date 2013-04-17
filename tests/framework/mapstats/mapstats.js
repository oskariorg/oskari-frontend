describe.only('Test Suite for Mapstats', function() {
    var appSetup = null,
        appConf = null,
        statsPlugin = null,
        sandbox = null;

    before(function() {
        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull',
        {
            "instanceProps": {},
            "title": "Stats",
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
            statsPlugin = sandbox.findRegisteredModuleInstance('MainMapModuleStatsLayerPlugin');
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
            expect(statsPlugin).to.be.ok();
        });

        it('should be present in the DOM', function() {

        });
    });
});