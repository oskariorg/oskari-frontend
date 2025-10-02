import React from 'react';
import { FlyoutContent } from './view/flyout/FlyoutContent';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { Spin } from 'oskari-ui';
import { showTouPopup } from './view/dialog/TouPopup';
import { UserDataLayer } from '../../mapping/mapuserdatalayer/domain/UserDataLayer';
import { hasPublishRight } from './util/util';
import { createRoot } from 'react-dom/client';

/**
 * @class Oskari.mapframework.bundle.publisher2.Flyout
 *
 * Renders the "publisher" flyout. The flyout shows different view
 * depending of application state.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.publisher2.PublisherBundleInstance} instance
     *      reference to component that created the flyout
     */
    function (instance) {
        this.instance = instance;
        this.container = null;
        this.hasAcceptedTou = Oskari.user().isLoggedIn() ? null : false;
        this._reactRoot = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.publisher2.Flyout';
        },
        setEl: function (el, flyout) {
            this.container = el[0];
            jQuery(this.container).addClass('publisher');
            flyout.addClass('publisher');
        },
        getAcceptedTou () {
            if (typeof this.hasAcceptedTou === 'boolean') {
                return this.hasAcceptedTou;
            }
            this.instance.getService().checkTouAccepted(response => {
                this.hasAcceptedTou = response;
                this.lazyRender();
            });
        },
        setAcceptTou () {
            this.instance.setPublishMode(true);
            this.instance.getService().markTouAccepted(response => {
                this.hasAcceptedTou = response;
            });
        },
        getUrls: function () {
            const { termsOfUseUrl, loginUrl, registerUrl } = this.instance.conf || {};
            return {
                tou: Oskari.getLocalized(termsOfUseUrl),
                login: Oskari.getLocalized(loginUrl) || Oskari.urls.getLocation('login'),
                register: Oskari.getLocalized(registerUrl) || Oskari.urls.getLocation('register')
            };
        },
        getActions: function () {
            return {
                close: () => this.close(),
                continue: () => this.instance.setPublishMode(true),
                acceptTou: () => this.setAcceptTou(),
                showTou: () => this.instance.getService().getTouArticle(content => showTouPopup(content))
            };
        },
        getLayers: function () {
            const layers = [];
            const deniedLayers = [];
            const noRights = this.instance.loc('StartView.noRights');
            const userData = this.instance.loc('StartView.userDataLayerDisclaimer');
            this.instance.getSandbox().findAllSelectedMapLayers().forEach(layer => {
                const { unsupported } = layer.getVisibilityInfo();
                const name = layer.getName();
                const reasons = [];
                if (!hasPublishRight(layer)) {
                    reasons.push(noRights);
                }
                if (unsupported) {
                    reasons.push(unsupported.getDescription());
                }

                if (reasons.length) {
                    deniedLayers.push({ name, info: reasons.join() });
                } else if (layer instanceof UserDataLayer) {
                    layers.push({ name, info: userData, userDataLayer: true });
                } else {
                    layers.push({ name });
                }
            });
            return { layers, deniedLayers };
        },
        getReactRoot (element) {
            if (!this._reactRoot) {
                this._reactRoot = createRoot(element);
            }
            return this._reactRoot;
        },
        /**
         * @method lazyRender
         * Called when flyout is opened (by divmanazer)
         * Creates the UI for a fresh start.
         * Selects the view to show based on user (guest/loggedin)
         */
        lazyRender: function () {
            if (!this.container) {
                return;
            }
            const hasAcceptedTou = this.getAcceptedTou();
            const content = (
                <LocaleProvider value={{ bundleKey: this.instance.getName() }}>
                    <ThemeProvider>
                        <Spin spinning={typeof hasAcceptedTou !== 'boolean'}>
                            <FlyoutContent
                                {...this.getLayers()}
                                hasAcceptedTou={hasAcceptedTou}
                                urls={this.getUrls()}
                                actions={this.getActions()}/>
                        </Spin>
                    </ThemeProvider>
                </LocaleProvider>
            );
            this.getReactRoot(this.container).render(content);
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        extend: ['Oskari.userinterface.extension.DefaultFlyout']
    });
