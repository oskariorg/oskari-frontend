/**
 * @class Oskari.userinterface.component.visualization-form.LineForm
 *
 * Shows a form for line rendering options
 */
Oskari.clazz.define(
    'Oskari.userinterface.component.visualization-form.LineForm',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (creator, loc, defaultValues) {
        this.creator = creator;
        this.loc = loc;
        this.defaultValues = defaultValues;

        this.values = {
            style: this.defaultValues.style,
            cap: this.defaultValues.cap,
            corner: this.defaultValues.corner,
            width: this.defaultValues.width,
            color: '#' + this.defaultValues.color
        };

        this.styleButtonNames = ['icon-line-basic', 'icon-line-dashed', 'icon-double-line'];
        this.capButtonNames = ['icon-line-flat_cap', 'icon-line-round_cap'];
        this.cornerButtonNames = ['icon-corner-sharp', 'icon-corner-round'];

        this.basicColors = ['#ffffff', '#666666', '#ffde00', '#f8931f', '#ff3334', '#bf2652',
            '#000000', '#cccccc', '#652d90', '#3233ff', '#26bf4b', '#00ff01'
        ];
        this.paper = null;
        this.activeColorCell = -1;
        // Default color
        var i;
        for (i = 0; i < this.basicColors.length; i += 1) {
            if (this.basicColors[i] === '#' + this.values.color) {
                this.activeColorCell = i;
                break;
            }
        }

        this.templateLineStyleDialogContent = jQuery('<div class="lineform">' +
            '<div class="container clearfix">' +
            '<div class="column1">' +
            '<label>' + this.loc.style.label + '</label>' +
            '<div class="style icon-buttons"></div>' +
            '<label>' + this.loc.cap.label + '</label>' +
            '<div class="cap icon-buttons"></div>' +
            '<label>' + this.loc.corner.label + '</label>' +
            '<div class="corner icon-buttons"></div>' +
            '<label>' + this.loc.width.label + '</label><br>' +
            '<div class="width"></div>' +
            '</div>' +
            '<div class="column2">' +
            '<div class="column21">' +
            '<label>' + this.loc.color.label + '</label>' +
            '<div class="color-picker-wrapper"></div>' +
            '</div>' +
            '<div class="column22">' +
            '<label>' + this.loc.preview.label + '</label>' +
            '<div class="preview"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');
        this.templateButton = jQuery('<div class="icon-button"></div>');
        this.templateColorCell = jQuery('<div class="color-cell"></div>');
        this.templateCustomColor = jQuery('<div class="custom-color-editor">' +
            '<div class="colorcontainer">' +
            '<div class="colorcolumn1"></div>' +
            '<div class="colorcolumn2">' +
            '<div class="colorcolumn21"></div>' +
            '<div class="colorcolumn22"></div>' +
            '</div>' +
            '</div>');
        this.templateColorSource = jQuery('<input type="checkbox" name="colorInput" value = "custom" class="color-source" id="color-line-custom-rgb">');
        this.templateColorValue = jQuery('<label class="color-label"></label><br><input type="text" name="color-input" value="0" disabled="disabled" class="custom-color">');
        this.minWidth = 1;
        this.maxWidth = 10;
        this.templateWidthValue = jQuery('<input type="number" name="width" class="linewidth" min="' + this.minWidth + '" max="' + this.maxWidth + '" step=1 value="' + this.values.width + '">');
        this.previewSize = 50;
        this.selectColor = '#dddddd';

        this._previewSize = 50;
        this._previewTemplates = [
            jQuery('<svg viewBox="0 0 50 50" width="50" height="50" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000000" d="M10,15L20,35L40,25" stroke-width="1" stroke-linejoin="miter" stroke-linecap="butt" stroke-dasharray="0"></path></svg>'),
            jQuery('<svg viewBox="0 0 50 50" width="50" height="50" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000000" d="M10,15L20,35L40,25" stroke-width="1" stroke-linejoin="miter" stroke-linecap="butt" stroke-dasharray="4,3"></path></svg>'),
            jQuery('<svg viewBox="0 0 50 50" width="50" height="50" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000000" d="M11.788854381999831,14.105572809000083L20.73205080756888,32.267949192431125L39.10557280900009,23.211145618000167M8.211145618000169,15.894427190999917L19.26794919243112,37.732050807568875L40.89442719099991,26.788854381999833" stroke-width="1" stroke-linejoin="miter" stroke-linecap="butt" stroke-dasharray="0"></path></svg>')
        ];
    }, {
        /**
         * Returns the values.
         *
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            var cap = this.values.cap,
                corner = this.values.corner,
                style = this.values.style;

            if (typeof cap === 'number') {
                cap = this.creator.lineCapMap[cap];
            }

            if (typeof corner === 'number') {
                corner = this.creator.lineCornerMap[corner];
            }

            if (typeof style === 'number') {
                style = this.creator.lineStyleMap[style];
            }

            return {
                width: this.values.width,
                color: this.values.color,
                cap: cap,
                corner: corner,
                style: style
            };
        },
        /**
         * @method setValues
         * @param {Object} values
         */
        setValues: function (values) {
            var i;

            if (values !== null && values !== undefined) {
                // transform strings into array indices
                for (i = 0; i < this.creator.lineCapMap.length; i += 1) {
                    if (values.cap === this.creator.lineCapMap[i]) {
                        values.cap = i;
                    }
                }
                for (i = 0; i < this.creator.lineCornerMap.length; i += 1) {
                    if (values.corner === this.creator.lineCornerMap[i]) {
                        values.corner = i;
                    }
                }
                for (i = 0; i < this.creator.lineStyleMap.length; i += 1) {
                    if (values.style === this.creator.lineStyleMap[i]) {
                        values.style = i;
                    }
                }
                jQuery.extend(true, this.values, values);
            }
        },
        /**
         * @method showForm
         * @param {Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory[]} categories array containing available categories
         * @return {jQuery} jquery reference for the form
         */
        showForm: function (renderButton, state) {
            var me = this,
                tempValues = jQuery.extend(true, {}, me.values);
            if (state !== null && state !== undefined) {
                jQuery.extend(true, me.values, state.line);
            }

            var renderDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

            renderDialog.addClass('renderdialog');
            renderDialog.addClass('linevisualization');
            var title = me.loc.title;

            // Line style
            var dialogContent = me.templateLineStyleDialogContent.clone(),
                content = dialogContent.find('div.style'),
                i,
                cornerBtnContainer,
                styleBtnContainer,
                capBtnContainer,
                newValue;
            if (me.values.style.length === 0) {
                me.values.style = 0;
            }
            for (i = 0; i < me.styleButtonNames.length; i += 1) {
                styleBtnContainer = me.templateButton.clone();
                styleBtnContainer.addClass(me.styleButtonNames[i]);
                styleBtnContainer.attr('id', i + 'linestyle');
                if (i === me.values.style) {
                    this._styleSelectedButton(styleBtnContainer);
                }
                // FIXME create function outside loop
                styleBtnContainer.on('click', function () {
                    newValue = parseInt(jQuery(this).attr('id').charAt(0), 10);
                    me._selectButton('style', newValue);
                    me.values.style = newValue;
                    me._updatePreview(dialogContent);
                });
                content.append(styleBtnContainer);
            }

            // Line cap
            content = dialogContent.find('div.cap');
            for (i = 0; i < me.capButtonNames.length; i += 1) {
                capBtnContainer = me.templateButton.clone();
                capBtnContainer.addClass(me.capButtonNames[i]);
                capBtnContainer.attr('id', i + 'linecap');
                if (i === me.values.cap) {
                    this._styleSelectedButton(capBtnContainer);
                }
                // FIXME create function outside loop
                capBtnContainer.on('click', function () {
                    newValue = parseInt(jQuery(this).attr('id').charAt(0), 10);
                    me._selectButton('cap', newValue);
                    me.values.cap = newValue;
                    me._updatePreview(dialogContent);
                });
                content.append(capBtnContainer);
            }

            // Line corner
            content = dialogContent.find('div.corner');
            for (i = 0; i < me.cornerButtonNames.length; i += 1) {
                cornerBtnContainer = me.templateButton.clone();
                cornerBtnContainer.addClass(me.cornerButtonNames[i]);
                cornerBtnContainer.attr('id', i + 'linecorner');
                if (i === me.values.corner) {
                    this._styleSelectedButton(cornerBtnContainer);
                }
                // FIXME create function outside loop
                cornerBtnContainer.on('click', function () {
                    newValue = parseInt(jQuery(this).attr('id').charAt(0), 10);
                    me._selectButton('corner', newValue);
                    me.values.corner = newValue;
                    me._updatePreview(dialogContent);
                });
                content.append(cornerBtnContainer);
            }

            // Line width
            content = dialogContent.find('div.width');
            var widthSpinner = me.templateWidthValue.clone();
            widthSpinner.on('change', function () {
                var newValue = parseInt(widthSpinner.val(), 10);
                if (!isNaN(newValue)) {
                    me.values.width = newValue;
                    me._updatePreview();
                }
            });
            widthSpinner.val(me.values.width !== null && me.values.width !== undefined ? me.values.width : 1);
            content.append(widthSpinner);

            // Create color picker element
            me._createColorPicker();
            var colorPickerWrapper = dialogContent.find('.color-picker-wrapper');
            colorPickerWrapper.append(me._colorPicker.getElement());
            me._colorPicker.setValue(me.values.color);

            colorPickerWrapper.on('change', function () {
                me.values.color = me._colorPicker.getValue();
                me._updatePreview(dialogContent);
            });

            this._updatePreview(dialogContent);

            var saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveBtn.setTitle(me.loc.buttons.save);
            saveBtn.addClass('primary showSelection');
            saveBtn.setHandler(function () {
                renderDialog.close();
                if (me.saveCallback) {
                    me.saveCallback();
                }
            });

            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(me.loc.buttons.cancel);
            cancelBtn.setHandler(function () {
                me.values.cap = tempValues.cap;
                me.values.color = tempValues.color;
                me.values.corner = tempValues.corner;
                me.values.style = tempValues.style;
                me.values.width = tempValues.width;
                renderDialog.close();
            });
            renderDialog.show(title, dialogContent, [saveBtn, cancelBtn]);
            renderDialog.moveTo(renderButton, 'top');

            me._updatePreview();
            saveBtn.focus();
            me._colorPicker.reflow();
            return renderDialog;
        },
        setSaveHandler: function (param) {
            this.saveCallback = param;
        },

        /**
         * @method _selectButton
         * Selects the chosen button
         * @param {String} property Name of the edited property
         * @param {int} selectedButton Number of the selected button
         * @private
         */
        _selectButton: function (property, selectedButton) {
            this._styleUnselectedButton(jQuery('div#' + this.values[property] + 'line' + property + '.icon-button'));
            this._styleSelectedButton(jQuery('div#' + selectedButton + 'line' + property + '.icon-button'));
        },

        /**
         * @method createColorPicker
         * Creates a color picker component
         */
        _createColorPicker: function () {
            var options = {flat: true};
            this._colorPicker = Oskari.clazz.create('Oskari.userinterface.component.ColorPickerInput', options);
        },

        _updatePreview: function (dialog) {
            var me = this,
                view = dialog === undefined || dialog === null ? jQuery('.lineform') : dialog,
                preview = view.find('.preview');
            if (preview.length === 0) {
                return;
            }

            var previewTemplate = me._previewTemplates[me.values.style].clone();

            previewTemplate.find('path').attr({
                'stroke': me.values.color,
                'fill': 'none',
                'stroke-width': me.values.width,
                'stroke-linejoin': me.values.corner === 0 ? 'miter' : 'round',
                'stroke-linecap': me.values.cap === 0 ? 'butt' : 'round'
            });

            preview.empty();

            // Calculate double line
            if (me.values.style === 2) {
                var p1 = [10, 15];
                var p2 = [20, 35];
                var p3 = [40, 25];
                var d = 1.5 + 0.5 * me.values.width;
                var p1a = [p1[0] + 2 * d / Math.sqrt(5), p1[1] - d / Math.sqrt(5)];
                var p1b = [p1[0] - 2 * d / Math.sqrt(5), p1[1] + d / Math.sqrt(5)];

                var p2a = [];
                p2a[0] = p2[0] + 0.5 * d * (Math.sqrt(3) - 1);
                p2a[1] = p2[1] - 0.5 * d * (Math.sqrt(3) + 1);

                var p2b = [];
                p2b[0] = p2[0] - 0.5 * d * (Math.sqrt(3) - 1);
                p2b[1] = p2[1] + 0.5 * d * (Math.sqrt(3) + 1);

                var p3a = [p3[0] - d / Math.sqrt(5), p3[1] - 2 * d / Math.sqrt(5)];
                var p3b = [p3[0] + d / Math.sqrt(5), p3[1] + 2 * d / Math.sqrt(5)];
                previewTemplate.find('path').attr('d', 'M' + p1a[0] + ',' + p1a[1] + 'L' + p2a + ',' + p3a + 'M' + p1b[0] + ',' + p1b[1] + 'L' + p2b + ',' + p3b);
            }
            preview.append(previewTemplate);

            // Refresh svg to show correctly
            preview.html(preview.html());
        },

        /**
         * @method _getOnScreenForm
         * Returns reference to the on screen version shown by OpenLayers
         * @private
         */
        _getOnScreenForm: function () {
            return jQuery('div.renderdialog');
        },

        /**
         * @method _styleSelectedButton
         * Styles the selected button
         * @param {Object} selectedButton Selected button
         */
        _styleSelectedButton: function (selectedButton) {
            selectedButton.css('border', '2px solid');
            selectedButton.css('background-color', this.selectColor);
        },

        /**
         * @method _styleUnselectedButton
         * Styles the unselected button
         * @param {Object} unselectedButton Unselected button
         */
        _styleUnselectedButton: function (unselectedButton) {
            unselectedButton.css('border', '1px solid');
            unselectedButton.css('background-color', 'transparent');
        }
    }
);
