/**
 * @class Oskari.map.DataProviderInfoService
 *
var service = Oskari.getSandbox().getService('Oskari.map.DataProviderInfoService');
service.on('change', function() {
    console.log('groups', this._service.getGroups());
    console.log('groups for ui', this._service.getNonEmptyGroups());
});
service.addGroup('map.layers', 'Map layers');
service.addGroup('statsgrid.indicators', 'Statistics indicators', [{ 'id' : 'dummy id', 'name' : 'indicator name', 'source' : 'Data provider for indicator'}]);
service.removeItemFromGroup('statsgrid.indicators', 'dummy id');
service.addItemToGroup('map.layers', { 'id' : 'dummy id the second', 'name' : 'indicator name', 'source' : 'Data provider for indicator'});
 */
(function(Oskari) {
    var _log = Oskari.log('Oskari.map.DataProviderInfoService');

    Oskari.clazz.define('Oskari.map.DataProviderInfoService',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (sandbox) {
        if(!sandbox) {
            // don't create if sandbox is not provided
            return null;
        }
        this.sandbox = sandbox;
        var me = sandbox.getService(this.getQName());
        if(me) {
            // "singleton"
            return me;
        }
        sandbox.registerService(this);
        this.groups = [];

        // attach on, off, trigger functions
        Oskari.makeObservable(this);
    }, {
        __name: "map.DataProviderInfoService",
        __qname: "Oskari.map.DataProviderInfoService",

        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        addGroup : function(id, name, items) {
            var group = {
                id : id,
                name : name || id,
                items : items || []
            };
            var me = this;
            var list = this.groups;
            var indexForGroup = this._getItemIndex('id', id, list);
            if(indexForGroup === -1) {
                list.push(group);
                this.trigger('change');
                return group;
            }
            if(items && typeof items.forEach === 'function') {
                items.forEach(function(item) {
                    me.addItemToGroup(id, item);
                });
            }
            return list[indexForGroup];
        },
        removeGroup : function(id) {
            var list = this.groups;
            var indexForGroup = this._getItemIndex('id', id, list);
            if(indexForGroup === -1) {
                // not found
                _log.debug('Group with id "' + id + '" is not available.');
                return false;
            }
            list.splice(indexForGroup, 1);
            this.trigger('change');
        },
        getNonEmptyGroups : function() {
            var list =[];
            this.groups.forEach(function(group) {
                if(group.items.length) {
                    list.push(group);
                }
            });
            return list;
        },
        getGroups : function(id) {
            if(typeof id === 'undefined') {
                return this.groups;
            }
            var list = this.groups;
            var indexForGroup = this._getItemIndex('id', id, list);
            if(indexForGroup === -1) {
                // not found
                _log.debug('Group with id "' + id + '" is not available.');
                return false;
            }
            return this.groups[indexForGroup];
        },
        removeItemFromGroup : function(groupId, itemId) {
            if(!groupId || !itemId) {
                return false;
            }
            var group = this.getGroups(groupId);
            if(!group) {
                return false;
            }
            var itemIndex = this._getItemIndex('id', itemId, group.items);
            if(itemIndex === -1) {
                // not found
                _log.debug('Item with id "' + itemId + '" not part of group"' + groupId + '".');
                return false;
            }
            group.items.splice(itemIndex, 1);
            this.trigger('change');
            return true;
        },
        addItemToGroup : function(groupId, item) {
            if(!groupId || !item) {
                return false;
            }
            var group = this.getGroups(groupId);
            if(!group) {
                return false;
            }
            var itemIndex = this._getItemIndex('id', item.id, group.items);
            if(itemIndex !== -1) {
                // not found
                _log.debug('Item already exists "' + item.id + '" in group"' + groupId + '".');
                return false;
            }
            group.items.push(item);
            this.trigger('change');
            return true;
        },
        _getItemIndex: function (key, value, list) {
            list = list || [];
            var len = list.length;
            for (var i = 0; i < len; ++i) {
                if(list[i][key] === value) {
                    return i;
                }
            }
            return -1;
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
}(Oskari));