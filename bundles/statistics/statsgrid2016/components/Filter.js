Oskari.clazz.define('Oskari.statistics.statsgrid.Filter', function (instance) {
    this.container = null;
    this.content = null;
}, {
    _template: {
      filterContainer: _.template('<div class="filter"></div>'),
      filterContent: jQuery('<label></label><div></div>'+
                            '<label></label><div></div>'+
                            '<label></label><div></div>')
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
      var el = this._template.filterContainer;
      var content = this._template.filterContent.clone();
      jQuery(el).append(content);
      this.setElement(el);
    },
    getFilterOptions: function () {
        var content = this.getContent();
        debugger;
    }

});