// requires jetty + redis open with wfs2
describe('Test Suite for mapwfs2', function() {
    var module = null,
        connection = null,
        mediator = null,
        sandbox = null,
        appSetup = getStartupSequence([
            'openlayers-default-theme',
            'mapfull',
            'divmanazer',
            'toolbar',
            'featuredata2'
        ]),
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
    var imageData2 = { // tile (IE edition without data)
        "data": {
            "height":256,
            "zoom":9,
            "bbox":[383490.0,6672394.0,384010.0,6672806.0],
            "width":256,
            "srs":"EPSG:3067",
            "type":"normal",
            "keepPrevious":false,
            "layerId":216,
            "url":"/image?layerId=216&srs=EPSG:3067&bbox[0]=383490.0&bbox[1]=6672394.0&bbox[2]=384010.0&bbox[3]=6672806.0&zoom=9"
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
                "config": { 
                    hostname: 'localhost',
                    contextPath: '/transport-0.0.1',
                    port: '8888', 
                    lazy: false 
                }
            }
        );

        conf["mapfull"]["conf"]["plugins"].push(
            {
                "id": "Oskari.mapframework.mapmodule.GetInfoPlugin",
                "config": { ignoredLayerTypes: ["WFS"], infoBox: false }
            }
        );

        // make layer 216 available
        conf["mapfull"]["conf"]["layers"].push({
            "wmsName": "palvelupisteiden_kyselypalvelu",
            "type": "wfslayer",
            "baseLayerId": 27,
            "legendImage": "",
            "formats": {},
            "id": 216,
            "style": "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n<StyledLayerDescriptor version=\"1.0.0\" xmlns=\"http://www.opengis.net/sld\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd\">\n\t<NamedLayer>\n\t\t<Name>Palvelupisteet</Name>\n\t\t<UserStyle>\n\t\t\t<Title>Palvelupisteiden tyyli</Title>\n\t\t\t<Abstract/>\n\t\t\t<FeatureTypeStyle>\n\t\t\t\t<Rule>\n\t\t\t\t\t<Title>Piste</Title>\n\t\t\t\t\t<PointSymbolizer>\n\t\t\t\t\t\t<Graphic>\n\t\t\t\t\t\t\t<Mark>\n\t\t\t\t\t\t\t\t<WellKnownName>circle</WellKnownName>\n\t\t\t\t\t\t\t\t<Fill>\n\t\t\t\t\t\t\t\t\t<CssParameter name=\"fill\">#FFFFFF</CssParameter>\n\t\t\t\t\t\t\t\t</Fill>\n\t\t\t\t\t\t\t\t<Stroke>\n\t\t\t\t\t\t\t\t\t<CssParameter name=\"stroke\">#000000</CssParameter>\n\t\t\t\t\t\t\t\t\t<CssParameter name=\"stroke-width\">2</CssParameter>\n\t\t\t\t\t\t\t\t</Stroke>\n\t\t\t\t\t\t\t</Mark>\n\t\t\t\t\t\t\t<Size>12</Size>\n\t\t\t\t\t\t</Graphic>\n\t\t\t\t\t</PointSymbolizer>\n\t\t\t\t</Rule>\n\t\t\t</FeatureTypeStyle>\n\t\t</UserStyle>\n\t</NamedLayer>\n</StyledLayerDescriptor>",
            "dataUrl": "",
            "created": "Wed Jan 18 14:11:29 EET 2012",
            "updated": "Mon Mar 05 12:20:59 EET 2012",
            "name": "Palvelupisteiden kyselypalvelu",
            "opacity": 100,
            "permissions": {
                "publish": "no_publication_permission"
            },
            "maxScale": 1,
            "inspire": "Yleishyödylliset ja muut julkiset palvelut",
            "dataUrl_uuid": "",
            "descriptionLink": "",
            "styles": {},
            "orgName": "Valtiokonttori",
            "isQueryable": false,
            "minScale": 50000,
            "wmsUrl": "wms",
            "admin": {},
            "orderNumber": 2,
            "subtitle": ""
        });

        //setup HTML
        jQuery("body").html(getDefaultHTML());

        // startup Oskari
        setupOskari(setup, conf, function() {
            // Find handles to sandbox and statehandler id
            sandbox = Oskari.$("sandbox");
            module = sandbox.findRegisteredModuleInstance('MainMapModuleWfsLayerPlugin');
            mediator = module.getIO();
            mediator.session = {
                "clientId" : "testId",
                "session" : "test_session",
                "browser" : jQuery.browser.name,
                "browserVersion" : jQuery.browser.versionNum
            }
            connection = module.getConnection().get();
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
            expect(connection).to.be.ok();
            expect(mediator).to.be.ok();

            // needs transport service ONLINE
            if(ONLINE_TESTS) {
                expect(connection.isConnected()).to.be(true);
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
            this.timeout(20000);

            // stub the connection io
            var doSpy = sinon.stub(mediator, 'addMapLayer', function(id, style) {
                mediator.getWFSProperties(propertiesData);
                mediator.getWFSFeature(featureData);
                mediator.getWFSImage(imageData);
            });

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

            var selectedLayers = addLayers(module, [216]); // sets "AfterMapLayerAddEvent"

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 0);
            }, function() {
                expect(doSpy.callCount).to.be(1);
                doSpy.restore();
                done();
            }, 'Waiting for adding a map layer', 5000);

            // finish
            waitsFor(function() {
                return (properties && feature && image);
            }, function() {
                done();
            }, 'Waiting for responses', 10000);
        });
    });

    describe('highlighting features', function() {
        before(startApplication);
        after(teardown);

        it('should be activated', function(done) {
            this.timeout(20000);

            var doSpy = sinon.stub(mediator, 'highlightMapLayerFeatures', function(id, featureIds, keepPrevious) {
                mediator.getWFSImage(highlightImage);
            });

            // expect these events
            var image = false;

            var selectedLayers = null;
            var self = this;
            self.getName = function() {
                return "Test.WfsLayerPlugin";
            }
            self.onEvent = function(event) {
                if(event.getName() === "AfterMapMoveEvent") {
                    selectedLayers = addLayers(module, [216]);
                } else if(event.getName() === "AfterMapLayerAddEvent") { // wait that the layer has been added
                    var layer = sandbox.findMapLayerFromSelectedMapLayers(216);
                    var event = sandbox.getEventBuilder("WFSFeaturesSelectedEvent")(["toimipaikat.4535"], layer, false);
                    sandbox.notifyAll(event);
                } else if(event.getName() === "WFSImageEvent") {
                    image = true;
                    expect(image).to.be(true);
                    done();
                }
            }

            sandbox.registerForEventByName(self, "AfterMapLayerAddEvent");
            sandbox.registerForEventByName(self, "AfterMapMoveEvent");
            sandbox.registerForEventByName(self, "WFSImageEvent");

            // move map with projection coordinates
            sandbox.postRequestByName('MapMoveRequest', [385402, 6671502, 9]);

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 0);
            }, function() {
                expect(doSpy.callCount).to.be(1);
                doSpy.restore();
            }, 'Waiting for highlight', 5000);
        });
    });

    describe('moving map / setting location', function() {
        before(startApplication);
        after(teardown);

        it('should be activated', function(done) {
            this.timeout(20000);

            var doSpy = sinon.stub(mediator, 'setLocation', function(srs, bbox, zoom, grid) {
                mediator.getWFSProperties(propertiesData);
                mediator.getWFSFeature(featureData);
                mediator.getWFSImage(imageData);
                mediator.getWFSImage(imageData2);
            });

            // expect these events
            var properties = false;
            var feature = false;
            var image = false;
            var printout = [];

            var self = this;
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
                } else if(event.getName() === "Printout.PrintableContentEvent") {
                    printout.push(event.getTileData());
                    expect(printout.length).to.be.greaterThan(0);
                }
            }

            sandbox.registerForEventByName(self, "AfterMapLayerAddEvent");
            sandbox.registerForEventByName(self, "WFSPropertiesEvent");
            sandbox.registerForEventByName(self, "WFSFeatureEvent");
            sandbox.registerForEventByName(self, "WFSImageEvent");
            sandbox.registerForEventByName(self, "Printout.PrintableContentEvent");

            // move map "AfterMapMoveEvent"
            var selectedLayers = addLayers(module, [216]); // adds layer

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 0);
            }, function() {
                expect(doSpy.callCount).to.be(1);
                doSpy.restore();
            }, 'Waiting for map move', 5000);

            // finish
            waitsFor(function() {
                return (properties && feature && image && (printout.length === 2));
            }, function() {
                expect(printout[0]['216'][0].url).not.to.be(printout[0]['216'][1].url);
                done();
            }, 'Waiting for responses', 10000);
        });
    });

    // TODO: make the feature :)
    describe('setting map size', function() {
        before(startApplication);
        after(teardown);

        it('should be activated', function(done) {
            this.timeout(20000);

            var doSpy = sinon.stub(mediator, 'setMapSize', function(width, height, grid) {
                mediator.getWFSProperties(propertiesData);
                mediator.getWFSFeature(featureData);
                mediator.getWFSImage(imageData);
            });

            // expect these events
            var properties = false;
            var feature = false;
            var image = false;

            var self = this;
            self.getName = function() {
                return "Test.WfsLayerPlugin";
            }
            self.onEvent = function(event) {
                if(event.getName() === "AfterMapLayerAddEvent") { // wait that the layer has been added
                    var event = sandbox.getEventBuilder("MapSizeChangedEvent")(800, 600);
                    sandbox.notifyAll(event);
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

            sandbox.registerForEventByName(self, "AfterMapLayerAddEvent");
            sandbox.registerForEventByName(self, "WFSPropertiesEvent");
            sandbox.registerForEventByName(self, "WFSFeatureEvent");
            sandbox.registerForEventByName(self, "WFSImageEvent");

            var selectedLayers = addLayers(module, [216]); // adds layer

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 0);
            }, function() {
                expect(doSpy.callCount).to.be(1);
                doSpy.restore();
            }, 'Waiting for map size change', 5000);

            // finish
            waitsFor(function() {
                return (properties && feature && image);
            }, function() {
                done();
            }, 'Waiting for responses', 10000);
        });
    });

    // TODO: make the feature :)
    describe.skip('changing style', function() {
        before(startApplication);
        after(teardown);

        it('should be activated', function(done) {
            this.timeout(20000);

            var doSpy = sinon.stub(mediator, 'setMapLayerStyle', function(id, style) {
                mediator.getWFSImage(imageData);
            });

            // expect these events
            var image = false;

            var self = this;
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

            sandbox.registerForEventByName(self, "AfterMapLayerAddEvent");
            sandbox.registerForEventByName(self, "WFSImageEvent");

            var selectedLayers = addLayers(module, [216]); // adds layer

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 0);
            }, function() {
                expect(doSpy.callCount).to.be(1);
                doSpy.restore();
            }, 'Waiting for style change', 5000);
        });
    });

    describe('selecting feature', function() {
        before(startApplication);
        after(teardown);

        it('should be activated', function(done) {
            this.timeout(20000);

            var doSpy = sinon.stub(mediator, 'setMapClick', function(longitude, latitude, keepPrevious) {
                mediator.getWFSMapClick(mapClickData);
            });
            var getInfoPlugin = sandbox.findRegisteredModuleInstance('MainMapModuleGetInfoPlugin');
            var handleGetInfoSpy = sinon.stub(getInfoPlugin, 'handleGetInfo', function() {
                var data = {
                    fragments: [{layerName: "testLayer", markup: "test markup", layerId: "testLayerId"}]
                };
                var event = sandbox.getEventBuilder("GetInfoResultEvent")(data);
                sandbox.notifyAll(event);
            });

            var selectedLayers = null;

            // expect these events
            var selected = false;
            var fragments = [];

            var self = this;
            self.getName = function() {
                return "Test.WfsLayerPlugin";
            }
            self.onEvent = function(event) {
                if(event.getName() === "AfterMapMoveEvent") {
                    selectedLayers = addLayers(module, [216]);
                } else if(event.getName() === "AfterMapLayerAddEvent") { // wait that the layer has been added
                    var map = sandbox.findRegisteredModuleInstance("MainMapModule").getMap();
                    var point = map.getViewPortPxFromLonLat(new OpenLayers.LonLat(385373, 6671561));
                    var evt = sandbox.getEventBuilder('MapClickedEvent')(point, point.x, point.y);
                    sandbox.notifyAll(evt);
                } else if(event.getName() === "WFSFeaturesSelectedEvent") {
                    selected = true;
                    expect(selected).to.be(true);
                    //done();
                } else if(event.getName() === "GetInfoResultEvent") {
                    fragments = event.getData().fragments;
                }
            }

            sandbox.registerForEventByName(self, "AfterMapMoveEvent");
            sandbox.registerForEventByName(self, "AfterMapLayerAddEvent");
            sandbox.registerForEventByName(self, "WFSFeaturesSelectedEvent");
            sandbox.registerForEventByName(self, "MapClickedEvent");
            sandbox.registerForEventByName(self, "GetInfoResultEvent");

            // move map with projection coordinates
            sandbox.postRequestByName('MapMoveRequest', [385402, 6671502, 9]);

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 0 && handleGetInfoSpy.callCount > 0);
            }, function() {
                expect(doSpy.callCount).to.be(1);
                expect(handleGetInfoSpy.callCount).to.be(1);
                expect(fragments.length).to.be(2);
                doSpy.restore();
                handleGetInfoSpy.restore();
                done();
            }, 'Waiting for map click', 5000);
        });
    });

    describe('setting filter', function() {
        before(startApplication);
        after(teardown);

        it('should be activated', function(done) {
            this.timeout(10000);

            var doSpy = sinon.stub(mediator, 'setFilter', function(geojson) {
                mediator.getWFSFilter(filterData);
            });

            var selectedLayers = null;

            var self = this;
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

            sandbox.registerForEventByName(self, "AfterMapMoveEvent");
            sandbox.registerForEventByName(self, "AfterMapLayerAddEvent");
            sandbox.registerForEventByName(self, "WFSFeaturesSelectedEvent");
            sandbox.registerForEventByName(self, "FeatureData.FinishedDrawingEvent");

            // move map with projection coordinates
            sandbox.postRequestByName('MapMoveRequest', [385402, 6671502, 9]);

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 0);
            }, function() {
                expect(doSpy.callCount).to.be(1);
                doSpy.restore();
                done();
            }, 'Waiting for filter', 5000);
        });
    });

    describe('setting visibility', function() {
        before(startApplication);
        after(teardown);

        it('should be activated', function(done) {
            this.timeout(10000);

            var doSpy = sinon.stub(mediator, 'setMapLayerVisibility', function(id, visible) {
                if(visible == true) {
                    mediator.getWFSProperties(propertiesData);
                    mediator.getWFSFeature(featureData);
                    mediator.getWFSImage(imageData);
                }
            });

            // expect these events
            var properties = false;
            var feature = false;
            var image = false;

            var self = this;
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

            sandbox.registerForEventByName(self, "WFSPropertiesEvent");
            sandbox.registerForEventByName(self, "WFSFeatureEvent");
            sandbox.registerForEventByName(self, "WFSImageEvent");

            var selectedLayers = addLayers(module, [216]); // adds layer

            // check called once
            waitsFor(function() {
                return (doSpy.callCount > 1);
            }, function() {
                expect(doSpy.callCount).to.be(2);
                doSpy.restore();
            }, 'Waiting for visibility change', 5000);

            // finish
            waitsFor(function() {
                return (properties && feature && image);
            }, function() {
                done();
            }, 'Waiting for responses', 10000);
        });
    });
});
