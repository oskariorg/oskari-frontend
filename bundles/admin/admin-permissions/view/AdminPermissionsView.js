import React from 'react';
import { LocaleProvider, ThemeProvider } from 'oskari-ui/util';
import { LayerRightsHandler } from '../handler/layerRightsHandler';
import { LayerRights } from './LayerRights';

const BUNDLE_KEY = 'admin-permissions';

export class AdminPermissionsView {
    constructor (instance, consumer) {
        this.handler = new LayerRightsHandler(instance, consumer);
    }

    reset () {
        this.handler.reset(true);
    }

    getContent () {
        return (
            <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                <ThemeProvider>
                    <LayerRights
                        controller={this.handler.getController()}
                        state={this.handler.getState()}
                    />
                </ThemeProvider>
            </LocaleProvider>
        );
    }
}
