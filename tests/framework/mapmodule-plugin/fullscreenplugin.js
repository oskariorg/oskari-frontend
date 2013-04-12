describe.only('Test Suite for full screen toggle plugin', function() {
    var appSetup = null,
        appConf = null; 
 
    var mapModule = null,
        plugin = null,
        pluginDiv = null, 
        localization = null;

    before(function() {
        appSetup = getStartupSequence([
            'openlayers-default-theme', 
            'mapfull',
            'divmanazer'
        ]);
    
        var mapfullConf = getConfigForMapfull();

        mapfullConf.conf.plugins.push({
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin"
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
            mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            plugin = mapModule.getPluginInstance('FullScreenPlugin');
            pluginDiv = jQuery('div.fullscreenDiv');
            done();
        });
    };

    describe('initialization', function() { 
        before(function(done) {
            startApplication(done);
        });

        after(function() {
            teardown(); 
        });

        it("should setup correctly", function() {
            expect(plugin.getName()).to.be('MainMapModuleFullScreenPlugin'); 
        });

        it("should be present in the DOM", function() {
            expect(pluginDiv.length).to.be(1); 
        });

        it("should have an image in the UI", function() {
            var img = pluginDiv.find('img.fullscreenDivImg');
            expect(img.length).to.be(1); 
        });
    });

    describe('full screen toggle', function() {
        before(function(done) {
            startApplication(done);
        });

        after(function() {
            teardown(); 
        });


        it('should send a MapWindowFullScreenRequest', function() {
            var img = pluginDiv.find('img.fullscreenDivImg'),
                mapfull = sandbox.getStatefulComponents()['mapfull'],
                reqHandler = mapfull.mapWindowFullScreenRequestHandler.handleRequest,
                requestSpy = sinon.spy(reqHandler);

            img.click();

            waitsFor(function() {
                return(requestSpy.callCount > 0);
            }, function() {
                expect(requestSpy.callCount).to.be(1);

                done();
            }, "Waits for full screen request via clik event", 30000);
        });
    })
});