/**
 * @class Oskari.mapframework.bundle.printout.PrintoutBundleInstance
 *
 * Main component and starting point for the "map printout" functionality. Printout
 * is a wizardish tool to configure a printout .
 *
 * See Oskari.mapframework.bundle.printout.PrintoutBundle for bundle definition.
 *
 */
Oskari.clazz.define("Oskari.mapping.printout.instance",
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.started = false;
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
        if( isInitialized() ) {
            return;
        }
    },
    _initViews: function () {
        
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers: {

    }

    }, {

    });