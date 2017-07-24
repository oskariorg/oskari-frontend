/**
 * @class Oskari.sample.bundle.myfourthbundle.ToolbarRequestBundleInstance
 *
 * This bundle demonstrates how bundle can react to events by
 * registering itself to sandbox as a module.
 *
 * Add this to startupsequence to get this bundle started
 {
            title : 'myfourthbundle',
            fi : 'myfourthbundle',
            sv : '?',
            en : '?',
            bundlename : 'myfourthbundle',
            bundleinstancename : 'myfourthbundle',
            metadata : {
                "Import-Bundle" : {
                    "myfourthbundle" : {
                        bundlePath : '/<path to>/packages/sample/bundle/'
                    }
                },
                "Require-Bundle-Instance" : []
            },
            instanceProps : {}
        }
 */
Oskari.clazz.define("Oskari.sample.bundle.myfourthbundle.ToolbarRequestBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.sandbox = null;
    this.enabled = true;
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'MyFourthBundle',

    /**
     * @method getName
     * Module protocol method
     */
    getName : function() {
        return this.__name;
    },

    /**
     * @method update
     * BundleInstance protocol method
     */
    update : function() {
    },
    /**
     * @method start
     * BundleInstance protocol method
     */
    start : function() {
        var me = this;

        // Should this not come as a param?
        	var conf = me.conf ;
		var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
		var sandbox = Oskari.getSandbox(sandboxName);
        this.sandbox = sandbox;

        // register to sandbox as a module
        sandbox.register(me);

        var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
        if(reqBuilder) {
            // got builder -> toolbar is loaded
            sandbox.request(me, reqBuilder('mytool', 'sampletools', {
                iconCls : 'tool-myfourth',
                tooltip: me.getLocalization('tooltip'),
                sticky: false,
                callback : function() {
                    var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    dialog.show(null, me.getLocalization('toolClicked'));
                    dialog.makeModal();
                    dialog.fadeout();
                }
            }));
        }
    },

    /**
     * @method init
     * Module protocol method
     */
    init : function() {
        // headless module so nothing to return
        return null;
    },

    /**
     * @method onEvent
     * Module protocol method/Event dispatch
     */
    onEvent : function(event) {
    },

    /**
     * @method stop
     * BundleInstance protocol method
     */
    stop : function() {
        var me = this;
        var sandbox = me.sandbox();
        // unregister module from sandbox
        me.sandbox.unregister(me);
    },
    /**
     * @method getLocalization
     * Convenience method to call from Tile and Flyout
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     *
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     *      JSON object for complete data depending on localization
     *      structure and if parameter key is given
     */
    getLocalization : function(key) {
        if(!this._localization) {
            this._localization = Oskari.getLocalization(this.getName());
        }
        if(key) {
            return this._localization[key];
        }
        return this._localization;
    }
}, {
    protocol : [ 'Oskari.bundle.BundleInstance',
                 'Oskari.mapframework.module.Module']
});
