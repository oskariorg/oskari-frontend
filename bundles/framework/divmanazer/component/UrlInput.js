/**
 * @class Oskari.userinterface.component.UrlInput
 *
 * Simple password input component
 */
Oskari.clazz.define('Oskari.userinterface.component.UrlInput',

    /**
     * @method create called automatically on construction
     */
    function () {
        
        this._element.className = 'oskari-formcomponent oskari-urlinput';
        this._input.type = 'url';
    }, {},
    {
        extend: ['Oskari.userinterface.component.TextInput']
    }
    );