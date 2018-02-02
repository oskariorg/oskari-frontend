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
            			'<% _.forEach(props, function(value) {  %>' +
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

            'colorpicker' : _.template('<div><span>${label}</span></div>' +
                            '<div class="colorpicker-group"><input id="theme4" type="radio" name="colorThemes">' +
                            '<div class="color-box color-picker box-1" color="#818282" style="background-color:#818282"></div>' +
                            '<div class="color-box color-picker box-2" color="#818282" style="background-color:#818282"></div>' +
                            '<div class="color-box color-picker box-3" color="#818282" style="background-color:#818282"></div>' +
                            '</div>')

        },



    	showDialog : function(layer, callback, isNew) {
    		if(this.dialog) {
    			this.dialog.close(true);
    			delete this.dialog;
    		}
    		var me = this,
    			dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

            dialog.addClass('heatmap settings-dialog');
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
            var colorPicker = jQuery(this.__templates.colorpicker( {
                label: this.loc.colorPickerLabel
            }));
            var colorbox = colorPicker.find('.color-picker');
            jQuery(colorbox).colpick({
                layout:'rgbhex',
                onSubmit:function(hsb,hex,rgb,el) {
                    jQuery(el).css('background-color', '#'+ hex);
                    jQuery(el).attr("color", '#'+ hex);
                    $(el).colpickHide();
                }
            });

            content.append(colorPicker);

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
                jQuery(content).find('.box-1').attr({"color": colorSetup[0], "style": "background-color:" + colorSetup[0]});
                jQuery(content).find('.box-2').attr({"color": colorSetup[1], "style": "background-color:" + colorSetup[1]});
                jQuery(content).find('.box-3').attr({"color": colorSetup[2], "style": "background-color:" + colorSetup[2]});
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
    		dialog.show(this.loc.title, content, [cancelBtn, okBtn]);
            jQuery(dialog.dialog[0]).find(".actions").addClass("heatmap-actions");
    		dialog.makeDraggable();
			this.dialog = dialog;
    	},

        getSelectedColors: function (content) {
            this.colors = [];
            this.colors.push("#FFFFFF");
            var me = this,
                element = jQuery(content).find("input:checked"),
                colorBoxes = jQuery(element[0].parentElement).find('.color-box');
            _.forEach(colorBoxes, function (colorBox) {
                me.colors.push(jQuery(colorBox).attr("color"));
            });
            return me.colors;
        },

        //Returns colors that are selected with color picker
        getColorSetup: function (content) {
            var me = this,
                selectedColors = [];
                element = jQuery(content).find("input:checked");

            selectColorsElement = jQuery(content).find('.color-picker');
            _.forEach(selectColorsElement, function (colorElement) {
                selectedColors.push(jQuery(colorElement).attr("color"));
            });
            return selectedColors;
        },

        getSelectedTheme: function (content) {
            var element = jQuery(content).find("input:checked");
            return element[0];
        }
    });