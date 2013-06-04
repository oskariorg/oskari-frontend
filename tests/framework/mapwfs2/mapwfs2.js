// requires jetty + redis open with wfs2
describe('Test Suite for mapwfs2', function() {
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
            expect(module.getConnection()).to.be.ok();
            expect(module.getIO()).to.be.ok();
            expect(module.getIO().getConnection()).to.be.ok();
        });
    });




});
