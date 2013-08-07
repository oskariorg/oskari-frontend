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
    this.pointRenderForm = Oskari.clazz.create("Oskari.mapframework.bundle.myplaces2.view.PointForm",this.instance);
    this.lineRenderForm = Oskari.clazz.create("Oskari.mapframework.bundle.myplaces2.view.LineForm",this.instance);
    this.areaRenderForm = Oskari.clazz.create("Oskari.mapframework.bundle.myplaces2.view.AreaForm",this.instance);
    // problems in demo with autodetect
    jscolor.dir = '/Oskari/libraries/jscolor/';
    
    var loc = instance.getLocalization('categoryform');
    
    this.renderButtons = {
        'point' : {
            iconCls : 'icon-point',
            tooltip : loc.rendering.point.tooltip,
            sticky : false,
            callback : function() {
            }
        },
        'line' : {
            iconCls : 'icon-line',
            tooltip : loc.rendering.point.tooltip, //todo
            sticky : false,
            callback : function() {
            }
        },
        'area' : {
            iconCls : 'icon-area',
            tooltip : loc.rendering.point.tooltip, //todo
            sticky : false,
            callback : function() {
            }
        }
    };

    this.template = jQuery('<div class="myplacescategoryform">' +
            '<div class="field">' +   
                '<label for="categoryname">' + loc.name.label + '</label><br clear="all" />' +
                '<input type="text" name="categoryname" placeholder="' + loc.name.placeholder + '"/>' +
            '</div>' +
            '<div class="field drawing">' + 
                '<label>' + loc.drawing.label + '</label><br clear="all" />' +
                '<div class="rendering"></div>'+
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
    this.templateRenderButton = jQuery('<div class="renderButton" style= "display: inline-block; border: 1px solid;"></div>');
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

        // populate the rendering fields
        var content = ui.find('div.rendering');
        for(var buttonName in this.renderButtons) {
            var btnContainer = this.templateRenderButton.clone();
            var button = this.renderButtons[buttonName];
            btnContainer.attr("title", "");
        	btnContainer.addClass(button.iconCls);
            content.append(btnContainer);
        }
        this._bindRenderButtons();

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
        // Mappings
        var lineCapMap = ["butt","round"];
        var lineCornerMap = ["mitre","round","bevel"];
        var lineStyleMap = ["","5 2",""];
        var values = {};
        // infobox will make us lose our reference so search 
        // from document using the form-class
        var onScreenForm = this._getOnScreenForm();
        
        if(onScreenForm.length > 0) {
            // found form on screen
            values.name = onScreenForm.find('input[name=categoryname]').val();
            if(this.categoryId) {
                values.id = this.categoryId;
            }
            values._isDefault = this._isDefault || false;
            
            var dotSize = this.pointRenderForm.values.size;
            var dotColor = this.pointRenderForm.values.color;
            var dotShape = this.pointRenderForm.values.shape;
            values.dot = {
                size : dotSize,
                color : dotColor,
                shape : dotShape
            };
            var lineWidth = this.lineRenderForm.values.width;
            var lineColor = this.lineRenderForm.values.color;
            var lineCorner = this.lineRenderForm.values.corner;
            var lineCap = this.lineRenderForm.values.cap;
            var lineStyle = this.lineRenderForm.values.style;
            values.line = {
                width : lineWidth,
                color : lineColor,
                cap : lineCapMap[lineCap],
                corner : lineCornerMap[lineCorner],
                style : lineStyleMap[lineStyle]
            };
            var areaLineWidth = this.areaRenderForm.values.line.width;
            var areaLineCorner = this.areaRenderForm.values.line.corner;
            var areaLineCap = this.areaRenderForm.values.line.cap;
            var areaLineStyle = this.areaRenderForm.values.line.style;
            var areaLineColor = this.areaRenderForm.values.color[0];
            var areaFillColor = this.areaRenderForm.values.color[1];
            var areaFillStyle = this.areaRenderForm.values.fill;
            values.area = {
                width : areaLineWidth,
                lineCorner : lineCornerMap[areaLineCorner],
                lineCap : lineCapMap[areaLineCap],
                lineStyle : lineStyleMap[areaLineStyle],
                lineColor : areaLineColor,
                fillColor : areaFillColor,
                fillStyle : areaFillStyle
            };

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
    /**
     * @method _bindRenderButtons
     * Binds listeners for render buttons.
     * NOTE! THIS IS A WORKAROUND since infobox uses OpenLayers popup which accepts
     * only HTML -> any bindings will be lost
     * @private
     */
    _bindRenderButtons : function() {
        var me = this;
        var onScreenForm = this._getOnScreenForm();
        onScreenForm.find('div.renderButton'+".icon-point").live('click', function() {
            me.pointRenderForm.showForm(this);
        });
        onScreenForm.find('div.renderButton'+".icon-line").live('click', function() {
            me.lineRenderForm.showForm(this);
        });
        onScreenForm.find('div.renderButton'+".icon-area").live('click', function() {
            me.areaRenderForm.showForm(this);
        });
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
