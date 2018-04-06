Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorSelection', function (instance, sandbox) {
    this.instance = instance;
    this.sb = sandbox;
    this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    this._params = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorParameters', this.instance, this.instance.getSandbox());
    this.element = null;
    Oskari.makeObservable(this);
}, {
    __templates: {
        main: _.template('<div class="statsgrid-ds-selections"></div>'),
        selections: _.template('<div class="statsgrid-indicator-selections"></div>'),
        select: _.template('<div class="selection">' +
            '<div class="title">${name}</div>' +
            '<div class=${clazz}>' +
            '</div>' +
            '</div>'),
        headerWithTooltip: _.template('<div class="selection tooltip">' +
            '<div class="title">${title}</div>' +
            '<div class="tooltip">${tooltip1}</div>' +
            '<div class="tooltip">${tooltip2}</div>' +
            '</div>'),
        option: _.template('<option value="${id}">${name}</option>')
    },
    /** **** PRIVATE METHODS ******/

    /**
     * @method  @private _populateIndicators populate indicators
     * @param  {Object} select  jQuery element of selection
     * @param  {Integer} datasrc datasource
     */
    _populateIndicators: function (select, datasrc) {
        var me = this;
        var errorService = me.service.getErrorService();
        var locale = me.instance.getLocalization();

        if (!datasrc || datasrc === '') {
            return;
        }

        this.service.getIndicatorList(datasrc, function (err, result) {
            var results = [];

            if (err) {
                // notify error!!
                Oskari.log('Oskari.statistics.statsgrid.IndicatorSelection').warn('Error getting indicator list');
                errorService.show(locale.errors.title, locale.errors.indicatorListError);
                return;
            }

            result.indicators.forEach(function (ind) {
                var resultObj = {
                    id: ind.id,
                    title: Oskari.getLocalized(ind.name)
                };
                results.push(resultObj);
            });
            var value = select.getValue();
            select.updateOptions(results);
            select.setValue(value);
            if (result.complete) {
                me.spinner.stop();

                if (result.indicators.length === 0) {
                    errorService.show(locale.errors.title, locale.errors.indicatorListIsEmpty);
                }
            }
        });
    },
    setElement: function (el) {
        this.element = el;
    },
    getElement: function () {
        return this.element;
    },
    /** **** PUBLIC METHODS ******/

    /**
     * @method  @public getPanelContent get panel content
     * @return {Object} jQuery element
     */
    getPanelContent: function () {
        var me = this;
        var main = jQuery(this.__templates.main());
        var locale = me.instance.getLocalization();
        var panelLoc = locale.panels.newSearch;

        var datasources = this.service.getDatasource();
        var sources = [];
        datasources.forEach(function (ds) {
            var dataObj = {
                id: ds.id,
                title: ds.name
            };
            sources.push(dataObj);
        });
        // Datasources
        main.append(jQuery(this.__templates.select({name: locale.panels.newSearch.datasourceTitle, clazz: 'stats-ds-selector'})));
        // chosen works better when it has context for the element, get a new reference for chosen
        var dsSelector = main.find('.stats-ds-selector');
        var options = {
            placeholder_text: locale.panels.newSearch.selectDatasourcePlaceholder,
            allow_single_deselect: true,
            disable_search_threshold: 10,
            no_results_text: locale.panels.newSearch.noResults,
            width: '100%'
        };
        var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
        var dropdown = select.create(sources, options);
        dropdown.css({width: '100%'});
        dsSelector.append(dropdown);
        select.adjustChosen();

        // Indicator list
        main.append(jQuery(this.__templates.select({name: locale.panels.newSearch.indicatorTitle, clazz: 'stats-ind-selector'})));
        // chosen works better when it has context for the element, get a new reference for chosen
        var indicatorSelector = main.find('.stats-ind-selector');
        me.spinner.insertTo(indicatorSelector);
        var indicOptions = {
            placeholder_text: locale.panels.newSearch.selectIndicatorPlaceholder,
            allow_single_deselect: true,
            disable_search_threshold: 10,
            no_results_text: locale.panels.newSearch.noResults,
            width: '100%'
        };
        var indicSelect = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
        var indicDropdown = indicSelect.create(undefined, indicOptions);
        indicDropdown.css({width: '100%'});
        indicatorSelector.append(indicDropdown);
        indicSelect.adjustChosen();

        // Refine data label and tooltips
        var dataLabelWithTooltips = jQuery(this.__templates.headerWithTooltip({title: panelLoc.refineSearchLabel, tooltip1: panelLoc.refineSearchTooltip1 || '', tooltip2: panelLoc.refineSearchTooltip2 || ''}));
        main.append(dataLabelWithTooltips);

        // Refine data selections
        var selectionsContainer = jQuery(this.__templates.selections());
        main.append(selectionsContainer);

        dsSelector.on('change', function () {
            me._params.clean();

            // If removed selection then need to be also update indicator selection
            if (select.getValue() === '') {
                indicatorSelector.val(indicatorSelector.find('option:first').val());
                indicatorSelector.trigger('change');
                indicatorSelector.trigger('chosen:updated');
            } else {
                // else show spinner
                me.spinner.start();
            }

            me._populateIndicators(indicSelect, select.getValue());
        });

        indicatorSelector.on('change', function () {
            me._params.indicatorSelected(selectionsContainer,
                select.getValue(),
                indicSelect.getValue(),
                {
                    dataLabelWithTooltips: dataLabelWithTooltips
                });
        });

        me._params.on('indicator.changed', function (enabled) {
            me.trigger('indicator.changed', enabled);
        });

        this.service.on('StatsGrid.DatasourceEvent', function (evt) {
            var currentDS = select.getValue();
            if (currentDS !== evt.getDatasource()) {
                return;
            }
            // update indicator list
            me._populateIndicators(indicSelect, currentDS);
        });
        me.setElement(main);
        return main;
    },
    getValues: function () {
        if (!this._params) {
            return {};
        }

        return this._params.getValues();
    },
    getIndicatorSelector: function () {
        var el = this.getElement();
        var indicSel = el.find('.stats-ind-selector');
        return indicSel;
    }
});
