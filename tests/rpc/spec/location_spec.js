describe('Location', function(){

    function handleEvent(name, handler) {
        channel.handleEvent(name, handler);
            handlersToClean.push({
            name: name,
            handler: handler
        });
    };

    beforeEach(function(done) {
        channel.onReady(function() {
             // Reset map and event counter.
            channel.resetState(function() {
                eventCounter = 0;
                // Get default position
                channel.getMapPosition(function(data) {
                    defaultPosition = data;
                    // Delay between tests
                    setTimeout(function() {
                        done();
                    }, 0);
                });
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

    // # Requests: GetUserLocationRequest
    it("Get users location", function(done) {

        handleEvent('UserLocationEvent', function(data) {
            channel.log('UserLocationEvent triggered:', data);
            expect(data.lat).toBeDefined("latitude not found.");
            expect(data.lon).toBeDefined("longitude not found.");
            eventCounter++;
            done();
        });

        channel.postRequest('MyLocationPlugin.GetUserLocationRequest', [true]);
        channel.log('GetUserLocationRequest request done.');
    });

    // # Requests: SearchRequest
    it("Search request", function(done) {

        handleEvent('SearchResultEvent', function(data) {
            channel.log('SearchResultEvent:', data);
            expect(data.success).toBe(true);
            expect(data.result.locations[0].region).toBe(searchCriteria);
            eventCounter++;
            done();
        });

        channel.postRequest('SearchRequest', [searchCriteria]);
        channel.log('SearchRequest:', searchCriteria);
    });

    // # Requests: GetRouteRequest
    all("Get route requests",[

       "BICYCLE",
       "WALK",
       "TRANSIT,WALK"
       ],
        function(routeRequest, done) {

            var myRouteRequest = {
              "fromlat": defaultPosition.centerY,
              "fromlon": defaultPosition.centerX,
              "srs": defaultPosition.srsName,
              "tolat": defaultPosition.centerY+1000,
              "tolon": defaultPosition.centerX+1000,
              "mode": routeRequest
            };

            handleEvent('RouteResultEvent', function(data) {
                channel.log('RouteResultEvent:', data);
                expect(data.success).toEqual(true);
                expect(data.rawParams.mode).toEqual(myRouteRequest.mode);
                expect(data.rawParams.fromlat).toEqual(myRouteRequest.fromlat);
                expect(data.rawParams.fromlon).toEqual(myRouteRequest.fromlon);
                expect(data.rawParams.tolat).toEqual(myRouteRequest.tolat);
                expect(data.rawParams.tolon).toEqual(myRouteRequest.tolon);
                eventCounter++;
                done();
            });

            channel.postRequest('GetRouteRequest', [myRouteRequest]);
            channel.log('GetRouteRequest:', myRouteRequest);
        }
    );

});

