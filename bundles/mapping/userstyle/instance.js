import { UserStyleService } from './service/UserStyleService';
import { showStylesPopup } from './view';
/**
 * @class Oskari.mapframework.userstyle.UserStyleBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.userstyle.UserStyleBundleInstance', function () {
    this.service = null;
    this.popupController = null;
}, {
    __name: 'UserStyleBundleInstance',
    requestHandlers: {
        ShowUserStylesRequest: function () {
            return Oskari.clazz.create('Oskari.mapframework.userstyle.request.ShowUserStylesRequestHandler', this);
        }
    },
    _startImpl: function (sandbox) {
        this.service = new UserStyleService(sandbox);
        sandbox.registerService(this.service);
        this.service.on('update', (layerId) => {
            if (this.popupController) {
                this.popupController.update({ layerId });
            }
        });
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
    showPopup (values) {
        const onClose = () => this.cleanPopup();
        if (this.popupController) {
            this.popupController.update(values);
        } else {
            this.popupController = showStylesPopup(this.service, values, onClose);
        }
    }
}, {
    extend: ['Oskari.BasicBundle'],
    protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
