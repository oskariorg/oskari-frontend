/**
 *
 */
Oskari.clazz.define('Oskari.lupapiste.bundle.lupakartta.plugin.PrintPlugin', function () {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._printUrl = null;
    this._printer = null;
}, {
    __name: 'lupakartta.PrintPlugin',

    _markers: [],

    getName: function () {
        return this.pluginName;
    },

    getMapModule: function () {
        return this.mapModule;
    },
    setMapModule: function (mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    setPrintUrl: function (printUrl) {
        this.printUrl = printUrl;
    },
    init: function (sandbox) {
        var me = this;
        this.requestHandlers = {};
        this._printer = new OpenLayers.Control.TileStitchPrinter({
            printUrl: me.printUrl,
            beforePrint: function () {
                alert("One moment, please...");
            },
            handleResponse: function (url) {
                alert('The print is ready, and will open in a new window.');
                window.open(url);
            },
            handleError: function (error) {
                alert("Printing failed:\n\n" + error);
            }
        });
        me._map.addControl(this._printer);

        hub.subscribe("map-print", function (e) {
            var sandbox = Oskari.getSandbox();
            sandbox.printDebug("[Oskari.lupapiste.bundle.lupakartta.plugin.PrintPlugin] map-print");
            var mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
            var printPlugin = mapmodule.getPluginInstances('lupakartta.PrintPlugin');
            printPlugin._printer.print();
        });
    },

    register: function () {

    },
    unregister: function () {

    },

    startPlugin: function (sandbox) {
        var me = this,
            p;
        me._sandbox = sandbox;
        me._map = me.getMapModule().getMap();

        sandbox.register(me);
        for (p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }
    },
    stopPlugin: function (sandbox) {
        var me = this,
            p;
        for (p in me.eventHandlers) {
            sandbox.unregisterFromEventByName(me, p);
        }
        sandbox.unregister(me);
        me._map = null;
        me._sandbox = null;
    },

    /* @method start
     * called from sandbox
     */
    start: function (sandbox) {},
    /**
     * @method stop
     * called from sandbox
     *
     */
    stop: function (sandbox) {},

    eventHandlers: {},

    onEvent: function (event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    }
}, {
    'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
