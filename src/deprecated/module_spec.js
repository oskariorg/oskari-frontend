
(function (o) {
    var cs = o.clazz;

    /* @class Oskari.ModuleSpec
     * Helper class instance of which is returned from oskari 2.0 api
     * Returned class instance may be used to chain class definition calls.
     *
     * @param {Object} classInfo ClassInfo
     * @param {string} className Class name
     *
     */
    cs.define('Oskari.ModuleSpec', function (classInfo, className) {
        this.cs = cs;
        this.classInfo = classInfo;
        this.className = className;
    }, {

        /**
         * @private @method _slicer
         */
        _slicer: Array.prototype.slice,

        /**
         * @method category
         * Adds a set of methods to class
         *
         * @param  {Object}            prototype    Prototype
         * @param  {string}            categoryName Category name
         *
         * @return {Oskari.ModuleSpec}              this
         */
        category: function (prototype, categoryName) {
            var classInfo = cs.category(
                this.className,
                categoryName ||
                    (['__', o.seq.nextVal('Category')].join('_')),
                prototype
            );
            this.classInfo = classInfo;
            return this;
        },

        /**
         * @method methods
         * Adds a set of methods to class - alias to category
         *
         * @param  {}                  prototype    Prototype
         * @param  {string}            categoryName Category name
         *
         * @return {Oskari.ModuleSpec}              this
         */
        methods: function (prototype, categoryName) {
            var classInfo = cs.category(
                this.className,
                categoryName ||
                    (['__', o.seq.nextVal('Category')].join('_')),
                prototype
            );
            this.classInfo = classInfo;
            return this;
        },

        /**
         * @method extend
         * Adds inheritance from a base class.
         * Base class can be declared later but must be defined before
         * instantiation.
         *
         * @param  {Object|Object[]}   clazz Class or an array of classes
         *
         * @return {Oskari.ModuleSpec}       this
         */
        extend: function (clazz) {
            var classInfo;

            if (clazz === null || clazz === undefined) {
                throw new TypeError('extend(): Missing clazz');
            }

            classInfo = cs.extend(
                this.className,
                clazz.length ? clazz : [clazz]
            );
            this.classInfo = classInfo;
            return this;
        },

        /**
         * @method create
         * Creates an instance of this clazz
         *
         *
         * @return {Object} Class instance
         */
        create: function () {
            return cs.createWithClassInfo(this.classInfo, arguments);
        },

        /**
         * @method nam
         * Returns the class name
         *
         *
         * @return {string} Class name
         */
        name: function () {
            return this.className;
        },

        /**
         * @method metadata
         * Returns class metadata
         *
         *
         * @return {Object} Class metadata
         */
        metadata: function () {
            return cs.getMetadata(this.className);
        },

        /**
         * @method events
         * Adds a set of event handlers to class
         *
         * @param  {Object}            events Eventhandlers map
         *
         * @return {Oskari.ModuleSpec}        this
         */
        events: function (events) {
            var orgmodspec = this;
            orgmodspec.category({
                eventHandlers: events,
                onEvent: function (event) {
                    var handler = this.eventHandlers[event.getName()];
                    if (!handler) {
                        return;
                    }

                    return handler.apply(this, [event]);
                }
            }, '___events');
            return orgmodspec;
        },

        /**
         * @method requests
         *
         * @param  {Object}            requests Requesthandlers map
         *
         * @return {Oskari.ModuleSpec}          this
         */
        requests: function (requests) {
            var orgmodspec = this;
            orgmodspec.category({
                requestHandlers: requests,
                onRequest: function (request) {
                    var handler = this.requestHandlers[request.getName()];
                    return handler ? handler.apply(this, [request]) : undefined;
                }
            }, '___requests');
            return orgmodspec;
        },

        /**
         * @method builder
         *
         *
         * @return {function}
         */
        builder: function () {
            return cs.getBuilderFromClassInfo(this.classInfo);
        }
    });
}(Oskari));
