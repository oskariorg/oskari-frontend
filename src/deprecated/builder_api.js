(function (o) {
    if (!o) {
        // can't add functions if no Oskari ref
        return;
    }

    var _baseClassFor = {
        extension: 'Oskari.userinterface.extension.EnhancedExtension',
        bundle: 'Oskari.mapframework.bundle.extension.ExtensionBundle',
        tile: 'Oskari.userinterface.extension.EnhancedTile',
        flyout: 'Oskari.userinterface.extension.EnhancedFlyout',
        view: 'Oskari.userinterface.extension.EnhancedView'
    };
    var bundleInstances = {};
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
    o.cls = function (className, constructor, proto, metas) {
        var classInfo;

        if (!className) {
            className = [
                'Oskari',
                '_',
                o.seq.nextVal('Class')
            ].join('.');
        } else {
            classInfo = o.clazz.lookup(className);
        }

        if (!(classInfo && classInfo._constructor && !constructor)) {
            classInfo = o.clazz.define(
                className,
                constructor || function () {},
                proto,
                metas || {}
            );
        }

        return o.clazz.create('Oskari.ModuleSpec', classInfo, className);
    };

    /**
     * @public @method loc
     * Oskari1Builder helper to register localisation
     */
    o.loc = function () {
        return o.registerLocalization.apply(o, arguments);
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
    o.eventCls = function (eventName, constructor, proto) {
        var className,
            rv;

        if (eventName === null || eventName === undefined) {
            throw new TypeError('eventCls(): Missing eventName');
        }

        className = 'Oskari.event.registry.' + eventName;
        rv = o.cls(
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
    o.requestCls = function (requestName, constructor, proto) {
        var className,
            rv;

        if (requestName === null || requestName === undefined) {
            throw new TypeError('requestCls(): Missing requestName');
        }

        className = 'Oskari.request.registry.' + requestName;
        rv = o.cls(
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

    /**
     * @public @static @method Oskari.extensionCls O2 api for extension classes
     *
     * @param  {string} className Class name
     *
     * @return
     */
    o.extensionCls = function (className) {
        if (className === null || className === undefined) {
            throw new TypeError('extensionCls(): Missing className');
        }

        return o.cls(className).extend(
            _baseClassFor.extension
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
    o.bundleCls = function (bundleId, className) {
        var rv;

        if (className === null || className === undefined) {
            throw new TypeError('bundleCls(): Missing className');
        }

        if (!bundleId) {
            bundleId = (['__', o.seq.nextVal('Bundle')].join('_'));
        }

        rv = o.cls(className, function () {}, {
            update: function () {}
        }, {
            protocol: ['Oskari.bundle.Bundle', _baseClassFor.bundle],
            manifest: {
                'Bundle-Identifier': bundleId
            }
        });
        // Probably broken since bm is not defined
        var bm = {};
        // bm.installBundleClassInfo(bundleId, rv.classInfo);

        rv.___bundleIdentifier = bundleId;

        rv.loc = function (properties) {
            properties.key = this.___bundleIdentifier;
            o.registerLocalization(properties);
            return rv;
        };

        // FIXME instanceId isn't used for anything?
        rv.start = function (instanceId) {
            var bid = this.___bundleIdentifier,
                bundle,
                bundleInstance,
                configProps,
                ip;

            if (!o.app.bundles[bid]) {
                bundle = bm.createBundle(bid, bid);
                o.bundle(bid, bundle);
            }

            bundleInstance = bm.createInstance(bid);
            bundleInstances[bid] = bundleInstance;

            configProps = o.app.getBundleInstanceConfigurationByName(bid);
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
            var bundleInstance = bundleInstances[this.___bundleIdentifier];

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
    o.flyoutCls = function (className) {
        if (className === null || className === undefined) {
            throw new TypeError('flyoutCls(): Missing className');
        }

        return o.cls(className).extend(
            _baseClassFor.flyout
        );
    };

    /**
     * @static @method Oskari.tileCls
     *
     * @param  {string} className Class name
     *
     * @return
     */
    o.tileCls = function (className) {
        if (className === null || className === undefined) {
            throw new TypeError('tileCls(): Missing className');
        }

        return o.cls(className).extend(_baseClassFor.tile);
    };

    /**
     * @static @method Oskari.viewCls
     *
     * @param  {string} className Class name
     *
     * @return
     */
    o.viewCls = function (className) {
        if (className === null || className === undefined) {
            throw new TypeError('viewCls(): Missing className');
        }

        return o.cls(className).extend(_baseClassFor.view);
    };
}(Oskari));
