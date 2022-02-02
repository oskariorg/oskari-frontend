import { showLayerForm } from './view/LayerForm';
import { TOOL, BUNDLE_NAME, MAX_SIZE, ERRORS } from './constants';

/**
 * @class Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundleInstance', function () {
    this.importService = undefined;
    this.mapLayerService = null;
    this.tab = undefined;
    this.loc = Oskari.getMsg.bind(null, BUNDLE_NAME);
    this.popupControls = null;
    this.popupCleanup = () => {
        if (this.popupControls) {
            this.popupControls.close();
        }
        this.popupControls = null;
    };
}, {
    __name: BUNDLE_NAME,

    /**
     * Registers itself to the sandbox, creates the tab and the service
     * and adds the flyout.
     *
     * @method start
     */
    _startImpl: function () {
        if (Oskari.user().isLoggedIn()) {
            // logged in user, create UI
            this.addTab();
            this.createService();
            this.getService().getUserLayers();
        }
        this.registerTool();
    },
    /**
     * Requests the tool to be added to the toolbar.
     *
     * @method registerTool
     */
    registerTool: function () {
        const sandbox = this.getSandbox();
        const reqBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
        const loggedIn = Oskari.user().isLoggedIn();
        const toolBtn = {
            iconCls: TOOL.ICON,
            sticky: false,
            disabled: !loggedIn,
            tooltip: this.loc('tool.tooltip')
        };
        toolBtn.callback = () => {
            if (loggedIn) {
                // toolbar requires a callback so we need to check guest flag
                // inside callback instead of not giving any callback
                this.startTool();
            }
        };
        if (reqBuilder) {
            sandbox.request(this, reqBuilder(TOOL.NAME, TOOL.GROUP, toolBtn));
        }
    },
    /**
     * Opens the flyout when the tool gets clicked.
     *
     * @method startTool
     */
    startTool: function () {
        const toolbarReqBuilder = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest');
        this.openLayerDialog();
        if (toolbarReqBuilder) {
            // ask toolbar to select the default tool
            this.getSandbox().request(this, toolbarReqBuilder());
        }
    },
    getSandbox: function () {
        if (!this.sandbox) {
            this.sandbox = Oskari.getSandbox(this.conf.sandbox);
        }
        return this.sandbox;
    },
    getMapLayerService: function () {
        if (!this.mapLayerService) {
            this.mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        }
        return this.mapLayerService;
    },
    openLayerDialog: function (values = {}) {
        const { id } = values;
        const isImport = !id;
        const conf = {
            maxSize: this.getMaxSize(),
            isImport
        };
        const onSuccess = () => this.popupCleanup();
        const onError = (error = ERRORS.GENERIC) => {
            if (this.popupControls) {
                this.popupControls.update(error);
            }
        };
        const save = values => this.getService().submitUserLayer(values, onSuccess, onError);
        const update = values => this.getService().updateUserLayer(id, values, onSuccess, onError);
        // create popup
        const onOk = isImport ? save : update;
        this.popupControls = showLayerForm(values, conf, onOk, this.popupCleanup);
    },
    getMaxSize: function () {
        const confMax = this.conf.maxFileSizeMb;
        return isNaN(confMax) ? MAX_SIZE : parseInt(confMax);
    },
    /**
     * Creates the import service and registers it to the sandbox.
     *
     * @method createService
     * @return {Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService}
     */
    createService: function () {
        const sandbox = this.getSandbox();
        const importService = Oskari.clazz.create(
            'Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService',
            this
        );
        sandbox.registerService(importService);
        importService.init();
        importService.on('update', () => {
            this.getTab().refresh();
        });
        this.importService = importService;
    },
    /**
     * Returns the import service.
     *
     * @method getService
     * @return {Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService}
     */
    getService: function () {
        return this.importService;
    },
    /**
     * Creates the user layers tab and adds it to the personaldata bundle.
     *
     * @method addTab
     * @param {Oskari.Sandbox} sandbox
     * @return {Oskari.mapframework.bundle.myplacesimport.UserLayersTab}
     */
    addTab: function () {
        const userLayersTab = Oskari.clazz.create('Oskari.mapframework.bundle.myplacesimport.UserLayersTab', this);
        const addTabReqBuilder = Oskari.requestBuilder('PersonalData.AddTabRequest');

        if (addTabReqBuilder) {
            this.getSandbox().request(this, addTabReqBuilder(this.loc('tab.title'), userLayersTab.getContent(), false, 'userlayers'));
        }
        this.tab = userLayersTab;
    },
    /**
     * @method getTab
     * @return {Oskari.mapframework.bundle.myplacesimport.UserLayersTab}
     */
    getTab: function () {
        return this.tab;
    }
}, {
    extend: ['Oskari.BasicBundle'],
    protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
