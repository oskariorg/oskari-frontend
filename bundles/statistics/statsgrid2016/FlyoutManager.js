Oskari.clazz.define('Oskari.statistics.statsgrid.FlyoutManager', function (instance) {
    this.instance = instance;
    this.sb = instance.sb;
    this.flyouts = null;
    this.openFlyouts = {};
}, {
    init: function () {
        var me = this;
        me.initFlyouts();
    },
    open: function( type ) {
        var me = this;
        var flyout = me.flyouts[type];
        flyout.move(flyout.options.pos.x, flyout.options.pos.y, true);
        flyout.show();

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

        var loc = this.instance.getLocalization();
        me.flyouts = {
            search: Oskari.clazz.create('Oskari.statistics.statsgrid.view.Search', loc.tile.search, {
                width: width + 'px',
                cls: 'statsgrid-search-flyout',
                view:'search',
                pos: {
                    x: position.left + offset,
                    y: 5
                }
            }, this.instance),
            table: Oskari.clazz.create('Oskari.statistics.statsgrid.view.TableVisualizer', loc.tile.table, {
                width: 'auto',
                cls: 'statsgrid-data-flyout',
                view:'table',
                pos: {
                    x: width + position.left + offset,
                    y: 5
                }
            }, this.instance),
            diagram: Oskari.clazz.create('Oskari.statistics.statsgrid.view.DiagramVisualizer', loc.tile.diagram, {
                width: 'auto',
                cls: 'statsgrid-diagram-flyout',
                view:'diagram',
                pos: {
                    x: width + position.left + offset,
                    y: 5
                }
            }, this.instance)
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
        var tile = me.instance.plugins['Oskari.userinterface.Tile'];
        Object.keys(me.flyouts).forEach(function (key) {
            var flyout = me.flyouts[key];
            flyout.makeDraggable({
                handle : '.oskari-flyouttoolbar, .statsgrid-data-container > .header',
                scroll : false
            });
            flyout.on('hide', function() {
                tile.toggleExtensionClass( key, true );
            });
        });
    },
    getFlyout: function (type) {
        return this.flyouts[type];
    }
}, {

});