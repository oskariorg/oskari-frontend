(function(Oskari) {
    Oskari.clazz.define('Oskari.mapframework.service.LayerlistService',
        function() {
            this.layerlistFilterButtons = {};
            Oskari.makeObservable(this);
        },
        {
        /** @static @property __name service name */
        __name: "LayerlistService",
        /** @static @property __qname fully qualified name for service */
        __qname: "Oskari.mapframework.service.LayerlistService",
        /**
         * @method getQName
         * @return {String} fully qualified name for service
         */
        getQName: function() {
            return this.__qname;
        },
        /**
         * @method getName
         * @return {String} service name
         */
        getName: function() {
            return this.__name;
        },
        registerLayerlistFilterButton: function(text, tooltip, cls, filterId) {
            var me = this;

            if (me.layerlistFilterButtons[filterId]) {
                Oskari.log(this.getName()).warn(filterId + '-layerlist filter button has allready defined. Not register layerlist filter button.');
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
        getLayerlistFilterButton: function(filterId) {
            var me = this;
            if (filterId) {
                return me.layerlistFilterButtons[filterId];
            }
            return me.layerlistFilterButtons;
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
}(Oskari));