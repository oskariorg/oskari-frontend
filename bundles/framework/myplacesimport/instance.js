import { UserLayersTab } from './UserLayersTab';
import { UserLayersHandler } from './handler/UserLayersHandler';
import { TOOL, BUNDLE_NAME } from './constants';

/**
 * @class Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundleInstance', function () {
    this.importService = undefined;
    this.mapLayerService = null;
    this.tab = undefined;
    this.loc = Oskari.getMsg.bind(null, BUNDLE_NAME);
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
            this.handler = new UserLayersHandler(this);
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
            disabled: !loggedIn,
            tooltip: this.loc('tool.tooltip')
        };
        toolBtn.callback = () => {
            if (loggedIn) {
                // toolbar requires a callback so we need to check guest flag
                // inside callback instead of not giving any callback
                this.handler.showLayerDialog({});
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
    showLayerDialog: function (id) {
        const layer = this.getMapLayerService().findMapLayer(id);
        if (layer) {
            this.handler.showLayerDialog({
                id,
                locale: layer.getLocale(),
                style: layer.getCurrentStyle().getFeatureStyle()
            });
        }
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
     * Creates the user layers tab and adds it to the mydata bundle.
     *
     * @method addTab
     */
    addTab: function (appStarted) {
        const sandbox = Oskari.getSandbox();
        const myDataService = sandbox.getService('Oskari.mapframework.bundle.mydata.service.MyDataService');

        if (myDataService) {
            myDataService.addTab('userlayers', this.loc('tab.title'), UserLayersTab, this.handler);
        } else if (!appStarted) {
            // Wait for the application to load all bundles and try again
            Oskari.on('app.start', () => {
                this.addTab(true);
            });
        }
    }
}, {
    extend: ['Oskari.BasicBundle'],
    protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
