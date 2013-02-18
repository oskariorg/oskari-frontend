describe('Test Suite for Publisher - Logged in user', function() {
    var appSetup = null,
        appConf = null; 
 
    var publisherModule = null,
        sandbox = null, 
        flyout = null,
        localization = null,
        flyoutLayerSelectionSpy = null,
        selectedLayers = [],
        publisherContent = null;

    before(function() {
        printDebug('setup application config');
        // startup the oskari application with publisher bundle, 2 test layers and signed in user
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
    });

    var startApplication = function(done) {
        printDebug('setup page & oskari app');
        //setup HTML
        jQuery("body").html(getDefaultHTML());  
        // startup Oskari
        setupOskari(appSetup, appConf, function() {
            sandbox = Oskari.$("sandbox");
            publisherModule = sandbox.findRegisteredModuleInstance('Publisher'); 
            flyout = publisherModule.plugins['Oskari.userinterface.Flyout']; 
            localization = publisherModule.getLocalization('StartView');
            flyoutLayerSelectionSpy = sinon.spy(flyout, 'handleLayerSelectionChanged');
            selectedLayers = sandbox.findAllSelectedMapLayers();
            publisherContent = jQuery('div.publisher');
            done();
        });
    };

    describe('should be localized', function() { 
 
        before(function(done) {
            printDebug('test loc - before');
            startApplication(done);
        });

        after(function() {
            printDebug('test loc - after');
            teardown();
        }); 

        it("and localization should have same structures for fi, sv and en", function() {
            var result = matchLocalization(publisherModule.getName(), ['fi', 'sv', 'en']);
            expect(result).to.be(true);
        });

    });

    describe('should have flyout', function() { 
 
        before(function(done) {
            printDebug('test 1 - before');
            startApplication(done);
        });

        after(function() {
            printDebug('test 1 - after');
            teardown();
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
    });
 
    describe('with startup layer listing', function() { 
        var layerlists = null,
            publishableLayers = null,
            layerNameList = null;

        before(function(done) {
            printDebug('test 2 - before');
            startApplication(function() {
                layerlists = publisherContent.find('div.layerlist');
                publishableLayers = jQuery(layerlists[0]);
                layerNameList = publishableLayers.find('li');
                done();
            });

        });
        after(function() {
            printDebug('test 2 - after');
            teardown();
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
        var layerlists = null;

        before(function(done) {
            printDebug('test 3 - before');
            startApplication(function() {
                selectedLayers = removeLayers(publisherModule);
                layerlists = publisherContent.find('div.layerlist');
                done();
            });

        });
        after(function() {
            printDebug('test 3 - after');
            teardown();
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
        var layerlists = null;

        before(function(done) {
            printDebug('test 4 - before');
            startApplication(function() {
                removeLayers(publisherModule);
                selectedLayers = addLayers(publisherModule, [34]);

                layerlists = publisherContent.find('div.layerlist');
                done();
            });

        });
        after(function() {
            printDebug('test 4 - after');
            teardown();
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
        var layerlists = null,
            publishableLayers = null,
            nonPublishableLayers = null,
            layerNameList = null,
            layerNameListNonPublishable = null;


        before(function(done) {
            printDebug('test 5 - before');
            startApplication(function() {
                removeLayers(publisherModule);
                selectedLayers = addLayers(publisherModule, [34, 35]);

                layerlists = publisherContent.find('div.layerlist');
                publishableLayers = jQuery(layerlists[0]);
                nonPublishableLayers = jQuery(layerlists[1]); 
                layerNameList = publishableLayers.find('li');
                layerNameListNonPublishable = nonPublishableLayers.find('li');
                done();
            });

        });

        after(function() {
            printDebug('test 5 - after');
            teardown();
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