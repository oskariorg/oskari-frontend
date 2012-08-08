/**
 * @class Oskari.mapframework.bundle.myplaces2.view.CategoryForm
 * 
 * Shows a form for a myplaces category
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplaces2.view.CategoryForm",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    
    var loc = instance.getLocalization('categoryform');
    
    this.template = jQuery('<div class="myplacescategoryform">' +
            '<div class="field">' +   
                '<label for="categoryname">' + loc.name.label + '</label><br clear="all" />' +
                '<input type="text" name="categoryname" placeholder="' + loc.name.placeholder + '"/>' +
            '</div>' +
            '<div class="field drawing">' + 
                '<label>' + loc.drawing.label + '</label><br clear="all" />' +
                '<table></table>' +
            '</div>' +
        '</div>');
    this.templateTableRow = jQuery('<tr></tr>');
    this.templateTableCell = jQuery('<td></td>');
    this.templateTextInput = jQuery('<input type="text"/>');
    this.defaults = {
        dotSize : 4,
        dotColor : '6996FF',
        lineSize : 2,
        lineColor : '82202A',
        areaLineSize : 1,
        areaLineColor : '000000',
        areaFillColor : 'FFF71C'
    };
}, {
    /**
     * @method getForm
     * @return {jQuery} jquery reference for the form 
     */
    getForm : function() {
        var ui = this.template.clone();
        var table = ui.find('div.drawing table');
        this._populatePointTool(table);
        this._populateLineTool(table);
        this._populateAreaTool(table);
        // bind pickers, this is a workaround since Openlayers popup will lose any bindings
        // with live it is rebinded on render 
        // apparently jscolor can manage without this \o/
        /*
        jQuery('div.myplacescategoryform input.oskaricolor').live('click', function() {
            if(!this.picker) {
                this.picker = new jscolor.color(this);
                this.picker.showPicker();
            }
        });*/
        return ui;
    },
    /**
     * @method getValues
     * Returns form values as an object
     * @return {Object} 
     */
    getValues : function() {
        var values = {};
        // infobox will make us lose our reference so search 
        // from document using the form-class
        var onScreenForm = this._getOnScreenForm();
        
        if(onScreenForm.length > 0) {
            // found form on screen
            var catName = onScreenForm.find('input[name=categoryname]').val();
            values.name = catName;
            var dotSize = onScreenForm.find('input[name=dotSize]').val();
            var dotColor = onScreenForm.find('input[name=dotColor]').val();
            values.dot = {
                size : dotSize,
                color : dotColor
            }
            var lineSize = onScreenForm.find('input[name=lineSize]').val();
            var lineColor = onScreenForm.find('input[name=lineColor]').val();
            values.line = {
                size : lineSize,
                color : lineColor
            }
            var areaLineSize = onScreenForm.find('input[name=areaLineSize]').val();
            var areaLineColor = onScreenForm.find('input[name=areaLineColor]').val();
            var areaFillColor = onScreenForm.find('input[name=areaFillColor]').val();
            values.area = {
                size : areaLineSize,
                lineColor : areaLineColor,
                fillColor : areaFillColor
            }
        }
        return values;
    },
    _createInput : function(name, value, classes) {
        var input = this.templateTextInput.clone();
        input.attr('name', name);
        input.attr('value', value);
        if(classes) {
            input.attr('class', classes);
        }
        if(classes == 'oskaricolor') {
            input.picker = new jscolor.color(input[0]);
        }
        return input;
    },
    _populatePointTool : function(table) {
        var loc = this.instance.getLocalization('categoryform').drawing.point;
        
        var labelRow = this.templateTableRow.clone();
        for(var title in loc) {
            var label = this.templateTableCell.clone();
            label.append(loc[title]);
            labelRow.append(label);
        }
        // empty cell because area tool has one extra
        labelRow.append(this.templateTableCell.clone());
        
        var toolRow = this.templateTableRow.clone();
        // empty cell
        toolRow.append(this.templateTableCell.clone());
        
        var pointColorpicker = this.templateTableCell.clone();
        pointColorpicker.append(
            this._createInput('dotColor', this.defaults.dotColor, 'oskaricolor'));
        toolRow.append(pointColorpicker);
        
        var size = this.templateTableCell.clone();
        size.append(this._createInput('dotSize', this.defaults.dotSize));
        toolRow.append(size);
        
        // empty cell because area tool has one extra
        toolRow.append(this.templateTableCell.clone());
        
        table.append(labelRow);
        table.append(toolRow);
    },
    _populateLineTool : function(table) {
        var loc = this.instance.getLocalization('categoryform').drawing.line;
        
        var labelRow = this.templateTableRow.clone();
        for(var title in loc) {
            var label = this.templateTableCell.clone();
            label.append(loc[title]);
            labelRow.append(label);
        }
        // empty cell because area tool has one extra
        labelRow.append(this.templateTableCell.clone());
        
        var toolRow = this.templateTableRow.clone();
        // empty cell
        toolRow.append(this.templateTableCell.clone());
        
        var lineColorpicker = this.templateTableCell.clone();
        lineColorpicker.append(
            this._createInput('lineColor', this.defaults.lineColor, 'oskaricolor'));
        toolRow.append(lineColorpicker);
        
        var size = this.templateTableCell.clone();
        size.append(this._createInput('lineSize', this.defaults.lineSize));
        toolRow.append(size);
        
        // empty cell because area tool has one extra
        toolRow.append(this.templateTableCell.clone());
        
        table.append(labelRow);
        table.append(toolRow);
    },
    _populateAreaTool : function(table) {
        var loc = this.instance.getLocalization('categoryform').drawing.area;
        
        var labelRow = this.templateTableRow.clone();
        for(var title in loc) {
            var label = this.templateTableCell.clone();
            label.append(loc[title]);
            labelRow.append(label);
        }
        var toolRow = this.templateTableRow.clone();
        // empty cell
        toolRow.append(this.templateTableCell.clone());
        
        var areaColorpicker = this.templateTableCell.clone();
        areaColorpicker.append(
            this._createInput('areaFillColor', this.defaults.areaFillColor, 'oskaricolor'));
        toolRow.append(areaColorpicker);
        
        var lineColorpicker = this.templateTableCell.clone();
        lineColorpicker.append(
            this._createInput('areaLineColor', this.defaults.areaLineColor, 'oskaricolor'));
        toolRow.append(lineColorpicker);
        
        var size = this.templateTableCell.clone();
        size.append(this._createInput('areaLineSize', this.defaults.areaLineSize));
        toolRow.append(size);
        
        table.append(labelRow);
        table.append(toolRow);
    },
    /**
     * @method _getOnScreenForm
     * Returns reference to the on screen version shown by OpenLayers 
     * @private
     */
    _getOnScreenForm : function() {
        return jQuery('div.myplacescategoryform');
    },
    /**
     * @method destroy
     */
    destroy : function() {
        // remember to remove live bindings if any
        //jQuery('div.myplacescategoryform input.oskaricolor').off();
        var onScreenForm = this._getOnScreenForm();
        onScreenForm.remove();
    }
});
