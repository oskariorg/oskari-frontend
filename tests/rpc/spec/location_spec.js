describe('Location', function(){

    beforeEach(function(done) {
        channel.onReady(function() {
             // Reset map and event counter.
            channel.resetState(function() {
                counter = 0;
                // Get default position
                channel.getMapPosition(function(data) {
                    defaultPosition = data;
                    // Delay between tests
                    setTimeout(function() {
                        done();
                    }, 500);
                });
             });
        });
    });

    afterEach(function() {
        // Spy callback.
        expect(counter).toEqual(1);
        // Reset event handlers.
        resetEventHandlers();
    });

    // # Requests: GetUserLocationRequest
    it("Get users location", function(done) {
        // Https needed for user location
        handleEvent('UserLocationEvent', function(data) {
            channel.log('UserLocationEvent triggered:', data);
            expect(data.lat).toBeDefined("latitude not found.");
            expect(data.lon).toBeDefined("longitude not found.");
            counter++;
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
            expect(data.result.locations[0].name).toContain(searchCriteria);
            
            result = Object.keys(data.result.locations[0]);
                expect(result).toContain('channelId');
                expect(result).toContain('id');
                expect(result).toContain('lat');
                expect(result).toContain('lon');
                expect(result).toContain('rank');
                expect(result).toContain('region');
                expect(result).toContain('type');
                expect(result).toContain('village');
                //expect(result).toContain('zoomScale');
            counter++;
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

            var myRouteRequest2 = {
              "fromlat": defaultPosition.centerY,
              "fromlon": defaultPosition.centerX,
              "srs": defaultPosition.srsName,
              "tolat": defaultPosition.centerY+10,
              "tolon": defaultPosition.centerX+1,
              "mode": routeRequest
            };

            var myRouteRequest = {
                'fromlat': '6683840',
                'fromlon': '360448',
                'srs': 'EPSG:3067',
                'tolat': '6675728',
                'tolon': '394240',
                'mode': routeRequest // TRANSIT, WALK, BICYCLE, TRAIN and so on
              };

            handleEvent('RouteResultEvent', function(data) {
                channel.log('RouteResultEvent:', data);
                expect(data.success).toEqual(true);
                expect(data.rawParams.mode).toEqual(myRouteRequest.mode);
                expect(data.rawParams.fromlat).toEqual(myRouteRequest.fromlat);
                expect(data.rawParams.fromlon).toEqual(myRouteRequest.fromlon);
                expect(data.rawParams.tolat).toEqual(myRouteRequest.tolat);
                expect(data.rawParams.tolon).toEqual(myRouteRequest.tolon);
                counter++;
                done();
            });

            channel.postRequest('GetRouteRequest', [myRouteRequest]);
            channel.log('GetRouteRequest:', myRouteRequest);
        }
    );

    // # Requests: GetFeedbackServiceRequest
    it("Get feedback service list", function(done) {

        handleEvent('FeedbackResultEvent', function(data) {
            
            expect(data.success).toEqual(true);

            result = Object.keys(data);
                expect(result).toContain('success');
                expect(result).toContain('data');
                expect(result).toContain('requestParameters');
            
            serviceList = Object.keys(data.data.serviceList[0]);
                expect(serviceList).toContain('keywords', data);
                expect(serviceList).toContain('description');
                expect(serviceList).toContain('service_name');
                expect(serviceList).toContain('group');
                expect(serviceList).toContain('type');
                expect(serviceList).toContain('service_code');
                expect(serviceList).toContain('metadata');

            channel.log('FeedbackResultEvent', data);
            counter++;
            done();
        });

        channel.postRequest('GetFeedbackServiceRequest', []);
        channel.log('GetUserLocationRequest request done.');
    });
});

