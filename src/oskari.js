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
    var oskariVersion = "1.37.0";

    var isDebug = false,
        isConsole = window.console && window.console.debug,
        logMsg = function (msg) {
            if (!isDebug) {
                return;
            }

            if (!isConsole) {
                return;
            }
            window.console.debug(msg);

        };


    //mode has no effect since require loader
    var mode = 'default';

    /**
     *
     */
    var O2ClassSystem = function () {
        this.packages = {};
        this.protocols = {};
        this.inheritance = {};
        this.aspects = {};
        this.classcache = {};
        this.globals = {};
    };

    O2ClassSystem.prototype = {

        /**
         * @public @method purge
         */
        purge: function () {
            // TODO implement & document?
            return undefined;
        },

        /**
         * @public @method protocol
         *
         * @param  {string} protocolName Protocol name
         *
         * @return {Object}              Protocol
         */
        protocol: function (protocolName) {
            if (protocolName === null || protocolName === undefined) {
                throw new TypeError('protocol(): Missing protocolName');
            }
            return this.protocols[protocolName];
        },

        /**
         * @private @method _getPackageDefinition
         *
         * @param  {string} packageName Package name
         *
         * @return {Object}             Package definition
         */
        _getPackageDefinition: function (packageName) {
            var packageDefinition = this.packages[packageName];

            if (!packageDefinition) {
                packageDefinition = {};
                this.packages[packageName] = packageDefinition;
            }
            return packageDefinition;
        },

        /**
         * @private @method _getClassQName
         *
         * @param  {string} className Class name
         *
         * @return {Object}           ClassQName
         */
        _getClassQName: function (className) {
            var parts = className.split('.');

            return {
                basePkg: parts[0],
                pkg: parts[1],
                sp: parts.slice(2).join('.')
            };
        },

        /**
         * @private @method _getClassInfo
         *
         * @param  {string} className Class name
         *
         * @return {Object}           ClassInfo
         */
        _getClassInfo: function (className) {
            var classInfo = this.classcache[className],
                classQName = this._getClassQName(className),
                packageDefinition;

            if (!classInfo) {
                packageDefinition = this._getPackageDefinition(classQName.pkg);
                classInfo = packageDefinition[classQName.sp];
                this.classcache[className] = classInfo;
            }
            return classInfo;
        },

        /**
         * @private @method _cloneProperties
         *
         * @param {Object}          from
         * @param {Object|Object[]} to
         *
         */
        _cloneProperties: function (from, to) {
            var i,
                propertyName,
                propertyValue,
                toArray = Array.isArray(to) ? to : [to];

            for (propertyName in from) {
                if (from.hasOwnProperty(propertyName)) {
                    propertyValue = from[propertyName];
                    for (i = toArray.length - 1; i >= 0; i -= 1) {
                        toArray[i][propertyName] = propertyValue;
                    }
                }
            }
        },

        /**
         * @private @method _createEmptyClassDefinition
         *
         *
         * @return {function()} Empty function with an empty prototype
         */
        _createEmptyClassDefinition: function () {
            var ret = function () {
                return undefined;
            };
            ret.prototype = {};
            return ret;
        },

        /**
         * @public @method getMetadata
         * Returns metadata for the class
         *
         * @param  {string} className Class name
         *
         * @return {Object}           Class metadata
         */
        getMetadata: function (className) {
            var classInfo;
            if (className === null || className === undefined) {
                throw new TypeError('metadata(): Missing className');
            }
            classInfo = this._getClassInfo(className);
            if (!classInfo) {
                throw 'Class ' + className + ' does not exist';
            }
            return classInfo._metadata;
        },

        /**
         * @private @method _updateMetadata
         * Updates and binds class metadata
         *
         * @param {string} basePkg   Base package
         * @param {string} pkg       Package
         * @param {string} sp
         * @param {Object} classInfo ClassInfo
         * @param {Object} classMeta Class metadata
         *
         */
        _updateMetadata: function (basePkg, pkg, sp, classInfo, classMeta) {
            var protocols,
                p,
                pt,
                className;

            if (!classInfo._metadata) {
                classInfo._metadata = {};
            }
            classInfo._metadata.meta = classMeta;
            className = [basePkg, pkg, sp].join('.');
            protocols = classMeta.protocol;
            if (protocols) {
                for (p = 0; p < protocols.length; p += 1) {
                    pt = protocols[p];
                    if (!this.protocols[pt]) {
                        this.protocols[pt] = {};
                    }
                    this.protocols[pt][className] = classInfo;
                }
            }
        },

        /**
         * @private @method _super
         *
         * @param  {string} supCat
         * @param  {string} supMet
         *
         * @return
         */
        _super: function (supCat, supMet) {
            var me = this;

            return function () {
                return me._._superCategory[supCat][supMet].apply(me, arguments);
            };
        },

        /**
         * @public @method define Creates a class definition.
         *
         * @param  {string}   className        Class name
         * @param  {function} classConstructor Class constructor function
         * @param  {Object}   prototype        A property object containing
         *                                     methods and definitions for the
         *                                     class prototype
         * @param  {Object}   metadata         Optional metadata for the class
         *
         * @return {Object}                    ClassInfo
         */
        define: function (className, classConstructor, prototype, metadata) {
            var classDefinition,
                classQName,
                composition,
                packageDefinition,
                classInfo,
                e,
                extnds,
                superClass;

            if (className === null || className === undefined) {
                throw new TypeError('define(): Missing className');
            }

            if (typeof classConstructor !== 'function') {
                throw new TypeError(
                    'define(): classConstructor is not a function'
                );
            }

            // Prototype is undefined for Oskari._.1
            if (prototype && typeof prototype !== 'object') {
                throw new TypeError('define(): Prototype is not an object');
            }

            classQName = this._getClassQName(className);
            packageDefinition = this._getPackageDefinition(classQName.pkg);
            classInfo = packageDefinition[classQName.sp];

            if (!classInfo) {
                classDefinition = this._createEmptyClassDefinition();
                composition = {
                    className: className,
                    superClass: null,
                    subClass: null
                };

                classInfo = {
                    _class: classDefinition,
                    _constructor: classConstructor,
                    _category: {},
                    _composition: composition
                };
                classDefinition.prototype._ = classInfo;
                classDefinition.prototype._super = this._super;
                this.inheritance[className] = composition;
                packageDefinition[classQName.sp] = classInfo;
            }
            // update constrcutor
            if (classConstructor) {
                classInfo._constructor = classConstructor;
            }
            // update prototype
            if (prototype) {
                this._cloneProperties(prototype, classInfo._class.prototype);
                classInfo._category[className] = prototype;
            }
            // update metadata
            if (metadata) {
                extnds = metadata.extend;
                for (e = 0; extnds && e < extnds.length; e += 1) {
                    superClass = this.lookup(extnds[e]);
                    if (!superClass._composition.subClass) {
                        superClass._composition.subClass = {};
                    }
                    superClass._composition.subClass[className] = classInfo;
                    classInfo._composition.superClass = superClass;
                }
                this._updateMetadata(
                    classQName.basePkg,
                    classQName.pkg,
                    classQName.sp,
                    classInfo,
                    metadata
                );
            }
            this._pullDown(classInfo);
            this._pushDown(classInfo);
            return classInfo;
        },

        /**
         * @public @method category
         * Adds some logical group of methods to class prototype
         * Oskari.clazz.category(
         * 'Oskari.mapframework.request.common.' +
         * 'ActivateOpenlayersMapControlRequest',
         * 'map-layer-funcs',{ "xxx": function () {} }
         * );
         *
         * @param  {string} className    Class name
         * @param  {string} categoryName Category name
         * @param  {Object} prototype    Prototype
         *
         * @return {Object}              ClassInfo
         */
        category: function (className, categoryName, prototype) {
            var classDefinition,
                classInfo,
                classQName,
                composition,
                packageDefinition,
                prot;

            if (className === null || className === undefined) {
                throw new TypeError('category(): Missing className');
            }

            classQName = this._getClassQName(className);
            packageDefinition = this._getPackageDefinition(classQName.pkg);
            classInfo = packageDefinition[classQName.sp];

            if (!classInfo) {
                classDefinition = this._createEmptyClassDefinition();
                composition = {
                    className: className,
                    superClass: null,
                    subClass: null
                };
                // TODO why do we set categoryName as constructor?
                classInfo = {
                    _class: classDefinition,
                    _constructor: categoryName,
                    _category: {},
                    _composition: composition
                };
                classDefinition.prototype._ = classInfo;
                classDefinition.prototype._super = this._super;
                this.inheritance[className] = composition;
                packageDefinition[classQName.sp] = classInfo;
            }
            prot = classInfo._class.prototype;
            this._cloneProperties(prototype, prot);
            if (prototype) {
                classInfo._category[categoryName] = prototype;
            }
            this._pullDown(classInfo);
            this._pushDown(classInfo);
            return classInfo;
        },

        /**
         * @public @method lookup
         *
         * @param  {string} className   Class name
         * @param           constructor Constructor
         *
         * @return {Object}             ClassInfo
         */
        lookup: function (className, constructor) {
            var classDefinition,
                classQName,
                composition,
                packageDefinition,
                classInfo;

            if (className === null || className === undefined) {
                throw new TypeError('lookup(): Missing className');
            }
            // TODO constructor seems to be undefined all the time?

            classQName = this._getClassQName(className);
            packageDefinition = this._getPackageDefinition(classQName.pkg);
            classInfo = packageDefinition[classQName.sp];

            if (!classInfo) {
                classDefinition = this._createEmptyClassDefinition();
                composition = {
                    className: className,
                    superClass: null,
                    subClass: null
                };
                classInfo = {
                    _class: classDefinition,
                    _constructor: constructor,
                    _category: {},
                    _composition: composition
                };
                this.inheritance[className] = composition;
                packageDefinition[classQName.sp] = classInfo;
            }
            return classInfo;
        },

        /**
         * @public @method extend
         *
         * @param  {string} subClassName   SubClass name
         * @param  {string} superClassName SuperClass name
         *
         * @return {Object}                SubClass
         */
        extend: function (subClassName, superClassName) {
            var superClass,
                subClass;

            if (subClassName === null || subClassName === undefined) {
                throw new TypeError('extend(): Missing subClassName');
            }

            if (superClassName === null || superClassName === undefined) {
                throw new TypeError('extend(): Missing superClassName');
            }

            superClass = this.lookup(superClassName);
            subClass = this.lookup(subClassName);

            if (!superClass._composition.subClass) {
                superClass._composition.subClass = {};
            }
            superClass._composition.subClass[subClassName] = subClass;
            subClass._composition.superClass = superClass;
            this._pullDown(subClass);
            return subClass;
        },

        /**
         * @private @method _pushDown
         * Force each derived class to pullDown.
         * Some overhead here if complex hierarchies are implemented.
         *
         * @param  {Object} classInfo ClassInfo
         *
         * @return {Object}           ClassInfo
         */
        _pushDown: function (classInfo) {
            var subName,
                pdefsub;

            if (classInfo === null || classInfo === undefined) {
                throw new TypeError('_pushDown(): Missing classInfo');
            }

            /* !self */
            if (!classInfo._composition.subClass) {
                return;
            }
            for (subName in classInfo._composition.subClass) {
                if (classInfo._composition.subClass.hasOwnProperty(subName)) {
                    pdefsub = classInfo._composition.subClass[subName];
                    this._pullDown(pdefsub);
                    this._pushDown(pdefsub);
                }
            }
            return classInfo;
        },

        /**
         * @private @method _pullDown
         * EACH class is responsible for it's entire hierarchy
         * no intermediate results are being consolidated
         *
         * @param  {Object} classInfo ClassInfo
         *
         * @return {Object}           ClassInfo
         */
        _pullDown: function (classInfo) {
            var i,
                category,
                clazz,
                classHierarchy,
                className,
                classConstructor,
                classMethods,
                classPrototype,
                prototype,
                superClassInfo;

            if (classInfo === null || classInfo === undefined) {
                throw new TypeError('_pullDown(): Missing classInfo');
            }

            if (!classInfo._composition.superClass) {
                // Class doesn't extend
                return;
            }
            // Class hierarchy from bottom (i.e. given class) up
            classHierarchy = [];
            classHierarchy.push(classInfo);
            superClassInfo = classInfo;
            while (true) {
                superClassInfo = superClassInfo._composition.superClass;
                if (!superClassInfo) {
                    break;
                }
                classHierarchy.push(superClassInfo);
            }

            classInfo._constructors = [];
            classInfo._superCategory = {};
            classPrototype = classInfo._class.prototype;
            // Traverse class hierarchy from topmost super to given class,
            // add found methods to class info
            for (i = classHierarchy.length - 1; i >= 0; i -= 1) {
                clazz = classHierarchy[i];
                className = clazz._composition.className;
                classConstructor = clazz._constructor;
                classInfo._constructors.push(classConstructor);
                classMethods = {};
                // TODO explain categories?
                for (category in clazz._category) {
                    if (clazz._category.hasOwnProperty(category)) {
                        prototype = clazz._category[category];
                        this._cloneProperties(
                            prototype,
                            [classPrototype, classMethods]
                        );
                    }
                }
                classInfo._superCategory[className] = classMethods;
            }
            return classInfo;
        },

        /**
         * @private @method _slicer
         */
        _slicer: Array.prototype.slice,

        /**
         * @public @method create
         * Creates a class instance
         *
         * @param  {string} className Class name
         *
         * @return {Object}           Class instance
         */
        create: function (className) {
            var classInfo,
                classInstance,
                constructors,
                i,
                instanceArguments;

            if (className === null || className === undefined) {
                throw new TypeError('create(): Missing className');
            }

            instanceArguments = this._slicer.apply(arguments, [1]);
            classInfo = this._getClassInfo(className);
            if (!classInfo) {
                // If this error is thrown,
                // the class definition is missing.
                // Ensure the file has been loaded before use
                throw 'Class "' + className + '" does not exist';
            }
            classInstance = new classInfo._class();
            constructors = classInfo._constructors;

            if (constructors) {
                // Class is extended, call super constructors first?
                for (i = 0; i < constructors.length; i += 1) {
                    // If an error occurs below, the constructor is missing.
                    // Ensure the file has been loaded before use.
                    // Note! check extends classes as well, those might also be
                    // missing.
                    if (constructors[i] === null || constructors[i] === undefined) {
                        throw new Error('Class ' + className + ' is missing super constructor ' + (i + 1) + '/' + constructors.length);
                    }
                    var returned = constructors[i].apply(classInstance, instanceArguments);
                    if(returned) {
                        classInstance = returned;
                    }
                }
            } else {
                var returned = classInfo._constructor.apply(classInstance, instanceArguments);
                if(returned) {
                    classInstance = returned;
                }
            }
            return classInstance;
        },

        /**
         * @public @method createWithClassInfo
         *
         * @param  {Object} classInfo         ClassInfo
         * @param  {[]}     instanceArguments Instance arguments
         *
         * @return {Object}                   Class instance
         */
        createWithClassInfo: function (classInfo, instanceArguments) {
            var classInstance,
                constructors,
                i;

            if (classInfo === null || classInfo === undefined) {
                throw new TypeError('createWithClassInfo(): Missing classInfo');
            }
            // TODO check instanceArguments?
            classInstance = new classInfo._class();
            constructors = classInfo._constructors;
            if (constructors) {
                for (i = 0; i < constructors.length; i += 1) {
                    if (constructors[i] === null ||
                            constructors[i] === undefined) {
                        throw new Error(
                            'createWithClassInfo(): Undefined constructor in ' +
                                'class "' + classInfo._composition.className +
                                '"'
                        );
                    }
                    constructors[i].apply(classInstance, instanceArguments);
                }
            } else {
                classInfo._constructor.apply(classInstance, instanceArguments);
            }
            return classInstance;
        },

        /**
         * @public @method builder
         * Implements Oskari frameworks support for cached class instance
         * builders.
         *
         * @param  {string}   className Class name
         *
         * @return {function}           Class builder
         */
        builder: function (className) {
            var classInfo;

            if (className === null || className === undefined) {
                throw new TypeError('builder(): Missing className');
            }

            classInfo = this._getClassInfo(className);
            if (!classInfo) {
                throw 'Class "' + className + '" does not exist';
            }
            return this.getBuilderFromClassInfo(classInfo);
        },

        /**
         * @public @method getBuilderFromClassInfo
         * Implements Oskari frameworks support for cached class instance
         * builders.
         *
         * @param  {Object}   classInfo ClassInfo
         *
         * @return {function}           Class builder
         */
        getBuilderFromClassInfo: function (classInfo) {
            if (classInfo === null || classInfo === undefined) {
                throw new TypeError(
                    'getBuilderFromClassInfo(): Missing classInfo'
                );
            }

            if (classInfo._builder) {
                return classInfo._builder;
            }
            classInfo._builder = function () {
                var classInstance = new classInfo._class(),
                    constructors = classInfo._constructors,
                    i,
                    instanceArguments = arguments;

                if (constructors) {
                    for (i = 0; i < constructors.length; i += 1) {
                        constructors[i].apply(classInstance, instanceArguments);
                    }
                } else {
                    classInfo._constructor.apply(
                        classInstance,
                        instanceArguments
                    );
                }
                return classInstance;
            };
            return classInfo._builder;
        },

        /**
         * @private @method _global
         *
         * @param {string} key   Key
         * @param          value Value
         *
         * @return
         */
        _global: function (key, value) {
            if (key === undefined) {
                return this.globals;
            }
            if (value !== undefined) {
                this.globals[key] = value;
            }
            return this.globals[key];
        }
    };

    /**
     * singleton instance of the class system
     *
     */
    var class_singleton = new O2ClassSystem(),
        cs = class_singleton;

    /**
     * @class Oskari.Bundle_mediator
     * A mediator class to support bundle to/from bundle manager communication
     * and initialisation as well as bundle state management
     *
     * @param {Object} options Options
     *
     */
    var Bundle_mediator = function (options) {
        var p;
        this.manager = null;

        for (p in options) {
            if (options.hasOwnProperty(p)) {
                this[p] = options[p];
            }
        }
    };

    Bundle_mediator.prototype = {

        /**
         * @public @method setState
         *
         * @param  {string} state State
         *
         * @return {string}       State
         */
        setState: function (state) {
            this.state = state;
            this.manager.postChange(this.bundle, this.instance, this.state);
            return this.state;
        },

        /**
         * @public @method getState
         *
         *
         * @return {string} State
         */
        getState: function () {
            return this.state;
        }
    };

    /**
     * @class Oskari.Bundle_trigger
     *
     * @param {Object}                   config   Config
     * @param {function(Bundle_manager)} callback Callback function
     * @param {string}                   info     Info
     *
     */
    var Bundle_trigger = function (config, callback, info) {
        this.config = config;
        this.callback = callback;
        this.fired = false;
        this.info = info;
    };

    Bundle_trigger.prototype = {

        /**
         * @public @method execute
         * Executes a trigger callback based on bundle state
         *
         * @param {Bundle_manager} manager        Bundle manager
         * @param {Object}         bundle         Bundle
         * @param {Object}         bundleInstance Bundle instance
         * @param {string}         info           Info
         *
         */
        execute: function (manager, bundle, bundleInstance, info) {
            var me = this,
                p,
                srcState,
                callback;

            if (me.fired) {
                return;
            }

            for (p in me.config['Import-Bundle']) {
                if (me.config['Import-Bundle'].hasOwnProperty(p)) {
                    srcState = manager.bundleSourceStates[p];
                    if (!srcState || srcState.state !== 1) {
                        manager.log(
                            'Trigger not fired due ' + p + ' for ' +
                                info || this.info
                        );
                        return;
                    }
                }
            }
            me.fired = true;
            manager.log('Posting trigger');
            callback = this.callback;

            window.setTimeout(function () {
                callback(manager);
            }, 0);
        }
    };

    /* legacy Bundle_manager */

    /**
     * @singleton @class Oskari.Bundle_manager
     */
    var Bundle_manager = function () {
        var me = this;
        me.serial = 0;
        me.bundleDefinitions = {};
        me.sources = {};
        me.bundleInstances = {};
        me.bundles = {};

        /*
         * CACHE for lookups state management
         */
        me.bundleDefinitionStates = {};

        me.bundleSourceStates = {};

        /* CACHE for statuses */
        me.bundleStates = {};

        me.triggers = [];

        me.loaderStateListeners = [];
    };

    Bundle_manager.prototype = {

        /**
         * @private @method _getSerial
         *
         *
         * @return {number}
         */
        _getSerial: function () {
            this.serial += 1;
            return this.serial;
        },

        /**
         * @private @method _purge
         */
        _purge: function () {
            var p,
                me = this;

            for (p in me.sources) {
                if (me.sources.hasOwnProperty(p)) {
                    delete me.sources[p];
                }
            }
            for (p in me.bundleDefinitionStates) {
                if (me.bundleDefinitionStates.hasOwnProperty(p)) {
                    delete me.bundleDefinitionStates[p].loader;
                }
            }
            for (p in me.bundleSourceStates) {
                if (me.bundleSourceStates.hasOwnProperty(p)) {
                    delete me.bundleSourceStates[p].loader;
                }
            }
        },

        /**
         * @public @method log
         * A logging and debugging function
         *
         * @param {string} message Message
         *
         */
        log: function (message) {
            logMsg(message);

        },

        /**
         * @private @method _install
         * installs bundle
         * DOES not INSTANTIATE only register bundleDefinition as function
         * declares any additional sources required
         *
         * @param {string}   biid             Bundle implementation id
         * @param {function} bundleDefinition Bundle registration function
         * @param {Object}   srcFiles         Source files
         * @param {Object}   bundleMetadata   Bundle metadata
         *
         */
        _install: function (biid, bundleDefinition, srcFiles, bundleMetadata) {
            var me = this,
                defState = me.bundleDefinitionStates[biid];

            if (defState) {
                defState.state = 1;
                me.log('SETTING STATE FOR BUNDLEDEF ' + biid +
                    ' existing state to ' + defState.state);
            } else {
                defState = {
                    state: 1
                };

                me.bundleDefinitionStates[biid] = defState;
                me.log('SETTING STATE FOR BUNDLEDEF ' + biid +
                    ' NEW state to ' + defState.state);
            }
            defState.metadata = bundleMetadata;

            me.bundleDefinitions[biid] = bundleDefinition;
            me.sources[biid] = srcFiles;
            me.postChange(null, null, 'bundle_definition_loaded');
        },

        /**
         * @public @method installBundleClass
         * Installs a bundle defined as Oskari native Class.
         *
         * @param {string} biid      Bundle implementation ID
         * @param {string} className Class name
         *
         */
        installBundleClass: function (biid, className) {
            var clazz = Oskari.clazz.create(className);
            if(clazz) {
            	// Oskari.bundle is the new registry for requirejs loader
                Oskari.bundle(biid, {
                    clazz : clazz,
                    metadata : cs.getMetadata(className).meta
                });
            }
        },

        /**
         * @public @method installBundleClassInfo
         * Installs a bundle defined as Oskari native Class
         *
         * @param {string} biid      Bundle implementation ID
         * @param {Object} classInfo ClassInfo
         *
         */
        installBundleClassInfo: function (biid, classInfo) {
            var bundleDefinition = cs.getBuilderFromClassInfo(classInfo),
                bundleMetadata = classInfo._metadata,
                sourceFiles = {};

            if (biid === null || biid === undefined) {
                throw new TypeError('installBundleClassInfo(): Missing biid');
            }

            if (classInfo === null || classInfo === undefined) {
                throw new TypeError(
                    'installBundleClassInfo(): Missing classInfo'
                );
            }

            this._install(
                biid,
                bundleDefinition,
                sourceFiles,
                bundleMetadata
            );
        },

        /**
         * @public @method postChange
         * Posts a notification to bundles and bundle instances.
         *
         * @param {Object=} bundle         Bundle
         * @param {Object=} bundleInstance Bundle instance
         * @param {string}  info           Info
         *
         */
        postChange: function (bundle, bundleInstance, info) {
            var me = this,
                i,
                instance,
                bndl;

            if (info === null || info === undefined) {
                throw new TypeError('postChange(): Missing info');
            }

            me._update(bundle, bundleInstance, info);
            // bundles
            for (i in me.bundles) {
                if (me.bundles.hasOwnProperty(i)) {
                    bndl = me.bundles[i];
                    bndl.update(me, bundle, bundleInstance, info);
                }
            }
            // and instances
            for (i in me.bundleInstances) {
                if (me.bundleInstances.hasOwnProperty(i)) {
                    instance = me.bundleInstances[i];
                    if (instance) {
                        instance.update(me, bundle, bundleInstance, info);
                    }
                }
            }
        },

        /**
         * @public @method createBundle
         * Creates a Bundle (NOTE NOT an instance of bundle)
         * implid, bundleid most likely same value
         *
         * @param  {string} biid Bundle implementation ID
         * @param  {string} bid  Bundle ID
         *
         * @return {Object}      Bundle
         */
        createBundle: function (biid, bid) {
            var bundle,
                bundleDefinition,
                me = this,
                bundleDefinitionState;

            if (biid === null || biid === undefined) {
                throw new TypeError('createBundle(): Missing biid');
            }

            if (bid === null || bid === undefined) {
                throw new TypeError('createBundle(): Missing bid');
            }

            bundleDefinitionState =
                me.bundleDefinitionStates[biid];

            if (!bundleDefinitionState) {
                throw new Error(
                    'createBundle(): Couldn\'t find a definition for' +
                        ' bundle ' + biid + '/' + bid +
                        ', check spelling and that the bundle has been' +
                        ' installed.'
                );
            }
            bundleDefinition = this.bundleDefinitions[biid];
            // FIXME no alerts please. Throw something or log something.
            if (!bundleDefinition) {
                alert('this.bundleDefinitions[' + biid + '] is null!');
                return;
            }
            bundle = bundleDefinition(bundleDefinitionState);
            this.bundles[bid] = bundle;
            this.bundleStates[bid] = {
                state: true,
                bundlImpl: biid
            };
            this.postChange(bundle, null, 'bundle_created');
            return bundle;
        },

        /**
         * @private @method _update
         * Fires any pending bundle or bundle instance triggers
         *
         * @param {Object} bundle         Bundle
         * @param {Object} bundleInstance Bundle instance
         * @param {string} info           Info
         *
         */
        _update: function (bundle, bundleInstance, info) {
            // resolves any bundle dependencies
            // this must be done before any starts
            // TO-DO
            // - bind package exports and imports
            // - bind event imports and exports
            // - bind request exports ( and imports)
            // - bind any Namespaces (== Globals imported )
            // - fire any pending triggers
            var me = this,
                n,
                t;

            me.log('Update called with info ' + info);

            for (n = 0; n < me.triggers.length; n += 1) {
                t = me.triggers[n];
                t.execute(me);
            }
        },

        /**
         * @public @method createInstance
         * Creates a bundle instance for previously installed and created bundle
         *
         * @param  {string} bid Bundle ID
         *
         * @return {Object}     Bundle instance
         */
        createInstance: function (bid) {
            // creates a bundle_instance
            // any configuration and setup IS BUNDLE / BUNDLE INSTANCE specific
            // create / config / start / process / stop / destroy ...
            var me = this,
                bundle,
                bundleInstance,
                bundleInstanceId;

            if (bid === null || bid === undefined) {
                throw new TypeError('createInstance(): Missing bid');
            }

            if (!me.bundleStates[bid] ||
                    !me.bundleStates[bid].state) {
                throw new Error(
                    'createInstance(): Couldn\'t find a definition for' +
                        ' bundle ' + bid + ', check spelling' +
                        ' and that the bundle has been installed.'
                );
            }

            bundle = this.bundles[bid];
            if (bundle === null || bundle === undefined) {
                // TODO find out how this could happen, offer a solution
                throw new Error(
                    'createInstance(): Couldn\'t find bundle with id' + bid
                );
            }

            bundleInstance = bundle.create();
            if (bundleInstance === null || bundleInstance === undefined) {
                throw new Error(
                    'createInstance(): Couldn\'t create bundle ' + bid +
                        ' instance. Make sure your bundle\'s create function' +
                        ' returns the instance.'
                );
            }
            bundleInstanceId = me._getSerial().toString();
            bundleInstance.mediator = new Bundle_mediator({
                bundleId: bid,
                instanceid: bundleInstanceId,
                state: 'initial',
                bundle: bundle,
                instance: bundleInstance,
                manager: this,
                clazz: class_singleton,
                requestMediator: {}
            });

            this.bundleInstances[bundleInstanceId] = bundleInstance;

            this.postChange(bundle, bundleInstance, 'instance_created');
            return bundleInstance;
        },

        /**
         * @private @method _destroyInstance
         * Destroys and unregisters bundle instance
         *
         * @param {string} biid Bundle instance ID
         *
         * @return
         */
        _destroyInstance: function (biid) {
            var bundleInstance,
                mediator;

            if (biid === null || biid === undefined) {
                throw new TypeError('_destroyInstance(): Missing biid');
            }

            bundleInstance = this.bundleInstances[biid];
            mediator = bundleInstance.mediator;

            mediator.bundle = null;
            mediator.manager = null;
            mediator.clazz = null;

            bundleInstance.mediator = null;

            this.bundleInstances[biid] = null;
            bundleInstance = null;

            return bundleInstance;
        },

        /**
         * @public @method on
         * Trigger registration
         *
         * @param {Object}                   config
         * @param {function(Bundle_manager)} callback Callback function
         * @param {string}                   info
         *
         */
        on: function (config, callback, info) {
            this.triggers.push(new Bundle_trigger(config, callback, info));
        }
    };

    /* legacy Bundle_facade */
    /**
     * @class Oskari.Bundle_facade
     * Highlevel interface to bundle management Work in progress
     *
     * @param {} bundleManager
     *
     */
    var Bundle_facade = function (bundleManager) {
        this.manager = bundleManager;
        this.bundles = {};

        /**
         * @property bundleInstances
         * logical bundle instance identifiers
         * (physical are used by manager and start from '1' on)
         */
        this.bundleInstances = {};
        this.bundlePath = '../src/mapframework/bundle/';

        /**
         * @property appSetup
         * application startup sequence
         */
        this.appSetup = null;

        /**
         * @property appConfig
         * application configuration (state) for instances
         * this is injected to instances before 'start' is called
         *
         */
        this.appConfig = {};
    };

    /**
     * FACADE will have only a couple of methods which trigger alotta operations
     */
    Bundle_facade.prototype = {

        /**
         * @public @method getBundleInstanceConfigurationByName
         * Returns configuration for instance by bundleinstancename
         *
         * @param  {string} biid Bundle instance ID
         *
         * @return {Object}      Bundle instance configuration
         */
        getBundleInstanceConfigurationByName: function (biid) {
            return this.appConfig[biid];
        },

        /**
         * @public @method playBundle
         * Plays a bundle player JSON object by instantiating any required
         * bundle instances.
         *
         * @param {Object}           recData  Bundle player JSON
         * @param {function(Object)} callback Callback function
         *
         */
        playBundle: function (recData, config, callback) {
            if(typeof recData !== 'object') {
                throw new Error('Bundle def is not an object');
            }
            if(typeof config === 'function') {
                callback = config;
                config = undefined;
            }

            if(config) {
                // wrap to acceptable format
                var configName = recData.bundleinstancename || recData.bundlename;
                var tmp = {};
                tmp[configName] = config;
                config = tmp;
            }
            else {
                config = this.appConfig;
            }
            var loader = Oskari.loader([recData], config);
            loader.processSequence(callback);
        },
        loadAppSetup : function(url, params, errorCB) {
            var me = this;
            jQuery.ajax({
                type : 'GET',
                dataType : 'json',
                data : params,
                url: url,
                success : function(setup) {
                    me.setApplicationSetup(setup);
                    me.startApplication();
                },
                error : function(jqXHR) {
                    if(typeof errorCB === 'function') {
                        error(jqXHR);
                    }
                }
            });
        },
        /**
         * @public @method setApplicationSetup
         * Each bundledef is of kind playable by method playBundle. callback:
         * property may be set to receive some feedback - as well as
         * registerLoaderStateListener
         *
         * @param {Object} setup JSON application setup {
         * startupSequence: [ <bundledef1>, <bundledef2>, <bundledef3>, ] }
         *
         */
        setApplicationSetup: function (setup) {
            this.appSetup = setup;
            if(setup.configuration) {
                this.setConfiguration(setup.configuration);
            }
            setup.env = setup.env || {};
            if(typeof Oskari.setLang === 'function') {
                Oskari.setLang(setup.env.lang || window.language);
            }
            if(typeof Oskari.setSupportedLocales === 'function') {
                Oskari.setSupportedLocales(setup.env.locales);
            }
            if(typeof Oskari.setDecimalSeparator === 'function') {
                Oskari.setDecimalSeparator(setup.env.decimalSeparator);
            }
            if(typeof Oskari.setMarkers === 'function') {
                Oskari.setMarkers(setup.env.svgMarkers || []);
            }
        },

        /**
         * @public @method getApplicationSetup
         *
         *
         * @return {Object} Application setup
         */
        getApplicationSetup: function () {
            return this.appSetup;
        },

        /**
         * @public @method setConfiguration
         *
         * @param {Object} config Config
         *
         */
        setConfiguration: function (config) {
            this.appConfig = config;
        },

        /**
         * @public @method getConfiguration
         *
         *
         * @return {Object}
         */
        getConfiguration: function () {
            return this.appConfig;
        },

	    startApplication: function (callback) {
	        var loader = Oskari.loader(this.appSetup.startupSequence, this.appConfig);
	        loader.processSequence(callback);
	    },

        /**
         * @method stopApplication
         * Might stop app if/when all stops implemented
         */
        stopApplication: function () {
            throw new Error('Not supported');
        }
    };

    /**
     * Singleton instance of Oskari.BundleManager manages lifecycle for bundles
     * and bundle instances.
     */
    var bm = new Bundle_manager();
    bm.clazz = cs;

    /**
     * @class Oskari.BundleFacade
     * Pluggable DOM manager. This is the no-op default implementation.
     */
    var fcd = new Bundle_facade(bm),
        ga = cs._global;

    cs.define('Oskari.DomManager', function (dollar) {
        this.$ = dollar;
    }, {

        /**
         * @public @method getEl
         *
         * @param {string} selector Selector
         *
         * @return
         */
        getEl: function (selector) {
            return this.$(selector);
        },

        /**
         * @public @method getElForPart
         *
         * @param {} part Part
         *
         */
        getElForPart: function (part) {
            throw 'N/A';
        },

        /**
         * @public @method setElForPart
         *
         * @param part Part
         * @param el   Element
         *
         */
        setElForPart: function (part, el) {
            throw 'N/A';
        },

        /**
         * @public @method setElParts
         *
         * @param partsMap Parts map
         *
         */
        setElParts: function (partsMap) {
            throw 'N/A';
        },

        /**
         * @public @method getElParts
         */
        getElParts: function () {
            throw 'N/A';
        },

        /**
         * @public @method pushLayout
         *
         * @param s
         *
         */
        pushLayout: function (s) {
            throw 'N/A';
        },

        /**
         * @public @method popLayout
         *
         * @param s
         *
         */
        popLayout: function (s) {
            throw 'N/A';
        },

        /**
         * @public @method getLayout
         */
        getLayout: function () {
            throw 'N/A';
        }
    });
    // FIXME no jQuery in core
    var domMgr = cs.create('Oskari.DomManager', jQuery);

    fcd.bundle_dom_manager = domMgr;

    // Oskari1API

    /**
     * @static @property Oskari
     */
    var Oskari1LegacyAPI = {
        bundle_manager: bm,
        /* */
        bundle_facade: fcd,
        app: fcd,
        /* */
        clazz: cs,
        VERSION : oskariVersion,
        markers: [],

        /**
         * @public @method Oskari.$
         *
         *
         * @return {}
         */
        '$': function () {
            return ga.apply(cs, arguments);
        },

        /**
         * @public @static @method Oskari.setLoaderMode
         *
         * @param {string} m Loader mode
         *
         */
        setLoaderMode: function (m) {
            if (typeof m !== 'string') {
                throw new TypeError(
                    'setLoaderMode(): m is not a string'
                );
            }
            mode = m;
        },

        /**
         * @public @method Oskari.getLoaderMode
         *
         *
         * @return {string} Loader mode
         */
        getLoaderMode: function () {
            return mode;
        },

        /**
         * @public @method Oskari.setDebugMode
         *
         * @param {boolean} d Debug mode on/off
         *
         */
        setDebugMode: function (d) {
            if (typeof d !== 'boolean') {
                throw new TypeError(
                    'setDebugMode(): d is not a boolean'
                );
            }
            isDebug = d;
        },

        /**
         * @public @method Oskari.setPreloaded
         * @deprecated No longer has any effect. Remove calls to it. Will be removed in 1.38 or later.
         */
        setPreloaded: function () {
            if(window.console && typeof console.log === 'function') {
                console.log('Oskari.setPreloaded() no longer has any effect and will be removed in future release. Remove calls to it.');
            }
        },

        /**
         * @public @static @method Oskari.purge
         */
        purge: function () {
            bm.purge();
            cs.purge('Oskari');
        },

        /**
         * @public @static @method Oskari.getDomManager
         *
         *
         * @return DOM Manager
         */
        getDomManager: function () {
            return domMgr;
        },

        /**
         * @public @static @method Oskari.setDomManager
         *
         * @param dm DOM Manager
         *
         */
        setDomManager: function (dm) {
            domMgr = dm;
        },

        /**
         * @public @static @method Oskari.getSandbox
         *
         * @param  {string=} sandboxName Sandbox name
         *
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
        },

        /**
         * @public @static @method Oskari.setMarkers
         * @param {Array} markers markers
         */
        setMarkers: function(markers) {
            this.markers = markers;
        },
        /**
         * @public @static @method Oskari.getMarkers
         * @return {Array} markers markers
         */
        getMarkers: function() {
            return this.markers || [];
        },
    };

    /* Oskari1BuilderAPI */

    /* Oskari1Builder class module  */

    var oskari1BuilderSerial = (function () {
        var serials = {};
        return {
            get: function (type) {
                if (!serials[type]) {
                    serials[type] = 1;
                } else {
                    serials[type] += 1;
                }
                return serials[type];
            }
        };
    }());

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
                    (['__', oskari1BuilderSerial.get('Category')].join('_')),
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
                    (['__', oskari1BuilderSerial.get('Category')].join('_')),
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

    var Oskari1BuilderAPI = Oskari1LegacyAPI;

    /**
     * @public @method cls
     * Entry point to new class API.
     * @see Oskari.ModuleSpec above.
     *
     * @param  {string}   className   Class name
     * @param  {function} constructor Constructor
     * @param  {Object}   proto       Prototype
     * @param  {Object}   metas       Metadata
     *
     * @return {Object}               Class instance
     */
    Oskari1BuilderAPI.cls = function (className, constructor, proto, metas) {
        var classInfo;

        if (!className) {
            className = [
                'Oskari',
                '_',
                oskari1BuilderSerial.get('Class')
            ].join('.');
        } else {
            classInfo = cs.lookup(className);
        }

        if (!(classInfo && classInfo._constructor && !constructor)) {
            classInfo = cs.define(
                className,
                constructor || function () {},
                proto,
                metas || {}
            );
        }

        return cs.create('Oskari.ModuleSpec', classInfo, className);

    };

    /**
     * @public @method loc
     * Oskari1Builder helper to register localisation
     */
    Oskari1BuilderAPI.loc = function () {
        return this.registerLocalization.apply(Oskari1BuilderAPI, arguments);
    };

    /**
     * @public @static @method Oskari.eventCls
     * O2 api for event class
     *
     * @param  {string}   eventName   Event name
     * @param  {function} constructor Constructor
     * @param  {Object}   proto       Prototype
     *
     * @return
     */
    Oskari1BuilderAPI.eventCls = function (eventName, constructor, proto) {
        var className,
            rv;

        if (eventName === null || eventName === undefined) {
            throw new TypeError('eventCls(): Missing eventName');
        }

        className = 'Oskari.event.registry.' + eventName;
        rv = Oskari1BuilderAPI.cls(
            className,
            constructor,
            proto,
            {protocol: ['Oskari.mapframework.event.Event']}
        );

        rv.category({
            getName: function () {
                return eventName;
            }
        }, '___event');

        rv.eventName = eventName;

        return rv;
    };

    /**
     * @public @static @method Oskari.requestCls
     * O2 api for request class
     *
     * @param  {string}   className   Class name
     * @param  {function} constructor Constructor
     * @param  {Object}   proto       Prototype
     *
     * @return {Object}
     */
    Oskari1BuilderAPI.requestCls = function (requestName, constructor, proto) {
        var className,
            rv;

        if (requestName === null || requestName === undefined) {
            throw new TypeError('requestCls(): Missing requestName');
        }

        className = 'Oskari.request.registry.' + requestName;
        rv = Oskari1BuilderAPI.cls(
            className,
            constructor,
            proto,
            {protocol: ['Oskari.mapframework.request.Request']}
        );

        rv.category({
            getName: function () {
                return requestName;
            }
        }, '___request');

        rv.requestName = requestName;

        return rv;
    };

    Oskari1BuilderAPI._baseClassFor = {
        extension: 'Oskari.userinterface.extension.EnhancedExtension',
        bundle: 'Oskari.mapframework.bundle.extension.ExtensionBundle',
        tile: 'Oskari.userinterface.extension.EnhancedTile',
        flyout: 'Oskari.userinterface.extension.EnhancedFlyout',
        view: 'Oskari.userinterface.extension.EnhancedView'
    };

    /**
     * @public @static @method Oskari.extensionCls O2 api for extension classes
     *
     * @param  {string} className Class name
     *
     * @return
     */
    Oskari1BuilderAPI.extensionCls = function (className) {
        if (className === null || className === undefined) {
            throw new TypeError('extensionCls(): Missing className');
        }

        return Oskari1BuilderAPI.cls(className).extend(
            this._baseClassFor.extension
        );
    };

    /**
     * @public @static @method Oskari.bundleCls O2 api for bundle classes
     *
     * @param  {string} bundleId  Bundle ID
     * @param  {string} className Class name
     *
     * @return {Object}           Bundle instance
     */
    Oskari1BuilderAPI.bundleCls = function (bundleId, className) {
        var rv;

        if (className === null || className === undefined) {
            throw new TypeError('bundleCls(): Missing className');
        }

        if (!bundleId) {
            bundleId = (['__', oskari1BuilderSerial.get('Bundle')].join('_'));
        }

        rv = Oskari1BuilderAPI.cls(className, function () {}, {
            update: function () {}
        }, {
            protocol: ['Oskari.bundle.Bundle', this._baseClassFor.bundle],
            manifest: {
                'Bundle-Identifier': bundleId
            }
        });
        bm.installBundleClassInfo(bundleId, rv.classInfo);

        rv.___bundleIdentifier = bundleId;

        rv.loc = function (properties) {
            properties.key = this.___bundleIdentifier;
            Oskari1BuilderAPI.registerLocalization(properties);
            return rv;
        };

        // FIXME instanceId isn't used for anything?
        rv.start = function (instanceId) {
            var bid = this.___bundleIdentifier,
                bundle,
                bundleInstance,
                configProps,
                ip;

            if (!fcd.bundles[bid]) {
                bundle = bm.createBundle(bid, bid);
                fcd.bundles[bid] = bundle;
            }

            bundleInstance = bm.createInstance(bid);
            fcd.bundleInstances[bid] = bundleInstance;

            configProps = fcd.getBundleInstanceConfigurationByName(bid);
            if (configProps) {
                for (ip in configProps) {
                    if (configProps.hasOwnProperty(ip)) {
                        bundleInstance[ip] = configProps[ip];
                    }
                }
            }
            bundleInstance.start();
            return bundleInstance;
        };
        rv.stop = function () {
            var bundleInstance = fcd.bundleInstances[this.___bundleIdentifier];

            return bundleInstance.stop();
        };
        return rv;
    };

    /**
     * @static @method Oskari.flyoutCls
     *
     * @param  {string} className Class name
     *
     * @return
     */
    Oskari1BuilderAPI.flyoutCls = function (className) {
        if (className === null || className === undefined) {
            throw new TypeError('flyoutCls(): Missing className');
        }

        return Oskari1BuilderAPI.cls(className).extend(
            this._baseClassFor.flyout
        );
    };

    /**
     * @static @method Oskari.tileCls
     *
     * @param  {string} className Class name
     *
     * @return
     */
    Oskari1BuilderAPI.tileCls = function (className) {
        if (className === null || className === undefined) {
            throw new TypeError('tileCls(): Missing className');
        }

        return Oskari1BuilderAPI.cls(className).extend(this._baseClassFor.tile);
    };

    /**
     * @static @method Oskari.viewCls
     *
     * @param  {string} className Class name
     *
     * @return
     */
    Oskari1BuilderAPI.viewCls = function (className) {
        if (className === null || className === undefined) {
            throw new TypeError('viewCls(): Missing className');
        }

        return Oskari1BuilderAPI.cls(className).extend(this._baseClassFor.view);
    };

    /**
     * Let's register Oskari as a Oskari global
     */
    ga.apply(cs, ['Oskari', Oskari1LegacyAPI]);

    /*
     * window.bundle = Oskari1LegacyAPI; window.Oskari = Oskari1LegacyAPI;
     */
    return Oskari1LegacyAPI;
}());

