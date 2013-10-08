// Skip until refactored enough so that testing is possible
describe.skip('Test Suite for integration/admin-layerselector bundle', function() {
    var appSetup = null,
        appConf = null,
        sandbox = null,
        adminLayerSelector = null,
        testLayer, testBaseLayer, testGroupLayer;

    before(function() {

        appSetup = getStartupSequence([
            'openlayers-default-theme',
            'mapfull',
            'divmanazer',
            'layerselector2',
            'admin-layerselector'
        ]);

        var mapfullConf = getConfigForMapfull();
        //mapfullConf.conf.layers.push({});

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
            // Set supported locales
            Oskari.setSupportedLocales(['fi_FI', 'sv_SE', 'en_US']);
            // Find handles to sandbox
            sandbox = Oskari.getSandbox();
            adminLayerSelector = sandbox.findRegisteredModuleInstance('admin-layerselector');
            done();
        });
    };

    describe('initialization', function() {
        before(startApplication);

        after(teardown);

        it('should be defined', function() {
            expect(sandbox).to.be.ok();
            expect(adminLayerSelector).to.be.ok();
        });
    });

    describe.skip('adding organizations', function() {
        before(startApplication);

        after(teardown);

        it('should be ok', function() {
            // We should probably stub the "_save" function from views/tabPanelView.js
            // so that we test the interface and not the server. But how? x___X
            var addOrgSpy = sinon.stub(),
                flyout = adminLayerSelector.plugins['Oskari.userinterface.Flyout'],
                container = flyout.ui.container;
            container.show();
            container.find('button.admin-add-org-btn').click();
            container.find('input#add-class-fi-name').val('testFi');
            container.find('input#add-class-sv-name').val('testSv');
            container.find('input#add-class-en-name').val('testEn');
            container.find('button.admin-add-org-ok').click();

            waitsFor(function() {
                return (addOrgSpy.callCount > 0);
            }, function() {
                // TODO: Test that the organization is found
                addOrgSpy.restore();
            }, 'Waiting for organization to save', 10000);
        });
    });

    describe.skip('adding normal layers', function() {
        before(startApplication);

        after(teardown);

        it('should be ok', function() {
            
        });
    });

    describe.skip('adding base layers', function() {
        before(startApplication);

        after(teardown);

        it('should be ok', function() {
            
        });
    });

    describe.skip('adding group layers', function() {
        before(startApplication);

        after(teardown);

        it('should be ok', function() {
            
        });
    });
});
