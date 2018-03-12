Oskari.clazz.define('Oskari.statistics.statsgrid.view.LegendFlyout', function(embedded) {
    this.isEmbedded = embedded;
    this.view = Oskari.clazz.create('Oskari.statistics.statsgrid.Legend', Oskari.getSandbox(), Oskari.getMsg.bind(null, 'StatsGrid') );
    this.container = jQuery('<div></div>');
    var me = this;
    this.on('show', function() {
        if(!me.hasContent()) {
            var div = me.container.clone();
            me.view.render( div );
            me.setContent( div );
            me.makeDraggable();
            me.getElement().find('.oskari-flyouttoolbar').remove();
        }
    });
}, {
    hasContent: function () {
        return this.getElement().find('.statsgrid-legend-container').length > 0;
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});