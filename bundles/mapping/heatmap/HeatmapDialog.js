/**
 * This bundle attaches heatmap tool for layers
 *
 * @class Oskari.mapframework.bundle.heatmap.HeatmapDialog
 */
Oskari.clazz.define('Oskari.mapframework.bundle.heatmap.HeatmapDialog',
    /**
     * @method create called automatically on construction
     * @static
     */
    function(localization) {
    	this.loc = localization;
    }, {
        __templates : {
            'main' : _.template('<div>' +
            	'</div>'),
            'propertySelect' : _.template('<div><span>${label}</span></div>'),
            'select' : _.template('<select name="heatmapProperties">' +
                        '<option value="">${label}</option>' +
                        '<% props.forEach(function(value) {  %>' +
            				'<option>${value}</option>'+
        				'<% }); %>' +
            		'</select>'),

            'colorThemes' : _.template('<div><span>${label}</span></div>' +
                                    '<div class="color-themes">' +
                                        '<div class="color-theme theme-1"><input id="theme1" type="radio" name="colorThemes">' +
                                            '<div class="color-box theme-box theme-box-1" color="#4444FF" style="background-color:#4444FF"></div>' +
                                            '<div class="color-box theme-box theme-box-2" color="#FF0000" style="background-color:#FF0000"></div>' +
                                            '<div class="color-box theme-box theme-box-3" color="#FFFF00" style="background-color:#FFFF00"></div>' +
                                        '</div>' +
                                        '<div class="color-theme theme-2"><input id="theme2" type="radio" name="colorThemes">' +
                                            '<div class="color-box theme-box theme-box-4" color="#CA4538" style="background-color:#CA4538"></div>' +
                                            '<div class="color-box theme-box theme-box-5" color="#BB4E97" style="background-color:#BB4E97"></div>' +
                                            '<div class="color-box theme-box theme-box-6" color="#117FC7" style="background-color:#117FC7"></div>' +
                                        '</div>' +
                                        '<div class="color-theme theme-3"><input id="theme3" type="radio" name="colorThemes">' +
                                            '<div class="color-box theme-box theme-box-7" color="#B7CC16" style="background-color:#B7CC16"></div>' +
                                            '<div class="color-box theme-box theme-box-8" color="#E09117" style="background-color:#E09117"></div>' +
                                            '<div class="color-box theme-box theme-box-9" color="#DC5B49" style="background-color:#DC5B49"></div>' +
                                        '</div>' +
                                    '</div>'),

            'customThemeLabel' : _.template('<div><span>${label}</span></div>'),
            'customThemeGroup' : _.template('<div class="colorpicker-group"><input id="customTheme" type="radio" name="colorThemes"></div>'),
            
        },

        _createColorPickers: function() {
            this._colorPickers = [
                Oskari.clazz.create('Oskari.userinterface.component.ColorPickerInput'),
                Oskari.clazz.create('Oskari.userinterface.component.ColorPickerInput'),
                Oskari.clazz.create('Oskari.userinterface.component.ColorPickerInput')
            ];
        },

    	showDialog : function(layer, callback, isNew) {
    		if(this.dialog) {
    			this.dialog.close(true);
    			delete this.dialog;
    		}
    		var me = this,
    			dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

            dialog.addClass('heatmap settings-dialog');

            this._createColorPickers();
    		var content = jQuery(this.__templates.main());

			// TODO: maybe replace radius field with a slider?
			var radiusInput = Oskari.clazz.create('Oskari.userinterface.component.NumberInput');
			radiusInput.setTitle(this.loc.radiusLabel);
			radiusInput.setValue(layer.getRadius());
			radiusInput.setMin(1);
			radiusInput.setMax(300);
            jQuery(radiusInput.getElement()).find("input").attr("name", "heatmap-input");
			content.append(radiusInput.getElement());

			var ppcInput = Oskari.clazz.create('Oskari.userinterface.component.NumberInput');
			ppcInput.setTitle(this.loc.pixelsPerCellLabel);
			ppcInput.setValue(layer.getPixelsPerCell());
			ppcInput.setMin(1);
			ppcInput.setMax(300);
            jQuery(ppcInput.getElement()).find("input").attr("name", "heatmap-input");
			content.append(ppcInput.getElement());

    		var propertyElement = null;
    		var propertySelector = null;
    		// only show select if there is something to select
    		if(layer.getHeatmapProperties().length > 0) {
    			propertyElement =  jQuery(this.__templates.propertySelect({
	    			label : this.loc.propertyLabel
	    		}));
    			propertySelector = jQuery(this.__templates.select({
    				label : this.loc.noneOption,
	    			props : layer.getHeatmapProperties()
	    		}));
	    		propertySelector.val(layer.getWeightedHeatmapProperty());
	    		propertyElement.append(propertySelector);
	    		content.append(propertyElement);
            }

            var colorThemes = jQuery(this.__templates.colorThemes({
                label: this.loc.colorThemesLabel
            }));

            content.append(colorThemes);


            //colorpicker -->
            var customThemeLabel = jQuery(this.__templates.customThemeLabel( {
                label: this.loc.colorPickerLabel
            }));
            content.append(customThemeLabel);

            var customThemeGroup = jQuery(this.__templates.customThemeGroup());
			customThemeGroup.append(this._colorPickers[0].getElement());
			customThemeGroup.append(this._colorPickers[1].getElement());
			customThemeGroup.append(this._colorPickers[2].getElement());
            content.append(customThemeGroup);

            // set latest selected color theme checked
            var selectedColorTheme = layer.getSelectedTheme();
            if (selectedColorTheme) {
                jQuery(content).find("input[id="+ selectedColorTheme.id + "]").attr("checked", true);
            } else {
                jQuery(content).find("input[id=theme1]").attr("checked", true);
            }

            //set colors for colorboxes
            var colorSetup = layer.getColorSetup();
            if (colorSetup) {
                this._colorPickers[0].setValue(colorSetup[0]);
                this._colorPickers[1].setValue(colorSetup[1]);
                this._colorPickers[2].setValue(colorSetup[2]);
            }

			var okBtn = null;
            if(isNew) {
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.AddButton');
            }
            else {
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
            }
			okBtn.setHandler(function() {
				// TODO: validate
				var values = {
					radius : radiusInput.getValue(),
					pixelsPerCell : ppcInput.getValue(),
                    colorConfig : me.getSelectedColors(content),
                    colorSetup: me.getColorSetup(content),
                    selectedTheme: me.getSelectedTheme(content)
				};
				if(propertySelector) {
					values.property = propertySelector.val();
				}
				dialog.close();
				delete me.dialog;
				callback(values);
			});
            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');
            cancelBtn.setHandler(function() {
                dialog.close();
                delete me.dialog;
            });
            
            var colorPickerHandler = function() {
                jQuery("input[id=customTheme]").attr("checked", true);
            }
            this._colorPickers[0].setHandler(colorPickerHandler);
            this._colorPickers[1].setHandler(colorPickerHandler);
            this._colorPickers[2].setHandler(colorPickerHandler);
            
    		dialog.show(this.loc.title, content, [cancelBtn, okBtn]);
            jQuery(dialog.dialog[0]).find(".actions").addClass("heatmap-actions");
    		dialog.makeDraggable();
			this.dialog = dialog;
    	},

        getSelectedColors: function (content) {
            this.colors = [];
            this.colors.push("#FFFFFF");
            var me = this,
                element = jQuery(content).find("input:checked");

            if (element.attr('id') === "customTheme") {
                this.colors = this.colors.concat(this.getColorSetup());
            }
            else {
                var colorBoxes = jQuery(element[0].parentElement).find('.color-box');
                colorBoxes.each(function (index, colorBox) {
                    me.colors.push(jQuery(colorBox).attr("color"));
                });
            }
            return me.colors;
        },

        //Returns colors that are selected with color picker
        getColorSetup: function () {
            var selectedColors = [];
            this._colorPickers.forEach(function (picker) {
                selectedColors.push(picker.getValue());
            });
            return selectedColors;
        },

        getSelectedTheme: function (content) {
            var element = jQuery(content).find("input:checked");
            return element[0];
        }
    });