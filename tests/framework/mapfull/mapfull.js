describe('Test Suite for Mapfull', function() {
    var appSetup = null,
        appConf = null,
        module = null,
        sandbox = null;

    before(function() {

        // startup the oskari application with publisher bundle, 2 test layers and signed in user
        appSetup = getStartupSequence([
                'openlayers-default-theme',
                'mapfull'
            ]);

        var mapfullConf = getConfigForMapfull();
        appConf = {
            "mapfull": mapfullConf
        };
    });

    var startApplication = function(done) {
            //setup HTML
            jQuery("body").html(getDefaultHTML());
            // startup Oskari
            setupOskari(appSetup, appConf, function() {
                sandbox = Oskari.getSandbox();
                module = sandbox.findRegisteredModuleInstance('MainMapModule');
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

        it("should be 'EPSG:3067'", function() {
            // sandbox domain
            var projection = sandbox.getMap().getSrsName();
            expect(projection).to.be("EPSG:3067");
        });

        it("should be 'EPSG:3067'", function() {
            // map module
            var projection = module.getProjection();
            expect(projection).to.be("EPSG:3067");
        });

        it("should be 'EPSG:3067'", function() {
            // Openlayers Map
            var projection = module.getMap().getProjection();
            expect(projection).to.be("EPSG:3067");
        });
    });

    describe('projections with configuration "EPSG:4326" (Longitude/Latitude) ', function() {

        before(function(done) {
            appConf.mapfull.conf.mapOptions = {
                "srsName": "EPSG:4326"
            };
            startApplication(done);
        });

        after(function() {
            delete appConf.mapfull.conf.mapOptions;
            teardown();
        });

        it("sandbox projection should be 'EPSG:4326'", function() {
            // sandbox domain
            var projection = sandbox.getMap().getSrsName();
            expect(projection).to.be("EPSG:4326");
        });

        it("module projection should be 'EPSG:4326'", function() {
            // map module
            var projection = module.getProjection();
            expect(projection).to.be("EPSG:4326");
        });

        it("openlayers map projection should be 'EPSG:4326'", function() {
            // Openlayers Map
            var projection = module.getMap().getProjection();
            expect(projection).to.be("EPSG:4326");
        });

    });

    describe('added projection and projections with configuration "SR-ORG:6864" (Longitude/Latitude) ', function() {

        before(function(done) {
            appConf.mapfull.conf.projectionDefs = {
                "SR-ORG:6864": "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
                "EPSG:4326": "+title=WGS 84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
            };
            appConf.mapfull.conf.mapOptions = {
                "srsName": "SR-ORG:6864"
            };
            startApplication(done);
        });

        after(function() {
            delete appConf.mapfull.conf.projectionDefs;
            delete appConf.mapfull.conf.mapOptions;
            teardown();
        });

        it("sandbox projection should be 'SR-ORG:6864'", function() {
            // sandbox domain
            var projection = sandbox.getMap().getSrsName();
            expect(projection).to.be("SR-ORG:6864");
        });

        it("module projection should be 'SR-ORG:6864'", function() {
            // map module
            var projection = module.getProjection();
            expect(projection).to.be("SR-ORG:6864");
        });

        it("openlayers map projection should be 'SR-ORG:6864'", function() {
            // Openlayers Map
            var projection = module.getMap().getProjection();
            expect(projection).to.be("SR-ORG:6864");
        });

        it("should have projection 'SR-ORG:6864' in Proj4js.defs", function() {
            var projection = Proj4js.defs['SR-ORG:6864'];
            expect(projection).to.be.ok();
        });

        it("should move map with 'SR-ORG:6864' projection using event listening", function(done) {
            // sandbox domain
            var projection = sandbox.getMap().getSrsName();
            expect(projection).to.be("SR-ORG:6864");

            // faking to be module with getName/onEvent methods
            var self = this;
            self.getName = function() {
                return "Test.mapfull";
            }
            self.onEvent = function(event) {

                // verify the center is at 2820836.86915, 9494998.987169 see http://spatialreference.org/ref/sr-org/6864/ for coordinates
                var x = sandbox.getMap().getX(),
                    y = sandbox.getMap().getY();

                expect(x).to.be(2820835); // the coordinates are off by a bit, most likely due to transformation
                expect(y).to.be(9494985); // the coordinates are off by a bit, most likely due to transformation

                // cleanup
                sandbox.unregisterFromEventByName(self, "AfterMapMoveEvent");
                done();
            }

            // listen to AfterMapMoveEvent to trigger verification
            sandbox.registerForEventByName(self, "AfterMapMoveEvent");


            // move map with projection coordinates
            sandbox.postRequestByName('MapMoveRequest', [25.34, 64.715, 9, null, "EPSG:4326"]);
        });
    });

    describe('map move projection transformations', function() {
        before(function(done) {
            startApplication(done);
        });

        after(function() {
            teardown();
        });

        it("should move map with 'EPSG:4326' projection using event listening", function(done) {
            // sandbox domain
            var projection = sandbox.getMap().getSrsName();
            expect(projection).to.be("EPSG:3067");

            // faking to be module with getName/onEvent methods
            var self = this;
            self.getName = function() {
                return "Test.mapfull";
            }
            self.onEvent = function(event) {

                // verify the center is at 420893, 7177728 see http://spatialreference.org/ref/epsg/3067/ for coordinates
                var x = sandbox.getMap().getX(),
                    y = sandbox.getMap().getY();

                expect(x).to.be(420893);
                expect(y).to.be(7177728);

                // cleanup
                sandbox.unregisterFromEventByName(self, "AfterMapMoveEvent");
                done();
            }

            // listen to AfterMapMoveEvent to trigger verification
            sandbox.registerForEventByName(self, "AfterMapMoveEvent");


            // move map with projection coordinates
            sandbox.postRequestByName('MapMoveRequest', [25.34, 64.715, 9, null, "EPSG:4326"]);
        });

        /* Enable when postRequest is promised based and the event-based version above can be remove if used already in some other test, so that there will remain an example
        it("should move map with 'EPSG:4326' projection using promises", function(done) {
            // sandbox domain
            var projection = sandbox.getMap().getSrsName();
            expect(projection).to.be("EPSG:3067");

            // move map with projection coordinates
            var promise = sandbox.postRequestByName('MapMoveRequest', [25.34, 64.715, 9, null, "EPSG:4326"]);

            promise.fail(function(errorMessage) {
                expect().fail("An error should NOT be returned.");
                done();
            });
            promise.done(function() {
                // verify the center is at 420893, 7177728 see http://spatialreference.org/ref/epsg/3067/ for coordinates
                var x = sandbox.getMap().getX(),
                    y = sandbox.getMap().getY();

                expect(x).to.be(420893);
                expect(y).to.be(7177728);

                done();
            });
        });

        it("should not move map with 'ABCD:1234' projection", function(done) {
            // move map with projection coordinates
            var promise = sandbox.postRequestByName('MapMoveRequest', [25.34, 64.715, 9, null, "ABCD:1234"]);
            promise.fail(function(errorMessage) {
                expect(errorMessage).to.be("SrsName not supported!");
                done();
            });
            promise.done(function() {
                expect().fail("An error should be returned and handled.");
                done();
            });
        }); */
    });

    describe('map full screen mode', function() {
        var $contentMap, mapfull, fullScreenSpy;

        before(function(done) {
            startApplication(done);
        });

        after(function() {
            teardown();
        });

        beforeEach(function() {
            $contentMap = jQuery('#contentMap');
            mapfull = sandbox.getStatefulComponents()['mapfull'];
            fullScreenSpy = sinon.spy(mapfull, 'toggleFullScreen');
        });

        afterEach(function() {
            fullScreenSpy.restore();
        })

        it('should enter full screen mode', function(done) {
            sandbox.postRequestByName('MapFull.MapWindowFullScreenRequest');

            waitsFor(function() {
                return(fullScreenSpy.callCount > 0);
            }, function() {
                expect(fullScreenSpy.callCount).to.be(1);
                expect($contentMap.hasClass('oskari-map-window-fullscreen')).to.be.ok();
                mapfull.toggleFullScreen(); // Let's set the map back to normal mode.

                done();
            }, "Waits for full screen request", 30000);
        });

        it('should go back to normal mode', function(done) {
            mapfull.toggleFullScreen(); // To full screen mode.

            sandbox.postRequestByName('MapFull.MapWindowFullScreenRequest');

            waitsFor(function() {
                return(fullScreenSpy.callCount > 1);
            }, function() {
                expect(fullScreenSpy.callCount).to.be(2);
                expect($contentMap.hasClass('oskari-map-window-fullscreen')).not.to.be.ok();

                done();
            }, "Waits for full screen request", 30000);
        });
    });
});