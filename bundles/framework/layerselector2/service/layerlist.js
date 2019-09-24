(function (Oskari) {
    Oskari.clazz.define('Oskari.mapframework.service.LayerlistService',
        function () {
            this.layerlistFilterButtons = {};
            this.currentFilter = null;
            Oskari.makeObservable(this);
        },
        {
        /** @static @property __name service name */
            __name: 'LayerlistService',
            /** @static @property __qname fully qualified name for service */
            __qname: 'Oskari.mapframework.service.LayerlistService',
            /**
         * @method getQName
         * @return {String} fully qualified name for service
         */
            getQName: function () {
                return this.__qname;
            },
            /**
         * @method getName
         * @return {String} service name
         */
            getName: function () {
                return this.__name;
            },
            getMutator () {
                const me = this;
                return {
                    setCurrentFilter (filterId) {
                        me.currentFilter = me.currentFilter === filterId ? null : filterId;
                        if (me.currentFilter) {
                            // Set current filter style to active and others to deactive
                            const currentFilter = Object.values(me.layerlistFilterButtons).filter(b => b.id === me.currentFilter)[0];
                            currentFilter.cls.current = currentFilter.cls.active;
                            const otherFilters = Object.values(me.layerlistFilterButtons).filter(b => b.id !== me.currentFilter);
                            if (otherFilters) {
                                otherFilters.map(o => {
                                    o.cls.current = o.cls.deactive;
                                    return o;
                                });
                            }
                        } else {
                            Object.values(me.layerlistFilterButtons).map(o => {
                                o.cls.current = o.cls.deactive;
                                return o;
                            });
                        }
                        me.trigger('FilterActivate');
                    }
                };
            },
            registerLayerlistFilterButton: function (text, tooltip, cls, filterId) {
                var me = this;

                if (me.layerlistFilterButtons[filterId]) {
                    return;
                }

                var properties = {
                    text: text,
                    tooltip: tooltip,
                    cls: cls,
                    id: filterId
                };
                me.layerlistFilterButtons[filterId] = properties;
                this.trigger('Layerlist.Filter.Button.Add', {
                    filterId: filterId,
                    properties: properties
                });
            },
            getLayerlistFilterButton: function (filterId) {
                var me = this;
                if (filterId) {
                    return me.layerlistFilterButtons[filterId];
                }
                return me.layerlistFilterButtons;
            },
            getLayerlistFilterButtons: function () {
                return this.layerlistFilterButtons;
            },
            getCurrentFilter: function () {
                return this.currentFilter;
            }
        }, {
            'protocol': ['Oskari.mapframework.service.Service']
        });
}(Oskari));
