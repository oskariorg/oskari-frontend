(function(o){
    /* Oskari1BuilderAPI */
    var Oskari1BuilderAPI = o;
    var fcd = {
        bundles : {},
        bundleInstances : {},
        getBundleInstanceConfigurationByName : function() {
            console.log('config called');
            return {};
        }
    };

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
                o.seq.nextVal('Class')
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
        return o.registerLocalization.apply(Oskari1BuilderAPI, arguments);
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
            bundleId = (['__', o.seq.nextVal('Bundle')].join('_'));
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
}(Oskari));