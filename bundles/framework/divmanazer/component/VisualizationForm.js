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
        this.lineStyleMap = ['', '5 2'];
        this._oskariLineStyleMap = ['solid', 'dash'];
        this.dialog = null;

        var defaultOptions = {
            validateValues: true,
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

        this.templateNameContainer = jQuery(
            '<div class="nameContainer"></div>'
        );

        this.templateRenderButton = jQuery(
            '<div class="renderButton"></div>'
        );
    }, {
        validateWidth: function (key, width) {
            if (!this._options.validateValues) {
                return true;
            }
            const isValid = Oskari.util.isNumberBetween(width, 1, 50);
            if (!isValid) {
                this.showMessage(this._loc.validation.title, this._loc.validation[key]);
            }
            return isValid;
        },
        showMessage: function (title, message) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = dialog.createCloseButton();
            okBtn.setPrimary(true, true);
            dialog.fadeout();
            dialog.show(title, message, [okBtn]);
        },
        /**
         * @public @method getForm
         * Creates dom elements for each forms and binds click events to them
         * for showing the actual forms to change visualization. Returns the created form.
         *
         *
         * @return {jQuery}
         */
        getForm: function () {
            const me = this;
            const form = this.template.clone();
            const formClazzes = this._getFormClazz();
            var btnContainer;
            var formName;

            if (me._options.hasOwnProperty('name')) {
                const styleNameHeader = jQuery(
                    '<div class="subheader">' + me._loc.subheaders.name + '</div>'
                );
                form.append(styleNameHeader);

                const nameInput = Oskari.clazz.create('Oskari.userinterface.component.TextInput', 'styleNameInput');
                nameInput.setValue(me._options.name);

                const nameContainer = this.templateNameContainer.clone();
                nameInput.insertTo(nameContainer);
                form.append(nameContainer);
            }
            const styleHeader = jQuery(
                '<div class="subheader">' + me._loc.subheaders.style + '</div>'
            );
            form.append(styleHeader);

            for (formName in formClazzes) {
                if (formClazzes.hasOwnProperty(formName)) {
                    btnContainer = this.templateRenderButton.clone();
                    btnContainer.attr('title', this._loc.tooltips[formName]);
                    btnContainer.addClass(
                        this._iconClsPrefix +
                        (formName === 'dot' ? 'point' : formName)
                    );
                    btnContainer.on('click',
                        me._bindRenderButton(formClazzes[formName])
                    );
                    form.append(btnContainer);
                }
            }

            return form;
        },

        /**
         * @public @method getValues
         * Returns the values of each form clazz and optional name of style
         *
         *
         * @return {Object}
         */
        getValues: function () {
            const values = {};
            const formClazzes = this._getFormClazz();

            for (let fClazzName in formClazzes) {
                if (formClazzes.hasOwnProperty(fClazzName)) {
                    let fClazz = formClazzes[fClazzName];
                    values[fClazzName] = fClazz.getValues();
                }
            }
            const styleNameInputValue = jQuery('#visualization-form').find('input[name="styleNameInput"]').val();
            if (styleNameInputValue && styleNameInputValue.length > 0) {
                values.name = styleNameInputValue;
            }
            return values;
        },

        /**
         * @public @method getOskariStyle
         * Returns Oskari JSON style
         *
         * @return {Object}
         */
        getOskariStyle: function () {
            const values = this.getValues();
            var oskariStyle = {
                fill: {
                    color: values.area.fillColor,
                    area: {
                        pattern: values.area.fillStyle
                    }
                },
                stroke: {
                    color: values.line.color,
                    width: values.line.width,
                    lineDash: this._oskariLineStyleMap[this.lineStyleMap.indexOf(values.line.style)],
                    lineCap: values.line.cap,
                    lineJoin: values.line.corner,
                    area: {
                        color: values.area.lineColor,
                        width: values.area.lineWidth,
                        lineDash: this._oskariLineStyleMap[this.lineStyleMap.indexOf(values.area.lineStyle)],
                        lineJoin: values.area.lineCorner
                    }
                },
                text: {
                    labelText: values.dot.message
                },
                image: {
                    fill: {
                        color: values.dot.color
                    },
                    shape: values.dot.shape,
                    size: values.dot.size
                }
            };
            return oskariStyle;
        },

        /**
         * @public @method setOskariStyleValues
         * Sets values using Oskari style defined JSON
         *
         * @param {Object} featureStyle
         */
        setOskariStyleValues: function (featureStyle) {
            if (featureStyle === null || featureStyle === undefined) {
                return;
            }
            var formClazzes = this._getFormClazz();
            var fClazzName;
            var fClazz;
            for (fClazzName in formClazzes) {
                if (formClazzes.hasOwnProperty(fClazzName)) {
                    fClazz = formClazzes[fClazzName];
                    switch (fClazzName) {
                    case 'dot':
                        fClazz.setValues({
                            color: featureStyle.image.fill.color,
                            shape: featureStyle.image.shape,
                            size: featureStyle.image.size
                        });
                        break;
                    case 'line':
                        fClazz.setValues({
                            color: featureStyle.stroke.color,
                            width: featureStyle.stroke.width,
                            cap: featureStyle.stroke.lineCap,
                            corner: featureStyle.stroke.lineJoin,
                            style: this.lineStyleMap[this._oskariLineStyleMap.indexOf(featureStyle.stroke.lineDash)]
                        });
                        break;
                    case 'area':
                        fClazz.setValues({
                            fillColor: (typeof featureStyle.fill.color === 'string' ? featureStyle.fill.color : null),
                            fillStyle: featureStyle.fill.area.pattern,
                            lineColor: (typeof featureStyle.stroke.area.color === 'string' ? featureStyle.stroke.area.color : null),
                            lineCorner: featureStyle.stroke.area.lineJoin,
                            lineStyle: this.lineStyleMap[this._oskariLineStyleMap.indexOf(featureStyle.stroke.area.lineDash)],
                            lineWidth: featureStyle.stroke.area.width
                        });
                        break;
                    }
                }
            }
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
