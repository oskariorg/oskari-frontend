/**
 * @class Oskari.userinterface.component.buttons.DeleteButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.DeleteButton',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.title = Oskari.getLocalization('DivManazer').buttons['delete'];
        setTitle(this.title);
    },
    {},
    {
        "extend": ["Oskari.userinterface.component.Button"]
    }
);