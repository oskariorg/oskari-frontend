import { showLayerForm } from './view/LayerForm';
import { UserLayersTab } from './UserLayersTab';
import { UserLayersHandler } from './handler/UserLayersHandler';
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
            if (!this.popupControls.id) {
                // select default tool when import popup is closed (started from sticky tool)
                this.getSandbox().postRequestByName('Toolbar.SelectToolButtonRequest');
            }
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
            this.createService();
            this.getService().getUserLayers();
            this.addTab();
            this.requestHandlers = {
                showUserLayerDialogRequestHandler: Oskari.clazz.create('Oskari.mapframework.bundle.myplacesimport.request.ShowUserLayerDialogRequestHandler', this)
            };
            Oskari.getSandbox().requestHandler('MyPlacesImport.ShowUserLayerDialogRequest', this.requestHandlers.showUserLayerDialogRequestHandler);
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
            sticky: true,
            disabled: !loggedIn,
            tooltip: this.loc('tool.tooltip')
        };
        toolBtn.callback = () => {
            if (loggedIn) {
                // toolbar requires a callback so we need to check guest flag
                // inside callback instead of not giving any callback
                this.openLayerDialog();
            }
        };
        if (reqBuilder) {
            sandbox.request(this, reqBuilder(TOOL.NAME, TOOL.GROUP, toolBtn));
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
        if (this.popupControls) {
            // already opened
            if (this.popupControls.id === id) {
                this.popupControls.bringToTop();
                return;
            }
            // remove previous popup
            this.popupCleanup();
        }
        const isImport = !id;
        const conf = {
            maxSize: this.getMaxSize(),
            unzippedMaxSize: this.getMaxSize() * 15,
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
     */
    addTab: function (appStarted) {
        const sandbox = Oskari.getSandbox();
        let myDataService = sandbox.getService('Oskari.mapframework.bundle.mydata.service.MyDataService');

        const reqName = 'PersonalData.AddTabRequest';
        if (myDataService) {
            myDataService.addTab('userlayers', this.loc('tab.title'), UserLayersTab, new UserLayersHandler(this));
        } else if (sandbox.hasHandler(reqName)) {
            // fallback to old personaldata tabs
            this.addTabToPersonalData();
        } else if (!appStarted) {
            // Wait for the application to load all bundles and try again
            Oskari.on('app.start', () => {
                this.addTab(true);
            });
        }
    },
    addTabToPersonalData: function () {
        const userLayersTab = Oskari.clazz.create('Oskari.mapframework.bundle.myplacesimport.PersonalDataUserLayersTab', this);
        const addTabReqBuilder = Oskari.requestBuilder('PersonalData.AddTabRequest');

        if (addTabReqBuilder) {
            this.getSandbox().request(this, addTabReqBuilder(this.loc('tab.title'), userLayersTab.getContent(), false, 'userlayers'));
        }
        this.tab = userLayersTab;
        this.getService().on('update', () => {
            this.getTab().refresh();
        });
    },
    /**
     * @method getTab
     * @return {Oskari.mapframework.bundle.myplacesimport.PersonalDataUserLayersTab}
     */
    getTab: function () {
        return this.tab;
    }
}, {
    extend: ['Oskari.BasicBundle'],
    protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
