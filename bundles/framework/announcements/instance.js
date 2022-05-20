import { AnnouncementsHandler, showAnnouncementsPopup } from './view/';
/**
 * @class Oskari.framework.bundle.announcements.AnnouncementsBundleInstance
 *
 * Main component and starting point for the announcements functionality.
 *
 * See Oskari.framework.bundle.announcements.AnnouncementsBundleInstance for bundle definition.
 */
Oskari.clazz.define('Oskari.framework.bundle.announcements.AnnouncementsBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        const conf = this.getConfiguration();
        this.sandbox = this.getSandbox();
        conf.name = 'announcements';
        conf.flyoutClazz = 'Oskari.framework.bundle.announcements.Flyout';
        this.service = null;
        this.handler = null;
        this.popupControls = null;
    }, {

        afterStart: function () {
            const me = this;
            if (me.started) {
                return;
            }

            me.service = Oskari.clazz.create('Oskari.framework.announcements.service.AnnouncementsService', me.sandbox);
            me.sandbox.registerService(me.service);
            const flyout = me.plugins['Oskari.userinterface.Flyout'];
            // It looks like plugin (embedded map) handles announcements differently so render popups only if flyout is present
            if (flyout) {
                this.handler = new AnnouncementsHandler(this.service);
                this.handler.addStateListener(state => this.renderPopup(state));
                flyout.initHandler(this.handler);
            }
            if (me.conf && me.conf.plugin) {
                const mapModule = me.sandbox.findRegisteredModuleInstance('MainMapModule');
                const plugin = Oskari.clazz.create('Oskari.framework.announcements.plugin.AnnouncementsPlugin', me.conf.plugin.config);
                mapModule.registerPlugin(plugin);
                mapModule.startPlugin(plugin);
            }

            // RPC function to get announcements
            Oskari.on('app.start', function (details) {
                const rpcService = Oskari.getSandbox().getService('Oskari.mapframework.bundle.rpc.service.RpcService');
                if (!rpcService) {
                    return;
                }
                rpcService.addFunction('getAnnouncements', function () {
                    return new Promise((resolve) => {
                        me.service.fetchAnnouncements((errorMsg, announcements) => resolve(announcements));
                    });
                });
            });
        },
        renderPopup: function (state) {
            if (!state.showAsPopup.length) {
                return;
            }
            if (this.popupControls) {
                this.popupControls.update(state);
                return;
            }
            const controller = this.handler.getController();
            const onClose = () => {
                controller.clearPopup();
                this.popupCleanup();
            };
            this.popupControls = showAnnouncementsPopup(state, controller, onClose);
        },
        popupCleanup: function () {
            if (this.popupControls) {
                this.popupControls.close();
            }
            this.popupControls = null;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        stop: function () {
        }
    }, {
        extend: ['Oskari.userinterface.extension.DefaultExtension']
    }
);
