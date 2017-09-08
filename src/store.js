(function (o) {
    // default impl for validator and defaultValue generator
    var noop = function () { return true; };

    var setterGetter = function setterGetterFn (collection, key, value, defaultValue, validator) {
        if (!collection) {
            return;
        }

        // setter
        if (key && value) {
            var currentValue = collection[key];

            // validate if validator is provided, pass is value and previous value
            if (!validator(value, currentValue)) {
                return false;
            }

            collection[key] = value;
            return true;
        }

        // getters
        if (!key) {
            // get registered keys
            var result = [];
            for (var prop in collection) {
                result.push(prop);
            };
            return result;
        } else {
            if (!collection[key]) {
                collection[key] = defaultValue(key);
            }
            // return values registered for name
            return collection[key];
        }
    };
    /*
    Returns an object with given methodName (defaults to 'data' if missing -> uses options as first param)
    options is an (optional) object with keys:
    - defaultValue : function that returns value to use if key doesn't have a value, it will receive the key as parameter
    - validator : function that will receive the value to be inserted and the current value as params

    Returns an object with functions:
    - reset(key) : removes value from the key or resets the whole storage if omitted
    - data(key, value) :
        - the actual method name can be overridden with constructor arg (defaults to data)
    */
    var Storage = function (methodName, options) {
        // normalize params
        if (typeof methodName !== 'string') {
            options = methodName;
            methodName = null;
        }

        methodName = methodName || 'data';
        if (typeof options !== 'object') {
            options = {};
        }

        var _collection = {};
        var _me = {
            reset: function (key) {
                if (!key) {
                    // do we need to loop and delete here to save memory?
                    _collection = {};
                } else {
                    delete _collection[key];
                }
            }
        };
        // Initialize default value function to no-op if not a function
        var defaultValue = options.defaultValue;
        if (typeof defaultValue !== 'function') {
            defaultValue = noop;
        }
        var validator = options.validator;
        if (typeof validator !== 'function') {
            validator = noop;
        }

        _me[methodName] = function (key, value) {
            return setterGetter(_collection, key, value, defaultValue, validator);
        };

        return _me;
    };

    o.createStore = function (methodName, options) {
        return new Storage(methodName, options);
    };
}(Oskari));
