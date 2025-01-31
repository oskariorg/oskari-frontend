import { StateHandler, controllerMixin } from 'oskari-ui/util';

export const LAYOUT_AVAILABLE_FONTS = [
    {
        name: 'Arial (sans-serif)',
        val: 'arial'
    },
    {
        name: 'Georgia (serif)',
        val: 'georgia'
    },
    {
        name: 'Fantasy (sans-serif)',
        val: 'fantasy'
    },
    {
        name: 'Verdana (sans-serif)',
        val: 'verdana'
    }
];

export const INFOBOX_PREVIEW_ID = 'sampleInfobox';

class UIHandler extends StateHandler {
    constructor () {
        super();
        this.originalTheme = Oskari.app.getTheming().getTheme();
        const mapTheme = this.originalTheme?.map || {};
        this.state = {
            theme: mapTheme,
            infoBoxPreviewVisible: false
        };
        this.sandbox = Oskari.getSandbox();
        this.eventHandlers = {
            'InfoBox.InfoBoxEvent': (evt) => {
                if (evt.getId() === INFOBOX_PREVIEW_ID && !evt.isOpen()) {
                    this.updateState({
                        infoBoxPreviewVisible: false
                    });
                }
            }
        };
        this.name = 'Publisher2.PanelLayoutHandler';
    }

    getName () {
        return this.name;
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
        const mapTheme = data?.metadata?.theme?.map;
        Object.getOwnPropertyNames(this.eventHandlers).forEach((event) => {
            this.sandbox.registerForEventByName(this, event);
        });

        if (mapTheme) {
            this.updateTheme(mapTheme);
        }
    }

    updateTheme (mapTheme) {
        Oskari.app.getTheming().setTheme({
            ...this.originalTheme,
            map: mapTheme
        });
        this.updateState({
            theme: mapTheme
        });
    }

    updateInfoBoxPreviewVisible (isOpen) {
        this.updateState({
            infoBoxPreviewVisible: isOpen
        });
    }

    getValues () {
        const { theme } = this.getState();
        return {
            metadata: {
                theme: {
                    ...this.originalTheme,
                    map: theme
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
    'updateInfoBoxPreviewVisible'
]);

export { wrapped as PanelLayoutHandler };
