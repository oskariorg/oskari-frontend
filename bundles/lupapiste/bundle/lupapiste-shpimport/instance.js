/**
 * @class Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundleInstance
 */
Oskari.clazz.define('Oskari.lupapiste.bundle.shpimport.ShpImportBundleInstance',
/**
 * @static constructor function
 */
function () {
    this.buttonGroup = 'myplaces';
    this.toolName = 'import';
    this.tool = {
        iconCls: 'upload-material',
        sticky: true
    };
    this.importService = undefined;
    this.importUrl = undefined;
    this.tab = undefined;
}, {
    /**
     * Registers itself to the sandbox, creates the tab and the service
     * and adds the flyout.
     *
     * @method start
     */
    start: function () {
        var me = this;
        var conf = this.conf;
        var sandboxName = (conf ? conf.sandbox : null) || 'sandbox';
        var sandbox = Oskari.getSandbox(sandboxName);
        var request;

        this.sandbox = sandbox;
        sandbox.register(this);

        // stateful
        if (conf && conf.stateful === true) {
            sandbox.registerAsStateful(this.mediator.bundleId, this);
        }

        if (conf.localImportUrl) {
            this.importUrl = location.protocol + "//" + location.hostname + "/" + conf.importUrl;
        } else {
            this.importUrl = conf.importUrl;
        }

        this.tab = this.addTab(sandbox);
        this.importService = this.createService(sandbox);
        this.importService.init();

        request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
        sandbox.request(this, request);

        this.registerTool();
    },
    /**
     * Requests the tool to be added to the toolbar.
     * 
     * @method registerTool
     */
    registerTool: function() {
        var me = this,
            loc = this.getLocalization(),
            sandbox = this.getSandbox(),
            reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest'),
            request;

        this.tool.callback = function() {
            me.startTool();
        };
        this.tool.tooltip = loc.tool.tooltip;

        if (reqBuilder) {
            request = reqBuilder(this.toolName, this.buttonGroup, this.tool);
            sandbox.request(this, request);
        }
    },
    /**
     * Opens the flyout when the tool gets clicked.
     * 
     * @method startTool
     */
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
    /**
     * Adds the user layer to the map layer service and to the map.
     * 
     * @method addUserLayer
     * @param {JSON} layerJson
     */
    addUserData: function (formValues, featuresJson) {
        if (!featuresJson) return;
        var me = this;
        var sandbox = this.getSandbox();
        var reqBuilder;
        var request;

        this.getService().addUserDataToService(formValues, featuresJson, function (features, values) {
            // refresh the tab
            me.getTab().addRow(features, values);
            me.getTab().refresh();
        });
    },
    /**
     * Creates the import service and registers it to the sandbox.
     * 
     * @method createService
     * @param  {Oskari.mapframework.sandbox.Sandbox} sandbox
     * @return {Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService}
     */
    createService: function(sandbox) {
        var importService = Oskari.clazz.create(
            'Oskari.lupapiste.bundle.shpimport.MyPlacesImportService',
            this, this.importUrl
        );
        sandbox.registerService(importService);
        return importService;
    },
    /**
     * Returns the import service.
     * 
     * @method getService
     * @return {Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService}
     */
    getService: function() {
        return this.importService;
    },
    /**
     * Creates the user layers tab and adds it to the personaldata bundle.
     * 
     * @method addTab
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * @return {Oskari.mapframework.bundle.myplacesimport.UserLayersTab}
     */
    addTab: function(sandbox) {
        var loc = this.getLocalization(),
            userLayersTab = Oskari.clazz.create(
                'Oskari.lupapiste.bundle.shpimport.UserLayersTab',
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
    /**
     * @method getTab
     * @return {Oskari.mapframework.bundle.myplacesimport.UserLayersTab}
     */
    getTab: function() {
        return this.tab;
    }
}, {
    "extend": ["Oskari.userinterface.extension.DefaultExtension"]
});
