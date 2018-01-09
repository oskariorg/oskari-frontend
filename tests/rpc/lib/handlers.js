var handleEvent;
var handlersToClean = [];

function handleEvent(name, handler) {
    channel.handleEvent(name, handler);
        handlersToClean.push({
        name: name,
        handler: handler
    });
};

function resetEventHandlers() {
    while (handlersToClean.length) {
        var item = handlersToClean.shift();
        channel.unregisterEventHandler(item.name, item.handler);
    };
}
