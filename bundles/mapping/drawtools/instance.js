/**
 * @class Oskari.mapping.drawtools.DrawToolsBundleInstance
 *
 * Main component and starting point for the "drawtools" functionality.
 * Provides functionality for other bundles (my places/analysis/measuretools)
 * for drawing on the map.
 *
 * Drawing can be started with a request (DrawTools.StartDrawingRequest).
 * The request specifies:
 *  - an id for the drawing (like 'myplaces')
 *  - type of shape to be drawn or a geojson that should be opened for editing
 *  - options that might include buffer (for dot/line), style, etc
 *  Drawing can be forced to complete/canceled with DrawTools.StopDrawingRequest.
 *  Other components are notified that a drawing has been completed by DrawingEvent.
 *  The event includes:
 *   - id for the drawing
 *   - the geometry as geojson
 *   - possible additional info like area size/line length
 *
 * Bundle config can be used to define draw style. Requests can also specify
 * styles in the same format to be used instead of the default for that specific drawing.
 *
 * See Oskari.mapframework.bundle.infobox.InfoBoxBundle for bundle definition.
 */
Oskari.clazz.define("Oskari.mapping.drawtools.DrawToolsBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'DrawTools',

    /**
     * @static
     * @property __validShapeTypes
     */
    __validShapeTypes : ["Point","Circle","Polygon","Box","Square","LineString"],

    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method setSandbox
     * @param {Oskari.Sandbox} sandbox
     * Sets the sandbox reference to this component
     */
    setSandbox : function(sbx) {
        this.sandbox = sbx;
    },
    /**
     * @method getSandbox
     * @return {Oskari.Sandbox}
     */
    getSandbox : function() {
        return this.sandbox;
    },
    /**
     * @method update
     * implements BundleInstance protocol update method - does nothing atm
     */
    update : function() {
    },
    /**
     * @method start
     * implements BundleInstance protocol start methdod
     */
    start : function() {
        var me = this;
        // Should this not come as a param?
        var sandbox = Oskari.getSandbox();
        sandbox.register(me);
        me.setSandbox(sandbox);

        // register plugin for map (drawing for my places)
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        mapModule.registerPlugin(this.drawPlugin);
        mapModule.startPlugin(this.drawPlugin);

        var conf = this.conf || {};
        // TODO: is there need for multiple styles? style.default, style.edit?
        if(conf.style) {
            this.drawPlugin.setDefaultStyle(conf.style);
        }

        // handleRequest is being called for these
        sandbox.addRequestHandler('DrawTools.StartDrawingRequest', this);
        sandbox.addRequestHandler('DrawTools.StopDrawingRequest', this);
    },
    /**
     * @method init
     * implements Module protocol init method - initializes request handlers
     */
    init : function() {
        var me = this;

        // initialize drawPlugin
        this.drawPlugin = Oskari.clazz.create('Oskari.mapping.drawtools.plugin.DrawPlugin');
        return null;
    },
    /**
     *
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapping.drawtools.request.StartDrawingRequest|Oskari.mapping.drawtools.request.StopDrawingRequest} request
     */
    handleRequest : function(core, request) {
        if (request.getName() === 'DrawTools.StartDrawingRequest') {
            var shapeType = request.getShape();
            if(!this.isValidShapeType(shapeType)){
                Oskari.log(this.getName()).error('Illegal shape type for StartDrawingRequest: ' + shapeType + '. Must be one of: ' + this.__validShapeTypes.join(', ') + '.');
                return;
            }
            this.drawPlugin.draw(request.getId(), shapeType, request.getOptions());
        }
        else if (request.getName() === 'DrawTools.StopDrawingRequest') {
            this.drawPlugin.stopDrawing(request.getId(), request.isClearCurrent(), request.supressEvent());
        }
    },

    /**
     * @method isValidShapeType
     * @param {string} shapeType shape type to be drawn
     * @return {boolean}
     */
    isValidShapeType: function(shapeType){
        return this.__validShapeTypes.indexOf(shapeType) >= 0;
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent : function(event) {
    },

    /**
     * @method stop
     * implements BundleInstance protocol stop method
     */
    stop : function() {
        var me = this;
        var sandbox = this.sandbox;
        // TODO: maybe stop/unregister drawplugin?
        me.sandbox.unregister(me);
        me.started = false;
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    protocol : ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
