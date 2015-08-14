/**
 * @class Oskari.mapframework.bundle.parcel.view.ParcelPrintForm1
 * 
 * Shows a form for my place. For requests for name and description.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcel.view.ParcelPrintForm1",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.initialValues = undefined;
    this._formUi = undefined;
    this.isEnabled = false;
    
    var loc = instance.getLocalization('parcelprintform1');

    this.template = jQuery('<div class="parcelprintform1">' +
        '<div class="header">' +
        '<div class="icon-close">' + '</div>' + '<h3></h3>' + '</div>' + '<div class="content">'+
        '<div class="field">' +
        '<div class="help icon-question" ' +
        'title="' + loc.tooltip + '"></div>' +
        '<div class="field">' +
        '<label>'+loc.parent_property_id.placeholder+'</label>' +
        '</div>' +
        '<div class="field">' +
        '<label id="parent_property_id" name="parent_property_id" ></label>' +
        '</div>' +
        /* '<label>' + loc.placename.placeholder + '</label>' +
        '<input type="text" name="placename"  placeholder="' + loc.placename.placeholder + '"/>' +
        '</div>' + */
        '<div class="field">' +
        '<label>' + loc.ptitle.placeholder + '</label>' +
        '<input type="text" name="ptitle" placeholder="' + loc.ptitle.placeholder + '"/>' +
        '</div>' +
        '<div class="field">' +
        '<label>' + loc.reporter.placeholder + '</label>' +
        '<input type="text" name="reporter" placeholder="' + loc.reporter.placeholder + '"/>' +
        '</div>' +
      /* maybe later ? '<div class="field">' +
        '<label>' + loc.subtitle.placeholder + '</label>' +
        '<input type="text" name="subtitle" placeholder="' + loc.subtitle.placeholder + '"/>' +
        '</div>' +
        '<div class="field">' +
        '<label>' + loc.description.placeholder + '</label>' +
        '<textarea name="description" placeholder="' + loc.description.placeholder + '">' +
        '</textarea>' +
        '</div>' +
        '<div class="field">' +
        '<label>' + loc.parent_property_quality.placeholder + '</label>' +
        '<input type="text" name="parent_property_quality" disabled="disabled" placeholder="' + loc.parent_property_quality.placeholder + '"/>' +
        '</div>' + */
        '<div class="field">' +
        '<label>' + loc.area.placeholder + '</label>' +
        '</div>' +
        '<div class="field">' +
        '<label id="area_property_id" name="area_property_id" ></label>' +
        '</div>' +
        '<div class="buttons"></div>' +
        '</div></div>');
}, {

        /**
         * @method render
         * Renders view to given DOM element
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         */
        render: function (container, mainview) {
            var me = this;
            var content = me.getForm();
            var loc = this.instance.getLocalization('parcelprintform1');

            this.mainPanel = content;
            content.find('div.header h3').append(loc.title);

            container.append(content);

            me.setValues(me._getDefaultValues(mainview));

            // buttons
            container.find('div.header div.icon-close').bind('click', function () {
                me.instance.setParcelPrintBreak();
            });
            //Break
            var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');

            cancelButton.setTitle(loc.buttons['break']);
            cancelButton.setHandler(function () {
                me.instance.setParcelPrintBreak();
            });
            cancelButton.insertTo(content.find('div.buttons'));

            //Continue
            var continueButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            continueButton.addClass('primary');
            continueButton.setTitle(loc.buttons['continue']);
            continueButton.setHandler(function () {
                //Validate values
                var formValues = me.getValues();
                // validation
                var errors = me.instance.getMainView()._validateForm(formValues);
                if (errors.length != 0) {
                    me.instance.getMainView()._showValidationErrorMessage(errors);
                    return;
                }
                me.instance.setParcelPrint2(true);
            });
            continueButton.insertTo(content.find('div.buttons'));


            var inputs = me._formUi.find('input[type=text]');
            inputs.focus(function () {
                me.instance.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
            });
            inputs.blur(function () {
                me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
            });

        },
        refreshData: function (mainview) {
            var me = this;
            me.setValues(me._getDefaultValues(mainview));
        },
            /**
     * @method getForm
     * @return {jQuery} jquery reference for the form 
     */
    getForm : function() {
        var ui = this.template.clone();
        var loc = this.instance.getLocalization('parcelprintform1');
        if(this.initialValues) {
            ui.find('input[name=placename]').attr('value', this.initialValues.place.name);
            ui.find('textarea[name=description]').append(this.initialValues.place.desc);
            ui.find('input[name=ptitle]').attr('value',this.initialValues.place.title);
            ui.find('input[name=subtitle]').attr('value',this.initialValues.place.subtitle);
            ui.find('#parent_property_id').text(this.initialValues.place.parent_property_id);
            ui.find('input[name=parent_property_quality]').attr('value',this.initialValues.place.parent_property_quality);
           // ui.find('input[name=area]').attr('value',this.initialValues.place.area);
            ui.find('#area_property_id').text(this.initialValues.place.area);
            ui.find('input[name=reporter]').attr('value',this.initialValues.place.reporter);
        }
        this._formUi = ui;
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

        if (onScreenForm.length > 0) {
            // found form on screen
            var placeName = onScreenForm.find('input[name=placename]').val();
            var description = onScreenForm.find('textarea[name=description]').val();
            var ptitle = onScreenForm.find('input[name=ptitle]').val();
            var subtitle = onScreenForm.find('input[name=subtitle]').val();
            var parent_property_id = onScreenForm.find('#parent_property_id').text();
            var parent_property_quality = onScreenForm.find('input[name=parent_property_quality]').val();
            var area = onScreenForm.find('#area_property_id').text();
            var reporter = onScreenForm.find('input[name=reporter]').val();
            var id = undefined;
            if(this.initialValues.place.id) id = this.initialValues.place.id;
            values.place = {
                id: id,
                name: placeName,
                desc: description,
                title: ptitle,
                subtitle: subtitle,
                parent_property_id: parent_property_id,
                parent_property_quality: parent_property_quality,
                area: area,
                reporter: reporter
            };
        }
        return values;
    },
        /**
         *
         * @param mainview  parcel mainview
         * @returns {{place: {}}}  Default values for parcel print
         */
        _getDefaultValues : function(mainview) {
            var me = this;
            // Get default value from the feature.
            var defaultValues = {
                place : {}
            };
            var feature = mainview.drawPlugin.getDrawing();
            var oldpreparcel = mainview.drawPlugin.getOldPreParcel();
            if (feature) {
                defaultValues.place.area = mainview.drawPlugin.getParcelGeometry().getArea().toFixed(0);
                if (feature.attributes) {
                    if (this.instance.conf.pid) {
                        defaultValues.place.name = me.instance.conf.pid;
                    }
                    else {
                        // Should never be here in KVP use
                        defaultValues.place.name = feature.attributes.name + '-K';
                    }
                    if (this.instance.conf.printContent) {
                        defaultValues.place.desc = this.instance.conf.printContent;
                    }
                    defaultValues.place.parent_property_id = feature.attributes.name;
                    defaultValues.place.parent_property_quality = mainview._decodeQuality('q' + feature.attributes.quality);

                }
                // Override if old values available
                if (oldpreparcel) {
                    defaultValues.place.id = oldpreparcel.id;
                    defaultValues.place.name = oldpreparcel.preparcel_id;
                    defaultValues.place.title = oldpreparcel.title;
                    defaultValues.place.subtitle = oldpreparcel.subtitle;
                    defaultValues.place.desc = oldpreparcel.description;
                    defaultValues.place.parent_property_id = oldpreparcel.parent_property_id;
                    defaultValues.place.parent_property_quality = oldpreparcel.parent_property_quality;
                    defaultValues.place.reporter = oldpreparcel.reporter;
                    defaultValues.place.area_unit = oldpreparcel.area_unit;
                }
            }
            return defaultValues;
        },
    /**
     * @method setValues
     * Sets form values from object.
     * @param {Object} data place data as formatted in #getValues() 
     */
    setValues : function(data) {
        // infobox will make us lose our reference so search 
        // from document using the form-class
        var onScreenForm = this._getOnScreenForm();
        
        if(onScreenForm.length > 0) {
            // found form on screen
            onScreenForm.find('input[name=placename]').val(data.place.name);
            onScreenForm.find('textarea[name=description]').val(data.place.desc);
            onScreenForm.find('input[name=ptitle]').val(data.place.title);
            onScreenForm.find('input[name=subtitle]').val(data.place.subtitle);
            onScreenForm.find('#parent_property_id').text(data.place.parent_property_id);
            onScreenForm.find('input[name=parent_property_quality]').val(data.place.parent_property_quality);
             onScreenForm.find('#area_property_id').text(data.place.area);
             onScreenForm.find('input[name=reporter]').val(data.place.reporter);
        }
        
        this.initialValues = data;
    },
        enableDisableFields : function() {
          if(this._formUi) this._formUi.find('input[name=placename]').removeAttr('disabled');
        },
    /**
     * @method _getOnScreenForm
     * Returns reference to the on screen version shown by OpenLayers 
     * @private
     */
    _getOnScreenForm : function() {
        // unbind live so 
        return jQuery('div.parcelprintform1');
    },
        /**
         * @method destroy
         * Destroyes/removes this view from the screen.
         */
        destroy: function () {
            // unbind live bindings
            var onScreenForm = this._getOnScreenForm();
            this._formUi.remove();
        },
        hide: function () {
            this._formUi.hide();
        },
        show: function () {
            this._formUi.show();
        },
        setEnabled: function (e) {
            this.isEnabled = e;
        },
        getEnabled: function () {
            return this.isEnabled;
        }
});
