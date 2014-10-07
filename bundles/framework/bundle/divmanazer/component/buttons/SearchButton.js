/**
 * @class Oskari.userinterface.component.buttons.SearchButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.SearchButton',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this._element.type = 'submit';
        this.setTitle(Oskari.getLocalization('DivManazer').buttons.search);
        this.setPrimary(true);
    },
    {},
    {
        "extend": ["Oskari.userinterface.component.Button"]
    }
);