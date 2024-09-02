import { FLYOUTS } from './handler/ViewHandler';
import './resources/scss/tile.scss';

Oskari.clazz.define('Oskari.statistics.statsgrid.Tile', function (instance) {
    this.instance = instance;
    this.viewHandler = null;
    this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
    this.container = null;
    this.template = null;
    this._tileExtensions = {};
    this._attached = false;
    this._templates = {
        extraSelection: ({ id, label }) =>
            `<div class="statsgrid-functionality ${id}" data-view="${id}">
                <div class="icon"></div>
                <div class="text">${label}</div>
            </div>`
    };
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName: function () {
        return 'Oskari.statistics.statsgrid.Tile';
    },
    /**
     * @method getTitle
     * @return {String} localized text for the title of the tile
     */
    getTitle: function () {
        return this.loc('flyout.title');
    },
    /**
     * @method getDescription
     * @return {String} localized text for the description of the tile
     */
    getDescription: function () {
        return this.loc('desc');
    },
    /**
     * @method setEl
     * @param {Object} el
     *      reference to the container in browser
     * @param {Number} width
     *      container size(?) - not used
     * @param {Number} height
     *      container size(?) - not used
     *
     * Interface method implementation
     */
    setEl: function (el, width, height) {
        this.container = jQuery(el);
    },
    /**
     * @method startPlugin
     * Interface method implementation, calls #createUi()
     */
    startPlugin: function () {
        this._addTileStyleClasses();
    },
    setupTools: function (viewHandler) {
        const tpl = this._templates.extraSelection;
        this.viewHandler = viewHandler;

        FLYOUTS.forEach(id => {
            const label = this.loc(`tile.${id}`);
            const tileExtension = jQuery(tpl({ id, label }));
            this.extendTile(tileExtension, id);
            tileExtension.on('click', function (event) {
                event.stopPropagation();
                viewHandler.toggle(id);
            });
        });
        this.hideExtensions();
    },
    /**
     * Adds a class for the tile so we can programmatically identify which functionality the tile controls.
     */
    _addTileStyleClasses: function () {
        var isContainer = !!((this.container && this.instance.mediator));
        var isBundleId = !!((isContainer && this.instance.mediator.bundleId));
        var isInstanceId = !!((isContainer && this.instance.mediator.instanceId));

        if (isInstanceId && !this.container.hasClass(this.instance.mediator.instanceId)) {
            this.container.addClass(this.instance.mediator.instanceId);
        }
        if (isBundleId && !this.container.hasClass(this.instance.mediator.bundleId)) {
            this.container.addClass(this.instance.mediator.bundleId);
        }
    },
    /**
     * @method stopPlugin
     * Interface method implementation, clears the container
     */
    stopPlugin: function () {
        this.container.empty();
    },
    /**
     * Adds an extra option on the tile
     */
    extendTile: function (el, type) {
        var container = this.container.append(el);
        var extension = container.find(el);
        this._tileExtensions[type] = extension;
    },
    toggleExtension: function (flyout, shown) {
        var element = this.getExtensions()[flyout];
        if (!element) {
            // flyout not part of tile
            return;
        }

        if (!shown) {
            element.removeClass('material-selected');
            return;
        }
        element.addClass('material-selected');
    },
    /**
     * Hides all the extra options (used when tile is "deactivated")
     */
    hideExtensions: function () {
        const extraOptions = this.getExtensions();
        Object.keys(extraOptions).forEach(function (key) {
            extraOptions[key].addClass('hidden');
        });
        this.viewHandler.close('search');
        this._attached = false;
    },
    /**
     * Shows the tile extra options (when tile is activated)
     * @return {[type]} [description]
     */
    showExtensions: function () {
        const extraOptions = this.getExtensions();
        Object.keys(extraOptions).forEach(function (key) {
            extraOptions[key].removeClass('hidden');
        });
        this._attached = true;
    },
    isAttached: function () {
        return this._attached;
    },
    /**
     * [getExtensions description]
     * @return {Object} with key as flyout id and value of DOM-element for the extra option in the tile
     */
    getExtensions: function () {
        return this._tileExtensions;
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol': ['Oskari.userinterface.Tile']
});
