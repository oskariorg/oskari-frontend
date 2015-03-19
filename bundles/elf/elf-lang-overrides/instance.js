/**
 * This bundle overrides elf languages.
 *
 * @class Oskari.elf.lang.overrides.BundleInstance
 */
Oskari.clazz.define('Oskari.elf.lang.overrides.BundleInstance',
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
    __name : 'elf-lang-overrides',
    /**
     * Module protocol method
     *
     * @method getName
     */
    getName : function () {
        return this.__name;
    },
    /**
     * DefaultExtension method for doing stuff after the bundle has started.
     * 
     * @method afterStart
     */
    start: function (sandbox) {        
        // Set languages
        jQuery.each(Oskari.getLocalization('elf-lang-overrides'), function(key, value ) {
            Oskari.registerLocalization({'key': key, 'value': value, 'lang': Oskari.getLang()}, true); 
        });
    },
    /**
     * @method update
     *
     * implements bundle instance update method
     */
    update: function(){}
});