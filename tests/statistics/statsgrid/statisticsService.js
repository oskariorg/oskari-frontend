describe.only('Test Suite for statistics/statsgrid statistics service', function() {
    var appSetup = null,
        appConf = null,
        statsModule = null,
        sandbox = null,
        service = null;

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
            service = statsModule.statsService;

            done();
        });
    };

    describe('classification plugin', function() {
        before(startApplication);

        after(teardown);

        it('should be defined', function() {
            expect(service).to.be.ok();
        });

        it('should send statistics data event', function(done) {
            var self = this;

            self.getName = function() {
                return 'StatsGrid.ClassifyPlugin';
            };

            self.onEvent = function(event) {
                var name = event.getName();
                expect(name).to.be("StatsGrid.SotkadataChangedEvent");

                sandbox.unregisterFromEventByName(self, 'StatsGrid.SotkadataChangedEvent');
                done();
            };

            // Clear out other event listeners.
            sandbox._listeners = {};
            sandbox.registerForEventByName(self, 'StatsGrid.SotkadataChangedEvent');
            service.sendStatsData();
        });

        it('should send visualization data event', function(done) {
            var self = this;

            self.getName = function() {
                return 'StatsGrid.ClassifyPlugin';
            };

            self.onEvent = function(event) {
                var name = event.getName();
                expect(name).to.be('MapStats.StatsVisualizationChangeEvent');

                sandbox.unregisterFromEventByName(self, 'MapStats.StatsVisualizationChangeEvent');
                done();
            };

            // Clear out other event listeners.
            sandbox._listeners = {};
            sandbox.registerForEventByName(self, 'MapStats.StatsVisualizationChangeEvent');
            service.sendVisualizationData();

        });
    });
});