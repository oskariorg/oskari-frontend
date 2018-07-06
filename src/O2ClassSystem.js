
(function (o) {
    /**
     * Registers O2ClassSystem as global so Oskari can build on it
     */
    var O2ClassSystem = function () {
        this.packages = {};
        this.protocols = {};
        this.inheritance = {};
        this.classcache = {};
    };

    O2ClassSystem.prototype = {

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
         * @private @method _ensureClassInfo
         * Returns classInfo if it exists, creates it if not, and returns it
         *
         * @param  {string} className Class name
         * @param  {Function} constructor Class constructor to be associated with classInfo if it's created
         *
         * @return {Object}           ClassInfo
         */
        _ensureClassInfo: function(className, constructor) {
            var classQName = this._getClassQName(className);
            var packageDefinition = this._getPackageDefinition(classQName.pkg);
            var classInfo = packageDefinition[classQName.sp];

            if (!classInfo) {
                var classDefinition = this._createEmptyClassDefinition();
                var composition = {
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
                classInfo._esConstructor = this._createESConstructor(classInfo);
                this.inheritance[className] = composition;
                classDefinition.prototype._ = classInfo;
                packageDefinition[classQName.sp] = classInfo;
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
         * @private @method _createESConstructor
         * 
         * Creates a EcmaScript native constructor from Oskari classInfo
         *
         * @param  {Object} classInfo classInfo
         *
         * @return {Function} Ecma Script native constructor
         */
        _createESConstructor: function (classInfo) {
            var me = this;
            function esConstructor () {
                var args = me._slicer.call(arguments);
                var constructors = classInfo._constructors || [classInfo._constructor];
                return me._applyConstructors(this, constructors, args);
            }
            esConstructor.prototype = classInfo._class.prototype;
            return esConstructor;
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
            var classQName,
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

            var classInfo = this._ensureClassInfo(className, classConstructor);

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
                classQName = this._getClassQName(className);
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
            var prot;

            if (className === null || className === undefined) {
                throw new TypeError('category(): Missing className');
            }

            var classInfo = this._ensureClassInfo(className, null);

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
        lookup: function (className) {
            if (className === null || className === undefined) {
                throw new TypeError('lookup(): Missing className');
            }

            return this._ensureClassInfo(className, null);
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
         * @private @method _checkClassName
         * Check is className is valid and return class info
         *
         * @param  {string} className className
         * 
         * @return {Object}           ClassInfo
         */
        _checkClassName: function (className) {
            if (className === null || className === undefined) {
                throw new TypeError('create(): Missing className');
            }

            var classInfo = this._getClassInfo(className);
            if (!classInfo) {
                // If this error is thrown,
                // the class definition is missing.
                // Ensure the file has been loaded before use
                throw new Error('Class "' + className + '" does not exist');
            }
            return classInfo;
        },

        /**
         * @public @method create
         * Creates a class instance
         *
         * @param  {string} className Class name
         *
         * @return {Object}           Class instance
         */
        create: function (className) {
            var classInfo = this._checkClassName(className);
            var instanceArguments = this._slicer.call(arguments, 1);

            return this.createWithClassInfo(classInfo, instanceArguments);
        },

        /**
         * @public @method get
         * Returns the EcmaScript native constructor for Oskari class
         *
         * @param  {string} className Class name
         *
         * @return {Function}           Class constructor
         */
        get: function (className) {
            var classInfo = this._checkClassName(className);
            return classInfo._esConstructor;
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
            var classInstance = new classInfo._class();
            var constructors = classInfo._constructors || [classInfo._constructor];

            return this._applyConstructors(classInstance, constructors, instanceArguments);
        },

        /**
         * @private @method _applyConstructors
         * Apply class constructors
         *
         * @param  {Object} classInstance class instance
         * @param {[]} constructors constructor functions
         * 
         * @return {Object}           instance
         */
        _applyConstructors: function (classInstance, constructors, instanceArguments) {
            var i;

            for (i = 0; i < constructors.length; i += 1) {
                // If an error occurs below, the constructor is missing.
                // Ensure the file has been loaded before use.
                // Note! check extends classes as well, those might also be
                // missing.
                if (constructors[i] === null || constructors[i] === undefined) {
                    throw new Error('Class ' + className + ' is missing super constructor ' + (i + 1) + '/' + constructors.length);
                }
                var returned = constructors[i].apply(classInstance, instanceArguments);
                if (returned) {
                    classInstance = returned;
                }
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
            var classInfo = this._checkClassName(className);
            if (!classInfo._builder) {
                classInfo._builder = function() {
                    return this.createWithClassInfo(classInfo, arguments);
                }.bind(this);
            }
            return classInfo._builder;
        }
    };
    o.clazz = new O2ClassSystem();
}(Oskari));
