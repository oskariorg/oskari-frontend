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
        iconCls: 'myplaces-draw-point',
        tooltip: '',
        sticky: true
    };
    this.importService = undefined;
    this.tab = undefined;
}, {
    start: function () {
        var conf = this.conf,
            sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
            sandbox = Oskari.getSandbox(sandboxName),
            loc = this.getLocalization(),
            request, importService, userLayersTab,
            addTabReqBuilder, addTabReq;

        this.sandbox = sandbox;
        sandbox.register(this);

        // stateful
        if (conf && conf.stateful === true) {
            sandbox.registerAsStateful(this.mediator.bundleId, this);
        }

        importService = Oskari.clazz.create(
            'Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService',
            this
        );
        sandbox.registerService(importService);
        importService.init();
        this.importService = importService;

        userLayersTab = Oskari.clazz.create(
            'Oskari.mapframework.bundle.myplacesimport.UserLayersTab',
            this, loc.tab
        );
        addTabReqBuilder = sandbox.getRequestBuilder('PersonalData.AddTabRequest');
        if (addTabReqBuilder) {
            addTabReq = addTabReqBuilder(loc.tab.title, userLayersTab.getContent());
            sandbox.request(this, addTabReq);
        }
        this.tab = userLayersTab;

        request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
        sandbox.request(this, request);

        this.registerTool();
    },

    registerTool: function() {
        var me = this,
            sandbox = this.getSandbox(),
            reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest'),
            request;

        this.tool.callback = function() {
            me.startTool();
        }

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

    getService: function() {
        return this.importService;
    },

    getTab: function() {
        return this.tab;
    }
}, {
    "extend": ["Oskari.userinterface.extension.DefaultExtension"]
});
