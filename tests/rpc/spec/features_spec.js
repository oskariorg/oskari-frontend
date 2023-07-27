describe('Features', function(){

    beforeEach(function(done) {
        channel.onReady(function() {
             // Reset map and event counter.
            channel.resetState(function() {
                counter = 0;
                // Get default position
                channel.getMapPosition(function(data) {
                    defaultPosition = data;
                    // update test feature coordinates
                    pointGeojsonObject.features[0]. geometry.coordinates = [defaultPosition.centerX, defaultPosition.centerY];
                    pointGeojsonObject.crs.properties.name = defaultPosition.srsName
                    lineGeojsonObject.features[0]. geometry.coordinates = [[defaultPosition.centerX, defaultPosition.centerY], [defaultPosition.centerX + 10, defaultPosition.centerY+ 10]];
                    lineGeojsonObject.crs.properties.name = defaultPosition.srsName
                    // Delay between tests
                    setTimeout(function() {
                        done();
                    }, 1000);
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

    afterAll(function () {
        channel.resetState(function () {});
    })

    it("Adds point feature", function (done) {
        handleEvent('FeatureEvent', function(data) {
            channel.log('FeatureEvent triggered:', data);
            expect(data.operation).toBe("add");
            expect(data.features[0].geojson.type).toBe(pointGeojsonObject.type);
            expect(data.features[0].geojson.features[0].geometry.coordinates).toEqual(pointGeojsonObject.features[0].geometry.coordinates);
            counter++;
            done();
        });

        channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', addPointFeatureParams);
        channel.log('AddFeaturesToMapRequest:', addPointFeatureParams);
    });

    it("Adds line feature", function (done) {
        handleEvent('FeatureEvent', function (data) {
            channel.log('FeatureEvent triggered:', data);
            expect(data.operation).toBe("add");
            expect(data.features[0].geojson.type).toBe(lineGeojsonObject.type);
            expect(data.features[0].geojson.features[0].geometry.type).toBe(lineGeojsonObject.features[0].geometry.type);
            expect(data.features[0].geojson.features[0].geometry.coordinates).toEqual(lineGeojsonObject.features[0].geometry.coordinates);
            counter++;
            done();
        });

        channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', addLineFeatureParams);
        channel.log('AddFeaturesToMapRequest:', addLineFeatureParams);
    });

    it("Adds polygon feature", function(done) {
        handleEvent('FeatureEvent', function(data) {
            channel.log('FeatureEvent triggered:', data);
            expect(data.operation).toBe("add");
            expect(data.features[0].geojson.type).toBe(polygonGeojsonObject.type);
            expect(data.features[0].geojson.features[0].geometry.type).toBe(polygonGeojsonObject.features[0].geometry.type);
            expect(data.features[0].geojson.features[0].geometry.coordinates).toEqual(polygonGeojsonObject.features[0].geometry.coordinates);
            counter++;
            done();
        });

        channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', addPolygonFeatureParams);
        channel.log('AddFeaturesToMapRequest:', addPolygonFeatureParams);
    });

    it("Removes specific features", function(done) {
        // AddFeaturesToMapRequest adds line and point features
        channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', addLineFeatureParams);
        channel.log('AddFeaturesToMapRequest:', addLineFeatureParams);
        channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', addPointFeatureParams);
        channel.log('AddFeaturesToMapRequest:', addPointFeatureParams);
        // Listen FeatureEvent for RemoveFeaturesFromMapRequest
        handleEvent('FeatureEvent', function(data) {
            channel.log('FeatureEvent trigggered:', data)
            expect(data.operation).toBe("remove");
            counter++;
            done();
        });
        // Remove all features which 'test_property' === 'line feature' from the layer id==='VECTOR'
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', ['test_property', lineGeojsonObject.features[0].properties.test_property, addLineFeatureParams[1].layerId]);
        channel.log('RemoveFeaturesFromMapRequest test_property:', lineGeojsonObject.features[0].properties.test_property, addLineFeatureParams[1].layerId);
    });

    it("Removes all features", function(done) {
        //annihilate everything - does not trigger featureEvent currently
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', []);
        channel.log('FeatureEvent triggered.');
        counter++;
        done();
    });

    it('Zooms to features', function(done) {
        handleEvent('FeatureEvent', function(data) {
            channel.log('FeatureEvent launched!', data);

            expect(data.operation).toEqual('zoom');
            expect(data.features).toBeDefined();

            counter++;
            done()
        })

        channel.postRequest('MapModulePlugin.ZoomToFeaturesRequest', [])
    });

    it("Gets feature info", function(done) {

        handleEvent('DataForMapLocationEvent', function (data) {
            channel.log('DataForMapLocationEvent launched!', data);
            
            expect(data.x).toEqual(defaultPosition.centerX);
            expect(data.y).toEqual(defaultPosition.centerY);
            expect(data.layerId).toEqual(queryLayerId);
            expect(data.type).toEqual(jasmine.any(String));
            expect(data.content).toBeDefined();
            // Content can be string or JSON
            //expect(data.content).toEqual(jasmine.any(String));

            channel.log('MapModulePlugin.GetFeatureInfoRequest done.');
            counter++;
            done();
        });

        // Test requires a feature layer on the map that supports info querying
        channel.postRequest('MapModulePlugin.MapLayerVisibilityRequest', [queryLayerId, true]);

        channel.postRequest('MapModulePlugin.GetFeatureInfoRequest', [defaultPosition.centerX, defaultPosition.centerY]);
    });

});

