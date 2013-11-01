/**
 * @class Oskari.userinterface.component.visualization-form.PointForm
 * 
 * Shows a form for point rendering options
 */
Oskari.clazz.define("Oskari.userinterface.component.visualization-form.PointForm",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.loc = instance.getLocalization('pointform');
    this.defaultValues = {
        size: instance.myPlacesService.defaults.point.size,
        color: instance.myPlacesService.defaults.point.color,
        shape: instance.myPlacesService.defaults.point.shape
    };
    this.values = {
        size: this.defaultValues.size,
        color: this.defaultValues.color,
        shape: this.defaultValues.shape
    };

    // Minimum dot size
    if ((this.instance.conf)&&(this.instance.conf.defaults)&&(this.instance.conf.defaults['dotMinSize'])) {
        this.minSize = this.instance.conf.defaults['dotMinSize'];
    } else {
        this.minSize = 1;
    }

    // Maximum dot size
    if ((this.instance.conf)&&(this.instance.conf.defaults)&&(this.instance.conf.defaults['dotMaxSize'])) {
        this.maxSize = this.instance.conf.defaults['dotMaxSize'];
    } else {
        this.maxSize = 5;
    }

    this.basicColors = ["#ffffff","#666666","#ffde00","#f8931f","#ff3334","#bf2652",
                        "#000000","#cccccc","#652d90","#3233ff","#26bf4b","#00ff01"];
    this.activeColorCell = 6;

    this.symbolButtons = {
        'square': {
            iconCls : 'marker-square',
            iconId: 1,
//            tooltip : loc.tooltip, //todo
            shape: {
                data: {
                    paths: [],
                    polygons: [[[310,68], [112,68], [112,266], [166.615,266], [210.583,335.832], [254.551,266], [310,266]]],
                    circles: []
                },
                offset : [210.583,335.832]
            }
        },
        'dot': {
            iconCls : 'marker-dot',
            iconId: 5,
//            tooltip : loc.tooltip, //todo
            shape: {
                data: {
                    paths: [],
                    polygons: [],
                    circles: [{
                        cx: 195.782,
                        cy: 185.718,
                        r: 93.782
                    }]
                },
                offset : [195.782, 185.718]
            }
        },
        'arrow': {
            iconCls: 'marker-arrow',
            iconId: 6,
//            tooltip : loc.tooltip, //todo
            shape: {
                data: {
                    paths: [],
                    polygons: [[[249,214], [249,69], [162,69], [162,214], [101.123,214], [205.25,331.832], [309.377,214]]],
                    circles: []
                },
                offset : [205.25,331.832]
            }
        },
        'pin': {
            iconCls: 'marker-pin',
            iconId: 3,
//            tooltip : loc.tooltip, //todo
            shape: {
                data: {
                    paths: [],
                    polygons: [[[183.893,323], [210.506,212.198], [191.684,208.229], [164.713,323]]],
                    circles: [{
                        cx: 217.199,
                        cy: 131,
                        r: 68
                    }]
                },
                offset : [174.303,323]
            }
        },
        'pin2': {
            iconCls: 'marker-pin2',
            iconId: 2,
//            tooltip : loc.tooltip, //todo
            shape: {
                data: {
                    paths: [[["move",[197.282,57.936],false],
                        ["curveC",[-51.795,0,-93.782,41.988,-93.782,93.782],true],
                        ["curveC",[0,51.795,93.782,174.782,93.782,174.782],true],
                        ["smoothC",[93.782,-122.987,93.782,-174.782],true],
                        ["curveC",[291.064,99.923,249.076,57.936,197.282,57.936],false],
                        ["close","",""]],
                        [["move",[197.5,190.5],false],
                        ["curveC",[-21.263,0,-38.5,-17.236,-38.5,-38.5],true],
                        ["smoothC",[17.237,-38.5,38.5,-38.5],true],
                        ["smoothC",[236,130.736,236,152],false],
                        ["smoothC",[218.763,190.5,197.5,190.5],false],
                        ["close","",""]]],
                    polygons: [],
                    circles: []
                },
                offset : [197.282,57.936]
            }
        },
        'stud': {
            iconCls: 'marker-stud',
            iconId: 0,
//            tooltip : loc.tooltip, //todo
            shape: {
                data: {
                    paths: [[["move",[228.465,61.808],false],
                        ["curveC",[-34.129,-6.2,-74.84,2.725,-67.242,18.748],true],
                        ["curveC",[10.313,21.754,18.316,38.636,24.535,51.754],true],
                        ["curveC",[-13.525,13.08,-32.082,31.028,-57.578,55.687],true],
                        ["curveC",[-15.447,14.94,26.929,42.415,68.291,49.929],true],
                        ["curveC",[41.36,7.514,90.696,-3.301,81.49,-22.719],true],
                        ["curveC",[-15.194,-32.051,-26.254,-55.379,-34.314,-72.38],true],
                        ["curveC",[10.436,-10.093,23.865,-23.081,41.171,-39.818],true],
                        ["curveC",[297.564,90.681,262.596,68.009,228.465,61.808],false],
                        ["close","",""]]],
                    polygons: [[[187.893,328], [201.506,253.198], [182.684,249.229], [168.713,328]]],
                    circles: []
                },
                offset : [178.303,328]
            }
        },
        'flag': {
            iconCls : 'marker-flag',
            iconId: 4,
//            tooltip : loc.tooltip, //todo
            shape: {
                data: {
                    paths: [],
                    polygons: [
                        [[270.732,341], [333.817,76.259], [313.429,76.248], [250.647,341]],
                        [[117.579,76], [144.322,145.722], [85,215], [265.541,215], [298.314,76]]
                    ],
                    circles: []
                },
                offset : [260.6895,341]
            }
        }
    };

    this.templateSymbolDialogContent = jQuery('<div class="pointform">' +
        '<div class="container">' +
            '<div class="column1">' +
                '<label>' + this.loc.symbol.label + '</label>' +
                '<div class="symbols icon-buttons"></div>' +
                '<label>' + this.loc.size.label + '</label><br>' +
                '<div class="sizer-values"></div>' +
                '<div class="sizer"></div>' +
            '</div>' +
            '<div class="column2">' +
                '<div class="column21">' +
                    '<label>' + this.loc.color.label + '</label>' +
                    '<div class="color-grid">' +
                        '<div class="color-rectangle"></div>'+
                    '</div>' +
                    '<div class="color-label">' +
                        '<label>' + this.loc.color.labelOr + '</label>' +
                    '</div>'+
                    '<div class="color-source-selector">'+
                        '<label>' + this.loc.color.labelCustom + '</label>' +
                    '</div>'+
                    '<div class="custom-colors"></div>'+
                '</div>' +
                '<div class="column22">' +
                    '<label>' + this.loc.preview.label + '</label>' +
                    '<div class="preview"></div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>');
    this.templateSymbolButton = jQuery('<div class="icon-button"></div>');
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
    this.templateSizerValue = jQuery('<div class="sizer-value"></div>');
    this.previewSize = 50;
}, {
    /**
     * @method showForm
     * @param {Oskari.mapframework.bundle.myplaces2.model.MyPlacesCategory[]} categories array containing available categories
     * @return {jQuery} jquery reference for the form 
     */
    showForm : function(renderButton, state) {
        var me = this;
        if(state != null) {
            jQuery.extend(true, me.values, state.dot);
        }

        var renderDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

        renderDialog.addClass('renderdialog');
        renderDialog.addClass('pointvisualization');
        var title = me.loc.title;

        // Shape selection
        var dialogContent = me.templateSymbolDialogContent.clone();
        var content = dialogContent.find('div.symbols');
        for (var buttonName in this.symbolButtons) {
            var btnContainer = this.templateSymbolButton.clone();
            var button = this.symbolButtons[buttonName];
        	btnContainer.addClass(button.iconCls);
            btnContainer.attr('id',button.iconId+"marker");
            if (button.iconId === me.values.shape) btnContainer.css("border","2px solid");
            btnContainer.click(function(){
                me.values.shape = parseInt(jQuery(this).attr('id').charAt(0));
                me._selectButton(me.values.shape);
                me._updatePreview(dialogContent);
            });
            content.append(btnContainer);
        }

        // Size slider
        var nSizeValues = 10;
        var sizerWidth = 110;
        var numIntervals = me.maxSize-me.minSize;
        var intervalWidth = sizerWidth/numIntervals;
        var numVisValues = 0;

        content = dialogContent.find('.sizer-values');
        for (var i = 1; i <= nSizeValues; i++) {
            var newSizerValue = me.templateSizerValue.clone();
            newSizerValue.html(i);
            newSizerValue.addClass('value'+i);
            if ((i < me.minSize)||((i > me.maxSize))) {
                newSizerValue.hide();
            } else {
                var position = numVisValues*intervalWidth.toString()+"px";
                newSizerValue.css('left',position);
                newSizerValue.show();
                numVisValues = numVisValues+1;
            }
            content.append(newSizerValue);
        }

        content = dialogContent.find('.sizer');
        content.slider({
            range : "min",
            min : me.minSize,
            max : me.maxSize,
            value : this.values.size,
            slide : function(event, ui) {
                me.values.size = ui.value;
                me._updatePreview(dialogContent);
            }
        });

        var statedChosenColor = false;
        // Color chooser
        content = dialogContent.find('.color-rectangle');
        for (var i = 0; i < me.basicColors.length; i++) {
            var colorCell = me.templateColorCell.clone();
            colorCell.css('background-color',me.basicColors[i]);
            var idExt = "ColorCell";
            var id = i+idExt;
            if (id.length === idExt.length+1) id = "0"+id;
            colorCell.attr("id",id);
            colorCell.click(function(){
                if (jQuery('.color-source').prop('checked')) return;
                var cellIndex = parseInt(this.id.substring(0,2),10);
                if (cellIndex === me.activeColorCell) return;
                if (me.activeColorCell > -1) {
                    var activeCell = me.activeColorCell.toString();
                    if (me.activeColorCell < 10) activeCell = "0"+activeCell;
                    jQuery('#'+activeCell+'ColorCell').css('border','1px solid #000000');
                }
                me.values.color = me.instance.rgbToHex(this.style.backgroundColor);
                me.activeColorCell = cellIndex;
                if (cellIndex < 10) cellIndex = "0"+cellIndex.toString();
                jQuery('#'+cellIndex+'ColorCell').css('border','3px solid #ffffff');
                me._updatePreview(dialogContent);
            });
            //instead of selecting always black,
            // we should use the color that comes from the state
            if ('#'+me.values.color == me.basicColors[i]) {
                colorCell.css('border','3px solid #ffffff');
                me.activeColorCell = i;
                statedChosenColor = true;
            }
            content.append(colorCell);
        }

        // Custom color
        content = dialogContent.find('.color-source-selector');
        var colorCheckbox = me.templateColorSource.clone();

        colorCheckbox.change(function() {
            jQuery("input.custom-color").prop('disabled',!this.checked);
            var activeCell = jQuery("#"+me.activeColorCell+"ColorCell");
            if (this.checked) {
                activeCell.css('border','1px solid #000000');
            } else {
                activeCell.css('border','3px solid #ffffff');
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

        content = dialogContent.find('.custom-colors');
        var customColorEditor = this.templateCustomColor.clone();
        content.append(customColorEditor);

        var redValue = me.templateColorValue.clone();
        redValue.addClass('custom-red-value');
        dialogContent.find('.colorcolumn1').append(redValue);
        dialogContent.find('label.custom-red-value').text('R');

        var greenValue = me.templateColorValue.clone();
        greenValue.addClass('custom-green-value');
        dialogContent.find('.colorcolumn21').append(greenValue);
        dialogContent.find('label.custom-green-value').text('G');

        var blueValue = me.templateColorValue.clone();
        blueValue.addClass('custom-blue-value');
        dialogContent.find('.colorcolumn22').append(blueValue);
        dialogContent.find('label.custom-blue-value').text('B');

        // if the color is not picked from selection, it must be users own color
        // add color values to the input fields
        if(!statedChosenColor) {
            var rgb = me.instance.hexToRgb(me.values.color);

            dialogContent.find('input.custom-color.custom-red-value').val(rgb.r);
            dialogContent.find('input.custom-color.custom-green-value').val(rgb.g);
            dialogContent.find('input.custom-color.custom-blue-value').val(rgb.b);
            dialogContent.find('input.custom-color').prop('disabled',false);
        }

        dialogContent.find('.custom-color').change(function() {
            var values = [];
            values[0] = jQuery('input.custom-color.custom-red-value').val();
            values[1] = jQuery('input.custom-color.custom-green-value').val();
            values[2] = jQuery('input.custom-color.custom-blue-value').val();
            // From integer to hex values
            for (var i = 0; i < 3; i++) {
                var intValue = parseInt(values[i]);
                if ((intValue < 0)||(intValue > 255)) return;
                values[i] = intValue.toString(16);
                if (values[i].length == 1) values[i] = '0' + values[i];
            }
            me.values.color = values.join('');
            me._updatePreview();
        });

        if (this._supportsSVG()) this._updatePreview(dialogContent);

        var saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        saveBtn.setTitle(me.loc.buttons.save);
        saveBtn.addClass('primary showSelection');
        saveBtn.setHandler(function() {
            renderDialog.close();
        });

        var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        cancelBtn.setTitle(me.loc.buttons.cancel);
        cancelBtn.setHandler(function() {
            me.values.size = me.defaultValues.size;
            me.values.color = me.defaultValues.color;
            me.values.shape = me.defaultValues.shape;
            renderDialog.close();
        });
        renderDialog.show(title, dialogContent, [saveBtn, cancelBtn]);
        renderDialog.moveTo(renderButton, 'top');
        return renderDialog;
    },

    /**
     * @method _selectButton
     * Selects the chosen button
     * @param {String} selectedButton Name of the selected button
     * @private
     */
    _selectButton : function(selectedButton) {
        for (var buttonName in this.symbolButtons) {
            var button = this.symbolButtons[buttonName];
            var container = jQuery("div#"+button.iconId+"marker.icon-button");
            if (button.iconId.toString() === selectedButton.toString()) {
                container.css("border","2px solid");
            } else {
                container.css("border","1px solid");
            }
        }
    },

    // Väliaikaisesti näin
    _updatePreview : function(dialog) {
        var me = this;
        var view = typeof dialog === "undefined" ? jQuery(".pointform") : dialog;
        var content = view.find('.preview');
        var scaleFactor = me.values.size/35;
        var svgOriginalSize = 400;
        var svgNewSize = svgOriginalSize*scaleFactor;
        var offset = 0.5*(me.previewSize-svgNewSize);
        var options = {fill: "#"+me.values.color};
        var coords = [];

        content.svg('destroy');
        content.svg({onLoad: function(svg) {
            var shapes = null;
            for (var buttonName in me.symbolButtons) {
                var button = me.symbolButtons[buttonName];
                if (button.iconId.toString() === me.values.shape.toString()) {
                    shapes = button.shape.data;
                    break;
                }
            }
            // Polygons
            for (var i = 0; i < shapes.polygons.length; i++) {
                coords = [];
                for (var j = 0; j < shapes.polygons[i].length; j++) {
                    coords.push([]);
                    for (var k = 0; k < 2; k++) {
                        coords[j][k] = scaleFactor*shapes.polygons[i][j][k]+offset;
                    }
                }
                svg.polygon(coords, options);
            }
            // Circles
            for (i = 0; i < shapes.circles.length; i++) {
                var cx = scaleFactor*shapes.circles[i].cx+offset;
                var cy = scaleFactor*shapes.circles[i].cy+offset;
                var r = scaleFactor*shapes.circles[i].r;
                svg.circle(cx, cy, r, options);
            }

            if (shapes.paths.length > 0) {
                var path = svg.createPath();
                var renderPath = path.move(0,0,false);
                // Paths
                for (i = 0; i < shapes.paths.length; i++) {
                    for (j = 0; j < shapes.paths[i].length; j++) {
                        var item = shapes.paths[i][j];
                        coords = [];
                        for (k = 0; k < item[1].length; k++) {
                            coords[k] = scaleFactor*item[1][k];
                            if (!item[2]){
                                coords[k] = coords[k]+offset;
                            }
                        }
                        switch(item[0]) {
                            case "move":
                                renderPath.move(coords[0],coords[1],item[2]);
                                break;
                            case "curveC":
                                renderPath.curveC(coords[0],coords[1],coords[2],coords[3],coords[4],coords[5],item[2]);
                                break;
                            case "smoothC":
                                renderPath.smoothC(coords[0],coords[1],coords[2],coords[3],item[2]);
                                break;
                            case "close":
                                renderPath.close();
                                break;
                      }
                    }
                }
                svg.path(renderPath,options);
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
        onScreenForm.find('select[name=pointform]').die();
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
          color: this.values.color,
          size: this.values.size,
          shape: newShape
//          shape: this.symbolButtons[this.values.shape].iconId
        };
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
