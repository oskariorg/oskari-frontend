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
            cap: instance.myPlacesService.defaults.area.linecap,
            corner: instance.myPlacesService.defaults.area.linecorner,
            width: instance.myPlacesService.defaults.area.linewidth
        },
        fill: instance.myPlacesService.defaults.area.fill
    };
    this.values = {
        color: this.defaultValues.color,
        line: {
            style: this.defaultValues.line.style,
            cap: this.defaultValues.line.cap,
            corner: this.defaultValues.line.corner,
            width: this.defaultValues.line.width
        },
        fill: this.defaultValues.fill
    };

    this.styleButtonNames = ["icon-line-basic", "icon-line-dashed", "icon-double-line"];
    this.capButtonNames = ["icon-line-flat_cap", "icon-line-round_cap"];
    this.cornerButtonNames = ["icon-corner-sharp", "icon-corner-round"];

    this.colorTypes = ["line","fill"];
    this.basicColors = ["#ffffff","#666666","#ffde00","#f8931f","#ff3334","#bf2652",
                        "#000000","#cccccc","#652d90","#3233ff","#26bf4b","#00ff01"];
    this.activeColorCell = [-1,-1];
    // Default color
    for (var i = 0; i < this.basicColors.length; i++) {
        for (var j = 0; j < this.basicColors.length; j++) {
            if (this.basicColors[j] === "#"+this.values.color[i]) {
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
                '<label>' + this.loc.linecap.label + '</label>' +
                '<div class="cap icon-buttons"></div>' +
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
    this.templateWidthValue = jQuery('<input type="number" name="width" class="linewidth" min="'+this.minWidth+'" max="'+this.maxWidth+'" step=1 value="'+this.values.line.width+'">');
    this.previewSize = 50;
    this.selectColor = "#dddddd";
}, {
    /**
     * @method showForm
     * @param {Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory[]} categories array containing available categories
     * @return {jQuery} jquery reference for the form
     */
    showForm : function(renderButton) {
        var me = this;
        var renderDialog = me._getOnScreenForm();
        renderDialog.die();
        renderDialog.remove();
        renderDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

        renderDialog.addClass('top');
        renderDialog.addClass('arrow');
        renderDialog.addClass('renderdialog');
        var title = me.loc.title;

        // Line style
        var dialogContent = me.templateAreaStyleDialogContent.clone();
        var content = dialogContent.find('div.style');
        for (var i=0; i<me.styleButtonNames.length; i++) {
            var styleBtnContainer = me.templateButton.clone();
            styleBtnContainer.addClass(me.styleButtonNames[i]);
            styleBtnContainer.attr('id',i+"linestyle");
            if (i === me.values.line.style) this._styleSelectedButton(styleBtnContainer);
            styleBtnContainer.click(function(){
                var newValue = parseInt(jQuery(this).attr('id').charAt(0));
                me._selectButton("style",newValue);
                me.values.line.style = newValue;
                me._updatePreview(dialogContent);
            });
            content.append(styleBtnContainer);
        }

        // Line cap
        content = dialogContent.find('div.cap');
        for (var i=0; i<me.capButtonNames.length; i++) {
            var capBtnContainer = me.templateButton.clone();
            capBtnContainer.addClass(me.capButtonNames[i]);
            capBtnContainer.attr('id',i+"linecap");
            if (i === me.values.line.cap) this._styleSelectedButton(capBtnContainer);
            capBtnContainer.click(function(){
                var newValue = parseInt(jQuery(this).attr('id').charAt(0));
                me._selectButton("cap",newValue);
                me.values.line.cap = newValue;
                me._updatePreview(dialogContent);
            });
            content.append(capBtnContainer);
        }

        // Line corner
        content = dialogContent.find('div.corner');
        for (var i=0; i<me.cornerButtonNames.length; i++) {
            var cornerBtnContainer = me.templateButton.clone();
            cornerBtnContainer.addClass(me.cornerButtonNames[i]);
            cornerBtnContainer.attr('id',i+"linecorner");
            if (i === me.values.line.corner) this._styleSelectedButton(cornerBtnContainer);
            cornerBtnContainer.click(function(){
                var newValue = parseInt(jQuery(this).attr('id').charAt(0));
                me._selectButton("corner",newValue);
                me.values.line.corner = newValue;
                me._updatePreview(dialogContent);
            });
            content.append(cornerBtnContainer);
        }

        // Line width
        content = dialogContent.find('div.width');
        var widthSpinner = me.templateWidthValue.clone();
        widthSpinner.change(function() {
            var newValue = parseInt(widthSpinner.val(),10);
            if (!isNaN(newValue)) {
                me.values.line.width = newValue;
                me._updatePreview();
            }
        });
        content.append(widthSpinner);

        // Color chooser
        for (var c = 0; c < 2; c++) {
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
                    var parts = this.style.backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                    delete (parts[0]);
                    for (var j = 1; j <= 3; ++j) {
                        parts[j] = parseInt(parts[j]).toString(16);
                        if (parts[j].length == 1) parts[j] = '0' + parts[j];
                    }
                    me.values.color[colorType] = parts.join('');
                    me.activeColorCell[colorType] = cellIndex;
                    if (cellIndex < 10) cellIndex = "0"+cellIndex.toString();
                    jQuery('#'+cellIndex+colorType+'ColorCell').css('border','3px solid #ffffff');
                    me._updatePreview(dialogContent);
                });
                if (i === this.activeColorCell[c]) colorCell.css('border','3px solid #ffffff');
                content.append(colorCell);
            }

            // Custom color
            content = dialogContent.find('.color-source-selector-'+me.colorTypes[c]);
            var colorCheckbox = me.templateColorSource.clone();
            colorCheckbox.attr("id",c+"color-checkbox");
            // If the default value is not included in the color cells
            if (me.activeColorCell[c] === -1) colorCheckbox.attr("checked",true);
            colorCheckbox.change(function() {
                var colorType = this.id.substring(0,1);
                jQuery('input.custom-color.'+me.colorTypes[colorType]).prop('disabled',!this.checked);
                var cell = me.activeColorCell[colorType].toString();
                if (me.activeColorCell[colorType] < 10) cell = "0"+cell;
                var activeCell = jQuery("#"+cell+colorType+"ColorCell");
                if (this.checked) {
                    activeCell.css('border','1px solid #000000');
                    jQuery(".custom-red-value."+me.colorTypes[colorType]).val(parseInt(me.values.color[colorType].substring(0,2),16));
                    jQuery(".custom-green-value."+me.colorTypes[colorType]).val(parseInt(me.values.color[colorType].substring(2,4),16));
                    jQuery(".custom-blue-value."+me.colorTypes[colorType]).val(parseInt(me.values.color[colorType].substring(4),16));
                    me.activeColorCell[colorType] = -1;
                } else {
                    // activeCell.css('border','3px solid #ffffff');
                }
                me._updatePreview(dialogContent);
            });
            content.prepend(colorCheckbox);

            content = dialogContent.find('.custom-colors-'+me.colorTypes[c]);
            var customColorEditor = this.templateCustomColor.clone();
            customColorEditor.addClass(me.colorTypes[c]);
            content.append(customColorEditor);

            var redValue = me.templateColorValue.clone();
            redValue.addClass("custom-red-value");
            redValue.addClass(me.colorTypes[c]);
            if (me.activeColorCell[c] === -1) {
                redValue.val(parseInt(me.values.color[0].substring(0,2),16));
                redValue.prop("disabled",false);
            }
            content.find('.colorcolumn1').append(redValue);
            content.find('label.custom-red-value').text('R');
            content.find('input.custom-red-value').attr('id',c+"red-value");

            var greenValue = me.templateColorValue.clone();
            greenValue.addClass("custom-green-value");
            greenValue.addClass(me.colorTypes[c]);
            if (me.activeColorCell[c] === -1) {
                greenValue.val(parseInt(me.values.color[c].substring(2,4),16));
                greenValue.prop("disabled",false);
            }
            content.find('.colorcolumn21').append(greenValue);
            content.find('label.custom-green-value').text('G');
            content.find('input.custom-green-value').attr('id',c+"green-value");

            var blueValue = me.templateColorValue.clone();
            blueValue.addClass("custom-blue-value");
            blueValue.addClass(me.colorTypes[c]);
            if (me.activeColorCell[c] === -1) {
                blueValue.val(parseInt(me.values.color[c].substring(4),16));
                blueValue.prop("disabled",false);
            }
            content.find('.colorcolumn22').append(blueValue);
            content.find('label.custom-blue-value').text('B');
            content.find('input.custom-blue-value').attr('id',c+"blue-value");

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
                me.values.color[colorType] = values.join('');
                me._updatePreview();
            });
        }

        // Fill style
        content = dialogContent.find('div.fill.icon-buttons');
        for (var i=0; i<me.fillButtonNames.length; i++) {
            var fillBtnContainer = me.templateButton.clone();
            fillBtnContainer.addClass(me.fillButtonNames[i]);
            fillBtnContainer.attr('id',i+"fillstyle");
            if (i === me.values.fill) this._styleSelectedButton(fillBtnContainer);
            fillBtnContainer.click(function(){
                var newValue = parseInt(jQuery(this).attr('id').charAt(0));
                if (me.values.fill === newValue) {
                    me.values.fill = -1;
                    me._styleUnselectedButton(jQuery("div#"+newValue+"fillstyle.icon-button"));
                } else {
                    if (me.values.fill !== -1) {
                        me._styleUnselectedButton(jQuery("div#"+me.values.fill+"fillstyle.icon-button"));
                    }
                    me._styleSelectedButton(jQuery("div#"+newValue+"fillstyle.icon-button"));
                    me.values.fill = newValue;
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
            me.values.size = me.defaultValues.size;
            me.values.color = me.defaultValues.color;
            me.values.shape = me.defaultValues.shape;
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
        this._styleUnselectedButton(jQuery("div#"+this.values.line[property]+"line"+property+".icon-button"));
        this._styleSelectedButton(jQuery("div#"+selectedButton+"line"+property+".icon-button"));
    },

    _updatePreview : function(dialog) {
        var me = this;
        var view = typeof dialog === "undefined" ? jQuery(".areaform") : dialog;
        var content = view.find('.preview');
        content.svg('destroy');
        content.svg({onLoad: function(svg) {
            var path = svg.createPath();
            var fill = (me.values.fill < 0) ? "#"+me.values.color[1] :  "url(#"+me.fillButtonNames[me.values.fill]+")";
            var g = svg.group({
                stroke: "#"+me.values.color[0],
                fill: fill,
                strokeWidth: me.values.line.width,
                strokeLineJoin: me.values.line.corner === 0 ? "miter" : "round",
                strokeLineCap: me.values.line.cap === 0 ? "butt" : "round",
                strokeDashArray: me.values.line.style === 1 ? [3,2+0.25*me.values.line.width] : null
            });

            // Patterns
            if (me.values.fill >= 0) {
                var ptn = null;
                var ptnPath = svg.createPath();
                switch (me.values.fill) {
                    case 0:
                        ptn = svg.pattern(me.fillButtonNames[me.values.fill], 0, 0, 4, 4, 0, 0, 4, 4, {patternUnits: "userSpaceOnUse"});
                        svg.path(ptn,ptnPath.move(0,4,false).line([[4,0]]),{strokeWidth: 1,stroke: "#"+me.values.color[1],fill:'none'});
                        break;
                    case 1:
                        ptn = svg.pattern(me.fillButtonNames[me.values.fill], 0, 0, 6, 6, 0, 0, 6, 6, {patternUnits: "userSpaceOnUse"});
                        svg.path(ptn,ptnPath.move(-1,1,false).line([[1,-1]]).move(0,6,false).line([[6,0]]).move(5,7,false).line([[7,5]]),
                            {strokeWidth: 2,stroke: "#"+me.values.color[1],fill:'none'});
                        break;
                    case 2:
                        ptn = svg.pattern(me.fillButtonNames[me.values.fill], 0, 4, 4, 4, 0, 0, 4, 4, {patternUnits: "userSpaceOnUse"});
                        svg.path(ptn,ptnPath.move(0,0.5,false).line([[4,0.5]]),{strokeWidth: 1,stroke: "#"+me.values.color[1],fill:'none'});
                        break;
                    case 3:
                        ptn = svg.pattern(me.fillButtonNames[me.values.fill], 0, 0, 5, 5, 0, 0, 5, 5, {patternUnits: "userSpaceOnUse"});
                        svg.path(ptn,ptnPath.move(0,2,false).line([[5,2]]),{strokeWidth: 2,stroke: "#"+me.values.color[1],fill:'none'});
                        break;
                }
            }

            var p1 = [10,17];
            var p2 = [40,12];
            var p3 = [29,40]; //29.33013,40.48076
            svg.path(g,path.move(p1[0],p1[1],false).line([p2,p3]).close());

            if (me.values.line.style === 2) {

                // double line
                var d = 2*(2.0+me.values.line.width);

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
