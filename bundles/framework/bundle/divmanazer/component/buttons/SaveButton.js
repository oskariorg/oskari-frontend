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
        this.ui.attr('type', 'submit');
        this.setTitle(Oskari.getLocalization('DivManazer').buttons.save);
        this.setPrimary(true);
    },
    {},
    {
        "extend": ["Oskari.userinterface.component.Button"]
    }
);