/*
 * Creates a flyout with tabs for different ways of visualizing data
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.view.TableFlyout', function(title, options, instance) {
    this.isEmbedded = instance.isEmbedded();
    this.element = null;
    this._grid = Oskari.clazz.create('Oskari.statistics.statsgrid.Datatable', instance.getSandbox(), instance.getLocalization());
    var me = this;
    this.on('show', function() {
        if(!me.getElement()) {
            me.createUi();
            me.addClass('statsgrid-data-flyout');
            me.setContent(me.getElement());
        }
        me._grid._updateHeaderHeight();
        // Check also need hide no result texts
        me._grid.showResults();
    });
}, {
    _template: {
        error: _.template('<div class="datacharts-noactive">${ msg }</div>'),
        container: jQuery('<div class="oskari-datacharts"></div>')
    },
    setElement: function(el) {
        this.element = el;
    },
    getElement: function() {
        return this.element;
    },
    createUi: function() {
        var el = this._template.container.clone();
        this._grid.showRegionsetSelector(!this.isEmbedded);
        this._grid.showIndicatorRemoval(!this.isEmbedded);
        this._grid.render(el);
        this.setElement(el);
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});