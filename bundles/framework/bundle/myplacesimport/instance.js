/**
 * @class Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundleInstance',
/**
 * @static constructor function
 */
function () {
    this.conf = {
        "name": "MyPlacesImport",
        "sandbox": "sandbox",
        "flyoutClazz": "Oskari.mapframework.bundle.myplacesimport.Flyout"
    };
    this.buttonGroup = 'myplaces';
    this.toolName = 'import';
    this.tool = {
        iconCls: 'upload-material',
        sticky: true
    };
    this.importService = undefined;
    this.tab = undefined;
    this.layerType = 'userlayer';
}, {
    start: function () {
        var me = this,
            conf = this.conf,
            sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
            sandbox = Oskari.getSandbox(sandboxName),
            request;

        this.sandbox = sandbox;
        sandbox.register(this);

        // stateful
        if (conf && conf.stateful === true) {
            sandbox.registerAsStateful(this.mediator.bundleId, this);
        }

        this.tab = this.addTab(sandbox);
        this.importService = this.createService(sandbox);
        this.importService.init();
        this.importService.getUserLayers(function() {
            me.getTab().refresh();
        });

        request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
        sandbox.request(this, request);

        this.registerTool();
    },
    registerTool: function() {
        var me = this,
            loc = this.getLocalization(),
            sandbox = this.getSandbox(),
            reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest'),
            request;

        this.tool.callback = function() {
            me.startTool();
        }
        this.tool.tooltip = loc.tool.tooltip;

        if (reqBuilder) {
            request = reqBuilder(this.toolName, this.buttonGroup, this.tool);
            sandbox.request(this, request);
        }
    },
    startTool: function() {
        var sandbox = this.getSandbox(),
            reqBuilder = sandbox.getRequestBuilder('userinterface.UpdateExtensionRequest'),
            toolbarReqBuilder = sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest'),
            request, toolbarRequest;

        if (reqBuilder) {
            // open the flyout
            request = reqBuilder(this, 'attach', this.getName());
            sandbox.request(this, request);
        }

        if (toolbarReqBuilder) {
            // ask toolbar to select the default tool
            toolbarRequest = toolbarReqBuilder();
            sandbox.request(this, toolbarRequest);
        }
    },
    addUserLayer: function(layerJson) {
        if (!layerJson) return;

        var me = this,
            sandbox = this.getSandbox(),
            reqBuilder, request;

        this.getService().addLayerToService(layerJson, function(mapLayer) {
            // refresh the tab
            me.getTab().refresh();
            // Request the layer to be added to the map.
            requestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest');
            if (requestBuilder) {
                request = requestBuilder(mapLayer.getId());
                sandbox.request(me, request);
            }
        });
    },
    createService: function(sandbox) {
        var importService = Oskari.clazz.create(
            'Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService',
            this
        );
        sandbox.registerService(importService);
        return importService;
    },
    getService: function() {
        return this.importService;
    },
    addTab: function(sandbox) {
        var loc = this.getLocalization(),
            userLayersTab = Oskari.clazz.create(
                'Oskari.mapframework.bundle.myplacesimport.UserLayersTab',
                this, loc.tab
            ),
            addTabReqBuilder = sandbox.getRequestBuilder('PersonalData.AddTabRequest'),
            addTabReq;

        if (addTabReqBuilder) {
            addTabReq = addTabReqBuilder(loc.tab.title, userLayersTab.getContent());
            sandbox.request(this, addTabReq);
        }
        return userLayersTab;
    },
    getTab: function() {
        return this.tab;
    }
}, {
    "extend": ["Oskari.userinterface.extension.DefaultExtension"]
});
