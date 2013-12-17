/**
 * @class Oskari.userinterface.component.visualization-form.LineForm
 *
 * Shows a form for line rendering options
 */
Oskari.clazz.define("Oskari.userinterface.component.visualization-form.LineForm",

    /**
     * @method create called automatically on construction
     * @static
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
            color: this.defaultValues.color
        };

        this.styleButtonNames = ["icon-line-basic", "icon-line-dashed", "icon-double-line"];
        this.capButtonNames = ["icon-line-flat_cap", "icon-line-round_cap"];
        this.cornerButtonNames = ["icon-corner-sharp", "icon-corner-round"];

        this.basicColors = ["#ffffff", "#666666", "#ffde00", "#f8931f", "#ff3334", "#bf2652",
            "#000000", "#cccccc", "#652d90", "#3233ff", "#26bf4b", "#00ff01"
            ];
        this.paper = null;
        this.activeColorCell = -1;
        // Default color
        var i;
        for (i = 0; i < this.basicColors.length; i++) {
            if (this.basicColors[i] === "#" + this.values.color) {
                this.activeColorCell = i;
                break;
            }
        }

        this.templateLineStyleDialogContent = jQuery('<div class="lineform">' +
            '<div class="container">' +
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
            '<div class="color-grid">' +
            '<div class="color-rectangle"></div>' +
            '</div>' +
            '<div class="color-label">' +
            '<label>' + this.loc.color.labelOr + '</label>' +
            '</div>' +
            '<div class="color-source-selector">' +
            '<label>' + this.loc.color.labelCustom + '</label>' +
            '</div>' +
            '<div class="custom-colors"></div>' +
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
        this.templateColorSource = jQuery('<input type="checkbox" name="colorInput" value = "custom" class="color-source">');
        this.templateColorValue = jQuery('<label class="color-label"></label><br><input type="text" name="color-input" value="0" disabled="disabled" class="custom-color">');
        this.minWidth = 1;
        this.maxWidth = 10;
        this.templateWidthValue = jQuery('<input type="number" name="width" class="linewidth" min="' + this.minWidth + '" max="' + this.maxWidth + '" step=1 value="' + this.values.width + '">');
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
                for (i = 0; i < this.creator.lineCapMap.length; i++) {
                    if (values.cap === this.creator.lineCapMap[i]) {
                        values.cap = i;
                    }
                }
                for (i = 0; i < this.creator.lineCornerMap.length; i++) {
                    if (values.corner === this.creator.lineCornerMap[i]) {
                        values.corner = i;
                    }
                }
                for (i = 0; i < this.creator.lineStyleMap.length; i++) {
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
            var me = this;
            if (state !== null && state !== undefined) {
                jQuery.extend(true, me.values, state.line);

                // TODO: what is the differnece between size & width? why do we need both?
                me.values.width = Number(me.values.size);
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
            for (i = 0; i < me.styleButtonNames.length; i++) {
                styleBtnContainer = me.templateButton.clone();
                styleBtnContainer.addClass(me.styleButtonNames[i]);
                styleBtnContainer.attr('id', i + "linestyle");
                if (i === me.values.style) {
                    this._styleSelectedButton(styleBtnContainer);
                }
                // FIXME create function outside loop
                styleBtnContainer.click(function () {
                    newValue = parseInt(jQuery(this).attr('id').charAt(0),10);
                    me._selectButton("style", newValue);
                    me.values.style = newValue;
                    me._updatePreview(dialogContent);
                });
                content.append(styleBtnContainer);
            }

            // Line cap
            content = dialogContent.find('div.cap');
            for (i = 0; i < me.capButtonNames.length; i++) {
                capBtnContainer = me.templateButton.clone();
                capBtnContainer.addClass(me.capButtonNames[i]);
                capBtnContainer.attr('id', i + "linecap");
                if (i === me.values.cap) {
                    this._styleSelectedButton(capBtnContainer);
                }
                // FIXME create function outside loop
                capBtnContainer.click(function () {
                    newValue = parseInt(jQuery(this).attr('id').charAt(0));
                    me._selectButton("cap", newValue);
                    me.values.cap = newValue;
                    me._updatePreview(dialogContent);
                });
                content.append(capBtnContainer);
            }

            // Line corner
            content = dialogContent.find('div.corner');
            for (i = 0; i < me.cornerButtonNames.length; i++) {
                cornerBtnContainer = me.templateButton.clone();
                cornerBtnContainer.addClass(me.cornerButtonNames[i]);
                cornerBtnContainer.attr('id', i + "linecorner");
                if (i === me.values.corner) {
                    this._styleSelectedButton(cornerBtnContainer);
                }
                // FIXME create function outside loop
                cornerBtnContainer.click(function () {
                    newValue = parseInt(jQuery(this).attr('id').charAt(0));
                    me._selectButton("corner", newValue);
                    me.values.corner = newValue;
                    me._updatePreview(dialogContent);
                });
                content.append(cornerBtnContainer);
            }

            // Line width
            content = dialogContent.find('div.width');
            var widthSpinner = me.templateWidthValue.clone();
            widthSpinner.change(function () {
                var newValue = parseInt(widthSpinner.val(), 10);
                if (!isNaN(newValue)) {
                    me.values.width = newValue;
                    me._updatePreview();
                }
            });
            widthSpinner.val(me.values.size !== null && me.values.size !== undefined ? me.values.size : 1);
            content.append(widthSpinner);

            var statedChosenColor = false,
                colorCell,
                idExt,
                id,
                cellIndex,
                activeCell;
            // Color chooser
            content = dialogContent.find('.color-rectangle');
            for (i = 0; i < me.basicColors.length; i++) {
                colorCell = me.templateColorCell.clone();
                colorCell.css('background-color', me.basicColors[i]);
                idExt = "ColorCell";
                id = i + idExt;
                if (id.length === idExt.length + 1) {
                    id = "0" + id;
                }
                colorCell.attr("id", id);
                colorCell.click(function () {
                    if (jQuery('.color-source').prop('checked')) {
                        return;
                    }
                    cellIndex = parseInt(this.id.substring(0, 2), 10);
                    if (cellIndex === me.activeColorCell) {
                        return;
                    }
                    if (me.activeColorCell > -1) {
                        activeCell = me.activeColorCell.toString();
                        if (me.activeColorCell < 10) {
                            activeCell = "0" + activeCell;
                        }
                        jQuery('#' + activeCell + 'ColorCell').css('border', '1px solid #000000');
                    }
                    me.values.color = me.creator.rgbToHex(this.style.backgroundColor);
                    me.activeColorCell = cellIndex;
                    if (cellIndex < 10) {
                        cellIndex = "0" + cellIndex.toString();
                    }
                    jQuery('#' + cellIndex + 'ColorCell').css('border', '3px solid #ffffff');
                    me._updatePreview(dialogContent);
                });
                //instead of selecting always black,
                // we should use the color that comes from the state
                if ('#' + me.values.color === me.basicColors[i]) {
                    colorCell.css('border', '3px solid #ffffff');
                    me.activeColorCell = i;
                    statedChosenColor = true;
                }
                content.append(colorCell);
            }

            // Custom color
            content = dialogContent.find('.color-source-selector');
            var colorCheckbox = me.templateColorSource.clone();
            // If the default value is not included in the color cells
            if (me.activeColorCell === -1) {
                colorCheckbox.attr("checked", true);
            }
            colorCheckbox.change(function () {
                jQuery("input.custom-color").prop('disabled', !this.checked);
                var cell = me.activeColorCell.toString();
                if (me.activeColorCell < 10) {
                    cell = "0" + cell;
                }
                var activeCell = jQuery("#" + cell + "ColorCell");
                if (this.checked) {
                    activeCell.css('border', '1px solid #000000');
                    jQuery(".custom-red-value").val(parseInt(me.values.color.substring(0, 2), 16));
                    jQuery(".custom-green-value").val(parseInt(me.values.color.substring(2, 4), 16));
                    jQuery(".custom-blue-value").val(parseInt(me.values.color.substring(4), 16));
                    me.activeColorCell = -1;
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

            content = dialogContent.find('.custom-colors');
            var customColorEditor = this.templateCustomColor.clone();
            content.append(customColorEditor);

            var redValue = me.templateColorValue.clone();
            redValue.addClass("custom-red-value");
            if (me.activeColorCell === -1) {
                redValue.val(parseInt(me.values.color.substring(0, 2), 16));
                redValue.prop("disabled", false);
            }
            dialogContent.find('.colorcolumn1').append(redValue);
            dialogContent.find('label.custom-red-value').text('R');

            var greenValue = me.templateColorValue.clone();
            greenValue.addClass("custom-green-value");
            if (me.activeColorCell === -1) {
                greenValue.val(parseInt(me.values.color.substring(2, 4), 16));
                greenValue.prop("disabled", false);
            }
            dialogContent.find('.colorcolumn21').append(greenValue);
            dialogContent.find('label.custom-green-value').text('G');

            var blueValue = me.templateColorValue.clone();
            blueValue.addClass("custom-blue-value");
            if (me.activeColorCell === -1) {
                blueValue.val(parseInt(me.values.color.substring(4), 16));
                blueValue.prop("disabled", false);
            }
            dialogContent.find('.colorcolumn22').append(blueValue);
            dialogContent.find('label.custom-blue-value').text('B');

            // if the color is not picked from selection, it must be users own color
            // add color values to the input fields
            if (!statedChosenColor) {
                var rgb = me.creator.hexToRgb(me.values.color);
                dialogContent.find('input.custom-color.custom-red-value').val(rgb.r);
                dialogContent.find('input.custom-color.custom-green-value').val(rgb.g);
                dialogContent.find('input.custom-color.custom-blue-value').val(rgb.b);
                dialogContent.find('input.custom-color').prop('disabled', false);
            }

            dialogContent.find('.custom-color').change(function () {
                var values = [],
                    i,
                    intValue;
                values[0] = jQuery('input.custom-color.custom-red-value').val();
                values[1] = jQuery('input.custom-color.custom-green-value').val();
                values[2] = jQuery('input.custom-color.custom-blue-value').val();
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
                me.values.color = values.join('');
                me._updatePreview();
            });

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
                me.values.size = me.defaultValues.size;
                me.values.color = me.defaultValues.color;
                me.values.shape = me.defaultValues.shape;
                renderDialog.close();
            });
            renderDialog.show(title, dialogContent, [saveBtn, cancelBtn]);
            renderDialog.moveTo(renderButton, 'top');

            me._updatePreview();
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
            this._styleUnselectedButton(jQuery("div#" + this.values[property] + "line" + property + ".icon-button"));
            this._styleSelectedButton(jQuery("div#" + selectedButton + "line" + property + ".icon-button"));
        },

        _updatePreview: function (dialog) {
            var me = this;
            var view = dialog === undefined || dialog === null ? jQuery(".lineform") : dialog;
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

            var attributes = {
                "stroke": "#" + me.values.color,
                "fill": "none",
                "stroke-width": me.values.width,
                "stroke-linejoin": me.values.corner === 0 ? "miter" : "round",
                "stroke-linecap": me.values.cap === 0 ? "butt" : "round",
                //"stroke-dasharray": me.values.style === 1 ? "3 "+ (2 + 0.25 * me.values.width) : ""
                // Raphael.js without patch:
                "stroke-dasharray": me.values.style === 1 ? "- " : ""
            };

            var p1 = [10, 15];
            var p2 = [20, 35];
            var p3 = [40, 25];
            this.paper.clear();
            if (me.values.style !== 2) {
                this.paper.path("M"+p1[0]+","+p1[1]+"L"+p2+","+p3).attr(attributes);
            } else {
                // double line
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
                this.paper.path("M"+p1a[0]+","+p1a[1]+"L"+p2a+","+p3a+"M"+p1b[0]+","+p1b[1]+"L"+p2b+","+p3b).attr(attributes);
                this.paper.circle(0,0,0); // IE8 refresh work-around
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