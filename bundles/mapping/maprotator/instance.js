import './plugin/MapRotatorPlugin';
import './publisher/MapRotator';
import './event/map.rotated';
import './request/rotate.map';
/*
Oskari.app.playBundle(
{
  bundlename : 'maprotator'
});
*/
Oskari.clazz.define('Oskari.mapping.maprotator.MapRotatorBundleInstance',
    function () {
        this._started = false;
        this.plugin = null;
        this._mapmodule = null;
        this._sandbox = null;
        this.state = undefined;
    }, {
        __name: 'maprotator',
        /**
     * @method getName
     * @return {String} the name for the component
     */
        getName: function () {
            return this.__name;
        },
        init: function () {},
        setSandbox: function (sbx) {
            this.sandbox = sbx;
        },
        getSandbox: function () {
            return this.sandbox;
        },
        handleRequest: function (core, request) {
            this.plugin.setRotation(request.getDegrees());
        },
        start: function (sandbox) {
            var me = this;
            if (me._started) {
                return;
            }
            me._started = true;
            sandbox = sandbox || Oskari.getSandbox();
            me.setSandbox(sandbox);
            me._mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
            me.createPlugin();
            sandbox.register(me);
            sandbox.requestHandler('rotate.map', this);
            sandbox.registerAsStateful(this.mediator.bundleId, this);

            me.setState(this.state);
        },
        createPlugin: function () {
            if (this.plugin) {
                return;
            }
            var conf = this.conf || {};
            var plugin = Oskari.clazz.create('Oskari.mapping.maprotator.MapRotatorPlugin', conf);
            this._mapmodule.registerPlugin(plugin);
            this._mapmodule.startPlugin(plugin);
            this.plugin = plugin;
        },
        getPlugin: function () {
            return this.plugin;
        },
        stopPlugin: function () {
            this._mapmodule.unregisterPlugin(this.plugin);
            this._mapmodule.stopPlugin(this.plugin);
            this.plugin = null;
        },
        stop: function () {
            this.stopPlugin();
            this.getSandbox().requestHandler('rotate.map', null);
            this.sandbox.unregisterStateful(this.mediator.bundleId);
            this.sandbox = null;
            this.started = false;
        },
        setState: function (state) {
            state = state || {};
            let degrees = 0;
            if (state.degrees) {
                if (typeof state.degrees === 'string') {
                    degrees = parseFloat(state.degrees);
                } else {
                    degrees = state.degrees;
                }
            }
            this.plugin.setRotation(degrees);
        },
        getState: function () {
            let state = {};
            if (this.plugin) {
                state.degrees = this.plugin.getRotation();
            }
            return state;
        },
        getStateParameters: function () {
            let state = this.getState();
            if (state.degrees) {
                return 'rotate=' + Math.round(state.degrees);
            }
            return '';
        }
    }, {
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.userinterface.Stateful']
    });
