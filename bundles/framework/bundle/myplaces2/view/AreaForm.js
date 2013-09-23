/**
 * @class Oskari.mapframework.bundle.myplaces2.view.AreaForm
 * 
 * Shows a form for area rendering options
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplaces2.view.AreaForm",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.loc = instance.getLocalization('areaform');
    this.defaultValues = {
        color: [instance.myPlacesService.defaults.area.linecolor,
                instance.myPlacesService.defaults.area.color],
        line: {
            style: instance.myPlacesService.defaults.area.linestyle,
            corner: instance.myPlacesService.defaults.area.linecorner,
            width: instance.myPlacesService.defaults.area.linewidth,
            color: instance.myPlacesService.defaults.area.linecolor
        },
        fill: instance.myPlacesService.defaults.area.fill
    };

    this.values = {
        lineWidth : this.defaultValues.line.width,
        lineCorner : this.defaultValues.line.corner,
        lineStyle : this.defaultValues.line.style,
        lineColor : this.defaultValues.color[0],
        fillColor : this.defaultValues.color[1],
        fillStyle : this.defaultValues.fill
    };

    this.styleButtonNames = ["icon-line-basic", "icon-line-dashed", "icon-double-line"];
    this.cornerButtonNames = ["icon-corner-sharp", "icon-corner-round"];

    this.colorTypes = ["line","fill"];
    this.basicColors = ["#ffffff","#666666","#ffde00","#f8931f","#ff3334","#bf2652",
                        "#000000","#cccccc","#652d90","#3233ff","#26bf4b","#00ff01"];
    this.activeColorCell = [-1,-1];
    // Default color
    for (var i = 0; i < this.basicColors.length; i++) {
        for (var j = 0; j < this.basicColors.length; j++) {
            if (this.basicColors[j] === "#"+this.values.fillColor[i]) {
                this.activeColorCell[i] = j;
                break;
            }
        }
    }

    this.fillButtonNames = ["icon-line-thin-diagonal","icon-line-wide-diagonal","icon-line-thin-horizontal","icon-line-wide-horizontal"];

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
                    '<div class="color-grid line"></div>' +
                    '<div class="color-label">' +
                        '<label>' + this.loc.linecolor.labelOr + '</label>' +
                    '</div>'+
                    '<div class="color-source-selector-line">'+
                        '<label>' + this.loc.linecolor.labelCustom + '</label>' +
                    '</div>'+
                    '<div class="custom-colors-line"></div>'+
                '</div>' +
                '<div class="column22">' +
                    '<div class="column221">' +
                        '<label>' + this.loc.color.label + '</label>' +
                        '<div class="color-grid fill"></div>' +
                        '<div class="color-label">' +
                            '<label>' + this.loc.color.labelOr + '</label>' +
                        '</div>'+
                        '<div class="color-source-selector-fill">'+
                            '<label>' + this.loc.color.labelCustom + '</label>' +
                        '</div>'+
                        '<div class="custom-colors-fill"></div>'+
                        '<label>' + this.loc.fill.label + '</label>' +
                        '<div class="fill icon-buttons"></div>'+
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
    this.templateColorSource =  jQuery('<input type="checkbox" name="colorInput" value = "custom" class="color-source">');
    this.templateColorValue = jQuery('<label class="color-label"></label><br><input type="text" name="color-input" value="0" disabled="disabled" class="custom-color">');
    this.minWidth = 1;
    this.maxWidth = 5;
    this.templateWidthValue = jQuery('<input type="number" name="width" class="linewidth" min="'+this.minWidth+'" max="'+this.maxWidth+'" step=1 value="'+this.values.lineWidth+'">');
    this.previewSize = 50;
    this.selectColor = "#dddddd";
}, {
    /**
     * @method showForm
     * @param {Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory[]} categories array containing available categories
     * @return {jQuery} jquery reference for the form
     */
    showForm : function(renderButton, state) {
        var me = this;

        if(state != null) {
            jQuery.extend(true, me.values, state.area);
        }

        var renderDialog = me._getOnScreenForm();
        renderDialog.die();
        renderDialog.remove();
        renderDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

        renderDialog.addClass('top');
        renderDialog.addClass('arrow');
        renderDialog.addClass('renderdialog');
        renderDialog.addClass('areavisualization');
        var title = me.loc.title;

        // Line style
        var dialogContent = me.templateAreaStyleDialogContent.clone();
        var content = dialogContent.find('div.style');
        for (var i=0; i<me.styleButtonNames.length; i++) {
            var styleBtnContainer = me.templateButton.clone();
            styleBtnContainer.addClass(me.styleButtonNames[i]);
            styleBtnContainer.attr('id',i+"linestyle");
            if (i === me.values.lineStyle) this._styleSelectedButton(styleBtnContainer);
            styleBtnContainer.click(function(){
                var newValue = parseInt(jQuery(this).attr('id').charAt(0));
                me._selectButton("lineStyle",newValue);
                me.values.lineStyle = newValue;
                me._updatePreview(dialogContent);
            });
            content.append(styleBtnContainer);
        }

        // Line corner
        content = dialogContent.find('div.corner');
        for (var i=0; i<me.cornerButtonNames.length; i++) {
            var cornerBtnContainer = me.templateButton.clone();
            cornerBtnContainer.addClass(me.cornerButtonNames[i]);
            cornerBtnContainer.attr('id',i+"linecorner");
            if (i === me.values.lineCorner) this._styleSelectedButton(cornerBtnContainer);
            cornerBtnContainer.click(function(){
                var newValue = parseInt(jQuery(this).attr('id').charAt(0));
                me._selectButton("lineCorner",newValue);
                me.values.lineCorner = newValue;
                me._updatePreview(dialogContent);
            });
            content.append(cornerBtnContainer);
        }

        // Line width
        content = dialogContent.find('div.width');
        var widthSpinner = me.templateWidthValue.clone();
        widthSpinner.val(me.values.lineWidth != null ? me.values.lineWidth : 1);
        widthSpinner.change(function() {
            var newValue = parseInt(widthSpinner.val(),10);
            if (!isNaN(newValue)) {
                me.values.lineWidth = newValue;
                me._updatePreview();
            }
        });
        content.append(widthSpinner);

        // Color chooser
        for (var c = 0; c < 2; c++) {
            var statedChosenColor = false;
            var cType = (c==0)?'lineColor':'fillColor';
            content = dialogContent.find('.color-grid.'+me.colorTypes[c]);
            for (i = 0; i < me.basicColors.length; i++) {
                var colorCell = me.templateColorCell.clone();
                colorCell.css('background-color',me.basicColors[i]);
                var idExt = "ColorCell";
                var id = i.toString()+c.toString()+idExt;
                if (id.length === idExt.length+2) id = "0"+id;
                colorCell.attr("id",id);
                colorCell.click(function(){
                    var cellIndex = parseInt(this.id.substring(0,2),10);
                    var colorType = parseInt(this.id.substring(2,3),10);
                    if (jQuery('#'+colorType+'color-checkbox').prop('checked')) return;
                    if (cellIndex === me.activeColorCell[colorType]) return;
                    if (me.activeColorCell[colorType] > 0) {
                        var activeCell = me.activeColorCell[colorType].toString();
                        if (me.activeColorCell[colorType] < 10) activeCell = "0"+activeCell;
                        jQuery('#'+activeCell+colorType+'ColorCell').css('border','1px solid #000000');
                    }
                    me.values[colorType == 0 ? 'lineColor':'fillColor'] = me.instance.rgbToHex(this.style.backgroundColor);
                    me.activeColorCell[colorType] = cellIndex;
                    if (cellIndex < 10) cellIndex = "0"+cellIndex.toString();
                    jQuery('#'+cellIndex+colorType+'ColorCell').css('border','3px solid #ffffff');
                    me._updatePreview(dialogContent);
                });
                //instead of selecting always black,
                // we should use the color that comes from the state
                if ('#'+me.values[cType] == me.basicColors[i]) {
                    colorCell.css('border','3px solid #ffffff');
                    me.activeColorCell[c] = i;
                    statedChosenColor = true;
                }
                content.append(colorCell);
            }

            // Custom color
            content = dialogContent.find('.color-source-selector-'+me.colorTypes[c]);
            var colorCheckbox = me.templateColorSource.clone();
            colorCheckbox.attr("id",c+"color-checkbox");
            // If the default value is not included in the color cells
            if (me.activeColorCell[c] === -1) colorCheckbox.attr("checked",true);
            colorCheckbox.change(function() {
                var colorTypeId = this.id.substring(0,1);
                var colorType = (colorTypeId==0)?'lineColor':'fillColor';
                jQuery('input.custom-color.'+me.colorTypes[colorTypeId]).prop('disabled',!this.checked);
                var cell = me.activeColorCell[colorTypeId].toString();
                if (me.activeColorCell[colorTypeId] < 10) cell = "0"+cell;
                var activeCell = jQuery("#"+cell+colorTypeId+"ColorCell");
                if (this.checked) {
                    activeCell.css('border','1px solid #000000');
                    jQuery(".custom-red-value."+me.colorTypes[colorTypeId]).val(parseInt(me.values[colorType].substring(0,2),16));
                    jQuery(".custom-green-value."+me.colorTypes[colorTypeId]).val(parseInt(me.values[colorType].substring(2,4),16));
                    jQuery(".custom-blue-value."+me.colorTypes[colorTypeId]).val(parseInt(me.values[colorType].substring(4),16));
                    me.activeColorCell[colorTypeId] = -1;
                } else {
                    // activeCell.css('border','3px solid #ffffff');
                }
                me._updatePreview(dialogContent);
            });
            content.prepend(colorCheckbox);

            // if the color is not picked from selection, it must be users own color
            // select user colors checkbox
            if(!statedChosenColor) {
                colorCheckbox.checked = true;
                content.find("input.color-source").prop('disabled', false).attr('checked', 'checked');
            }

            content = dialogContent.find('.custom-colors-'+me.colorTypes[c]);
            var customColorEditor = this.templateCustomColor.clone();
            customColorEditor.addClass(me.colorTypes[c]);
            content.append(customColorEditor);

            var redValue = me.templateColorValue.clone();
            redValue.addClass("custom-red-value");
            redValue.addClass(me.colorTypes[c]);
            if (me.activeColorCell[c] === -1) {
                redValue.val(parseInt(me.values.lineColor.substring(0,2),16));
                redValue.prop("disabled",false);
            }
            content.find('.colorcolumn1').append(redValue);
            content.find('label.custom-red-value').text('R');
            content.find('input.custom-red-value').attr('id',c+"red-value");

            var greenValue = me.templateColorValue.clone();
            greenValue.addClass("custom-green-value");
            greenValue.addClass(me.colorTypes[c]);
            if (me.activeColorCell[c] === -1) {
                greenValue.val(parseInt(me.values[cType].substring(2,4),16));
                greenValue.prop("disabled",false);
            }
            content.find('.colorcolumn21').append(greenValue);
            content.find('label.custom-green-value').text('G');
            content.find('input.custom-green-value').attr('id',c+"green-value");

            var blueValue = me.templateColorValue.clone();
            blueValue.addClass("custom-blue-value");
            blueValue.addClass(me.colorTypes[c]);
            if (me.activeColorCell[c] === -1) {
                blueValue.val(parseInt(me.values[cType].substring(4),16));
                blueValue.prop("disabled",false);
            }
            content.find('.colorcolumn22').append(blueValue);
            content.find('label.custom-blue-value').text('B');
            content.find('input.custom-blue-value').attr('id',c+"blue-value");

            // if the color is not picked from selection, it must be users own color
            // add color values to the input fields
            if(!statedChosenColor) {
                var rgb = me.instance.hexToRgb(me.values[cType]);

                content.find('input.custom-color.custom-red-value').val(rgb.r);
                content.find('input.custom-color.custom-green-value').val(rgb.g);
                content.find('input.custom-color.custom-blue-value').val(rgb.b);
            }

            content.find('.custom-color').change(function() {
                var colorType = this.id.substring(0,1);
                var values = [];
                values[0] = jQuery('input#'+colorType+'red-value').val();
                values[1] = jQuery('input#'+colorType+'green-value').val();
                values[2] = jQuery('input#'+colorType+'blue-value').val();
                // From integer to hex values
                for (var i = 0; i < 3; i++) {
                    var intValue = parseInt(values[i]);
                    if ((intValue < 0)||(intValue > 255)) return;
                    values[i] = intValue.toString(16);
                    if (values[i].length == 1) values[i] = '0' + values[i];
                }
                me.values[cType] = values.join('');
                me._updatePreview();
            });
        }

        // Fill style
        content = dialogContent.find('div.fill.icon-buttons');
        for (var i=0; i<me.fillButtonNames.length; i++) {
            var fillBtnContainer = me.templateButton.clone();
            fillBtnContainer.addClass(me.fillButtonNames[i]);
            fillBtnContainer.attr('id',i+"fillstyle");
            if (i === me.values.fillStyle) this._styleSelectedButton(fillBtnContainer);
            fillBtnContainer.click(function(){
                var newValue = parseInt(jQuery(this).attr('id').charAt(0));
                if (me.values.fillStyle === newValue) {
                    me.values.fillStyle = -1;
                    me._styleUnselectedButton(jQuery("div#"+newValue+"fillstyle.icon-button"));
                } else {
                    if (me.values.fillStyle !== -1) {
                        me._styleUnselectedButton(jQuery("div#"+me.values.fillStyle+"fillstyle.icon-button"));
                    }
                    me._styleSelectedButton(jQuery("div#"+newValue+"fillstyle.icon-button"));
                    me.values.fillStyle = newValue;
                }
                me._updatePreview(dialogContent);
            });
            content.append(fillBtnContainer);
        }

        if (this._supportsSVG()) this._updatePreview(dialogContent);

        var saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        saveBtn.setTitle(me.loc.buttons.save);
        saveBtn.addClass('primary showSelection');
        saveBtn.setHandler(function() {
            jQuery(".renderdialog").hide();
        });

        var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        cancelBtn.setTitle(me.loc.buttons.cancel);
        cancelBtn.setHandler(function() {
            me.values.lineWidth = me.defaultValues.line.width;
            me.values.lineCorner = me.defaultValues.line.corner;
            me.values.lineStyle = me.defaultValues.line.style;
            me.values.lineColor = me.defaultValues.color[0];
            me.values.fillColor = me.defaultValues.color[1];
            me.values.fillStyle = me.defaultValues.fill;
            jQuery(".renderdialog").hide();
        });
        renderDialog.show(title, dialogContent, [saveBtn, cancelBtn]);
        renderDialog.moveTo(renderButton, 'top');

    },

    /**
     * @method _selectButton
     * Selects the chosen button
     * @param {String} property Name of the edited property
     * @param {int} selectedButton Number of the selected button
     * @private
     */
    _selectButton : function(property,selectedButton) {
        var propertyType = property.substring(4).toLowerCase();
        this._styleUnselectedButton(jQuery("div#"+this.values[property]+"line"+propertyType+".icon-button"));
        this._styleSelectedButton(jQuery("div#"+selectedButton+"line"+propertyType+".icon-button"));
    },

    _updatePreview : function(dialog) {
        var me = this;
        var view = typeof dialog === "undefined" ? jQuery(".areaform") : dialog;
        var content = view.find('.preview');
        content.svg('destroy');
        content.svg({onLoad: function(svg) {
            var path = svg.createPath();
            var fill = (me.values.fillStyle < 0) ? "#"+me.values.fillColor :  "url(#"+me.fillButtonNames[me.values.fillStyle]+")";
            var g = svg.group({
                stroke: "#"+me.values.lineColor,
                fill: fill,
                strokeWidth: me.values.lineWidth,
                strokeLineJoin: me.values.lineCorner === 0 ? "miter" : "round",
                strokeDashArray: me.values.lineStyle === 1 ? [3,2+0.25*me.values.lineWidth] : null
            });

            // Patterns
            if (me.values.fillStyle >= 0) {
                var ptn = null;
                var ptnPath = svg.createPath();
                switch (me.values.fillStyle) {
                    case 0:
                        ptn = svg.pattern(me.fillButtonNames[me.values.fillStyle], 0, 0, 4, 4, 0, 0, 4, 4, {patternUnits: "userSpaceOnUse"});
                        svg.path(ptn,ptnPath.move(0,4,false).line([[4,0]]),{strokeWidth: 1,stroke: "#"+me.values.fillColor,fill:'none'});
                        break;
                    case 1:
                        ptn = svg.pattern(me.fillButtonNames[me.values.fillStyle], 0, 0, 6, 6, 0, 0, 6, 6, {patternUnits: "userSpaceOnUse"});
                        svg.path(ptn,ptnPath.move(-1,1,false).line([[1,-1]]).move(0,6,false).line([[6,0]]).move(5,7,false).line([[7,5]]),
                            {strokeWidth: 2,stroke: "#"+me.values.fillColor,fill:'none'});
                        break;
                    case 2:
                        ptn = svg.pattern(me.fillButtonNames[me.values.fillStyle], 0, 4, 4, 4, 0, 0, 4, 4, {patternUnits: "userSpaceOnUse"});
                        svg.path(ptn,ptnPath.move(0,0.5,false).line([[4,0.5]]),{strokeWidth: 1,stroke: "#"+me.values.fillColor,fill:'none'});
                        break;
                    case 3:
                        ptn = svg.pattern(me.fillButtonNames[me.values.fillStyle], 0, 0, 5, 5, 0, 0, 5, 5, {patternUnits: "userSpaceOnUse"});
                        svg.path(ptn,ptnPath.move(0,2,false).line([[5,2]]),{strokeWidth: 2,stroke: "#"+me.values.fillColor,fill:'none'});
                        break;
                }
            }

            var p1 = [10,17];
            var p2 = [40,12];
            var p3 = [29,40]; //29.33013,40.48076
            svg.path(g,path.move(p1[0],p1[1],false).line([p2,p3]).close());

            if (me.values.lineStyle === 2) {

                // double line
                var d = 2*(2.0+me.values.lineWidth);

                var t1 = Math.atan(Math.abs((p2[1]-p1[1])/(p2[0]-p1[0])));
                var p1a = [p1[0]+d*Math.sin(Math.PI/3+t1),p1[1]+d*Math.cos(Math.PI/3+t1)];

                var t2 = Math.atan(Math.abs((p3[1]-p2[1])/(p3[0]-p2[0])));
                var p2a = [p2[0]-d*Math.sin(Math.PI/3+t2),p2[1]-d*Math.cos(Math.PI/3+t2)];

                var t3 = Math.atan(Math.abs((p1[1]-p3[1])/(p1[0]-p3[0])));
                var p3a = [p3[0]-d*Math.cos(Math.PI/6+t3),p3[1]-d*Math.sin(Math.PI/6+t3)];

                svg.path(g,path.move(p1a[0],p1a[1],false).line([p2a,p3a]).close());
            }

        }});
    },


    /**
     * @method destroy
     * Removes eventlisteners
     */
