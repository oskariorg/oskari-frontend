/*
 * hub.js:
 */

var hub = function() {

	var nextId = 0;
	var subscriptions = { };
	
	function Subscription(listener, filter) {
		this.listener = listener;
		this.filter = filter || { };
		this.deliver = function(e) {
			for (var k in this.filter) {
				if (this.filter[k] != e[k]) return false;
			}
			this.listener(e);
			return true;
		}
	}
	
	function subscribe(filter, listener) {
		var id = nextId;
		nextId += 1;
		if (typeof filter === "string") filter = { type: filter };
		subscriptions[id] = new Subscription(listener, filter);
		return id;
	}

	function unsubscribe(id) {
		delete subscriptions[id];
	}
	
	function makeEvent(type, data) {
		var e = {type: type};
		for (var k in data) e[k] = data[k];
		return e;
	}
	
	function send(type, data) {
		var count = 0;
		var event = makeEvent(type, data || {});
		for (var id in subscriptions) {
			if (subscriptions[id].deliver(event)) count++;
		}
		return count;
	}
	
	return {
		subscribe:    subscribe,
		unsubscribe:  unsubscribe,
		send:         send
	};
	
}();
