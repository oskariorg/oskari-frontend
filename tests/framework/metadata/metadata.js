describe('Test Suite for Metadata', function() {
    var stateHandlerModule = null,
        sandbox = null,
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
        }]),
        mapfullConf = getConfigForMapfull(),
        appConf = {
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
            "mapfull": mapfullConf,
            "statehandler": {
                "state": {},
                "conf": {
                    "enable": true,
                    "url": "http://localhost:8080/logger/"
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

        //setup HTML
        jQuery("body").html(getDefaultHTML());
        // startup Oskari
        setupOskari(setup, conf, function() {
            // Find handles to sandbox and statehandler module
            sandbox = Oskari.$("sandbox");
            stateHandlerModule = sandbox.findRegisteredModuleInstance('StateHandler');
            done();
        });
    };

    beforeEach(startApplication);

    // Clear the DOM as testacular doesn't do it.
    afterEach(teardown);

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