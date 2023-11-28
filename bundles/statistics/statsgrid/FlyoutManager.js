Oskari.clazz.define('Oskari.statistics.statsgrid.FlyoutManager', function (instance, handler) {
    this.instance = instance;
    this.flyouts = {};
    Oskari.makeObservable(this);
    this._positionY = 5;
    this.handler = handler;
    this.searchHandler = this.handler.getSearchHandler();
    this.tableHandler = this.handler.getTableHandler();
    this.diagramHandler = this.handler.getDiagramHandler();
    const locale = Oskari.getMsg.bind(null, 'StatsGrid');
    this.flyouts = {
        search: {
            title: locale('tile.search'),
            controller: this.searchHandler.getController(),
            state: this.searchHandler.getState()
        },
        table: {
            title: locale('tile.table'),
            controller: this.tableHandler.getController(),
            state: this.tableHandler.getState()
        },
        diagram: {
            title: locale('tile.diagram'),
            controller: this.diagramHandler.getController(),
            state: this.diagramHandler.getState()
        }
    };
}, {
    open: function (type) {
        const flyout = this.flyouts[type];
        if (!flyout) {
            return;
        }
        flyout.controller.toggleFlyout(true, () => this.trigger('hide', type));
        this.trigger('show', type);
        Object.keys(this.flyouts)
            .filter(id => id !== type)
            .forEach(type => this.hide(type));
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
    getTileOptions: function () {
        return Object.keys(this.flyouts)
            .map(id => {
                return {
                    id,
                    label: this.flyouts[id].title
                };
            });
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
