describe.only('Test Suite for Publisher - Layout changes', function() {
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

    var testFont = 'georgia',
        testColour = {
            val: 'blue',
            bgColour: '#0091FF',
            titleColour: '#FFFFFF',
            headerColour: '#0091FF',
            iconCls: 'icon-close-white'
        },
        testToolStyle = '3d-dark';

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
        appConf = { 
            "mapfull" : mapfullConf
        };
    });

    var startApplication = function(done) {
        //setup HTML
        jQuery("body").html(getDefaultHTML());  
        // startup Oskari
        setupOskari(appSetup, appConf, function() {
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

    describe('layout panel', function() {
        before(function(done) {
            startApplication(function() {
                publisherView = publisherModule.publisher;
                done();
            })
        });

        after(teardown);

        it('should be visible', function() {
            publisherContent = jQuery('div.basic_publisher');
            var layoutPanelTitle = localization.layout.label;
            layoutPanel = publisherContent.
                find('div.accordion_panel div.header div:contains("' + layoutPanelTitle + '")');
            layoutPanelContent = layoutPanel.parents('div.accordion_panel').find('div.content');

            expect(publisherContent.length).to.be(1);
            expect(layoutPanel.length).to.be(1);
            expect(layoutPanelContent.length).to.be(1);
        });

        it('should contain inputs to change the styling', function() {
            expect(layoutPanelContent.find('div#publisher-layout-colours').length).to.be(1);
            expect(layoutPanelContent.find('div#publisher-layout-fonts').length).to.be(1);
            expect(layoutPanelContent.find('div#publisher-layout-toolStyles').length).to.be(1);
        });

        it('should open a popup to change the colour scheme', function() {
            var popupOpener = layoutPanelContent.find('button#publisher-colours');
            popupOpener.click();
            var popup = jQuery('div#publisher-colour-popup');
            expect(popup.length).to.be(1);
        });

        it('should change the colour scheme to blue when the blue input is clicked', function(done) {
            var popup = jQuery('div#publisher-colour-popup');
            var colourChangedStub = sinon.stub(publisherView.layoutPanel, '_sendColourSchemeChangedEvent');
            popup.find('input#blue').change();

            waitsFor(function() {
                return colourChangedStub.callCount > 0;
            }, function() {
                var colourInput = layoutPanelContent.find('div#publisher-layout-colours input[name=publisher-colour]');
                expect(colourInput.attr('data-colour-code')).to.be(testColour.val);
                expect(colourChangedStub.callCount).to.be(1);
                expect(colourChangedStub.calledWith(testColour)).to.be.ok();

                colourChangedStub.restore();
                done();
            }, 'Waiting for colour changed event', 5000);
        });

        it('should change the font to "Georgia" when chosen from the select', function(done) {
            var fontChangedStub = sinon.stub(publisherView.layoutPanel, '_sendFontChangedEvent');
            var fontSelect = layoutPanelContent.find('div#publisher-layout-fonts select[name=publisher-fonts]');
            fontSelect.val(testFont).change();

            waitsFor(function() {
                return fontChangedStub.callCount > 0;
            }, function() {
                expect(fontChangedStub.callCount).to.be(1);
                expect(fontChangedStub.calledWith(testFont)).to.be.ok();

                fontChangedStub.restore();
                done();
            }, 'Waiting for font changed event', 5000);
        });

        it('should change the tool style to "3d-dark" when chosen from the select', function(done) {
            var toolStyleChangedStub = sinon.stub(publisherView.layoutPanel, '_sendToolStyleChangedEvent');
            var toolStyleSelect = layoutPanelContent.find('div#publisher-layout-toolStyles select[name=publisher-toolStyles]');
            toolStyleSelect.val(testToolStyle).change();

            waitsFor(function() {
                return toolStyleChangedStub.callCount > 0;
            }, function() {
                expect(toolStyleChangedStub.callCount).to.be(1);
                expect(toolStyleChangedStub.calledWith(testToolStyle)).to.be.ok();

                toolStyleChangedStub.restore();
                done();
            }, 'Waiting for font changed event', 5000);
        });

        it('should return correct values', function() {
            var testValues = publisherView.layoutPanel.getValues();
            expect(testValues.colourScheme).to.eql(testColour);
            expect(testValues.font).to.be(testFont);
            expect(testValues.toolStyle).to.be(testToolStyle);
        })
    });
});