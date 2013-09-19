describe("Test Suite for analyse bundle's personal data tab" , function() {
    var appSetup = null,
        appConf = null,
        sandbox = null,
        analyseInstance = null,
        personalDataInstance = null,
        analyseView = null,
        testLayerId = 'analyse_test',
        analyseLayerPrefix = 'oskari_analyse_layer_',
        testLayerJSON = {
            "id": testLayerId,
            "type": "analysislayer",
            "metatype": "ANALYSIS",
            "name": "analyse test layer",
            "inspire": "Test inspire",
            "orgName": "Test organization"
        };

    before(function() {

        appSetup = getStartupSequence([
            'openlayers-default-theme',
            'mapfull',
            'divmanazer',
            'toolbar', 
            'personaldata',
            'analyse'
        ]);

        var mapfullConf = getConfigForMapfull();
        // fake signed in user
        mapfullConf.conf.user = getDummyUser();
        mapfullConf.conf.plugins.push({
            "id" : "Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin"
        });
        mapfullConf.conf.layers.push(testLayerJSON);
        // overwrite test wide appConf
        appConf = {
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
            // Find handles to sandbox and stats plugin.
            sandbox = Oskari.getSandbox();
            analyseInstance = sandbox.findRegisteredModuleInstance('Analyse');
            personalDataInstance = sandbox.findRegisteredModuleInstance('PersonalData');
            done();
        });
    };

    describe('initialization', function() {

        before(function(done) {
            startApplication(function() {
                done();
            });
        });

        after(teardown);

        it('should be defined', function() {
            expect(sandbox).to.be.ok();
            expect(analyseInstance).to.be.ok();
            expect(analyseInstance.personalDataTab).to.be.ok();
            expect(personalDataInstance).to.be.ok();
 
        });

        it('should have created a tab in personaldata bundle', function() {
            var personalDataFlyout = personalDataInstance.plugins['Oskari.userinterface.Flyout'];
            var tabContent = jQuery(personalDataFlyout.container).find('div.oskari-analysis-listing-tab');
            expect(tabContent.length).to.be(1);
        });
 
        it('should list analysis layers in tab', function() {
            var content = analyseInstance.personalDataTab.getContent();
            var layerNameInContent = content.find("a:contains('" + testLayerJSON.name + "')");
            expect(layerNameInContent.length).to.be(1);
        });


        it('should list analysis layers in tab', function(done) {
            var content = analyseInstance.personalDataTab.getContent();
            var layerNameInContent = content.find("a:contains('" + testLayerJSON.name + "')");

            // faking to be module with getName/onEvent methods 
            var self = this;
            self.getName = function() {
                return "Test.Analysis";
            }
            self.onEvent = function(event) {
                // we are happy if this method is called with the test layer id
                expect(event.getMapLayer().getId()).to.be(testLayerJSON.id);
                // cleanup
                sandbox.unregisterFromEventByName(self, "AfterMapLayerAddEvent"); 
                done();
            }

            // listen to AfterMapMoveEvent to trigger verification
            sandbox.registerForEventByName(self, "AfterMapLayerAddEvent");
            // check that the layer is added to map when clicking the layer name
            layerNameInContent.click();
        });
    });

    describe('layer added or removed', function() {
        var service = null,
            newLayer = null,
            newTestLayerJSON = {
            "id": "analysis_just_created_345",
            "type": "analysislayer",
            "metatype": "ANALYSIS",
            "name": "new analysis layer",
            "inspire": "Test inspire",
            "orgName": "Test organization"
        };
        
        
        before(function(done) {
            startApplication(function() {
                service = sandbox.getService('Oskari.mapframework.service.MapLayerService');
                newLayer = service.createMapLayer(newTestLayerJSON);
                done();
            });
        });

        after(teardown);

        it('should update the list of analysis layers when new layer is added', function() {
            // add new layer to the system
            service.addLayer(newLayer);

            var content = analyseInstance.personalDataTab.getContent();
            var oldLayerNameInContent = content.find("a:contains('" + testLayerJSON.name + "')");
            var newLayerNameInContent = content.find("a:contains('" + newTestLayerJSON.name + "')");

            // test that we have both layers present in the tab
            expect(oldLayerNameInContent.length).to.be(1);
            expect(newLayerNameInContent.length).to.be(1);
        });

        it('should update the list of analysis layers when new layer is added', function() {
            // remove new layer from the system
            service.removeLayer(newLayer.getId());
            
            var content = analyseInstance.personalDataTab.getContent();
            
            var oldLayerNameInContent = content.find("a:contains('" + testLayerJSON.name + "')");
            var newLayerNameInContent = content.find("a:contains('" + newTestLayerJSON.name + "')");

            // test that the layer is no longer listed
            expect(oldLayerNameInContent.length).to.be(1);
            expect(newLayerNameInContent.length).to.be(0);
        });
    });
});