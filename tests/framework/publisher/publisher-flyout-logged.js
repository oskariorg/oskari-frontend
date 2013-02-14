describe('Test Suite for Publisher - Logged in user', function() {
    var appSetup = null,
        appConf = null; 
 
    before(function(done) {
        // startup the oskari application with publisher bundle, 2 test layers and signed in user
        if(!appSetup) {
            appSetup = getStartupSequence([
                'openlayers-default-theme', 
                'mapfull', 
                'divmanazer',
                {
                    "instanceProps": {

                    },
                    "title": "Publisher",
                    "bundleinstancename": "publisher",
                    "fi": "Publisher",
                    "sv": "Publisher",
                    "en": "Publisher", 
                    "bundlename": "publisher",
                    "metadata": {
                        "Import-Bundle": {
                            "publisher": {
                                "bundlePath": "packages/framework/bundle/"
                            }
                        },
                        "Require-Bundle-Instance": [

                        ]
                    }
                }
            ]);
        
            var mapfullConf = getConfigForMapfull();
            // fake signed in user
            mapfullConf.conf.user = getDummyUser();
            // add some test layers
            mapfullConf.conf.layers.push({
                "type": "wmslayer",
                "id": "34",
                "metaType": "test",
                "name": "Test layer 1",
                "wmsName": "testlayer",
                "type": "wmslayer",
                "wmsUrl": "http://dummyUrl"
            });
            mapfullConf.conf.layers.push({
                "type": "wmslayer",
                "id": "35", 
                "metaType": "test",
                "name": "Test layer 2",
                "wmsName": "testlayer",
                "type": "wmslayer",
                "permissions" : {
                    "publish" : "publication_permission_ok"
                },
                "wmsUrl": "http://dummyUrl"
            });
            appConf = { 
                "mapfull" : mapfullConf
            };
        }

        //setup HTML
        jQuery("body").html(getDefaultHTML()); 
        // startup Oskari
        setupOskari(appSetup, appConf, done);
    });

    after(function() {
        // The Flyout is injected into the DOM and needs to be removed manually as testacular doesn't do that
        jQuery("body > div").remove();
    });

    it('should setup correctly Publisher', function(done) {
        checkPublisherStartup(done);
    }); 

    describe('should have flyout', function() { 
        var publisherModule = null,
            sandbox = null, 
            flyout = null,
            localization = null,
            flyoutLayerSelectionSpy = null,
            publisherContent = null;
 
        before(function() {
            sandbox = Oskari.$("sandbox");
            publisherModule = sandbox.findRegisteredModuleInstance('Publisher');
            flyout = publisherModule.plugins['Oskari.userinterface.Flyout']; 

            localization = publisherModule.getLocalization('StartView');
            flyoutLayerSelectionSpy = sinon.spy(flyout, 'handleLayerSelectionChanged');

            publisherContent = jQuery('div.publisher');
        });

        it("should NOT show login links", function() {
            var notLoggedInView = publisherContent.find('div.notLoggedIn');
            expect(notLoggedInView.length).to.be(0); 
        });

        it("should have startview", function() {
            var startView = publisherContent.find('div.startview');
            expect(startView.length).to.be(1); 
        });

        it("should have infotext", function() {
            var infoText = publisherContent.find("div:contains('" + localization.text + "')");
            expect(infoText.length).to.be(1); 
        });

        // TODO: test terms of use?

        describe('with startup layer listing', function() { 
            var selectedLayers = [],
                layerlists = null,
                publishableLayers = null,
                layerNameList = null;

            before(function() {
                selectedLayers = sandbox.findAllSelectedMapLayers();
                layerlists = publisherContent.find('div.layerlist');
                publishableLayers = jQuery(layerlists[0]);
                layerNameList = publishableLayers.find('li');
            });

            it("should have publishable layers", function() {
                expect(selectedLayers.length).to.be(1); 
            });

            it("should list ONLY publishable layers on flyout", function() {
                expect(layerlists.length).to.be(1); 
            });

            it("should have correct heading for layers list", function() {
                var title = publishableLayers.find("h4:contains('" + localization.layerlist_title + "')");
                expect(title.length).to.be(1); 
            });

            it("should list only one layer", function() {
                expect(layerNameList.length).to.be(1); 
            });

            it("should list the first selected layer", function() {
                var name = jQuery(layerNameList[0]).text();
                expect(name).to.be(selectedLayers[0].getName()); 
            });

        });

        describe('after removing all layers from selected', function() { 
            var selectedLayers = [],
                layerlists = null,
                publisherContent = null;

            before(function() {
                // remove selected layer
                selectedLayers = sandbox.findAllSelectedMapLayers();
                var rbRemove = sandbox.getRequestBuilder('RemoveMapLayerRequest');
                sandbox.request(publisherModule, rbRemove(selectedLayers[0].getId()));
                // get new reference after removal
                selectedLayers = sandbox.findAllSelectedMapLayers();
                publisherContent = jQuery('div.publisher');
                layerlists = publisherContent.find('div.layerlist');
            });

            it("should not any selected layers", function() {
                expect(selectedLayers.length).to.be(0); 
            });

            it("should have modified flyout", function() {
                expect(flyoutLayerSelectionSpy.callCount).to.be(1);
            });

            it("should NOT show layer listing", function() {
                expect(layerlists.length).to.be(0); 
            });

            it("should show an error if no layers are publishable", function() {
                var error = publisherContent.find(":contains('" + localization.layerlist_empty + "')");
                // FIXME: why is the error repeated 5 times?
                expect(error.length).to.be.greaterThan(0); 
            });
        });

        describe('after adding non-publishable layer', function() { 
            var selectedLayers = [],
                layerlists = null,
                publisherContent = null;

            before(function() {
                // add non-publishable layer
                var rbAdd = sandbox.getRequestBuilder('AddMapLayerRequest');
                sandbox.request(publisherModule, rbAdd(34, true));
                selectedLayers = sandbox.findAllSelectedMapLayers();

                publisherContent = jQuery('div.publisher');
                layerlists = publisherContent.find('div.layerlist');
            });

            it("should have layer selected", function() {
                expect(selectedLayers.length).to.be(1); 
            });
 
            it("should have modified flyout again", function() {
                expect(flyoutLayerSelectionSpy.callCount).to.be(2);
            });

            it("should NOT show layer listing", function() {
                expect(layerlists.length).to.be(0); 
            });

            it("should show an error if no layers are publishable", function() {
                var error = publisherContent.find(":contains('" + localization.layerlist_empty + "')");
                // FIXME: why is the error repeated 5 times?
                expect(error.length).to.be.greaterThan(0); 
            });
        });


        describe("after adding publishable layer",function() {
            var selectedLayers = [],
                layerlists = null,
                publishableLayers = null,
                nonPublishableLayers = null,
                layerNameList = null,
                layerNameListNonPublishable = null,
                publisherContent = null;

            before(function() {
                // add publishable layer
                var rbAdd = sandbox.getRequestBuilder('AddMapLayerRequest');
                sandbox.request(publisherModule, rbAdd(35, true));
                selectedLayers = sandbox.findAllSelectedMapLayers();

                publisherContent = jQuery('div.publisher');
                layerlists = publisherContent.find('div.layerlist');
                publishableLayers = jQuery(layerlists[0]);
                nonPublishableLayers = jQuery(layerlists[1]);
                layerNameList = publishableLayers.find('li');
                layerNameListNonPublishable = nonPublishableLayers.find('li');
            });

            it("should have 2 layers selected", function() {
                expect(selectedLayers.length).to.be(2); 
            });

            it("should list both publishable and nonpublishable layers", function() {
                expect(layerlists.length).to.be(2); 
            });

            it("should have modified flyout again", function() {
                expect(flyoutLayerSelectionSpy.callCount).to.be(3);
            });

            it("should have correct heading for publishable layers list", function() {
                var title = publishableLayers.find("h4:contains('" + localization.layerlist_title + "')");
                expect(title.length).to.be(1); 
            });

            it("should list only one publishable layer", function() {
                expect(layerNameList.length).to.be(1); 
            });

            it("should list layer(id=35) as publishable layer", function() {
                var publishableLayer = sandbox.findMapLayerFromSelectedMapLayers('35');
                var name = jQuery(layerNameList[0]).text();
                expect(name).to.be(publishableLayer.getName()); 
            });

            it("should have correct heading for non-publishable layers list", function() {
                var title = nonPublishableLayers.find("h4:contains('" + localization.layerlist_denied + "')");
                expect(title.length).to.be(1); 
            });

            it("should list only one non-publishable layer", function() {
                expect(layerNameListNonPublishable.length).to.be(1); 
            });

            it("should list layer(id=34) as non-publishable layer", function() {
                var nonpublishableLayer = sandbox.findMapLayerFromSelectedMapLayers('34');
                var name = jQuery(layerNameListNonPublishable[0]).text();
                expect(name).to.be(nonpublishableLayer.getName()); 
            });
        });
    });
});