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
    function (fixedOptions, psandbox) {
        this.sandbox = psandbox || Oskari.getSandbox();
        this.WFSLayerService = this.sandbox.getService('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService');
        this._defaultLocKey = 'FilterDialog';
        this.loc = this._getLocalization('DivManazer');

        // Optionally fixed options
        this.fixedOptions = {};
        if (fixedOptions) {
            this.fixedOptions = fixedOptions;
        }

        this.__filterTemplates = {
            filterContent: '<div class="analyse-filter-popup-content">' +
                                '<div class="filter-selections-title"></div>' +
                                '<div class="filter-selection-radios">'+
                                '</div>'+
                           '</div>',
            filterContentClickedFeatures:   '<div id="clicked-features-selection-container">'+
                                                '<div class="clicked-features-radio">' +
                                                    '<input id="analyse-clicked-features" type="radio" name="analysis-filter-radio" class="filter-radio"/>' +
                                                    '<label id="filter-clicked-features" for="analyse-clicked-features"></label>' +
                                                '</div>' +
                                            '</div>',
            filterContentBBOX:  '<div id="bbox-selection-container">'+
                                    '<div class="bbox-on">' +
                                        '<input id="analyse-filter-bbox-on" type="radio" name="analysis-filter-radio"  class="filter-radio" value="true" />' +
                                        '<label for="analyse-filter-bbox-on"></label>' +
                                    '</div>' +
                                    '<div class="bbox-off">' +
                                        '<input id="analyse-filter-bbox-off" type="radio" name="analysis-filter-radio"  class="filter-radio" value="false" />' +
                                        '<label for="analyse-filter-bbox-off"></label>' +
                                    '</div>' +
                                '</div>',
            filterContentFilterByGeometry:  '<div id="filter-by-geometry-selection-container">'+
                                                '<div class="filter-by-geometry-radio">' +
                                                    '<input id="analyse-filter-by-geometry" type="radio" name="analysis-filter-radio"  class="filter-radio"/>' +
                                                    '<label id="filter-by-geometry-label" for="analyse-filter-by-geometry"></label>' +
                                                '</div>' +
                                                '<div class="filter-by-geometry-methods">' +
                                                    '<div class="filter-by-geometry-intersect">' +
                                                        '<input id="analyse-filter-by-geometry-intersect" type="radio" name="filter-by-geometry" value="Intersects" disabled/>' +
                                                        '<label id="filter-by-geometry-intersect-label" for="analyse-filter-by-geometry-intersect"></label>' +
                                                    '</div>' +
                                                    '<div class="filter-by-geometry-contains">' +
                                                        '<input id="analyse-filter-by-geometry-contains" type="radio" name="filter-by-geometry" value="Within" disabled/>' +
                                                        '<label id="filter-by-geometry-contains-label" for="analyse-filter-by-geometry-contains"></label>' +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>',
            filterContentValues: '<div class="analyse-filter analyse-filter-popup-values">' +
                                    '<div class="values-title"></div>' +
                                    '<div class="values-additional-info"></div>'+
                                 '</div>',
            filterContentOption: '<div class="filter-by-values-container">' +
                                    '<div class="case-sensitive-filtering">' +
                                        '<input name="case-sensitive" type="checkbox"></input>' +
                                        '<label for="case-sensitive"></label>' +
                                    '</div>' +
                                    '<div class="filter-option">' +
                                        '<select class="attribute"></select>' +
                                        '<select class="operator"></select>' +
                                        '<input name="attribute-value" class="filter-input-value" type="text"></input>' +
                                    '</div>' +
                                '</div>',
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
        createFilterDialog: function (layer, prevJson,  cb, clickedFeatures, selectedTemporaryFeatures) {
            var me = this,
                closeButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                // Clears the filter values
                clearButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                // Updates the filter values
                updateButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                layerAttributes,
                popupTitle,
                popupContent,
                prevJson,
                filterErrors;

            if (typeof layer !== "undefined") {
                me._layer = layer;
            }

            if (typeof me._layer === null) {
                return;
            }
            // Create filter dialog content
            layerAttributes = me._layer.getFilterJson();
            if (layerAttributes === null) {
                me._loadWFSLayerPropertiesAndTypes(me._layer.getId(), prevJson, cb, clickedFeatures, selectedTemporaryFeatures);
                return;
            }
            popupContent = this.getFilterDialogContent(me._layer, clickedFeatures, selectedTemporaryFeatures);
            popupTitle = this.loc.description + " " + me._layer.getName();

            // Create the actual popup dialog
            me.popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');

            closeButton.setTitle(this.loc.cancelButton);
            closeButton.addClass('analyse-close-filter');
            closeButton.setHandler(function () {
                me.popup.close(true);
                if (me._closeButtonHandler) {
                    me._closeButtonHandler.apply();
                }
            });

            clearButton.setTitle(me.loc.clearButton);
            clearButton.addClass('analyse-clear-filter');
            clearButton.setHandler(function () {
                // Sets the dialog content to its original state
                me.popup.setContent(me.getFilterDialogContent(me._layer, clickedFeatures, selectedTemporaryFeatures));
                if (me._clearButtonHandler) {
                    me._clearButtonHandler.apply();
                }
            });

            updateButton.setTitle(this.loc.refreshButton);
            updateButton.addClass('primary');
            updateButton.addClass('analyse-update-filter');
            updateButton.setHandler(function () {
                var filtersJson = me.getFilterValues();   // Get the filter values from the dialog
                // Validate the values for errors
                filterErrors = me._validateFilterValues(filtersJson);

                //"additional" errors, other than "missing value" etc.. ie. bbox selected but no property filters
                if (filtersJson.filterErrors) {

                    if (!filterErrors) {
                        filterErrors = [];
                    }
                    filterErrors = filterErrors.concat(filtersJson.filterErrors);
                }
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
            // If there's already filter values for current layer, populate the dialog with them.
            if (prevJson && !jQuery.isEmptyObject(prevJson))  {
                this.fillDialogContent(popupContent, prevJson, me._layer, clickedFeatures, selectedTemporaryFeatures);
            }

            me.popup.show(popupTitle, popupContent, [closeButton, clearButton, updateButton]);
            me.popup.getJqueryContent().addClass('filter-popup-content');
            me.popup.makeModal();

            // Make the popup draggable
            me.popup.makeDraggable();
            if (_.isArray(layerAttributes) && _.isFunction(cb)) {
               cb();
            }
        },

        /**
         * @method _getLocalization
         * Returns the localization object for the given key.
         *
         * @param  {String} locKey
         *
         * @return {Object/null}
         */
        _getLocalization: function (locKey) {
            var locale = Oskari.getLocalization(locKey),
                ret = null;

            if (locale) {
                ret = locale[this._defaultLocKey];
            }
            return ret;
        },
        /**
         * Creates the content for the filter dialog popup.
         *
         * @method getFilterDialogContent
         * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
         */
        getFilterDialogContent: function (layer, clickedFeatures, selectedTemporaryFeatures) {
            var me = this,
                content = jQuery(this.__filterTemplates.filterContent),
                selectionRadios = content.find('div.filter-selection-radios'),
                filterContentClickedFeatures = jQuery(this.__filterTemplates.filterContentClickedFeatures),
                filterContentBBOX = jQuery(this.__filterTemplates.filterContentBBOX),
                filterContentFilterByGeometry = jQuery(this.__filterTemplates.filterContentFilterByGeometry),
                valuesSelection = jQuery(this.__filterTemplates.filterContentValues),
                filterOption;

            if (typeof this.fixedOptions.bboxSelection === "undefined" || typeof this.fixedOptions.clickedFeaturesSelection === "undefined") {
                content.find('div.filter-selections-title').html('<h4>' + this.loc.content.title + '</h4>');
            }

            // The BBOX filter selection
            if (typeof this.fixedOptions.bboxSelection === "undefined") {
                filterContentBBOX.find('div.bbox-on').find('label').html(this.loc.bbox.on).prop('checked', true);
                filterContentBBOX.find('div.bbox-off').find('label').html(this.loc.bbox.off);
                selectionRadios.append(filterContentBBOX);
            }

            // Filter clicked features
            if (typeof this.fixedOptions.clickedFeaturesSelection === "undefined") {
                filterContentClickedFeatures.find('div.clicked-features-title').html('<h4>' + this.loc.clickedFeatures.title + '</h4>');
                filterContentClickedFeatures.find('label').html(this.loc.clickedFeatures.clickedFeaturesLabel);
                selectionRadios.append(filterContentClickedFeatures);
            }



            // Filter clicked features
            if (typeof this.fixedOptions.clickedFeaturesSelection === "undefined") {
                filterContentFilterByGeometry.find('#filter-by-geometry-label').html(this.loc.clickedFeatures.filterByGeometryLabel);
                filterContentFilterByGeometry.find('#filter-by-geometry-intersect-label').html(this.loc.clickedFeatures.filterByGeometryIntersect);
                filterContentFilterByGeometry.find('#filter-by-geometry-contains-label').html(this.loc.clickedFeatures.filterByGeometryContains);
                selectionRadios.append(filterContentFilterByGeometry);
            }

            // Filter values selection
            valuesSelection.find('div.values-title').html('<h4>' + this.loc.values.title + '</h4>');
            // Add a filter
            filterOption = this._addAttributeFilter(layer);
            valuesSelection.append(filterOption);

            content.append(valuesSelection);

            this._initFilterSelections(filterContentClickedFeatures, filterContentFilterByGeometry, filterContentBBOX, valuesSelection, clickedFeatures, selectedTemporaryFeatures);

            selectionRadios.find("input[name=analysis-filter-radio]").on("change", function(evt) {
                var filterByGeometryChecked = filterContentFilterByGeometry.find("input[name=analysis-filter-radio]").is(':checked');
                //check / uncheck the filter by geometry (the additional radios need toggling / disabling / enabling as well)
                me._toggleFilterByGeometrySelection(filterContentFilterByGeometry, selectedTemporaryFeatures, filterByGeometryChecked);

                //show / hide the values + a reassuring message
                me._toggleFilterByValuesSelection(filterContentClickedFeatures, filterContentFilterByGeometry, filterContentBBOX, valuesSelection);
            });

            return content;
        },
        /**
         * Initialises the filterselections
         * @method _initFilterSelections
         * @private
         */
        _initFilterSelections: function(filterContentClickedFeatures, filterContentFilterByGeometry, filterContentBBOX, valuesSelection, clickedFeatures, selectedTemporaryFeatures) {
            this._toggleClickedFeaturesSelection(filterContentClickedFeatures, clickedFeatures, clickedFeatures);
            this._toggleFilterByGeometrySelection(filterContentFilterByGeometry, selectedTemporaryFeatures, (!clickedFeatures && selectedTemporaryFeatures));
            this._toggleBBOXSelection(filterContentBBOX, (!clickedFeatures && !selectedTemporaryFeatures));
            this._toggleFilterByValuesSelection(filterContentClickedFeatures, filterContentFilterByGeometry, filterContentBBOX, valuesSelection);
        },
        /**
         * Toggles the clicked features selection radio of the filter dialog popup.
         *
         * @method _toggleClickedFeaturesSelection
         * @private
         * @param {DOM element} container
         * @param {boolean} activate
         */
        _toggleClickedFeaturesSelection: function(container, enable, check) {
            container.find('#analyse-clicked-features').prop({'checked': check, 'disabled': !enable});
        },
        /**
         * Toggles the filter by geometry radios of the filter dialog popup.
         *
         * @method _toggleFilterByGeometrySelection
         * @private
         * @param {DOM element} container
         * @param {boolean} activate
         */
        _toggleFilterByGeometrySelection: function(container, enable, check) {
            if (!enable) {
                check = false;
            }
            container.find('#analyse-filter-by-geometry').prop({'checked':check, 'disabled': !enable});
            if (check) {
                container.find('input[name="filter-by-geometry"]').prop({'disabled': !enable});
                //check the first option.
                container.find('#analyse-filter-by-geometry-intersect').prop({'checked': check, 'disabled': !enable})
            } else {
                container.find('input[name="filter-by-geometry"]').prop({'checked': check, 'disabled': true});
            }
        },
        /**
         * Toggles the bbox selection radios of the filter dialog popup.
         *
         * @method _toggleBBOXSelection
         * @private
         * @param {DOM element} container
         * @param {boolean} activate
         */
        _toggleBBOXSelection: function(container, check) {
            container.find('div.bbox-on').find('input[name=analysis-filter-radio]').prop({'checked': check});
            container.find('div.bbox-off').find('input[name=analysis-filter-radio]').prop({'checked': false});
        },
        /**
         * Toggles the property selections of the filter dialog popup.
         *
         * @method _toggleFilterByValuesSelection
         * @private
         */
        _toggleFilterByValuesSelection: function(filterContentClickedFeatures, filterContentFilterByGeometry, filterContentBBOX, valuesSelection) {
            var filterByGeometryChecked = filterContentFilterByGeometry.find("input[name=analysis-filter-radio]").is(':checked'),
                bboxOFF = filterContentBBOX.find('div.bbox-off').find("input[name=analysis-filter-radio]").is(':checked');
            if (bboxOFF) {
                valuesSelection.find("div.values-additional-info").html(this.loc.values.info.bboxOff);
                valuesSelection.find("div.filter-by-values-container").css({"display": "block"});
            } else if (filterByGeometryChecked) {
                valuesSelection.find("div.values-additional-info").html(this.loc.values.info.filterByGeometrySelected);
                valuesSelection.find("div.filter-by-values-container").css({"display": "none"})
            } else {
                valuesSelection.find("div.values-additional-info").html("");
                valuesSelection.find("div.filter-by-values-container").css({"display": "block"})
            }
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
        fillDialogContent: function (dialog, values, layer, clickedFeatures, selectedTemporaryFeatures) {
            var bboxDiv = dialog.find('#bbox-selection-container'),
                clickedFeaturesDiv = dialog.find('#clicked-features-selection-container'),
                filterByGeometryDiv = dialog.find('#filter-by-geometry-selection-container'),
                valuesDiv = dialog.find('div.analyse-filter-popup-values'),
                filterDiv = dialog.find('div.filter-option'),
                filter,
                i;
            if (values.bbox && !jQuery.isEmptyObject(values.bbox)) {
                // BBOX enabled
                this._toggleBBOXSelection(bboxDiv, true);
                this._toggleClickedFeaturesSelection(clickedFeaturesDiv, clickedFeatures, false);
                this._toggleFilterByGeometrySelection(filterByGeometryDiv, selectedTemporaryFeatures, false);
            } else if (values.noBBOX) {
                this._toggleBBOXSelection(bboxDiv, false);
                bboxDiv.find('div.bbox-off').find('input[name=analysis-filter-radio]').prop({'checked': true});
                this._toggleClickedFeaturesSelection(clickedFeaturesDiv, clickedFeatures, false);
                this._toggleFilterByGeometrySelection(filterByGeometryDiv, selectedTemporaryFeatures, false);
            //no previous selections (bbox or no bbox, ) and no selected features -> select bbox by default.
            } else if (!(clickedFeatures || selectedTemporaryFeatures)) {
                this._toggleBBOXSelection(bboxDiv, true);
                this._toggleClickedFeaturesSelection(clickedFeaturesDiv, clickedFeatures, false);
                this._toggleFilterByGeometrySelection(filterByGeometryDiv, selectedTemporaryFeatures, false);
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
                        valuesDiv.append(newFilterDiv);
                    }
                }
            }

            //the selection had been made before and there still are features selected?
            if (values.featureIds && clickedFeatures) {
                this._toggleClickedFeaturesSelection(clickedFeaturesDiv, true, true);
                this._toggleBBOXSelection(bboxDiv, false);
                this._toggleFilterByGeometrySelection(filterByGeometryDiv, selectedTemporaryFeatures, false);
            }
            if (values.filterByGeometryMethod && selectedTemporaryFeatures) {
                this._toggleFilterByGeometrySelection(filterByGeometryDiv, true, true);
                dialog.find('#analyse-filter-by-geometry').prop('checked', true);
                var method = values.filterByGeometryMethod;
                dialog.find('input[value=' + method+ ']').prop('checked', true);
                this._toggleBBOXSelection(bboxDiv, false);
                this._toggleClickedFeaturesSelection(clickedFeaturesDiv, clickedFeatures, false);
            }

            this._toggleFilterByValuesSelection(clickedFeaturesDiv, filterByGeometryDiv, bboxDiv, valuesDiv);

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
                attrPlaceHolder = this.loc.values.placeholders.attribute,
                opSelect = filterOption.find('select.operator'),
                opPlaceHolder = this.loc.values.placeholders.operator;

            filterOption.find('label').html(this.loc.values.placeholders['case-sensitive']);

            // Appends values to the attribute select.
            this._appendOptionValues(attrSelect, attrPlaceHolder, me._getLayerAttributes(layer));
            // Appends values to the operator select.
            // values: equals, like, not equals, not like, greater than, less than,
            //         greater or equal than, less or equal than
            this._appendOptionValues(opSelect, null, [
                {
                    id: '=',
                    name: this.loc.values.equals
                }, {
                    id: '~=',
                    name: this.loc.values.like
                }, {
                    id: '≠',
                    name: this.loc.values.notEquals
                }, {
                    id: '~≠',
                    name: this.loc.values.notLike
                }, {
                    id: '>',
                    name: this.loc.values.greaterThan
                }, {
                    id: '<',
                    name: this.loc.values.lessThan
                }, {
                    id: '≥',
                    name: this.loc.values.greaterThanOrEqualTo
                }, {
                    id: '≤',
                    name: this.loc.values.lessThanOrEqualTo
                }
            ]);

            // Placeholder to the attribute value input.
            filterOption.find('input[name=attribute-value]').attr('placeholder', this.loc.values.placeholders['attribute-value']);

            filterOption.find('input[name=case-sensitive]').attr('title', this.loc.values.placeholders['case-sensitive']);

            // Add link to filter with aggregate values if there are any
            if (this.fixedOptions.addLinkToAggregateValues === true) {
                filterOption.find('.filter-option')
                    .addClass("filter-option-aggregate")
                    .find('input[name=attribute-value]')
                    .wrap('<div class="attribute-value-block"></div>')
                    .after('<div class="add-link"><a href="javascript:void(0)">' + this.loc.aggregateAnalysisFilter.addAggregateFilter + '</a></div>');
            }

            // Add the buttons to remove this filter and to add a new filter.
            filterOption.find('.filter-option').append(this._addManageFilterOption(layer));

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
                filterContentOption = jQuery(this.__filterTemplates.filterContentOption),
                addTitle = this.loc.addFilter,
                removeTitle = this.loc.removeFilter;

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
            var parent = element.parents('div.filter-by-values-container'),
                // Previous filter selection element
                prevSibling = parent.prev('div.filter-by-values-container'),
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
                boolPlaceHolder = this.loc.values.placeholders.boolean;

            // Put the default boolean values to the select.
            this._appendOptionValues(boolOption, null, [
                'AND', 'OR'
            ]);

            return boolOption;
        },
        /**
         * Reads the layer attributes and returns an object with
         * keys from the fields array and values from the locales array.
         *
         * @method _getLayerAttributes
         * @private
         * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
         */
        _getLayerAttributes: function (layer) {
            // Make copies of fields and locales
            var fields = (layer.getFields && layer.getFields()) ? layer.getFields().slice(0) : [],
                locales = (layer.getLocales && layer.getLocales()) ? layer.getLocales().slice(0) : [],
                attributes = [],
                i;

            for (i = 0; i < fields.length; i += 1) {
                // Get only the fields which originate from the service,
                // that is, exclude those which are added by Oskari (starts with '__').
                if (!fields[i].match(/^__/)) {
                    attributes.push({
                        id: fields[i],
                        name: (locales[i] || fields[i])
                    });
                }
            }

            return attributes;
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
                filterByGeometry,
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
                bboxValue = jQuery(popupContent).find('#bbox-selection-container').find('input[name=analysis-filter-radio]:checked').val();
            } else {
                bboxValue = this.fixedOptions.bboxSelection;
            }
            if ('true' === bboxValue) {
                filterValues.bbox = this.sandbox.getMap().getBbox();
            }
            else if ('false' === bboxValue) {
                filterValues.noBBOX = true;
            }

            if (typeof this.fixedOptions.clickedFeaturesSelection === "undefined") {
                clickedFeatures = jQuery(popupContent).find('#clicked-features-selection-container').find('input[name=analysis-filter-radio]').is(':checked');
                filterByGeometry = jQuery(popupContent).find('#filter-by-geometry-selection-container').find('input[name=filter-by-geometry]:checked').val();
            } else {
                clickedFeatures = this.fixedOptions.clickedFeaturesSelection;
            }
            if (clickedFeatures) {
                if (jQuery(popupContent).find('#clicked-features-selection-container').find('input[name=analysis-filter-radio]').is(':disabled')) {
                    filterValues.featureIds = false;
                    jQuery(popupContent).find('#clicked-features-selection-container').find('input[name=analysis-filter-radio]').attr('checked', false);
                } else {
                    filterValues.featureIds = true;
                }
            }
            if (filterByGeometry) {
                if (jQuery(popupContent).find('#filter-by-geometry-selection-container').find('input[name=analysis-filter-radio]').is(':disabled')) {
                    filterValues.filterByGeometryMethod = false;
                    //uncheck the sub boxes
                    jQuery(popupContent).find('input[name=filter-by-geometry]').attr('checked', false);
                    jQuery(popupContent).find('#filter-by-geometry-selection-container').find('input[name=analysis-filter-radio]').attr('checked', false);
                } else {
                    filterValues.filterByGeometryMethod = filterByGeometry;
                }
            }

            // Get the actual filters.
            domFilters = jQuery(popupContent).find('div.filter-option');

            //skip the property filters, if filtering by geometry or selected features is selected.
            if (!(filterValues.filterByGeometryMethod)) {
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
            }

            if (filterValues.noBBOX && (!filterValues.filters || filterValues.filters.length === 0)) {
                if (!filterValues.filterErrors) {
                    filterValues.filterErrors = [];
                }
                filterValues.filterErrors.push("bbox_selected_with_no_properties");
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
                filters = (filterValues && filterValues.filters ? filterValues.filters : []),
                filter,
                i;

            for (i = 0; filters && i < filters.length; i += 1) {
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
            var loc = this.loc.validation,
                popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                closeButton = popup.createCloseButton(Oskari.getMsg('DivManazer', 'buttons.ok')),
                popupTitle = (this.loc.error && this.loc.error.title) ? this.loc.error.title : '',
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
        _loadWFSLayerPropertiesAndTypes:function (layer_id, prevJson, cb, clickedFeatures, selectedTemporaryFeatures) {
            var me = this,
                url = me.sandbox.getAjaxUrl()

            // Request analyis layers via the backend
            me._getWFSLayerPropertiesAndTypes(layer_id,
                // Success callback

                function (response) {
                    if (response) {
                        me._handleWFSLayerPropertiesAndTypesResponse(response, prevJson, cb, clickedFeatures, selectedTemporaryFeatures);
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
            var url = this.sandbox.getAjaxUrl() + 'action_route=GetWFSDescribeFeature&simple=true&layer_id=' + layer_id;
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
        _handleWFSLayerPropertiesAndTypesResponse: function (propertyJson, prevJson, cb, clickedFeatures, selectedTemporaryFeatures) {
            var me = this,
                prevJson,
                fields = propertyJson.propertyTypes;
            var layerAttributes = [];
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
            this.createFilterDialog(this._layer, prevJson, cb, clickedFeatures, selectedTemporaryFeatures);
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
