/*global define*/
define([
        'libraries/cesium/cesium-b30/Source/Core/Cartesian3',
        'libraries/cesium/cesium-b30/Source/Core/Cartographic',
        'libraries/cesium/cesium-b30/Source/Core/defaultValue',
        'libraries/cesium/cesium-b30/Source/Core/defined',
        'libraries/cesium/cesium-b30/Source/Core/defineProperties',
        'libraries/cesium/cesium-b30/Source/Core/DeveloperError',
        'libraries/cesium/cesium-b30/Source/Core/Ellipsoid',
        'libraries/Proj4js/proj4js-2.2.1/proj4-src',
    ], function(
        Cartesian3,
        Cartographic,
        defaultValue,
        defined,
        defineProperties,
        DeveloperError,
        Ellipsoid,
        Proj4js) {
    "use strict";

    /**
     * Custom Proj4js map projection. The given projection definition is used for mapping coordinates.
     * Defaults to EPSG:4326 when no projection is provided and assumes WGS84 ellipsoid can be used.
     * NOTE! INITIAL DRAFT!
     *
     * @alias Proj4jsProjection
     * @constructor
     *
     * @param {Proj4js} [proj=EPSG:4326] The projection definition.
     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid.
     *
     * @see GeographicProjection
     */
    // Written based upon GeographicProjection by mrblombe.
    var Proj4jsProjection = function(proj, ellipsoid) {
        this._projection = new Proj4js.Proj(proj || "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");
        this._wgs84 = new Proj4js.Proj("+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");
        this._ellipsoid = defaultValue(ellipsoid, Ellipsoid.WGS84);
        this._semimajorAxis = this._ellipsoid.maximumRadius;
        this._oneOverSemimajorAxis = 1.0 / this._semimajorAxis;
    };

    defineProperties(Proj4jsProjection.prototype, {
        /**
         * Gets the {@link Ellipsoid}.
         *
         * @memberof GeographicProjection.prototype
         *
         * @type {Ellipsoid}
         * @readonly
         */
        ellipsoid : {
            get : function() {
                return this._ellipsoid;
            }
        }
    });

    /**
     * Projects a set of {@link Cartographic} coordinates, in radians, to map coordinates, in meters.
     * X and Y are the longitude and latitude, respectively, multiplied by the maximum radius of the
     * ellipsoid.  Z is the unmodified height.
     *
     * @param {Cartographic} cartographic The coordinates to project.
     * @param {Cartesian3} [result] An instance into which to copy the result.  If this parameter is
     *        undefined, a new instance is created and returned.
     * @returns {Cartesian3} The projected coordinates.  If the result parameter is not undefined, the
     *          coordinates are copied there and that instance is returned.  Otherwise, a new instance is
     *          created and returned.
     */
    Proj4jsProjection.prototype.project = function(cartographic, result) {
        var point = Proj4js.transform(this._projection, this._wgs84, [cartographic.longitude, cartographic.latitude]);
        var x = point.x;
        var y = point.y;
        var z = cartographic.height;

        if (!defined(result)) {
            return new Cartesian3(x, y, z);
        }

        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    };

    /**
     * Unprojects a set of projected {@link Cartesian3} coordinates, in meters, to {@link Cartographic}
     * coordinates, in radians.  Longitude and Latitude are the X and Y coordinates, respectively,
     * divided by the maximum radius of the ellipsoid.  Height is the unmodified Z coordinate.
     *
     * @param {Cartesian3} cartesian The Cartesian position to unproject with height (z) in meters.
     * @param {Cartographic} [result] An instance into which to copy the result.  If this parameter is
     *        undefined, a new instance is created and returned.
     * @returns {Cartographic} The unprojected coordinates.  If the result parameter is not undefined, the
     *          coordinates are copied there and that instance is returned.  Otherwise, a new instance is
     *          created and returned.
     */
    Proj4jsProjection.prototype.unproject = function(cartesian, result) {
        if (!defined(cartesian)) {
            throw new DeveloperError('cartesian is required');
        }

        var point = Proj4js.transform(this._wgs84, this._projection, [cartesian.x, cartesian.y]);
        var longitude = point.x;
        var latitude = point.y;
        var height = cartesian.z;

        if (!defined(result)) {
            return new Cartographic(longitude, latitude, height);
        }

        result.longitude = longitude;
        result.latitude = latitude;
        result.height = height;
        return result;
    };

    return Proj4jsProjection;
});
