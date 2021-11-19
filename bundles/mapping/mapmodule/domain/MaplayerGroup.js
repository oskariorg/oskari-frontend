Oskari.clazz.define('Oskari.mapframework.domain.MaplayerGroup',
    function (json) {
        var me = this;
        me.groups = [];

        (json.groups || []).forEach(function (subgroup) {
            me.groups.push(Oskari.clazz.create('Oskari.mapframework.domain.MaplayerGroup', subgroup));
        });

        me.id = json.id;
        me.layersModels = [];
        me.layers = json.layers || [];
        me.name = json.name;
        me.orderNumber = (typeof json.orderNumber !== 'undefined') ? json.orderNumber : 1000000;
        me.parentId = (typeof json.parentId !== 'undefined') ? json.parentId : -1;
        me.selectable = (typeof json.selectable === 'boolean') ? json.selectable : true;
        me.toolsVisible = (typeof json.toolsVisible === 'boolean') ? json.toolsVisible : true;
        me.children = [];
        me.setChildren(json);
    }, {
        getGroups: function () {
            return this.groups || [];
        },
        setGroups: function (groups) {
            this.groups = groups;
        },
        getId: function () {
            return this.id;
        },
        setId: function (id) {
            this.id = id;
        },
        addChildren: function (children) {
            this.children.push(children);
        },
        removeChild: function (type, id) {
            const filteredChildren = this.children
                .filter(c => !(c.type === type && c.id === id));
            this.children = filteredChildren;
        },
        setChildren: function (json) {
            var me = this;
            me.children = [];
            if (json.layers) {
                json.layers.forEach(function (l) {
                    me.children.push({
                        id: l.id,
                        type: 'layer',
                        order: l.orderNumber
                    });
                });
            }

            me.groups.forEach(function (g) {
                me.children.push({
                    id: g.getId(),
                    type: 'group',
                    order: g.getOrderNumber()
                });
            });
            me.sort();
        },
        sort: function () {
            this.children.sort(function compare (a, b) {
                // if layer and group have same order then layer go upper
                if (a.type === 'layer' && b.type === 'group' && a.order === b.order) {
                    return -1;
                }
                if (a.type === 'group' && b.type === 'layer' && a.order === b.order) {
                    return 1;
                }

                // else use order or id to sort
                if (a.order < b.order) {
                    return -1;
                }
                if (a.order > b.order) {
                    return 1;
                }

                if (a.id < b.id) {
                    return -1;
                }
                if (a.id > b.id) {
                    return 1;
                }

                return 0;
            });
        },
        getChildren: function () {
            return this.children;
        },
        getLayerIdList: function () {
            return this.getChildren()
                .filter(c => c.type === 'layer')
                .map(c => c.id);
        },
        getName: function () {
            return this.name;
        },
        setName: function (name) {
            this.name = name;
        },
        /**
         * You probably shouldn't be using this but getChildren().filter(c => c.type === 'layer')
         * @returns probably not the thing you were looking for...
         */
        getLayers: function () {
            return this.layers;
        },
        setLayers: function (layers) {
            this.layers = layers;
        },
        getOrderNumber: function () {
            return this.orderNumber;
        },
        setOrderNumber: function (orderNumber) {
            this.orderNumber = orderNumber;
        },
        getParentId: function () {
            return this.parentId;
        },
        setParentId: function (parentId) {
            this.parentId = parentId;
        },
        hasSelectable: function () {
            return this.selectable;
        },
        setSelectable: function (selectable) {
            this.selectable = selectable;
        },
        hasLayers: function () {
            return this.getChildren().filter(function (children) {
                return children.type === 'layer';
            }).length > 0;
        },
        hasSubgroups: function () {
            return this.groups.length > 0;
        },
        hasToolsVisible: function () {
            return this.toolsVisible;
        },
        setToolsVisible: function (toolsVisible) {
            this.toolsVisible = toolsVisible;
        }
    }
);
