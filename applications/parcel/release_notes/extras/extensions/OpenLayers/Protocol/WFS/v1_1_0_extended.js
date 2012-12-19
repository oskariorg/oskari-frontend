/**
 * @requires OpenLayers/Protocol/WFS/v1_1_0.js
 * @requires OpenLayers/Format/WFST/v1_1_0_extended.js
 * @requires OpenLayers/Filter/GmlObjectId.js
 */

/**
 * Class: OpenLayers.Protocol.WFS.v1_1_0_extended
 * A WFS v1.1.0 protocol with extended functionality for vector layers.
 *
 * Notice, this protocol uses <OpenLayers.Format.WFST.v1_1_0_extended> protocol format as
 * a default. Then, <OpenLayers.Filter.GmlObjectId> filter is also supported as a default.
 *
 * Notice, instead of creating an instance of this class directly, you may use the
 * <OpenLayers.Protocol.WFS> function by setting v1_1_0_extended for the options version.
 * <OpenLayers.Protocol.WFS> creates the protocol instance of the class that corresponds the
 * version string.
 *
 * Example:
 * (code)
 *     var protocol = new OpenLayers.Protocol.WFS({
 *         version: "1.1.0_extended",
 *         url:  "http://demo.opengeo.org/geoserver/wfs",
 *         featureType: "tasmania_roads",
 *         featureNS: "http://www.openplans.org/topp",
 *         geometryName: "the_geom"
 *     });
 * (end)
 *
 * Create a new instance with the <OpenLayers.Protocol.WFS.v1_1_0_extended> constructor.
 * Example:
 * (code)
 * protocol : new OpenLayers.Protocol.WFS.v1_1_0_extended( {
 *                  version : "1.1.0_extended",
 *                  url : "", featureType : "", featureNS : "", featurePrefix : "", srsName : "" } )
 * (end)
 *
 * See the protocols for specific WFS versions for more detail.
 *
 * Differences from the v1.1.0 protocol:
 *  - supports <OpenLayers.Format.WFST.v1_1_0_extended> protocol format that
 *    can support <OpenLayers.Filter.GmlObjectId> filter.
 *
 * Inherits from:
 *  - <OpenLayers.Protocol.WFS.v1_1_0>
 */
OpenLayers.Protocol.WFS.v1_1_0_extended = OpenLayers.Class(OpenLayers.Protocol.WFS.v1_1_0, {

    /**
     * Constructor: OpenLayers.Protocol.WFS.v1_1_0_extended
     * A class for giving extended layers WFS v1.1.0 protocol.
     *
     * See parent, <OpenLayers.Protocol.WFS.v1_1_0>, constructor
     * for more specific description.
     */
    initialize : function(options) {
        if (!options.format) {
            // Set the default protocol format if the format has not been set in options.
            // Notice, <OpenLayers.Format.WFST> uses the version string for the name of
            // the format class whose instance is created here. So, version v1_1_0_extended
            // string informs to create the <OpenLayers.Format.WFST.v1_1_0_extended> instance.
            this.format = OpenLayers.Format.WFST(OpenLayers.Util.extend({
                version : this.version,
                featureType : this.featureType,
                featureNS : this.featureNS,
                featurePrefix : this.featurePrefix,
                geometryName : this.geometryName,
                srsName : this.srsName,
                schema : this.schema
            }, this.formatOptions));
        }
        // Let the parent handle the initialization.
        OpenLayers.Protocol.WFS.v1_1_0.prototype.initialize.apply(this, arguments);
    },

    CLASS_NAME : "OpenLayers.Protocol.WFS.v1_1_0_extended"
});
