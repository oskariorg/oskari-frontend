/**
 * @class Oskari.userinterface.component.buttons.SearchButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.SearchButton',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        this.setTitle(Oskari.getMsg('DivManazer', 'buttons.search', null, 'Search'));
    },
    {},
    {
        extend: ['Oskari.userinterface.component.buttons.SubmitButton']
    }
);
