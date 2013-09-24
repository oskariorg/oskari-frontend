/**
 * @class Oskari.userinterface.extension.EnhancedTile
 * 
 * Enhanced Menu Tile implementation which assumes a locale
 * of kind
 * {
 *     "title" : "<title shown to user>",
 *     "description" : "<a longer localised description>"
 * } 
 * 
 */
Oskari.clazz.define('Oskari.userinterface.extension.EnhancedTile',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function() {
  
}, {
    /**
     * @method getName
     * @return {String} tile implementation name
     */
    getName : function() {
        return 'Oskari.userinterface.extension.EnhancedTile';
    }   
    
}, {
    'protocol' : ['Oskari.userinterface.Tile'],
    "extend" : ["Oskari.userinterface.extension.DefaultTile"]
});
