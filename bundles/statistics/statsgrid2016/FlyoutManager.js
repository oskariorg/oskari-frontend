Oskari.clazz.define('Oskari.statistics.statsgrid.FlyoutManager', function (instance) {
    this.instance = instance;
    this.flyouts = {};
    var loc = instance.getLocalization();
    Oskari.makeObservable(this);

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
        if(Object.keys(this.flyouts).length) {
            // already initialized
            return;
        }
        var me = this;
        var p = jQuery( "#mapdiv" );
        var position = p.position().left;
        var offset = 40;

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

            flyout.bringToTop();
            flyout.on('hide', function() {
                me.trigger('hide', info.id);
            });
            me.flyouts[info.id] = flyout;
            position = position + flyout.getSize().width;
        });
    },
    open: function ( type ) {
        var me = this;
        var flyout = me.flyouts[type];
        if(!flyout) {
            return;
        }
        flyout.move(flyout.options.pos.x, flyout.options.pos.y, true);
        flyout.show();
        this.trigger('show', type);
    },
    hide: function ( type ) {
        var me = this;
        var flyout = me.flyouts[type];
        if(!flyout) {
            return;
        }
        flyout.hide();
    },
    toggle: function ( type ) {
        var flyout = this.getFlyout(type);
        if(!flyout) {
            // unrecognized flyout
            return;
        }
        if(flyout.isVisible()) {
            this.hide(type);
            return;
        }
        // open flyout
        this.open(type);
    },
    getFlyout: function (type) {
        return this.flyouts[type];
    }
});