/**
 * @class Oskari.userinterface.component.buttons.SaveButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.SaveButton',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this._element.type = 'submit';
        var loc = Oskari.getLocalization('DivManazer');
        this.setTitle(loc ? loc.buttons.save : 'Save');
        this.setPrimary(true);
    },
    {},
    {
        "extend": ["Oskari.userinterface.component.Button"]
    }
);