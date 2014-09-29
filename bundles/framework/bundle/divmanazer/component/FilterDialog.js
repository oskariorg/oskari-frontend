/**
 * @class Oskari.userinterface.component.FilterDialog
 *
 * Generic filter methods component
 */
Oskari.clazz.category('Oskari.userinterface.component.FilterDialog',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (loc, fixedOptions, psandbox) {
        this.sandbox = psandbox || Oskari.getSandbox();
        this.loc = loc;

        // Optionally fixed options
        this.fixedOptions = {};
        if (fixedOptions) {
            this.fixedOptions = fixedOptions;
        }

        this.__filterTemplates = {
            filterContent: '<div class="analyse-filter-popup-content">' +
                //'<div class="analyse-filter filter-title"></div>' +
                '</div>',
            filterContentBBOX: '<div class="analyse-filter analyse-filter-popup-bbox">' + '<div class="bbox-title"></div>' + '<div class="bbox-radio">' + '<div class="bbox-on">' + '<input id="analyse-filter-bbox-on" type="radio" name="filter-bbox" value="true" />' + '<label for="analyse-filter-bbox-on"></label>' + '</div>' + '<div class="bbox-off">' + '<input id="analyse-filter-bbox-off" type="radio" name="filter-bbox" value="false" checked="checked" />' + '<label for="analyse-filter-bbox-off"></label>' + '</div>' + '</div>' + '</div>',
            filterClickedFeatures: '<div class="analyse-filter analyse-filter-clicked-features">' + '<div class="clicked-features-title"></div>' + '<input type="checkbox" name="analyse-clicked-features" id="analyse-clicked-features" />' + '<label for="analyse-clicked-features"></label>' + '</div>',
            filterContentValues: '<div class="analyse-filter analyse-filter-popup-values">' + '<div class="values-title"></div>' + '</div>',
            filterContentOption: '<div class="filter-option">' + '<input name="case-sensitive" type="checkbox"></input>' + '<select class="attribute"></select>' + '<select class="operator"></select>' + '<input name="attribute-value" type="text"></input>' + '</div>',
            manageFilterOption: '<div class="manage-filter-option">' + '<div class="add-filter-option">+</div>' + '<div class="remove-filter-option">-</div>' + '</div>',
            filterBooleanOption: '<select class="boolean"></select>',
            option: '<option></option>'
        };
        this.popup = null;
        this._layer = null;
        this._closeButtonHandler = null;
        this._clearButtonHandler = null;
        this._updateButtonHandler = null;
    }, {
        /**
         * Creates the filter options dialog and displays it to the user.
         *
         * @method _createFilterDialog
         * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
         */
        createFilterDialog: function (layer) {
            var me = this,
                closeButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                // Clears the filter values
                clearButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                // Updates the filter values
                updateButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                layerAttributes,
                popupTitle,
                popupContent,
                filterJson,
                filterErrors;

            if (typeof layer !== "undefined") {
                me._layer = layer;
            }

            if (typeof me._layer === null) {
                return;
            }

            // Create filter dialog content
            layerAttributes = me._layer.getFilterJson();
            if (me._layer.getFilterJson() === null) {
                me._loadWFSLayerPropertiesAndTypes(me._layer.getId());
                return;
            }
            popupContent = this.getFilterDialogContent(me._layer);
            popupTitle = this.loc.filter.description + " " + me._layer.getName();

            // Create the actual popup dialog
            me.popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');

            closeButton.setTitle(this.loc.filter.cancelButton);
            closeButton.addClass('analyse-close-filter');
            closeButton.setHandler(function () {
                me.popup.close(true);
                if (me._closeButtonHandler) {
                    me._closeButtonHandler.apply();
                }
            });

            clearButton.setTitle(me.loc.filter.clearButton);
            clearButton.addClass('analyse-clear-filter');
            clearButton.setHandler(function () {
                // Sets the dialog content to its original state
                me.popup.setContent(me.getFilterDialogContent(me._layer));
                if (me._clearButtonHandler) {
                    me._clearButtonHandler.apply();
                }
            });

            updateButton.setTitle(this.loc.filter.refreshButton);
            updateButton.addClass('primary');
            updateButton.addClass('analyse-update-filter');
            updateButton.setHandler(function () {
                var filtersJson = me.getFilterValues();   // Get the filter values from the dialog
                // Validate the values for errors
                filterErrors = me._validateFilterValues(filtersJson);
                if (filterErrors) {
                    // If there were validation errors, notify the user of them
                    // and prevent refreshing the filter values.
                    me._displayValidationErrors(filterErrors);
                } else {
                    // Else close the dialog
                    me.popup.close(true);
                    if (me._updateButtonHandler) {
                        me._updateButtonHandler.call(me, filtersJson);
                    }
                }
            });

            me.popup.show(popupTitle, popupContent, [closeButton, clearButton, updateButton]);

            // Make the popup draggable
            me.popup.makeDraggable();
        },

        /**
         * Creates the content for the filter dialog popup.
         *
         * @method getFilterDialogContent
         * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
         */
        getFilterDialogContent: function (layer) {
            var content = jQuery(this.__filterTemplates.filterContent),
                bboxSelection = jQuery(this.__filterTemplates.filterContentBBOX),
                clickedFeaturesSelection = jQuery(this.__filterTemplates.filterClickedFeatures),
                valuesSelection = jQuery(this.__filterTemplates.filterContentValues),
                filterOption;

            // The BBOX filter selection
            if (typeof this.fixedOptions.bboxSelection === "undefined") {
                bboxSelection.find('div.bbox-title').html('<h4>' + this.loc.filter.bbox.title + '</h4>');
                bboxSelection.find('div.bbox-on').find('label').html(this.loc.filter.bbox.on);
                bboxSelection.find('div.bbox-off').find('label').html(this.loc.filter.bbox.off);
                content.append(bboxSelection);
            }

            // Filter clicked features
            if (typeof this.fixedOptions.clickedFeaturesSelection === "undefined") {
                clickedFeaturesSelection.find('div.clicked-features-title').html('<h4>' + this.loc.filter.clickedFeatures.title + '</h4>');
                clickedFeaturesSelection.find('label').html(this.loc.filter.clickedFeatures.label);
                content.append(clickedFeaturesSelection);
            }

            // Filter values selection
            valuesSelection.find('div.values-title').html('<h4>' + this.loc.filter.values.title + '</h4>');
            // Add a filter
            filterOption = this._addAttributeFilter(layer);
            valuesSelection.append(filterOption);

            content.append(valuesSelection);

            return content;
        },

        /**
         * Fills the dialog with filter values.
         *
         * @method fillDialogContent
         * @private
         * @param {jQuery object} dialog
         * @param {Object} values
         * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
         */
        fillDialogContent: function (dialog, values, layer) {

            var bboxDiv = dialog.find('div.bbox-radio'),
                clickedFeaturesDiv = dialog.find('div.analyse-filter-clicked-features'),
                filterDiv = dialog.find('div.filter-option'),
                filter,
                i;

            // Set the BBOX value
            if (values.bbox && !jQuery.isEmptyObject(values.bbox)) {
                // BBOX enabled
                bboxDiv.find('div.bbox-off').find('input[name=filter-bbox]').removeAttr('checked');
                bboxDiv.find('div.bbox-on').find('input[name=filter-bbox]').attr('checked', 'checked');
            } else {
                // BBOX disabled
                bboxDiv.find('div.bbox-off').find('input[name=filter-bbox]').attr('checked', 'checked');
                bboxDiv.find('div.bbox-on').find('input[name=filter-bbox]').removeAttr('checked');
            }

            if (values.featureIds) {
                clickedFeaturesDiv.find('input[name=analyse-clicked-features]').attr('checked', 'checked');
            }

            if (values.filters && values.filters.length) {
                // Fill the values of the first filter already visible in the DOM.
                filter = values.filters[0];
                this._fillFilterOptionsDiv(filterDiv, filter);

                // Create the rest of the filters and fill the values.
                for (i = 1; values.filters && i < values.filters.length; ++i) {
                    filter = values.filters[i];

                    // The boolean operator selection
                    if (filter.boolean) {
                        var lastFilter = dialog.find('div.filter-option').last(),
                            boolSelect = this._createBooleanSelect();

                        jQuery(boolSelect.find('option')).filter(function () {
                            return (jQuery(this).val() === filter.boolean);
                        }).prop('selected', 'selected');

                        lastFilter.find('div.manage-filter-option').replaceWith(boolSelect);
                    } else {
                        // A normal filter
                        var newFilterDiv = this._addAttributeFilter(layer);
                        this._fillFilterOptionsDiv(newFilterDiv, filter);
                        dialog.find('div.analyse-filter-popup-values').append(newFilterDiv);
                    }
                }
            }
        },

        /**
         * Fills the filter options div with given filter values.
         *
         * @method _fillFilterOptionsDiv
         * @private
         * @param {jQuery object} div the filter options div
         * @param {Object} analyseFilter
         */
        _fillFilterOptionsDiv: function (div, analyseFilter) {
            // Set the right attribute as selected
            jQuery(div.find('select.attribute option')).filter(function () {
                return (jQuery(this).val() === analyseFilter.attribute);
            }).prop('selected', 'selected');

            // Set the right operator as selected
            jQuery(div.find('select.operator option')).filter(function () {
                return (jQuery(this).val() === analyseFilter.operator);
            }).prop('selected', 'selected');

            // Set the case-sensitive checkbox
            div.find('input[name=case-sensitive]').attr('checked', analyseFilter.caseSensitive);

            // Set the value of the value field ;)
            div.find('input[name=attribute-value]').val(analyseFilter.value);
        },

        /**
         * Adds an attribute based filter selection to the UI.
         *
         * @method _addAttributeFilter
         * @private
         * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
         */
        _addAttributeFilter: function (layer) {
            var me = this,
                filterOption = jQuery(this.__filterTemplates.filterContentOption),
                attrSelect = filterOption.find('select.attribute'),
                attrPlaceHolder = this.loc.filter.values.placeholders.attribute,
                opSelect = filterOption.find('select.operator'),
                opPlaceHolder = this.loc.filter.values.placeholders.operator;

            // Appends values to the attribute select.
            this._appendOptionValues(attrSelect, attrPlaceHolder, this._layer.getFilterJson());
            // Appends values to the operator select.
            // values: equals, like, not equals, not like, greater than, less than,
            //         greater or equal than, less or equal than
            this._appendOptionValues(opSelect, null, [
                {
                    id: '=',
                    name: this.loc.filter.values.equals
                }, {
                    id: '~=',
                    name: this.loc.filter.values.like
                }, {
                    id: '≠',
                    name: this.loc.filter.values.notEquals
                }, {
                    id: '~≠',
                    name: this.loc.filter.values.notLike
                }, {
                    id: '>',
                    name: this.loc.filter.values.greaterThan
                }, {
                    id: '<',
                    name: this.loc.filter.values.lessThan
                }, {
                    id: '≥',
                    name: this.loc.filter.values.greaterThanOrEqualTo
                }, {
                    id: '≤',
                    name: this.loc.filter.values.lessThanOrEqualTo
                }
            ]);

            // Placeholder to the attribute value input.
            filterOption.find('input[name=attribute-value]').attr('placeholder', this.loc.filter.values.placeholders['attribute-value']);

            filterOption.find('input[name=case-sensitive]').attr('title', this.loc.filter.values.placeholders['case-sensitive']);

            // Add the buttons to remove this filter and to add a new filter.
            filterOption.append(this._addManageFilterOption(layer));

            return filterOption;
        },

        /**
         * Adds a new filter option and binds actions to its 'add new filter' and
         * 'remove filter' buttons.
         *
         * @method _addManageFilterOption
         * @return {jQuery object}
         */
        _addManageFilterOption: function (layer) {
            var manageFilterOption = jQuery(this.__filterTemplates.manageFilterOption),
                addTitle = this.loc.filter.addFilter,
                removeTitle = this.loc.filter.removeFilter;

            manageFilterOption.find('div.add-filter-option').attr('title', addTitle);
            manageFilterOption.find('div.remove-filter-option').attr('title', removeTitle);
            // Bind a click event to the 'add a new filter' button.
            this._bindAddNewFilter(manageFilterOption.find('div.add-filter-option'), layer);
            // Bind a click event to the 'remove filter' button.
            this._bindRemoveFilter(manageFilterOption.find('div.remove-filter-option'), layer);

            return manageFilterOption;
        },

        /**
         * Binds a click event to add a new filter to the element given
         *
         * @method _bindAddNewFilter
         * @param {jQuery object} element
         * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
         */
        _bindAddNewFilter: function (element, layer) {
            var me = this;
            element.on('click', function (e) {
                me._changeAttributeFilter(jQuery(this), layer);
            });
        },

        /**
         * Binds a click event to remove a filter.
         *
         * @method _bindRemoveFilter
         * @private
         */
        _bindRemoveFilter: function (element, layer) {
            var me = this;
            element.on('click', function (e) {
                me._removeFilter(jQuery(this), layer);
            });
        },

        /**
         * Removes the 'add new filter' and 'remove filter' buttons
         * and creates a new attribute filter combining it with
         * the previous one with a logical operator.
         *
         * @method _changeAttributeFilter
         * @private
         * @param {Jquery object} element the 'add new filter' button element
         * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
         */
        _changeAttributeFilter: function (element, layer) {
            var me = this,
                parent = element.parents('div.filter-option'),
                filterList = element.parents('div.analyse-filter-popup-values'),
                // Create another filter selection
                newFilter = this._addAttributeFilter(layer),
                // Create a boolean operator selection that glues the filters together
                boolSelect = this._createBooleanSelect();

            // Remove the add and remove filter buttons.
            parent.find('div.manage-filter-option').remove();
            // Append the boolean selection to the DOM.
            parent.append(boolSelect);
            // Add the new filter selection to the DOM.
            filterList.append(newFilter);
        },

        /**
         * Removes the filter selection associated with the element given as a param
         *
         * @method _removeFilter
         * @private
         * @param {jQuery object} element the 'remove filter' button element
         */
        _removeFilter: function (element, layer) {
            var parent = element.parents('div.filter-option'),
                // Previous filter selection element
                prevSibling = parent.prev('div.filter-option'),
                manageFilterOption = this._addManageFilterOption(layer);

            // Replace the boolean operator select with the 
            prevSibling.find('select.boolean').replaceWith(manageFilterOption);
            // Unless this is the last filter option, remove it.
            if (prevSibling && prevSibling.length) {
                parent.remove();
            }
        },

        /**
         * Creates a boolean operator selection.
         *
         * @method _createBooleanSelect
         * @private
         * @return {jQuery object}
         */
        _createBooleanSelect: function () {
            var boolOption = jQuery(this.__filterTemplates.filterBooleanOption),
                boolPlaceHolder = this.loc.filter.values.placeholders.boolean;

            // Put the default boolean values to the select.
            this._appendOptionValues(boolOption, null, [
                'AND', 'OR'
            ]);

            return boolOption;
        },

        /**
         * Appends option values to the given select element.
         *
         * @method _appendOptionValues
         * @private
         * @param {jQuery object} select the select element where the options are to be applied
         * @param {String} placeHolder the first dummy option with no value (optional).
         * @param {Array[Object]/Array[String]} values the values that are to be applied to the select.
         *          Should have 'id' and 'name' keys if an array of objects (optional).
         */
        _appendOptionValues: function (select, placeHolder, values) {
            var option = jQuery(this.__filterTemplates.option),
                i;
            // Append the first, empty value to work as a placeholder
            if (placeHolder) {
                option.attr('value', '');
                option.html(placeHolder);
                select.append(option);
            }

            // Iterate the list of given values
            for (i = 0; values && i < values.length; ++i) {
                option = jQuery(this.__filterTemplates.option);
                // Array of strings.
                if (typeof values[i] === 'string') {
                    option.attr('value', values[i]);
                    option.html(values[i]);
                } else {
                    // Otherwise we're assuming an array of objects.
                    option.attr('value', values[i].id);
                    option.html(values[i].name);
                }
                select.append(option);
            }
        },

        /**
         * Retrieves the filter values from the popup content.
         * Returns an object with 0..2 keys:
         *   - 'bbox' {Object} the current map window bbox
         *   - 'filters' {Array[Object]} where even valued items
         *     are the actual filter objects, with keys:
         *     'attribute', 'operator' and 'value'
         *     and odd valued items are the logical operators
         *     combining the filters with only one key: 'boolean'
         *     Because of this filters.length is always
         *     (at least it should be) odd valued.
         *
         * @method getFilterValues
         * @private
         * @param {Object} popupContent the content of the popup.
         * @return {JSON}
         */
        getFilterValues: function() {
            var filterValues = {},
                bboxValue,
                clickedFeatures,
                domFilters,
                domFilter,
                filter,
                boolOperator,
                emptyFilter,
                popupContent,
                i;

            popupContent = this.popup.getJqueryContent();

            // Get the map window bbox if chosen.
            if (typeof this.fixedOptions.bboxSelection === "undefined") {
                bboxValue = jQuery(popupContent).find('input[name=filter-bbox]:checked').val();
            } else {
                bboxValue = this.fixedOptions.bboxSelection;
            }
            if ('true' === bboxValue) {
                filterValues.bbox = this.sandbox.getMap().getBbox();
            }

            if (typeof this.fixedOptions.clickedFeaturesSelection === "undefined") {
                clickedFeatures = jQuery(popupContent).find('input[name=analyse-clicked-features]').is(':checked');
            } else {
                clickedFeatures = this.fixedOptions.clickedFeaturesSelection;
            }
            if (clickedFeatures) {
                // At this point, just set this to 'true', since we can't
                // get hold of the layer - and consequently the clicked features - yet.
                filterValues.featureIds = true;
            }

            // Get the actual filters.
            domFilters = jQuery(popupContent).find('div.filter-option');
            if (domFilters && domFilters.length) {
                filterValues.filters = [];

                for (i = 0; i < domFilters.length; ++i) {
                    domFilter = jQuery(domFilters[i]);

                    filter = {};
                    filter.caseSensitive = domFilter.find('input[name="case-sensitive"]').is(':checked');
                    filter.attribute = domFilter.find('select.attribute').val();
                    filter.operator = domFilter.find('select.operator').val();
                    filter.value = domFilter.find('input[name=attribute-value]').val();
                    filterValues.filters.push(filter);

                    boolOperator = domFilter.find('select.boolean').val();
                    if (boolOperator) {
                        filterValues.filters.push({
                            'boolean': boolOperator
                        });
                    }
                }
            }

            // Special case when the one filter which is always in the DOM is empty
            // --> the user didn't want a filter but just the bbox perhaps.
            // NOTE! This is quite an ugly hack, used so that we don't send empty filters to backend.
            emptyFilter = filterValues.filters[0];
            if (domFilters.length === 1 &&
                (!emptyFilter.attribute && !emptyFilter.value)) {
                delete filterValues.filters;
            }
            return filterValues;
        },

        /**
         * Validates the filter values:
         * - attribute not empty
         * - operator not empty
         * - value not empty
         * - if more than one filter, booleans not empty
         *   and that every other value is a boolean, every other a filter.
         *
         * @method _validateFilterValues
         * @private
         * @param {Object} filterValues
         * @return {Object/Boolean} return an error object if there were
         *                          validation errors, false otherwise.
         */
        _validateFilterValues: function (filterValues) {
            var errors = [],
                filters = (filterValues ? filterValues.filters : null),
                filter,
                i;

            for (i = 0; filters && i < filters.length; ++i) {
                filter = filters[i];
                // These are the filter objects
                if (i % 2 === 0) {
                    if (filter.boolean) {
                        errors.push('boolean_operator_missing');
                    }
                    if (!filter.attribute) {
                        errors.push('attribute_missing');
                    }
                    if (!filter.operator) {
                        errors.push('operator_missing');
                    }
                    if (!filter.value) {
                        errors.push('value_missing');
                    }
                } else {
                    // These are the boolean operators combining the filters
                    if (!filter.boolean) {
                        errors.push('boolean_operator_missing');
                    }
                }
            }

            // If no errors found, set the errors variable to false
            if (!errors.length) {
                errors = false;
            }
            return errors;
        },

        /**
         * Displays validation error messages to the user.
         *
         * @method _displayValidationErrors
         * @param {Object} errors
         */
        _displayValidationErrors: function (errors) {
            var loc = this.loc.filter.validation,
                popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                closeButton = popup.createCloseButton(this.loc.buttons.ok),
                popupTitle = this.loc.error.title,
                popupContent = '<h4>' + loc.title + '</h4>',
                i;

            for (i = 0; i < errors.length; ++i) {
                popupContent += '<p>' + loc[errors[i]] + '</p>';
            }

            popup.show(popupTitle, popupContent, [closeButton]);
        },

        /**
         * @method loadWFSLayerPropertiesAndTypes
         * @private
         * Load analysis layers in start.
         *
         */
        _loadWFSLayerPropertiesAndTypes:function (layer_id) {
            var me = this,
                url = me.sandbox.getAjaxUrl()

            // Request analyis layers via the backend
            me._getWFSLayerPropertiesAndTypes(layer_id,
                // Success callback

                function (response) {
                    if (response) {
                        me._handleWFSLayerPropertiesAndTypesResponse(response);
                    }
                },
                // Error callback

                function (jqXHR, textStatus, errorThrown) {
                    me.instance.showMessage(me.loc.error.title, me.loc.error.loadLayerTypesFailed);
                });

        },

        /**
         * Get WFS layer properties and property types
         *
         * @method _getWFSLayerPropertiesAndTypes
         * @param {Function} success the success callback
         * @param {Function} failure the failure callback
         */
        _getWFSLayerPropertiesAndTypes: function (layer_id, success, failure) {
            var url = this.sandbox.getAjaxUrl() + 'action_route=GetWFSDescribeFeature&layer_id=' + layer_id;
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                url: url,
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                success: success,
                error: failure
            });
        },

        /**
         * Store property types
         *
         * @method _handleWFSLayerPropertiesAndTypesResponse
         * @private
         * @param {JSON} propertyJson properties and property types of WFS layer JSON returned by server.
         */
        _handleWFSLayerPropertiesAndTypesResponse: function (propertyJson) {
            var me = this,
                fields = propertyJson.propertyTypes;
            var layerAttributes = [];
//debugger;
            for (var key in fields) {
                if (fields.hasOwnProperty(key)) {
                    layerAttributes.push({
                        id: key,
                        name: key,
                        type: fields[key]
                    });
                }
            }
            this._layer.setFilterJson(layerAttributes);
            this.createFilterDialog();
        },

        /**
         * @method setCloseHandler
         * Sets click handler for the close button
         * @param {Function} pHandler click handler
         */
        setCloseButtonHandler: function (pHandler) {
            this._closeButtonHandler = pHandler;
        },

        /**
         * @method setClearHandler
         * Sets click handler for the clear button
         * @param {Function} pHandler click handler
         */
        setClearButtonHandler: function (pHandler) {
            this._clearButtonHandler = pHandler;
        },

        /**
         * @method setUpdateHandler
         * Sets click handler for the update button
         * @param {Function} pHandler click handler
         */
        setUpdateButtonHandler: function (pHandler) {
            this._updateButtonHandler = pHandler;
        }
    });
