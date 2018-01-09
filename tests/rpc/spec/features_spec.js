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

    it("Adds point feature", function(done) {
        handleEvent('FeatureEvent', function(data) {
            channel.log('FeatureEvent triggered:', data);
            expect(data.operation).toBe("add");
            expect(data.features[0].geojson.type).toBe(pointGeojsonObject.type);
            expect(data.features[0].geojson.features[0].geometry.coordinates[0]).toBe(pointGeojsonObject.features[0].geometry.coordinates[0]);
            expect(data.features[0].geojson.features[0].geometry.coordinates[1]).toBe(pointGeojsonObject.features[0].geometry.coordinates[1]);
            counter++;
            done();
        });
        channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', addPointFeatureParams);
        channel.log('AddFeaturesToMapRequest:', addPointFeatureParams);
    });

    it("Adds line feature", function(done) {
        handleEvent('FeatureEvent', function(data) {
            channel.log('FeatureEvent triggered:', data);
            expect(data.operation).toBe("add");
            expect(data.features[0].geojson.type).toBe(lineGeojsonObject.type);
            expect(data.features[0].geojson.features[0].geometry.type).toBe(lineGeojsonObject.features[0].geometry.type);
            expect(data.features[0].geojson.features[0].geometry.coordinates[0][0]).toBe(lineGeojsonObject.features[0].geometry.coordinates[0][0]);
            expect(data.features[0].geojson.features[0].geometry.coordinates[0][1]).toBe(lineGeojsonObject.features[0].geometry.coordinates[0][1]);
            expect(data.features[0].geojson.features[0].geometry.coordinates[1][0]).toBe(lineGeojsonObject.features[0].geometry.coordinates[1][0]);
            expect(data.features[0].geojson.features[0].geometry.coordinates[1][1]).toBe(lineGeojsonObject.features[0].geometry.coordinates[1][1]);
            counter++;
            done();
        });
        channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', addLineFeatureParams);
        channel.log('AddFeaturesToMapRequest:', addLineFeatureParams);
    });

    it("Removes specific features", function(done) {
        // AddFeaturesToMapRequest adds line and point feautures
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

    it("Gets feature info", function(done) {
        //requires feature layer to show popup
        channel.postRequest('MapModulePlugin.GetFeatureInfoRequest', [defaultPosition.centerX, defaultPosition.centerY]);
        channel.log('MapModulePlugin.GetFeatureInfoRequest done.');
        counter++;
        done();
    });

});

