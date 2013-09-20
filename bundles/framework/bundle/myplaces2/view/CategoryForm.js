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
//    jscolor.dir = '/Oskari/libraries/jscolor/';
    
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

    //magical mappings from getValues function
    this.lineCapMap = ["butt","round"];
    this.lineCornerMap = ["mitre","round","bevel"];
    this.lineStyleMap = ["","5 2",""];



}, {

start : function() {
    this._bindRenderButtons();    
},
    /**
     * @method getForm
     * @return {jQuery} jquery reference for the form 
     */
    getForm : function() {

        var ui = this.template.clone();
        var table = ui.find('div.drawing table');
        // this._populatePointTool(table);
        // this._populateLineTool(table);
        // this._populateAreaTool(table);

        // populate the rendering fields
        var content = ui.find('div.rendering');
        for(var buttonName in this.renderButtons) {
            var btnContainer = this.templateRenderButton.clone();
            var button = this.renderButtons[buttonName];
            btnContainer.attr("title", "");
        	btnContainer.addClass(button.iconCls);
            content.append(btnContainer);
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
                cap : this.lineCapMap[lineCap],
                corner : this.lineCornerMap[lineCorner],
                style : this.lineStyleMap[lineStyle]
            };
            var areaLineWidth = this.areaRenderForm.values.lineWidth;
            var areaLineCorner = this.areaRenderForm.values.lineCorner;
            var areaLineCap = this.areaRenderForm.values.lineCap;
            var areaLineStyle = this.areaRenderForm.values.lineStyle;
            var areaLineColor = this.areaRenderForm.values.lineColor;
            var areaFillColor = this.areaRenderForm.values.fillColor;
            var areaFillStyle = this.areaRenderForm.values.fillStyle;
            values.area = {
                lineWidth : areaLineWidth,
                lineCorner :    this.lineCornerMap[areaLineCorner],
                lineCap :       this.lineCapMap[areaLineCap],
                lineStyle :     this.lineStyleMap[areaLineStyle],
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
        
//TODO: is this necessary anymore? 
        if(onScreenForm.length > 0) {
            // found form on screen

            onScreenForm.find('input[name=dotSize]').val(data.dot.size);
            onScreenForm.find('input[name=dotColor]').val(data.dot.color);

            onScreenForm.find('input[name=lineSize]').val(data.line.size);
            onScreenForm.find('input[name=lineColor]').val(data.line.color);
            
            onScreenForm.find('input[name=areaLineSize]').val(data.area.lineWidth);
            onScreenForm.find('input[name=areaLineColor]').val(data.area.lineColor);
            onScreenForm.find('input[name=areaFillColor]').val(data.area.fillColor);

            this._checkVisibleFields(data.visibleFields);
        }

        // 'round' -> 1
        for (var i = 0; i < this.lineCapMap.length; i++) {
            if(data.line.cap === this.lineCapMap[i]) {
                data.line.cap = i;
            }
            if(data.area.lineCap === this.lineCapMap[i]) {
                data.area.lineCap = i;
            }
        };
        for (var i = 0; i < this.lineCornerMap.length; i++) {
            if(data.line.corner === this.lineCornerMap[i]) {
                data.line.corner = i;
            }
            if(data.area.lineCorner === this.lineCornerMap[i]) {
                data.area.lineCorner = i;
            }
        };
        for (var i = 0; i < this.lineStyleMap.length; i++) {
            if(data.line.style === this.lineStyleMap[i]) {
                data.line.style = i;
            }
            if(data.area.lineStyle === this.lineStyleMap[i]) {
                data.area.lineStyle = i;
            }
        };

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

        var point = onScreenForm.find('div.renderButton'+".icon-point");
        point.off('click');
        point.on('click', function() {
            me.pointRenderForm.showForm(this, me.initialValues);
        });
        var line = onScreenForm.find('div.renderButton'+".icon-line")
        line.off('click');
        line.on('click', function() {
            me.lineRenderForm.showForm(this, me.initialValues);
        });
        var area = onScreenForm.find('div.renderButton'+".icon-area")
        area.off('click');
        area.on('click', function() {
            me.areaRenderForm.showForm(this, me.initialValues);
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
