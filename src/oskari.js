/**
 * @class Oskari
 *
 * Oskari
 *
 * A set of methods to support loosely coupled classes and instances for the
 * mapframework
 *
 * @to-do - class instance checks against class metadata - protocol
 *        implementation validation
 *
 * 2014-09-25 additions
 * - added documentation
 * - backported cleaned up version from O2
 * - dead code elimination
 * - linted
 * - marked private functions
 * - reordered
 * - sensible/descriptive naming
 * - added type checks to arguments
 *
 * 2012-11-30 additions
 * - dropped compatibility for pre 2010-04 classes
 * - removed fixed root package requirement 'Oskari.' - implementing namespaces
 * - inheritance with extend() or extend: [] meta
 * - inheritance implemented as a brutal copy down of super clazz methods
 * - super clazz constructors applied behind the scenes in top-down order
 * - this implementation does *not* implement native js  instanceof for class hierarchies
 * - inheritance supports pushing down new method categories applied to super classes
 * - this implementation does not provide super.func() calls - may be added at a later stage
 *
 */
Oskari = (function () {
    var isDebug = false;
    var markers = [];

    // ga is basically O2ClassSystem._global / oskari.clazz._global
    var globals = {};
    var ga = function (key, value) {
        if (key === undefined) {
            return globals;
        }
        if (value !== undefined) {
            globals[key] = value;
        }
        return globals[key];
    };
    var cs = {};

    return {
        VERSION : "1.38.0",

        /**
         * @public @method Oskari.setDebugMode
         * @param {boolean} d Debug mode on/off
         *
         */
        setDebugMode: function (d) {
            isDebug = !!d;
        },

        /**
         * @public @static @method Oskari.setMarkers
         * @param {Array} markers markers
         */
        setMarkers: function(markers) {
            markers = markers || [];
        },
        /**
         * @public @static @method Oskari.getMarkers
         * @return {Array} markers markers
         */
        getMarkers: function() {
            return markers;
        },

        /*
         * @public @static @method Oskari.getSandbox
         * @param  {string=} sandboxName Sandbox name
         * @return {Object}              Sandbox
         */
        getSandbox: function (sandboxName) {
            return ga.apply(cs, [sandboxName || 'sandbox']);
        },

        /**
         * @public @static @method Oskari.setSandbox
         *
         * @param  {string=} sandboxName Sandbox name
         * @param  {Object}  sandbox     Sandbox
         *
         * @return
         */
        setSandbox: function (sandboxName, sandbox) {
            return ga.apply(cs, [sandboxName || 'sandbox', sandbox]);
        }
    };
}());