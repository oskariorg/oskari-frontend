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
        this.title = Oskari.getLocalization('DivManazer').buttons.save;
        this.ui.attr('type', 'submit');
        setTitle(this.title);
        setPrimary(true);
    },
    {},
    {
        "extend": ["Oskari.userinterface.component.Button"]
    }
);