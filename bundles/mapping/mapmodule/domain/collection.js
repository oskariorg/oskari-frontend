(function () {
    var collection = [];
    Oskari.clazz.define('Oskari.model.collection', function () {
        Oskari.makeObservable(this);
    }, {
        add: function (item) {
            collection.push(item);
            this.trigger('add', item);
        },
        remove: function (item) {
            var itemIndex = collection.findIndex(function (existingItem) {
                return item === existingItem;
            });
            if (itemIndex === -1) {
                // not found
                return false;
            }
            collection.splice(itemIndex, 1);
            this.trigger('remove', item);
            return true;
        },
        removeById: function (item) {
            if (typeof item.getId !== 'function') {
                throw new Error('removeById() assumes items to have getId() function');
            }
            var itemIndex = collection.findIndex(function (existingItem) {
                return item === existingItem;
            });
            if (itemIndex === -1) {
                // not found
                return false;
            }
            collection.splice(itemIndex, 1);
            this.trigger('remove', item);
            return true;
        }
    });
})();
