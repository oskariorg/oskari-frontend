describe('Markers', function(){

    beforeEach(function(done) {
        channel.onReady(function() {
             // Reset map and event counter.
            channel.resetState(function() {
                counter = 0;
                // Get default position
                channel.getMapPosition(function(data) {
                    defaultPosition = data;
                    testMarker.x = defaultPosition.centerX;
                    testMarker.y = defaultPosition.centerY;
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
        expect(counter).toEqual(1);
        // Reset event handlers.
        resetEventHandlers();
    });

    describe('Add or remove markers', function(){


        all("Marker shapes",
                [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    markerShapeLink
                    //markerShapeSvg
                ],

                function(marker, done) {

                    var myMarker = {
                      x: defaultPosition.centerX,
                      y: defaultPosition.centerY,
                      color: "ff0000",
                      shape: marker,
                      size: 10
                    };

                    handleEvent('AfterAddMarkerEvent', function(data) {
                        channel.log('AfterAddMarkerEvent triggered:', data);
                        expect(data.id).toEqual(MARKER_ID);
                        counter++;
                        done();
                    });

                    channel.postRequest('MapModulePlugin.AddMarkerRequest', [myMarker, MARKER_ID]);
                    channel.log('AddMarkerRequest shape:', marker);
                }
        );

        it("Removes marker", function(done) {
            channel.postRequest('MapModulePlugin.RemoveMarkersRequest', [MARKER_ID]);
            channel.log('RemoveMarkersRequest:', MARKER_ID);
            counter++;
            done();
        });

        it("Removes all markers", function(done) {
            channel.postRequest('MapModulePlugin.RemoveMarkersRequest', []);
            channel.log('RemoveMarkersRequest: all');
            counter++;
            done();
        });
    });

    describe('Show or hide markers', function(){

        beforeEach(function() {
            channel.postRequest('MapModulePlugin.AddMarkerRequest', [testMarker, MARKER_ID]);
        });

        it("Show marker", function(done) {
            // If MARKER_ID is not defined then show all invisible markers
            channel.postRequest('MapModulePlugin.MarkerVisibilityRequest', [true, MARKER_ID]);
            channel.log('MarkerVisibilityRequest true:', MARKER_ID);
            counter++;
            done();
        });

        it("Hide marker", function(done) {
            // If MARKER_ID is not defined then hide all invisible markers
            channel.postRequest('MapModulePlugin.MarkerVisibilityRequest', [false, MARKER_ID]);
            channel.log('MarkerVisibilityRequest false:', MARKER_ID);
            counter++;
            done();
        });
    });

    describe('Show or hide infobox for marker', function(){

        beforeEach(function() {
            channel.postRequest('MapModulePlugin.AddMarkerRequest', [testMarker, MARKER_ID]);
        });

        it("Shows infobox for marker", function(done) {
            channel.postRequest('InfoBox.ShowInfoBoxRequest', markerInfobox);
            counter++;
            done();
        });

        it("Hides infobox for marker", function(done) {
            channel.postRequest('InfoBox.HideInfoBoxRequest', markerInfobox);
            counter++;
            done();
        });
    });

});

