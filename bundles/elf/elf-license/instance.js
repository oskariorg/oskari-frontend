/**
 * This bundle logs the map click coordinates to the console. This is a demonstration of using DefaultExtension.
 *
 * @class Oskari.elf.licencse.BundleInstance
 */
Oskari.clazz.define('Oskari.elf.license.BundleInstance',
/**
 * @method create called automatically on construction
 * @static
 */
function () {
    this._sandbox = null;
    this._locale = null;
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'elf-license',
    /**
     * Module protocol method
     *
     * @method getName
     */
    getName : function () {
        return this.__name;
    },
    eventHandlers: {
        
    },
    /**
     * DefaultExtension method for doing stuff after the bundle has started.
     * 
     * @method afterStart
     */
    afterStart: function (sandbox) {
        var me = this;
        
        me._locale =  this.getLocalization();
        me._sandbox = sandbox;

        // Activate metadata search results shows licence link
        me._activateMetadataSearchResultsShowLicenseLink();
    },
    /**
     * Activate metadata search results show license link
     * @method _activateMetadataSearchResultsShowLicenseLink
     * @private
     */
    _activateMetadataSearchResultsShowLicenseLink: function(){
        var me = this,
            reqBuilder = me._sandbox.getRequestBuilder('AddSearchResultActionRequest');

        alert(me._locale.getLicenseText);

        if (reqBuilder) {
            var data = {
                actionElement: jQuery('<a href="javascript:void(0)"></a>'),
                callback: function(metadata) {
                    console.log('Get license information');
                    console.log(metadata);
                },
                bindCallbackTo: null,
                actionTextElement: null,
                actionText: me._locale.getLicenseText
            };
            var request = reqBuilder(data);
            me._sandbox.request(me, request);
        }
    }
}, {
    "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});