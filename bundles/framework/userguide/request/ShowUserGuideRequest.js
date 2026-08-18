/**
 * @class Oskari.mapframework.bundle.userguide.request.ShowUserGuideRequest
 *
 *
 */
const NAME = 'userguide.ShowUserGuideRequest';

class ShowUserGuideRequest {
    constructor (conf) {
        const config = conf || {};
        this.creator = null;
        this.el = config.el;
        this.context = config.context;
        this.extension = config.extension;
        this.toggle = config.toggle;
        this.placement = config.placement;
        this.content = config.content;
        this.uuid = config.uuid;
    }

    getName () {
        return NAME;
    }

    getUuid () {
        return this.uuid;
    }

    getContext () {
        return this.context;
    }

    getExtension () {
        return this.extension;
    }

    getEl () {
        return this.el;
    }

    isToggle () {
        return this.toggle;
    }

    getPlacement () {
        return this.placement;
    }

    getContent () {
        return this.content;
    }
}

ShowUserGuideRequest.NAME = NAME;

Oskari.clazz.defineES(
    'Oskari.mapframework.bundle.userguide.request.ShowUserGuideRequest',
    ShowUserGuideRequest,
    { protocol: ['Oskari.mapframework.request.Request'] }
);
