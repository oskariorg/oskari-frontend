Oskari.clazz.define('Oskari.statistics.statsgrid.FlyoutManager', function (instance, handler) {
    this.instance = instance;
    this.flyouts = {};
    var loc = instance.getLocalization();
    Oskari.makeObservable(this);
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
        }
    ];
}, {
    init: function () {
        if (Object.keys(this.flyouts).length) {
            // already initialized
            return;
        }

        this.flyoutInfo.forEach((info) => {
            this.flyouts[info.id] = {
                controller: info.controller,
                state: info.state
            };
        });
    },
    open: function (type) {
        const flyout = this.flyouts[type];
        if (!flyout) {
            return;
        }
        flyout.controller.toggleFlyout(true, () => this.trigger('hide', type));
        this.trigger('show', type);
        this.flyoutInfo.filter(info => info.id !== type).forEach(info => this.hide(info.id));
    },
    hide: function (type) {
        const flyout = this.flyouts[type];
        if (!flyout) {
            return;
        }

        flyout.controller.toggleFlyout(false);
        this.trigger('hide', type);
    },
    toggle: function (type) {
        const flyout = this.getFlyout(type);
        if (!flyout) {
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
        if (this.handler.getState().indicators?.length < 1) {
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
