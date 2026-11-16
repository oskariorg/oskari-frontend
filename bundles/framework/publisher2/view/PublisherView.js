import React from 'react';
import { Spin } from 'oskari-ui';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { FlyoutContent } from './flyout/FlyoutContent';
import { showTouPopup } from './dialog/TouPopup';
import { UserDataLayer } from '../../../mapping/mapuserdatalayer/domain/UserDataLayer';
import { MyFeaturesLayer } from '../../myfeatures/domain/MyFeaturesLayer';
import { hasPublishRight } from '../util/util';
import { BUNDLE_KEY } from '../constants';

const LOGIN_LOCATION = 'login';
const REGISTER_LOCATION = 'register';

export class PublisherView {
    constructor (instance) {
        this.instance = instance;
        this.hasAcceptedTou = Oskari.user().isLoggedIn() ? null : false;
        this.loadingTou = false;
    }

    getAcceptedTou () {
        if (typeof this.hasAcceptedTou === 'boolean') {
            return this.hasAcceptedTou;
        }
        if (!this.loadingTou) {
            this.loadingTou = true;
            this.instance.getService().checkTouAccepted((response) => {
                this.hasAcceptedTou = response;
                this.loadingTou = false;
                if (this.instance.publisherView === this) {
                    this.instance.updateMainNavigationFlyout();
                }
            });
        }
    }

    setAcceptTou () {
        this.instance.setPublishMode(true);
        this.instance.getService().markTouAccepted((response) => {
            this.hasAcceptedTou = response;
        });
    }

    getUrls () {
        const { termsOfUseUrl, loginUrl, registerUrl } = this.instance.conf || {};
        return {
            tou: Oskari.getLocalized(termsOfUseUrl),
            login: Oskari.getLocalized(loginUrl) || Oskari.urls.getLocation(LOGIN_LOCATION),
            register: Oskari.getLocalized(registerUrl) || Oskari.urls.getLocation(REGISTER_LOCATION)
        };
    }

    getActions () {
        return {
            close: () => this.instance.toggleFlyout(false),
            continue: () => this.instance.setPublishMode(true),
            acceptTou: () => this.setAcceptTou(),
            showTou: () => this.instance.getService().getTouArticle((content) => showTouPopup(content))
        };
    }

    getLayers () {
        const layers = [];
        const deniedLayers = [];
        this.instance.getSandbox()
            .findAllSelectedMapLayers()
            .forEach((layer) => {
                const { unsupported } = layer.getVisibilityInfo();
                const name = layer.getName();
                const reasons = [];
                if (!hasPublishRight(layer)) {
                    reasons.push(Oskari.getMsg(BUNDLE_KEY, 'StartView.noRights'));
                }
                if (unsupported) {
                    reasons.push(unsupported.getDescription());
                }
                if (reasons.length) {
                    deniedLayers.push({
                        name,
                        info: reasons.join()
                    });
                } else if (layer instanceof UserDataLayer || layer instanceof MyFeaturesLayer) {
                    layers.push({
                        name,
                        info: Oskari.getMsg(BUNDLE_KEY, 'StartView.userDataLayerDisclaimer'),
                        userDataLayer: true
                    });
                } else {
                    layers.push({ name });
                }
            });
        return { layers, deniedLayers };
    }

    getContent () {
        const hasAcceptedTou = this.getAcceptedTou();
        return (
            <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                <ThemeProvider>
                    <Spin spinning={typeof hasAcceptedTou !== 'boolean'}>
                        <FlyoutContent
                            {...this.getLayers()}
                            hasAcceptedTou={hasAcceptedTou}
                            urls={this.getUrls()}
                            actions={this.getActions()}
                        />
                    </Spin>
                </ThemeProvider>
            </LocaleProvider>
        );
    }
}
