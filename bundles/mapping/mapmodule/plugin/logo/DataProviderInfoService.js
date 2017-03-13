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
        /**
         * Add a group with id. Will show on the UI with the given name if it has any items.
         * Items can be added also after the group has been created.
         * Triggers a change-event if the group was added. Doesn't add the group if one exists with the same id.
         * @param {Number | String} id id for the group
         * @param {String} name  UI label for the group
         * @param {Object[]} items optional array of items for the group.
         * @return {Object} The group that was added
         */
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
        /**
         * Removes the group matching the id.
         * Triggers a change-event if the group was removed. Doesn't trigger the event if group was not found.
         * @param  {Number | String} id if for the group to remove
         * @return {Boolean} true if the group was removed
         */
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
            return true;
        },
        /**
         * Returns a filtered list of all the groups.
         * Only includes groups that have items and should be shown in the UI.
         * @return {Object[]} Array of groups to be shown in the UI.
         */
        getNonEmptyGroups : function() {
            var list =[];
            this.groups.forEach(function(group) {
                if(group.items.length) {
                    list.push(group);
                }
            });
            return list;
        },
        /**
         * Returns the unfiltered datamodel of the groups listing/single group.
         * @param  {Number | String} id optional if for a group
         * @return {Object[] | Object | Boolean} returns all the groups if parameter was undefined, boolean false if the requested group did not exist or the requested group.
         */
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
        /**
         * Removes an item from the group.
         * Triggers a change-event if the item was removed.
         * @param  {Number | String} groupId id for the group
         * @param  {Number | String} itemId  id for the item
         * @return {Boolean} true if item was removed, false if group/item was not found.
         */
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
        /**
         * Adds an item to the group. The item should be an object that has an id, name and source.
         * Triggers a change-event if the item was added.
         * @param {Number | String} groupId id for the group
         * @param {Object} item     object to add for the group
         * @return {Boolean} true if the item was added.
         */
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
        /**
         * Returns an index for an object in the list.
         * @private
         * @param  {String} key   key in object to use like 'id'
         * @param  {String | Number} value value of the key to match
         * @param  {Object[]} list  list to search through
         * @return {Number} index for the item or -1 if not found
         */
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