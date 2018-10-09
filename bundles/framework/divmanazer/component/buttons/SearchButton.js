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
        var loc = Oskari.getLocalization('DivManazer');
        this.setTitle(loc ? loc.buttons.search : 'Search');
    },
    {},
    {
        extend: ['Oskari.userinterface.component.buttons.SubmitButton']
    }
);
