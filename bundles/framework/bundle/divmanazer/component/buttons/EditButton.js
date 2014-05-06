/**
 * @class Oskari.userinterface.component.buttons.EditButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.EditButton',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.title = Oskari.getLocalization('DivManazer').buttons.edit;
        setTitle(this.title);
        setPrimary(true);
    },
    {},
    {
        "extend": ["Oskari.userinterface.component.Button"]
    }
);