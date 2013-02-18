describe('Test Suite for Data Source plugin', function() {
    var appSetup = null,
        appConf = null; 
 
    var mapModule = null,
        plugin = null, 
        localization = null,
        selectedLayers = [];

    before(function() {
        printDebug('setup application config');
        // startup the oskari application with publisher bundle, 2 test layers and signed in user
        appSetup = getStartupSequence([
            'openlayers-default-theme', 
            'mapfull',
            'divmanazer'
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
        //setup HTML 
        jQuery("body").html(getDefaultHTML()); 
        // startup Oskari
        setupOskari(appSetup, appConf, function() {
            sandbox = Oskari.$("sandbox");
			mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            plugin = mapModule.getPluginInstance('DataSourcePlugin');
            localization = mapModule.getLocalization('plugin')['DataSourcePlugin'];
            done();
        });
    };


    describe('should display popup', function() { 

        var dialogContent = null,
            pluginDiv = null;
 
        before(function(done) {
            startApplication(function() {
                selectedLayers = addLayers(mapModule, [34,35]);

                pluginDiv = jQuery('div.oskari-datasource');
                var link = pluginDiv.find('a');
                link.click();
                dialogContent = jQuery('div.divmanazerpopup');
 
                done();
            });

        });

        after(function() {
            teardown(); 
        });

        it("with heading", function() {
            var heading = dialogContent.find("h3:contains('" + localization.popup.title + "')");
            expect(heading.length).to.be(1);
        });

        it("with 3 selected layers", function() {
            expect(selectedLayers.length).to.be(3);
        });

        it("with organization heading matching selected layers listing", function() {
            
            var heading = dialogContent.find("b:contains('" + selectedLayers[1].getOrganizationName() + "')");
            expect(heading.length).to.be(1);
        });

        it("with 3 layers listed", function() {
            var items = dialogContent.find("li");
            expect(items.length).to.be(3);
        });

        it("with 1 metadata link", function() {
            var items = dialogContent.find("div.icon-info");
            expect(items.length).to.be(1);
        });
        
    });
 
    describe('should have', function() { 
 
        var pluginDiv = null;

        before(function(done) {
            startApplication(function() {
                pluginDiv = jQuery('div.oskari-datasource');
                done();
            });
        });

        after(function() {
            teardown(); 
        });

        it("plugin setup correctly", function() {
            expect(plugin.getName()).to.be('MainMapModuleDataSourcePlugin'); 
        });

        it("an UI", function() {
            expect(pluginDiv.length).to.be(1); 
        });

        it("a link in the UI", function() {
            var link = pluginDiv.find('a');
            expect(link.length).to.be(1); 
        });

        it("a dialog open from the link", function() {
            var linkSpy = sinon.spy(plugin, '_openDialog');
            var link = pluginDiv.find('a');
            link.click();
            expect(linkSpy.callCount).to.be(1);
        });
    });

 
    describe('should have 2', function() { 
 
        var pluginDiv = null;

        before(function(done) {
            startApplication(function() {
                pluginDiv = jQuery('div.oskari-datasource');
                done();
            });
        });

        after(function() {
            teardown(); 
        });

        it("plugin setup correctly", function() {
            expect(plugin.getName()).to.be('MainMapModuleDataSourcePlugin'); 
        });

        it("an UI", function() {
            expect(pluginDiv.length).to.be(1); 
        });

        it("a link in the UI", function() {
            var link = pluginDiv.find('a');
            expect(link.length).to.be(1); 
        });

        it("a dialog open from the link", function() {
            var linkSpy = sinon.spy(plugin, '_openDialog');
            var link = pluginDiv.find('a');
            link.click();
            expect(linkSpy.callCount).to.be(1);
        });
    });
});