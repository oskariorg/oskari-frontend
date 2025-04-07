import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showAnnouncementsPopup } from './AnnouncementsPopup';
class UIHandler extends StateHandler {
    constructor (tool) {
        super();
        this.tool = tool;

        this.setState({
            lang: Oskari.getLang(),
            noUI: false,
            announcements: [],
            selectedAnnouncements: []
        });
    };

    init (config) {
        this.updateState({
            announcements: config?.announcements,
            selectedAnnouncements: config?.selectedAnnouncements || []
        });

        if (config?.noUI) {
            this.setNoUI(config.noUI);
        }
    }

    setNoUI (value) {
        this.updateState({
            noUI: value
        });

        const plugin = this.tool?.getPlugin();
        if (!plugin) {
            return;
        }

        if (value) {
            plugin.teardownUI();
        } else {
            plugin.redrawUI(Oskari.util.isMobile());
        }
    }

    updateSelectedAnnouncements (checked, id) {
        const { selectedAnnouncements } = this.state;
        const newSelectedAnnouncements = selectedAnnouncements.filter(selectedId => selectedId !== id);
        if (checked) {
            newSelectedAnnouncements.push(id);
        }
        this.updateState({
            selectedAnnouncements: newSelectedAnnouncements
        });

        if (this.popupControls) {
            this.popupControls.update(this.state, this.controller, this.closePopup);
        }
    }

    showPopup () {
        if (this.popupControls) {
            this.popupControls.close();
            return;
        }
        this.popupControls = showAnnouncementsPopup(this.state, this.controller, () => this.closePopup());
    }

    closePopup () {
        if (this.popupControls) {
            this.popupControls.close();
        }
        this.popupControls = null;
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setNoUI',
    'updateSelectedAnnouncements',
    'showPopup'
]);

export { wrapped as AnnouncementsToolHandler };
