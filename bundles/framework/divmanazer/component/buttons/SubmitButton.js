/**
 * @class Oskari.userinterface.component.buttons.SubmitButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.SubmitButton',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        this._element.type = 'submit';
        var loc = Oskari.getLocalization('DivManazer');
        this.setTitle(loc ? loc.buttons.submit : 'Submit');
        this.setPrimary(true);
    },
    {},
    {
        extend: ['Oskari.userinterface.component.Button']
    }
);
