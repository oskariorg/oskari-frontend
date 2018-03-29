/**
 * @class Oskari.mapframework.bundle.myplacesimport.StyleForm
 *
 * Shows a form for a user layer style
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.myplacesimport.StyleForm',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (instance) {
        this.instance = instance;
        this.loc = Oskari.getMsg.bind(null, 'MyPlacesImport');
            
        this.visualizationForm = Oskari.clazz.create(
        'Oskari.userinterface.component.VisualizationForm'
        );
        this.template = jQuery(
        	'<div class="myplacesimportstyleform">' +
            '   <div class="field name">' + 
            '       <label for="userlayername">'+ this.loc('flyout.layer.name') +'</label><br clear="all" />' +
            '       <input type="text" data-name="userlayername" />' + 
            '   </div>' +
            '   <div class="field desc">' + 
            '       <label for="description">'+ this.loc('flyout.layer.desc') +'</label><br clear="all" />' +
            '       <input type="text" data-name="userlayerdesc" />' +
            '   </div>' +
            '   <div class="field source">' + 
            '       <label for ="datasource">'+ this.loc('flyout.layer.source') +'</label><br clear="all" />' +
            '       <input type="text" data-name="userlayersource" />' +
            '   </div>' +
            '   <div class="field visualization">' +
                    '<label for=style>' + this.loc('flyout.layer.style') + '</label><br clear="all" />' +
                    '<div class="rendering"></div>' +
            '   </div>'+
            '</div>');
    }, {               
        start: function () {},

    	/**
         * @method getForm
         * @return {jQuery} jquery reference for the form
         */
    	getForm: function () {
            var ui = this.template.clone();
            // populate the rendering fields
            var content = ui.find('div.rendering');
            content.append(this.visualizationForm.getForm());

            return ui;
        },
        
        /**
         * @method setStyleValues
         * @param {Object} style
         */
        setStyleValues: function (style){
            style.dot.color = this._formatColorFromServer(style.dot.color);
            style.line.color = this._formatColorFromServer(style.line.color);
            style.area.lineColor = (typeof style.area.lineColor === "string" ? this._formatColorFromServer(style.area.lineColor) : null);
            style.area.fillColor = (typeof style.area.fillColor === "string" ? this._formatColorFromServer(style.area.fillColor) : null);
            this.visualizationForm.setValues(style);
        },

        /**
         * Removes prefix #-character if present
         *
         * @method  _formatColorFromServer
         * @private
         * @param {String} color
         * @return {String} color
         */
        _formatColorFromServer: function (color) {
            if (color.charAt(0) === '#') {
                return color.substring(1);
            }
            return color;
        },

        /**
         * Returns visualization form values as an object
         *
         * @method _getStyleValues
         * @private
         * @return {Object} styleJson
         */
        _getStyleValues: function(form){
            var formValues = form.getValues(),
                styleJson = {};

            if (formValues) {
                styleJson.dot = {
                    size: formValues.dot.size,
                    color: '#' + formValues.dot.color,
                    shape: formValues.dot.shape
                };
                styleJson.line = {
                    width: formValues.line.width,
                    color: '#' + formValues.line.color,
                    cap: formValues.line.cap,
                    corner: formValues.line.corner,
                    style: formValues.line.style
                };
                styleJson.area = {
                    lineWidth: formValues.area.lineWidth,
                    lineColor: formValues.area.lineColor === null ? null : '#' + formValues.area.lineColor,
                    fillColor: formValues.area.fillColor === null ? null : '#' + formValues.area.fillColor,
                    lineStyle: formValues.area.lineStyle,
                    fillStyle: formValues.area.fillStyle,
                    lineCorner: formValues.area.lineCorner
                };
            }
            return styleJson;
        },

        /**
         * Returns form values as an object
         * 
         * @method getValues
         * @return {Object} values
         */
        getValues: function (){
            var values = {},
                styleFormValues,
                me = this;
            // infobox will make us lose our reference so search
            // from document using the form-class
            var onScreenForm = this._getOnScreenForm();

            if (onScreenForm.length > 0) {
                values.name = onScreenForm.find('input[data-name=userlayername]').val();
                values.desc = onScreenForm.find('input[data-name=userlayerdesc]').val();
                values.source = onScreenForm.find('input[data-name=userlayersource]').val();
            }
            values.style = JSON.stringify(me._getStyleValues(me.visualizationForm));

            return values;
        },
        /**
         * Returns reference to the on screen version shown by OpenLayers
         *
         * @method _getOnScreenForm
         * @private
         */
        _getOnScreenForm: function () {
            return jQuery('div.myplacesimportstyleform');
        }

    });	