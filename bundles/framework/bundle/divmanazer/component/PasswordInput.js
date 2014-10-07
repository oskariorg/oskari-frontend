/**
 * @class Oskari.userinterface.component.PasswordInput
 *
 * Simple password input component
 */
Oskari.clazz.define('Oskari.userinterface.component.PasswordInput',

    /**
     * @method create called automatically on construction
     */
    function () {
        'use strict';
        this._element.className = 'oskari-formcomponent oskari-passwordinput';
        this._input.type = 'password';
    }, {},
    {
        extend: ['Oskari.userinterface.component.TextInput']
    }
    );