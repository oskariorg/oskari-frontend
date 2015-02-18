/**
 * @class Oskari.userinterface.component.SearchInput
 *
 * Simple search input component
 */
Oskari.clazz.define('Oskari.userinterface.component.SearchInput',

    /**
     * @method create called automatically on construction
     */
    function () {
        'use strict';
        this._element.className = 'oskari-formcomponent oskari-searchinput';
        this._input.type = 'search';
    },
    {},
    {
        extend: ['Oskari.userinterface.component.TextInput']
    }
    );