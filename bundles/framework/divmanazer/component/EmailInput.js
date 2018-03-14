/**
 * @class Oskari.userinterface.component.EmailInput
 *
 * Simple password input component
 */
Oskari.clazz.define('Oskari.userinterface.component.EmailInput',

    /**
     * @method create called automatically on construction
     */
    function () {
        
        this._element.className = 'oskari-formcomponent oskari-emailinput';
        this._input.type = 'email';
    }, {},
    {
        extend: ['Oskari.userinterface.component.TextInput']
    }
    );