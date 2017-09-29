Oskari.clazz.define('Oskari.statistics.statsgrid.FlyoutManager', function (instance) {
    this.instance = instance;
    this.sb = instance.sb;
}, {
    init: function () {
        this.getFlyouts();
        this.getViews();
    },
    show: function() {
        var me = this;
        var charts = me.getDataCharts();
        if( charts.getFlyout() === null || charts.shouldUpdate) {
        charts.createUi();
        charts.shouldUpdate = false;
        }
        this.chartsFlyout = charts.getFlyout();
        if( charts.getCharts() !== null && charts.hasActiveIndicator() !== null ) {
            charts.createBarCharts();
        }
        if( this.chartsFlyout.isVisible() ) {
            this.chartsFlyout.hide();
        } else {
            this.chartsFlyout.move(600, 300, true);
            this.chartsFlyout.show();
            this.chartsFlyout.bringToTop();
        }
    },
    getDataFlyout : function() {
        if(this.__dataFlyout) {
            return this.__dataFlyout;
        }
        var locale = this.instance.getLocalization('');
        var flyout = Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', this.instance.getLocalization().title, {
            width: 'auto',
            cls: 'statsgrid-data-flyout'
        });
        flyout.makeDraggable({
            handle : '.oskari-flyouttoolbar, .statsgrid-data-container > .header',
            scroll : false
        });
        this.__dataFlyout = flyout;
        // render content
        this.__data = this.getViews().data;
        var el = this.__data.createUi();
        flyout.setContent(el);
        return this.__dataFlyout;
    },
    getFlyouts: function () {
        return flyouts = {
            searchFlyout: Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', this.instance.getLocalization().title, {
                                                width: 'auto',
                                                cls: 'statsgrid-search-flyout'
            }),
            dataFlyout:Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', this.instance.getLocalization().title, {
                                            width: 'auto',
                                            cls: 'statsgrid-data-flyout'
            }),
            filterFlyout: Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', this.instance.getLocalization().title, {
                                                width: 'auto',
                                                cls: 'statsgrid-filter-flyout'
            })
        }
    },
    getViews: function () {
        return views = {
            search: '',
            data: Oskari.clazz.create('Oskari.statistics.statsgrid.view.DataVisualizer', this.instance),
            filter: Oskari.clazz.create('Oskari.statistics.statsgrid.view.Filter', this.instance)
        }
    },
    renderViewToFlyout: function () {

    }
}, {

});