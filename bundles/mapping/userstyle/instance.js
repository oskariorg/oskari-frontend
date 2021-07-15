import { UserStyleService } from './service/UserStyleService';
import { UserStylesFlyout } from './UserStylesFlyout';
/**
 * @class Oskari.mapframework.userstyle.UserStyleBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.userstyle.UserStyleBundleInstance', function () {
    this.service = null;
}, {
    __name: 'UserStyleBundleInstance',
    requestHandlers: {
        ShowUserStylesRequest: function () {
            return Oskari.clazz.create('Oskari.mapframework.userstyle.request.ShowUserStylesRequestHandler', this);
        }
    },
    _startImpl: function (sandbox) {
        this.service = new UserStyleService();
        sandbox.registerService(this.service);
    },
    getService: function () {
        return this.service;
    },
    getFlyout () {
        if (!this.flyout) {
            this.flyout = new UserStylesFlyout(this);
        }
        return this.flyout;
    }
}, {
    extend: ['Oskari.BasicBundle'],
    protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
