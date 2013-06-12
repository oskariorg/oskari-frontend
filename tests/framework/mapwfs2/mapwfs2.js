// requires jetty + redis open with wfs2
describe.only('Test Suite for mapwfs2', function() {
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

    //
    // DATA MOCKS (io from bk)
    //

    var propertiesData = {
        "data": {
            "locales":["ID","Nimi","Osoite","Postinumero","x","y"],
            "layerId":216,
            "fields":["__fid","fi_nimi","fi_osoite","postinumero","__centerX","__centerY"]
        },
        "channel":"/wfs/properties"
    };
    var featureData = {
        "data": {
            "feature":["toimipaikat.10758","Helsingin kaupunki","Pohjoisesplanadi 11-13","00170",386429.0,6671884.0],
            "layerId":216
        },
        "channel":"/wfs/feature"
    };
    var imageData = { // tile (IE edition without data)
        "data": {
            "height":256,
            "zoom":9,
            "bbox":[383488.0,6672384.0,384000.0,6672896.0],
            "width":256,
            "srs":"EPSG:3067",
            "type":"normal",
            "keepPrevious":false,
            "layerId":216,
            "url":"/image?layerId=216&srs=EPSG:3067&bbox[0]=383488.0&bbox[1]=6672384.0&bbox[2]=384000.0&bbox[3]=6672896.0&zoom=9"
        },
        "channel":"/wfs/image"
    };
    var highlightImage = { // map image (IE edition without data)
        "data": {
            "height":1069,
            "zoom":9,
            "bbox":[383774.0,6670345.0,387308.0,6672483.0],
            "width":1767,
            "srs":"EPSG:3067",
            "type":"highlight",
            "keepPrevious":false,
            "layerId":216,
            "url":"/image?layerId=216&srs=EPSG:3067&bbox[0]=383774.0&bbox[1]=6670345.0&bbox[2]=387308.0&bbox[3]=6672483.0&zoom=9"
        },
        "channel":"/wfs/image"
    };
    var mapClickData = {
        "data":{
            "features":[["toimipaikat.4535","Helsingin maistraatti / Holhoustoimi","Lönnrotinkatu 20","00120",385373.0,6671561.0]],
            "keepPrevious":false,
            "layerId":216
        },
        "channel":"/wfs/mapClick"
    };
    var filterData = {
        "data":{
            "features":[["toimipaikat.14248","Vakuutusoikeus","LÃ¶nnrotinkatu 18","00120",385398.5741,6671577.423],
            ["toimipaikat.4535","Helsingin maistraatti / Holhoustoimi","LÃ¶nnrotinkatu 20","00120",385373.0,6671561.0]],
            "layerId":216
        },
        "channel":"/wfs/filter"
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
            // not always ready
            if(!module.tileStrategy.getGrid().grid) {
                module.createTilesGrid();
            }
            module.getGrid(); // init grid

            var tileSize = module.getTileSize();

            expect(tileSize).to.be.ok();
            expect(tileSize.width).to.equal(256);
            expect(tileSize.height).to.equal(256);
        });
    });

    //
    // EVENT TESTS (mediator set stubs - no connection)
    //

    describe('layer adding', function() {
        before(startApplication);
        after(teardown);

        it('should be activated', function(done) {
            this.timeout(10000);

            var mediator = module.getIO();

            // stub the connection io
            var doSpy = sinon.stub(mediator, 'addMapLayer', function(id, style) {
                mediator.getWFSProperties(propertiesData);
                mediator.getWFSFeature(featureData);
                mediator.getWFSImage(imageData);
            });

            var selectedLayers = addLayers(module, [216]); // sets "AfterMapLayerAddEvent"

            // expect these events
            var properties = false;
            var feature = false;
            var image = false;

            var self = this;
            self.getName = function() {
                return "Test.WfsLayerPlugin";
            }
            self.onEvent = function(event) {
                if(event.getName() === "WFSPropertiesEvent") {
                    properties = true;
                    expect(properties).to.be(true);
                } else if(event.getName() === "WFSFeatureEvent") {
                    feature = true;
                    expect(feature).to.be(true);
                } else if(event.getName() === "WFSImageEvent") {
                    image = true;
                    expect(image).to.be(true);
                }
            }

            sandbox.registerForEventByName(self, "WFSPropertiesEvent");
            sandbox.registerForEventByName(self, "WFSFeatureEvent");
            sandbox.registerForEventByName(self, "WFSImageEvent");

            // finish
            if(properties && feature && image) {
                done();
            }

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 0);
            }, function() {
                expect(doSpy.callCount).to.be(1);
                doSpy.restore();
            }, 'Waiting for adding a map layer', 5000);
        });
    });

    describe('highlighting features', function() {
        before(startApplication);
        after(teardown);

        it('should be activated', function(done) {
            this.timeout(10000);

            var mediator = module.getIO();

            var doSpy = sinon.stub(mediator, 'highlightMapLayerFeatures', function(id, featureIds, keepPrevious) {
                mediator.getWFSImage(highlightImage);
            });

            var self = this;
            sandbox.registerForEventByName(self, "AfterMapLayerAddEvent");
            sandbox.registerForEventByName(self, "AfterMapMoveEvent");
            sandbox.registerForEventByName(self, "WFSImageEvent");

            var selectedLayers = null;

            // expect these events
            var image = false;

            self.getName = function() {
                return "Test.WfsLayerPlugin";
            }
            self.onEvent = function(event) {
                if(event.getName() === "AfterMapMoveEvent") {
                    selectedLayers = addLayers(module, [216]);
                } else if(event.getName() === "AfterMapLayerAddEvent") { // wait that the layer has been added
                    var event = sandbox.getEventBuilder("WFSFeaturesSelectedEvent")("params"); // TODO: params
                    sandbox.notifyAll(event);
                } else if(event.getName() === "WFSImageEvent") {
                    image = true;
                    expect(image).to.be(true);
                    done();
                }
            }

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 0);
            }, function() {
                expect(doSpy.callCount).to.be(1);
                doSpy.restore();
            }, 'Waiting for highlight', 5000);

            // move map with projection coordinates
            sandbox.postRequestByName('MapMoveRequest', [385402, 6671502, 9]);
        });
    });

    describe('moving map / setting location', function() {
        before(startApplication);
        after(teardown);

        it('should be activated', function(done) {
            this.timeout(10000);

            var mediator = module.getIO();

            var doSpy = sinon.stub(mediator, 'setLocation', function(srs, bbox, zoom, grid) {
                mediator.getWFSProperties(propertiesData);
                mediator.getWFSFeature(featureData);
                mediator.getWFSImage(imageData);
            });

            var self = this;
            sandbox.registerForEventByName(self, "AfterMapLayerAddEvent");
            sandbox.registerForEventByName(self, "WFSPropertiesEvent");
            sandbox.registerForEventByName(self, "WFSFeatureEvent");
            sandbox.registerForEventByName(self, "WFSImageEvent");

            // move map "AfterMapMoveEvent"
            var selectedLayers = addLayers(module, [216]); // adds layer

            // expect these events
            var properties = false;
            var feature = false;
            var image = false;

            self.getName = function() {
                return "Test.WfsLayerPlugin";
            }
            self.onEvent = function(event) {
                if(event.getName() === "AfterMapLayerAddEvent") { // wait that the layer has been added
                    sandbox.postRequestByName('MapMoveRequest', [385402, 6671502, 9]);
                } else if(event.getName() === "WFSPropertiesEvent") {
                    properties = true;
                    expect(properties).to.be(true);
                } else if(event.getName() === "WFSFeatureEvent") {
                    feature = true;
                    expect(feature).to.be(true);
                } else if(event.getName() === "WFSImageEvent") {
                    image = true;
                    expect(image).to.be(true);
                }
            }

            // finish
            if(properties && feature && image) {
                done();
            }

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 0);
            }, function() {
                expect(doSpy.callCount).to.be(1);
                doSpy.restore();
            }, 'Waiting for map move', 5000);
        });
    });

