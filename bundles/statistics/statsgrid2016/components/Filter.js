Oskari.clazz.define('Oskari.statistics.statsgrid.Filter', function (instance) {
    this.instance = instance;
    this.sb = instance.getSandbox();
    this.loc = instance.getLocalization('filter');
    this.container = null;
    this.content = null;
    this.conditionSelect = null;
}, {
    _template: {
      wrapper: jQuery('<div></div>'),
      filterContainer: jQuery('<div class="filter"></div>'),
      filterIndicator: _.template('<div class="filterIndicator left"><h5><%= indicatorToFilter %></h5></div>'),
      filterCondition:_.template('<div class="filterCondition"><h5><%= condition %></h5></div>'),
      filterValue: _.template('<div class="filterValue"><h5><%= value %> </h5> <input class="value" type="number"></input></div>'),
      filterButton: _.template('<input class="filter-button" type="button" value="<%= filter %>"></input>'),
      appliedHeader: _.template('<div class="oskari-table-header right">'+
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
      appliedFilters: _.template('<div class="active-filters right">' +
                                        '<table id="oskari-active-filters" style="border: 1px solid black;" cellpadding="0" cellspacing="0" border="0">'+
                                            '<tbody></tbody'+
                                        '</table>'+
                                    '</div>'+
                                '</div>'),
        tablerow: _.template('<tr>' +
                                '<td class="remove"> <div class="removerow"></div></td>'+
                                '<td class="cell indicator" headers="indicator" > <%= options.indicator %> </td>'+
                                '<td class="cell condition" headers="condition" style=" border: 1px solid black ;"> <%= options.condition %> </td>'+
                                '<td class="cell value" headers="value" style=" border: 1px solid black;"> <%= options.value %> </td>'+
                            '</tr> '),
    },
    setElement: function ( el ) {
        this.container = el;
    },
    getElement: function () {
        return this.container;
    },
    setContent: function ( content ) {
        this.content = content;
    },
    getContent: function () {
        return this.content;
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
    createUI: function () {
      var me = this;
      var wrapper = this._template.wrapper.clone();
      var el = this._template.filterContainer.clone();
      var filterIndicator = this._template.filterIndicator({ indicatorToFilter: this.loc.indicatorToFilter });
      var filterCondition = this._template.filterCondition({ condition: this.loc.condition });
      var filterValue = this._template.filterValue({ value: this.loc.value });
      var filterButton = this._template.filterButton({ filter: this.loc.filter });
      var appliedHeader = this._template.appliedHeader({ indicator: this.loc.variable,
                                                         condition: this.loc.condition,
                                                        value: this.loc.value });
      var appliedFilters = this._template.appliedFilters();
      var selectionComponent = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorSelection', this.instance, this.sb);
      selectionComponent.getPanelContent();

      wrapper.append( filterIndicator );
      wrapper.append( filterCondition );
      wrapper.append( filterValue );
      wrapper.append( filterButton );
      el.append( wrapper );

      wrapper.find('.filterIndicator').append( selectionComponent.getIndicatorSelector() );
      wrapper.find('.filterIndicator').after( appliedFilters );
      jQuery( appliedHeader ).insertBefore( wrapper.find('.filterIndicator') );
    //   wrapper.find('.active-filters').insertBefore( appliedHeader );
      wrapper.find('.filterCondition').append( this.createSelect() );
      wrapper.find('.filter-button').on( 'click', this.filter.bind(me) );

      this.setElement(el);
    },
    getTable: function () {
            var elements = {
                "table": this.getElement().find('.active-filters'),
                "rows": this.getElement().find(".active-filters tr"),
            }
            return elements;
        },
    getFilterOptions: function () {
        var condition = this.conditionSelect.getValue();
        var value = this.getElement().find('.value').val();
        return {
            indicator: null,
            condition: condition,
            value: value
        }
    },
    updateAppliedFilters: function ( options ) {
        var me = this;
        var table = this.getTable().table;
            var row = this._template.tablerow( { options: options } );
            table.find('#oskari-active-filters').append(row);
            table.find('.removerow').on( 'click', this.clearFilter );
    },
    clearFilter: function () {
    },
    filter: function () {
        var options = this.getFilterOptions();
        this.updateAppliedFilters( options );
    }

});