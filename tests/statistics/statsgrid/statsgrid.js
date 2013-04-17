describe.only('Test Suite for statistics/statsgrid bundle', function() {
    var appSetup = null,
        appConf = null,
        statsModule = null,
        sandbox = null;

    before(function() {

        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull', 'statsgrid']);

        var mapfullConf = getConfigForMapfull();

        // overwrite test wide appConf
        appConf = {
            "mapfull": mapfullConf
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
            done();
        });
    };

    describe('initialization', function() {

        before(startApplication);

        after(teardown);

        it('should be defined', function() {
            expect(sandbox).to.be.ok();
            expect(statsModule).to.be.ok();
        });
    });
});