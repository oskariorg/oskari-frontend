describe.only('Test Suite for digiroad/featureselector bundle', function() {
    var appSetup = null,
        appConf = null,
        sandbox = null,
        module = null,
        flyout = null,
        testLayer = null;

    var testLayerId = 'vaylatyyppi';

    before(function() {

        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull', 'divmanazer', 'toolbar', 'digiroad-featureselector']);
        appSetup.startupSequence[1].metadata['Import-Bundle']['digiroad-featureselector'] = {
            "bundlePath": "../packages/digiroad/bundle/"
        };

        var mapfullConf = getConfigForMapfull();
        mapfullConf.conf.layers.push({
            "type": "wmslayer",
            "id": "vaylatyyppi",
            "wmsName": "LiVi:LIIKENNE_ELEMENTTI",
            "name": "Väylätyyppi",
            "inspire": "Liikenne-elementit",
            "orgName": "Liikenne-elementit",
            "minScale": 15000000,
            "maxScale": 1,
            "wmsUrl": "http://digiroad.karttakeskus.fi/dgeoserver/wms",
            "styles": [
              {"title": "Väylätyyppi", "name": "vaylatyyppi"}
            ],
            "style": "vaylatyyppi"
        });
        mapfullConf.conf.plugins.push({
            "id": "Oskari.digiroad.bundle.featureselector.plugin.VectorLayerPlugin"
        });

        // overwrite test wide appConf
        appConf = {
            "mapfull": mapfullConf,
            "digiroad-featureselector": {
                "state": {},
                "conf": {
                    "queryUrl": "http://digiroad.karttakeskus.fi/delegate/proxy/wfs",
                    "targetLayers": {
                        "vaylatyyppi": {
                            "objectId": "OID_TUNNUS",
                            "geometryName": "GEOMETRY",
                            "headers": [
                                {"id": "vaylatyyppi", "name": "Väylätyyppi", "field": "VAYLATYYPP", "editor": "select"},
                                {"id": "toiminnallinen_luokka", "name": "Toiminnallinen luokka", "field": "TOIMINNALL", "editor": "select"},
                                {"id": "nimi1_fi", "name": "Nimi (suomi)", "field": "NIMI1_SU", "editor": "text"},
                                {"id": "nimi1_sv", "name": "Nimi (ruotsi)", "field": "NIMI1_RU", "editor": "text"}
                            ]
                        }
                    }
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
            flyout = module.plugins['Oskari.userinterface.Flyout'];
            testLayer = sandbox.findMapLayerFromAllAvailable(testLayerId);

            done();
        });
    };

    describe('initialization', function() {
        before(startApplication);

        after(teardown);

        it('should be defined', function() {
            expect(sandbox).to.be.ok();
            expect(module).to.be.ok();
            expect(testLayer).to.be.ok();
        });
    });

    describe('adding a layer to the map', function() {
        before(startApplication);

        after(teardown);

        it('should create a grid', function(done) {
            var addLayerSpy = sinon.spy(flyout, 'addGrid');

            expect(addLayerSpy.callCount).to.be(0);

            sandbox.postRequestByName('AddMapLayerRequest', [testLayerId, true]);

            waitsFor(function() {
                return (addLayerSpy.callCount > 0);
            }, function() {
                var gridElement = jQuery('body').find('#' + testLayerId + '_grid');

                expect(addLayerSpy.callCount).to.be(1);
                expect(gridElement.length).to.be(1);

                addLayerSpy.restore();
                done();
            }, 'Waiting for adding a map layer', 5000);
        });
    });

    describe('adding features', function() {
        before(function(done) {
            startApplication(function() {
                sandbox.postRequestByName('AddMapLayerRequest', [testLayerId, true]);
                setTimeout(function() {
                    done();
                }, 2000);
            });
        });
        
        after(teardown);

        it('should display the features in the grid', function(done) {
            var gridElement = jQuery('body').find('#' + testLayerId + '_grid');

            var geom = new OpenLayers.Geometry.LineString([
                new OpenLayers.Geometry.Point(385353.8489912029, 6672020.388688928),
                new OpenLayers.Geometry.Point(385224.7758490024, 6671939.071921699)
            ]);
            var feature = new OpenLayers.Feature.Vector(geom, {
                'OID_TUNNUS': 2618445,
                'VAYLATYYPP': 2,
                'TOIMINNALL': 4,
                'NIMI1_SU': 'Urho Kekkosen katu',
                'NIMI1_RU': 'Urho Kekkonens gata'
            });
            var featureSpy = sinon.spy(flyout, 'appendFeatures');
            var eventBuilder = sandbox.getEventBuilder('FeatureSelector.FeaturesAddedEvent');
            var event = eventBuilder(testLayerId, [feature]);

            expect(gridElement.length).to.be(1);

            sandbox.notifyAll(event);

            waitsFor(function() {
                return (featureSpy.callCount > 0);
            }, function() {
                var gridRow = jQuery(gridElement).find('.slick-row');

                expect(featureSpy.callCount).to.be(1);
                expect(gridRow.length).to.be(1);

                featureSpy.restore();
                done();
            }, 'Waiting for adding features', 5000);
        });
    });
});