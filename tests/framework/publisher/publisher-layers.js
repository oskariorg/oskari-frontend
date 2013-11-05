describe('Test Suite for Publisher - Layer changes', function() {
    var appSetup = null,
        appConf = null; 
 
    var sandbox = null, 
        publisherModule = null,
        publisherView = null,
        flyout = null,
        localization = null,
        publisherStartView = null,
        publisherContent = null,
        layoutPanel = null,
        layoutPanelContent = null;

/*    var testFont = 'georgia',
        testColour = {
            val: 'blue',
            bgColour: '#0091FF',
            titleColour: '#FFFFFF',
            headerColour: '#0091FF',
            iconCls: 'icon-close-white'
        },
        testToolStyle = {
            val: '3d-dark',
            zoombar: {
                widthPlus: '23px', widthMinus: '23px', widthCenter: '23px',
                heightPlus: '35px', heightMinus: '36px', heightCenter: 13,
                heightCursor: '13px', widthCursor: '23px'
            },
            search: {
                widthLeft: '5px', widthRight: '44px'
            }
        };
*/
    before(function() {
        // startup the oskari application with publisher bundle, 1 test layer and a signed in user
        appSetup = getStartupSequence([
                'openlayers-default-theme', 
                'mapfull', 
                'divmanazer',
                'publisher'
            ]);
    
        var mapfullConf = getConfigForMapfull();
        // fake signed in user
        mapfullConf.conf.user = getDummyUser();
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
        var publisherConf = {
            "loginUrl": {
                "en": "http://dummyUrl/en/login",
                "fi": "http://dummyUrl/fi/login",
                "sv": "http://dummyUrl/sv/login"
            },
            "registerUrl": {
                "en": "http://dummyUrl/en/register",
                "fi": "http://dummyUrl/fi/register",
                "sv": "http://dummyUrl/sv/register"
            }, "conf" : {
                "urlPrefix": "www.paikkatietoikkuna.fi"
            }
        };
        appConf = { 
            "mapfull" : mapfullConf,
            "publisher" : publisherConf
        };
    });

    var startApplication = function(done) {
        //setup HTML
        jQuery("body").html(getDefaultHTML());  
        // startup Oskari
        setupOskari(appSetup, appConf, function() {
            // Set supported locales
            Oskari.setSupportedLocales(['fi_FI', 'sv_SE', 'en_US']);
            sandbox = Oskari.getSandbox();
            publisherModule = sandbox.findRegisteredModuleInstance('Publisher');
            flyout = publisherModule.plugins['Oskari.userinterface.Flyout']; 
            localization = publisherModule.getLocalization('BasicView');
            publisherStartView = jQuery('div.publisher');
            // Let's head straight to the basic publisher view
            publisherStartView.find('div.buttons input.primary').click();
            done();
        });
    };

    describe('layer panel', function() {
        before(function(done) {
            startApplication(function() {
                publisherView = publisherModule.publisher;
                done();
            })
        });

        after(teardown);

        it('should be visible', function() {
            publisherContent = jQuery('div.basic_publisher');
            var layersPanelTitle = localization.layers.label;
            layersPanel = publisherContent.
                find('div.accordion_panel div.header div:contains("' + layersPanelTitle + '")');
            layersPanelContent = layersPanel.parents('div.accordion_panel').find('div.content');

            expect(publisherContent.length).to.be(1);
            expect(layersPanel.length).to.be(1);
            expect(layersPanelContent.length).to.be(1);
        });

        it('should contain checkbox to show layers', function() {
            layersPanel.click();
            expect(layersPanelContent.find('input#show-map-layers-checkbox').length).to.be(1);
        });

        it('should show map layers when clicked', function() {
            layersPanelContent.find('input#show-map-layers-checkbox').click();
            expect(layersPanelContent.find('.selectedLayersList').length).to.be(1);
        });

    });
});