describe('Test Suite for Publisher - Logged in user', function() {
    var appSetup = null,
        appConf = null; 
 
    before(function(done) {
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
        done();
    });

    beforeEach(function(done) {
        jQuery("body").html(getDefaultHTML()); 
        setupOskari(appSetup, appConf, done);
    });

    afterEach(function() {
        // The Flyout is injected into the DOM and needs to be removed manually as testacular doesn't do that
        jQuery("body > div").remove();
    });

    describe('Bundle tests', function() { 

        it('should setup correctly Publisher', function(done) {
            checkPublisherStartup(done);
        }); 

        it("should NOT show login links", function(done) {
            var sandbox = Oskari.$("sandbox"),
                publisherModule = sandbox.findRegisteredModuleInstance('Publisher'),
                flyout = publisherModule.plugins['Oskari.userinterface.Flyout']; 

            var notLoggedInView = jQuery('div.publisher').find('div.notLoggedIn');
            expect(notLoggedInView.length).to.be(0); 
            
            done();
        });

        it("should have infotext on flyout", function(done) {
            var sandbox = Oskari.$("sandbox"),
                publisherModule = sandbox.findRegisteredModuleInstance('Publisher'),
                flyout = publisherModule.plugins['Oskari.userinterface.Flyout']; 

            var localization = publisherModule.getLocalization('StartView');
            var publisherContent = jQuery('div.publisher');
            var startView = publisherContent.find('div.startview');
            expect(startView.length).to.be(1); 

            var infoText = publisherContent.find("div:contains('" + localization.text + "')");
            expect(infoText.length).to.be(1); 

            done();
        });
        it("should list publishable layers on flyout", function(done) {
            var sandbox = Oskari.$("sandbox"),
                publisherModule = sandbox.findRegisteredModuleInstance('Publisher'),
                flyout = publisherModule.plugins['Oskari.userinterface.Flyout']; 

            var localization = publisherModule.getLocalization('StartView');
            var publisherContent = jQuery('div.publisher');

            var selectedLayers = sandbox.findAllSelectedMapLayers();
            expect(selectedLayers.length).to.be(1); 

            var layerlists = publisherContent.find('div.layerlist');
            expect(layerlists.length).to.be(1); 

            var publishableLayers = jQuery(layerlists[0]);
            var title = publishableLayers.find("h4:contains('" + localization.layerlist_title + "')");
            expect(title.length).to.be(1); 

            var layerNameList = publishableLayers.find('li');
            var name = jQuery(layerNameList[0]).text();
            expect(name).to.be(selectedLayers[0].getName()); 
/*
            for(var i = 0; i < layerNameList.length; ++i) {
                var name = jQuery(layerNameList[i]).text();
                console.log(name);
            }
*/
/*
            <div class="layerlist">
<h4>Julkaistavissa olevat karttatasot</h4>
<ul>
<li>Taustakartat</li>
<li>Ortoilmakuva</li>
layerlist_empty
  */          
            done();
        });

        describe("no publishable layers",function() {
            var sandbox = null, 
                publisherModule = null, 
                flyout = null,
                localization = null,
                flyoutLayerSelectionSpy = null,
                selectedLayers = [];

 
            beforeEach(function() {
                // this needs to be in beforeEach (and not before) because the toplevel beforeEach is run 
                // before each it() call
                sandbox = Oskari.$("sandbox");
                publisherModule = sandbox.findRegisteredModuleInstance('Publisher');
                flyout = publisherModule.plugins['Oskari.userinterface.Flyout']; 

                localization = publisherModule.getLocalization('StartView');
                flyoutLayerSelectionSpy = sinon.spy(flyout, 'handleLayerSelectionChanged');
                
                var rbRemove = sandbox.getRequestBuilder('RemoveMapLayerRequest');
                sandbox.request(publisherModule, rbRemove('base_35'));
                selectedLayers = sandbox.findAllSelectedMapLayers();
                selectedLayers = sandbox.findAllSelectedMapLayers();
            });


            it("should have modified flyout", function(done) {
                expect(flyoutLayerSelectionSpy.callCount).to.be(1);
                done();
            });

            it("should not have any layers to publish", function(done) {
                expect(selectedLayers.length).to.be(0); 
                done();
            });

            it("should show an error if no layers are publishable", function(done) {
                var publisherContent = jQuery('div.publisher');

                var layerlists = publisherContent.find('div.layerlist');
                expect(layerlists.length).to.be(0); 
                done();
            });

            it("should show an error if no layers are publishable", function(done) {
                var publisherContent = jQuery('div.publisher');

                var error = publisherContent.find(":contains('" + localization.layerlist_empty + "')");
                // FIXME: 5 because the error is repeated for each test
                expect(error.length).to.be(5); 
                done();
            });

        });

 
        it("should modify flyout when layers are changed", function(done) {
            var sandbox = Oskari.$("sandbox"),
                publisherModule = sandbox.findRegisteredModuleInstance('Publisher'),
                flyout = publisherModule.plugins['Oskari.userinterface.Flyout']; 

            // Spy that we get events 
            // 'AfterMapLayerAddEvent', 'AfterMapLayerRemoveEvent', 'AfterMapLayerAddEvent', 'MapLayerEvent'
            var eventListenerSpy = sinon.spy(publisherModule.eventHandlers, 'AfterMapLayerAddEvent');
            //var flyoutLayerSelectionSpy = sinon.spy(flyout, 'handleLayerSelectionChanged');
            
            var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
            var testLayers = mapLayerService.getAllLayersByMetaType('test');
            expect(testLayers.length).to.equal(2);

            var rbAdd = sandbox.getRequestBuilder('AddMapLayerRequest');
            sandbox.request(publisherModule, rbAdd(34, true));
 
            /*var testLayer1 = testLayers[0]; 
            var event = sandbox.getEventBuilder('AfterMapLayerAddEvent')(testLayer1, false, false);
            sandbox.notifyAll(event); 
*/
            // TODO: send addmaplayer event  
            //...
            /*
            var addCall = publisherModule.eventHandlers.AfterMapLayerAddEvent.getCall(0);
            expect(addCall.args[0].getName()).to.equal('AfterMapLayerAddEvent'); 
*/
            //var flyoutCall = flyout.handleLayerSelectionChanged.getCall(0);
            //expect(flyoutLayerSelectionSpy.callCount).to.be(1);
            
            done();
        });
    });
});