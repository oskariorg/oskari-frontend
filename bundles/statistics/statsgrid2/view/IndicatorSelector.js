/**
 * @class Oskari.statistics.bundle.statsgrid.view.IndicatorSelector
 *
 * Creates indicator selector
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.view.IndicatorSelector',
    /**
     * @static constructor function
     */
    function (localization, statisticsService, userSelectionService) {
        var me = this;
        me._locale = localization;
        me.statisticsService = statisticsService;
        me.userSelectionService = userSelectionService;
        me.el = null;
        me.__selectedDataSourceId = null;
        me.__selectedDataSource = null;
        me.__selectedIndicatorId = null;
        me.__selectedIndicator = null;
        me.__selectedSelections = {};
        me.__dataSourceSelect = null;
        me.__indicatorSelect = null;
        me.__selectorsSelects = [];
        me.__addRemoveButton = null;
        me.dialog = null;
        me._indicatorMetadata = {};
    }, {
        _templates: {
            'main': '<form class="statsgrid2_indicator_selector">' +
                      '<div class="indicator-cont">' +
                          // At least these values must be selected for every indicator.
                          // Additionally some indicator-dependent selectors might be needed.
                          // Note that Chosen-select is used here.
                          '<label><span></span><select name="datasource" style="width: 300px;"></select></label>' +
                          '<label><span name="indicator-span"></span><select name="indicator" style="width: 300px;"></select></label>' +
                          // the optional selectors will be populated here when the above have been selected.
                          '<div name="selectors-div"></div>' +
                      '</div><div class="parameters-cont"></div><div class="buttons-cont"></div>' +
                  '</form>',
            'selector': '<label><span></span><select></select></label>',
            'option': '<option></option>',
            'infoIcon': '<div class="icon-info"></div>',
            'metadataPopup': '<div>' +
                               '<h4 class="indicator-msg-popup-title"></h4>' +
                               '<p class="indicator-msg-popup-title"></p>' +
                               '<h4 class="indicator-msg-popup-source"></h4>' +
                               '<p class="indicator-msg-popup-source"></p>' +
                           '</div>'
        },

        /**
         * @method render
         * @param {DOMElement} container
         */
        render: function (container) {
            var me = this,
                addRemoveButton = Oskari.clazz.create('Oskari.userinterface.component.buttons.SearchButton'),
                el = jQuery(me._templates.main),
                sandbox = me.statisticsService.getSandbox();

            me.el = el;
            // Add column button adds the selected indicator (with selectors applied) to the grid as a column.
            addRemoveButton.setTitle(me._locale.addColumn);
            addRemoveButton.setHandler(function (event) {
                event.preventDefault();
                // Notify other components of indicator selection
                var opts,
                    eventBuilder = sandbox.getEventBuilder('StatsGrid.IndicatorSelectedEvent'),
                    evt;
                if (eventBuilder) {
                    evt = eventBuilder(me.__selectedIndicator, me.__selectedDataSourceId,
                            me.__selectedIndicatorId, me.__selectedSelections);
                    sandbox.notifyAll(evt);
                }
                return false;
            });
            addRemoveButton.insertTo(el.find('.buttons-cont'));
            me.__addRemoveButton = addRemoveButton;
            // The button will be enabled when all the required selections are selected.
            addRemoveButton.setEnabled(false);

            me._createDataSourceSelect(el.find('select[name=datasource]').parent());
            me._createIndicatorSelect(el.find('select[name=indicator]').parent());
            container.append(el);
            me.statisticsService.getDataSources(function (indicatorMetadata) {
                me._indicatorMetadata = indicatorMetadata;
                var dsList = indicatorMetadata.getPluginIds().map(function(pluginId) {
                    // This is the item object expected by the setDataSources and other similar methods.
                    return {
                        getId: function() {
                            return pluginId;
                        },
                        getName: function(lang) {
                            // Note: lang is not needed here.
                            var localizationKey = indicatorMetadata.getPlugin(pluginId).getLocalizationKey();
                            return me._locale.statistic.plugins[localizationKey] ?
                                    me._locale.statistic.plugins[localizationKey] :
                                        localizationKey;
                        }
                    };
                });
                me.setDataSources(dsList, true);
            });
        },

        /**
         * Create datasource drop down select
         * @private
         * @method _createDataSourceSelect
         * @param {DOMElement} container
         */
        _createDataSourceSelect: function (container) {
            var me = this,
                label = container.find('span'),
                select = container.find('select');

            label.text(me._locale.tab.grid.organization);

            select.on('change', function (e) {
                me.changeDataSource(e.target.value);
            });

            select.attr('data-placeholder', me._locale.selectDataSource);
            select.attr('data-no_results', me._locale.noDataSource);
            me.__dataSourceSelect = select;
            me._initSelectChosen(select);
        },

        /**
         * Create indicators drop down select
         * @private
         * @method _createIndicatorSelect
         * @param {DOMElement} container
         */
        _createIndicatorSelect: function (container) {
            var me = this,
                label = container.find('span'),
                select = container.find('select');
            label.text(me._locale.indicators);

            select.on('change', function (e) {
                me.changeIndicator(e.target.value);
            });
            select.attr('data-placeholder', me._locale.selectIndicator);
            select.attr('data-no_results', me._locale.noMatch);

            // used when populating later on
            me.__indicatorSelect = select;
            // we use chosen to create autocomplete version of indicator select element.
            me._initSelectChosen(select);
            // this gives indicators more space to show title on dropdown
            //container.find('.chzn-drop').css('width', '298px');
            //container.find('.chzn-search input').css('width', '263px');
        },

        /**
         * @method _initSelectChosen
         * @param {DOMElement} select
         * @private
         * Initialise chosen on the given select DOM element.
         */
        _initSelectChosen: function (select) {
            var chosenOptions = {},
                noResultsKey = select.attr('data-no_results');

            if (noResultsKey) {
                chosenOptions.no_results_text = this._locale[noResultsKey];
            }
            select.chosen(chosenOptions);
        },

        /**
         * @method setDataSources
         * @param {Array} items
         * Sets the given values as data source options
         */
        setDataSources: function (items) {
            this.__setSelectOptions(this.__dataSourceSelect, items, true);
        },

        getLocalizationFrom: function(localizedNames, fallback, lang) {
            var name = localizedNames.getLocalization(lang);
            if (!name) {
                name = localizedNames.getLocalization("fi");
            }
            if (!name) {
                name = localizedNames.getLocalization("en");
            }
            if (!name) {
                if (Object.keys(localizedNames) > 0) {
                    // Taking the first one.
                    name = localizedNames[localizedNames.getLocalizationKeys()[0]];
                } else {
                    name = indicatorId;
                }
            }
            return name;
        },
        /**
         * @method setIndicators
         * @param {Array} indicators
         * Sets the given values as indicator options
         */
        setIndicators: function (indicators) {
            var me = this,
                indicatorList = indicators.getIndicatorIds().map(function(indicatorId) {
                // This is the item object expected by the __setSelectOptions.
                return {
                    getId: function() {
                        return indicatorId;
                    },
                    getName: function(lang) {
                        return me.getLocalizationFrom(indicators.getIndicator(indicatorId).getName(), indicatorId, lang);
                    }
                };
            });
            this.__setSelectOptions(this.__indicatorSelect, indicatorList, false);
        },

        /**
         * @method setSelections
         * Creates user indicator selector select inputs
         */
        setSelections: function (selectors) {
            var me = this,
                optionsContainer = this.getIndicatorParamsContainer()
            if (selectors) {
                optionsContainer.empty();
                me.__selectedSelections = {};
                me.__selectorsSelects = [];

                _.each(selectors, function (selector) {
                    var selectorCont = jQuery('<label><span></span><select name="selectors-' + selector.id + '"' +
                            ' style="width: 300px;"></select></label>'),
                        selectorSelect = selectorCont.find('select[name=selectors-' + selector.id + ']'),
                        label = selectorCont.find('span'),
                        selectorsList = selector.allowedValues.map(function(allowedValue) {
                        return {
                                getId: function() {
                                    return allowedValue;
                                },
                                getName: function(lang) {
                                    if (me._locale.selectorValues[selector.id] &&
                                            me._locale.selectorValues[selector.id][allowedValue]) {
                                        return me._locale.selectorValues[selector.id][allowedValue];
                                    } else {
                                        return allowedValue;
                                    }
                                }
                            };
                    });
                    optionsContainer.append(selectorCont);
                    selectorSelect.on('change', me.changeSelections(selectorSelect, selector.id));
                    var option = selectorSelect.find('option:selected');
                    me.__selectedSelections[selector.id] = option.val();

                    label.text(me._locale.selectors[selector.id]);
                    selectorSelect.attr('data-placeholder', me._locale.selectorPlaceholders[selector.id]);
                    selectorSelect.attr('data-no_results', me._locale.noMatch);
                    me.__setSelectOptions(selectorSelect, selectorsList, false);
                    me._initSelectChosen(selectorSelect);
                    // Update chosen options. Don't really know why 'liszt' instead of chosen but the linked chosen version seems to use it.
                    // Apparently newer chosen versions use 'chosen', so keep that in mind if you update the library.
                    selectorSelect.trigger('liszt:updated');
                    selectorSelect.trigger('chosen:updated');
                    me.__selectorsSelects = me.__selectorsSelects.concat(selectorSelect);
                });
            }
        },

        /**
         * @method changeDataSource
         * @param {String} id Data source ID
         * Sets the given value as data source
         */
        changeDataSource: function (pluginId) {
            var me = this;
            var ds = me._indicatorMetadata.getPlugin(pluginId);
            if (!ds) {
                //alert("Couldn't find Datasource for id " + pluginId);
                return;
            }
            me.__selectedDataSourceId = pluginId;
            me.__selectedDataSource = ds;
            me.__selectedIndicatorId = null;
            me.__selectedIndicator = null;
            me.__selectedSelections = {};

            //clear the selectors containers
            me.setIndicators(ds.getIndicators());
            var indicatorParamsContainer = me.getIndicatorParamsContainer();
        },

        /**
         * @method changeIndicator
         * @param {String} id
         * Sets the given value as indicator
         */
        changeIndicator: function (id) {
            var me = this;
            // Disable button until we get indicator metadata
            me._disableAddRemoveButton();
            // setup values for options
            var optionsContainer = me.getIndicatorParamsContainer(),
                select,
                options,
                value,
                ds = me.getSelectedDatasource();

            me.__selectedSelections = {};
            me.__selectedIndicatorId = id;
            me.__selectedIndicator = ds.getIndicators().getIndicator(id);
            me.__showIndicatorInfoButton(me.__selectedIndicator);

            me.setSelections(me.__selectedIndicator.getSelectors());

            me._updateAddRemoveButtonState();
        },

        /**
         * @method changeSelections
         * Handler for the selectors being changed. Ultimately this fetches the indicator values and shows them.
         * @return Handler for the certain selections being changed.
         */
        changeSelections: function(selectorSelect, id) {
            var me = this;
            return function () {
                var option = selectorSelect.find('option:selected');
                me.__selectedSelections[id] = option.val();
                me._updateAddRemoveButtonState();
            };
        },

        getIndicatorParamsContainer: function () {
            return this.el.find('[name=selectors-div]');
        },

        getSelectedDatasource: function () {
            return this.__selectedDataSource;
        },

        getSelectedIndicator: function () {
            return this.__selectedIndicator;
        },

        /**
         * @method _disableAddRemoveButton
         * @private
         * Disable add/remove button
         */
        _disableAddRemoveButton: function () {
            this.__addRemoveButton.setEnabled(false);
        },
        /**
         * Checks if all the required values for the specific indicator are selected.
         */
        _selectionsOk: function() {
            var ok = true,
              me = this;
            Object.keys(me.__selectedSelections).forEach(function(selectorId) {
                if (! me.__selectedSelections[selectorId]) {
                    ok = false;
                }
            });
            return ok;
        },

        /**
         * @method _updateAddRemoveButtonState
         * @private
         * Update add/remove button state based on user selections
         */
        _updateAddRemoveButtonState: function () {
            var me = this,
                buttonTitle,
                loc = me._locale,
                primary = true;

            if (!me.__selectedDataSource ||
                !me.__selectedIndicator ||
                !me._selectionsOk()) {
                // no datasource, indicator, or selections selected.
                // set button to add
                buttonTitle = loc.addColumn;
                // disable button
                me._disableAddRemoveButton();
            } else {
                if (me.userSelectionService.isIndicatorSelected(
                        me.__selectedDataSource,
                        me.__selectedIndicator,
                        me.__selectedSelections
                        )) {
                    // selection is already active
                    // set button to remove
                    buttonTitle = loc.removeColumn;
                    // destructive operations shouldn't be primary
                    primary = false;
                } else {
                    // selection is not active
                    // set button to add
                    buttonTitle = loc.addColumn;
                }
                // set button label
                me.__addRemoveButton.setTitle(buttonTitle);
                // set button primary state
                me.__addRemoveButton.setPrimary(primary);
                // enable button
                me.__addRemoveButton.setEnabled(true);
            }
        },

        /**
         * @method __showIndicatorInfoButton
         * @private
         * @param indicator meta data
         * Create indicator meta info button
         */
        __showIndicatorInfoButton: function (indicator) {
            // clear previous indicator
            this.__removeIndicatorInfoButton();
            if (!indicator) {
                return;
            }
            var me = this,
                infoIcon = jQuery(me._templates.infoIcon),
                indicatorCont = me.el.find('span[name=indicator-span]'),
                source = indicator.getSource(),
                description = indicator.getDescription();
            // append this indicator
            indicatorCont.append(infoIcon);

            // show meta data
            infoIcon.click(function (e) {
                var lang = Oskari.getLang(),
                    desc = jQuery(me._templates.metadataPopup);

                desc.find('h4.indicator-msg-popup-title').append(me._locale.stats.descriptionTitle);
                desc.find('p.indicator-msg-popup-title').append(
                        me.getLocalizationFrom(description, "", lang));
                desc.find('h4.indicator-msg-popup-source').append(me._locale.stats.sourceTitle);
                desc.find('p.indicator-msg-popup-source').append(
                        me.getLocalizationFrom(source, "", lang));
                me.showMessage(me.getLocalizationFrom(indicator.getName(), "", lang), desc);
            });
        },

        /**
         * @method __removeIndicatorInfoButton
         * @private
         * Removes button linkin to indicator metadata
         */
        __removeIndicatorInfoButton: function () {
            this.el.find('.indicator-cont .icon-info').remove();
        },

        /**
         * @method _indicatorRegionSupported
         * @param {Object} selections
         * @private
         * @return {Boolean} Whether the region is supported or not
         *
         * Checks if the indicator can be shown in the selected region division,
         * shows a popup if not.
         */
        _indicatorRegionSupported: function (selections) {
            // TODO implement
            return true;
        },

        /**
         * @method showMessage
         * @param {String} title popup title
         * @param {String} message popup message
         * Shows user a message with ok button
         */
        showMessage: function (title, message, buttons) {
            var me = this,
                loc = me._locale,
                dialog;
            // Oskari components aren't available in a published map.
            if (me.dialog) {
                me.dialog.close(true);
                me.dialog = null;
                return;
            }

            dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            if (buttons) {
                dialog.show(title, message, buttons);
            } else {
                var okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
                okBtn.setHandler(function () {
                    dialog.close(true);
                    me.dialog = null;
                });
                dialog.show(title, message, [okBtn]);
                me.dialog = dialog;
            }
        },

        /**
         * @method __setSelectOptions
         * @param  {DOMElement} select    Select DOM element
         * @param  {Object[]}   items     Select options
         * @param  {Boolean}    preselect [description]
         * @private
         * Setup options to a select element based on given items
         */
        __setSelectOptions: function (select, items, preselect) {
            var me = this,
                lang = Oskari.getLang(),
                opt;
            select.empty();
            _.each(items, function (item) {
                if (!item.getId()) {
                    return;
                }
                opt = me._addOption(item.getId(), item.getName(lang), select);
                opt.attr('data-isOwnIndicator', !!item.ownIndicator);
            });

            // Reset chosen just so we get back to no selection...
            select.chosen('destroy');
            if (preselect && items.length > 0) {
                select.trigger('change', {
                    target: {
                        value: items[0].getId()
                    }
                });
            } else {
                // Make sure there's no selection
                select.prop('selectedIndex', -1);
            }
            me._initSelectChosen(select);
            // Update chosen options. Don't really know why 'liszt' instead of chosen but the linked chosen version seems to use it.
            // Apparently newer chosen versions use 'chosen', so keep that in mind if you update the library.
            select.trigger('liszt:updated');
            select.trigger('chosen:updated');
        },

        /**
         * @method _addOption
         * @param {String}     value  Option value
         * @param {String}     label  Option label
         * @param {DOMElement} select (optional) Select element where the option will be appended
         * @private
         * Create an option for select and add it to given select element if given
         */
        _addOption: function (value, label, select) {
            var option = jQuery(this._templates.option);
            option.val(value);
            option.text(label);
            if (select) {
                select.append(option);
            }
            return option;
        },

        eventHandlers: {
            'StatsGrid.IndicatorSelectedEvent' : function(e) {
                // FIXME: check if options match
                if (e && e.getDatasourceId() === this.getSelectedDatasource() &&
                        e.getIndicatorId() === this.getSelectedIndicator()) {
                    this._updateAddRemoveButtonState();
                }
            }
        }
    },
    {
        'extend' : ['Oskari.userinterface.extension.DefaultModule']
    }
);
