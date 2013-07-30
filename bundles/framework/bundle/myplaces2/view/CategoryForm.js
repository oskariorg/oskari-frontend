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
    // problems in demo with autodetect
    jscolor.dir = '/Oskari/libraries/jscolor/';
    
    var loc = instance.getLocalization('categoryform');
    
    this.template = jQuery('<div class="myplacescategoryform">' +
            '<div class="field">' +   
                '<label for="categoryname">' + loc.name.label + '</label><br clear="all" />' +
                '<input type="text" name="categoryname" placeholder="' + loc.name.placeholder + '"/>' +
            '</div>' +
            '<div class="field drawing">' + 
                '<label>' + loc.drawing.label + '</label><br clear="all" />' +
                '<ul>Tähän tulis kolme linkkiä, joista voi valita värejä yms.</ul>' +
            '</div>' +
            '<div class="field visibleFields">' +
                '<label>' + loc.visibleFields.label + '</label><br clear="all" />' +
                '<input type="checkbox" name="placename" checked="checked" />' + loc.visibleFields.placename + '<br/>' +
                '<input type="checkbox" name="placedesc" checked="checked" />' + loc.visibleFields.placedesc + '<br/>' +
                '<input type="checkbox" name="image" checked="checked" />' + loc.visibleFields.image + '<br/>' +
            '</div>' +
        '</div>');
    this.templateTableRow = jQuery('<tr></tr>');
    this.templateTableCell = jQuery('<td></td>');
    this.templateTextInput = jQuery('<input type="text"/>');
    this.defaults = {
        dotSize : 4,
        dotColor : 'cc9900',
        lineSize : 2,
        lineColor : 'cc9900',
        areaLineSize : 2,
        areaLineColor : 'cc9900',
        areaFillColor : 'ffdc00'
    };
    this.categoryId = undefined;
    this._isDefault = undefined;
    this.initialValues = undefined;
}, {
    /**
     * @method getForm
     * @return {jQuery} jquery reference for the form 
     */
    getForm : function() {
        var ui = this.template.clone();
        var table = ui.find('div.drawing table');
        //this._populatePointTool(table);
        //this._populateLineTool(table);
        //this._populateAreaTool(table);
        
        if(this.initialValues) {
            ui.find('input[name=categoryname]').attr('value', this.initialValues.name);
            ui.find('input[name=dotSize]').attr('value', this.initialValues.dot.size);
            //document.getElementById('myColor').color.fromString('F2C80A')
            var dotColor = ui.find('input[name=dotColor]');
            dotColor.attr('value', this.initialValues.dot.color);
            new jscolor.color(dotColor[0]);
            //.fromString(this.initialValues.dot.color)
            //.attr('value', this.initialValues.dot.color);
            ui.find('input[name=lineSize]').attr('value', this.initialValues.line.size);
            
            var lineColor = ui.find('input[name=lineColor]');
            lineColor.attr('value', this.initialValues.line.color);
            new jscolor.color(lineColor[0]);
            //ui.find('input[name=lineColor]').attr('value', this.initialValues.line.color);
            
            ui.find('input[name=areaLineSize]').attr('value', this.initialValues.area.size);
            
            var areaLineColor = ui.find('input[name=areaLineColor]');
            areaLineColor.attr('value', this.initialValues.area.lineColor);
            new jscolor.color(areaLineColor[0]);
            //ui.find('input[name=areaLineColor]').attr('value', this.initialValues.area.lineColor);
            
            var areaFillColor = ui.find('input[name=areaFillColor]');
            areaFillColor.attr('value', this.initialValues.area.fillColor);
            new jscolor.color(areaFillColor[0]);
            //ui.find('input[name=areaFillColor]').attr('value', this.initialValues.area.fillColor);

            this._checkVisibleFields(this.initialValues.visibleFields);
        }
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
            if(this.categoryId) {
                values.id = this.categoryId;
            }
            values._isDefault = this._isDefault || false;
            
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

            // Get the names of the fields the user has checked.
            values.visibleFields = [];
            onScreenForm.find('div.visibleFields').find('input[type=checkbox]:checked').each(function() {
                values.visibleFields.push(this.name);
            });
        }
        return values;
    },
    /**
     * @method setValues
     * Sets form values from object.
     * @param {Object} data place data as formatted in #getValues() 
     */
    setValues : function(data) {
        this.categoryId = data.id;
        this._isDefault = data._isDefault;
        // infobox will make us lose our reference so search 
        // from document using the form-class
        var onScreenForm = this._getOnScreenForm();
        
        if(onScreenForm.length > 0) {
            // found form on screen
            onScreenForm.find('input[name=categoryname]').val(data.name);
            onScreenForm.find('input[name=dotSize]').val(data.dot.size);
            onScreenForm.find('input[name=dotColor]').val(data.dot.color);
            onScreenForm.find('input[name=lineSize]').val(data.line.size);
            onScreenForm.find('input[name=lineColor]').val(data.line.color);
            
            onScreenForm.find('input[name=areaLineSize]').val(data.area.size);
            onScreenForm.find('input[name=areaLineColor]').val(data.area.lineColor);
            onScreenForm.find('input[name=areaFillColor]').val(data.area.fillColor);

            this._checkVisibleFields(data.visibleFields);
        }
        
        this.initialValues = data;
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
     * Unchecks all the check boxes and checks those which are in the visibleFields array.
     *
     * @method _checkVisibleFields
     * @param {Array[String]} visibleFields
     */
    _checkVisibleFields: function(visibleFields) {
        if (!visibleFields || !visibleFields.length) {
            return;
        }
        var ui = this._getOnScreenForm();
        // Let's uncheck all checkboxes
        ui.find('div.visibleFields').find('input[type=checkbox]').removeAttr('checked');
        // And check those which are in the initial values.
        for (var i = 0; i < visibleFields.length; ++i) {
            var checkbox = ui.find('div.visibleFields').find('input[name=' + visibleFields[i] + ']');
            jQuery(checkbox).attr('checked', true);
        }
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
