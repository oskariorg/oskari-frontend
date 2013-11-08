describe.only('Test Suite for MapModule', function () {
    var appSetup = null,
        appConf = null,
        module = null,
        sandbox = null;

    before(function () {
        var mapfullConf = getConfigForMapfull();
        // startup the oskari application with publisher bundle, 2 test layers and signed in user
        mapfullConf.conf.layers.push({
            "type": "wmslayer",
            "id": "35", 
            "metaType": "test",
            "name": "Test layer wms",
            "wmsName": "testlayer",
            "type": "wmslayer",
            "permissions" : {
                "publish" : "publication_permission_ok"
            },
            "wmsUrl": "http://dummyUrl"
        });
        mapfullConf.conf.layers.push({
            "type": "wfslayer",
            "id": "36", 
            "metaType": "test",
            "name": "Test layer wfs",
            "wmsName": "testlayer",
            "type": "wmslayer",
            "permissions" : {
                "publish" : "publication_permission_ok"
            },
            "wmsUrl": "http://dummyUrl"
        });
        appSetup = getStartupSequence([
            'openlayers-default-theme',
            'mapfull'
        ]);

        appConf = {
            "mapfull": mapfullConf
        };
    });

    var startApplication = function (done) {
        //setup HTML
        jQuery("body").html(getDefaultHTML());
        // startup Oskari
        setupOskari(appSetup, appConf, function () {
            Oskari.setSupportedLocales(['fi_FI', 'sv_SE', 'en_US']);
            sandbox = Oskari.$("sandbox");
            module = sandbox.findRegisteredModuleInstance('MainMapModule');
            done();
        });
    };


    describe('should be localized', function () {

        before(function (done) {
            startApplication(done);
        });

        after(function () {
            teardown();
        });

        it("and localization should have same structures for fi, sv and en", function() {
            var result = matchLocalization('MapModule', ['fi', 'sv', 'en']);
            expect(result).to.be(true);
        });

    });

    describe('should use layerplugins to fetch layer implementations correctly', function () {

        before(function (done) {
            startApplication(done);
        });
 
        after(function () {
            teardown();
        });

        it("should return null on non-existing layer", function() {
            var nonExistingLayerImpl = module.getOLMapLayers(-1);
            expect(nonExistingLayerImpl).to.be(null);
        });

        it("should return preselected baselayers sublayers", function() {
            var preselectedLayerId = 'base_35';
            var layer = sandbox.findMapLayerFromSelectedMapLayers(preselectedLayerId);
            var layerImplementations = module.getOLMapLayers(preselectedLayerId);
            expect(layerImplementations.length).to.be(layer.getSubLayers().length);
        });

        it("should return added layer", function() {
            addLayers(module, [35, 36]);
            var layerImplementations = module.getOLMapLayers(35);
            expect(layerImplementations.length).to.be(1); 
        });
    });
});