Oskari.clazz.define('Oskari.statistics.statsgrid.view.Filter', function (instance) {
    this.instance = instance;
    this.sb = instance.getSandbox();
    this.loc = instance.getLocalization('filter');
    this.container = null;
    this.panels = {};
    this.conditionSelect = null;
    this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
    this.events();
}, {
    _template: {
      wrapper: jQuery('<div></div>'),
      filterContainer: jQuery('<div class="filter"></div>'),
      filterIndicator: _.template('<div class="filterIndicator left"><h5><%= indicatorToFilter %></h5></div>'),
      filterCondition:_.template('<div class="filterCondition"><h5><%= condition %></h5></div>'),
      filterValue: _.template('<div class="filterValue"><h5><%= value %> </h5> <input class="value" type="number"></input></div>'),
      filterButton: _.template('<input class="filter-button" type="button" value="<%= filter %>"></input>'),
      appliedHeader: _.template('<div class="oskari-table-header">'+
                                        '<table id="oskari-tbl-header" cellpadding="0" cellspacing="0" border="0">'+
                                            '<thead>'+
                                                '<tr>' +
                                                    '<th></th>'+
                                                    '<th class="headerCell" id="indicator" style="padding-left: 1em;"><%= indicator %></th>'+
                                                    '<th class="headerCell" id="condition" style="padding-left: 1em;"><%= condition %></th>'+
                                                    '<th class="headerCell" id="value" style="padding-left: 1em;"><%= value %></th>'+
                                                '</tr>'+
                                             '</thead>'+
                                        ' </table>'+
                                     '</div>'),
      appliedFilters: _.template('<div class="active-filters">' +
                                        '<table id="oskari-active-filters" hoverable  style="border: 1px solid black;" cellpadding="0" cellspacing="0" border="0">'+
                                            '<tbody></tbody'+
                                        '</table>'+
                                    '</div>'+
                                '</div>'),
        tablerow: _.template('<tr id="active-filters-row">' +
                                '<td class="remove"> <div class="removerow"></div></td>'+
                                '<td class="cell indicator" headers="indicator" > <%= options.indicator %> </td>'+
                                '<td class="cell condition" headers="condition" style=" border: 1px solid black ;" > <%= options.condition %> </td>'+
                                '<td class="cell value" headers="value" style=" border: 1px solid black;" > <%= options.value %> </td>'+
                            '</tr> '),
    },
    setElement: function ( el ) {
        this.container = el;
    },
    getElement: function () {
        return this.container;
    },
    getPanels: function () {
        return this.panels;
    },
    setPanels: function () {
        var me = this;
        var panels = {};
        this.tabsContainer.panels.forEach( function( panel ) {
            var id = panel.getId();
            panels[id] = panel;
        });
        this.panels = panels;
    },
    createSelect: function () {
        var conditions = [
            {
                id:">",
                title: this.loc.greater
            },
            {
                id:">=",
                title: this.loc.greaterEqual
            },
            {
                id:"=",
                title: this.loc.equal
            },
            {
                id:"<=",
                title: this.loc.lessEqual
            },
            {
                id:"<",
                title: this.loc.lessThan
            },
            {
                id:"between",
                title: this.loc.between
            },
        ];

        var options = {
            placeholder_text : this.loc.conditionPlaceholder,
            allow_single_deselect : true,
            disable_search_threshold: 10,
            width: '100%'
        };
        var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
        var dropdown = select.create( conditions, options );
        dropdown.css({ width:'100%' });
        select.adjustChosen();
        this.conditionSelect = select;
        return dropdown;
    },
    clearUi: function () {
      this.container = null;
    },
    createUi: function () {
      var me = this;
      this.clearUi();
      var wrapper = this._template.wrapper.clone();
      var el = this._template.filterContainer.clone();
      var filterIndicator = this._template.filterIndicator({ indicatorToFilter: this.loc.indicatorToFilter });
      var selectionComponent = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorSelection', this.instance, this.sb);
      selectionComponent.getPanelContent();

      wrapper.append( filterIndicator );


      wrapper.find('.filterIndicator').append( selectionComponent.getIndicatorSelector() );

      var tabs = this.createTabs();
      wrapper.append( tabs );
      el.append( wrapper );

      this.setElement(el);
      this.bindButtons();
    },
    bindButtons: function () {
        this.getElements().filterButton.on( 'click', this.filter.bind( this ) );
    },
    getElements: function () {
        var panels = this.getPanels();
        var valuePanel = panels["value-filter"].getContainer();
        var appliedPanel = panels["applied-filter"].getContainer();
            var elements = {
                "table": appliedPanel.find('.active-filters'),
                "rows": appliedPanel.find(".active-filters tr"),
                "filterValue": this.getElement().find(".filterValue input"),
                "filterCondition": valuePanel.find(".filterCondition"),
                "filterIndicator": valuePanel.find(".filterIndicator"),
                "filterButton": valuePanel.find(".filter-button")
            };
            return elements;
    },
    editFilter: function ( filterRow ) {
        var jEl = jQuery( filterRow );
        jEl.toggleClass( "filter-edit-active", true );
        this.conditionSelect.setValue( jEl.find('.condition').text().trim() );
        this.getElements().filterValue.val( jEl.find('.value').text().trim() );
    },
    getFilterOptions: function () {
        var condition = this.conditionSelect.getValue();
        var value = this.getElements().filterValue.val();
        return {
            indicator: null,
            condition: condition,
            value: value
        };
    },
    updateAppliedFilters: function ( options ) {
        var me = this;
        var table = this.getElements().table;
            var row = this._template.tablerow( { options: options } );
            table.find('#oskari-active-filters').append(row);
            table.find('#active-filters-row'). on( 'click', function () {
                me.editFilter.call( me, this);
            } );
            table.find('.removerow').on( 'click', this.clearFilter );
    },
    clearFilter: function () {
        jQuery(this).parent().parent().remove();
    },
    filter: function () {
        var options = this.getFilterOptions();
        this.service.getStateService().addFilter( options );
    },
    events: function () {
            var me = this;
            this.service.on('StatsGrid.Filter', function( event ) {
                var filterOptions = event.getFilter();
                me.updateAppliedFilters( filterOptions );
            });
    },
    _createAreaFilterTab: function (title) {
        var me = this;
        var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
        panel.setTitle(title);
        var panelWrapper = jQuery('<div></div>');

        panel.getContainer().prepend(panelWrapper);
        panel.setPriority(1.0);
        panel.setId('area-filter');
        this.tabsContainer.addPanel(panel);
        return panel;
    },
    _createValueFilterTab: function (title) {
      var me = this;
      var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
      panel.setTitle(title);
      var panelWrapper = jQuery('<div></div>');
      var filterCondition = this._template.filterCondition({ condition: this.loc.condition });
      var filterValue = this._template.filterValue({ value: this.loc.value });
      var filterButton = this._template.filterButton({ filter: this.loc.filter });
      panelWrapper.append(filterCondition);
      panelWrapper.append(filterValue);
      panelWrapper.append(filterButton);

      panelWrapper.find('.filterCondition').append( this.createSelect() );


        panel.getContainer().prepend(panelWrapper);
        panel.setPriority(1.0);
        panel.setId('value-filter');
      this.tabsContainer.addPanel(panel);
      return panel;
    },
    appliedFiltersTab: function ( title ) {
        var panel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
        panel.setTitle( title );
        var container = panel.getContainer();
        var panelWrapper = jQuery('<div></div>');
        var appliedFilters = this._template.appliedFilters();
        var appliedHeader = this._template.appliedHeader({ indicator: this.loc.variable,
                                                            condition: this.loc.condition,
                                                            value: this.loc.value });
        panelWrapper.append( appliedHeader );
        panelWrapper.append( appliedFilters );

        panel.getContainer().prepend(panelWrapper);
        panel.setPriority(1.0);
        panel.setId('applied-filter');
        this.tabsContainer.addPanel(panel);
        return panel;
    },
    createTabs: function () {
        var me = this;
        this._createAreaFilterTab(this.loc.area);
        this._createValueFilterTab( this.loc.desc );
        this.appliedFiltersTab( this.loc.filtered );
        this.setPanels();
        return me.tabsContainer.ui;
    }
}, {
        extend: ['Oskari.userinterface.extension.DefaultView']
});