Oskari.clazz.define('Oskari.statistics.statsgrid.FlyoutManager', function (instance) {
    this.instance = instance;
    this.sb = instance.sb;
    this.flyouts = null;
    this.views = null;
    this.openFlyouts = [];
}, {
    init: function () {
        var me = this;
        me.initFlyouts();
        me.initViews();
    },
    open: function( type ) {
        var me = this;
        if ( me.openFlyouts[type] ) {
            me.hide(type);
            return;
        }

        var view = me.views[type];
        var flyout = me.flyouts[type];

        if( view.getElement() === null ) {
            view.createUi();
            flyout.makeDraggable({
                handle : '.oskari-flyouttoolbar, .statsgrid-data-container > .header',
                scroll : false
            });
            flyout.setContent( view.getElement() );
            var tile = me.instance.plugins['Oskari.userinterface.Tile'];
            flyout.getElement().find('.icon-close').bind('click', function() {
                tile.toggleExtensionClass(type, true);
            });
        }
        flyout.move(flyout.options.pos.x, flyout.options.pos.y, true);
        flyout.show();

        if(type==='dataview' && view._grid) {
            view.checkGridVisibility();
        }

        this.openFlyouts[type] = true;
    },
    hide: function ( type ) {
        var me = this;
        me.flyouts[type].hide();
        delete me.openFlyouts[type];
    },
    initFlyouts: function () {
        var me = this;
        var p = jQuery( "#mapdiv" );
        var position = p.position();
        var offset = 40;
        var width = p.width() / 4;
        me.flyouts = {
            search: Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', this.instance.getLocalization().tile.title, {
                width: width + 'px',
                cls: 'statsgrid-search-flyout',
                view:'search',
                pos: {
                    x: position.left + offset,
                    y: 5
                }
            }),
            dataview: Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', this.instance.getLocalization().datacharts.flyout, {
                width: 'auto',
                cls: 'statsgrid-data-flyout',
                view:'dataview',
                pos: {
                    x: width + position.left + offset,
                    y: 5
                }
            })
            // filterdata: Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', this.instance.getLocalization().filter.title, {
            //     width: 'auto',
            //     cls: 'statsgrid-filter-flyout',
            //     view:'filter',
            //     pos: {
            //         x: 1200,
            //         y: 30
            //     }
            // })
        };
    },
    initViews: function () {
        var me = this;
        me.views = {
            search: Oskari.clazz.create('Oskari.statistics.statsgrid.view.Search', this.instance, me.flyouts.search),
            dataview: Oskari.clazz.create('Oskari.statistics.statsgrid.view.DataVisualizer', this.instance)
            // filterdata: Oskari.clazz.create('Oskari.statistics.statsgrid.view.Filter', this.instance)
        };
    },
    getFlyout: function (type) {
        return this.flyouts[type];
    }
}, {

});