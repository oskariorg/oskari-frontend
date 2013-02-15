describe('Test Suite for Data Source plugin', function() {
    var appSetup = null,
        appConf = null; 
 
    var mapModule = null,
        plugin = null, 
        pluginDiv = null;

    before(function() {
        printDebug('setup application config');
        // startup the oskari application with publisher bundle, 2 test layers and signed in user
        appSetup = getStartupSequence([
            'openlayers-default-theme', 
            'mapfull'
        ]);
    
        var mapfullConf = getConfigForMapfull();


        mapfullConf.conf.plugins.push({
            "id": "Oskari.mapframework.bundle.mapmodule.plugin.DataSourcePlugin"
        });

        // add some test layers
        mapfullConf.conf.layers.push({
            "type": "wmslayer",
            "id": "34",
            "metaType": "test",
            "orgName" : "Test organization",
            "dataUrl_uuid" : "testuuid",
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
            "orgName" : "Test organization",
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
			mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            plugin = mapModule.getPluginInstance('DataSourcePlugin');
            pluginDiv = jQuery('div.oskari-datasource');
            done();
        });
    };


    describe('should have', function() { 
 
        before(function(done) {
            printDebug('test 1 - before');
            startApplication(done);
        });

        after(function() {
            printDebug('test 1 - after');
            teardown();
        });

        it("UI", function() {
            expect(pluginDiv.length).to.be(1); 
        });

    });
 
});