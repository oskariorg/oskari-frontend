import { getNavigationDimensions } from 'oskari-ui/components/window';

Oskari.clazz.define('Oskari.statistics.statsgrid.FlyoutManager', function (instance, service, handler) {
    this.instance = instance;
    this.flyouts = {};
    var loc = instance.getLocalization();
    Oskari.makeObservable(this);
    this.service = instance.getStatisticsService().getStateService();
    this._positionY = 5;
    this.handler = handler;
    this.searchHandler = this.handler.getSearchHandler();
    this.tableHandler = this.handler.getTableHandler();
    this.diagramHandler = this.handler.getDiagramHandler();
    this.flyoutInfo = [
        {
            id: 'search',
            title: loc.tile.search,
            controller: this.searchHandler.getController(),
            state: this.searchHandler.getState()
        },
        {
            id: 'table',
            title: loc.tile.table,
            controller: this.tableHandler.getController(),
            state: this.tableHandler.getState()
        },
        {
            id: 'diagram',
            title: loc.tile.diagram,
            controller: this.diagramHandler.getController(),
            state: this.diagramHandler.getState()
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

        const navDimensions = getNavigationDimensions();
        var position = navDimensions.right;
        const y = this._positionY;
        const container = jQuery(Oskari.dom.getRootEl());
        this.flyoutInfo.forEach((info) => {
            if (info.id === 'search' || info.id === 'table' || info.id === 'diagram') {
                this.flyouts[info.id] = {
                    controller: info.controller,
                    state: info.state
                };
            } else {
                var flyout = Oskari.clazz.create(info.oskariClass, info.title, {
                    width: 'auto',
                    cls: info.cls,
                    container,
                    position: {
                        x: position,
                        y
                    }
                }, this.instance);
                flyout.makeDraggable({
                    handle: '.oskari-flyouttoolbar, .statsgrid-data-container > .header',
                    scroll: false
                });

                flyout.bringToTop();
                flyout.on('hide', () => {
                    this.trigger('hide', info.id);
                });
                this.flyouts[info.id] = flyout;
                position = position + flyout.getSize().width;
                if (info.resizable) {
                    const { minWidth, minHeight } = info;
                    flyout.makeResizable({
                        minWidth,
                        minHeight
                    });
                }
            }
        });
    },
    open: function (type) {
        const flyout = this.flyouts[type];
        if (!flyout || type === 'indicatorForm') {
            return;
        }
        flyout.controller.toggleFlyout(true, () => this.trigger('hide', type));
        this.trigger('show', type);
        this.flyoutInfo.filter(info => info.id !== type).forEach(info => this.hide(info.id));
    },
    hide: function (type) {
        const flyout = this.flyouts[type];
        if (!flyout || type === 'indicatorForm') {
            return;
        }

        flyout.controller.toggleFlyout(false);
        this.trigger('hide', type);
    },
    toggle: function (type) {
        const flyout = this.getFlyout(type);
        if (!flyout || type === 'indicatorForm') {
            // unrecognized flyout
            return;
        }
        if (flyout.state.flyout) {
            this.hide(type);
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
            this.hide(type);
        });
    }

});
