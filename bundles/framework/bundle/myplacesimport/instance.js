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
    }
}, {
    start: function () {
        var me = this,
            conf = this.conf,
            sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
            sandbox = Oskari.getSandbox(sandboxName),
            request, importService;

        me.sandbox = sandbox;
        sandbox.register(this);

        /* stateful */
        if (conf && conf.stateful === true) {
            sandbox.registerAsStateful(this.mediator.bundleId, this);
        }

        importService = Oskari.clazz.create('Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService', this);
        sandbox.registerService(importService);
        importService.init();
        this.importService = importService;

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
    }
}, {
    "extend": ["Oskari.userinterface.extension.DefaultExtension"]
});
