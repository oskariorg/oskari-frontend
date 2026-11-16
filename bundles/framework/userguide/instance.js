import React from 'react';
import { Message } from 'oskari-ui';
import { NavigationAdapter } from 'oskari-ui/util/NavigationAdapter';
import { UserGuideHandler } from './handler/UserGuideHandler';
import { showUserGuideFlyout } from './view/UserGuideFlyout';
import './request/ShowUserGuideRequest';

const EXTENSION_NAME = 'userinterface.UserGuide';
const MENU_ITEM_ID = 'userguide-item';
const DefaultExtension = Oskari.clazz.get('Oskari.userinterface.extension.DefaultExtension');

export class UserGuideBundleInstance extends DefaultExtension {
    constructor () {
        super();
        this.flyoutControls = null;
        this.contentLoaded = false;
        this.handler = new UserGuideHandler();
        this.navigation = new NavigationAdapter(this, {
            createMenuItem: (navigation) => this.createMenuItem(navigation),
            onStop: () => this.closeMainNavigationFlyout()
        });

        const conf = this.getConfiguration();
        conf.name = EXTENSION_NAME;
        // prevent the default flyout from opening (use built-in react-flyout instead)
        conf.flyoutClazz = null;
        this.defaultConf = conf;

        this.eventHandlers = {
            'userinterface.ExtensionUpdatedEvent': (event) => {
                if (this.navigation.service || event.getExtension().getName() !== this.getName()) {
                    return;
                }
                const isOpen = event.getViewState() !== 'close';
                if (isOpen) {
                    this.openFlyout();
                } else {
                    this.closeFlyout();
                }
            }
        };

        this.guidedTourDelegateTemplate = {
            priority: 70,
            show: function () {
                this.scheduleShowUserGuide();
            },
            hide: function () {
                this.scheduleCloseUserGuide();
            },
            getTitle: function () {
                return Oskari.getMsg(this.getName(), 'guidedTour.title');
            },
            getContent: function () {
                return (
                    <Message bundleKey={this.getName()} messageKey='guidedTour.message' allowHTML />
                );
            },
            getLinks: function () {
                return [
                    {
                        title: Oskari.getMsg(this.getName(), 'guidedTour.openLink'),
                        onClick: () => this.scheduleShowUserGuide(),
                        visible: false
                    },
                    {
                        title: Oskari.getMsg(this.getName(), 'guidedTour.closeLink'),
                        onClick: () => this.scheduleCloseUserGuide(),
                        visible: true
                    }
                ];
            }
        };
    }

    start () {
        const conf = this.getConfiguration();
        const sandbox = Oskari.getSandbox(conf.sandbox || 'sandbox');
        this.sandbox = sandbox;
        sandbox.register(this);
        if (conf.stateful === true) {
            sandbox.registerAsStateful(this.mediator.bundleId, this);
        }
        this.navigation.start();
        this.afterStart(sandbox);
    }

    afterStart (sandbox) {
        sandbox.requestHandler('userguide.ShowUserGuideRequest', (request) => this.scheduleShowUserGuide(request));

        this.handler.addStateListener((state) => this.onStateUpdate(state));
        this.registerForGuidedTour();
    }

    createMenuItem ({ MenuItem, MenuItemActivationResult }) {
        const menuItem = new MenuItem({
            id: MENU_ITEM_ID,
            sortOrder: 30,
            name: this.getTitle(),
            tooltip: this.getDescription(),
            keepActive: true,
            setActive: (isActive, { switching = false } = {}) => {
                if (isActive) {
                    this.showMainNavigationFlyout(() => menuItem.onClose?.(MENU_ITEM_ID));
                    return MenuItemActivationResult.OK;
                }
                if (switching && menuItem.isActive) {
                    return MenuItemActivationResult.KEEP_OPEN;
                }
                this.closeMainNavigationFlyout();
                return MenuItemActivationResult.OK;
            }
        });
        return menuItem;
    }

    loadContent () {
        if (this.contentLoaded) {
            return;
        }
        this.contentLoaded = true;
        this.handler.loadContent(
            this.conf || {},
            Oskari.getLocalization(this.getName()) || {}
        );
    }

    showMainNavigationFlyout (onClose) {
        if (this.flyoutControls) {
            return;
        }
        this.loadContent();
        const controls = showUserGuideFlyout(this.handler.getState(), () => {
            if (this.flyoutControls !== controls) {
                return;
            }
            this.flyoutControls = null;
            onClose();
        });
        this.flyoutControls = controls;
    }

    closeMainNavigationFlyout () {
        const controls = this.flyoutControls;
        this.flyoutControls = null;
        controls?.close();
    }

    openFlyout () {
        if (this.navigation.service) {
            return this.navigation.service.setActive(MENU_ITEM_ID, true);
        }
        if (this.flyoutControls) {
            return;
        }
        this.loadContent();
        this.flyoutControls = showUserGuideFlyout(
            this.handler.getState(),
            () => this.closeFlyout()
        );
    }

    closeFlyout () {
        if (this.navigation.service) {
            return this.navigation.service.setActive(MENU_ITEM_ID, false);
        }
        if (this.flyoutControls) {
            this.scheduleCloseUserGuide();
            this.flyoutControls.close();
            this.flyoutControls = null;
        }
    }

    onStateUpdate (state) {
        this.flyoutControls?.update(state);
    }

    scheduleCloseUserGuide () {
        if (this.navigation.service) {
            this.closeFlyout();
            return;
        }
        // to sync tile state with div manazer
        this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', EXTENSION_NAME]);
    }

    scheduleShowUserGuide () {
        if (this.navigation.service) {
            this.openFlyout();
            return;
        }
        // to sync tile state with div manazer
        this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', EXTENSION_NAME]);
    }

    stop () {
        const sandbox = this.sandbox;
        this.closeFlyout();
        const result = this.navigation.stop();
        if (this.navigation.service) {
            return result;
        }
        sandbox.removeRequestHandler('userguide.ShowUserGuideRequest', null);
        sandbox.unregisterStateful(this.mediator.bundleId);
        sandbox.unregister(this);
        this.sandbox = null;
        this.started = false;
    }

    registerForGuidedTour () {
        const sendRegister = () => {
            const requestBuilder = Oskari.requestBuilder('Guidedtour.AddToGuidedTourRequest');
            if (requestBuilder && this.sandbox.hasHandler('Guidedtour.AddToGuidedTourRequest')) {
                const delegate = { bundleName: this.getName() };
                for (const prop in this.guidedTourDelegateTemplate) {
                    if (typeof this.guidedTourDelegateTemplate[prop] === 'function') {
                        delegate[prop] = this.guidedTourDelegateTemplate[prop].bind(this);
                    } else {
                        delegate[prop] = this.guidedTourDelegateTemplate[prop];
                    }
                }
                this.sandbox.request(this, requestBuilder(delegate));
            }
        };

        const tourInstance = this.sandbox.findRegisteredModuleInstance('GuidedTour');
        if (tourInstance) {
            sendRegister();
        } else {
            Oskari.on('bundle.start', (msg) => {
                if (msg.id === 'guidedtour') {
                    sendRegister();
                }
            });
        }
    }
}
