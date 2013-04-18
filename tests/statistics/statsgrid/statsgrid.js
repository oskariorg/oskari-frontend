describe('Test Suite for statistics/statsgrid bundle', function() {
    var appSetup = null,
        appConf = null,
        statsModule = null,
        sandbox = null;

    var testLayerId = 276;

    before(function() {

        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull', 'divmanazer', 'toolbar', 'statsgrid']);

        var mapfullConf = getConfigForMapfull();
        mapfullConf.conf.layers.push({
            "id": testLayerId,
            "type": "statslayer",
            "wmsName": "ows:kunnat2013",
            "wmsUrl": "http://nipsuke01.nls.fi:8080/geoserver/ows/wms",
            "maxScale": 1,
            "minScale": 10000000,
            "name": "tilasto testi fi",
            "inspire": "Aluesuunnittelu ja rajoitukset",
            "orgName": "Metsäntutkimuslaitos"
        });

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

    describe('mode grid', function() {
        before(startApplication);

        after(teardown);

        it('should go to mode view', function() {
            var testLayer = sandbox.findMapLayerFromAllAvailable(testLayerId),
                viewPlugin = statsModule.plugins['Oskari.userinterface.View'],
                statsSpy = sinon.spy(viewPlugin.showMode),
                menuToolbar = jQuery('body').find('div.oskariui-menutoolbar'),
                statsGridContainer = jQuery('body').find('statsgrid_100');

            expect(testLayer).to.be.ok();
            expect(viewPlugin).to.be.ok();
            expect(statsSpy.callCount).to.be(0);
            expect(menuToolbar.is(':visible')).to.be(false);
            expect(statsGridContainer.is(':visible')).to.be(false);
            
            sandbox.postRequestByName('StatsGrid.StatsGridRequest', [true, testLayer]);

            waitsFor(function() {
                return (statsSpy.callCount > 0);
            }, function() {

                expect(statsSpy.callCount).to.be(1);

                expect(menuToolbar.is(':visible')).to.be(true);
                expect(statsGridContainer.is(':visible')).to.be(true);

                done();
            }, "Waits for the stats grid mode request", 9000);
        });
    });
});