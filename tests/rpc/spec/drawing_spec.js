describe('Drawing', function(){

    beforeEach(function(done) {
        channel.onReady(function() {
            // Channel is now ready and listening.
            channel.resetState(function() {
                // Reset map and counter.
                counter = 0;
                // Delay between tests
                setTimeout(function() {
                    done();
                }, 0);
            });
        });
    });

    afterEach(function() {
        // Spy callback.
        expect(counter).toEqual(1);
        // Reset event handlers.
        resetEventHandlers();
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
                    counter++;
                    done();
                }
            );
        });


        describe('Stop Drawing', function() {

            function listenDrawingEvent(Id) {
                // Create event handler for drawing event
                handleEvent('DrawingEvent', function(data) {
                    channel.log('DrawingEvent triggered:', data);
                    expect(data.name).toBe("DrawingEvent");
                    expect(data.id).toBe(Id);
                    expect(data.isFinished).toBe(true);
                    counter++;
                });
            }

            function startDraw(Id) {
                // DrawingEvent does not occur unless draw started
                channel.postRequest('DrawTools.StartDrawingRequest', [Id, 'Point']);
                channel.log('StartDrawingRequest:', Id);
            }

            function cancelDraw(Id) {
                // StopDrawingRequest Cancel
                channel.postRequest('DrawTools.StopDrawingRequest', [Id])
                channel.log('StopDrawingRequest Cancel:', Id);
            }

            function clearDraw(Id) {
                // StopDrawingRequest Clear
                channel.postRequest('DrawTools.StopDrawingRequest', [Id, true])
                channel.log('StopDrawingRequest Clear:', Id);
            }

            it("Cancels Drawing request", function(done) {

                listenDrawingEvent("Test");
                startDraw("Test");
                cancelDraw("Test");

                setTimeout(function(){ done() }, 200);
            });

            it("Clears Drawing request", function(done) {

                listenDrawingEvent("Test");
                startDraw("Test");
                clearDraw("Test");

                setTimeout(function(){ done() }, 200);
            });
        });
    });
});

