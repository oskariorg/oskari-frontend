
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
    this._tileExtensions = [];
    this._flyoutManager = Oskari.clazz.create('Oskari.statistics.statsgrid.FlyoutManager', instance, service);
    this._templates = {
        extraSelection : _.template('<div class="statsgrid-functionality ${ id }" data-view="${ id }"><div class="icon"></div><div class="text">${ label }</div><div class="clear"></div></div>')
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
     * Interface method implementation, calls #refresh()
     */
    startPlugin : function() {
        this._addTileStyleClasses();
        this.refresh();
    },
    initFlyoutManager: function () {
        this._flyoutManager.init();
    },
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
     * @method refresh
     * Creates the UI for a fresh start
     */
    refresh : function() {
        var me = this;
        var instance = me.instance;
        var sandbox = instance.getSandbox();
        var tpl = this._templates.extraSelection;
        this._flyoutManager.flyoutInfo.forEach(function(flyout) {
            var tileExtension = jQuery(tpl({
                id: flyout.id,
                label : flyout.title
            }));
            me.extendTile(tileExtension, flyout.id);
        });
        this.hideExtension();

    },
    extendTile: function (el,type) {
          var container = this.container.append(el);
          var extension = container.find(el);
          this._tileExtensions[type] = extension;
    },
    hideExtension: function () {
        var me = this;
        for(var type in me._tileExtensions) {
            var extension = me._tileExtensions[type];
            extension.removeClass('material-selected');
            extension.hide();
        }
    },
    toggleExtensionClass: function(type, wasClosed) {
        var me = this;
        var el = jQuery('.statsgrid-functionality.'+type);
        if(wasClosed) {
            el.removeClass('material-selected');
            me._flyoutManager.hide(type);
            return;
        }
        if (el.hasClass('material-selected') ) {
            el.removeClass('material-selected');
        } else {
            el.addClass('material-selected');
        }
    },
    showExtension: function (el, callback) {
        var me = this;
        el.show();
        el.unbind('click');
        el.bind('click', function(event) {
            var type = jQuery(this).attr('data-view');
            me.toggleExtensionClass(type);
            event.stopPropagation();
            callback(type);
        });
    },
    getExtensions: function () {
        return this._tileExtensions;
    },
    getFlyoutManager: function () {
        return this._flyoutManager;
    },
    getFlyout: function (type) {
        return this._flyoutManager.getFlyout(type);
    },
    openFlyout: function (type) {
        if ( this._flyoutManager.openFlyouts[type] ) {
            this._flyoutManager.hide(type);
            return;
        }
        this._flyoutManager.open(type);
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.userinterface.Tile']
});
