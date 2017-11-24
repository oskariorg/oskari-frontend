/*
* Creates a flyout with tabs for different ways of visualizing data
*/
Oskari.clazz.define('Oskari.statistics.statsgrid.view.TableVisualizer', function (instance) {
  this.sb = instance.getSandbox();
  this.loc = instance.getLocalization();
  this.isEmbedded = instance.isEmbedded();
  this.instance = instance;
  this.container = null;
  this.service = instance.statsService;
  this._isOpen = false;
  this._grid = null;
}, {
  _template: {
    error: _.template('<div class="datacharts-noactive">${ msg }</div>'),
    container: jQuery('<div class="oskari-datacharts"></div>')
  },
  setElement: function ( el ) {
    this.container = el;
  },
  getElement: function () {
    return this.container;
  },
  createUi: function () {
    var el = this._template.container.clone();
    var grid = Oskari.clazz.create('Oskari.statistics.statsgrid.Datatable', this.sb, this.loc);
    grid.showRegionsetSelector(!this.isEmbedded);
    grid.showIndicatorRemoval(!this.isEmbedded);
    grid.render(el);
    this._grid = grid;
    this.setElement(el);
  },
  isVisible: function () {
    return this._isOpen;
  },
  checkGridVisibility: function(){
      var me = this;
      me._grid._updateHeaderHeight();

      // Check also need hide no result texts
      me._grid.showResults();
  }
}, {
  extend: ['Oskari.userinterface.extension.DefaultView']
});
