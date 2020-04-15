Oskari.clazz.define('Oskari.statistics.statsgrid.FlyoutManager', function (instance) {
    this.instance = instance;
    this.flyouts = {};
    var loc = instance.getLocalization();
    Oskari.makeObservable(this);
    this.service = instance.getStatisticsService().getStateService();
    this._positionY = 5;
    this.flyoutInfo = [
        {
            id: 'search',
            title: loc.tile.search,
            oskariClass: 'Oskari.statistics.statsgrid.view.SearchFlyout',
            cls: 'statsgrid-search-flyout'
        },
        {
            id: 'table',
            title: loc.tile.table,
            oskariClass: 'Oskari.statistics.statsgrid.view.TableFlyout',
            cls: 'statsgrid-data-flyout'
        },
        {
            id: 'diagram',
            title: loc.tile.diagram,
            oskariClass: 'Oskari.statistics.statsgrid.view.DiagramFlyout',
            cls: 'statsgrid-diagram-flyout',
            resizable: true,
            minWidth: 630,
            minHeight: 400

        },
        {
            id: 'indicatorForm',
            hideTile: true,
            title: loc.userIndicators.flyoutTitle || 'Add indicator',
            oskariClass: 'Oskari.statistics.statsgrid.view.IndicatorFormFlyout',
            cls: 'statsgrid-user-indicator-flyout'
        }
    ];
}, {
    init: function () {
        if (Object.keys(this.flyouts).length) {
            // already initialized
            return;
        }

        var me = this;
        var p = jQuery('#mapdiv');
        var position = p.position().left;
        var offset = 40;
        const y = this._positionY;
        this.flyoutInfo.forEach(function (info) {
            var flyout = Oskari.clazz.create(info.oskariClass, info.title, {
                width: 'auto',
                cls: info.cls,
                position: {
                    x: position + offset,
                    y
                }
            }, me.instance);
            flyout.makeDraggable({
                handle: '.oskari-flyouttoolbar, .statsgrid-data-container > .header',
                scroll: false
            });

            flyout.bringToTop();
            flyout.on('hide', function () {
                me.trigger('hide', info.id);
            });
            me.flyouts[info.id] = flyout;
            position = position + flyout.getSize().width;
            if (info.resizable) {
                const { minWidth, minHeight } = info;
                flyout.makeResizable({
                    minWidth,
                    minHeight
                });
            }
        });
    },
    open: function (type) {
        var me = this;
        var flyout = me.flyouts[type];
        if (!flyout) {
            return;
        }
        if ((type === 'diagram' || type === 'table') && !this.service.hasIndicators()) {
            const searchFlyout = me.flyouts['search'];
            searchFlyout.showOnPosition();
            this.trigger('show', 'search');
            const { position: { x: searchX } } = searchFlyout.getOptions();
            const x = searchX + searchFlyout.getSize().width + 5;
            const y = this._positionY;
            flyout.move(x, y, true);
            flyout.show();
        } else {
            flyout.showOnPosition();
        }
        this.trigger('show', type);
    },
    hide: function (type) {
        var me = this;
        var flyout = me.flyouts[type];
        if (!flyout) {
            return;
        }
        flyout.hide();
    },
    toggle: function (type) {
        var flyout = this.getFlyout(type);
        if (!flyout) {
            // unrecognized flyout
            return;
        }
        if (flyout.isVisible()) {
            this.hide(type);
            return;
        }
        // open flyout
        this.open(type);
    },
    getFlyout: function (type) {
        return this.flyouts[type];
    },
    tileAttached: function () {
        if (this.service.hasIndicators()) {
            return;
        }
        this.open('search');
    },
    tileClosed: function () {
        this.hide('search');
    },
    hideFlyouts: function () {
        Object.keys(this.flyouts).forEach(type => {
            if (type === 'search') return;
            this.hide(type);
        });
    }

});
