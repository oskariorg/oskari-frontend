// requires jetty + redis open with wfs2
describe.skip('Test Suite for mapwfs2', function() {
    var module = null,
        sandbox = null,
        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull']),
        mapfullConf = getConfigForMapfull(),
        appConf = {
            "mapfull": mapfullConf,
            "featuredata2": {
                "conf": {
                    "selectionTools": true
                }
            }
        };

    var ONLINE_TESTS = false; // if testing the connection

    function startApplication(done, setup, conf) {
        if(!setup) {
            // clone original settings
            setup = jQuery.extend(true, {}, appSetup);
        }
        if(!conf) {
            // clone original settings
            conf = jQuery.extend(true, {}, appConf);
        }

        deletePluginsFromConfig(conf, "Oskari.mapframework.bundle.mapwfs.plugin.wfslayer.WfsLayerPlugin");

        conf["mapfull"]["conf"]["plugins"].push(
            {
                "id": "Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin",
                "config": { contextPath : '/transport-0.0.1', port : '6060' }
            }
        );

        conf["mapfull"]["conf"]["plugins"].push(
            {
                "id": "Oskari.mapframework.mapmodule.GetInfoPlugin",
                "config": { ignoredLayerTypes: ["WFS"], infoBox: false }
            }
        );

        //setup HTML
        jQuery("body").html(getDefaultHTML());

        // startup Oskari
        setupOskari(setup, conf, function() {
            // Find handles to sandbox and statehandler id
            sandbox = Oskari.$("sandbox");
            module = sandbox.findRegisteredModuleInstance('MainMapModuleWfsLayerPlugin');
            done();
        });
    };

    describe('initialization', function() {
        before(startApplication);
        after(teardown);

        it('should be defined', function() {
            expect(sandbox).to.be.ok();
            expect(module).to.be.ok();
            expect(module.getName()).to.be('MainMapModuleWfsLayerPlugin');
        });
    });

    describe('localizations', function() {
        before(startApplication);
        after(teardown);

        it("should have same structure for fi, sv and en", function() {
            var result = matchLocalization('MapWfs2', ['fi', 'sv', 'en']);
            expect(result).to.be(true);
        });
    });

    describe('connection', function() {
        before(startApplication);
        after(teardown);

        it('should be defined', function() {
            var connection = module.getConnection();
            var mediator = module.getIO();

            expect(connection).to.be.ok();
            expect(mediator).to.be.ok();

            // needs transport service ONLINE
            if(ONLINE_TESTS) {
                expect(mediator.getConnection()).to.be.ok();
            }
        });
    });

    describe('grid', function() {
        before(startApplication);
        after(teardown);

        it('should be defined', function() {
            // not always ready
            if(!module.tileStrategy.getGrid().grid) {
                module.createTilesGrid();
            }
            var grid = module.getGrid();

            expect(grid).to.be.ok();
        });

        it('should have tileSize', function() {
            module.getGrid(); // init grid
            var tileSize = module.getTileSize();

            expect(tileSize).to.be.ok();
            expect(tileSize.widh).tto.equal(256);
            expect(tileSize.height).to.equal(256);
        });
    });

});
