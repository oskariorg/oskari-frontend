import React from 'react';
import { Message } from 'oskari-ui';
import { UserGuideHandler } from './handler/UserGuideHandler';
import { showUserGuideFlyout } from './view/UserGuideFlyout';
import './request/ShowUserGuideRequest';

const EXTENSION_NAME = 'userinterface.UserGuide';
const DefaultExtension = Oskari.clazz.get('Oskari.userinterface.extension.DefaultExtension');

export class UserGuideBundleInstance extends DefaultExtension {
    constructor () {
        super();
        this.flyoutControls = null;
        this.contentLoaded = false;
        this.handler = new UserGuideHandler();

        const conf = this.getConfiguration();
        conf.name = EXTENSION_NAME;
        this.defaultConf = conf;

        this.eventHandlers = {
            'userinterface.ExtensionUpdatedEvent': (event) => {
                if (event.getExtension().getName() !== this.getName()) {
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
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', EXTENSION_NAME]);
            },
            hide: function () {
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', EXTENSION_NAME]);
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
                        onClick: () => this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', EXTENSION_NAME]),
                        visible: false
                    },
                    {
                        title: Oskari.getMsg(this.getName(), 'guidedTour.closeLink'),
                        onClick: () => this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', EXTENSION_NAME]),
                        visible: true
                    }
                ];
            }
        };
    }

    afterStart (sandbox) {
        sandbox.requestHandler('userguide.ShowUserGuideRequest', (request) => this.scheduleShowUserGuide(request));

        this.handler.addStateListener((state) => this.onStateUpdate(state));
        this.registerForGuidedTour();
    }

    openFlyout () {
        if (this.flyoutControls) {
            return;
        }
        if (!this.contentLoaded) {
            this.contentLoaded = true;
            this.handler.loadContent(
                this.conf || {},
                Oskari.getLocalization(this.getName()) || {}
            );
        }
        this.flyoutControls = showUserGuideFlyout(
            this.handler.getState(),
            () => this.closeFlyout()
        );
    }

    closeFlyout () {
        if (this.flyoutControls) {
            this.flyoutControls.close();
            this.flyoutControls = null;
        }
    }

    onStateUpdate (state) {
        this.flyoutControls?.update(state);
    }

    scheduleShowUserGuide () {
        this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', EXTENSION_NAME]);
    }

    stop () {
        const sandbox = this.sandbox;
        this.closeFlyout();
        sandbox.removeRequestHandler('userguide.ShowUserGuideRequest', null);
        super.stop();
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
