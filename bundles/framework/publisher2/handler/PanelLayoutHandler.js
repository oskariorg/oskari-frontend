import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { PUBLISHER_BUNDLE_ID } from '../view/PublisherSideBarHandler';
import { theme } from 'antd';

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

class UIHandler extends StateHandler {
    constructor () {
        super();
        this.originalTheme = Oskari.app.getTheming().getTheme();
        const mapTheme = this.originalTheme?.map || {};
        this.state = {
            theme: mapTheme
        };
    }

    init (data) {
        // Set the initial values
        const theme = data?.metadata?.theme;

        if (theme) {
            this.updateTheme(theme);
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

    getValues () {
        const { theme } = this.getState();
        return {
            metadata: {
                theme
            }
        };
    }

    stop () {
        // change the mapmodule theme back to normal
        Oskari.app.getTheming().setTheme(this.originalTheme);
    }
}

const wrapped = controllerMixin(UIHandler, [
    'updateTheme'
]);

export { wrapped as PanelLayoutHandler };
