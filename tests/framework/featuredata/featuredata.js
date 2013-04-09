describe('Test Suite for Featuredata', function() {
    var appSetup = null,
        appConf = null,
        module = null,
        sandbox = null;

    before(function() {

        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull', 'divmanazer',
        {
            "instanceProps": {

            },
            "title": "Toolbar",
            "bundleinstancename": "toolbar",
            "fi": "toolbar",
            "sv": "?",
            "en": "?",
            "bundlename": "toolbar",
            "metadata": {
                "Import-Bundle": {
                    "toolbar": {
                        "bundlePath": "packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": [

                ]
            }
        }, {
            "instanceProps": {

            },
            "title": "Featuredata",
            "bundleinstancename": "featuredata",
            "fi": "Kohdetiedot",
            "sv": "?",
            "en": "?",
            "bundlename": "featuredata",
            "metadata": {
                "Import-Bundle": {
                    "featuredata": {
                        "bundlePath": "packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": [

                ]
            }
        }]);

        var mapfullConf = getConfigForMapfull();
        // from GetMapLayers, check the JSON response in Firebug to select layer
        mapfullConf.conf.layers.push({
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
        appConf = {
            "toolbar": {
                "state": {

                },
                "conf": {
                    "history": false,
                    "basictools": false,
                    "viewtools": false
                }
            },
            "mapfull": mapfullConf,
            "featuredata": {
                "conf": {
                    "selectionTools": true
                }
            }
        };
    });

    var startApplication = function(done) {
            //setup HTML
            jQuery("body").html(getDefaultHTML());
            // startup Oskari
            setupOskari(appSetup, appConf, function() {
                sandbox = Oskari.$("sandbox");
                module = sandbox.findRegisteredModuleInstance('FeatureData');
                done();
            });
        };

    describe('projections without configuration', function() {

        before(function(done) {
            startApplication(done);
        });

        after(function() {
            teardown();
        });

        it('should setup correctly FeatureData', function(done) {

            // Verify handles exist and have the functionality under test
            expect(sandbox).to.be.ok();
            expect(module).to.be.ok();
            expect(module.getName()).to.be('FeatureData');
            done();
        });

        it("should add buttons to toolbar", function(done) {
            expect(jQuery("#toolbar .toolrow .tool").length).to.equal(1);
            done();
        });

        it("should be able to draw a rectangle and listen to Metadata.FinishedDrawingEvent", function(done) {
            var sandbox = Oskari.$("sandbox");
            var flyout = module.plugins['Oskari.userinterface.Flyout'];
            // Spy renderResults and doSearch to verify functions have been called
            var map = sandbox.findRegisteredModuleInstance("MainMapModule").getMap(),
                buttonElementArray = null,
                point = null,
                progressSpy = null;

            // Spy GridJsonService._processGridUpdate or Flyout._prepareData to verify functions have been called
            if(development) {
                var service = module.getService();
                // in development mode, use stub which is an extension of spy
                progressSpy = sinon.stub(service, '_processGridUpdate', function(params) {
                    var mapLayer = params.getMapLayer();
                    
                    // clear timer that called this method
                    service.pendingOperations[mapLayer.getId()].timer = null;
                    delete service.pendingOperations[mapLayer.getId()].timer;

                    params.getCallback()({
                        headers: {
                            width: 100,
                            dataIndex: "feature",
                            header: "Feature"
                        },
                        featureDatas: [{
                            feature_sv: "Palvelupisteiden kyselypalvelu",
                            feature_fi: "Palvelupisteiden kyselypalvelu",
                            children: [{
                                tmp_id: "14248",
                                fi_osoite: "L\xF6nnrotinkatu 18",
                                se_url_1: "www.oikeus.fi/vakuutusoikeus/7011.htm",
                                qName: "{www.pkartta.fi}toimipaikat",
                                en_osoite: "L\xF6nnrotinkatu 18",
                                en_puh_1: "029 56 43200",
                                fi_sposti_1: "vakuutusoikeus(at)oikeus.fi",
                                palveluluokka_2: "515",
                                se_puh_1: "029 56 43200",
                                se_puh_2: "029 56 43100",
                                fi_nimi: "Vakuutusoikeus",
                                se_sposti_1: "vakuutusoikeus(at)oikeus.fi",
                                postinumero: "00120",
                                en_url_1: "www.oikeus.fi/vakuutusoikeus/index.htm",
                                kuntakoodi: "091",
                                se_osoite: "L\xF6nnrotsgatan 18",
                                org_id: "806",
                                fi_url_1: "www.oikeus.fi/vakuutusoikeus/index.htm",
                                se_nimi: "F\xF6rs\xE4kringsdomstolen",
                                en_puh_2: "029 56 43100",
                                fi_puh_1: "029 56 43200",
                                en_sposti_1: "vakuutusoikeus(at)oikeus.fi",
                                fi_puh_2: "029 56 43100",
                                featureId: "toimipaikat.14248",
                                alku: "2012-08-11T11:49:09.296+03:00",
                                y: "6671577.0",
                                x: "385399.0",
                                en_nimi: "Vakuutusoikeus"
                            }, {
                                tmp_id: "4535",
                                fi_osoite: "L\xF6nnrotinkatu 20",
                                se_url_1: "http://www.maistraatti.fi",
                                qName: "{www.pkartta.fi}toimipaikat",
                                en_osoite: "L\xF6nnrotinkatu 20",
                                en_puh_1: "029 55 39391",
                                fi_sposti_1: "kirjaamo.helsinki@maistraatti.fi",
                                palveluluokka_2: "509",
                                se_puh_1: "029 55 39391",
                                en_aoa_poik: "ma - pe klo. 09:00 - 16:15",
                                fi_nimi: "Helsingin maistraatti / Holhoustoimi",
                                se_aoa_poik: "ma - pe klo. 09:00 - 16:15",
                                se_sposti_1: "kirjaamo.helsinki@maistraatti.fi",
                                postinumero: "00120",
                                en_url_1: "http://www.maistraatti.fi",
                                kuntakoodi: "091",
                                fi_aoa_poik: "ma - pe klo. 09:00 - 16:15",
                                se_osoite: "L\xF6nnrotinkatu 20",
                                org_id: "805",
                                fi_url_1: "http://www.maistraatti.fi",
                                se_nimi: "Helsingin maistraatti / Holhoustoimi",
                                fi_puh_1: "029 55 39391",
                                en_sposti_1: "kirjaamo.helsinki@maistraatti.fi",
                                featureId: "toimipaikat.4535",
                                alku: "2012-11-29T12:58:15.467+02:00",
                                y: "6671561.0",
                                x: "385373.0",
                                en_nimi: "Helsingin maistraatti / Holhoustoimi"
                            }],
                            feature_en: "Palvelupisteiden kyselypalvelu",
                            uiProvider: "col",
                            iconCls: "task-folder"
                        }],
                        wfsQueryId: "1"
                    });
                });
            } else {
                progressSpy = sinon.spy(flyout, '_prepareData');
            }

            // faking to be module with getName/onEvent methods
            var self = this;
            self.getName = function() {
                return "Test.featuredata";
            }
            self.onEvent = function(event) {
                if(event.getName() === "AfterMapMoveEvent") {
                    // add layers
                    var selectedLayers = addLayers(module, [216]);
                } else if(event.getName() === "AfterMapLayerAddEvent") {
                    // select metadata select area tool
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

                    //oskari-flyoutcontent featuredata
                    waitsFor(function() {
                        // check the spy has been called, then wait for the callback spy to have been called
                        return(progressSpy.callCount > 0);
                    }, function() {
                        // Verify the functions have been called once
                        expect(progressSpy.callCount).to.be(1);

                        // Check for the 3 search results
                        expect(jQuery("div.oskari-flyoutcontent.featuredata").find(".oskari-grid tbody tr").length).to.be(2);

                        // clean up
                        progressSpy.restore();
                        removeLayers(module);
                        sandbox.unregisterFromEventByName(self, "AfterMapMoveEvent");
                        sandbox.unregisterFromEventByName(self, "AfterMapLayerAddEvent");
                        sandbox.unregisterFromEventByName(self, "FeatureData.FinishedDrawingEvent");
                        done();
                    }, "Waits for feature data flyout to recieve updateData results", 30000);
                }
            }

            // listen to AfterMapMoveEvent to trigger verification
            sandbox.registerForEventByName(self, "AfterMapMoveEvent");

            // listen to AfterMapLayerAddEvent to trigger verification
            sandbox.registerForEventByName(self, "AfterMapLayerAddEvent");

            // listen to FinishedDrawingEvent to trigger verification
            sandbox.registerForEventByName(self, "FeatureData.FinishedDrawingEvent");

            // move map with projection coordinates
            sandbox.postRequestByName('MapMoveRequest', [385402, 6671502, 9]);

            // continues in event handler
        });

    });

});