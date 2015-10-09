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
        me.__selectedDataSource = null;
        me.__selectedIndicator = null;
        me.__dataSourceSelect = null;
        me.__indicatorSelect = null;
        me.__addRemoveButton = null;
        me.dialog = null;
    }, {
        _templates: {
            main: '<form class="statsgrid2_indicator_selector">' +
                      '<div class="indicator-cont">' +
                          '<label><span></span><select name="datasource"></select></label>' +
                          '<label><span></span><select name="indicator"></select></label>' +
                      '</div><div class="parameters-cont"></div><div class="buttons-cont"></div>' +
                  '</form>',
            selector: '<label><span></span><select></select></label>',
            option: '<option></option>',
            infoIcon: '<div class="icon-info"></div>',
            metadataPopup: '<div>' +
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
                btn = Oskari.clazz.create('Oskari.userinterface.component.buttons.SearchButton'),
                el = jQuery(me._templates.main),
                sandbox = me.statisticsService.getSandbox();

            me.el = el;
            me._createDataSourceSelect(el.find('select[name=datasource]').parent());
            me._createIndicatorSelect(el.find('select[name=indicator]').parent());
            container.append(el);
            btn.setTitle(me._locale.addColumn);
            btn.setHandler(function (event) {
                event.preventDefault();
                // Notify other components of indicator selection
                var opts,
                    eventBuilder = sandbox.getEventBuilder('StatsGrid.IndicatorSelectedEvent'),
                    evt;
                if (eventBuilder) {
                    opts = me.getSelections();
                    evt = eventBuilder(opts.datasource, opts.indicator, opts.options);
                    sandbox.notifyAll(evt);
                }
                return false;
            });
            btn.insertTo(el.find('.buttons-cont'));
            me.__addRemoveButton = btn;
            btn.setEnabled(false);

            me.statisticsService.getDataSources(function (dsList) {
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
            me._initSelectChosen(select);

            me.__dataSourceSelect = select;
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
            label.append(me._locale.indicators);

            // if the value changes, fetch indicator meta data
            select.change(function (e) {
                var option = select.find('option:selected'),
                    isOwn = option.attr('data-isOwnIndicator');
                me.changeIndicator(option.val(), (isOwn === 'true'));
            });

            select.attr('data-placeholder', me._locale.selectIndicator);
            select.attr('data-no_results', me._locale.noMatch);

            // we use chosen to create autocomplete version of indicator select element.
            me._initSelectChosen(select);
            // used when populating later on 
            me.__indicatorSelect = select;
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
            this.setIndicators([]);
        },

        /**
         * @method setIndicators
         * @param {Array} indicators
         * Sets the given values as indicator options
         */
        setIndicators: function (indicators) {
            this.__setSelectOptions(this.__indicatorSelect, indicators, false);
            this.changeIndicator();
        },

        /**
         * @method changeDataSource
         * @param {String} id Data source ID
         * Sets the given value as data source
         */
        changeDataSource: function (id) {
            var me = this;
            me.setIndicators([]);
            var ds = me.statisticsService.getDataSource(id);
            if (!ds) {
                //alert("Couldn't find Datasource for id " + id);
                return;
            }
            me.__selectedDataSource = ds;

            //clear the selectors containers
            me.statisticsService.getIndicators(
                id,
                function (indicators) {
                    if (!indicators) {
                        // something went wrong
                        return;
                    }
                    me.setIndicators(indicators);
                }
            );
            var indicatorParamsContainer = me.getIndicatorParamsContainer();
            //me.createDemographicsSelects(container, null);
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
            if (!id) {
                // clear previous indicator options
                me._createDynamicIndicatorOptions();
                return;
            }
            // setup values for options
            var optionsContainer = me.getIndicatorParamsContainer(),
                select,
                options,
                value,
                ds = me.getSelectedDatasource();

            me.statisticsService.getIndicatorMetadata(ds.getId(), id, function (indicator) {
                if (!indicator) {
                    // something went wrong
                }
                me.__selectedIndicator = indicator;
                _.each(ds.getIndicatorParams(), function (item) {
                    select = optionsContainer.find('select[name=' + item.name + ']');
                    options = [];
                    if (indicator) {
                        // FIXME getParamValues should return:
                        // - [{id: 1}] when there's no separate label
                        // - [{id: 1, value: 'label'}] when label is not localized
                        // - [{id: 1, value: {'fi', 'label'}}] when label is localized
                        options = indicator.getParamValues(item.name);
                    }
                    // clear previous values
                    select.empty();
                    if (options.length === 0) {
                        // no options for this select in selected indicator
                        select.attr('disabled', 'disabled');
                        return;
                    }
                    select.removeAttr('disabled');
                    _.each(options, function (opt) {
                        me._addOption(opt, opt, select);
                    });
                });
                // Indicator selection decides the add/remove button status
                me._updateAddRemoveButtonState();
                me.__showIndicatorInfoButton(indicator);
                me.__addRemoveButton.setEnabled(!!indicator);
            });
            //me.deleteIndicatorInfoButton(container);
            //me.getStatsIndicatorMeta(container, indicatorId);
        },

        getIndicatorParamsContainer: function () {
            return this.el.find('.parameters-cont');
        },

        getSelectedDatasource: function () {
            return this.__selectedDataSource;
        },

        getSelectedIndicator: function () {
            return this.__selectedIndicator;
        },

        /**
         * @method getSelections
         * @return {Object} User indicator selection
         * Get user indicator selections
         */
        getSelections: function () {
            var result = {
                datasource: null,
                indicator: null,
                options: {}
            };
            if (this.getSelectedDatasource()) {
                result.datasource = this.getSelectedDatasource().getId();
            }
            if (this.getSelectedIndicator()) {
                result.indicator = this.getSelectedIndicator().getId();
                var optionsContainer = this.getIndicatorParamsContainer(),
                    select = optionsContainer.find('select');

                _.each(select, function (opt) {
                    var dom = jQuery(opt),
                        value = dom.val();
                    if (value !== null && value !== undefined) {
                        result.options[dom.attr('name')] = value;
                    }
                });
            }
            return result;
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
         * @method _updateAddRemoveButtonState
         * @private
         * Update add/remove button state based on user selections
         */
        _updateAddRemoveButtonState: function () {
            var me = this,
                buttonTitle,
                loc = me._locale,
                primary = true,
                selections = me.getSelections();

            if (!selections.indicator || !me._indicatorRegionSupported(selections)) {
                // no indicator selected
                // set button to add
                buttonTitle = loc.addColumn;
                // disable button
                me._disableAddRemoveButton();
            } else {
                if (me.userSelectionService.isIndicatorSelected(selections)) {
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
                indicatorCont = me.el.find('.indicator-cont > label:last-of-type > span'),
                meta = indicator.getMetadata();
            // append this indicator
            indicatorCont.append(infoIcon);

            // show meta data
            infoIcon.click(function (e) {
                var lang = Oskari.getLang(),
                    desc = jQuery(me._templates.metadataPopup);

                desc.find('h4.indicator-msg-popup-title').append(me._locale.stats.descriptionTitle);
                desc.find('p.indicator-msg-popup-title').append(meta.description[lang]);
                desc.find('h4.indicator-msg-popup-source').append(me._locale.stats.sourceTitle);
                desc.find('p.indicator-msg-popup-source').append(meta.organization.title[lang]);
                me.showMessage(meta.title[lang], desc);
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
         * @method _createDynamicIndicatorOptions
         * @private
         * Creates dynamic indicator options panel (usually year and gender)
         */
        _createDynamicIndicatorOptions: function () {
            var me = this,
                optionsContainer = me.getIndicatorParamsContainer(),
                ds = me.getSelectedDatasource();
            optionsContainer.empty(); // == me.deleteDemographicsSelect(container);
            me.__removeIndicatorInfoButton();
            if (!ds) {
                // no datasource selection, only clear
                return;
            }
            // Indicators' select container etc.
            _.each(ds.getIndicatorParams(), function (item) {
                var indicatorSelector = jQuery(me._templates.selector),
                    label = indicatorSelector.find('> span'),
                    select = indicatorSelector.find('select'),
                    labelText = item.name;
                // TODO: setup options locales in own structure like ~me.locale.optionLabels[key] 
                if (me._locale[item.name]) {
                    labelText = me._locale[item.name];
                }
                label.append(labelText);
                select.attr('name', item.name);
                select.attr('disabled', 'disabled');
                optionsContainer.append(indicatorSelector);
            });
            /*
            var optionsContainer = this.getIndicatorParamsContainer();
            _.each(ds.getIndicatorParams(), function (item) {
                optionsContainer.find('select.' + item.getName()).attr('disabled', 'disabled');
            });
            */
            //me._addOwnIndicatorButton(optionsContainer);
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
            option.val(value).text(label);
            if (select) {
                select.append(option);
            }
            return option;
        },

        eventHandlers: {
            'StatsGrid.IndicatorSelectedEvent' : function(e) {
                // TODO check if options match
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
