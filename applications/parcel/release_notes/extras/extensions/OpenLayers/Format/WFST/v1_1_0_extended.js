/**
 * @requires OpenLayers/Format/WFST/v1_1_0.js
 * @requires OpenLayers.Util.js
 */

/**
 * Class: OpenLayers.Format.WFST.v1_1_0_extended
 * A format for creating WFS v1.1.0 transactions that support <OpenLayers.Filter.GmlObjectId> filter.
 *
 * Notice, <OpenLayers.Format.WFST.v1_1_0_extended> is used as a default with
 * <OpenLayers.Protocol.WFS.v1_1_0_extended> protocol.
 * Example:
 * (code)
 * new OpenLayers.Layer.Vector("WFS", {
 *     protocol : new OpenLayers.Protocol.WFS(
 *                  {version : "1.1.0_extended", url: "", featureType: "", featureNs: "", featurePrefix: "", srsName: ""} )
 * })
 * (end)
 *
 * Notice, instead of creating an instance of this class directly, you may use the
 * <OpenLayers.Format.WFST> function by setting v1_1_0_extended for the options version.
 * <OpenLayers.Format.WFST> creates the format instance of the class that corresponds the
 * version string. You may also need to define options that are also defined for the protocol,
 * such as version, featureType, featureNS, featurePrefix, geometryName, srsName, schema,
 * if you set the protocol format separately.
 * Example:
 * <code>
 * new OpenLayers.Layer.Vector("WFS", {
 *     protocol : new OpenLayers.Protocol.WFS( {
 *         version : "1.1.0", url: "", featureType: "", featureNs: "", featurePrefix: "", srsName: "",
 *         format: OpenLayers.Format.WFST(
 *             {version: "1.1.0_extended", featureType: "", featureNs: "", featurePrefix: "", geometryName : "", srsName: ""}) })
 * </code>
 *
 * You may also, create a new instance of this class with the <OpenLayers.Format.WFST.v1_1_0_extended> constructor.
 * Example:
 * (code)
 * format: new OpenLayers.Format.WFST.v1_1_0_extended(
 *              {featureType: "", featureNs: "", featurePrefix: "", geometryName : "", srsName: ""})
 * (end)
 *
 * Inherits from:
 *  - <OpenLayers.Format.WFST.v1_1_0>
 */
