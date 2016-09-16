/**
 * Class which creates the ui to define geometry visualizations for eg. my places.
 * By default it creates buttons for point/dot, line and area selections, but this is configurable.
 *
 * @class Oskari.userinterface.component.VisualizationForm
 */
Oskari.clazz.define(
    'Oskari.userinterface.component.VisualizationForm',
    /**
     * @static @method create called automatically on construction
     *
     * @param {Object} options
     *
     */
    function (options) {
        this._clazzPrefix = 'Oskari.userinterface.component.visualization-form.';
        this._clazzSuffix = 'Form';
        this._iconClsPrefix = 'icon-';
        this._defaultLocKey = 'VisualizationForm';
        this._loc = this._getLocalization('DivManazer');
        this.lineCapMap = ['butt', 'round'];
        this.lineCornerMap = ['mitre', 'round', 'bevel'];
        this.lineStyleMap = ['', '5 2', 'D'];
        this.dialog = null;

        var defaultOptions = {
            // include all forms by default
            forms: ['dot', 'line', 'area'],
            formValues: {
                dot: {
                    shape: 1,
                    color: '000000',
                    size: 3
                },
                line: {
                    style: 0,
                    cap: 0,
                    corner: 0,
                    width: 1,
                    color: '3233ff'
                },
                area: {
                    line: {
                        width: 1,
                        corner: 0,
                        style: 0,
                        color: '000000'
                    },
                    fill: {
                        style: -1,
                        color: 'ffde00'
                    }
                }
            }
        };
        options = options || {};
        this._options = jQuery.extend({}, defaultOptions, options);

        if (this._options.saveCallback) {
            this.saveCallback = this._options.saveCallback;
        }

        this._formClazzes = this._createFormClazzes(
            this._options.forms,
            this._options.formValues
        );

        this.template = jQuery(
            '<div id="visualization-form"></div>'
        );
        this.templateRenderButton = jQuery(
            '<div class="renderButton"></div>'
        );
    }, {

        /**
         * @public @method getForm
         * Creates dom elements for each forms and binds click events to them
         * for showing the actual forms to change visualization. Returns the created form.
         *
         *
         * @return {jQuery}
         */
        getForm: function () {
            var me = this,
                form = this.template.clone(),
                formClazzes = this._getFormClazz(),
                btnContainer,
                formName;

            for (formName in formClazzes) {
                if (formClazzes.hasOwnProperty(formName)) {
                    btnContainer = this.templateRenderButton.clone();
                    btnContainer.attr('title', this._loc.tooltips[formName]);
                    btnContainer.addClass(
                        this._iconClsPrefix +
                        (formName === 'dot' ? 'point' : formName)
                    );
                    btnContainer.click(
                        me._bindRenderButton(formClazzes[formName])
                    );
                    form.append(btnContainer);
                }
            }

            return form;
        },

        /**
         * @public @method getValues
         * Returns the values of each form clazz.
         *
         *
         * @return {Object}
         */
        getValues: function () {
            var values = {},
                formClazzes = this._getFormClazz(),
                fClazzName,
                fClazz;

            for (fClazzName in formClazzes) {
                if (formClazzes.hasOwnProperty(fClazzName)) {
                    fClazz = formClazzes[fClazzName];
                    values[fClazzName] = fClazz.getValues();
                }
            }

            return values;
        },

        /**
         * @public @method setValues
         * Sets the values of the form clazzes.
         *
         * @param {Object} values
         *
         */
        setValues: function (values) {
            if (values === null || values === undefined || typeof values !== 'object') {
                return;
            }

            var formClazzes = this._getFormClazz(),
                fClazzName,
                fClazz;

            for (fClazzName in formClazzes) {
                if (formClazzes.hasOwnProperty(fClazzName)) {
                    fClazz = formClazzes[fClazzName];
                    fClazz.setValues(values[fClazzName]);
                }
            }
        },

        /**
         * @private @method _bindRenderButton
         * Binds a function to show the form of a given form clazz.
         * Form is hidden if it's already visible.
         *
         * @param  {Oskari.clazz} formClazz
         *
         * @return {Function}
         */
        _bindRenderButton: function (formClazz) {
            var me = this;

            return function (e) {
                if (formClazz && formClazz.showForm && typeof formClazz.showForm === 'function') {
                    if (me.dialog) {
                        me.dialog.close(true);
                    }

                    if (formClazz === me.dialogFormClazz) {
                        delete me.dialogFormClazz;
                    }

                    me.dialog = formClazz.showForm(e.target);
                    me.dialogFormClazz = formClazz;
                }
            };
        },

        /**
         * @private @method _getFormClazz
         * Returns the form clazz for given parameter name
         * or an object of form clazzes given in the options
         * (defaults to all, that is, 'dot', 'line' and 'area')
         * or undefined if given a key which is not found.
         *
         * @param  {String} formName 'dot', 'line' or 'area'
         *
         * @return {Oskari.clazz/Object[Oskari.clazz]/undefined}
         */
        _getFormClazz: function (formName) {
            var ret;

            if (formName !== null && formName !== undefined) {
                ret = this._formClazzes[formName];
            } else {
                ret = this._formClazzes;
            }
            return ret;
        },

        /**
         * @private @method _getLocalization
         * Returns the localization object for the given key.
         *
         * @param  {String} locKey
         *
         * @return {Object/null}
         */
        _getLocalization: function (locKey) {
            var locale = Oskari.getLocalization(locKey),
                ret = null;

            if (locale) {
                ret = locale[this._defaultLocKey];
            }
            return ret;
        },

        /**
         * @private @method _createFormClazzes
         * Creates form clazzes for given form names and values.
         *
         * @param  {Array[String]} formNames
         * @param  {Object} formValues
         *
         * @return {Object}
         */
        _createFormClazzes: function (formNames, formValues) {
            var i,
                fLen = (formNames ? formNames.length : 0),
                fClazzes = {},
                fName,
                fValues,
                fClazz;

            for (i = 0; i < fLen; i += 1) {
                fName = formNames[i];
                fValues = formValues[fName];
                fClazz = this._createFormClazz(fName, fValues);
                fClazzes[fName] = fClazz;
                if (this.saveCallback) {
                    fClazz.setSaveHandler(this.saveCallback);
                }
            }

            return fClazzes;
        },

        /**
         * @private @method _createFormClazz
         * Creates a form clazz for a given form name and values.
         * Uses this clazz as the 'creator' and localization for
         * key like 'dot' which should be present in the loc object.
         *
         * @param  {String} formName 'dot', 'line' or 'area'
         *
         * @return {Oskari.clazz/undefined}
         */
        _createFormClazz: function (formName, formValues) {
            var clazz = this._capitalize(formName),
                clazzName = this._clazzPrefix + clazz + this._clazzSuffix,
                loc = this._loc[formName];

            return Oskari.clazz.create(clazzName, this, loc, formValues);
        },

        /**
         * @private @method _capitalize
         * Returns capitalized string.
         *
         * @param  {String} str
         *
         * @return {String}
         */
        _capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    });
