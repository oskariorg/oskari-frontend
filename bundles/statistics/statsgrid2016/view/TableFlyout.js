/*
 * Creates a flyout with tabs for different ways of visualizing data
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.view.TableFlyout', function (title, options, instance) {
    this.isEmbedded = instance.isEmbedded();
    this.uiElement = null;
    this._grid = Oskari.clazz.create('Oskari.statistics.statsgrid.Datatable', instance.getSandbox(), instance.getLocalization());
    var me = this;
    this.on('show', function () {
        if (!me.getUiElement()) {
            me.createUi();
            me.setContent(me.getUiElement());
        }
        me._grid._updateHeaderHeight();
        // Check also need hide no result texts
        me._grid.showResults();
    });
}, {
    _template: {
        error: _.template('<div class="datacharts-noactive">${ msg }</div>'),
        container: jQuery('<div></div>')
    },
    setUiElement: function (el) {
        this.uiElement = el;
    },
    getUiElement: function () {
        return this.uiElement;
    },
    createUi: function () {
        var el = this._template.container.clone();
        this.addClassForContent('oskari-datacharts');
        this._grid.showRegionsetSelector(!this.isEmbedded);
        this._grid.showIndicatorRemoval(!this.isEmbedded);
        this._grid.render(el);
        this.setUiElement(el);
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});
