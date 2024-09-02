import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { isUpcoming, isOutdated, isActive } from '../service/util';

const DEFAULT_POLLING_INTERVAL_MS = 300000;

// Handler for announcements. Handles state and service calls.
class ViewHandler extends StateHandler {
    constructor (service) {
        super();
        this.service = service;
        this.service.on('controller', () => this.notify());
        this.service.on('fetch', () => this.onFetch());
        this.service.fetchAnnouncements();
    }

    onFetch () {
        const announcements = this.service.getAnnouncements();
        const dontShowAgain = this.service.getIdsFromLocalStorage();
        let { alreadyShown } = this.getState();
        const { popupAnnouncements, bannerAnnouncements } = this.getState();
        if (!alreadyShown) {
            alreadyShown = [];
        }
        // Admin gets all announcements
        const active = announcements.filter(a => isActive(a));

        // Filter active announcements to show in banner or popup
        const newState = {
            outdated: announcements.filter(a => isOutdated(a)),
            upcoming: announcements.filter(a => isUpcoming(a)),
            active,
            dontShowAgain,
            alreadyShown,
            popupAnnouncements: this.filterNewStateAnnouncements(active.filter(ann => ann.options.showAsPopup), popupAnnouncements, dontShowAgain, alreadyShown),
            bannerAnnouncements: this.filterNewStateAnnouncements(active.filter(ann => !ann.options.showAsPopup), bannerAnnouncements, dontShowAgain, alreadyShown)
        };

        clearTimeout(this.pollingIntervalTimeout);
        this.pollingIntervalTimeout = setInterval(() => { this.service.fetchAnnouncements(); }, DEFAULT_POLLING_INTERVAL_MS);
        this.updateState(newState);
    }

    filterNewStateAnnouncements (active, alreadyInState, dontShowAgain, alreadyShown) {
        let activeAnnouncements = active.filter(ann => !dontShowAgain.includes(ann.id) && !alreadyShown.includes(ann.id));
        if (alreadyInState) {
            const stateAnnouncementIds = alreadyInState.map((announcement) => announcement.id);
            activeAnnouncements = activeAnnouncements.filter((ann) => !stateAnnouncementIds.includes(ann.id));
        }

        return activeAnnouncements;
    }

    getToolController () {
        const controller = this.service.getAdminController();
        if (controller) {
            controller.preview = (id) => this.preview(id);
        }
        return controller;
    }

    preview (id) {
        const ann = this.service.getAnnouncement(id);
        if (!ann) {
            return;
        }
        if (ann.options.showAsPopup) {
            this.updateState({ popupAnnouncements: [ann] });
        } else {
            this.updateState({ bannerAnnouncements: [ann] });
        }
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
        const { popupAnnouncements } = this.getState();
        const alreadyShown = this.getAlreadyShown(popupAnnouncements);
        this.updateState({
            popupAnnouncements: [],
            alreadyShown: [...new Set(alreadyShown)]
        });
    }

    onBannerClose () {
        const { bannerAnnouncements } = this.getState();
        const alreadyShown = this.getAlreadyShown(bannerAnnouncements);
        this.updateState({
            bannerAnnouncements: [],
            alreadyShown: [...new Set(alreadyShown)]
        });
    }

    getAlreadyShown (announcements) {
        let { alreadyShown } = this.getState();
        if (!alreadyShown) {
            alreadyShown = [];
        }

        if (announcements) {
            alreadyShown = alreadyShown.concat(announcements.map(ann => ann.id));
        }

        return alreadyShown;
    }

    onBannerChange (currentBanner) {
        this.updateState({ currentBanner });
    }

    onPopupChange (currentPopup) {
        this.updateState({ currentPopup });
    }
}

export const AnnouncementsHandler = controllerMixin(ViewHandler, [
    'setShowAgain', 'onPopupClose', 'onPopupChange', 'onBannerClose', 'onBannerChange', 'getToolController'
]);
