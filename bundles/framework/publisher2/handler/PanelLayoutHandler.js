import React from 'react';
import { LayoutForm } from '../view/form/LayoutForm';
import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { getDefaultMapTheme } from '../../..//mapping/mapmodule/util/MapThemeHelper.js';
import { BUNDLE_KEY } from '../constants';

const INFOBOX_PREVIEW_ID = 'sampleInfobox';

const INFOBOX_OPTIONS = {
    hidePrevious: true
};

const getInfoboxHtml = (title, content) => `
<div class="getinforesult_header">
    <div class="icon-bubble-left"></div>
    <div title="${title}" class="getinforesult_header_title">
        ${title}
    </div>
</div>
<div>
    ${content}
</div>
`;

const getPresetTheme = preset => {
    const light = preset.includes('light');
    const bg = light ? '#ffffff' : '#3c3c3c';
    const text = light ? '#000000' : '#ffffff';
    const primary = light ? '#ffffff' : '#141414';

    let roundness = preset.includes('sharp') ? 0 : 100;
    let effect;
    if (preset.includes('3d')) {
        roundness = 20;
        effect = '3D';
    }

    return {
        color: {
            header: { bg, text, icon: text }
        },
        navigation: {
            color: { primary, text },
            roundness,
            effect
        }
    };
};
class UIHandler extends StateHandler {
    constructor (sandbox) {
        super();
        this.sandbox = sandbox;
        this.presets = null;
        this.originalTheme = Oskari.app.getTheming().getTheme();
        // get fresh deep copy for state
        const { map = {} } = Oskari.app.getTheming().getTheme();
        this.setState({
            mapTheme: map,
            infoBoxPreviewVisible: false
        });
        this.eventHandlers = {
            'InfoBox.InfoBoxEvent': (evt) => {
                if (evt.getId() === INFOBOX_PREVIEW_ID && !evt.isOpen()) {
                    // update state if closed from popup
                    this.updateState({
                        infoBoxPreviewVisible: false
                    });
                }
            }
        };
    }

    getName () {
        return 'Publisher2.PanelLayoutHandler';
    }

    onEvent (evt) {
        const handler = this.eventHandlers[evt.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [evt]);
    }

    init (data) {
        // Set the initial values
        const mapTheme = data.metadata?.theme?.map;
        Object.getOwnPropertyNames(this.eventHandlers).forEach((event) => {
            this.sandbox.registerForEventByName(this, event);
        });

        if (!mapTheme) {
            return;
        }
        this.updateState({ mapTheme });
        this.syncTheme();
    }

    getPanelContent () {
        return <LayoutForm {...this.getState()} presets={this.getPresetOptions()} controller={this.getController()}/>;
    }

    getPresetOptions () {
        if (!this.presets) {
            const styles = Oskari.getMsg(BUNDLE_KEY, 'BasicView.layout.fields.toolStyles', null, {});
            this.presets = Object.entries(styles).map(([key, title]) => ({ key, title, action: () => this.setPreset(key) }));
        }
        return this.presets;
    }

    setPreset (preset) {
        const theme = getPresetTheme(preset);
        // use default as base to reset infobox & etc to default values
        const defaults = getDefaultMapTheme();
        const mapTheme = Oskari.util.deepClone(defaults, theme);
        this.updateState({ mapTheme });
        this.syncTheme();
    }

    updateThemeMultiPath (paths, value) {
        paths.forEach(path => this.updateTheme(path, value, true));
        this.syncTheme();
    }

    updateTheme (path, value, skipSync) {
        const updated = { ...this.getState().mapTheme };
        const parts = path.split('.');

        let temp = updated;
        while (parts.length > 1) {
            temp = temp[parts.shift()];
        }
        temp[parts.shift()] = value;

        this.updateState({ mapTheme: updated });
        if (!skipSync) {
            this.syncTheme();
        }
    }

    syncTheme () {
        const { mapTheme } = this.getState();
        Oskari.app.getTheming().setTheme({
            ...this.originalTheme,
            map: mapTheme
        });
    }

    updateInfoBoxPreviewVisible (infoBoxPreviewVisible) {
        this.updateState({ infoBoxPreviewVisible });
        if (!infoBoxPreviewVisible) {
            this.sandbox.postRequestByName('InfoBox.HideInfoBoxRequest', [INFOBOX_PREVIEW_ID]);
            return;
        }
        const { title, featureName, featureDesc } = Oskari.getMsg(BUNDLE_KEY, 'BasicView.layout.popup.gfiDialog');
        const html = getInfoboxHtml(featureName, featureDesc);

        const infoboxData = [
            INFOBOX_PREVIEW_ID,
            title,
            [{ html }],
            this.sandbox.findRegisteredModuleInstance('MainMapModule').getMapCenter(),
            INFOBOX_OPTIONS
        ];
        this.sandbox.postRequestByName('InfoBox.ShowInfoBoxRequest', infoboxData);
    }

    getValues () {
        const { mapTheme } = this.getState();
        return {
            metadata: {
                theme: {
                    ...this.originalTheme,
                    map: mapTheme
                }
            }
        };
    }

    stop () {
        // change the mapmodule theme back to normal
        Oskari.app.getTheming().setTheme(this.originalTheme);
        Object.getOwnPropertyNames(this.eventHandlers).forEach(event => this.sandbox.unregisterFromEventByName(this, event));
    }
}

const wrapped = controllerMixin(UIHandler, [
    'updateTheme',
    'updateThemeMultiPath',
    'updateInfoBoxPreviewVisible'
]);

export { wrapped as PanelLayoutHandler };
