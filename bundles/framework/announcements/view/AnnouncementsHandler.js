import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { isUpcoming, isOutdated, isActive } from '../service/util';

// Handler for announcements. Handles state and service calls.
class ViewHandler extends StateHandler {
    constructor (service) {
        super();
        this.service = service;
        this.service.on('tool', () => this.updateState({ tools: this.service.getTools() }));
        this.service.on('fetch', () => this.onFetch());
        this.service.fetchAnnouncements();
    }

    onFetch () {
        const allAnnouncements = this.service.getAnnouncements();
        const dontShowAgain = this.service.getIdsFromLocalStorage();

        // Admin gets all announcements
        const announcements = allAnnouncements.filter(a => isActive(a));

        const newState = {
            outdated: allAnnouncements.filter(a => isOutdated(a)),
            upcoming: allAnnouncements.filter(a => isUpcoming(a)),
            announcements,
            dontShowAgain
        };
        // Filter active announcements to show in banner or popup, mark banner/popup as shown if list is empty
        if (!this.state.popupShown) {
            const ann = announcements.filter(ann => ann.options.showAsPopup && !dontShowAgain.includes(ann.id));
            newState.showAsPopup = ann;
            newState.popupShown = !ann.length;
        }
        if (!this.state.bannerShown) {
            const ann = announcements.filter(ann => !ann.options.showAsPopup && !dontShowAgain.includes(ann.id));
            newState.showAsBanner = ann;
            newState.bannerShown = !ann.length;
        }
        this.updateState(newState);
    }

    setShowAgain (id, dontShow) {
        if (dontShow) {
            this.service.addToLocalStorage(id);
        } else {
            this.service.removeFromLocalStorage(id);
        }
        const dontShowAgain = this.service.getIdsFromLocalStorage();
        this.updateState({ dontShowAgain });
    }

    onPopupClose () {
        if (this.state.popupShown) {
            return;
        }
        this.updateState({ popupShown: true });
    }

    onBannerClose () {
        if (this.state.bannerShown) {
            return;
        }
        this.updateState({ bannerShown: true });
    }

    onPopupChange (currentPopup) {
        this.updateState({ currentPopup });
    }
}

export const AnnouncementsHandler = controllerMixin(ViewHandler, [
    'setShowAgain', 'onPopupClose', 'onPopupChange', 'onBannerClose'
]);
