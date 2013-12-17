/**
 * @class Oskari.userinterface.component.visualization-form.AreaForm
 *
 * Shows a form for area rendering options
 */
Oskari.clazz.define("Oskari.userinterface.component.visualization-form.AreaForm",

    /**
     * @method create called automatically on construction
     * @static
     */

    function (creator, loc, defaultValues) {
        this.creator = creator;
        this.loc = loc;
        this.defaultValues = defaultValues;

        // Temporary IE8 fix
        this.first = true;

        this.values = {
            lineWidth: this.defaultValues.line.width,
            lineCorner: this.defaultValues.line.corner,
            lineStyle: this.defaultValues.line.style,
            lineColor: this.defaultValues.line.color,
            fillColor: this.defaultValues.fill.color,
            fillStyle: this.defaultValues.fill.style
        };

        this.styleButtonNames = ["icon-line-basic", "icon-line-dashed", "icon-double-line"];
        this.cornerButtonNames = ["icon-corner-sharp", "icon-corner-round"];

        this.colorTypes = ["line", "fill"];
        this.basicColors = ["#ffffff", "#666666", "#ffde00", "#f8931f", "#ff3334", "#bf2652",
            "#000000", "#cccccc", "#652d90", "#3233ff", "#26bf4b", "#00ff01"
            ];
        this.paper = null;
        this.activeColorCell = [-1, -1];
        // Default color
        var i,
            j;
        for (i = 0; i < this.basicColors.length; i++) {
            for (j = 0; j < this.basicColors.length; j++) {
                if (this.basicColors[j] === "#" + this.values.fillColor[i]) {
                    this.activeColorCell[i] = j;
                    break;
                }
            }
        }

        this.fillButtonNames = ["icon-line-thin-diagonal", "icon-line-wide-diagonal", "icon-line-thin-horizontal", "icon-line-wide-horizontal"];

        this.templateAreaStyleDialogContent = jQuery('<div class="areaform">' +
            '<div class="container">' +
            '<div class="column1">' +
            '<label>' + this.loc.linestyle.label + '</label>' +
            '<div class="style icon-buttons"></div>' +
            '<label>' + this.loc.linecorner.label + '</label>' +
            '<div class="corner icon-buttons"></div>' +
            '<label>' + this.loc.linewidth.label + '</label><br>' +
            '<div class="width"></div>' +
            '</div>' +
            '<div class="column2">' +
            '<div class="column21">' +
            '<label>' + this.loc.linecolor.label + '</label>' +
            '<div class="color-grid">' +
            '<div class="color-rectangle line"></div>' +
            '</div>' +
            '<div class="color-label">' +
            '<label>' + this.loc.linecolor.labelOr + '</label>' +
            '</div>' +
            '<div class="color-source-selector-line">' +
            '<label>' + this.loc.linecolor.labelCustom + '</label>' +
            '</div>' +
            '<div class="custom-colors-line"></div>' +
            '</div>' +
            '<div class="column22">' +
            '<div class="column221">' +
            '<label>' + this.loc.color.label + '</label>' +
            '<div class="color-grid">' +
            '<div class="color-rectangle fill"></div>' +
            '</div>' +
            '<div class="color-label">' +
            '<label>' + this.loc.color.labelOr + '</label>' +
            '</div>' +
            '<div class="color-source-selector-fill">' +
            '<label>' + this.loc.color.labelCustom + '</label>' +
            '</div>' +
            '<div class="custom-colors-fill"></div>' +
            '<label>' + this.loc.fill.label + '</label>' +
            '<div class="fill icon-buttons"></div>' +
            '</div>' +
            '<div class="column222">' +
            '<label>' + this.loc.preview.label + '</label>' +
            '<div class="preview"></div>' +
            '</div>' +
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
        this.previewSize = 50;
        this.selectColor = "#dddddd";
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
                for (i = 0; i < this.creator.lineCornerMap.length; i++) {
                    if (values.lineCorner === this.creator.lineCornerMap[i]) {
                        values.lineCorner = i;
                    }
                }
                for (i = 0; i < this.creator.lineStyleMap.length; i++) {
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
            var me = this;

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
            for (i = 0; i < me.styleButtonNames.length; i++) {
                styleBtnContainer = me.templateButton.clone();
                styleBtnContainer.addClass(me.styleButtonNames[i]);
                styleBtnContainer.attr('id', i + "linestyle");
                if (i === me.values.lineStyle) {
                    this._styleSelectedButton(styleBtnContainer);
                }
                // FIXME create function outside loop
                styleBtnContainer.click(function () {
                    newValue = parseInt(jQuery(this).attr('id').charAt(0), 10);
                    me._selectButton("lineStyle", newValue);
                    me.values.lineStyle = newValue;
                    me._updatePreview(dialogContent);
                });
                content.append(styleBtnContainer);
            }

            // Line corner
            content = dialogContent.find('div.corner');
            for (i = 0; i < me.cornerButtonNames.length; i++) {
                cornerBtnContainer = me.templateButton.clone();
                cornerBtnContainer.addClass(me.cornerButtonNames[i]);
                cornerBtnContainer.attr('id', i + "linecorner");
                if (i === me.values.lineCorner) {
                    this._styleSelectedButton(cornerBtnContainer);
                }
                // FIXME create function outside loop
                cornerBtnContainer.click(function () {
                    newValue = parseInt(jQuery(this).attr('id').charAt(0), 10);
                    me._selectButton("lineCorner", newValue);
                    me.values.lineCorner = newValue;
                    me._updatePreview(dialogContent);
                });
                content.append(cornerBtnContainer);
            }

            // Line width
            content = dialogContent.find('div.width');
            var widthSpinner = me.templateWidthValue.clone();
            widthSpinner.val(me.values.lineWidth !== null && me.values.lineWidth !== undefined ? me.values.lineWidth : 1);
            widthSpinner.change(function () {
                var newValue = parseInt(widthSpinner.val(), 10);
                if (!isNaN(newValue)) {
                    me.values.lineWidth = newValue;
                    me._updatePreview();
                }
            });
            content.append(widthSpinner);
            var c,
                statedChosenColor,
                cType,
                colorCell,
                idExt,
                id,
                colorCheckbox,
                colorTypeId,
                cell,
                activeCell,
                customColorEditor,
                redValue,
                greenValue,
                blueValue,
                rgb;
            // Color chooser
            for (c = 0; c < 2; c++) {
                statedChosenColor = false;
                cType = (c === 0) ? 'lineColor' : 'fillColor';
                content = dialogContent.find('.color-rectangle.' + me.colorTypes[c]);
                for (i = 0; i < me.basicColors.length; i++) {
                    colorCell = me.templateColorCell.clone();
                    colorCell.css('background-color', me.basicColors[i]);
                    idExt = "ColorCell";
                    id = i.toString() + c.toString() + idExt;
                    if (id.length === idExt.length + 2) {
                        id = "0" + id;
                    }
                    colorCell.attr("id", id);
                    colorCell.click(function () {
                        var cellIndex = parseInt(this.id.substring(0, 2), 10);
                        var colorType = parseInt(this.id.substring(2, 3), 10);
                        if (jQuery('#' + colorType + 'color-checkbox').prop('checked')) {
                            return;
                        }
                        if (cellIndex === me.activeColorCell[colorType]) {
                            return;
                        }
                        if (me.activeColorCell[colorType] > -1) {
                            var activeCell = me.activeColorCell[colorType].toString();
                            if (me.activeColorCell[colorType] < 10) {
                                activeCell = "0" + activeCell;
                            }
                            jQuery('#' + activeCell + colorType + 'ColorCell').css('border', '1px solid #000000');
                        }
                        me.values[colorType === 0 ? 'lineColor' : 'fillColor'] = me.creator.rgbToHex(this.style.backgroundColor);
                        me.activeColorCell[colorType] = cellIndex;
                        if (cellIndex < 10) {
                            cellIndex = "0" + cellIndex.toString();
                        }
                        jQuery('#' + cellIndex + colorType + 'ColorCell').css('border', '3px solid #ffffff');
                        me._updatePreview(dialogContent);
                    });
                    //instead of selecting always black,
                    // we should use the color that comes from the state
                    if ('#' + me.values[cType] === me.basicColors[i]) {
                        colorCell.css('border', '3px solid #ffffff');
                        me.activeColorCell[c] = i;
                        statedChosenColor = true;
                    }
                    content.append(colorCell);
                }

                // Custom color
                content = dialogContent.find('.color-source-selector-' + me.colorTypes[c]);
                colorCheckbox = me.templateColorSource.clone();
                colorCheckbox.attr("id", c + "color-checkbox");
                // If the default value is not included in the color cells
                if (me.activeColorCell[c] === -1) {
                    colorCheckbox.attr("checked", true);
                }
                colorCheckbox.change(function () {
                    var colorTypeId = this.id.substring(0, 1);
                    var colorType = (colorTypeId === '0') ? 'lineColor' : 'fillColor';
                    jQuery('input.custom-color.' + me.colorTypes[colorTypeId]).prop('disabled', !this.checked);
                    var cell = me.activeColorCell[colorTypeId].toString();
                    if (me.activeColorCell[colorTypeId] < 10) {
                        cell = "0" + cell;
                    }
                    var activeCell = jQuery("#" + cell + colorTypeId + "ColorCell");
                    if (this.checked) {
                        activeCell.css('border', '1px solid #000000');
                        jQuery(".custom-red-value." + me.colorTypes[colorTypeId]).val(parseInt(me.values[colorType].substring(0, 2), 16));
                        jQuery(".custom-green-value." + me.colorTypes[colorTypeId]).val(parseInt(me.values[colorType].substring(2, 4), 16));
                        jQuery(".custom-blue-value." + me.colorTypes[colorTypeId]).val(parseInt(me.values[colorType].substring(4), 16));
                        me.activeColorCell[colorTypeId] = -1;
                    } else {
                        // activeCell.css('border','3px solid #ffffff');
                    }
                    me._updatePreview(dialogContent);
                });
                content.prepend(colorCheckbox);

                // if the color is not picked from selection, it must be users own color
                // select user colors checkbox
                if (!statedChosenColor) {
                    colorCheckbox.checked = true;
                    content.find("input.color-source").prop('disabled', false).attr('checked', 'checked');
                }

                content = dialogContent.find('.custom-colors-' + me.colorTypes[c]);
                customColorEditor = this.templateCustomColor.clone();
                customColorEditor.addClass(me.colorTypes[c]);
                content.append(customColorEditor);

                redValue = me.templateColorValue.clone();
                redValue.addClass("custom-red-value");
                redValue.addClass(me.colorTypes[c]);
                if (me.activeColorCell[c] === -1) {
                    redValue.val(parseInt(me.values.lineColor.substring(0, 2), 16));
                    redValue.prop("disabled", false);
                }
                content.find('.colorcolumn1').append(redValue);
                content.find('label.custom-red-value').text('R');
                content.find('input.custom-red-value').attr('id', c + "red-value");

                greenValue = me.templateColorValue.clone();
                greenValue.addClass("custom-green-value");
                greenValue.addClass(me.colorTypes[c]);
                if (me.activeColorCell[c] === -1) {
                    greenValue.val(parseInt(me.values[cType].substring(2, 4), 16));
                    greenValue.prop("disabled", false);
                }
                content.find('.colorcolumn21').append(greenValue);
                content.find('label.custom-green-value').text('G');
                content.find('input.custom-green-value').attr('id', c + "green-value");

                blueValue = me.templateColorValue.clone();
                blueValue.addClass("custom-blue-value");
                blueValue.addClass(me.colorTypes[c]);
                if (me.activeColorCell[c] === -1) {
                    blueValue.val(parseInt(me.values[cType].substring(4), 16));
                    blueValue.prop("disabled", false);
                }
                content.find('.colorcolumn22').append(blueValue);
                content.find('label.custom-blue-value').text('B');
                content.find('input.custom-blue-value').attr('id', c + "blue-value");

                // if the color is not picked from selection, it must be users own color
                // add color values to the input fields
                if (!statedChosenColor) {
                    rgb = me.creator.hexToRgb(me.values[cType]);
                    content.find('input.custom-color.custom-red-value').val(rgb.r);
                    content.find('input.custom-color.custom-green-value').val(rgb.g);
                    content.find('input.custom-color.custom-blue-value').val(rgb.b);
                    dialogContent.find('input#' + c.toString() + 'red-value.custom-color').prop('disabled', false);
                    dialogContent.find('input#' + c.toString() + 'green-value.custom-color').prop('disabled', false);
                    dialogContent.find('input#' + c.toString() + 'blue-value.custom-color').prop('disabled', false);
                }

                content.find('.custom-color').change(function () {
                    var colorType = this.id.substring(0, 1);
                    var values = [],
                        i,
                        intValue;
                    values[0] = jQuery('input#' + colorType + 'red-value').val();
                    values[1] = jQuery('input#' + colorType + 'green-value').val();
                    values[2] = jQuery('input#' + colorType + 'blue-value').val();
                    // From integer to hex values
                    for (i = 0; i < 3; i++) {
                        intValue = parseInt(values[i],10);
                        if ((intValue < 0) || (intValue > 255)) {
                            return;
                        }
                        values[i] = intValue.toString(16);
                        if (values[i].length === 1) {
                            values[i] = '0' + values[i];
                        }
                    }
                    me.values[(colorType === '0') ? 'lineColor' : 'fillColor'] = values.join('');
                    me._updatePreview();
                });
            }

            // Fill style
            content = dialogContent.find('div.fill.icon-buttons');
            for (i = 0; i < me.fillButtonNames.length; i++) {
                var fillBtnContainer = me.templateButton.clone();
                fillBtnContainer.addClass(me.fillButtonNames[i]);
                fillBtnContainer.attr('id', i + "fillstyle");
                if (i === me.values.fillStyle) {
                    this._styleSelectedButton(fillBtnContainer);
                }
                fillBtnContainer.click(function () {
                    var newValue = parseInt(jQuery(this).attr('id').charAt(0),10);
                    if (me.values.fillStyle === newValue) {
                        me.values.fillStyle = -1;
                        me._styleUnselectedButton(jQuery("div#" + newValue + "fillstyle.icon-button"));
                    } else {
                        if (me.values.fillStyle !== -1) {
                            me._styleUnselectedButton(jQuery("div#" + me.values.fillStyle + "fillstyle.icon-button"));
                        }
                        me._styleSelectedButton(jQuery("div#" + newValue + "fillstyle.icon-button"));
                        me.values.fillStyle = newValue;
                    }
                    me._updatePreview(dialogContent);
                });
                content.append(fillBtnContainer);
            }

            this._updatePreview(dialogContent);

            var saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveBtn.setTitle(me.loc.buttons.save);
            saveBtn.addClass('primary showSelection');
            saveBtn.setHandler(function () {
                renderDialog.close();
            });

            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(me.loc.buttons.cancel);
            cancelBtn.setHandler(function () {
                me.values.lineWidth = me.defaultValues.line.width;
                me.values.lineCorner = me.defaultValues.line.corner;
                me.values.lineStyle = me.defaultValues.line.style;
                me.values.lineColor = me.defaultValues.line.color;
                me.values.fillColor = me.defaultValues.fill.color;
                me.values.fillStyle = me.defaultValues.fill.style;
                renderDialog.close();
            });
            renderDialog.show(title, dialogContent, [saveBtn, cancelBtn]);
            renderDialog.moveTo(renderButton, 'top');
            return renderDialog;
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
            this._styleUnselectedButton(jQuery("div#" + this.values[property] + "line" + propertyType + ".icon-button"));
            this._styleSelectedButton(jQuery("div#" + selectedButton + "line" + propertyType + ".icon-button"));
        },

        _updatePreview: function (dialog) {
            // Temporary IE8 fix
            if (this.first) {
                this.first = false;
                this.values.fillStyle = this.defaultValues.fill.style;
            }

            var me = this;
            var view = dialog === undefined || dialog === null ? jQuery(".areaform") : dialog;
            var content = view.find('.preview');
            var preview;
            if (content.length > 0) {
                preview = content.get(0);
                if (preview.children.length === 0) {
                    this.paper = Raphael(preview,50,50);
                }
            } else {
                return;
            }

            var fill = (parseInt(me.values.fillStyle,10) < 0) ? "#" + me.values.fillColor : "none";
            var basicAttributes = {
                "stroke": "#" + me.values.lineColor,
                "fill": fill,
                "stroke-width": me.values.lineWidth,
                "stroke-linejoin": me.values.lineCorner === 0 ? "miter" : "round",
                "stroke-linecap": "butt",
                //"stroke-dasharray": me.values.lineStyle === 1 ? "3 "+ (2 + 0.25 * me.values.lineWidth) : ""
                // Raphael.js without patch:
                 "stroke-dasharray": me.values.lineStyle === 1 ? "- " : ""
            };
            var patternAttributes = {};
            this.paper.clear();

            // Patterns (IE8 compatible version)
            if (me.values.fillStyle >= 0) {
                switch (me.values.fillStyle) {
                case 0:
                    var p01a = [10.5,17.5];
                    var p02a = [12.3,19.7];
                    var p03a = [14.1,21.9];
                    var p04a = [15.9,24.1];
                    var p05a = [17.7,26.3];
                    var p06a = [19.5,28.5];
                    var p07a = [21.4,30.6];
                    var p08a = [23.2,32.8];
                    var p09a = [25.0,35.0];
                    var p010a = [26.8,37.2];
                    var p011a = [28.6,39.4];

                    var p01b = [11.2,16.8];
                    var p02b = [16,16];
                    var p03b = [20.8,15.2];
                    var p04b = [25.6,14.4];
                    var p05b = [30.4,13.6];
                    var p06b = [35.2,12.8];
                    var p07b = [40.0,12.0];
                    var p08b = [37.4,18.6];
                    var p09b = [34.8,25.2];
                    var p010b = [32.2,31.8];
                    var p011b = [29.6,38.4];

                    patternAttributes = {
                        "stroke-width": 1,
                        "stroke": "#" + me.values.fillColor,
                        "fill": "none"
                    };
                    this.paper.path("M"+p01a+"L"+p01b+"M"+p02a+"L"+p02b+"M"+p03a+"L"+p03b+"M"+p04a+"L"+p04b+"M"+p05a+"L"+p05b+"M"+p06a+"L"+p06b+"M"+p07a+"L"+p07b+"M"+p08a+"L"+p08b+"M"+p09a+"L"+p09b+"M"+p010a+"L"+p010b+"M"+p011a+"L"+p011b).attr(patternAttributes);
                    this.paper.circle(0,0,0); // IE8 refresh work-around
                    break;
                case 1:

                    var p11a = [14.8,16.2];
                    var p12a = [23.2,14.8];
                    var p13a = [31.6,13.4];
                    var p14a = [39.8,12.2];
                    var p15a = [35.4,23.6];
                    var p16a = [30.9,35.1];

                    var p11b = [11.9,19.1];
                    var p12b = [15.0,23.0];
                    var p13b = [18.2,26.8];
                    var p14b = [21.4,30.6];
                    var p15b = [24.5,34.5];
                    var p16b = [27.7,38.3];

                    patternAttributes = {
                        "stroke-width": 2,
                        "stroke": "#" + me.values.fillColor,
                        "fill": "none"
                    };
                    this.paper.path("M"+p11a+"L"+p11b+"M"+p12a+"L"+p12b+"M"+p13a+"L"+p13b+"M"+p14a+"L"+p14b+"M"+p15a+"L"+p15b+"M"+p16a+"L"+p16b).attr(patternAttributes);
                    this.paper.circle(0,0,0); // IE8 refresh work-around
                    break;
                case 2:
                    var p21a = [19,15.5];
                    var p22a = [12.1,19.5];
                    var p23a = [15.4,23.5];
                    var p24a = [18.7,27.5];
                    var p25a = [22.0,31.5];
                    var p26a = [25.3,35.5];
                    var p27a = [28.6,39.5];

                    var p21b = [38.6,15.5];
                    var p22b = [37.0,19.5];
                    var p23b = [35.4,23.5];
                    var p24b = [33.9,27.5];
                    var p25b = [32.3,31.5];
                    var p26b = [30.7,35.5];
                    var p27b = [29.1,39.5];

                    patternAttributes = {
                        "stroke-width": 1,
                        "stroke": "#" + me.values.fillColor,
                        "fill": "none"
                    };
                    this.paper.path("M"+p21a+"L"+p21b+"M"+p22a+"L"+p22b+"M"+p23a+"L"+p23b+"M"+p24a+"L"+p24b+"M"+p25a+"L"+p25b+"M"+p26a+"L"+p26b+"M"+p27a+"L"+p27b).attr(patternAttributes);
                    this.paper.circle(0,0,0); // IE8 refresh work-around
                    break;
                case 3:
                    var p31a = [16.1,16.0];
                    var p32a = [13.4,21.0];
                    var p33a = [17.5,26.0];
                    var p34a = [21.6,31.0];
                    var p35a = [25.7,36.0];

                    var p31b = [38.4,16.0];
                    var p32b = [36.4,21.0];
                    var p33b = [35.5,26.0];
                    var p34b = [32.5,31.0];
                    var p35b = [30.5,36.0];

                    patternAttributes = {
                        "stroke-width": 2,
                        "stroke": "#" + me.values.fillColor,
                        "fill": "none"
                    };
                    this.paper.path("M"+p31a+"L"+p31b+"M"+p32a+"L"+p32b+"M"+p33a+"L"+p33b+"M"+p34a+"L"+p34b+"M"+p35a+"L"+p35b).attr(patternAttributes);
                    this.paper.circle(0,0,0); // IE8 refresh work-around
                    break;
                }
            }

            var p1 = [10, 17];
            var p2 = [40, 12];
            var p3 = [29, 40]; //29.33013,40.48076
            var a = this.paper.path("M"+p1+"L"+p2+","+p3+"Z").attr(basicAttributes);
            this.paper.circle(0,0,0); // IE8 refresh work-around

            if (me.values.lineStyle === 2) {

                // double line
                var d = 2 * (2.0 + parseInt(me.values.lineWidth,10));

                var t1 = Math.atan(Math.abs((p2[1] - p1[1]) / (p2[0] - p1[0])));
                var p1a = [p1[0] + d * Math.sin(Math.PI / 3 + t1), p1[1] + d * Math.cos(Math.PI / 3 + t1)];

                var t2 = Math.atan(Math.abs((p3[1] - p2[1]) / (p3[0] - p2[0])));
                var p2a = [p2[0] - d * Math.sin(Math.PI / 3 + t2), p2[1] - d * Math.cos(Math.PI / 3 + t2)];

                var t3 = Math.atan(Math.abs((p1[1] - p3[1]) / (p1[0] - p3[0])));
                var p3a = [p3[0] - d * Math.cos(Math.PI / 6 + t3), p3[1] - d * Math.sin(Math.PI / 6 + t3)];

                this.paper.path("M"+p1a+"L"+p2a+","+p3a+"Z").attr(basicAttributes);
            }
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
            selectedButton.css("border", "2px solid");
            selectedButton.css("background-color", this.selectColor);
        },

        /**
         * @method _styleUnselectedButton
         * Styles the unselected button
         * @param {Object} unselectedButton Unselected button
         */
        _styleUnselectedButton: function (unselectedButton) {
            unselectedButton.css("border", "1px solid");
            unselectedButton.css("background-color", "transparent");
        }

    });