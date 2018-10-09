/**
 * @class Oskari.userinterface.component.buttons.SaveButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.SaveButton',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var loc = Oskari.getLocalization('DivManazer');
        this.setTitle(loc ? loc.buttons.save : 'Save');
    },
    {},
    {
        extend: ['Oskari.userinterface.component.buttons.SubmitButton']
    }
);
