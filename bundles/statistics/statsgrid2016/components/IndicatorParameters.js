Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorParameters', function (locale, sandbox) {
    this.locale = locale;
    this.sb = sandbox;
    this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    this.paramHandler = Oskari.clazz.create( 'Oskari.statistics.statsgrid.IndicatorParameterHandler', this.service, this.locale );
    this._values = {};
    this._selections = [];
    this.parentElement = null;
    Oskari.makeObservable(this);
    var me = this;
    var errorService = this.service.getErrorService();

    this.paramHandler.on('Data.Loaded', function ( data ) {
        me.spinner.stop();
        if ( Object.keys(data.regionset).length === 0 ) {
            errorService.show(locale.erros.title, locale.errors.regionsetsIsEmpty);
        }
        me.trigger('indicator.changed', data.regionset.length > 0);
        me.trigger('regionsets.loaded', data.regionset);
        me._createUi( data.datasrc, data.indicators, data.selectors, data.regionset );

    });
}, {
    __templates: {
        main: _.template('<div class="stats-ind-params"></div>'),
        select: _.template('<div class="parameter margintop"><div class="label" id=${id}>${label}</div><div class="clear"></div></div>'),
        option: _.template('<option value="${id}">${name}</option>')
    },

    /** **** PUBLIC METHODS ******/

    /**
     * @method  @public  clean clean params
     */
    clean: function () {
        if (!this.container) {
            return;
        }
        this.container.remove();
        this.container = null;
    },
    /**
     * @method  @public  attachTo 
     * @description pass in the element to which the parameters will be attached to
     */
    attachTo: function ( parentElement ) {
        this.parentElement = parentElement;
    },
      /**
     * @method  @public indicatorSelected  handle indicator selected
     * @param  {Integer} datasrc indicator datasource
     * @param  {String} indId    indicator id
     * @param  {Object} elements elements
     */
    indicatorSelected: function ( datasrc, indId, elements ) {
        var me = this;

        elements = elements || {};
        this.clean();

        if (!this.regionSelector) {
            this.regionSelector = Oskari.clazz.create('Oskari.statistics.statsgrid.RegionsetSelector', me.sb, me.locale);
        }

        if (!indId && indId === '') {
            if (elements.dataLabelWithTooltips) {
                elements.dataLabelWithTooltips.find('.tooltip').show();
            }
            return;
        }
         me.spinner.insertTo(this.parentElement.parent());
         me.spinner.start();
        //get the data to create ui with
        me.paramHandler.getData( datasrc, indId, elements );
    },
    _createUi: function ( datasrc, indId, selections, regionsets) {
        var me = this;
        var locale = me.locale;
        var errorService = me.service.getErrorService();
        var panelLoc = locale.panels.newSearch;

        var cont = jQuery(this.__templates.main());
        this.parentElement.append(cont);
        this.container = cont;
        Object.keys( selections ).forEach( function ( selected, index ) {
            var placeholderText = (panelLoc.selectionValues[selected] && panelLoc.selectionValues[selected].placeholder) ? panelLoc.selectionValues[selected].placeholder : panelLoc.defaultPlaceholder;
            var label = (locale.parameters[selected]) ? locale.parameters[selected] : selected.id;
            var tempSelect = jQuery(me.__templates.select({id: selected, label: label}));
            var options = {
                placeholder_text: placeholderText,
                allow_single_deselect: true,
                disable_search_threshold: 10,
                width: '100%'
            };
            var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList', selected);
            var dropdown = selections !== null ? select.create( selections[selected], options) : select.create(selections, options);
            dropdown.css( {width: '205px'} );
            select.adjustChosen();
            select.selectFirstValue();
            tempSelect.find('.label').append(dropdown);
            cont.append(tempSelect);
            me._selections.push(select);
        });

        var regionSelect = me.regionSelector.create(regionsets);
        me.regionSelector.setWidth(205);
        // try to select the current regionset as default selection
        regionSelect.value(me.service.getStateService().getRegionset());
        regionSelect.container.addClass('margintop');
        cont.append(regionSelect.container);

        me._values = {
            ds: datasrc,
            ind: indId,
            regionsetComponent: regionSelect
        };

        me.trigger('indicator.changed', regionsets.length > 0);
    },
    regionsetSelected: function (datasrc, regionsets) {
        var data = {
            ds: this.paramHandler.testRegionsetDatasources( datasrc, regionsets ),
            ind: this.paramHandler.testRegionsetIndicators( datasrc, regionsets )
        }
       return data;
    },
     /**
     * @method  @public indicatorSelected  handle indicator selected
     * @param  {Integer} datasrc indicator datasource
     * @param  {String} indId    indicator id
     * @param  {Object} elements elements
     */
    indicatorSelected: function ( datasrc, indId, elements ) {
        var me = this;

        elements = elements || {};
        this.clean();

        if (!this.regionSelector) {
            this.regionSelector = Oskari.clazz.create('Oskari.statistics.statsgrid.RegionsetSelector', me.sb, me.locale);
        }

        if (!indId && indId === '') {
            if (elements.dataLabelWithTooltips) {
                elements.dataLabelWithTooltips.find('.tooltip').show();
            }
            return;
        }
         me.spinner.insertTo(this.parentElement.parent());
         me.spinner.start();
        //get the data to create ui with
        me.paramHandler.getData( datasrc, indId, elements );
    },

    getValues: function () {
        var me = this;
        var values = {
            datasource: me._values.ds,
            indicator: me._values.ind,
            regionset: me._values.regionsetComponent.value(),
            selections: {}
        };
        
        me._selections.forEach(function (select) {
            values.selections[select.getId()] = select.getValue();
        });
        return values;
    }
});
