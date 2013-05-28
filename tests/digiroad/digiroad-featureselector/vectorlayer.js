describe('Test Suite for digiroad/featureselector/vectorlayer model', function() {
    var appSetup = null,
        appConf = null,
        sandbox = null,
        module = null,
        mapLayerService = null;

    var layerModelName = 'dr-vectorlayer';

    before(function() {

        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull', 'divmanazer', 'toolbar', 'digiroad-featureselector']);
        appSetup.startupSequence[1].metadata['Import-Bundle']['digiroad-featureselector'] = {
            "bundlePath": "../packages/digiroad/bundle/"
        };

        var mapfullConf = getConfigForMapfull();
        mapfullConf.conf.plugins.push({
            "id": "Oskari.digiroad.bundle.featureselector.plugin.VectorLayerPlugin"
        });

        // overwrite test wide appConf
        appConf = {
            "mapfull": mapfullConf,
            "toolbar": {
                "state": {

                },
                "conf": {
                    "history": false,
                    "basictools": false,
                    "viewtools": false
                }
            },
            "digiroad-featureselector": {
                "conf": {
                    "queryUrl": "http://localhost"
                }
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
            // Find handles to sandbox and featureselector bundle.
            sandbox = Oskari.getSandbox();
            module = sandbox.findRegisteredModuleInstance('FeatureSelector');

            mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
            if(mapLayerService) {
                mapLayerService.registerLayerModel(layerModelName, 'Oskari.digiroad.bundle.featureselector.domain.VectorLayer');
                var layerModelBuilder = Oskari.clazz.create('Oskari.digiroad.bundle.featureselector.domain.VectorLayerModelBuilder', sandbox);
                mapLayerService.registerLayerModelBuilder(layerModelName, layerModelBuilder);
            }

            done();
        });
    };

    describe('initialization', function() {
        before(startApplication);

        after(teardown);

        it('should be defined', function() {
            expect(sandbox).to.be.ok();
            expect(module).to.be.ok();
            expect(mapLayerService.modelBuilderMapping[layerModelName]).to.be.ok();
        });

        it('should have custom map layer methods', function() {
            var testLayerJson = {
                "id": "testLayerId",
                "type": "dr-vectorlayer",
                "opacity": 100,
                "name": "testLayer_vector",
                "minScale": 25001,
                "maxScale": 1,
                "protocolType": "WFS",
                "strategyTypes": "BBOX,FIXED",
                "protocolOpts": {
                    "url": "http://localhost",
                    "srsName": "EPSG:3067",
                    "version": "1.1.0",
                    "featureType": "testFeatures",
                    "geometryName": "the_geom",
                    "outputFormat": "json"
                }
            };
            var testVectorLayer = mapLayerService.createMapLayer(testLayerJson);

            expect(testVectorLayer.getProtocolType()).to.be('WFS');
            expect(typeof testVectorLayer.getProtocolOpts()).to.be('object');
            expect(testVectorLayer.getStrategyTypes().constructor).to.be(Array);
            expect(testVectorLayer.getStrategyTypes().length).to.be(2);
        });
    });
});