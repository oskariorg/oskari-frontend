Oskari.clazz.define('Oskari.statistics.statsgrid.FlyoutManager', function (instance) {
    this.instance = instance;
    this.sb = instance.sb;
    this.flyouts = {};
    this.openFlyouts = {};
    var loc = instance.getLocalization();

    this.flyoutInfo = [
    {
        id : 'search',
        title: loc.tile.search,
        oskariClass :'Oskari.statistics.statsgrid.view.SearchFlyout'
    },
    {
        id : 'table',
        title: loc.tile.table,
        oskariClass :'Oskari.statistics.statsgrid.view.TableFlyout'
    },
    {
        id : 'diagram',
        title: loc.tile.diagram,
        oskariClass :'Oskari.statistics.statsgrid.view.DiagramFlyout'
    }
    ];
}, {
    init: function () {
        var me = this;
        var p = jQuery( "#mapdiv" );
        var position = p.position().left;
        var offset = 40;
        var width = p.width() / 4;

        var tile = me.instance.plugins['Oskari.userinterface.Tile'];
        this.flyoutInfo.forEach(function(info) {
            var flyout = Oskari.clazz.create(info.oskariClass, info.title, {
                width: 'auto',
                pos: {
                    x: position + offset,
                    y: 5
                }
            }, me.instance);
            flyout.makeDraggable({
                handle : '.oskari-flyouttoolbar, .statsgrid-data-container > .header',
                scroll : false
            });
            flyout.on('hide', function() {
                tile.toggleExtensionClass( info.id, true );
            });
            me.flyouts[info.id] = flyout;
            position = position + flyout.getSize().width;
        });


        /*
        me.flyouts = {
            search: Oskari.clazz.create('Oskari.statistics.statsgrid.view.SearchFlyout', loc.tile.search, {
                width: width + 'px',
                pos: {
                    x: position.left + offset,
                    y: 5
                }
            }, this.instance),
            table: Oskari.clazz.create('Oskari.statistics.statsgrid.view.TableFlyout', loc.tile.table, {
                width: 'auto',
                pos: {
                    x: width + position.left + offset,
                    y: 5
                }
            }, this.instance),
            diagram: Oskari.clazz.create('Oskari.statistics.statsgrid.view.DiagramFlyout', loc.tile.diagram, {
                width: 'auto',
                pos: {
                    x: width + position.left + offset,
                    y: 5
                }
            }, this.instance)
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
        */
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
    getFlyout: function (type) {
        return this.flyouts[type];
    }
});