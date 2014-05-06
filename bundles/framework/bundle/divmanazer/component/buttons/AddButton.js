/**
 * @class Oskari.userinterface.component.buttons.AddButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.AddButton',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.title = Oskari.getLocalization('DivManazer').buttons.add;
        setTitle(this.title);
        setPrimary(true);
    },
    {},
    {
        "extend": ["Oskari.userinterface.component.Button"]
    }
);