/**
 * @class Oskari.mapframework.bundle.printout.PrintoutBundleInstance
 *
 * Main component and starting point for the "map printout" functionality. Printout
 * is a wizardish tool to configure a printout .
 *
 * See Oskari.mapframework.bundle.printout.PrintoutBundle for bundle definition.
 *
 */
Oskari.clazz.define("Oskari.mapping.printout2.instance",
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.started = false;
        this._localization = undefined;
        this.sandbox = null;
        this.views = null;
        this.buttonGroup = 'viewtools';
    }, {
    /**
     * @static
     * @property __name
     */
    __name: 'Printout2',

    init: function () {

    },
    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName: function () {
        return this.__name;
    },
    isInitialized: function () {
        return this.started;
    },
    /**
     * @method getSandbox
     * @return {Oskari.Sandbox}
     */
    getSandbox: function () {
        return this.sandbox;
    },
    start: function () {
        if( this.isInitialized() ) {
            return;
        }
        this.sandbox = Oskari.getSandbox();
        this.localization = Oskari.getLocalization( this.getName() );
        this.sandbox.register(this);
        for (p in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                this.sandbox.registerForEventByName(this, p);
            }
        }
        this.addToToolbar();
        this._initViews();
        this.views["print"].createUi();
    },
    addToToolbar: function () {
        var me = this;
            // request toolbar to add buttons
            var addBtnRequestBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest'),
                tool,
                btns = {
                    'print': {
                        iconCls: 'tool-print',
                        tooltip: this.localization.btnTooltip,
                        sticky: true,
                        callback: function () {
                            me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me, 'attach']);
                        }
                    }
                };
            for (tool in btns) {
                // Button not in UI - activated in an other route
                if (btns.hasOwnProperty(tool)) {
                    me.sandbox.request( me, addBtnRequestBuilder(tool, this.buttonGroup, btns[tool]));
                }
            }
    },
    _initViews: function () {
        this.views = {
            print: Oskari.clazz.create("Oskari.mapping.printout2.view.print", this )
        }
    },
    getLocalization: function ( key ) {
        if ( !this._localization ) {
            this._localization = Oskari.getLocalization( this.getName() );
        }
        if ( key ) {
            return this._localization[key];
        }
        return this._localization;
    },
    /**
     * @method onEvent
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     */
    onEvent: function (event) {
        var handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers: {
        /**
         * @method userinterface.ExtensionUpdatedEvent
         */
        'userinterface.ExtensionUpdatedEvent': function (event) {
            debugger;
            var me = this;

            if (event.getExtension().getName() !== me.getName()) {
                // not me -> do nothing
                return;
            }

            var isOpen = event.getViewState() !== "close";
            me.displayContent(isOpen);

        }
    }

    }, {
        "protocol": ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension', 'Oskari.userinterface.Stateful']
    });