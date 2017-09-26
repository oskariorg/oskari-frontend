Oskari.clazz.define('Oskari.statistics.statsgrid.Filter', function (instance) {
    this.instance = instance;
    this.sb = instance.getSandbox();
    this.loc = instance.getLocalization('filter');
    this.container = null;
    this.content = null;
}, {
    _template: {
      filterContainer: jQuery('<div class="filter"></div>'),
      filterContent: _.template('<label><%= indicatorToFilter %></label><div class="indicator-filter"></div>'+
                            '<label><%= condition %></label><div></div>'+
                            '<label><%= value %></label><div></div>')
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
    createUI: function () {
      var me = this;
      var el = this._template.filterContainer.clone();
      var filterContent = me._template.filterContent( {
          indicatorToFilter: this.loc.indicatorToFilter,
          condition: this.loc.condition,
          value: this.loc.value
      });
      
      var selectionComponent = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorSelection', this.instance, this.sb);
      selectionComponent.getPanelContent();
      jQuery(filterContent).find('.indicator-filter').append(selectionComponent.getIndicatorSelector());
      el.append(filterContent);

      this.setElement(el);
    },
    getFilterOptions: function () {
        var content = this.getContent();
        debugger;
    }

});