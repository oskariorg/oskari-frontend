
/**
 * Creates on, off, trigger functions for Oskari
 */
(function(o){
    if(!o) {
        // can't add eventbus if no Oskari ref
        return;
    }
    if(o.on) {
        // already created on, don't run again
        return;
    }
    var log = Oskari.log('Events');

   var EventBus = function() {

      var store = o.createStore('subscribers', {
         defaultValue: function() {
            // return an array as default for any key
            return [];
        }
      });

      return {
         'on': function(event, handlerFn) {
            // only allow functions to be stored as handlers
            if (typeof handlerFn !== 'function') {
               return false;
            }

            var list = store.subscribers(event);

            list.push(handlerFn);
            log.debug('Subscriber added for ' + event);
            return store.subscribers(event, list);
         },

         'off': function(event, handlerFn) {
            var currentSubs = store.subscribers(event);

            // remove if handlerFn found in currentSubs
            var success = false;
            for (var n = 0; n < currentSubs.length; n++) {
               if (currentSubs[n] === handlerFn) {
                  currentSubs.splice(n, 1);
                  success = true;
                  break;
               }
            }

            log.debug('Subscriber removed for ' + event);
            return success;
         },

         'trigger': function(event, data) {
            var currentSubs = store.subscribers(event);
            var count = 0;
            currentSubs.forEach(function(sub) {
                try {
                   sub(data, event);
                   count++;
                } catch(e) {
                    log.warn('Error notifying about ' + event, e);
                }
            });

            log.debug('Triggered ' + event + ' - subscribers: ' + count);
            return count;
         }
      };
   };


  var bus = new EventBus();
  o.on = bus.on;
  o.off = bus.off;
  o.trigger = bus.trigger;

}(Oskari));