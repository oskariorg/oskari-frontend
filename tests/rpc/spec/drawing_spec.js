describe('Drawing', function(){

    function handleEvent(name, handler) {
        channel.handleEvent(name, handler);
            handlersToClean.push({
            name: name,
            handler: handler
        });
    };

    beforeEach(function(done) {
        channel.onReady(function() {
            // Channel is now ready and listening.
            channel.resetState(function() {
                // Reset map and event counter.
                eventCounter = 0;
                // Delay between tests
                setTimeout(function() {
                    done();
                }, 0);
            });
        });
    });

    afterEach(function() {
        // Spy callback.
        expect(eventCounter).toEqual(1, "Event count does not match");
        // Reset event handlers.
        while (handlersToClean.length) {
            var item = handlersToClean.shift();
            channel.unregisterEventHandler(item.name, item.handler);
        };
    });

    describe('DrawTools', function() {

        describe('Start Drawing', function() {

            all("Drawing requests",[
               'Point',
               'LineString',
               'Polygon',
               'Circle',
               'Box',
               'Square'
               ],
                function(drawRequests, done) {
                    channel.postRequest('DrawTools.StartDrawingRequest', ['my functionality id', drawRequests]);
                    channel.log("StartDrawingRequest:", drawRequests)
                    eventCounter++;
                    done();
                }
            );
        });

        describe('Stop Drawing', function() {

            it("Cancels Drawing request", function(done) {
                handleEvent('DrawingEvent', function(data) {
                    channel.log('DrawingEvent triggered!');
                    expect(data.name).toBe("DrawingEvent");
                    expect(data.id).toBe("Test");
                    expect(data.isFinished).toBe(true);
                    eventCounter++;
                    done();
                });
                // DrawingEvent does not occur unless draw started
                channel.postRequest('DrawTools.StartDrawingRequest', ['Test', 'Point']);
                channel.log('StartDrawingRequest Test.');
                // StopDrawingRequest Cancel
                channel.postRequest('DrawTools.StopDrawingRequest', ['Test'])
                channel.log('StopDrawingRequest Test Cancel.');
            });
            it("Clears Drawing request", function(done) {
                handleEvent('DrawingEvent', function(data) {
                    channel.log('DrawingEvent triggered!');
                    expect(data.name).toBe("DrawingEvent");
                    expect(data.id).toBe("Test");
                    expect(data.isFinished).toBe(true);
                    eventCounter++;
                    done();
                });
                // Start drawing
                channel.postRequest('DrawTools.StartDrawingRequest', ['Test', 'Point']);
                channel.log('StartDrawingRequest Test.');
                // StopDrawingRequest Clear
                channel.postRequest('DrawTools.StopDrawingRequest', ['Test', true])
                channel.log('StopDrawingRequest Test Clear.');
            });
        });
    });
});

