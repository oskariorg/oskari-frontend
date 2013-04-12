describe('Test Suite for Metadata', function() {
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
            "mapfull": mapfullConf
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
            // Find handles to sandbox and statehandler module
            sandbox = Oskari.$("sandbox");
            module = sandbox.findRegisteredModuleInstance('MetadataSearch');
            done();
        });
    };

    describe('Bundle tests', function() {
        beforeEach(startApplication);

        // Clear the DOM as testacular doesn't do it.
        afterEach(teardown);

        it('should setup correctly MetadataSearch', function(done) {
            // Verify handles exist and have the functionality under test
            expect(sandbox).to.be.ok();
            expect(module).to.be.ok();
            expect(module.getName()).to.be('MetadataSearch');
            done();
        });

        it("should add buttons to toolbar", function(done) {
            expect(jQuery("#toolbar .toolrow .tool").length).to.equal(2);
            done();
        });

        it("should be able to draw a rectangle and listen to Metadata.FinishedDrawingEvent", function(done) {
            // faking to be module with getName/onEvent methods
            var self = this;
            self.getName = function() {
                return "Test.metadata";
            }
            self.onEvent = function(event) {
                if(event.getName() === "Metadata.MapSelectionEvent") {
                    // retrieve selected area from event
                    var selectedArea = event.getDrawing().components[0].components;
                    // The first and last point are identical to close the drawing, therefore 3 clicks becomes 4 points
                    expect(selectedArea.length).to.equal(4);

                    // clean up
                    sandbox.unregisterFromEventByName(self, "Metadata.MapSelectionEvent");
                    done();
                }
            }

            // listen to events to trigger verification and continue testing
            sandbox.registerForEventByName(self, "Metadata.MapSelectionEvent");

            // select metadata select area tool
            var buttonElementArray = jQuery("#toolbar .tool.tool-selection-area");
            expect(buttonElementArray.length).to.equal(1);
            buttonElementArray.click();

            // simulate clicks
            var map = sandbox.findRegisteredModuleInstance("MainMapModule").getMap();
            // mouse click
            simulateMouseClick(map, 200, 50);
            simulateMouseClick(map, 210, 60);
            // mouse doubleclick
            simulateMouseDblClick(map, 200, 70);
        });
    });
});