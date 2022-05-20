import { StateHandler, controllerMixin } from 'oskari-ui/util';

// Handler for announcements. Handles state and service calls.
class ViewHandler extends StateHandler {
    constructor (service) {
        super();
        this.service = service;
        this.state = {
            tools: [],
            dontShowAgain: [],
            announcements: [],
            showAsPopup: []
        };
        this.service.on('tool', () => this.updateState({ tools: this.service.getTools() }));
        this.service.on('fetch', () => this.onFetch());
        this.service.fetchAnnouncements();
    }

    onFetch () {
        const announcements = this.service.getAnnouncements();
        const dontShowAgain = this.getDontShowAgainIds(announcements);
        const showAsPopup = announcements.filter(ann => ann.options.showAsPopup && !dontShowAgain.includes(ann.id));
        this.updateState({
            announcements,
            dontShowAgain,
            showAsPopup
        });
    }

    getDontShowAgainIds (announcements = this.state.announcements) {
        const storage = this.service.getIdsFromLocalStorage();
        const ids = announcements.map(a => a.id);
        return ids.filter(id => storage.includes(id));
    }

    setShowAgain (id, dontShow) {
        if (dontShow) {
            this.service.addToLocalStorage(id);
        } else {
            this.service.removeFromLocalStorage(id);
        }
        const dontShowAgain = this.getDontShowAgainIds();
        this.updateState({ dontShowAgain });
    }

    clearPopup () {
        this.updateState({ showAsPopup: [] });
    }

    onPopupChange (currentPopup) {
        this.updateState({ currentPopup });
    }
}

export const AnnouncementsHandler = controllerMixin(ViewHandler, [
    'setShowAgain', 'clearPopup', 'onPopupChange'
]);
