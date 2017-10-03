Oskari.clazz.define('Oskari.statistics.statsgrid.FlyoutManager', function (instance) {
    this.instance = instance;
    this.sb = instance.sb;
    this.flyouts = null;
    this.openFlyouts = [];
}, {
    init: function () {
        this.flyouts = this.initFlyouts();
        this.views = this.getViews();
    },
    open: function( flyout ) {
        for ( var i = 0; i < this.openFlyouts.length; i++ ) {
            if( this.openFlyouts[i] === flyout ) {
                this.hide( flyout );
                return;
            }
        }
        var view = this.views[flyout.options.view];

        if( view.getElement() === null ) {
            view.createUi();
            flyout.makeDraggable({
                handle : '.oskari-flyouttoolbar, .statsgrid-data-container > .header',
                scroll : false
            });
            flyout.setContent( view.getElement() );
        }
        flyout.move(flyout.options.pos.x, flyout.options.pos.y, true);
        flyout.show();
        this.openFlyouts.push(flyout);
    },
    hide: function ( flyout ) {
        flyout.hide();
        this.openFlyouts.splice( flyout, 1 );
    },
    initFlyouts: function () {
        return flyouts = {
            search: Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', this.instance.getLocalization().tile.title, {
                                                width: 'auto',
                                                cls: 'statsgrid-search-flyout',
                                                view:'search',
                                                pos: {
                                                    x: 220,
                                                    y: 30
                                                }
            }),
            dataview: Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', this.instance.getLocalization().datacharts.flyout, {
                                            width: 'auto',
                                            cls: 'statsgrid-data-flyout',
                                            view:'dataview',
                                            pos: {
                                                x: 600,
                                                y: 300
                                            }

            }),
            filter: Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', this.instance.getLocalization().filter.title, {
                                                width: 'auto',
                                                cls: 'statsgrid-filter-flyout',
                                                view:'filter',
                                                pos: {
                                                    x: 1200,
                                                    y: 30
                                                }
            })
        }
    },
    getViews: function () {
        return views = {
            search: Oskari.clazz.create('Oskari.statistics.statsgrid.view.Search', this.instance ),
            dataview: Oskari.clazz.create('Oskari.statistics.statsgrid.view.DataVisualizer', this.instance) ,
            filter: Oskari.clazz.create('Oskari.statistics.statsgrid.view.Filter', this.instance) 
           }
    },
    getFlyout: function ( flyout ) {
        return this.flyouts[flyout];
    }
}, {

});