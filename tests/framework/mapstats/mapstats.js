describe('Test Suite for mapstats bundle', function() {
    var appSetup = null,
        appConf = null,
        statsPlugin = null,
        sandbox = null;

    before(function() {

        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull']);

        var mapfullConf = getConfigForMapfull();
        // overwrite test wide appConf
        appConf = {
            "mapfull": mapfullConf,
            "mapstats": {
                "state": {},
                "conf": {}
            }
        };
    });

    function startApplication(done, setup, conf) {
        if(!setup) {
            // clone original settings
            setup = jQuery.extend(true, {}, appSetup);
        }
        if(!conf) {
            // clone original settings
            conf = jQuery.extend(true, {}, appConf);
        }

        //setup HTML
        jQuery("body").html(getDefaultHTML());
        // startup Oskari
        setupOskari(setup, conf, function() {
            // Find handles to sandbox and stats plugin.
            sandbox = Oskari.getSandbox();
            statsPlugin = sandbox.findRegisteredModuleInstance('MainMapModuleStatsLayerPlugin');
            done();
        });
    };

    describe('initialization', function() {

        before(startApplication);

        after(teardown);

        it('should be defined', function() {
            expect(sandbox).to.be.ok();
            expect(statsPlugin).to.be.ok();
            expect(statsPlugin.getName()).to.be('MainMapModuleStatsLayerPlugin');
        });
    });
});