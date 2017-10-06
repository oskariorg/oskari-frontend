
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
    this.sb = this.instance.getSandbox(),
    this.statsService = service;
    this.container = null;
    this.template = null;
    this._tileExtensions = [];
    this._flyoutManager = Oskari.clazz.create('Oskari.statistics.statsgrid.FlyoutManager', instance);
    this._templates = {
        search: jQuery('<span class="statsgrid-functionality" id="search"><h5 id="material-desc">Aineistohaku</h5></span>'),
        view: jQuery('<span class="statsgrid-functionality" id="dataview"><h5 id="material-desc">Haun tulokset</h5></span>'),
        filter: jQuery('<span class="statsgrid-functionality" id="filter"><h5 id="material-desc">Aineiston suodatus</h5></span>')
    }
}, {
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return 'Oskari.statistics.statsgrid.Tile';
    },
    hasData: function () {
        return this.statsService.getDatasource().length;
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
        // this.setEl( jQuery('<div></div>') );
        this._addTileStyleClasses();
        for (var p in this.eventHandlers) {
            this.instance.getSandbox().registerForEventByName(this, p);
        }
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
        return this.instance.getLocalization().flyout.title;
    },
    /**
     * @method getDescription
     * @return {String} localized text for the description of the tile
     */
    getDescription : function() {
        return this.instance.getLocalization('desc');
    },
    /**
     * @method getOptions
     * Interface method implementation, does nothing atm
     */
    getOptions : function() {

    },
    /**
     * @method setState
     * @param {Object} state
     *      state that this component should use
     * Interface method implementation, does nothing atm
     */
    setState : function(state) {
    },
    /**
     * @method refresh
     * Creates the UI for a fresh start
     */
    refresh : function() {
        var me = this;
        var instance = me.instance;
        var sandbox = instance.getSandbox();
        // this.setEnabled(this.hasData());
        for ( var template in this._templates ) {
            var icon = this._templates[template];
            this.extendTile(icon);
        }
        this.hideExtension();

    },
    extendTile: function ( el ) {
          var container = this.container.append(el);
          var extension = container.find(el);
          this._tileExtensions.push(extension);
    },
    hideExtension: function () {
          this._tileExtensions.forEach(function(extension) {
            extension.hide();
          });
    },      
    showExtension: function (el, callback) {
        el.show();
        el.on("click", function(event) {
            if( jQuery(this).hasClass('material-selected') ) {
                jQuery(this).removeClass('material-selected');
            } else {
                jQuery(this).addClass('material-selected');
            }
            event.stopPropagation();
            callback( this.id );
        })
    },
    getExtensions: function () {
        return this._tileExtensions;
    },
    getFlyout: function ( type ) {
        return this._flyoutManager.getFlyout( type );
    },
    openFlyout: function ( type ) {
        var flyout = this._flyoutManager.getFlyout( type );
        this._flyoutManager.open( flyout );
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent: function (event) {

        var handler = this.eventHandlers[event.getName()];
        if (!handler)
            return;

        // Skip events, if internally linked layer
        if(typeof event.getMapLayer === 'function' && event.getMapLayer().isLinkedLayer() ){
            this.plugins['Oskari.userinterface.Tile'].refresh();
            return;
        }

        return handler.apply(this, [event]);

    },
    eventHandlers: {
        'userinterface.ExtensionUpdatedEvent': function ( event ) {
            var me = this;
            var wasClosed = event.getViewState() === 'close';
            // moving flyout around will trigger attach states on each move
            var visibilityChanged = this.visible === wasClosed;
            this.visible = !wasClosed;
            if( wasClosed ) {
                this.hideExtension();
                return;
            } else {
            this.getExtensions().forEach( function( extension ) {
                if( extension[0].id === "search" ) {
                    me.showExtension( extension, me.openFlyout.bind( me ) );    
                }
                if( extension[0].id === "dataview" ) {
                    me.showExtension( extension, me.openFlyout.bind( me ) );
                }
                if( extension[0].id === "filter" ) {
                    me.showExtension( extension, me.openFlyout.bind(  me ) );
                }
            });
            }
        },
        'StatsGrid.Filter': function(evt) {
            if( this.statsService === undefined ) {
                this.statsService = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
            }
                this.statsService.notifyOskariEvent(evt);
        },   
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.userinterface.Tile']
});
