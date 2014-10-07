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
        sticky: false
    };
    this.importService = undefined;
    this.tab = undefined;
    this.layerType = 'userlayer';
}, {
    /**
     * Registers itself to the sandbox, creates the tab and the service
     * and adds the flyout.
     *
     * @method start
     */
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
        var isGuest = !sandbox.getUser().isLoggedIn();

        if (isGuest) {
            // guest user, only show disabled button
            this.tool.disabled = true;
        } else {
            // logged in user, create UI
            this.tab = this.addTab(sandbox);
            this.importService = this.createService(sandbox);
            this.importService.init();
            this.importService.getUserLayers(function() {
                me.getTab().refresh();
            });

            request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);
        }
        
        this.registerTool(isGuest);
    },
    /**
     * Requests the tool to be added to the toolbar.
     * 
     * @method registerTool
     */
    registerTool: function(isGuest) {
        var me = this,
            loc = this.getLocalization(),
            sandbox = this.getSandbox(),
            reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest'),
            request;
        this.tool.callback = function() {
            if(!isGuest) {
                // toolbar requires a callback so we need to check guest flag
                // inside callback instead of not giving any callback
                me.startTool();
            }
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
    /**
     * Creates the import service and registers it to the sandbox.
     * 
     * @method createService
     * @param  {Oskari.mapframework.sandbox.Sandbox} sandbox
     * @return {Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService}
     */
    createService: function(sandbox) {
        var importService = Oskari.clazz.create(
            'Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService',
            this
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
