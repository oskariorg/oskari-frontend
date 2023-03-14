import { UserStyleService } from './service/UserStyleService';
import { showStylesPopup } from './view';
import { UserStylesTab } from './view/UserStylesTab';
import { UserStyleHandler } from './handler/UserStyleHandler';
import { BUNDLE_KEY } from './constants';
/**
 * @class Oskari.mapframework.userstyle.UserStyleBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.userstyle.UserStyleBundleInstance', function () {
    this.service = null;
    this.handler = null;
    this.popupController = null;
    this.sandbox = null;
    this.loc = Oskari.getMsg.bind(null, this.getName());
}, {
    __name: BUNDLE_KEY,
    requestHandlers: {
        ShowUserStylesRequest: function () {
            return Oskari.clazz.create('Oskari.mapframework.userstyle.request.ShowUserStylesRequestHandler', this);
        }
    },
    _startImpl: function (sandbox) {
        this.sandbox = sandbox;
        this.service = new UserStyleService(sandbox);
        this.handler = new UserStyleHandler(this);
        sandbox.registerService(this.service);
        this.addTab();
    },
    getSandbox: function () {
        return this.sandbox;
    },
    getService: function () {
        return this.service;
    },
    cleanPopup () {
        if (this.popupController) {
            this.popupController.close();
        }
        this.popupController = null;
    },
    showPopup (options) {
        const onClose = () => this.cleanPopup();
        if (this.popupController) {
            this.popupController.update(options);
        } else {
            this.popupController = showStylesPopup(this.service, options, onClose);
        }
    },
    addTab: function () {
        const myDataService = this.sandbox.getService('Oskari.mapframework.bundle.mydata.service.MyDataService');

        if (myDataService) {
            myDataService.addTab(this.getName(), this.loc('tab.title'), UserStylesTab, this.handler);
        } else {
            // Wait for the application to load all bundles and try again
            Oskari.on('app.start', () => {
                this.addTab();
            });
        }
    }
}, {
    extend: ['Oskari.BasicBundle'],
    protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
