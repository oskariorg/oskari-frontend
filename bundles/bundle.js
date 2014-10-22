/**
 * @class Oskari
 *
 * Oskari
 *
 * A set of metdhods to support loosely coupled classes and instances for the
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

    /**
     * @class Oskari.Bundle_locale
     * A localisation registry
     */
    var Bundle_locale = function () {
        this.lang = null;
        this.localizations = {};
        this.supportedLocales = null;
    };

    Bundle_locale.prototype = {

        /**
         * @public @method setLocalization
         *
         * @param {string}  lang  Language
         * @param {string}  key   Key
         * @param {string=} value Value
         *
         */
        setLocalization: function (lang, key, value) {
            if (lang === null || lang === undefined) {
                throw new TypeError(
                    'setLocalization(): Missing lang'
                );
            }
            if (key === null || key === undefined) {
                throw new TypeError(
                    'setLocalization(): Missing key'
                );
            }
            if (!this.localizations[lang]) {
                this.localizations[lang] = {};
            }
            this.localizations[lang][key] = value;
        },

        /**
         * @public @method setLang
         *
         * @param {string} lang Language
         *
         */
        setLang: function (lang) {
            if (lang === null || lang === undefined) {
                throw new TypeError(
                    'setLang(): Missing lang'
                );
            }
            this.lang = lang;
        },

        /**
         * @public @method setSupportedLocales
         *
         * @param {string[]} locales Locales array
         *
         */
        setSupportedLocales: function (locales) {
            if (locales === null || locales === undefined) {
                throw new TypeError(
                    'setSupportedLocales(): Missing locales'
                );
            }
            if (!Array.isArray(locales)) {
                throw new TypeError(
                    'setSupportedLocales(): locales is not an array'
                );
            }
            this.supportedLocales = locales;
        },

        /**
         * @public @method getLang
         *
         *
         * @return {string} Language
         */
        getLang: function () {
            return this.lang;
        },

        /**
         * @public @method getLocalization
         *
         * @param  {string} key Key
         *
         * @return {string}     Localized value for key 
         */
        getLocalization: function (key) {
            if (key === null || key === undefined) {
                throw new TypeError(
                    'getLocalization(): Missing key'
                );
            }
            return this.localizations[this.lang][key];
        },

        /**
         * @public @method getSupportedLocales
         *
         *
         * @return {string[]} Supported locales 
         */
        getSupportedLocales: function () {
            if (this.supportedLocales) {
                return this.supportedLocales;
            }
            return [];
        },

        /**
         * @public @method getDefaultLanguage
         *
         *
         * @return {string} Default language 
         */
        getDefaultLanguage: function () {
            var locale = this.supportedLocales[0];
            // FIXME what do if indexOf === -1?
            return locale.substring(0, locale.indexOf('_'));
        },

        /**
         * @public @method getSupportedLanguages
         *
         *
         * @return {string[]} Supported languages 
         */
        getSupportedLanguages: function () {
            var langs = [],
                locale,
                i;

            for (i = 0; i < this.supportedLocales.length; i += 1) {
                locale = this.supportedLocales[i];
                // FIXME what do if indexOf === -1?
                langs.push(locale.substring(0, locale.indexOf('_')));
            }
            return langs;
        }
    };

    /**
     * singleton localisation registry instance
     */
    var blocale = new Bundle_locale();

    /**
     * 'dev' adds ?ts=<instTs> parameter to js loads 'default' does not add
     * 'static' assumes srcs are already loaded <any-other> is assumed as a
     * request to load built js packs using this path pattern
     * .../<bundles-path>/<bundle-name>/build/<any-ohther>.js
     */
    var supportBundleAsync = false,
        mode = 'dev',
        // 'static' / 'dynamic'
        instTs = new Date().getTime(),
        basePathForBundles = null,
        pathBuilders = {

            /**
             * @public @method default
             *
             * @param  {string}  fileName File name
             * @param  {string=} basePath Base path (unused)
             *
             * @return {string} 
             */
            'default': function (fileName, basePath) {
                if (basePathForBundles) {
                    return basePathForBundles + fileName;
                }
                return fileName;
            },

            /**
             * @public @method dev
             *
             * @param  {string}  fileName File name
             * @param  {string=} basePath Base path (unused)
             *
             * @return {string} 
             */
            dev: function (fileName, basePath) {
                if (basePathForBundles) {
                    return basePathForBundles + fileName + '?ts=' + instTs;
                }
                return fileName + '?ts=' + instTs;
            }
        };


    /**
     * @private @method _buildPathForLoaderMode
     *
     * @param  {string}  fileName File name
     * @param  {string=} basePath Base path
     *
     * @return {string} 
     */
    function _buildPathForLoaderMode(fileName, basePath) {
        var pathBuilder = pathBuilders[mode];
        if (!pathBuilder) {
            if (basePathForBundles) {
                return basePathForBundles + fileName;
            }
            return fileName;
        }

        return pathBuilder(fileName, basePath);
    }

    /**
     * @private @property _isNotPackMode
     */
    var _isNotPackMode = {
            dev: true,
            'default': true,
            'static': true
        };

    /**
     * @private @property _preloaded
     */
    var _preloaded = false;

    /**
     * @private @method _isPackedMode
     *
     *
     * @return {boolean} 
     */
    function _isPackedMode() {
        return !_isNotPackMode[mode];
    }

    /**
     * @private @method _isPreloaded
     *
     *
     * @return {boolean} 
     */
    function _isPreloaded() {
        return _preloaded;
    }

    /**
     * @private @method _buildPathForPackedMode
     *
     * @param  {string} basePath Base path
     *
     * @return {string}          Build path for packed mode
     */
    function _buildPathForPackedMode(basePath) {
        return basePath + '/build/' + mode + '.js';
    }

    /**
     * @private @method _buildBundlePathForPackedMode
     *
     * @param  {string} basePath Base path
     *
     * @return {string}          Bundle path for packed mode
     */
    function _buildBundlePathForPackedMode(basePath) {
        return basePath + '/build/bundle-' + mode + '.js';
    }

    /**
     * @private @method _buildLocalePathForPackedMode
     *
     * @param  {string} basePath Base path
     *
     * @return {string}          Locale path for packed mode
     */
    function _buildLocalePathForPackedMode(basePath) {
        return basePath + '/build/' + mode + '-locale-' + blocale.getLang() +
            '.js';
    }

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
                    constructors[i].apply(classInstance, instanceArguments);
                }
            } else {
                classInfo._constructor.apply(classInstance, instanceArguments);
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

    /* Legacy loader */

    var bundle_loader_id = 0;

    /**
     * @class Oskari.bundle_loader
     * Bundle loader class that may be used with Oskari framework Inspired by
     * various javascript loaders (Ext, ...)
     *
     * @param {Bundle_manager} manager  Bundle manager
     * @param {function()}     callback Callback function
     *
     */
    var Bundle_loader = function (manager, callback) {
        bundle_loader_id += 1;
        this.loader_identifier = bundle_loader_id;
        this.manager = manager;
        this.callback = callback;

        this.filesRequested = 0;
        this.filesLoaded = 0;
        this.files = {};
        this.fileList = [];
        this.metadata = {};
    };

    Bundle_loader.prototype = {

        /**
         * @public @method add
         * Adds a script loading request
         *
         * @param {string}  fn   File name
         * @param {Object=} pdef
         *
         */
        add: function (fn, pdef) {
            var me = this,
                def;

            if (!me.files[fn]) {
                def = {
                    src: fn,
                    type: pdef && pdef.type ? pdef.type : 'text/javascript',
                    id: pdef ? pdef.id : null,
                    state: false

                };
                me.files[fn] = def;

                if ('text/javascript' === def.type) {
                    me.filesRequested += 1;
                }
                me.fileList.push(def);
            }
        },

        /**
         * @public @method getState
         *
         *
         * @return {number} Files loaded / Files requested 
         */
        getState: function () {
            if (this.filesRequested === 0) {
                return 1;
            }

            return (this.filesLoaded / this.filesRequested);
        },

        /**
         * @public @method commit
         * Commits any script loading requests
         */
        commit: function () {
            var fragment = document.createDocumentFragment(),
                me = this,
                numFiles = me.filesRequested,
                onFileLoaded,
                f,
                n,
                def,
                fn,
                st;

            if (me.head === undefined) {
                me.head = document.head;
            }
            if (numFiles === 0 || _isPreloaded()) {
                me.callback();
                me.manager.notifyLoaderStateChanged(me, true);
                return;
            }

            /**
             * @private @method onFileLoaded
             */
            onFileLoaded = function () {
                me.filesLoaded += 1;
                me.manager.log('Files loaded ' + me.filesLoaded + '/' +
                    me.filesRequested);

                if (numFiles === me.filesLoaded) {
                    me.callback();
                    me.manager.notifyLoaderStateChanged(me, true);
                } else {
                    me.manager.notifyLoaderStateChanged(me, false);
                }
            };
            f = false;
            for (n = 0; n < me.fileList.length; n += 1) {
                def = me.fileList[n];
                fn = def.src;
                st = me._buildScriptTag(fn, onFileLoaded, def.type, def.id);
                if (st) {
                    // If this breaks something, revert to using method 1
                    if (_isPreloaded()) {
                        onFileLoaded();
                    } else {
                        fragment.appendChild(st);
                        f = true;
                    }
                }
            }
            if (f) {
                me.head.appendChild(fragment);
            }
        },

        /**
         * @private @method _buildScriptTag
         * Builds a script tag to be applied to document head assumes UTF-8
         *
         * @param  {string}     filename    File name
         * @param  {function()} callback    Callback function
         * @param  {string}     elementType Element type
         * @param  {Object=}    elementId   Element ID
         *
         * @return {Element} 
         */
        _buildScriptTag: function (filename, callback, elementType, elementId) {
            var script = document.createElement('script');

            if (elementId) {
                script.id = elementId;
            }
            script.type = elementType; //||'text/javascript';
            script.charset = 'utf-8';

            if (_isPreloaded()) {
                // This should be redundant, see "If this..." in commit() above
                script.src = '/Oskari/empty.js';
            } else {
                script.src = filename;
            }

            /*
             * IE has a different way of handling &lt;script&gt; loads, so we //
             * need to check for it here
             */
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState === 'loaded' ||
                            script.readyState === 'complete') {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                script.onload = callback;
            }

            return script;
        }
    };

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
         * @public @method notifyLoaderStateChanged
         *
         * @param {Bundle_loader} bundleLoader Bundle loader
         * @param {boolean}       finished     Finished
         *
         */
        notifyLoaderStateChanged: function (bundleLoader, finished) {
            var i,
                callback;

            if (this.loaderStateListeners.length === 0) {
                return;
            }
            for (i = 0; i < this.loaderStateListeners.length; i += 1) {
                callback = this.loaderStateListeners[i];
                callback(bundleLoader, finished);
            }
        },

        /**
         * @public @method registerLoaderStateListener
         *
         * @param {function(Bundle_loader, boolean)} callback Callback function
         *
         */
        registerLoaderStateListener: function (callback) {
            this.loaderStateListeners.push(callback);
        },

        /**
         * @public @method alert
         * A logging and debugging function
         *
         * @param {string} message Message
         *
         */
        alert: function (message) {
            logMsg(message);
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
         * @private @method _loadCss
         *
         * @param {string}   scriptSrc Contains css style url
         * @param {function} callback  Not implemented
         *
         */
        _loadCss: function (scriptSrc, callback) {
            this.log('Loading CSS ' + scriptSrc);
            var cssParentElement = document.head || document.body,
                styles,
                linkElement,
                xhr;

            if (!_isPreloaded()) {
                /* See if browser <= IE9, IE10 can handle a whole bunch of
                 * stylesheets and rules.
                 * IE has document.all, but versions up to 9 lack window.atob */
                if (document.all && !window.atob) {
                    /* IE has a limitation of 31 stylesheets.
                     * It can be increased to 31*31 by using import in the
                     * stylesheets, but import should be avoided due to
                     * performance issues.
                     * Instead we retrieve the css files with xhr and
                     * concatenate the styles into a single inline style
                     * declaration. */
                    xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        // TODO check xhr.status?
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status !== 200) {
                                throw new Error(xhr.statusText);
                            }
                            styles = document.getElementById('concatenated');
                            if (!styles) {
                                // styles was not found, create new element
                                styles = document.createElement('style');
                                styles.setAttribute('type', 'text/css');
                                styles.id = 'concatenated';
                                cssParentElement.appendChild(styles);
                            }
                            styles.styleSheet.cssText += xhr.response;
                        }
                    };
                    xhr.open('GET', scriptSrc, true);
                    xhr.responseType = 'text';
                    xhr.send();
                } else {
                    linkElement = document.createElement('link');
                    linkElement.type = 'text/css';
                    linkElement.rel = 'stylesheet';
                    linkElement.href = scriptSrc;
                    cssParentElement.appendChild(linkElement);
                }
            }
        },

        /**
         * @private @method _self
         *
         *
         * @return {Bundle_manager}
         */
        _self: function () {
            return this;
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
                defState = me.bundleDefinitionStates[biid],
                srcState;

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

            srcState = me.bundleSourceStates[biid];
            if (srcState) {
                if (srcState.state === -1) {
                    me.log('Triggering loadBundleSources for ' +
                        biid + ' at loadBundleDefinition');
                    window.setTimeout(function () {
                        me.loadBundleSources(biid);
                    }, 0);
                } else {
                    me.log('Source state for ' + biid +
                        ' at loadBundleDefinition is ' + srcState.state);
                }
            }
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
            var classmeta = cs.getMetadata(className),
                bundleDefinition = cs.builder(className),
                sourceFiles = classmeta.meta.source,
                bundleMetadata = classmeta.meta.bundle;

            this._install(
                biid,
                bundleDefinition,
                sourceFiles,
                bundleMetadata
            );
        },

        /**
         * @public @method installBundleClassInfo
         * Installs a bundle defined as Oskari native Class
         *
         * @param {string} biid      Bundle implementation I
D         * @param {Object} classInfo ClassInfo
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
         * @public @method loadBundleDefinition
         * Loads Bundle Definition from JavaScript file JavaScript shall contain
         * install or installBundleClass call.
         *
         * @param {string} biid        Bundle implementation ID
         * @param {string} bundleSrc   Bundle source path
         * @param {string} pbundlePath Bundle path
         *
         */
        loadBundleDefinition: function (biid, bundleSrc, pbundlePath) {
            var me = this,
                defState = me.bundleDefinitionStates[biid],
                bundlePath,
                bl;

            me.log('loadBundleDefinition called with ' + biid);
            if (defState) {
                if (defState.state === 1) {
                    me.log('Bundle definition already loaded for ' + biid);
                    me.postChange(null, null, 'bundle_definition_loaded');
                    return;
                }
                me.log('Bundle definition already loaded OR WHAT?' + biid +
                    ' ' + defState.state);
                return;
            }
            defState = {
                state: -1
            };
            me.bundleDefinitionStates[biid] = defState;
            me.log('Set NEW state for DEFINITION ' + biid + ' to ' +
                defState.state);

            defState.bundleSrcPath = bundleSrc;
            bundlePath =
                pbundlePath ||
                    (bundleSrc.substring(0, bundleSrc.lastIndexOf('/')));
            defState.bundlePath = bundlePath;

            bl = new Bundle_loader(this, function () {
                me.log('bundle_def_loaded_callback');
            });
            bl.metadata.context = 'bundleDefinition';

            defState.loader = bl;

            bl.add(bundleSrc);
            bl.commit();
        },

        /**
         * @private @method _handleSourceFiles
         *
         * @param {Object}   srcFiles          Bundle source files object
         * @param {string}   bundlePath        Bundle path
         * @param {Object}   sourceDefinitions Bundle source definitions object
         *
         */
        _handleSourceFiles: function (srcFiles, bundlePath, sourceDefinitions) {
            var def,
                fn,
                fnWithPath,
                n,
                p;

            sourceDefinitions = sourceDefinitions || {};
            // linter doesn't recognize the filter expression
            /*jshint forin: false*/
            for (p in sourceDefinitions) {
                if (sourceDefinitions.hasOwnProperty(p) &&
                        (p === 'scripts' || p === 'locales')) {
                    for (n = 0; n < sourceDefinitions[p].length; n += 1) {
                        def = sourceDefinitions[p][n];
                        if (def.type === 'text/css') {
                            fn = def.src;
                            fnWithPath = fn;
                            if (fn.indexOf('http') === -1) {
                                fnWithPath = bundlePath + '/' + fn;
                            }
                            srcFiles.css[fnWithPath] = def;
                        } else if (def.type) {
                            srcFiles.count += 1;
                            fn =
                                _buildPathForLoaderMode(def.src, bundlePath);
                            fnWithPath = fn;
                            if (fn.indexOf('http') === -1) {
                                fnWithPath = bundlePath + '/' + fn;
                            }
                            srcFiles.files[fnWithPath] = def;
                        }
                    }
                }
            }
        },

        /**
         * @private @method _feedCSSLoader
         *
         * @param {function} callback   Callback function
         * @param {string}   biid       Bundle implementation ID
         * @param {string}   bundlePath Bundle path
         * @param {Object}   srcFiles   Bundle source files object
         *
         */
        _feedCSSLoader: function (callback, biid, bundlePath, srcFiles) {
            var fn,
                defSrc,
                src;
            /**
             * def.src is requested / src is adjusted path
             */
            for (src in srcFiles.css) {
                if (srcFiles.css.hasOwnProperty(src)) {
                    // var def = srcFiles.css[src];
                    defSrc = src;
                    fn = _buildPathForLoaderMode(defSrc, bundlePath);
                    this._loadCss(fn, callback);
                    this.log('- added css source ' + fn + ' for ' + biid);
                }
            }
        },

        /**
         * @private @method _feedBundleLoader
         *
         * @param {function()} cb         Callback function
         * @param {string}     biid       Bundle implementation ID
         * @param {string}     bundlePath Bundle path
         * @param {Object}     srcFiles   Bundle source files object
         * @param {Object}     srcState   Source state object
         *
         */
        _feedBundleLoader: function (cb, biid, bundlePath, srcFiles, srcState) {
            var me = this,
                bl,
                fileCount,
                js,
                srcsFn,
                localesFn;

            bl = new Bundle_loader(me, cb);
            bl.metadata.context = 'bundleSources';
            bl.metadata.bundleImpl = biid;
            srcState.loader = bl;

            /**
             * if using compiled javascript
             */
            if (_isPackedMode()) {
                fileCount = 0;
                for (js in srcFiles.files) {
                    if (srcFiles.files.hasOwnProperty(js)) {
                        fileCount += 1;
                    }
                }
                if (fileCount > 0) {
                    srcsFn = _buildPathForPackedMode(bundlePath);
                    bl.add(srcsFn, 'text/javascript');
                    me.log('- added PACKED javascript source ' + srcsFn +
                        ' for ' + biid);

                    localesFn = _buildLocalePathForPackedMode(bundlePath);
                    bl.add(localesFn, 'text/javascript');
                    me.log('- added PACKED locale javascript source ' +
                        localesFn + ' for ' + biid);
                }

                /**
                 * else load any files
                 */
            } else {
                for (js in srcFiles.files) {
                    if (srcFiles.files.hasOwnProperty(js)) {
                        bl.add(js, srcFiles.files[js]);
                        me.log('- added script source ' + js + ' for ' + biid);
                    }
                }
            }

            bl.commit();
        },

        /**
         * @public @method loadBundleSources
         * Registers and commits JavaScript load request from bundle manifest.
         * A trigger is fired after all JavaScript files have been loaded.
         *
         * @param {string} biid Bundle implementation ID
         *
         */
        loadBundleSources: function (biid) {
            // load any JavaScripts for bundle
            // MUST be done before createBundle
            var me = this,
                bundleDefinitionState,
                srcFiles,
                srcState,
                callback,
                bundlePath,
                srcs;

            me.log('loadBundleSources called with ' + biid);

            if (biid === null || biid === undefined) {
                throw new TypeError('loadBundleSources(): Missing biid');
            }

            bundleDefinitionState = me.bundleDefinitionStates[biid];

            if (!bundleDefinitionState) {
                throw new Error('loadBundleSources(): INVALID_STATE: bundle ' +
                    'definition load not requested for ' + biid
                    );
            }

            me.log('- definition STATE for ' + biid + ' at load sources ' +
                bundleDefinitionState.state
                );

            if (mode === 'static') {
                me.postChange(null, null, 'bundle_definition_loaded');
                return;
            }

            srcState = me.bundleSourceStates[biid];

            if (srcState) {
                if (srcState.state === 1) {
                    me.log('Already loaded sources for : ' + biid);
                    return;
                }
                if (srcState.state === -1) {
                    me.log('Loading previously pending sources for ' + biid +
                        ' ' + srcState.state + ' or what?'
                        );
                } else {
                    throw new Error('loadBundleSources(): INVALID_STATE: at ' +
                        biid
                        );
                }
            } else {
                srcState = {
                    state: -1
                };
                me.bundleSourceStates[biid] = srcState;
                me.log('Setting STATE for sources ' + biid + ' to ' +
                    srcState.state
                    );
            }

            if (bundleDefinitionState.state !== 1) {
                me.log('Pending DEFINITION at sources for ' + biid + ' to ' +
                    bundleDefinitionState.state + ' -> postponed'
                    );
                return;
            }

            me.log('STARTING load for sources ' + biid);

            srcFiles = {
                count: 0,
                loaded: 0,
                files: {},
                css: {}
            };

            callback = function () {
                me.log('Finished loading ' + srcFiles.count + ' files for ' +
                    biid + '.');
                me.bundleSourceStates[biid].state = 1;
                me.log('Set NEW state post source load for ' + biid + ' to ' +
                    me.bundleSourceStates[biid].state
                    );

                me.postChange(null, null, 'bundle_sources_loaded');
            };
            bundlePath = bundleDefinitionState.bundlePath;

            srcs = me.sources[biid];

            me._handleSourceFiles(srcFiles, bundlePath, srcs);

            me._feedCSSLoader(
                callback,
                biid,
                bundlePath,
                srcFiles
            );
            me._feedBundleLoader(
                callback,
                biid,
                bundlePath,
                srcFiles,
                srcState
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
         * @public @method getBundleInstanceByName
         * Returns bundle_instance by bundleinstancename defined in player json
         *
         * @param  {string} biid Bundle instance ID
         *
         * @return {Object}      Bundle instance 
         */
        getBundleInstanceByName: function (biid) {
            return this.bundleInstances[biid];
        },

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
         * @public @method requireBundle
         * Executes callback after bundle sources have been loaded and bundle
         * has been created.
         *
         * @param {string}                           biid     Bundle
         *                                                    implementation ID
         * @param {string}                           bid      Bundle ID
         * @param {function(Bundle_manager, Object)} callback Callback function
         *
         */
        requireBundle: function (biid, bid, callback) {
            var me = this,
                bundle;

            if (biid === null || biid === undefined) {
                throw new TypeError('requireBundle(): Missing biid');
            }

            if (bid === null || bid === undefined) {
                throw new TypeError('requireBundle(): Missing bid');
            }

            if (callback === null || callback === undefined) {
                throw new TypeError('requireBundle(): Missing callback');
            }

            bundle = me.manager.createBundle(biid, bid);

            callback(me.manager, bundle);
        },

        /**
         * @public @method require
         * Executes callback after any requirements in bundle manifest have been
         * met. (Work In Progress)
         *
         * @param {Object}                   config   Config
         * @param {function(Bundle_manager)} callback Callback function
         * @param {string}                   info     Info
         *
         */
        require: function (config, callback, info) {
            var me = this,
                bundleDefFilename,
                bundlePath,
                def,
                p,
                pp,
                imports,
                packedBundleFn;

            if (config === null || config === undefined) {
                throw new TypeError('require(): Missing config');
            }

            if (callback === null || callback === undefined) {
                throw new TypeError('require(): Missing callback');
            }

            me.manager.on(config, callback, info);
            imports = config['Import-Bundle'];

            for (p in imports) {
                if (imports.hasOwnProperty(p)) {
                    pp = p;
                    def = imports[p];
                    bundlePath = def.bundlePath || me.bundlePath;

                    if (_isPackedMode()) {
                        packedBundleFn =
                            _buildBundlePathForPackedMode(bundlePath + pp);
                        bundleDefFilename =
                            _buildPathForLoaderMode(packedBundleFn, bundlePath);
                    } else {
                        bundleDefFilename = _buildPathForLoaderMode(bundlePath +
                            pp + '/bundle.js', bundlePath);
                    }
                    me.manager.log(
                        'FACADE requesting load for ' + pp + 'from' +
                            bundleDefFilename
                    );
                    me.manager.loadBundleDefinition(
                        pp,
                        bundleDefFilename,
                        bundlePath + pp
                    );
                    me.manager.loadBundleSources(pp);
                }
            }
        },

        /**
         * @public @method setBundlePath
         *
         * @param {string} path Bundle path
         *
         */
        setBundlePath: function (path) {
            this.bundlePath = path;
        },

        /**
         * @private @method _loadBundleDeps
         *
         * @param {Object}                   deps     Dependencies
         * @param {function(Bundle_manager)} callback Callback function
         * @param {Bundle_manager}           manager  Bundle manager
         * @param {string}                   info     Info
         *
         */
        _loadBundleDeps: function (deps, callback, manager, info) {
            var me = this,
                bdep = deps['Import-Bundle'],
                depslist = [],
                hasPhase = false,
                p,
                name,
                def;

            for (p in bdep) {
                if (bdep.hasOwnProperty(p)) {
                    name = p;
                    def = bdep[p];
                    depslist.push({
                        name: name,
                        def: def,
                        phase: def.phase
                    });
                    hasPhase = hasPhase || def.phase;
                }
            }

            depslist.sort(function (a, b) {
                if (!a.phase && !b.phase) {
                    return 0;
                }
                if (!a.phase) {
                    return 1;
                }
                if (!b.phase) {
                    return -1;
                }
                return a.phase < b.phase ? -1 : 1;
            });

            if (hasPhase || !supportBundleAsync) {
                me._loadBundleDep(depslist, callback, manager, info);
            } else {
                me._loadBundleDepAsync(deps, callback, manager, info);
            }
        },

        /**
         * @private @method _loadBundleDep
         * Maintains some a sort of order in loading.
         *
         * @param {Object}                   depslist Dependencies
         * @param {function(Bundle_manager)} callback Callback function
         * @param {Bundle_manager}           manager  Bundle Manager
         * @param {string}                   info     Info
         *
         */
        _loadBundleDep: function (depslist, callback, manager, info) {
            var me = this,
                bundledef = depslist.pop(),
                def,
                bundlename,
                fcd,
                bdep;

            if (!bundledef) {
                callback(manager);
                return;
            }

            def = bundledef.def;
            bundlename = bundledef.name;

            fcd = this;
            bdep = {
                'Import-Bundle': {}
            };
            bdep['Import-Bundle'][bundlename] = def;
            fcd.require(bdep, function (manager) {
                me._loadBundleDep(depslist, callback, manager, info);
            }, info);
        },

        /**
         * @private @method _loadBundleDepAsync
         * Load bundles regardless of order.
         *
         * @param {Object}                   depslist Dependencies
         * @param {function(Bundle_manager)} callback Callback function
         * @param {Bundle_manager}           manager  Bundle manager
         * @param {string}                   info     Info
         *
         */
        _loadBundleDepAsync: function (depslist, callback, manager, info) {
            this.require(depslist, callback, info);
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
        playBundle: function (recData, callback) {
            var metas,
                bundlename,
                bundleinstancename,
                isSingleton,
                fcd = this,
                me = this,
                instanceRequirements,
                instanceProps,
                r,
                implInfo,
                implInfoIsObj,
                implid,
                bundleid,
                bundle,
                bundleInstance,
                configProps,
                newBundleInstance;

            if (recData === null || recData === undefined) {
                throw new TypeError('playBundle(): Missing recData');
            }

            metas = recData.metadata;
            bundlename = recData.bundlename;
            bundleinstancename = recData.bundleinstancename;
            instanceRequirements = metas['Require-Bundle-Instance'] || [];
            instanceProps = recData.instanceProp;
            isSingleton = metas.Singleton;

            if (!recData.hasOwnProperty('bundleinstancename')) {
                if (console && console.warn) {
                    console.warn('Bundle is missing bundleinstancename, ' +
                            'using bundlename in its place.',
                        recData
                        );
                }
                bundleinstancename = bundlename;
            }

            me._loadBundleDeps(metas, function (manager) {
                var ip;

                for (r = 0; r < instanceRequirements.length; r += 1) {
                    implInfo = instanceRequirements[r];
                    implInfoIsObj = typeof implInfo === 'object';
                    /* implname */
                    implid =
                        implInfoIsObj ? implInfo.bundlename : implInfo;
                    /* bundlename */
                    bundleid =
                        implInfoIsObj ? implInfo.bundleinstancename :
                                implInfo + 'Instance';
                    bundle = me.bundles[implid];
                    if (!bundle) {
                        bundle = manager.createBundle(implid, bundleid);
                        me.bundles[implid] = bundle;
                    }

                    bundleInstance = me.bundleInstances[bundleid];
                    if (!bundleInstance || !isSingleton) {
                        bundleInstance = manager.createInstance(bundleid);
                        me.bundleInstances[bundleid] = bundleInstance;

                        configProps =
                            me.getBundleInstanceConfigurationByName(bundleid);
                        if (configProps) {
                            for (ip in configProps) {
                                if (configProps.hasOwnProperty(ip)) {
                                    bundleInstance[ip] = configProps[ip];
                                }
                            }
                        }
                        bundleInstance.start();
                    }
                }

                fcd.requireBundle(bundlename, bundleinstancename, function () {
                    var prop;
                    newBundleInstance =
                        manager.createInstance(bundleinstancename);

                    for (prop in instanceProps) {
                        if (instanceProps.hasOwnProperty(prop)) {
                            newBundleInstance[prop] = instanceProps[prop];
                        }
                    }

                    configProps = me.getBundleInstanceConfigurationByName(
                        bundleinstancename
                    );
                    if (configProps) {
                        for (prop in configProps) {
                            if (configProps.hasOwnProperty(prop)) {
                                newBundleInstance[prop] = configProps[prop];
                            }
                        }
                    }

                    newBundleInstance.start();
                    me.bundleInstances[bundleinstancename] = newBundleInstance;

                    callback(newBundleInstance);
                });
            }, fcd.manager, bundlename);
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

        /**
         * @public @method startApplication
         * Starts JSON setup (set with setApplicationSetup)
         *
         * @param {function(Object)} callback Callback function
         *
         */
        startApplication: function (callback) {
            var me = this,
                appConfig = this.appConfig,
                seq = this.appSetup.startupSequence.slice(0),
                startupInfo = {
                    bundlesInstanceConfigurations: appConfig,
                    bundlesInstanceInfos: {}
                };

            /**
             * Let's shift and playBundle until all done
             */
            var mediator = {
                facade: me,
                startupSequence: seq,
                bundleStartInfo: null,
                player: null,
                startupInfo: startupInfo
            };

            function schedule() {
                window.setTimeout(mediator.player, 0);
            }


            mediator.player = function () {
                mediator.bundleStartInfo = mediator.startupSequence.shift();
                if (!mediator.bundleStartInfo) {
                    if (callback) {
                        callback(startupInfo);
                    }
                    return;
                }

                mediator.facade.playBundle(
                    mediator.bundleStartInfo,
                    function (bundleInstance) {
                        var bName = mediator.bundleStartInfo.bundlename,
                            biName =
                                mediator.bundleStartInfo.bundleinstancename;

                        mediator.startupInfo.bundlesInstanceInfos[biName] =
                            {
                                bundlename: bName,
                                bundleinstancename: biName,
                                bundleInstance: bundleInstance
                            };

                        // TODO apparently none of ours has a callback?
                        if (mediator.bundleStartInfo.callback) {
                            if (typeof mediator.bundleStartInfo.callback ===
                                    'string') {
                                // FIXME no eval please
                                eval(mediator.bundleStartInfo.callback);
                            }
                            mediator.bndl.callback.apply(
                                this,
                                [bundleInstance, mediator.bundleStartInfo]
                            );
                        }
                        schedule();
                    }
                );
            };
            schedule();

        },

        /**
         * @method stopApplication
         * Might stop app if/when all stops implemented
         */
        stopApplication: function () {
            throw 'NYI';
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
        bundle_locale: blocale,
        app: fcd,
        /* */
        clazz: cs,

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
         * @public @method Oskari.setSupportBundleAsync
         *
         * @param {boolean} sba Support async on/off
         *
         */
        setSupportBundleAsync: function (sba) {
            if (typeof sba !== 'boolean') {
                throw new TypeError(
                    'setSupportBundleAsync(): sba is not a boolean'
                );
            }
            supportBundleAsync = sba;
        },

        /**
         * @public @method Oskari.getSupportBundleAsync
         *
         *
         * @return {boolean} Support async on/off
         */
        getSupportBundleAsync: function () {
            return supportBundleAsync;
        },

        /**
         * @public @method Oskari.setBundleBasePath
         *
         * @param {string} bp Bundle base path
         *
         */
        setBundleBasePath: function (bp) {
            if (typeof bp !== 'string') {
                throw new TypeError(
                    'setBundleBasePath(): bp is not a string'
                );
            }
            basePathForBundles = bp;
        },

        /**
         * @public @method Oskari.getBundleBasePath
         *
         *
         * @return {string} Bundle base path
         */
        getBundleBasePath: function () {
            return basePathForBundles;
        },

        /**
         * @public @method Oskari.setPreloaded
         *
         * @param {boolean} usep Preloaded on/off
         *
         */
        setPreloaded: function (usep) {
            if (typeof usep !== 'boolean') {
                throw new TypeError(
                    'setPreloaded(): usep is not a boolean'
                );
            }
            _preloaded = usep;
        },

        /**
         * @public @method Oskari.setInstTs
         *
         * @param {} x
         *
         */
        setInstTs: function (x) {
            instTs = x;
        },

        /**
         * @public @static @method Oskari.registerLocalization
         *
         * @param  {Object|Object[]} props Properties
         *
         */
        registerLocalization: function (props) {
            var p,
                pp;

            if (props === null || props === undefined) {
                throw new TypeError('registerLocalization(): Missing props');
            }

            if (props.length) {
                for (p = 0; p < props.length; p += 1) {
                    pp = props[p];
                    blocale.setLocalization(pp.lang, pp.key, pp.value);
                }
            } else {
                return blocale.setLocalization(
                    props.lang,
                    props.key,
                    props.value
                );
            }
        },

        /**
         * @public @static @method Oskari.getLocalization
         *
         * @param  {string} key Key
         *
         * @return {string} 
         */
        getLocalization: function (key) {
            return blocale.getLocalization(key);
        },

        /**
         * @public @static @method Oskari.getLang
         *
         *
         * @return {string} Language
         */
        getLang: function () {
            return blocale.getLang();
        },

        /**
         * @public @static @method Oskari.setLang
         *
         * @param  {string} lang Language
         *
         */
        setLang: function (lang) {
            return blocale.setLang(lang);
        },

        /**
         * @public @static @method Oskari.setSupportedLocales
         *
         * @param  {string[]} locales Locales array
         *
         */
        setSupportedLocales: function (locales) {
            return blocale.setSupportedLocales(locales);
        },

        /**
         * @public @static @method Oskari.getSupportedLocales
         *
         *
         * @return {string[]} Supported locales
         */
        getSupportedLocales: function () {
            return blocale.getSupportedLocales();
        },

        /**
         * @public @static @method Oskari.getDefaultLanguage
         *
         *
         * @return {string} Default language
         */
        getDefaultLanguage: function () {
            return blocale.getDefaultLanguage();
        },

        /**
         * @public @static @method Oskari.getSupportedLanguages
         *
         *
         * @return {string[]} Supported languages
         */
        getSupportedLanguages: function () {
            return blocale.getSupportedLanguages();
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
        }
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
     * @static @method Oskari.bundleCls
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
