
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.CallbackQueue',

    function () {
        this.callbackQueue = {};
    }, {
        getCallbackQueue : function(name) {
            if(!this.callbackQueue[name]) {
                this.callbackQueue[name] = [];
            }
            return this.callbackQueue[name];
        },
        /**
         * [addCallbackQueue description]
         * @param {[type]}   name     [description]
         * @param {Function} callback [description]
         * @return true if was the first
         */
        addCallbackToQueue : function(name, callback) {

            var queue = this.getCallbackQueue(name);
            queue.push(callback);
            return (queue.length === 1);
        },
        notifyCallbacks : function(name, args) {
            var queue = this.getCallbackQueue(name);
            while(queue.length > 0) {
                var cb = queue.shift();
                cb.apply(cb, args || []);
            }
        },
        getQueueName : function(baseName, args) {
            var separator = '___';
            var name = baseName;
            _.each(args, function(item) {
                if(_.isFunction(item)) {
                    return;
                }
                // TODO: handle objects etc
                name = name + separator + item;
            });
            return name;
        }
    });