/*    destroy : function() {
        // unbind live bindings
        var onScreenForm = this._getOnScreenForm();
        onScreenForm.find('select[name=areaform]').die();
    }, */
    /**
     * @method _getOnScreenForm
     * Returns reference to the on screen version shown by OpenLayers
     * @private
     */
    _getOnScreenForm : function() {
        return jQuery('div.renderdialog');
    },

    /**
     * @method getValues
     * Returns form values as an object
     * @return {Object}
     */
    /*
    getValues : function() {
        var newShape = null;
        for (var buttonName in this.symbolButtons) {
            var button = this.symbolButtons[buttonName];
            if (button.iconId.toString() === this.values.shape.toString()) {
                newShape = button.iconId;
                break;
            }
        }
        return {
          color: this.values.color
        };
    },
    */

    /**
     * @method _styleSelectedButton
     * Styles the selected button
     * @param {Object} selectedButton Selected button
     */
    _styleSelectedButton : function(selectedButton) {
        selectedButton.css("border","2px solid");
        selectedButton.css("background-color",this.selectColor);
    },

    /**
     * @method _styleUnselectedButton
     * Styles the unselected button
     * @param {Object} unselectedButton Unselected button
     */
    _styleUnselectedButton : function(unselectedButton) {
        unselectedButton.css("border","1px solid");
        unselectedButton.css("background-color","transparent");
    },

    /**
     * @method _getOnScreenForm
     * Check if the SVG graphics is supported by the browser
     * @private
     */
    _supportsSVG : function() {
        return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
    }
});
