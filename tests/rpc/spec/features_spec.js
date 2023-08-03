describe('Features', function(){

    beforeEach(function(done) {
        channel.onReady(function() {
             // Reset map and event counter.
            channel.resetState(function() {
                counter = 0;
                eventCounter = 0;
                // Get default position
                channel.getMapPosition(function(data) {
                    defaultPosition = data;
                    // update test feature coordinates
                    pointGeojsonObject.features[0]. geometry.coordinates = [defaultPosition.centerX, defaultPosition.centerY];
                    pointGeojsonObject.crs.properties.name = defaultPosition.srsName;
                    lineGeojsonObject.features[0]. geometry.coordinates = [[defaultPosition.centerX, defaultPosition.centerY], [defaultPosition.centerX + 10, defaultPosition.centerY+ 10]];
                    lineGeojsonObject.crs.properties.name = defaultPosition.srsName;
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
        // Remove features from map
        channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', []);
    });

    afterAll(function () {
        // Reset map state after spec
        channel.resetState(function () {});
    })

    describe('Add features to map', function () {

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

        it('Adds feature with WKT', function (done) {
            handleEvent('FeatureEvent', function(data) {
                channel.log('FeatureEvent triggered:', data);
                expect(data.operation).toBe("add");
                expect(data.features[0].geojson.features.length).toBe(1);
                // Geometry type in WKT string
                expect(data.features[0].geojson.features[0].geometry.type).toBe('Polygon');
                // Number of coordinate pairs in wkt string
                expect(data.features[0].geojson.features[0].geometry.coordinates[0].length).toBe(5);
                counter++;
                done();
            });

            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [WKT]);
            channel.log('AddFeaturesToMapRequest', WKT);
        });


    });


    describe('Zoom options', function () {
    /*
    * Centering to feature when adding it to the map triggers at maximum two AfterMapMoveEvents,
    * the first one is triggered when moving the map and the second one when zooming the map. 
    */
        it('Centers to feature when flag is set', function (done) {
            // Centering to feature launches event
            handleEvent('AfterMapMoveEvent', function (data) {
                channel.log('AfterMapMoveEvent launched!', data);
                expect(data.centerX).toBe(pointGeojsonObject.features[0].geometry.coordinates[0]);
                expect(data.centerY).toBe(pointGeojsonObject.features[0].geometry.coordinates[1]);
                counter++;
                done();
            });

            channel.log('Centering to feature.', addPointFeatureParams);
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', addPointFeatureParams);
            channel.log('Center to feature done.');
        });

        it('Zooms to at most to maxZoomLevel when centering', function (done) {
            // Set zoom level
            var maxZoomLevel = 5;
            var testParams = [pointGeojsonObject, {...addPointFeatureParams[1], maxZoomLevel}];

            // Centering to feature launches event
            handleEvent('AfterMapMoveEvent', function (data) {
                channel.log('AfterMapMoveEvent launched!', data);
                eventCounter++;
                
                // Track events, we are interested in the second event that occurs when zooming the map
                if (eventCounter === 2) {
                    expect(data.zoom).not.toBeGreaterThan(maxZoomLevel);
                    counter++;
                    done();
                }
            });

            channel.log('Zooming to feature', testParams);
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', testParams);
            channel.log('Zoom to feature done.');
        });

        it('Sets map scale at least to to minScale when centering', function (done) {
            // Set minimum map scale
            var minScale = 1000;
            var testParams = [pointGeojsonObject, {...addPointFeatureParams[1], minScale}];

            // Centering to feature launches event
            handleEvent('AfterMapMoveEvent', function (data) {
                channel.log('AfterMapMoveEvent launched!', data);
                eventCounter++;

                // Track events, we are interested in the second event that occurs when zooming the map
                if (eventCounter === 2) {
                    expect(data.scale).toBeGreaterThanOrEqual(minScale);
                    counter++;
                    done();
                }
            });

            channel.log('Setting map scale', testParams);
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', testParams);
            channel.log('Zoom to feature done.');
        });

        it('Zooms to features', function(done) {
            handleEvent('FeatureEvent', function(data) {
                channel.log('FeatureEvent launched!', data);
                expect(data.operation).toEqual('zoom');
                expect(data.features).toBeDefined();
                counter++;
                done();
            });

            channel.postRequest('MapModulePlugin.ZoomToFeaturesRequest', []);
            channel.log('ZoomFeaturesRequest done.');
        });

    });


    describe('Remove features from map', function () {

        it("Removes specific features", function(done) {
            // AddFeaturesToMapRequest adds line and point features
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', addLineFeatureParams);
            channel.log('AddFeaturesToMapRequest:', addLineFeatureParams);
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', addPointFeatureParams);
            channel.log('AddFeaturesToMapRequest:', addPointFeatureParams);
            // Listen FeatureEvent for RemoveFeaturesFromMapRequest
            handleEvent('FeatureEvent', function(data) {
                channel.log('FeatureEvent trigggered:', data);
                eventCounter++;
                expect(data.operation).toBe("remove");
                // Only the line string feature is removed
                expect(data.features.length).toBe(1);
                expect(data.features[0].geojson.features[0].geometry.type).toBe(lineGeojsonObject.features[0].geometry.type);
            });

            // Remove all features which 'test_property' === 'line feature' from the layer id==='VECTOR'
            channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', ['test_property', lineGeojsonObject.features[0].properties.test_property, addLineFeatureParams[1].layerId]);
            channel.log('RemoveFeaturesFromMapRequest test_property:', lineGeojsonObject.features[0].properties.test_property, addLineFeatureParams[1].layerId);
        
            // Wait for events to trigger
            setTimeout(function () {
                // Expect only 1 FeatureEvent
                if (eventCounter === 1) {
                    counter++;
                    done();
                }
            }, 1000);
        });

        it("Removes all features", function(done) {
            // AddFeaturesToMapRequest adds line and point features
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', addLineFeatureParams);
            channel.log('AddFeaturesToMapRequest:', addLineFeatureParams);
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', addPointFeatureParams);
            channel.log('AddFeaturesToMapRequest:', addPointFeatureParams);

            handleEvent('FeatureEvent', function(data) {
                channel.log('FeatureEvent trigggered:', data);
                expect(data.operation).toBe('remove');
                expect(data.features.length).toBe(1);
                eventCounter++;
            });

            // Annihilate everything - Triggers a FeatureEvent for each removed feature
            channel.postRequest('MapModulePlugin.RemoveFeaturesFromMapRequest', []);
            channel.log('FeatureEvent triggered.');

            // Wait for events to trigger
            setTimeout(function () {
                // Expect 2 FeatureEvents since 2 features were removed
                if (eventCounter === 2) {
                    counter++;
                    done();
                }
            }, 1000);
        });

    });

    describe('Get features', function() {

        beforeEach(function (done) {
            // Set up tests by adding features to the map
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', addPointFeatureParams);
            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', addLineFeatureParams);
            done();
        });

        it('Gets only layer IDs', function (done) {
            channel.getFeatures([], function (data) {
                channel.log('channel.getFeatures', data);

                expect(Object.keys(data).length).toBe(2);
                // Default feature layer
                expect(data[addLineFeatureParams[1].layerId]).toBeDefined();
                expect(data[addLineFeatureParams[1].layerId]).toEqual([]);
                // Custom feature layer specified in request parameters
                expect(data[addPointFeatureParams[1].layerId]).toBeDefined();
                expect(data[addPointFeatureParams[1].layerId]).toEqual([]);

                channel.log('Get layer IDs done.');
                counter++;
                done();
            });
        });

        it('Gets features grouped by layer', function (done) {
            channel.getFeatures([true], function (data) {
                channel.log('channel.getFeatures', data);

                // Feature objects are grouped by ID
                var pointObject = data[addPointFeatureParams[1].layerId].features[0];
                var lineObject = data[addLineFeatureParams[1].layerId].features[0];
                expect(pointObject).toBeDefined();
                expect(lineObject).toBeDefined();
                
                // Features have expected properties
                expect(pointObject.id).toBeDefined();
                expect(pointObject.geometry.type).toBe('Point');
                expect(pointObject.geometry.coordinates).toEqual(pointGeojsonObject.features[0].geometry.coordinates);
                expect(pointObject.properties.label).toBe(pointGeojsonObject.features[0].properties.label);
                expect(pointObject.properties['oskari-cursor']).toBe(addPointFeatureParams[1].cursor);
                expect(pointObject.properties.testAttribute).toBe(addPointFeatureParams[1].attributes.testAttribute);
                expect(pointObject.properties.test_property).toBe(pointGeojsonObject.features[0].properties.test_property);

                expect(lineObject.id).toBeDefined();
                expect(lineObject.geometry.type).toBe('LineString');
                expect(lineObject.geometry.coordinates).toEqual(lineGeojsonObject.features[0].geometry.coordinates);
                expect(lineObject.properties.label).toBe(lineGeojsonObject.features[0].properties.label);
                expect(lineObject.properties['oskari-cursor']).toBe(addLineFeatureParams[1].cursor);
                expect(lineObject.properties.testAttribute);
                expect(lineObject.properties.test_property).toBe(lineGeojsonObject.features[0].properties.test_property);

                channel.log('Get features done.');
                counter++;
                done();
            });
        });

    });


    describe('Add feature layers', function () {

        beforeEach(function (done) {
            // Add feature layer for tests
            channel.postRequest('VectorLayerRequest', [featureLayer]);
            done();
        });

        afterEach(function (done) {
            // Clean up
            channel.postRequest('VectorLayerRequest', [{...featureLayer.layerId, remove: true}]);
            done();
        });

        it('Adds a feature layer', function (done) {
            channel.postRequest('VectorLayerRequest', [featureLayer]);
            channel.log('Adding layer:', [featureLayer]);

            channel.getFeatures([], function (data) {
                channel.log('getFeatures:', data);
                expect(data[featureLayer.layerId]).toBeDefined();

                channel.log('Add layer done.');
                counter++;
                done();
            })
        });

        it('Removes layer', function (done) {
            channel.postRequest('VectorLayerRequest', [{layerId: featureLayer.layerId, remove: true}]);
            channel.log('Removing layer:', [{layerId: featureLayer.layerId, remove: true}]);

            channel.getFeatures([], function (data) {
                channel.log('getFeatures:', data);
                expect(data[featureLayer.layerId]).not.toBeDefined();

                channel.log('Remove layer done.');
                counter++;
                done();
            });
        });

        it('Adds features to layer', function (done) {
            var testParams = [pointGeojsonObject, {layerId: featureLayer.layerId}];

            channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', testParams);
            channel.log('Adding feature to map layer:', testParams);

            channel.getFeatures([true], function (data) {
                channel.log('getFeatures:', data);

                // Feature was added to feature layer correctly
                expect(data[featureLayer.layerId].features.length).toBe(1);
                expect(data[featureLayer.layerId].features[0].geometry.type).toBe('Point');
                expect(data[featureLayer.layerId].features[0].geometry.coordinates).toEqual(pointGeojsonObject.features[0].geometry.coordinates);

                counter++;
                done();
            });
        });

        it('Updates layer properties', function (done) {
            var testParams = {
                layerId: featureLayer.layerId,
                opacity: 100
                // Possible to add more editable properties, like hover, but some do not appear in getAllLayers data
            };

            // Update feature layer
            channel.postRequest('VectorLayerRequest', [testParams]);
            channel.log('Updating layer properties:', testParams);

            channel.getAllLayers(function (data) {
                channel.log('getAllLayers:', data);

                var editedLayer = data[data.length - 1]
                expect(editedLayer.id).toBe(featureLayer.layerId);
                expect(editedLayer.opacity).toBe(testParams.opacity);

                counter++;
                done();
            });
        });

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

    it('Appends options and properties to features', function (done) {
        handleEvent('FeatureEvent', function(data) {
            channel.log('FeatureEvent triggered:', data);
            // Layer id matches
            expect(data.features[0].layerId).toBe(addPointFeatureParams[1].layerId);
            // GeoJSON properties added
            expect(data.features[0].geojson.features[0].properties.label).toBe(pointGeojsonObject.features[0].properties.label);
            expect(data.features[0].geojson.features[0].properties.test_property).toBe(pointGeojsonObject.features[0].properties.test_property);
            // Additional options added
            expect(data.features[0].geojson.features[0].properties.testAttribute).toBe(addPointFeatureParams[1].attributes.testAttribute);
            expect(data.features[0].geojson.features[0].properties["oskari-cursor"]).toBe(addPointFeatureParams[1].cursor);
            counter++;
            done();
        });

        channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', addPointFeatureParams);
        channel.log('AddFeaturesToMapRequest:', addPointFeatureParams);
    });

});

