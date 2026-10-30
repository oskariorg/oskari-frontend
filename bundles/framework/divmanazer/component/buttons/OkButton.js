/**
 * @class Oskari.userinterface.component.buttons.OkButton
 *
 * Generic button component to make each button look the same in Oskari
 */
Oskari.clazz.define('Oskari.userinterface.component.buttons.OkButton',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        this.setTitle(Oskari.getMsg('oskariui', 'buttons.ok', null, 'OK'));
        this.setPrimary(true);
    },
    {},
    {
        extend: ['Oskari.userinterface.component.Button']
    }
);
