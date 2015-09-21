/**
 * @class Oskari.mapping.drawtools.plugin.DrawPlugin
 *
 *  Map engine specific implementation for draw tools
 */
Oskari.clazz.define(
    'Oskari.mapping.drawtools.plugin.DrawPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this._clazz = 'Oskari.mapping.drawtools.plugin.DrawPlugin';
        this._name = 'GenericDrawPlugin';
    }, {
        setDefaultStyle : function(style) {
            // TODO: save this, style is an object like this:
            /*
             {
                "fillOpacity": 0.2,
                "strokeWidth": 3,
                "strokeColor": "#000000",
                "fillColor": "#9966FF",
                "labelOutlineColor": "#FFFFFF",
                "labelOutlineWidth": 3,
                "fontFamily": "Open+Sans",
                "fontWeight": "bold",
                "fontSize": "12px"
            }
             */

        },
        draw : function(id, shape, options) {
            // TODO: implementations
            // if shape == geojson -> setup editing it
            // if shape == undefined -> update buffer for existing drawing (any other reason for this? text etc?)
            // if shape is one of the predefined draw options -> start corresponding draw tool
            // if options.buffer is defined -> use it for dot and line and prevent dragging to create buffer
            // TODO : start draw control
            // use default style if options don't include custom style
        },
        stopDrawing : function(id, clearCurrent) {
            var sb = this.getSandbox();
            // TODO: get geojson for matching id
            var geojson = undefined;
            var data = {
                lenght : 'optional line length',
                area : 'optional area size'
            };
            if(clearCurrent) {
                // TODO: clear the drawing matching the id from map
            }
            var event = sb.getEventBuilder('DrawingEvent')(id, geojson, data);
            sb.notifyAll(event);
            // TODO: deactivate draw control
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
