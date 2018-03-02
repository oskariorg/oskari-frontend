
Oskari.clazz.define('Oskari.statistics.statsgrid.Tile',

/**
 * @method create called automatically on construction
 * @static
 * @param
 * {Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance}
 * instance
 *      reference to component that created the tile
 */
function(instance, service) {
    this.instance = instance;
    this.sb = this.instance.getSandbox();
    this.loc = this.instance.getLocalization();
    this.statsService = service;
    this.container = null;
    this.template = null;
    this._tileExtensions = {};
    this.flyoutManager = null;
    this._templates = {
        extraSelection : _.template('<div class="statsgrid-functionality ${ id }" data-view="${ id }"><div class="icon"></div><div class="text">${ label }</div></div>')
    };
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'Oskari.statistics.statsgrid.Tile';
    },
    /**
     * @method getTitle
     * @return {String} localized text for the title of the tile
     */
    getTitle : function() {
        return this.loc.flyout.title;
    },
    /**
     * @method getDescription
     * @return {String} localized text for the description of the tile
     */
    getDescription : function() {
        return this.instance.getLocalization('desc');
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
    setEl : function(el, width, height) {
        this.container = jQuery(el);
    },
    /**
     * @method startPlugin
     * Interface method implementation, calls #createUi()
     */
    startPlugin : function() {
        this._addTileStyleClasses();
    },
    setupTools: function ( flyoutManager ) {
        var me = this;
        var tpl = this._templates.extraSelection;
        this.flyoutManager = flyoutManager;
        
        flyoutManager.flyoutInfo.forEach(function(flyout) {
            var tileExtension = jQuery(tpl({
                id: flyout.id,
                label : flyout.title
            }));
            me.extendTile(tileExtension, flyout.id);
            tileExtension.bind('click', function(event) {
                event.stopPropagation();
                flyoutManager.toggle(flyout.id);
            });
        });

        this.hideExtensions();

        this.flyoutManager.on('show', function (flyout) {
            me.toggleExtension(flyout, true);
        });
        this.flyoutManager.on('hide', function (flyout) {
            me.toggleExtension(flyout, false);
        });
    },
    /**
     * Adds a class for the tile so we can programmatically identify which functionality the tile controls.
     */
    _addTileStyleClasses: function() {
        var isContainer = (this.container && this.instance.mediator) ? true : false;
        var isBundleId = (isContainer && this.instance.mediator.bundleId) ? true : false;
        var isInstanceId = (isContainer && this.instance.mediator.instanceId) ? true : false;

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
    stopPlugin : function() {
        this.container.empty();
    },
    /**
     * Adds an extra option on the tile
     */
    extendTile: function (el,type) {
          var container = this.container.append(el);
          var extension = container.find(el);
          this._tileExtensions[type] = extension;
    },
    toggleExtension: function (flyout, shown) {

        var element = this.getExtensions()[flyout];

        if ( !shown ) {
            element.removeClass('material-selected');
            return;
        }
        element.addClass('material-selected');
    },
    /**
     * Hides all the extra options (used when tile is "deactivated")
     */
    hideExtensions: function () {
        var me = this;
        var extraOptions = me.getExtensions();
        Object.keys(extraOptions).forEach(function(key) {
            // hide all flyout
            me.flyoutManager.hide( key );
            // hide the tile "extra selection"
            var extension = extraOptions[key];
            extension.removeClass('material-selected');
            extension.addClass('hidden');
        });
    },
    /**
     * Shows the tile extra options (when tile is activated)
     * @return {[type]} [description]
     */
    showExtensions: function () {
        var me = this;
        var extraOptions = me.getExtensions();
        this.flyoutManager.init();
        Object.keys(extraOptions).forEach(function(key) {
            extraOptions[key].removeClass('hidden');
        });
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
    'protocol' : ['Oskari.userinterface.Tile']
});
