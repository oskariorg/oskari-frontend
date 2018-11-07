/**
 * @class Oskari.userinterface.component.visualization-form.AreaForm
 *
 * Shows a form for area rendering options
 */
Oskari.clazz.define(
    'Oskari.userinterface.component.visualization-form.AreaForm',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (creator, loc, defaultValues, parent) {
        this.creator = creator;
        this.loc = loc;
        this.defaultValues = defaultValues;
        this.instance = parent;

        this.values = {
            lineWidth: this.defaultValues.line.width,
            lineCorner: this.defaultValues.line.corner,
            lineStyle: this.defaultValues.line.style,
            lineColor: '#' + this.defaultValues.line.color,
            fillColor: '#' + this.defaultValues.fill.color,
            fillStyle: this.defaultValues.fill.style
        };

        this.styleButtonNames = [
            'icon-line-basic',
            'icon-line-dashed',
            'icon-double-line'
        ];
        this.cornerButtonNames = [
            'icon-corner-sharp',
            'icon-corner-round'
        ];

        this.colorTypes = [
            'line',
            'fill'
        ];
        this.basicColors = [
            '#ffffff',
            '#666666',
            '#ffde00',
            '#f8931f',
            '#ff3334',
            '#bf2652',
            '#000000',
            '#cccccc',
            '#652d90',
            '#3233ff',
            '#26bf4b',
            '#00ff01'
        ];
        this.paper = null;
        this.activeColorCell = [-1, -1];
        // Default color
        var i,
            j;
        for (i = 0; i < this.basicColors.length; i += 1) {
            for (j = 0; j < this.basicColors.length; j += 1) {
                if (this.basicColors[j] === '#' + this.values.fillColor[i]) {
                    this.activeColorCell[i] = j;
                    break;
                }
            }
        }

        this.fillButtonNames = [
            'icon-line-thin-diagonal',
            'icon-line-wide-diagonal',
            'icon-line-thin-horizontal',
            'icon-line-wide-horizontal',
            'areaform-fill-transparent',
            'areaform-fill-solid'
        ];

        this.templateAreaStyleDialogContent = jQuery('<div class="areaform">' +
            '<div class="container clearfix">' +
            '<div class="column1">' +
            '<label>' + this.loc.linecolor.label + '</label>' +
            '<div class="color-picker-area-line-wrapper"></div>' +
            '<label>' + this.loc.linestyle.label + '</label>' +
            '<div class="style icon-buttons"></div>' +
            '<label>' + this.loc.linecorner.label + '</label>' +
            '<div class="corner icon-buttons"></div>' +
            '<label>' + this.loc.linewidth.label + '</label><br>' +
            '<div class="width"></div>' +
            '</div>' +
            '<div class="column2">' +
            '<div class="column21">' +
            '<label>' + this.loc.color.label + '</label>' +
            '<div class="color-picker-area-fill-wrapper"></div>' +
            '<label>' + this.loc.fill.label + '</label>' +
            '<div class="fill icon-buttons"></div>' +
            '</div>' +
            '<div class="column22">' +
            '<label>' + this.loc.preview.label + '</label>' +
            '<div class="areaform-preview"></div>' +
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
        this.templateColorSource = jQuery('<input type="checkbox" name="colorInput" value = "custom" class="color-source">');
        this.templateColorValue = jQuery('<label class="color-label"></label><br><input type="text" name="color-input" value="0" disabled="disabled" class="custom-color">');
        this.minWidth = 1;
        this.maxWidth = 5;
        this.templateWidthValue = jQuery('<input type="number" name="width" class="linewidth" min="' + this.minWidth + '" max="' + this.maxWidth + '" step=1 value="' + this.values.lineWidth + '">');
        this.previewSize = 80;
        this.selectColor = '#dddddd';

        this._previewSize = 80;
        this._previewTemplates = [
            jQuery('<svg viewBox="0 0 50 50" width="80" height="80" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" stroke="#000000" d="M10,17L40,12L29,40Z" stroke-width="1" stroke-linejoin="miter" stroke-linecap="butt" stroke-dasharray="0"></path></svg>'),
            jQuery('<svg viewBox="0 0 50 50" width="80" height="80" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" stroke="#000000" d="M10,17L40,12L29,40Z" stroke-width="1" stroke-linejoin="miter" stroke-linecap="butt" stroke-dasharray="4,3"></path></svg>'),
            jQuery('<svg viewBox="0 0 50 50" width="80" height="80" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" stroke="#000000" d="M10,17L40,12L29,40Z" stroke-width="1" stroke-linejoin="miter" stroke-linecap="butt" stroke-dasharray="0"></path><path style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-linejoin: miter; stroke-linecap: butt;" fill="#ffde00" stroke="#000000" d="M15.618650138979566,19.104939575319182L35.30776005884479,15.739369510308894L28.003552181094584,34.08332088547988Z" stroke-width="1" stroke-linejoin="miter" stroke-linecap="butt" stroke-dasharray="0"></path></svg>')
        ];
    }, {
        /**
         * Returns the values.
         *
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            var lineCorner = this.values.lineCorner,
                lineStyle = this.values.lineStyle;

            if (typeof lineCorner === 'number') {
                lineCorner = this.creator.lineCornerMap[lineCorner];
            }

            if (typeof lineStyle === 'number') {
                lineStyle = this.creator.lineStyleMap[lineStyle];
            }

            return {
                lineWidth: this.values.lineWidth,
                lineCorner: lineCorner,
                lineStyle: lineStyle,
                lineColor: this.values.lineColor,
                fillColor: this.values.fillColor,
                fillStyle: this.values.fillStyle
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
                for (i = 0; i < this.creator.lineCornerMap.length; i += 1) {
                    if (values.lineCorner === this.creator.lineCornerMap[i]) {
                        values.lineCorner = i;
                    }
                }
                for (i = 0; i < this.creator.lineStyleMap.length; i += 1) {
                    if (values.lineStyle === this.creator.lineStyleMap[i]) {
                        values.lineStyle = i;
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
                jQuery.extend(true, me.values, state.area);
            }

            var renderDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

            renderDialog.addClass('renderdialog');
            renderDialog.addClass('areavisualization');
            var title = me.loc.title;

            // Line style
            var dialogContent = me.templateAreaStyleDialogContent.clone();
            var content = dialogContent.find('div.style'),
                i,
                styleBtnContainer,
                newValue,
                cornerBtnContainer;
            if (me.values.lineStyle.length === 0) {
                me.values.lineStyle = 0;
            }
            for (i = 0; i < me.styleButtonNames.length; i += 1) {
                styleBtnContainer = me.templateButton.clone();
                styleBtnContainer.addClass(me.styleButtonNames[i]);
                styleBtnContainer.attr('id', i + 'linestyle');
                if (i === me.values.lineStyle) {
                    this._styleSelectedButton(styleBtnContainer);
                }
                // FIXME create function outside loop
                styleBtnContainer.on('click', function () {
                    newValue = parseInt(jQuery(this).attr('id').charAt(0), 10);
                    me._selectButton('lineStyle', newValue);
                    me.values.lineStyle = newValue;
                    me._updatePreview(dialogContent);
                });
                content.append(styleBtnContainer);
            }

            // Line corner
            content = dialogContent.find('div.corner');
            for (i = 0; i < me.cornerButtonNames.length; i += 1) {
                cornerBtnContainer = me.templateButton.clone();
                cornerBtnContainer.addClass(me.cornerButtonNames[i]);
                cornerBtnContainer.attr('id', i + 'linecorner');
                if (i === me.values.lineCorner) {
                    this._styleSelectedButton(cornerBtnContainer);
                }
                // FIXME create function outside loop
                cornerBtnContainer.on('click', function () {
                    newValue = parseInt(jQuery(this).attr('id').charAt(0), 10);
                    me._selectButton('lineCorner', newValue);
                    me.values.lineCorner = newValue;
                    me._updatePreview(dialogContent);
                });
                content.append(cornerBtnContainer);
            }

            // Line width
            content = dialogContent.find('div.width');
            var widthSpinner = me.templateWidthValue.clone();
            widthSpinner.val(me.values.lineWidth !== null && me.values.lineWidth !== undefined ? me.values.lineWidth : 1);
            widthSpinner.on('change', function () {
                var newValue = parseInt(widthSpinner.val(), 10);
                if (!isNaN(newValue)) {
                    me.values.lineWidth = newValue;
                    me._updatePreview();
                }
            });
            content.append(widthSpinner);
            // Create color pickers
            me._createColorPickers();
            var colorPickerLineWrapper = dialogContent.find('.color-picker-area-line-wrapper');
            var colorPickerFillWrapper = dialogContent.find('.color-picker-area-fill-wrapper');

            colorPickerLineWrapper.append(me._colorPickers[0].getElement());
            colorPickerFillWrapper.append(me._colorPickers[1].getElement());
            me._colorPickers[0].setValue(me.values['lineColor']);
            me._colorPickers[1].setValue(me.values['fillColor']);

            colorPickerLineWrapper.on('change', function () {
                me.values['lineColor'] = me._colorPickers[0].getValue();
                me._updatePreview(dialogContent);
            });

            colorPickerFillWrapper.on('change', function () {
                me.values['fillColor'] = me._colorPickers[1].getValue();
                if (me.values.fillStyle === 4) {
                    // Color has been selected but fill style is transparent
                    // Change fill style to solid color
                    me.values.fillStyle = 5;
                    me._styleUnselectedButton(jQuery('div#4fillstyle.icon-button'));
                    me._styleSelectedButton(jQuery('div#5fillstyle.icon-button'));
                }
                me._updatePreview(dialogContent);
            });

            // Fill style
            content = dialogContent.find('div.fill.icon-buttons');
            for (i = 0; i < me.fillButtonNames.length; i += 1) {
                var fillBtnContainer = me.templateButton.clone();
                fillBtnContainer.addClass(me.fillButtonNames[i]);
                fillBtnContainer.attr('id', i + 'fillstyle');
                if (i == me.values.fillStyle) {
                    this._styleSelectedButton(fillBtnContainer);
                }
                fillBtnContainer.on('click', function () {
                    var newValue = parseInt(jQuery(this).attr('id').charAt(0), 10);
                    if (me.values.fillStyle === newValue) {
                        me.values.fillStyle = -1;
                        me._styleUnselectedButton(jQuery('div#' + newValue + 'fillstyle.icon-button'));
                    } else {
                        if (me.values.fillStyle !== -1) {
                            me._styleUnselectedButton(jQuery('div#' + me.values.fillStyle + 'fillstyle.icon-button'));
                        }
                        me._styleSelectedButton(jQuery('div#' + newValue + 'fillstyle.icon-button'));
                        me.values.fillStyle = newValue;
                        // Set color picker and fill color value to empty/null when transparent is selected
                        if (newValue === 4) {
                            me._colorPickers[1].setValue('');
                            me.values.fillColor = null;
                        }
                    }
                    me._updatePreview(dialogContent);
                });
                content.append(fillBtnContainer);
            }

            if (me.values.fillStyle === -1) {
                // Transparent or solid color is chosen
                if (me.values.fillColor != null) {
                    // Fill color exist, use solid color as style
                    me.values.fillStyle = 5;
                    me._styleSelectedButton(content.find('div#5fillstyle.icon-button'));
                } else {
                    // No fill color, style must be transparent
                    me.values.fillStyle = 4;
                    me._styleSelectedButton(content.find('div#4fillstyle.icon-button'));
                }
            }

            this._updatePreview(dialogContent);

            var saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveBtn.setTitle(me.loc.buttons.save);
            saveBtn.addClass('primary showSelection');
            saveBtn.setHandler(function () {
                // Transparent and solid color fill styles are both saved as -1
                if (me.values.fillStyle === 4 || me.values.fillStyle === 5) {
                    me.values.fillStyle = -1;
                }
                renderDialog.close();
                if (me.saveCallback) {
                    me.saveCallback();
                }
            });

            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(me.loc.buttons.cancel);
            cancelBtn.setHandler(function () {
                me.values.lineWidth = tempValues.lineWidth;
                me.values.lineCorner = tempValues.lineCorner;
                me.values.lineStyle = tempValues.lineStyle;
                me.values.lineColor = tempValues.lineColor;
                me.values.fillColor = tempValues.fillColor;
                me.values.fillStyle = tempValues.fillStyle;
                renderDialog.close();
            });
            renderDialog.show(title, dialogContent, [saveBtn, cancelBtn]);
            renderDialog.moveTo(renderButton, 'top');
            saveBtn.focus();
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
            var propertyType = property.substring(4).toLowerCase();
            this._styleUnselectedButton(jQuery('div#' + this.values[property] + 'line' + propertyType + '.icon-button'));
            this._styleSelectedButton(jQuery('div#' + selectedButton + 'line' + propertyType + '.icon-button'));
        },

        _updatePreview: function (dialog) {
            var me = this;
            var view = dialog === undefined || dialog === null ? jQuery('.areaform') : dialog,
                preview = view.find('.areaform-preview');

            if (preview.length === 0) {
                return;
            }

            var previewTemplate = me._previewTemplates[me.values.lineStyle].clone();
            var fill = (parseInt(me.values.fillStyle, 10) < 0) ? me.values.fillColor : 'none';
            if (me.values.fillStyle >= 0 || me.values.fillColor === null) {
                fill = 'none';
            }

            var line = me.values.lineColor !== null ? me.values.lineColor : 'none';

            if (me.values.fillStyle === 5 && me.values.fillColor !== null) {
                // Solid fill style chosen, using current fill color
                fill = me.values.fillColor;
            }

            previewTemplate.find('path').attr({
                'fill': fill,
                'stroke': line,
                'stroke-width': me.values.lineWidth,
                'stroke-linejoin': me.values.lineCorner === 0 ? 'miter' : 'round',
                'stroke-linecap': 'butt'
            });

            preview.empty();
            // Patterns (IE8 compatible version)
            if (me.values.fillStyle >= 0 && me.values.fillStyle < 4) {
                // Fillstyle 4 = transparent and fillstyle 5 = solid (no need to create svg)
                var pathSvg = jQuery('<path></path>');
                switch (parseInt(me.values.fillStyle)) {
                case 0:
                    var p01a = [10.5, 17.5];
                    var p02a = [12.3, 19.7];
                    var p03a = [14.1, 21.9];
                    var p04a = [15.9, 24.1];
                    var p05a = [17.7, 26.3];
                    var p06a = [19.5, 28.5];
                    var p07a = [21.4, 30.6];
                    var p08a = [23.2, 32.8];
                    var p09a = [25.0, 35.0];
                    var p010a = [26.8, 37.2];
                    var p011a = [28.6, 39.4];

                    var p01b = [11.2, 16.8];
                    var p02b = [16, 16];
                    var p03b = [20.8, 15.2];
                    var p04b = [25.6, 14.4];
                    var p05b = [30.4, 13.6];
                    var p06b = [35.2, 12.8];
                    var p07b = [40.0, 12.0];
                    var p08b = [37.4, 18.6];
                    var p09b = [34.8, 25.2];
                    var p010b = [32.2, 31.8];
                    var p011b = [29.6, 38.4];

                    pathSvg.attr({
                        'd': 'M' + p01a + 'L' + p01b + 'M' + p02a + 'L' + p02b + 'M' + p03a + 'L' + p03b + 'M' + p04a + 'L' + p04b + 'M' + p05a + 'L' + p05b + 'M' + p06a + 'L' + p06b + 'M' + p07a + 'L' + p07b + 'M' + p08a + 'L' + p08b + 'M' + p09a + 'L' + p09b + 'M' + p010a + 'L' + p010b + 'M' + p011a + 'L' + p011b,
                        'stroke-width': 1,
                        'stroke': me.values.fillColor,
                        'fill': 'none'
                    });
                    break;
                case 1:
                    var p11a = [14.8, 16.2];
                    var p12a = [23.2, 14.8];
                    var p13a = [31.6, 13.4];
                    var p14a = [39.8, 12.2];
                    var p15a = [35.4, 23.6];
                    var p16a = [30.9, 35.1];

                    var p11b = [11.9, 19.1];
                    var p12b = [15.0, 23.0];
                    var p13b = [18.2, 26.8];
                    var p14b = [21.4, 30.6];
                    var p15b = [24.5, 34.5];
                    var p16b = [27.7, 38.3];

                    pathSvg.attr({
                        'd': 'M' + p11a + 'L' + p11b + 'M' + p12a + 'L' + p12b + 'M' + p13a + 'L' + p13b + 'M' + p14a + 'L' + p14b + 'M' + p15a + 'L' + p15b + 'M' + p16a + 'L' + p16b,
                        'stroke-width': 2,
                        'stroke': me.values.fillColor,
                        'fill': 'none'
                    });
                    break;
                case 2:
                    var p21a = [19, 15.5];
                    var p22a = [12.1, 19.5];
                    var p23a = [15.4, 23.5];
                    var p24a = [18.7, 27.5];
                    var p25a = [22.0, 31.5];
                    var p26a = [25.3, 35.5];
                    var p27a = [28.6, 39.5];

                    var p21b = [38.6, 15.5];
                    var p22b = [37.0, 19.5];
                    var p23b = [35.4, 23.5];
                    var p24b = [33.9, 27.5];
                    var p25b = [32.3, 31.5];
                    var p26b = [30.7, 35.5];
                    var p27b = [29.1, 39.5];

                    pathSvg.attr({
                        'd': 'M' + p21a + 'L' + p21b + 'M' + p22a + 'L' + p22b + 'M' + p23a + 'L' + p23b + 'M' + p24a + 'L' + p24b + 'M' + p25a + 'L' + p25b + 'M' + p26a + 'L' + p26b + 'M' + p27a + 'L' + p27b,
                        'stroke-width': 1,
                        'stroke': me.values.fillColor,
                        'fill': 'none'
                    });
                    break;
                case 3:
                    var p31a = [16.1, 16.0];
                    var p32a = [13.4, 21.0];
                    var p33a = [17.5, 26.0];
                    var p34a = [21.6, 31.0];
                    var p35a = [25.7, 36.0];

                    var p31b = [38.4, 16.0];
                    var p32b = [36.4, 21.0];
                    var p33b = [35.5, 26.0];
                    var p34b = [32.5, 31.0];
                    var p35b = [30.5, 36.0];

                    pathSvg.attr({
                        'd': 'M' + p31a + 'L' + p31b + 'M' + p32a + 'L' + p32b + 'M' + p33a + 'L' + p33b + 'M' + p34a + 'L' + p34b + 'M' + p35a + 'L' + p35b,
                        'stroke-width': 2,
                        'stroke': me.values.fillColor,
                        'fill': 'none'
                    });

                    break;
                }
                previewTemplate.prepend(pathSvg);
            }

            // checkerboard background for visualization of transparency
            previewTemplate.prepend('<defs><pattern id="checker" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect fill="#eee" x="0" width="10" height="10" y="0"/><rect fill="#eee" x="10" width="10" height="10" y="10"/></defs><rect x="0" y="0" width="50" height="50" fill="url(#checker)"/>');

            preview.append(previewTemplate);

            if (me.values.lineStyle === 2) {
                var p1 = [10, 17];
                var p2 = [40, 12];
                var p3 = [29, 40];
                // double line
                var d = 2 * (2.0 + parseInt(me.values.lineWidth, 10));

                var t1 = Math.atan(Math.abs((p2[1] - p1[1]) / (p2[0] - p1[0])));
                var p1a = [p1[0] + d * Math.sin(Math.PI / 3 + t1), p1[1] + d * Math.cos(Math.PI / 3 + t1)];

                var t2 = Math.atan(Math.abs((p3[1] - p2[1]) / (p3[0] - p2[0])));
                var p2a = [p2[0] - d * Math.sin(Math.PI / 3 + t2), p2[1] - d * Math.cos(Math.PI / 3 + t2)];

                var t3 = Math.atan(Math.abs((p1[1] - p3[1]) / (p1[0] - p3[0])));
                var p3a = [p3[0] - d * Math.cos(Math.PI / 6 + t3), p3[1] - d * Math.sin(Math.PI / 6 + t3)];

                previewTemplate.find('path').last().attr({
                    'd': 'M' + p1a + 'L' + p2a + ',' + p3a + 'Z'
                });
            }

            // Refresh svg to show correctly
            preview.html(preview.html());
        },

        /**
         * @method createColorPickers
         * Creates an array of color picker components
         * @private
         */
        _createColorPickers: function () {
            var options = {allowEmpty: true, cancelText: this.loc.buttons.cancel};
            this._colorPickers = [
                Oskari.clazz.create('Oskari.userinterface.component.ColorPickerInput', options),
                Oskari.clazz.create('Oskari.userinterface.component.ColorPickerInput', options)
            ];
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
            unselectedButton.css('background-color', '');
        }
    }
);
