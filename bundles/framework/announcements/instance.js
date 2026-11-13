import './service/AnnouncementsService';
import './Flyout';
import './plugin//AnnouncementsPlugin';
import React from 'react';
import { NavigationAdapter } from 'oskari-ui/util/NavigationAdapter';
import { showFlyout } from 'oskari-ui/components/window';
import { styled } from 'styled-components';
import { AnnouncementsHandler, showAnnouncementsPopup, showAnnouncementsBanner, showBannerDescriptionPopup } from './view/';
import { AnnouncementsView } from './view/AnnouncementsView';

const NOT_DISPLAYED = 'display-none';
const MENU_ITEM_ID = 'announcements-item';
const FLYOUT_ID = 'Announcements';
const HIDDEN_MENU_ITEM_STYLE = {
    display: 'none'
};
const FlyoutPadding = styled('div')`
    margin: 0;
    padding: 1.5em 1.5em 1.5em 1.75em;
`;
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
        this.announcementsView = null;
        this.mainNavigationControls = null;
        this.navigation = new NavigationAdapter(this, {
            createMenuItem: (navigation) => this.createMenuItem(navigation),
            onStart: () => {
                this.announcementsView = new AnnouncementsView(this);
            },
            onStop: () => {
                this.closeMainNavigationFlyout();
                this.announcementsView = null;
            }
        });
    }, {
        __name: 'announcements',
        getName: function () {
            return this.__name;
        },
        start: function () {
            const conf = this.getConfiguration();
            const sandbox = Oskari.getSandbox(conf.sandbox || 'sandbox');
            this.sandbox = sandbox;
            sandbox.register(this);
            if (conf.stateful === true) {
                sandbox.registerAsStateful(this.mediator.bundleId, this);
            }
            this.navigation.start();
            this.afterStart(sandbox);
        },
        afterStart: function () {
            const me = this;
            if (me.started) {
                return;
            }
            me.service = Oskari.clazz.create('Oskari.framework.announcements.service.AnnouncementsService', me.sandbox);
            me.sandbox.registerService(me.service);
            if (me.conf && me.conf.plugin) {
                const mapModule = me.sandbox.findRegisteredModuleInstance('MainMapModule');
                const plugin = Oskari.clazz.create('Oskari.framework.announcements.plugin.AnnouncementsPlugin', me.conf.plugin.config);
                mapModule.registerPlugin(plugin);
                mapModule.startPlugin(plugin);
            } else {
                const flyout = me.plugins['Oskari.userinterface.Flyout'];
                // It looks like plugin (embedded map) handles announcements differently so render popups only if flyout is present
                if (flyout || this.navigation.service) {
                    this.handler = new AnnouncementsHandler(this.service);
                    this.handler.addStateListener(state => this.stateChanged(state));
                    if (this.navigation.service) {
                        this.handler.addStateListener(() => this.updateMainNavigationFlyout());
                    } else {
                        flyout.initHandler(this.handler);
                    }
                }
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
            if (this.navigation.service) {
                this.setMenuItemVisibility(shouldHide);
                return;
            }
            this.getTile()?.container?.toggleClass(NOT_DISPLAYED, shouldHide);
        },
        setMenuItemVisibility: function (shouldHide) {
            const menuItem = this.navigation.menuItem;
            const style = shouldHide ? HIDDEN_MENU_ITEM_STYLE : undefined;
            if (!menuItem || menuItem.options.style === style) {
                return;
            }
            menuItem.update({
                ...menuItem.options,
                style
            });
            menuItem.onChange?.();
        },
        createMenuItem: function ({ MenuItem, MenuItemActivationResult }) {
            const menuItem = new MenuItem({
                id: MENU_ITEM_ID,
                sortOrder: 50,
                name: this.getTitle(),
                tooltip: this.getDescription(),
                setActive: (isActive) => {
                    if (isActive) {
                        const opened = this.showMainNavigationFlyout(() => menuItem.onClose?.(MENU_ITEM_ID));
                        return opened ? MenuItemActivationResult.OK : MenuItemActivationResult.FAILED;
                    }
                    this.closeMainNavigationFlyout();
                    return MenuItemActivationResult.OK;
                }
            });
            return menuItem;
        },
        showMainNavigationFlyout: function (onClose) {
            if (this.mainNavigationControls) {
                return true;
            }
            const controls = showFlyout(this.getTitle(), this.getPaddedFlyoutContent(), () => {
                if (this.mainNavigationControls !== controls) {
                    return;
                }
                this.mainNavigationControls = null;
                onClose();
            }, { id: FLYOUT_ID });
            if (!controls) {
                return false;
            }
            this.mainNavigationControls = controls;
            return true;
        },
        closeMainNavigationFlyout: function () {
            const controls = this.mainNavigationControls;
            this.mainNavigationControls = null;
            controls?.close();
        },
        getPaddedFlyoutContent: function () {
            return (
                <FlyoutPadding>
                    {this.announcementsView.getContent(this.handler?.getState())}
                </FlyoutPadding>
            );
        },
        updateMainNavigationFlyout: function () {
            this.mainNavigationControls?.update(this.getTitle(), this.getPaddedFlyoutContent());
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
            return this.navigation.stop();
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
