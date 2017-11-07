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
        this.localization = undefined;
        this.sandbox = null;
        this.views = null;
    }, {
    /**
     * @static
     * @property __name
     */
    __name: 'Printout',
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
        this.localization = Oskari.getLocalization(this.getName());
        this.addToToolbar();
        this._initViews();
        this.views["print"].createUi();
    },
    addToToolbar: function () {
        var me = this;
            // request toolbar to add buttons
            var addBtnRequestBuilder = this.sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest'),
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
    },
    _initViews: function () {
        this.views = {
            print: Oskari.clazz.create("Oskari.mapping.printout2.view.print", this )
        }
    },
    getLocalization: function (key) {
    if (!this._localization) {
        this._localization = Oskari.getLocalization(this.getName());
    }
    if (key) {
        return this._localization[key];
    }
    return this._localization;
},
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers: {

    }

    }, {

    });