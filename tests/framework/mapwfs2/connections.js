/*
 * Tests for mapwfs2 connections (incoming and outgoing service channels).
 *
 * OBS! Because these are integration tests, sometimes the connection does not work
 * perfectly and some of the test cases might fail. In case that happens, just rerun the
 * tests and they should work. All of these tests require jetty + redis open with wfs2.
 */
describe('Test Suite for mapwfs2 connections', function() {
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
        },
        wfsConf = {
            hostname: 'localhost',
            contextPath: '/transport-0.0.1',
            port: '8888',
            lazy: false
        },
        cometd, imageURL;

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
                    hostname: wfsConf.hostname, 
                    contextPath: wfsConf.contextPath, 
                    port: wfsConf.port, 
                    lazy: wfsConf.lazy 
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
            sandbox = Oskari.getSandbox();
            module = sandbox.findRegisteredModuleInstance('MainMapModuleWfsLayerPlugin');
            mediator = module.getIO();
            /*mediator.session = {
                "clientId" : "testId",
                "session" : "test_session",
                "browser" : jQuery.browser.name,
                "browserVersion" : jQuery.browser.versionNum
            }*/
            connection = module.getConnection();

            done();
        });
    };

    describe('Channels', function() {
        before(startApplication);
        after(teardown);

        var imageSub, propertiesSub, featureSub, mapClickSub, filterSub;
        var imageResp       = false,
            propertiesResp  = false,
            featureResp     = false,
            mapClickResp    = false,
            filterResp      = false;

        function setSubscriptions() {
            imageSub = cometd.subscribe('/wfs/image', function(resp) {
                expect(resp.data).to.be.ok();
                // There should be no data.data key in under IE v. 8
                if (jQuery.browser.msie && jQuery.browser.versionNum < 8) {
                    expect(resp.data.data).not.to.be.ok();
                } else {
                    expect(resp.data.data).to.be.ok();
                }
                imageURL = resp.data.url;
                imageResp = true;
            });

            propertiesSub = cometd.subscribe('/wfs/properties', function(resp) {
                expect(resp.data).to.be.ok();
                expect(resp.data.layerId).to.be(216);
                expect(resp.data.fields).to.be.ok();
                propertiesResp = true;
            });

            featureSub = cometd.subscribe('/wfs/feature', function(resp) {
                expect(resp.data).to.be.ok();
                featureResp = true;
            });

            mapClickSub = cometd.subscribe('/wfs/mapClick', function(resp) {
                expect(resp).to.be.ok();
                expect(resp.data).to.be.ok();
                expect(resp.data.layerId).to.be(216);
                mapClickResp = true;
            });

            filterSub = cometd.subscribe('/wfs/filter', function(resp) {
                expect(resp).to.be.ok();
                expect(resp.data).to.be.ok();
                expect(resp.data.layerId).to.be(216);
                expect(resp.data.features).to.be.ok();
                filterResp = true;
            });
        }

        function removeSubscriptions() {
            cometd.unsubscribe(imageSub);
            cometd.unsubscribe(propertiesSub);
            cometd.unsubscribe(featureSub);
            cometd.unsubscribe(mapClickSub);
            cometd.unsubscribe(filterSub);

            imageResp       = false;
            propertiesResp  = false;
            featureResp     = false;
            mapClickResp    = false;
            filterResp      = false;
        }

        it('should be defined', function(done) {
            expect(connection).to.be.ok();
            expect(mediator).to.be.ok();

            waitsFor(function() {
                return connection.isConnected();
            }, function() {
                cometd = connection.get();
                expect(cometd).to.be.ok();
                done();
            }, 'Waits for the subscription', 20000);
        });

        it('should respond to /service/wfs/init', function(done) {
            setSubscriptions();

            cometd.publish('/service/wfs/init', {
                "session" : 'test_session',
                "language": Oskari.getLang(),
                "browser" : jQuery.browser.name,
                "browserVersion" : jQuery.browser.versionNum,
                "location": {
                    "srs": "EPSG:3067",
                    "bbox": [382396,6670334,389236,6672942],
                    "zoom": 8
                },
                "grid": {
                    "rows": 4,
                    "columns": 8,
                    "bounds": [[381952,6672384,382976,6673408],[382976,6672384,384000,6673408],[384000,6672384,385024,6673408],[385024,6672384,386048,6673408],[386048,6672384,387072,6673408],[387072,6672384,388096,6673408],[388096,6672384,389120,6673408],[389120,6672384,390144,6673408],[381952,6671360,382976,6672384],[382976,6671360,384000,6672384],[384000,6671360,385024,6672384],[385024,6671360,386048,6672384],[386048,6671360,387072,6672384],[387072,6671360,388096,6672384],[388096,6671360,389120,6672384],[389120,6671360,390144,6672384],[381952,6670336,382976,6671360],[382976,6670336,384000,6671360],[384000,6670336,385024,6671360],[385024,6670336,386048,6671360],[386048,6670336,387072,6671360],[387072,6670336,388096,6671360],[388096,6670336,389120,6671360],[389120,6670336,390144,6671360],[381952,6669312,382976,6670336],[382976,6669312,384000,6670336],[384000,6669312,385024,6670336],[385024,6669312,386048,6670336],[386048,6669312,387072,6670336],[387072,6669312,388096,6670336],[388096,6669312,389120,6670336],[389120,6669312,390144,6670336]]
                },
                "tileSize": {
                    "width": 256,
                    "height": 256
                },
                "mapSize": {
                    "width": sandbox.getMap().getWidth(),
                    "height": sandbox.getMap().getHeight()
                },
                "mapScales": [5669294.4, 2834647.2, 1417323.6, 566929.44, 283464.72, 141732.36, 56692.944, 28346.472, 11338.5888, 5669.2944, 2834.6472, 1417.3236, 708.6618],
                "layers": {'216': {'styleName': 'default'}}
            });
            
            waitsFor(function() {
                return (imageResp && propertiesResp && featureResp);
            }, function() {
                removeSubscriptions();
                console.log('/service/wfs/init succeeded');

                done();
            }, 'Waiting for response channels after "init"', 20000);
        });

        it('should respond to /service/wfs/removeMapLayer', function() {
            cometd.publish('/service/wfs/removeMapLayer', {
                "layerId": 216
            });
        });

        it('should respond to /service/wfs/addMapLayer', function() {
            cometd.publish('/service/wfs/addMapLayer', {
                "layerId": 216,
                "styleName": "default"
            });
        });

        it('should respond to /service/wfs/setLocation', function(done) {
            setSubscriptions();

            cometd.publish('/service/wfs/setLocation', {
                "layerId": 216,
                "srs": "EPSG:3067",
                "bbox": [382396,6670334,389236,6672942],
                "zoom": 8,
                "grid": {
                    "rows": 4,
                    "columns": 8,
                    "bounds": [[381952,6672384,382976,6673408],[382976,6672384,384000,6673408],[384000,6672384,385024,6673408],[385024,6672384,386048,6673408],[386048,6672384,387072,6673408],[387072,6672384,388096,6673408],[388096,6672384,389120,6673408],[389120,6672384,390144,6673408],[381952,6671360,382976,6672384],[382976,6671360,384000,6672384],[384000,6671360,385024,6672384],[385024,6671360,386048,6672384],[386048,6671360,387072,6672384],[387072,6671360,388096,6672384],[388096,6671360,389120,6672384],[389120,6671360,390144,6672384],[381952,6670336,382976,6671360],[382976,6670336,384000,6671360],[384000,6670336,385024,6671360],[385024,6670336,386048,6671360],[386048,6670336,387072,6671360],[387072,6670336,388096,6671360],[388096,6670336,389120,6671360],[389120,6670336,390144,6671360],[381952,6669312,382976,6670336],[382976,6669312,384000,6670336],[384000,6669312,385024,6670336],[385024,6669312,386048,6670336],[386048,6669312,387072,6670336],[387072,6669312,388096,6670336],[388096,6669312,389120,6670336],[389120,6669312,390144,6670336]]
                },
                "tiles": [[381952,6672384,382976,6673408],[382976,6672384,384000,6673408],[384000,6672384,385024,6673408],[385024,6672384,386048,6673408],[386048,6672384,387072,6673408],[387072,6672384,388096,6673408],[388096,6672384,389120,6673408],[389120,6672384,390144,6673408],[381952,6671360,382976,6672384],[382976,6671360,384000,6672384],[384000,6671360,385024,6672384],[385024,6671360,386048,6672384],[386048,6671360,387072,6672384],[387072,6671360,388096,6672384],[388096,6671360,389120,6672384],[389120,6671360,390144,6672384],[381952,6670336,382976,6671360],[382976,6670336,384000,6671360],[384000,6670336,385024,6671360],[385024,6670336,386048,6671360],[386048,6670336,387072,6671360],[387072,6670336,388096,6671360],[388096,6670336,389120,6671360],[389120,6670336,390144,6671360],[381952,6669312,382976,6670336],[382976,6669312,384000,6670336],[384000,6669312,385024,6670336],[385024,6669312,386048,6670336],[386048,6669312,387072,6670336],[387072,6669312,388096,6670336],[388096,6669312,389120,6670336],[389120,6669312,390144,6670336]]
            });

            waitsFor(function() {
                return (imageResp && propertiesResp && featureResp);
            }, function() {
                removeSubscriptions();
                console.log('/service/wfs/setLocation succeeded');

                done();
            }, 'Waiting for response channels after "setLocation"', 20000);
        });

        it('should respond to /service/wfs/setMapLayerStyle', function(done) {
            setSubscriptions();

            cometd.publish('/service/wfs/setMapLayerStyle', {
                "layerId": 216,
                "styleName": "default"
            });

            waitsFor(function() {
                return imageResp;
            }, function() {
                removeSubscriptions();
                console.log('/service/wfs/setMapLayerStyle succeeded');

                done();
            }, 'Waiting for response channels after "setMapLayerStyle"', 20000);
        });

        it('should respond to /service/wfs/setMapClick', function(done) {
            setSubscriptions();

            cometd.publish('/service/wfs/setMapClick', {
                "longitude": 386429.0,
                "latitude": 6671884.0,
                "keepPrevious": false
            });

            waitsFor(function() {
                return mapClickResp;
            }, function() {
                removeSubscriptions();
                console.log('/service/wfs/setMapClick succeeded');

                done();
            }, 'Waiting for response channel after "setMapClick"', 20000);
        });

        it('should respond to /service/wfs/setFilter', function(done) {
            setSubscriptions();

            cometd.publish('/service/wfs/setFilter', {
                "filter": {"geojson":{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[385124,6671744],[385130,6671270],[385604,6671276],[385598,6671750],[385124,6671744]]]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[385127,6671507]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[385367,6671273]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[385601,6671513]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[385361,6671747]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[385124,6671744]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[385130,6671270]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[385604,6671276]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[385598,6671750]}}],"crs":{"type":"EPSG","properties":{"code":3067}}}}
            });

            waitsFor(function() {
                return filterResp;
            }, function() {
                removeSubscriptions();
                console.log('/service/wfs/setFilter succeeded');

                done();
            }, 'Waiting for response channel after "setFilter"', 20000);
        });

        /*
         * THE LAYER SHOULD BE INVISIBLE TO START WITH!!!!!1!!1!11311321
         */
        it('should respond to /service/wfs/setMapLayerVisibility', function(done) {
            setSubscriptions();

            cometd.batch(function() {
                cometd.publish('/service/wfs/setMapLayerVisibility', {
                    "layerId": 216,
                    "visible": false
                });
                cometd.publish('/service/wfs/setMapLayerVisibility', {
                    "layerId": 216,
                    "visible": true
                });
            });

            waitsFor(function() {
                return imageResp;
            }, function() {
                removeSubscriptions();
                console.log('/service/wfs/setMapLayerVisibility succeeded');

                done();
            }, 'Waiting for response channels after "setMapLayerVisibility"', 20000);
        });

        it('should respond to /service/wfs/highlightFeatures', function(done) {
            setSubscriptions();

            cometd.publish('/service/wfs/highlightFeatures', {
                "layerId": 216,
                // Helsingin maistraatti / Holhoustoimi
                // Lönnrotinkatu 20
                "featureIds": ["toimipaikat.4535"],
                "keepPrevious": false
            });

            waitsFor(function() {
                return imageResp;
            }, function() {
                removeSubscriptions();
                console.log('/service/wfs/highlightFeatures succeeded');

                done();
            }, 'Waiting for response channels after "highlightFeatures"', 20000);
        });

        it('should respond to the image url', function(done) {
            setSubscriptions();

            cometd.publish('/service/wfs/setLocation', {
                "layerId": 216,
                "srs": "EPSG:3067",
                "bbox": [382396,6670334,389236,6672942],
                "zoom": 8,
                "grid": {
                    "rows": 4,
                    "columns": 8,
                    "bounds": [[381952,6672384,382976,6673408],[382976,6672384,384000,6673408],[384000,6672384,385024,6673408],[385024,6672384,386048,6673408],[386048,6672384,387072,6673408],[387072,6672384,388096,6673408],[388096,6672384,389120,6673408],[389120,6672384,390144,6673408],[381952,6671360,382976,6672384],[382976,6671360,384000,6672384],[384000,6671360,385024,6672384],[385024,6671360,386048,6672384],[386048,6671360,387072,6672384],[387072,6671360,388096,6672384],[388096,6671360,389120,6672384],[389120,6671360,390144,6672384],[381952,6670336,382976,6671360],[382976,6670336,384000,6671360],[384000,6670336,385024,6671360],[385024,6670336,386048,6671360],[386048,6670336,387072,6671360],[387072,6670336,388096,6671360],[388096,6670336,389120,6671360],[389120,6670336,390144,6671360],[381952,6669312,382976,6670336],[382976,6669312,384000,6670336],[384000,6669312,385024,6670336],[385024,6669312,386048,6670336],[386048,6669312,387072,6670336],[387072,6669312,388096,6670336],[388096,6669312,389120,6670336],[389120,6669312,390144,6670336]]
                },
                "tiles": [[381952,6672384,382976,6673408],[382976,6672384,384000,6673408],[384000,6672384,385024,6673408],[385024,6672384,386048,6673408],[386048,6672384,387072,6673408],[387072,6672384,388096,6673408],[388096,6672384,389120,6673408],[389120,6672384,390144,6673408],[381952,6671360,382976,6672384],[382976,6671360,384000,6672384],[384000,6671360,385024,6672384],[385024,6671360,386048,6672384],[386048,6671360,387072,6672384],[387072,6671360,388096,6672384],[388096,6671360,389120,6672384],[389120,6671360,390144,6672384],[381952,6670336,382976,6671360],[382976,6670336,384000,6671360],[384000,6670336,385024,6671360],[385024,6670336,386048,6671360],[386048,6670336,387072,6671360],[387072,6670336,388096,6671360],[388096,6670336,389120,6671360],[389120,6670336,390144,6671360],[381952,6669312,382976,6670336],[382976,6669312,384000,6670336],[384000,6669312,385024,6670336],[385024,6669312,386048,6670336],[386048,6669312,387072,6670336],[387072,6669312,388096,6670336],[388096,6669312,389120,6670336],[389120,6669312,390144,6670336]]
            });

            waitsFor(function() {
                return (imageResp && propertiesResp && featureResp);
            }, function() {
                var session = mediator.session.session //|| 'test_session';
                var url = mediator.rootURL + imageURL + '&session=' + session;

                jQuery.get(url)
                    .done(function(resp, status, xhr) {
                        var contentType = xhr.getResponseHeader('content-type');
                        expect(contentType).to.be('image/png');
                        console.log('/image succeeded');

                        removeSubscriptions();
                        done();
                    })
                    .fail(function(resp, status, statusText) {
                        console.log('/image FAILED: ' + resp.status + ' - ' + statusText);

                        removeSubscriptions();
                        done();
                    });
            }, 'Waiting for response channels after "setLocation"', 20000);

        });
    });
});
