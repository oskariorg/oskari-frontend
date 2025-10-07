import './plugin/DrawPlugin.ol';
import './request/StartDrawingRequest';
import './request/StopDrawingRequest';
import './event/DrawingEvent';
/**
 * @class Oskari.mapping.drawtools.DrawToolsBundleInstance
 *
 * Main component and starting point for the "drawtools" functionality.
 * Provides functionality for other bundles for drawing on the map.
 *
 * Drawing can be started with a DrawTools.StartDrawingRequest.
 *
 * Drawing can be forced to complete/canceled with DrawTools.StopDrawingRequest.
 * Other components are notified that a drawing has been completed by DrawingEvent.
 *
 * Bundle config can be used to define default style.
 * Requests can specify draw, modify and/or invalid styles to override default style used for drawing.
 *
 */
Oskari.clazz.define('Oskari.mapping.drawtools.DrawToolsBundleInstance',

    /**
 * @method create called automatically on construction
 * @static
 */
    function () {
    }, {
    /**
     * @static
     * @property __name
     */
        __name: 'DrawTools',

        /**
     * @static
     * @property __validShapeTypes
     */
        __validShapeTypes: ['Point', 'Circle', 'Polygon', 'Box', 'Square', 'LineString'],

        /**
     * @method getName
     * @return {String} the name for the component
     */
        getName: function () {
            return this.__name;
        },
        /**
     * @method getSandbox
     * @return {Oskari.Sandbox}
     */
        getSandbox: function () {
            return this.sandbox;
        },
        getPlugin: function () {
            return this.drawPlugin;
        },
        /**
     * @method update
     * implements BundleInstance protocol update method - does nothing atm
     */
        update: function () {
        },
        /**
     * @method start
     * implements BundleInstance protocol start methdod
     */
        start: function (sandbox) {
            this.sandbox = sandbox;

            sandbox.register(this);

            // initialize drawPlugin
            this.drawPlugin = Oskari.clazz.create('Oskari.mapping.drawtools.plugin.DrawPlugin');

            // register plugin for map (drawing for my places)
            // Note! this.mapModule is used and injected in Jest-test
            const mapModule = this.mapModule || sandbox.findRegisteredModuleInstance('MainMapModule');
            mapModule.registerPlugin(this.drawPlugin);
            mapModule.startPlugin(this.drawPlugin);

            const { style } = this.conf || {};
            // TODO: is there need for multiple styles? style.default, style.edit?
            if (style) {
                // safety check, if conf is used for setting draw, modify and/or intersect styles intead of one default base style.
                if (['draw', 'modify', 'intersect', 'invalid'].some(type => style[type])) {
                    this.drawPlugin.setStyles(style);
                } else {
                    this.drawPlugin.setDefaultStyle(style);
                }
            }

            // handleRequest is being called for these
            sandbox.requestHandler('DrawTools.StartDrawingRequest', this);
            sandbox.requestHandler('DrawTools.StopDrawingRequest', this);
        },
        /**
     * @method init
     * implements Module protocol init method - initializes request handlers
     */
        init: function () {},
        /**
     *
     * @param {Oskari.mapframework.core.Core} core
     *      reference to the application core (reference sandbox core.getSandbox())
     * @param {Oskari.mapping.drawtools.request.StartDrawingRequest|Oskari.mapping.drawtools.request.StopDrawingRequest} request
     */
        handleRequest: function (core, request) {
            if (request.getName() === 'DrawTools.StartDrawingRequest') {
                const shapeType = request.getShape();
                if (!this.isValidShapeType(shapeType)) {
                    Oskari.log(this.getName()).error('Illegal shape type for StartDrawingRequest: ' + shapeType + '. Must be one of: ' + this.__validShapeTypes.join(', ') + '.');
                    return;
                }
                this.drawPlugin.draw(request.getId(), shapeType, request.getOptions());
            } else if (request.getName() === 'DrawTools.StopDrawingRequest') {
                this.drawPlugin.stopDrawing(request.getId(), request.isClearCurrent(), request.supressEvent());
            }
        },

        /**
     * @method isValidShapeType
     * @param {string} shapeType shape type to be drawn
     * @return {boolean}
     */
        isValidShapeType: function (shapeType) {
            return this.__validShapeTypes.indexOf(shapeType) >= 0;
        },
        /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
        onEvent: function (event) {
        },

        /**
     * @method stop
     * implements BundleInstance protocol stop method
     */
        stop: function () {
            var me = this;
            // TODO: maybe stop/unregister drawplugin?
            me.sandbox.unregister(me);
            me.started = false;
        }
    }, {
    /**
     * @property {String[]} protocol
     * @static
     */
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
    });
