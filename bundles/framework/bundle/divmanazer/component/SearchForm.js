/**
 * @class Oskari.userinterface.component.SearchForm
 * Generic search form component
 */
Oskari.clazz.define('Oskari.userinterface.component.SearchForm',
    /**
     * TODO add (optional) autocomplete:
     * - setAutocomplete(handler)
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this._element.className = 'oskari-formcomponent oskari-searchform';
        this._input = null;
        this._button = null;
        this._initFields();
    }, {

        /**
         * @method _initFields
         * @private
         */
        _initFields: function () {
            // TODO check that submit on return works...
            this._input = Oskari.clazz.create(
                    'Oskari.userinterface.component.SearchInput',
                    'q'
                );
            this.addComponent(this._input);
            this._button = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.SearchButton'
            );
            this.addComponent(this._button);
        },

        getButton: function () {
            return this._button;
        },

        getInput: function () {
            return this._input;
        }
    }, {
        extend: ['Oskari.userinterface.component.Form']
    }
);
