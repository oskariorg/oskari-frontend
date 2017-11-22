Oskari.clazz.define('Oskari.mapping.printout2.FlyoutManager', function (instance) {
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
        var view = me.views[type];
        var flyout = me.flyouts[type];

        if ( view.getElement() === null ) {
            view.createUi();
            flyout.makeDraggable({
                handle : '.oskari-flyouttoolbar, .statsgrid-data-container > .header',
                scroll : false
            });
            flyout.setContent( view.getElement() );
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
        var width = 300;
        me.flyouts = {
            print: Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', "this.instance.getLocalization().tile.title", {
                width: width + 'px',
                cls: 'printout2-print-flyout',
                view:'print',
                pos: {
                    x: 0,
                    y: 0
                }
            })
        };
    },
    initViews: function () {
        this.views = {
            print: Oskari.clazz.create("Oskari.mapping.printout2.view.print", this.instance )
        }
    },
    getFlyout: function (type) {
        return this.flyouts[type];
    },
     destroy: function () {
         this.views["print"].destroy();
         this.flyouts["print"].hide();
     }
}, {

});