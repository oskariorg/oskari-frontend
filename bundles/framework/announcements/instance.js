import { AnnouncementsHandler, showAnnouncementsPopup, showAnnouncementsBanner, showBannerDescriptionPopup } from './view/';
const NOT_DISPLAYED = 'display-none';
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
        conf.name = 'announcements';
        conf.flyoutClazz = 'Oskari.framework.bundle.announcements.Flyout';
        this.service = null;
        this.handler = null;
        this.popupControls = null;
        this.bannerControls = null;
        this.descriptionPopupControls = null;
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
                this.handler.addStateListener(state => this.stateChanged(state));
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
        stateChanged: function (state) {
            this.renderPopup(state);
            this.renderBanner(state);
            this.setTileVisibility(state);
        },
        setTileVisibility: function (state) {
            const isMobile = Oskari.util.isMobile();
            // mobile mode and no active announcements
            const shouldHide = isMobile && !(state?.active?.length);
            this.getTile()?.container?.toggleClass(NOT_DISPLAYED, shouldHide);
        },
        renderPopup: function (state) {
            if (!state.popupAnnouncements || !state.popupAnnouncements.length) {
                return;
            }
            if (this.popupControls) {
                this.popupControls.update(state);
                return;
            }
            const controller = this.handler.getController();
            const onClose = () => {
                controller.onPopupClose();
                this.popupCleanup();
            };
            this.popupControls = showAnnouncementsPopup(state, controller, onClose);
        },
        renderBanner: function (state) {
            if (!state.bannerAnnouncements || !state.bannerAnnouncements.length) {
                return;
            }

            if (this.bannerControls) {
                this.bannerControls.update(state);
                return;
            }
            const controller = this.handler.getController();
            const onClose = () => {
                controller.onBannerClose();
                this.bannerCleanup();
            };
            const renderDescriptionPopup = (announcement) => this.renderDescriptionPopup(announcement);
            this.bannerControls = showAnnouncementsBanner(state, controller, onClose, renderDescriptionPopup);
        },
        renderDescriptionPopup: function (announcement) {
            if (this.descriptionPopupControls) {
                this.descriptionPopupControls.close();
            }

            const onClose = () => {
                this.descriptionPopupCleanup();
            };
            this.descriptionPopupControls = showBannerDescriptionPopup(announcement, onClose);
        },
        popupCleanup: function () {
            if (this.popupControls) {
                this.popupControls.close();
            }
            this.popupControls = null;
        },
        bannerCleanup: function () {
            if (this.bannerControls) {
                this.bannerControls.close();
            }
            this.bannerControls = null;
        },
        descriptionPopupCleanup: function () {
            if (this.descriptionPopupControls) {
                this.descriptionPopupControls.close();
            }
            this.descriptionPopupControls = null;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        stop: function () {
        },
        onEvent: function (event) {
            const handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },
        eventHandlers: {
            MapSizeChangedEvent: function (event) {
                this.renderBanner(this.handler.getState());
            }
        }
    }, {
        extend: ['Oskari.userinterface.extension.DefaultExtension']
    }
);
