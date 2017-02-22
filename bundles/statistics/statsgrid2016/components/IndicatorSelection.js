Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorSelection', function(instance, sandbox) {
    this.instance = instance;
    this.sb = sandbox;
    this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
}, {
    __templates : {
        main : _.template('<div class="statsgrid-ds-selections"></div>'),
        selections : _.template('<div class="statsgrid-indicator-selections"></div>'),
        select : _.template('<div class="selection">'+
            '<div class="title">${name}</div>'+
            '<div class=${clazz}>'+
            '</div>'+
            '</div>'),
        headerWithTooltip:  _.template('<div class="selection tooltip">'+
            '<div class="title">${title}</div>'+
            '<div class="tooltip">${tooltip1}</div>'+
            '<div class="tooltip">${tooltip2}</div>'+
            '</div>'),
        option : _.template('<option value="${id}">${name}</option>')
    },
    /****** PRIVATE METHODS ******/

    /**
     * @method  @private _populateIndicators populate indicators
     * @param  {Object} select  jQuery element of selection
     * @param  {Integer} datasrc datasource
     */
    _populateIndicators : function(select, datasrc) {
        var me = this;

        if(!datasrc || datasrc === '') {
            return;
        }

        this.service.getIndicatorList(datasrc, function(err, result) {
            var results = [];

            if(err) {
                // notify error!!
                Oskari.log('Oskari.statistics.statsgrid.IndicatorSelection').warn(" Error getting indicator list");
                return;
            }


            result.indicators.forEach(function(ind) {
                var resultObj = {
                    id: ind.id,
                    title: Oskari.getLocalized(ind.name)
                };
                results.push(resultObj);

            });
            var value = select.getValue();
            select.updateOptions( results );
            select.setValue(value);
            if(result.complete) {
                me.spinner.stop();
            }
        });
    },

    /****** PUBLIC METHODS ******/

    /**
     * @method  @public getPanelContent get panel content
     * @return {Object} jQuery element
     */
    getPanelContent: function() {
        var me = this;
        var main = jQuery(this.__templates.main());
        var locale = me.instance.getLocalization();
        var panelLoc = locale.panels.newSearch;

        var datasources = this.service.getDatasource();
        var sources = [];
        datasources.forEach(function(ds){
            var dataObj = {
                id : ds.id,
                title: ds.name
            };
            sources.push(dataObj);
        });
        // Datasources
        main.append(jQuery(this.__templates.select({name : locale.panels.newSearch.datasourceTitle, clazz : 'stats-ds-selector'})));
        // chosen works better when it has context for the element, get a new reference for chosen
        var dsSelector = main.find('.stats-ds-selector');
        var options = {
            placeholder_text : locale.panels.newSearch.selectDatasourcePlaceholder,
            allow_single_deselect : true,
            disable_search_threshold: 10,
            no_results_text: locale.panels.newSearch.noResults,
            width: '100%'
        };
        var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
        var dropdown = select.create(sources, options);
        dropdown.css({width:'100%'});
        dsSelector.append(dropdown);
        select.adjustChosen();

        // Indicator list
        main.append(jQuery(this.__templates.select({name : locale.panels.newSearch.indicatorTitle, clazz : 'stats-ind-selector'})));
        // chosen works better when it has context for the element, get a new reference for chosen
        var indicatorSelector = main.find('.stats-ind-selector');
        me.spinner.insertTo(indicatorSelector);
        var indicOptions = {
            placeholder_text: locale.panels.newSearch.selectIndicatorPlaceholder,
            allow_single_deselect : true,
            disable_search_threshold: 10,
            no_results_text: locale.panels.newSearch.noResults,
            width: '100%'
        };
        var indicSelect = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
        var indicDropdown = indicSelect.create(undefined, indicOptions);
        indicDropdown.css({width:'100%'});
        indicatorSelector.append(indicDropdown);
        indicSelect.adjustChosen();

        // Refine data label and tooltips
        var dataLabelWithTooltips = jQuery(this.__templates.headerWithTooltip({title: panelLoc.refineSearchLabel, tooltip1:panelLoc.refineSearchTooltip1 || '', tooltip2: panelLoc.refineSearchTooltip2 || ''}));
        main.append(dataLabelWithTooltips);

        // Refine data selections
        var selectionsContainer = jQuery(this.__templates.selections());
        main.append(selectionsContainer);

        var params = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorParameters', this.instance, this.sb);
        dsSelector.on('change', function() {
            params.clean();

            // If removed selection then need to be also update indicator selection
            if(select.getValue() === '') {
                indicatorSelector.val(indicatorSelector.find('option:first').val());
                indicatorSelector.trigger('change');
                indicatorSelector.trigger('chosen:updated');
            }
            // else show spinner
            else {
                me.spinner.start();
            }

            me._populateIndicators(indicSelect , select.getValue());
        });

        var btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        btn.addClass('margintopLarge');
        btn.setTitle(panelLoc.addButtonTitle);
        btn.setEnabled(false);
        btn.insertTo(main);

        indicatorSelector.on('change', function() {
            params.indicatorSelected(selectionsContainer,
                select.getValue(),
                indicSelect.getValue(),
                {
                    dataLabelWithTooltips:dataLabelWithTooltips,
                    btn: btn
                });
        });

        this.service.on('StatsGrid.DatasourceEvent', function(evt) {
            var currentDS = select.getValue();
            if(currentDS !== evt.getDatasource()) {
                return;
            }
            // update indicator list
            me._populateIndicators(indicSelect, currentDS);
        });

        return main;
    }

});
