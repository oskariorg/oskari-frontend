/**
 * @class Oskari.framework.bundle.hierarchical-layerlist.component.SelectableAccordionPanel
 *
 * Panel that can be added to Oskari.userinterface.component.Accordion.
 * Differs from AccordionPanel in such a way that it contains a checkbox for selecting the accordion panel and selecting all sub panels under this one.
 */
Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.component.SelectableAccordionPanel',

    /**
     * @method create called automatically on construction
     * TODO: close/open methods?
     * @static
     */
    function (sandbox, layerGroup, layers, localization) {
        this.template = jQuery('<div class="accordion_panel">' +
                '<div class="header">' +
                    '<div class="headerIcon icon-arrow-right">' +
                    '</div>' +
                    '<input class="headerCheckbox" type="checkbox">' +
                    '<div class="headerText">' +
                    '</div>' +
                '</div>' +
                '<div class="content">' +
                '</div>' +
            '</div>');
        this.templates = {
            description: '<div>' +
                '  <h4 class="indicator-msg-popup"></h4>' +
                '  <p></p>' +
                '</div>'
        };
        this.title = null;
        this.content = null;
        this.html = this.template.clone();
        this.sandbox = sandbox;
        this.localization = localization;
        this.layerGroup = layerGroup;
        this.layers = layers;
        this._notifierService = this.sandbox.getService('Oskari.framework.bundle.hierarchical-layerlist.OskariEventNotifierService');
        this._bindOskariEvents();
        var me = this,
            headerIcon = me.html.find('div.headerIcon'),
            headerText = me.html.find('div.headerText'),
            headerCheckbox = me.html.find('input.headerCheckbox');

        headerIcon.click(function () {
            if (me.isOpen()) {
                me.close();
            } else {
                me.open();
            }
        });

        headerText.click(function () {
            if (me.isOpen()) {
                me.close();
            } else {
                me.open();
            }
        });

        headerCheckbox.change(function () {
            selectedLayers = me.sandbox.findAllSelectedMapLayers();
            layersLength = selectedLayers.length;
            var thisHeaderCheckbox = this;
            var isChecked = jQuery(thisHeaderCheckbox).prop("checked");
            var layerInputsArr = me.html.find('div.content div.layer input');
            var numberOfLayers = layerInputsArr.length;
            //If there are already 10 or more layers on the map show a warning to the user when adding more layers.
            if((numberOfLayers > 10 || layersLength > 10) && isChecked) {
                var desc = jQuery(me.templates.description),
                dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                ),
                okBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.OkButton'
                );
                cancelBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.CancelButton'
                );
                desc.find('p').text(me.localization.manyLayersWarning.text);
                okBtn.addClass('primary');
                okBtn.setHandler(function () {
                    dialog.close(true);
                    me.handleCheckboxChange(thisHeaderCheckbox);
                });
                cancelBtn.addClass('secondary');
                cancelBtn.setHandler(function () {
                    dialog.close(true);
                    jQuery(thisHeaderCheckbox).prop('checked', false);
                });
                dialog.show(me.localization.manyLayersWarning.title, desc, [okBtn, cancelBtn]);
            } else {
                me.handleCheckboxChange(thisHeaderCheckbox);
            }
        });

        this.html.find('div.content').hide();
        Oskari.makeObservable(this);
    }, {
        /**
         * @method setVisible
         * Shows/hides the panel
         * @param {Boolean} bln - true to show, false to hide
         */
        setVisible: function (bln) {
            // checking since we dont assume param is boolean
            if (bln === true) {
                this.html.show();
            } else {
                this.html.hide();
            }
        },
        /**
         * @method isVisible
         * Returns true if panel is currently visible
         * @return {Boolean}
         */
        isVisible: function () {
            // checking since we dont assume param is boolean
            return this.html.is(':visible');
        },
        /**
         * @method isOpen
         * Returns true if panel is currently open
         * @return {Boolean}
         */
        isOpen: function () {
            return this.html.hasClass('open');
        },
        /**
         * @method open
         * Opens the panel programmatically
         */
        open: function () {
            this.html.addClass('open');
            var header = this.html.find('div.header div.headerIcon');
            header.removeClass('icon-arrow-right');
            header.addClass('icon-arrow-down');
            this.html.find('div.content').show();
            this.trigger('open');
        },
        /**
         * @method close
         * Closes the panel programmatically
         */
        close: function () {
            this.html.removeClass('open');
            var header = this.html.find('div.header div.headerIcon');
            header.removeClass('icon-arrow-down');
            header.addClass('icon-arrow-right');
            this.html.find('div.content').hide();
            this.trigger('close');
        },
        /**
         * @method setTitle
         * Sets the panel title
         * @param {String} pTitle title for the panel
         */
        setTitle: function (pTitle) {
            this.title = pTitle;
            var header = this.html.find('div.header div.headerText');
            header.html(this.title);
        },
        /**
         * @method getTitle
         * Gets the panel title
         * @return {String}
         */
        getTitle: function () {
            return this.title;
        },
        /**
         * @method setId
         * Sets the panel header id
         * @param {String} id id for the panel
         */
        setId: function (id) {
            var header = this.html.find('div.header');
            header.attr('id', id);
        },
        /**
         * @method setDataId
         * Sets the panel checkbox data attribute id
         * @param {String} dataId dataId for the checkbox
         */
        setDataId: function (dataId) {
            var checkbox = this.html.find('input.headerCheckbox');
            checkbox.attr('data-id', dataId);
        },
        /**
         * @method setContent
         * Sets the panel content.
         * This can be also done with #getContainer()
         * @param {jQuery} pContent reference to DOM element
         */
        setContent: function (pContent) {
            this.content = pContent;
            var content = this.html.find('div.content');
            content.append(this.content);
        },
        /**
         * @method destroy
         * Destroys the panel/removes it from document
         */
        destroy: function () {
            if( !this.html){
              return;
            }
            this.html.remove();
        },
        /**
         * @method getContainer
         * Returns this panels content container which can be populated.
         * This can be also done with #setContent().
         * @return {jQuery} reference to this panels content DOM element
         */
        getContainer: function () {
            return this.html.find('div.content');
        },
        /**
         * Returns the header of the panel.
         *
         * @method getHeader
         * @return {jQuery} refrence to this panels header DOM element
         */
        getHeader: function () {
            return this.html.find('div.header');
        },
        /**
         * @method insertTo
         * Adds this panel to given container.
         * Usually used by Oskari.userinterface.component.Accordion internally.
         * @param {jQuery} container reference to DOM element
         */
        insertTo: function (container) {
            container.append(this.html);
        },
        /**
         * Helper method for handling the checkbox change.
         * @param  {input} checkbox The checkbox that is changed.
         */
        handleCheckboxChange: function(checkbox) {
            var me = this;
            if (!me.isOpen()) {
                me.open();
            }
            var inputsArr = me.html.find('div.content div.layer input');
            if(checkbox.checked) {
                me.toggleAllLayers(inputsArr, true);
            } else {
                me.toggleAllLayers(inputsArr, false);
            }
        },
        /**
         * Toggle all layerInputArray layers from the map.
         * @param {Array} layerInputArray Array of Oskari layer input checkboxes whose parent is a div with a .layer class and contains layer_id as the id of the layer.
         * @param {Boolean} addOrRemove Whether to add or remove the given layers from the map
         */
        toggleAllLayers: function(layerInputArray, addOrRemove) {
            var me = this;
            jQuery.each(layerInputArray ||[], function(key, input){
                var input = jQuery(input);
                var parent = input.parent(".layer");
                var layerId = parent.attr("layer_id");
                input.prop('checked', addOrRemove);
                if(addOrRemove) {
                    me.sandbox.postRequestByName('AddMapLayerRequest', [layerId]);
                } else {
                    me.sandbox.postRequestByName('RemoveMapLayerRequest', [layerId]);
                }
            });
        },
        /**
         * Toggle accordion panel checkbox on or off
         * @param  {boolean} onOrOff Tells whether to check the checkbox or not
         */
        toggleCheckbox: function(onOrOff) {
            var checkbox = this.html.find('input.headerCheckbox');
            checkbox.prop('checked', onOrOff);
        },

        _bindOskariEvents: function(){
            var me = this;
            me._notifierService.on('AfterMapLayerAddEvent',function(evt) {
                var layer = evt.getMapLayer();
                //Add selection to the group if all layers are selected.
                layer.getGroups().forEach(function(group){
                    var headerCheckbox = me.html.find('input.headerCheckbox');
                    var layerGroupLayerCheckboxes = me.html.find('div.content input');
                    var allChecked = true;
                    for(var i = 0; i < layerGroupLayerCheckboxes.length; ++i) {
                        var checkbox = jQuery(layerGroupLayerCheckboxes[i]);
                        if(!checkbox.prop('checked')) {
                            allChecked = false;
                        }
                    }
                    headerCheckbox.prop('checked', allChecked);
                });
            });

            me._notifierService.on('AfterMapLayerRemoveEvent',function(evt){
                var layer = evt.getMapLayer();
                //Remove selection from the corresponding group aswell
                layer.getGroups().forEach(function(group){
                    var headerCheckbox = me.html.find('input.headerCheckbox[data-id='+group.id+']');
                    headerCheckbox.prop('checked', false);
                });
            });
        }
    }
);