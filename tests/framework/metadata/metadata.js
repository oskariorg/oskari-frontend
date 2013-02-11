describe('Test Suite for Metadata', function() {
    var appSetup = {
        "startupSequence": [{
            "instanceProps": {

            },
            "title": "OpenLayers",
            "bundleinstancename": "openlayers-default-theme",
            "fi": "OpenLayers",
            "sv": "?",
            "en": "OpenLayers",
            "bundlename": "openlayers-default-theme",
            "metadata": {
                "Import-Bundle": {
                    "openlayers-default-theme": {
                        "bundlePath": "../../../packages/openlayers/bundle/"
                    },
                    "openlayers-single-full": {
                        "bundlePath": "../../../packages/openlayers/bundle/"
                    },
                    "oskariui": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": [

                ]
            }
        }, {
            "instanceProps": {

            },
            "title": "Map",
            "bundleinstancename": "mapfull",
            "fi": "Map",
            "sv": "?",
            "en": "Map",
            "bundlename": "mapfull",
            "metadata": {
                "Import-Bundle": {
                    "service-base": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    },
                    "event-map-layer": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    },
                    "request-map-layer": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    },
                    "mapmodule-plugin": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    },
                    "event-base": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    },
                    "mapfull": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    },
                    "core-base": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    },
                    "request-base": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    },
                    "domain": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    },
                    "core-map": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    },
                    "oskariui": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    },
                    "request-map": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    },
                    "sandbox-base": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    },
                    "service-map": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    },
                    "sandbox-map": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    },
                    "event-map": {
                        "bundlePath": "../../../packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": [

                ]
            }
        }, {
            "instanceProps": {

            },
            "title": "Oskari DIV Manazer",
            "bundleinstancename": "divmanazer",
            "fi": "Oskari DIV Manazer",
            "sv": "?",
            "en": "Oskari DIV Manazer",
            "bundlename": "divmanazer",
            "metadata": {
                "Import-Bundle": {
                    "divmanazer": {
                        "bundlePath": "packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": [

                ]
            }
        }, {
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
            "title": "Metadata",
            "bundleinstancename": "metadata",
            "fi": "Metadata",
            "sv": "Metadata",
            "en": "Metadata",
            "bundlename": "metadata",
            "metadata": {
                "Import-Bundle": {
                    "metadata": {
                        "bundlePath": "packages/framework/bundle/"
                    }
                },
                "Require-Bundle-Instance": [

                ]
            }
        }]
    };
    var appConf = {
        "toolbar": {
            "state": {

            },
            "conf": {
                "history": false,
                "basictools": {
                    "zoombox": false,
                    "measureline": false,
                    "measurearea": false
                },
                "viewtools": false
            }
        },
        "mapfull": {
            "state": {
                "selectedLayers": [{
                    "id": "base_35"
                }],
                "zoom": 1,
                "east": "517620",
                "north": "6874042"
            },
            "conf": {
                "globalMapAjaxUrl": "/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_Portti2Map_WAR_portti2mapportlet_fi.mml.baseportlet.CMD=ajax.jsp&",
                "plugins": [{
                    "id": "Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin"
                }, {
                    "id": "Oskari.mapframework.mapmodule.WmsLayerPlugin"
                }, {
                    "id": "Oskari.mapframework.mapmodule.MarkersPlugin"
                }, {
                    "id": "Oskari.mapframework.mapmodule.ControlsPlugin"
                }, {
                    "id": "Oskari.mapframework.bundle.mapwfs.plugin.wfslayer.WfsLayerPlugin"
                }, {
                    "id": "Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin"
                }, {
                    "id": "Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar"
                }, {
                    "id": "Oskari.mapframework.bundle.mapmodule.plugin.PanButtons"
                }],
                "layers": [{
                    "type": "base",
                    "id": "base_35",
                    "name": "Taustakartta",
                    "subLayer": [{
                        "wmsName": "taustakartta_5k",
                        "type": "wmslayer",
                        "id": 184,
                        "minScale": 5000,
                        "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                        "maxScale": 1
                    }, {
                        "wmsName": "taustakartta_10k",
                        "type": "wmslayer",
                        "id": 185,
                        "minScale": 25001,
                        "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                        "maxScale": 5001
                    }, {
                        "wmsName": "taustakartta_20k",
                        "type": "wmslayer",
                        "id": 186,
                        "minScale": 40001,
                        "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                        "maxScale": 25000
                    }, {
                        "wmsName": "taustakartta_40k",
                        "type": "wmslayer",
                        "id": 187,
                        "minScale": 2,
                        "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                        "maxScale": 1
                    }, {
                        "wmsName": "taustakartta_80k",
                        "type": "wmslayer",
                        "id": 188,
                        "minScale": 56702,
                        "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                        "maxScale": 40000
                    }, {
                        "wmsName": "taustakartta_160k",
                        "type": "wmslayer",
                        "id": 189,
                        "minScale": 141742,
                        "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                        "maxScale": 56702
                    }, {
                        "wmsName": "taustakartta_320k",
                        "type": "wmslayer",
                        "id": 190,
                        "minScale": 283474,
                        "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                        "maxScale": 141742
                    }, {
                        "wmsName": "taustakartta_800k",
                        "type": "wmslayer",
                        "id": 191,
                        "minScale": 566939,
                        "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                        "maxScale": 283474
                    }, {
                        "wmsName": "taustakartta_2m",
                        "type": "wmslayer",
                        "id": 192,
                        "minScale": 1417333,
                        "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                        "maxScale": 566939
                    }, {
                        "wmsName": "taustakartta_4m",
                        "type": "wmslayer",
                        "id": 193,
                        "minScale": 2834657,
                        "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                        "maxScale": 1417333
                    }, {
                        "wmsName": "taustakartta_8m",
                        "type": "wmslayer",
                        "id": 194,
                        "minScale": 15000000,
                        "wmsUrl": "http://a.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://b.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://c.karttatiili.fi/dataset/taustakarttasarja/service/wms,http://d.karttatiili.fi/dataset/taustakarttasarja/service/wms",
                        "maxScale": 2834657
                    }],
                    "orgName": "Taustakartta",
                    "inspire": "Taustakartta"
                }],
                "imageLocation": "/Oskari/resources",
                "user": {
                    "lastName": "",
                    "nickName": "",
                    "userUUID": "",
                    "firstName": "",
                    "loginName": ""
                }
            }
        }
    };

    beforeEach(function(done) {
        jQuery("body").html('<nav id="maptools"><div id="loginbar"></div><div id="menubar"></div><div id="divider"></div><div id="toolbar"></div></nav><div id="contentMap"><div id="mapdiv"></div></div>');
        setupOskari(appSetup, appConf, done);
    });

    afterEach(function() {
        // The Flyout is injected into the DOM and needs to be removed manually as testacular doesn't do that
        jQuery("body > div").remove();
    });

    describe('Bundle tests', function() {

        it('should setup correctly MetadataSearch', function(done) {
            // Find handles to sandbox, search module and flyout
            var sandbox = Oskari.$("sandbox"),
                metadataModule = sandbox.findRegisteredModuleInstance('MetadataSearch');

            // Verify handles exist and have the functionality under test
            expect(sandbox).to.be.ok();
            expect(metadataModule).to.be.ok();
            expect(metadataModule.getName()).to.be('MetadataSearch');
            done();
        });

        it("should add buttons to toolbar", function(done) {
            expect(jQuery("#toolbar .toolrow .tool").length).to.equal(2);
            done();
        });

        it("should be able to draw a rectangle and listen to Metadata.FinishedDrawingEvent", function(done) {
            var sandbox = Oskari.$("sandbox");
            // Spy renderResults and doSearch to verify functions have been called
            var eventListenerSpy = sinon.spy(sandbox, 'notifyAll');

            // select metadata select area tool
            jQuery("#toolbar .tool.tool-selection-area").click();
            var map = sandbox.findRegisteredModuleInstance("MainMapModule").getMap();
            // mouse click
            simulateMouseClick(map, 200, 50);
            simulateMouseClick(map, 210, 60);
            // mouse doubleclick
            simulateMouseDblClick(map, 200, 70);

            // Verify the Toolbar is selected and that the selected area on the map has 3 components
            var toolSelected = sandbox.notifyAll.getCall(0);
            expect(toolSelected.args[0].getName()).to.equal("Toolbar.ToolSelectedEvent");
            var mapSelection = sandbox.notifyAll.getCall(4);
            expect(mapSelection.args[0].getName()).to.equal("Metadata.MapSelectionEvent");
            expect(mapSelection.args[0].getDrawing().components[0].components.length).to.equal(3);
            done();
        });
    });
});