/**
 * @requires OpenLayers/Filter.js
 * @requires OpenLayers.Util.js
 */

/**
 * Class: OpenLayers.Filter.GmlObjectId
 * This class represents an ogc:GmlObjectId Filter.
 *
 * Notice, this filter is used with
 * <OpenLayers.Protocol.WFS.v1_1_0_extended> protocol
 * and <OpenLayers.Format.WFST.v1_1_0_extended> protocol format.
 *
 * This class implementation is close to the <OpenLayers.Filter.FeatureId>.
 * But, instead of using fids this class uses gids.
 *
 * Inherits from:
 * - <OpenLayers.Filter>
 */
OpenLayers.Filter.GmlObjectId = OpenLayers.Class(OpenLayers.Filter, {

    /**
     * APIProperty: gids
     * {Array(String)} Gml Object Ids to evaluate this rule against.
     *                 To be passed inside the params object.
     */
    gids : null,

    /**
     * Property: type
     * {String} Type to identify this filter.
     */
    type : "GID",

    /**
     * Constructor: OpenLayers.Filter.GmlObjectId
     * Creates an ogc:GmlObjectId rule.
     *
     * Parameters:
     * options - {Object} An optional object with properties to set on the
     *           rule
     *
     * Returns:
     * {<OpenLayers.Filter.GmlObjectId>}
     */
    initialize : function(options) {
        this.gids = [];
        OpenLayers.Filter.prototype.initialize.apply(this, [options]);
    },

    /**
     * APIMethod: evaluate
     * evaluates this rule for a specific feature
     *
     * Parameters:
     * feature - {<OpenLayers.Feature>} feature to apply the rule to.
     *           For vector features, the check is run against the gid,
     *           for plain features against the id.
     *
     * Returns:
     * {Boolean} true if the rule applies, false if it does not
     */
    evaluate : function(feature) {
        for (var i = 0, len = this.gids.length; i < len; i++) {
            var gid = feature.gid || feature.id;
            if (gid == this.gids[i]) {
                return true;
            }
        }
        return false;
    },

    /**
     * APIMethod: clone
     * Clones this filter.
     *
     * Returns:
     * {<OpenLayers.Filter.GmlObjectId>} Clone of this filter.
     */
    clone : function() {
        var filter = new OpenLayers.Filter.GmlObjectId();
        OpenLayers.Util.extend(filter, this);
        filter.gids = this.gids.slice();
        return filter;
    },

    CLASS_NAME : "OpenLayers.Filter.GmlObjectId"
});
