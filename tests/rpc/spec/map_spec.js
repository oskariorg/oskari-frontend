describe('Map', function(){

    beforeEach(function(done) {
        channel.onReady(function() {
            // Channel is now ready and listening.
            channel.resetState(function() {
                // Reset map and event counter.
                counter = 0;
                done();
            });
        });
    });

    afterEach(function() {
        // Spy callback.
        expect(counter).toEqual(1);
        // Reset event handlers.
        resetEventHandlers();
    });


    describe('Get available map layers', function() {

        it('Get all layers', function(done) {
            channel.getAllLayers(function(data) {
                // Expect atleast basemap layer to be found.
                expect(Object.keys(data).length).toBeGreaterThan(0);
                // Expect basemap layer to be have 4 elements.
                expect(Object.keys(data[0]).length).toBe(4);
                // id, opacity, visible, name
                expect(data[0].id).toBeDefined();
                expect(data[0].opacity).not.toBeGreaterThan(100);
                expect(data[0].visible).toBeTruthy();
                expect(data[0].name).toBeDefined();
                //layer can have max/min zoom
                //expect(data.minZoom).toBeDefined();
                //expect(data.maxZoom).toBeDefined();

                channel.log('Get available map layers done. ', data);
                counter++;
                done();
            });
        });

    });

    describe('Get map position', function() {

        it('Gets map position', function(done) {
            channel.getMapPosition(function(data) {
                // Expect getMapPosition data to have 5 elements.
                expect(Object.keys(data).length).toBe(5);
                // coordinates
                expect(data.centerX).not.toBeLessThan(0);
                expect(data.centerY).not.toBeLessThan(0);
                // zoom is int
                expect(data.centerY).not.toBeLessThan(0);
                expect(Math.trunc(data.zoom)).toEqual(data.zoom);
                // scale is int
                expect(data.centerY).not.toBeLessThan(0);
                expect(Math.trunc(data.scale)).toEqual(data.scale);
                // srs
                expect(data.srsName).toMatch(/\d{1,}/);
                expect(data.srsName).toContain("EPSG");

                channel.log('Get Map Position done.', data);
                counter++;
                done();
            });
        });

    });

    describe('Get map bounding box', function() {

        it('Gets map bbox', function(done) {
            channel.getMapBbox(function(data) {
                // Expect getMapBbox data to have 4 elements. 
                expect(Object.keys(data).length).toBe(4);
                // Bbox varies by screen size
                expect(data.bottom).toEqual(jasmine.any(Number));
                expect(data.left).toEqual(jasmine.any(Number));
                expect(data.right).toEqual(jasmine.any(Number));
                expect(data.top).toEqual(jasmine.any(Number));

                channel.log('Get Map Bbox done.', data);
                counter++;
                done();
            });
        });

    });

    describe('Get a screenshot of the map', function() {

        it('Gets Screenshot', function(done) {
            channel.getScreenshot(function(data) {
                setTimeout(function() {
                    // Encode then decode and compare to the original.
                    expect(atob(btoa(data))).toBe(data);
                    expect(Object.keys(data).length).toBeGreaterThan(1000);
                    expect(data).toContain("data:image/png;base64,");
                
                    channel.log('Get Screenshot done.');
                    counter++;
                    done();
                }, 1000);
            });
        });

    });

    describe('Rotate map', function() {
        
        beforeEach(function(done) {
            //Save map position.
            channel.getMapPosition(function(data) {
                defaultPosition = data;
                done();
            });
        });

        it('Rotates 180', function(done) {
            // Listen AfterMapMoveEvent occurs and position stays same as before rotation
            handleEvent('AfterMapMoveEvent', function(data) {
                channel.log('AfterMapMoveEvent launched!');
                expect(data.centerX).toBe(defaultPosition.centerX);
                expect(data.centerY).toBe(defaultPosition.centerY);
                expect(data.zoom).toBe(defaultPosition.zoom);
                counter++;
                done();
            });
            // rotate.map 180 degrees
            channel.postRequest('rotate.map', [180]);
            channel.log('rotate.map 180 request done.');
        });
        it('Resets rotation', function(done) {
            channel.postRequest('rotate.map', []);
            channel.log('rotate.map reset.');
            counter++;
            done();
        });

    });

    describe('Zoom functions', function() {
        
        var zoom;

        beforeEach(function(done) {
            //Save current zoom.
            channel.getZoomRange(function(data) {
                zoom = data;
                done();
            });
        });

        it('Gets Zoom Range', function(done) {
            channel.getZoomRange(function(data) {
                // Expect getzoom data to have 3 elements.
                expect(Object.keys(data).length).toBe(3);
                expect(data.min).not.toBeLessThan(0);
                expect(data.max).toBeGreaterThan(0);
                expect(data.current).not.toBeLessThan(0);

                channel.log('Get Zoom Range done.', data);
                counter++
                done();
            });
        });

        it('Zooms in', function(done) {
            channel.zoomIn(function(data){
                // Expect zoom to be +1.
                expect(data).toEqual(zoom.current+1);

                expect(data).not.toBeLessThan(zoom.min);
                expect(data).not.toBeGreaterThan(zoom.max);

                channel.log('Zoom level after zoomIn: ', data);
                counter++
                done();
            });
        });

        it('Zooms out', function(done) {
            channel.zoomOut(function(data){
                // Expect zoom to be -1. Cannot be negative.
                expect(data).not.toBeLessThan(zoom.current-1);
                expect(data).not.toBeGreaterThan(zoom.current);

                expect(data).not.toBeLessThan(zoom.min);
                expect(data).not.toBeGreaterThan(zoom.max);

                channel.log('Zoom level after zoomOut: ', data);
                counter++
                done();
            });
        });

        it('Zooms To 5', function(done) {
            channel.zoomTo([5],function(data){
                // Expect zoom to be 5.
                expect(data).toEqual(5);

                channel.log('Zoom level after zoom to 5: ', data);
                counter++
                done();
            });
        });
    });

    describe('Handle map state', function() {
        
        var savedState;
        
        beforeEach(function(done) {
            //Save map position for testing.
            channel.getMapPosition(function(data) {
                defaultPosition = data;
                //Save layer for testing.
                channel.getAllLayers(function(data) {
                    defaultLayer= data;
                    // Save state for loading.
                    channel.getCurrentState(function(data) {
                        savedState = data;
                        done();
                    });
                });
            });
        });


        it('Resets state', function(done) {
            // Expect AfterMapMoveEvent to occur after resetState.
            handleEvent('AfterMapMoveEvent', function(data) {
                // Expect map moved to default position.
                expect(defaultPosition).toEqual(jasmine.objectContaining(data));
                // More verbose:
                expect(data.centerX).toBe(defaultPosition.centerX);
                expect(data.centerY).toBe(defaultPosition.centerY);
                expect(data.zoom).toBe(defaultPosition.zoom);
                expect(data.scale).toBe(defaultPosition.scale);

                channel.log('ResetState moved map:', data);
                counter++;
                done();
            });
            // Reset state.
            channel.resetState(function(){});
        });

        it('Saves state', function(done) {
            // Get current state.
            channel.getCurrentState(function(data) {
                // Mapfull contains state and layer info.
                expect(data).toEqual(jasmine.objectContaining({
                    mapfull: jasmine.objectContaining({
                        state: jasmine.objectContaining({

                            north: defaultPosition.centerY,
                            east: defaultPosition.centerX,
                            zoom: defaultPosition.zoom,
                            srs: defaultPosition.srsName,

                            selectedLayers:[jasmine.objectContaining({
                                id: defaultLayer[0].id,
                                opacity:defaultLayer[0].opacity,
                                //style:"default"
                            })]
                        })
                    })
                }));

                // Expect toolbar and plugin settings to be found.
                expect(data.toolbar).toBeDefined();
                expect(data.mapfull.state.plugins).toBeDefined();
                // Basemap layer is at 0.
                //expect(defaultLayer[0]).toEqual(jasmine.objectContaining(data.mapfull.state.selectedLayers[0]));

                channel.log('GetCurrentState: ', data);
                counter++;
                done();
            });
        });

        it('Loads state', function(done) {
            // Expect AfterMapMoveEvent to occur after useState.
            handleEvent('AfterMapMoveEvent', function(data) {
                // Expect map moved to default position.
                expect(defaultPosition).toEqual(jasmine.objectContaining(data));
                // More verbose:
                expect(data.centerX).toBe(defaultPosition.centerX);
                expect(data.centerY).toBe(defaultPosition.centerY);
                expect(data.zoom).toBe(defaultPosition.zoom);
                expect(data.scale).toBe(defaultPosition.scale);
                
                channel.log('UseState moved map:', data);
                counter++;
                done();
            });
            // Use saved state.
            channel.useState([savedState], function(){
                channel.log('UseState: ', savedState);
            });
        });
    });

});



