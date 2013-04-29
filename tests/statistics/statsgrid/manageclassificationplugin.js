describe.only('Test Suite for statistics/statsgrid manage classification plugin', function() {
    var appSetup = null,
        appConf = null,
        statsModule = null,
        sandbox = null,
        plugin = null;

    before(function() {

        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull', 'divmanazer', 'toolbar', 'statsgrid']);

        var mapfullConf = getConfigForMapfull();

        // overwrite test wide appConf
        appConf = {
            "mapfull": mapfullConf,
            "toolbar": {
                conf: {}
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
            // Find handles to sandbox and stats bundle.
            sandbox = Oskari.getSandbox();
            statsModule = sandbox.findRegisteredModuleInstance('StatsGrid');
            plugin = statsModule.classifyPlugin;

            done();
        });
    };

    describe('classification plugin', function() {
        before(startApplication);

        after(teardown);

        it('should be defined', function() {
            expect(plugin).to.be.ok();
        });

        it('should set manual breaks', function() {
            var testData = [1.0, 2.3, 2.6, 3.6, 3.9, 6.0, 6.9, 8.3, 8.5, 8.6, 9.0, 9.5, 9.7];
            var gstats = new geostats(testData);
            var limits;

            jQuery('body').find('.classificationMethod').find('.method').val('4');
            jQuery('body').find('.classificationMethod').find('.manualBreaks').find('input')
                .val('1.0, 2.6, 6.0, 8.5');

            limits = plugin.setManualBreaks(gstats);

            expect(limits.length).to.be(4);
            expect(isNaN(limits[0])).to.be(false);
            expect(limits[0]).to.be(1.0);
            expect(gstats.ranges.join(',')).to.be('1 - 2.6,2.6 - 6,6 - 8.5');
        });
    });
});