// UNCOMMENT WHEN THESE FUNCTIONALITIES ARE IMPLEMENTED
/*
    describe('setting map size', function() {
        before(startApplication);
        after(teardown);

        it('should be activated', function(done) {
            this.timeout(10000);

            var mediator = module.getIO();

            var doSpy = sinon.stub(mediator, 'setMapSize', function(width, height, grid) {
                mediator.getWFSProperties(propertiesData);
                mediator.getWFSFeature(featureData);
                mediator.getWFSImage(imageData);
            });

            var self = this;
            sandbox.registerForEventByName(self, "AfterMapLayerAddEvent");
            sandbox.registerForEventByName(self, "WFSPropertiesEvent");
            sandbox.registerForEventByName(self, "WFSFeatureEvent");
            sandbox.registerForEventByName(self, "WFSImageEvent");

            var selectedLayers = addLayers(module, [216]); // adds layer

            // expect these events
            var properties = false;
            var feature = false;
            var image = false;

            self.getName = function() {
                return "Test.WfsLayerPlugin";
            }
            self.onEvent = function(event) {
                if(event.getName() === "AfterMapLayerAddEvent") { // wait that the layer has been added
                    // TODO: no caller - make an event!
                } else if(event.getName() === "WFSPropertiesEvent") {
                    properties = true;
                    expect(properties).to.be(true);
                } else if(event.getName() === "WFSFeatureEvent") {
                    feature = true;
                    expect(feature).to.be(true);
                } else if(event.getName() === "WFSImageEvent") {
                    image = true;
                    expect(image).to.be(true);
                }
            }

            // finish
            if(properties && feature && image) {
                done();
            }

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 0);
            }, function() {
                expect(doSpy.callCount).to.be(1);
                doSpy.restore();
            }, 'Waiting for map size change', 5000);
        });
    });

    describe('changing style', function() {
        before(startApplication);
        after(teardown);

        it('should be activated', function(done) {
            this.timeout(10000);

            var mediator = module.getIO();

            var doSpy = sinon.stub(mediator, 'setMapLayerStyle', function(id, style) {
                mediator.getWFSImage(imageData);
            });

            var self = this;
            sandbox.registerForEventByName(self, "AfterMapLayerAddEvent");
            sandbox.registerForEventByName(self, "WFSImageEvent");

            var selectedLayers = addLayers(module, [216]); // adds layer

            // expect these events
            var image = false;

            self.getName = function() {
                return "Test.WfsLayerPlugin";
            }
            self.onEvent = function(event) {
                if(event.getName() === "AfterMapLayerAddEvent") { // wait that the layer has been added
                    // TODO: no caller [make functionality first]
                } else if(event.getName() === "WFSImageEvent") {
                    image = true;
                    expect(image).to.be(true);
                    done();
                }
            }

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 0);
            }, function() {
                expect(doSpy.callCount).to.be(1);
                doSpy.restore();
            }, 'Waiting for style change', 5000);
        });
    });
*/
    describe('selecting feature', function() {
        before(startApplication);
        after(teardown);

        it('should be activated', function(done) {
            this.timeout(10000);

            var mediator = module.getIO();

            var doSpy = sinon.stub(mediator, 'setMapClick', function(longitude, latitude, keepPrevious) {
                mediator.getWFSMapClick(mapClickData);
            });

            var self = this;
            sandbox.registerForEventByName(self, "AfterMapLayerAddEvent");
            sandbox.registerForEventByName(self, "WFSFeaturesSelectedEvent");

            var selectedLayers = null;

            // expect these events
            var selected = false;

            self.getName = function() {
                return "Test.WfsLayerPlugin";
            }
            self.onEvent = function(event) {
                if(event.getName() === "AfterMapMoveEvent") {
                    selectedLayers = addLayers(module, [216]);
                } else if(event.getName() === "AfterMapLayerAddEvent") { // wait that the layer has been added
                    var map = sandbox.findRegisteredModuleInstance("MainMapModule").getMap();
                    var point = map.getViewPortPxFromLonLat(new OpenLayers.LonLat(385373, 6671561));
                    simulateMouseClick(map, point.x, point.y); // "MapClickedEvent"
                } else if(event.getName() === "WFSFeaturesSelectedEvent") {
                    selected = true;
                    expect(selected).to.be(true);
                    done();
                }
            }

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 0);
            }, function() {
                expect(doSpy.callCount).to.be(1);
                doSpy.restore();
            }, 'Waiting for map click', 5000);

            // move map with projection coordinates
            sandbox.postRequestByName('MapMoveRequest', [385402, 6671502, 9]);
        });
    });

    describe('setting filter', function() {
        before(startApplication);
        after(teardown);

        it('should be activated', function(done) {
            this.timeout(10000);

            var mediator = module.getIO();

            var doSpy = sinon.stub(mediator, 'setFilter', function(geojson) {
                mediator.getWFSFilter(filterData);
            });

            var self = this;
            sandbox.registerForEventByName(self, "AfterMapMoveEvent");
            sandbox.registerForEventByName(self, "AfterMapLayerAddEvent");
            sandbox.registerForEventByName(self, "WFSFeaturesSelectedEvent");
            sandbox.registerForEventByName(self, "FeatureData.FinishedDrawingEvent");

            var selectedLayers = null;

            self.getName = function() {
                return "Test.WfsLayerPlugin";
            }
            self.onEvent = function(event) {
                if(event.getName() === "AfterMapMoveEvent") {
                    selectedLayers = addLayers(module, [216]);
                } else if(event.getName() === "AfterMapLayerAddEvent") { // wait that the layer has been added
                    var map = sandbox.findRegisteredModuleInstance("MainMapModule").getMap();
                    var buttonElementArray = null;
                    var point = null;

                    buttonElementArray = jQuery("#toolbar .tool.tool-feature-selection");
                    expect(buttonElementArray.length).to.equal(1);
                    buttonElementArray.click();

                    buttonElementArray = jQuery(".divmanazerpopup.tools_selection .selection-area");
                    expect(buttonElementArray.length).to.equal(1);
                    buttonElementArray.click();

                    point = map.getViewPortPxFromLonLat(new OpenLayers.LonLat(385329, 6671604));
                    simulateMouseClick(map, point.x, point.y);

                    point = map.getViewPortPxFromLonLat(new OpenLayers.LonLat(385491, 6671600));
                    simulateMouseClick(map, point.x, point.y);

                    point = map.getViewPortPxFromLonLat(new OpenLayers.LonLat(385373, 6671499));

                    // mouse doubleclick
                    simulateMouseDblClick(map, point.x, point.y);
                } else if(event.getName() === "FeatureData.FinishedDrawingEvent") {
                    buttonElementArray = jQuery(".divmanazerpopup .showSelection");
                    expect(buttonElementArray.length).to.equal(1);
                    buttonElementArray.click();
                } else if(event.getName() === "WFSFeaturesSelectedEvent") {
                    selected = true;
                    expect(selected).to.be(true);
                    done();
                }
            }

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 0);
            }, function() {
                expect(doSpy.callCount).to.be(1);
                doSpy.restore();
                done();
            }, 'Waiting for filter', 5000);

            // move map with projection coordinates
            sandbox.postRequestByName('MapMoveRequest', [385402, 6671502, 9]);
        });
    });

    describe('setting visibility', function() {
        before(startApplication);
        after(teardown);

        it('should be activated', function(done) {
            this.timeout(10000);

            var mediator = module.getIO();

            var doSpy = sinon.stub(mediator, 'setMapLayerVisibility', function(id, visible) {
                if(visible == true) {
                    mediator.getWFSProperties(propertiesData);
                    mediator.getWFSFeature(featureData);
                    mediator.getWFSImage(imageData);
                }
            });

            var self = this;
            sandbox.registerForEventByName(self, "WFSPropertiesEvent");
            sandbox.registerForEventByName(self, "WFSFeatureEvent");
            sandbox.registerForEventByName(self, "WFSImageEvent");

            var selectedLayers = addLayers(module, [216]); // adds layer

            // expect these events
            var properties = false;
            var feature = false;
            var image = false;

            self.getName = function() {
                return "Test.WfsLayerPlugin";
            }
            self.onEvent = function(event) {
                if(event.getName() === "AfterMapLayerAddEvent") { // wait that the layer has been added
                    sandbox.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [216, false]);
                    sandbox.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [216, true]);
                } else if(event.getName() === "WFSPropertiesEvent") {
                    properties = true;
                    expect(properties).to.be(true);
                } else if(event.getName() === "WFSFeatureEvent") {
                    feature = true;
                    expect(feature).to.be(true);
                } else if(event.getName() === "WFSImageEvent") {
                    image = true;
                    expect(image).to.be(true);
                }
            }

            // finish
            if(properties && feature && image) {
                done();
            }

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 1);
            }, function() {
                expect(doSpy.callCount).to.be(2);
                doSpy.restore();
            }, 'Waiting for visibility change', 5000);
        });
    });
});