OpenLayers.Format.WFST.v1_1_0_extended = OpenLayers.Class(OpenLayers.Format.WFST.v1_1_0, {

    /**
     * Constructor: OpenLayers.Format.WFST.v1_1_0_extended
     * A class for parsing and generating WFS v1.1.0 transactions by using GmlObjectId filter.
     *
     * Notice, you may need to define options that are also defined for the protocol,
     * such as version, featureType, featureNS, featurePrefix, geometryName, srsName, schema.
     *
     * See parent class for more information.
     */
    initialize : function(options) {
        if (options) {
            // Make sure that options object contains the correct version information.
            // Because this class is an extension to the 1_1_0 version, the version in
            // options object may contain the postix string if this object is created by
            // the OpenLayers.Format.WSFT base class. The postfix should not be set here
            // for the parent class settings because version information is sent to the
            // server which may not understand extra postfix in the string.
            options.version = OpenLayers.Format.WFST.v1_1_0_extended.prototype.version;
        }

        OpenLayers.Format.WFST.v1_1_0.prototype.initialize.apply(this, [options]);
    },

    /**
     * OpenLayers.Format.WFST.v1_1_0_extended specific readers.
     *
     * GmlObjectId related implementation is added on top of parent implementation.
     * Also, functions provided by parent that require GmlObjectId specific implementation
     * are overriden.
     *
     * Notice, (code)this(end)-reference is used in some of the functions defined here.
     * Therefore, functions should be called by using call or apply method with
     * correct parameter for this.
     */
    readers : OpenLayers.Util.applyDefaults({
        "ogc" : OpenLayers.Util.applyDefaults({
            "Filter" : function(node, parent) {
                // Filters correspond to subclasses of OpenLayers.Filter.
                // Since they contain information we don't persist, we
                // create a temporary object and then pass on the filter
                // (ogc:Filter) to the parent obj.
                var obj = {
                    fids : [],
                    gids : [],
                    filters : []
                };
                this.readChildNodes(node, obj);
                if (obj.gids.length > 0) {
                    parent.filter = new OpenLayers.Filter.GmlObjectId({
                        gids : obj.gids
                    });

                } else if (obj.fids.length > 0) {
                    parent.filter = new OpenLayers.Filter.FeatureId({
                        fids : obj.fids
                    });

                } else if (obj.filters.length > 0) {
                    parent.filter = obj.filters[0];
                }
            },
            "GmlObjectId" : function(node, obj) {
                var gid = node.getAttribute("gid");
                if (gid) {
                    obj.gids.push(gid);
                }
            }
        }, OpenLayers.Format.WFST.v1_1_0.prototype.readers["ogc"])
    }, OpenLayers.Format.WFST.v1_1_0.prototype["readers"]),

    /**
     * OpenLayers.Format.WFST.v1_1_0_extended specific writers.
     *
     * GmlObjectId related implementation is added on top of parent implementation.
     * Also, functions provided by parent that require GmlObjectId specific implementation
     * are overriden.
     *
     * Notice, (code)this(end)-reference is used in some of the functions defined here.
     * Therefore, functions should be called by using call or apply method with
     * correct parameter for this.
     */
    writers : OpenLayers.Util.applyDefaults({
        "ogc" : OpenLayers.Util.applyDefaults({
            "Filter" : function(filter) {
                var node = this.createElementNSPlus("ogc:Filter");
                if (filter.type === "GID") {
                    OpenLayers.Format.WFST.v1_1_0_extended.prototype.writeGmlObjectIdNodes.call(this, filter, node);

                } else if (filter.type === "FID") {
                    OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this, filter, node);

                } else {
                    this.writeNode(this.getFilterType(filter), filter, node);
                }
                return node;
            },
            "GmlObjectId" : function(gid) {
                return this.createElementNSPlus("ogc:GmlObjectId", {
                    attributes : {
                        "gml:id" : gid
                    }
                });
            },
            "And" : function(filter) {
                var node = this.createElementNSPlus("ogc:And");
                var childFilter;
                for (var i = 0, ii = filter.filters.length; i < ii; ++i) {
                    childFilter = filter.filters[i];
                    if (childFilter.type === "GID") {
                        OpenLayers.Format.WFST.v1_1_0_extended.prototype.writeGmlObjectIdNodes.call(this, childFilter, node);

                    } else if (childFilter.type === "FID") {
                        OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this, childFilter, node);

                    } else {
                        this.writeNode(this.getFilterType(childFilter), childFilter, node);
                    }
                }
                return node;
            },
            "Or" : function(filter) {
                var node = this.createElementNSPlus("ogc:Or");
                var childFilter;
                for (var i = 0, ii = filter.filters.length; i < ii; ++i) {
                    childFilter = filter.filters[i];
                    if (childFilter.type === "GID") {
                        OpenLayers.Format.WFST.v1_1_0_extended.prototype.writeGmlObjectIdNodes.call(this, childFilter, node);

                    } else if (childFilter.type === "FID") {
                        OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this, childFilter, node);

                    } else {
                        this.writeNode(this.getFilterType(childFilter), childFilter, node);
                    }
                }
                return node;
            },
            "Not" : function(filter) {
                var node = this.createElementNSPlus("ogc:Not");
                var childFilter = filter.filters[0];
                if (childFilter.type === "GID") {
                    OpenLayers.Format.WFST.v1_1_0_extended.prototype.writeGmlObjectIdNodes.call(this, childFilter, node);

                } else if (childFilter.type === "FID") {
                    OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this, childFilter, node);

                } else {
                    this.writeNode(this.getFilterType(childFilter), childFilter, node);
                }
                return node;
            }
        }, OpenLayers.Format.WFST.v1_1_0.prototype.writers["ogc"])
    }, OpenLayers.Format.WFST.v1_1_0.prototype["writers"]),

    filterMap : OpenLayers.Util.applyDefaults({
        "GID" : "GmlObjectId"
    }, OpenLayers.Format.WFST.v1_1_0.prototype.filterMap),

    /**
     * Method: writeGmlObjectNodes
     *
     * Parameters:
     * filter - {<OpenLayers.Filter.GmlObjectId}
     * node - {DOMElement}
     */
    writeGmlObjectIdNodes : function(filter, node) {
        for (var i = 0, ii = filter.gids.length; i < ii; ++i) {
            // Notice, this-reference is used here.
            // Therefore, call or apply method with correct parameter
            // for this-reference is required when function is used.
            this.writeNode("GmlObjectId", filter.gids[i], node);
        }
    },

    CLASS_NAME : "OpenLayers.Format.WFST.v1_1_0_extended"
});
