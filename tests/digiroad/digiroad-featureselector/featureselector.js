describe('Test Suite for digiroad/featureselector bundle', function() {
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
            "wmsUrl": "http://localhost/dgeoserver/wms",
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
                    "queryUrl": "http://localhost/delegate/proxy/wfs",
                    "targetLayers": {
                        "vaylatyyppi": {
                            "objectId": "OID_TUNNUS",
                            "geometryName": "GEOMETRY",
                            "headers": [
                                {"id": "vaylatyyppi", "name": "Väylätyyppi", "field": "VAYLATYYPP", "editor": "integer"},
                                {"id": "toiminnallinen_luokka", "name": "Toiminnallinen luokka", "field": "TOIMINNALL", "editor": "integer"},
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

        it('should create a grid and a vector layer', function(done) {
            var addLayerSpy = sinon.spy(flyout, 'addGrid');

            expect(addLayerSpy.callCount).to.be(0);

            sandbox.postRequestByName('AddMapLayerRequest', [testLayerId, true]);

            waitsFor(function() {
                return (addLayerSpy.callCount > 0);
            }, function() {
                var gridElement = jQuery('body').find('#' + testLayerId + '_grid');
                var vectorLayer = sandbox.findMapLayerFromAllAvailable(testLayerId + '_vector');

                expect(vectorLayer).to.be.ok();
                expect(addLayerSpy.callCount).to.be(1);
                expect(gridElement.length).to.be(1);

                addLayerSpy.restore();
                done();
            }, 'Waiting for adding a map layer', 5000);
        });

        it('should remove the grid and the vector layer after layer removal', function(done) {
            var removeLayerSpy = sinon.spy(flyout, 'removeGrid');

            expect(removeLayerSpy.callCount).to.be(0);

            sandbox.postRequestByName('RemoveMapLayerRequest', [testLayerId, true]);

            waitsFor(function() {
                return (removeLayerSpy.callCount > 0);
            }, function() {
                var gridElement = jQuery('body').find('#' + testLayerId + '_grid');
                var vectorLayer = sandbox.findMapLayerFromAllAvailable(testLayerId + '_vector');

                expect(vectorLayer).not.to.be.ok();
                expect(removeLayerSpy.callCount).to.be(1);
                expect(gridElement.length).to.be(0);

                removeLayerSpy.restore();
                done();
            }, 'Waiting for removing a map layer', 5000);
        });
    });

    describe('adding features', function() {
        var testFeatureAtts = {
            'OID_TUNNUS': 2618445,
            'VAYLATYYPP': 2,
            'TOIMINNALL': 4,
            'NIMI1_SU': 'Urho Kekkosen katu',
            'NIMI1_RU': 'Urho Kekkonens gata'
        };
        var testFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([
            new OpenLayers.Geometry.Point(385353.8489912029, 6672020.388688928),
            new OpenLayers.Geometry.Point(385224.7758490024, 6671939.071921699)
        ]), testFeatureAtts);
        var gridElement;
        var gridRow;

        before(function(done) {
            startApplication(function() {
                sandbox.postRequestByName('AddMapLayerRequest', [testLayerId, true]);
                setTimeout(function() {
                    done();
                }, 1000);
            });
        });
        
        after(teardown);

        it('should display the features in the grid', function(done) {
            gridElement = jQuery('body').find('#' + testLayerId + '_grid');

            var featureSpy = sinon.spy(flyout, 'appendFeatures');
            var eventBuilder = sandbox.getEventBuilder('FeatureSelector.FeaturesAddedEvent');
            var event = eventBuilder(testLayerId, [testFeature]);

            expect(gridElement.length).to.be(1);

            sandbox.notifyAll(event);

            waitsFor(function() {
                return (featureSpy.callCount > 0);
            }, function() {
                gridRow = jQuery(gridElement).find('.slick-row');

                expect(featureSpy.callCount).to.be(1);
                expect(gridRow.length).to.be(1);

                featureSpy.restore();
                done();
            }, 'Waiting for adding features', 5000);
        });

        // Couldn't get it to send a 'onCellChange' event to which the grid responds to
        // by sendind a 'FeatureSelector.FeatureEditedEvent'.
        // FIXME
        it.skip('should send an event after editing a feature', function(done) {
            gridElement = jQuery('body').find('#' + testLayerId + '_grid');
            gridRow = jQuery(gridElement).find('.slick-row');
            var gridCell = jQuery(gridRow).find('.slick-cell')[3];
            var self = this;
            var newValue = 'long cat is looooong';

            expect(gridCell).to.be.ok();

            self.getName = function() {
                return "Test.FeatureSelector";
            };
            self.onEvent = function(event) {
                var layerName = event.getName(),
                    feature = event.getFeature(),
                    callback = event.getCallback();

                expect(feature['NIMI1_SU']).to.be(newValue);
                expect(layerName).to.be(testLayerId);

                // cleanup
                sandbox.unregisterFromEventByName(self, "FeatureSelector.FeatureEditedEvent");
                done();
            };

            // listen to FeatureSelector.FeatureEditedEvent to trigger verification
            sandbox.registerForEventByName(self, "FeatureSelector.FeatureEditedEvent");

            testFeatureAtts['NIMI1_SU'] = newValue;
            var slickEvent = new Slick.Event();
            var slickArgs = {'item': testFeatureAtts};
            slickEvent.notify(slickArgs);

        });

        it('should remove the features from the grid after FeaturesRemovedEvent', function(done) {
            gridElement = jQuery('body').find('#' + testLayerId + '_grid');
            gridRow = jQuery(gridElement).find('.slick-row');
            var removeSpy = sinon.spy(flyout, 'removeFeatures');
            var eventBuilder = sandbox.getEventBuilder('FeatureSelector.FeaturesRemovedEvent');
            var event = eventBuilder(testLayerId, [testFeature]);

            expect(gridRow.length).to.be(1);

            sandbox.notifyAll(event);

            waitsFor(function() {
                return (removeSpy.callCount > 0);
            }, function() {
                gridRow = jQuery(gridElement).find('.slick-row');

                expect(removeSpy.callCount).to.be(1);
                expect(gridRow.length).to.be(0);

                removeSpy.restore();
                done();
            }, 'Waiting for removing features', 5000);
        });
    });
});