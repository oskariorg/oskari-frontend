import { BasicBundleInstance } from 'oskari-ui/BasicBundleInstance';
import { Messaging } from 'oskari-ui/util';
import { MyFeaturesTab } from './MyFeaturesTab';
import { MyFeaturesHandler } from './handler/MyFeaturesHandler';
import { TOOL } from './constants';
import { MyFeaturesService } from './service/MyFeaturesService';
import './request/ShowLayerDialogRequest';

const loadLayers = async (service, getMsg) => {
    try {
        const layerCount = await service.loadLayers();
        Oskari.log('MyFeatures').debug(`Got ${layerCount} layers for myfeatures`);
    } catch (err) {
        const content = getMsg('tab.error.load');
        Messaging.error({ content, duration: 10 });
        Oskari.log('MyFeatures').error(err);
    }
};

export class MyFeatureBundleInstance extends BasicBundleInstance {
    start (sandbox) {
        // registers to sandbox and saves the sandbox for getSandbox()
        super.start(sandbox);
        const loggedIn = Oskari.user().isLoggedIn();
        if (loggedIn) {
            this.importService = new MyFeaturesService(sandbox,
                this.getMapLayerService(),
                (key, args) => this.loc(key, args));
            this.handler = new MyFeaturesHandler(this, this.importService);
            this.addTab();
            this.addRequestHandler('MyFeatures.ShowLayerDialogRequest', (req) => {
                const id = req.getId();
                if (id) {
                    this.handler.editLayer(id);
                } else {
                    this.handler.showLayerDialog();
                }
            });
            // need to wrap to a function because async
            loadLayers(this.importService, this.loc);
        }
        this.registerTool(loggedIn);
    }

    getMapLayerService () {
        if (!this.mapLayerService) {
            this.mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        }
        return this.mapLayerService;
    }

    addTab (appStarted) {
        const sandbox = this.getSandbox();
        const myDataService = sandbox.getService('Oskari.mapframework.bundle.mydata.service.MyDataService');

        if (myDataService) {
            myDataService.addTab('myfeatures', this.loc('tab.title'), MyFeaturesTab, this.handler);
        } else if (!appStarted) {
            // Wait for the application to load all bundles and try again
            Oskari.on('app.start', () => {
                this.addTab(true);
            });
        }
    }

    registerTool (loggedIn = false) {
        const sandbox = this.getSandbox();
        const reqBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
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
    }
};
