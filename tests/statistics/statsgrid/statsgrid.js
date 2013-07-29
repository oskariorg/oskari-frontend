describe('Test Suite for statistics/statsgrid bundle', function() {
    var appSetup = null,
        appConf = null,
        statsModule = null,
        sandbox = null,
        testLayer = null,
        viewPlugin = null,
        menuToolbar = null,
        statsGridContainer = null;

    var testLayerId = 276;

    before(function() {

        appSetup = getStartupSequence([
            'openlayers-default-theme',
            'mapfull',
            'divmanazer',
            'toolbar',
            'statsgrid',
            'printout'
        ]);

        var mapfullConf = getConfigForMapfull();
        mapfullConf.conf.layers.push({
            "id": testLayerId,
            "type": "statslayer",
            "wmsName": "ows:kunnat2013",
            "wmsUrl": "http://nipsuke01.nls.fi:8080/geoserver/ows/wms",
            "maxScale": 1,
            "minScale": 10000000,
            "name": "tilasto testi fi",
            "inspire": "Aluesuunnittelu ja rajoitukset",
            "orgName": "Metsäntutkimuslaitos"
        });

        // overwrite test wide appConf
        appConf = {
            "mapfull": mapfullConf,
            "toolbar": {
                "state": {

                },
                "conf": {
                    "history": false,
                    "basictools": false,
                    "viewtools": false
                }
            },
        };
    });

    function startApplication(done, setup, conf) {
        if(!setup) {
            // clone original settings
            setup = jQuery.extend(true, {}, appSetup);
        }
        if(!conf) {
            // clone original settings
            conf = jQuery.extend(true, {}, appConf);
        }

        //setup HTML
        jQuery("body").html(getDefaultHTML());
        // startup Oskari
        setupOskari(setup, conf, function() {
            // Find handles to sandbox and stats bundle.
            sandbox = Oskari.getSandbox(),
            statsModule = sandbox.findRegisteredModuleInstance('StatsGrid'),
            testLayer = sandbox.findMapLayerFromAllAvailable(testLayerId),
            viewPlugin = statsModule.gridPlugin;
            done();
        });
    };

    describe('initialization', function() {
        before(startApplication);

        after(teardown);

        it('should be defined', function() {
            expect(sandbox).to.be.ok();
            expect(statsModule).to.be.ok();
            expect(viewPlugin).to.be.ok();
        });
    });

    describe.only('grid mode', function() {
        before(function(done) {
            startApplication(function() {
                sandbox.postRequestByName('AddMapLayerRequest', [testLayerId, true]);
                setTimeout(function() {
                    done();
                }, 1000);
            });
        });

        after(teardown);

        it('should go to the mode view from the map view', function(done) {
            var fetchCallbackGridSpy = sinon.spy(viewPlugin, 'createMunicipalitySlickGrid'),
                fetchCallbackIndicatorSpy = sinon.spy(viewPlugin, 'createIndicatorsSelect');

            expect(testLayer).to.be.ok();
            expect(viewPlugin).to.be.ok();
            expect(fetchCallbackGridSpy.callCount).to.be(0);
            expect(fetchCallbackIndicatorSpy.callCount).to.be(0);

            sandbox.postRequestByName('StatsGrid.StatsGridRequest', [true, testLayer]);
            var i = 0;

            waitsFor(function() {
                return ((fetchCallbackGridSpy.callCount > 0) &&
                        (fetchCallbackIndicatorSpy.callCount > 0));
            }, function() {
                menuToolbar = jQuery('body').find('div.oskariui-menutoolbar'),
                statsGridContainer = jQuery('body').find('.statsgrid_100');

                expect(fetchCallbackGridSpy.callCount).to.be(1);
                expect(fetchCallbackIndicatorSpy.callCount).to.be(1);
                expect(menuToolbar.is(':visible')).to.be(true);
                expect(statsGridContainer.is(':visible')).to.be(true);

                fetchCallbackGridSpy.restore();
                fetchCallbackIndicatorSpy.restore();
                done();
            }, "Waits for the stats grid mode request", 45000);
        });

        it('should exclude null values from the sent data', function(done) {
            var gridPlugin = statsModule.gridPlugin;
            var statsView = statsModule.plugins['Oskari.userinterface.View'];

            // faking to be module with getName/onEvent methods
            var self = this;
            self.getName = function() {
                return "Test.StatsGrid";
            }
            self.onEvent = function(event) {
                var hasNulls = false;
                var params = event.getParams();
                var colValues = params.COL_VALUES;

                for (var i = 0; i < colValues.length; ++i) {
                    if(colValues[i] == null) {
                        hasNulls = true;
                    }
                }

                expect(hasNulls).to.be(false);

                // cleanup
                sandbox.unregisterFromEventByName(self, 'StatsGrid.SotkadataChangedEvent');
                sandbox._listeners = prevListeners;
                done();
            }

            // Clear out other event listeners.
            var prevListeners = sandbox._listeners;
            sandbox._listeners = {};
            // listen to StatsGrid.SotkadataChangedEvent to trigger verification
            sandbox.registerForEventByName(self, 'StatsGrid.SotkadataChangedEvent');

            // Required by gridPlugin#addIndicatorDataToGrid
            gridPlugin.indicators.push({
                'title': {
                    'fi': "Test indicator meta"
                }
            });
            // TODO: create a stub so that we test the interface and not the server
            gridPlugin.getSotkaIndicatorData(statsView.getEl(), 4, 'total', 2011);
        });

        it('should send parameters to printout bundle', function(done) {
            var self = this;

            self.getName = function() {
                return "Test.StatsGrid._createPrintParams";
            };
            self.onEvent = function(event) {
                var eventLayer = event.getLayer();
                var eventData = event.getTileData();

                expect(eventLayer).to.be.ok();
                expect(eventData.length).to.be(1);
                expect(eventData[0].bbox).to.be.ok();
                expect(eventData[0].url).to.be.ok();

                sandbox.unregisterFromEventByName(self, 'Printout.PrintableContentEvent');
                sandbox._listeners = prevListeners;
                done();
            };

            var prevListeners = sandbox._listeners;
            sandbox._listeners = {};
            sandbox.registerForEventByName(self, 'Printout.PrintableContentEvent');

            statsModule._createPrintParams(testLayer);
        });

        it.skip('should add checkbox column when statsgrid-show-row-selects checkbox is clicked', function(done) {
            var fetchCallbackGridSpy = sinon.spy(viewPlugin, 'createMunicipalitySlickGrid'),
                fetchCallbackIndicatorSpy = sinon.spy(viewPlugin, 'createIndicatorsSelect');

            sandbox.postRequestByName('StatsGrid.StatsGridRequest', [true, testLayer]);
            var i = 0;

            waitsFor(function() {
                return ((fetchCallbackGridSpy.callCount > 0) &&
                        (fetchCallbackIndicatorSpy.callCount > 0));
            }, function() {
                menuToolbar = jQuery('body').find('div.oskariui-menutoolbar'),
                statsGridContainer = jQuery('body').find('.statsgrid_100');

                expect(statsGridContainer.is(':visible')).to.be(true);

                //open drop down for statistical variable selector
                jQuery('.slick-header-menubutton:first').click();
                expect(jQuery('.slick-header-menu').css('visibility')).to.be('visible');

                //uncheck one of the municipalities and check if the name of the first group changes
                expect(jQuery('.slick-group-title:first').text()).to.contain('Kunnat');
                jQuery('.slick-cell-checkboxsel > input').first().prop('checked', false).click();
                expect(jQuery('.slick-group-title:first').text()).to.contain('Poistettu');

                fetchCallbackGridSpy.restore();
                fetchCallbackIndicatorSpy.restore();
                done();
            }, "Waits for the stats grid mode request", 45000);
        });

        // This test expects Test indicator metadata to be fetched
        it('should filter column data', function() {
            menuToolbar = jQuery('body').find('div.oskariui-menutoolbar'),
            statsGridContainer = jQuery('body').find('.statsgrid_100');

            expect(statsGridContainer.is(':visible')).to.be(true);

            //open drop down for statistical variable selector
            jQuery('.slick-header-menubutton:eq(1)').click();

            var items = jQuery('.slick-header-menuitem a');
            for (var i = 0; i < items.length; i++) {
                var item = jQuery(items[i]);
                if(item.text() == 'Suodata') {
                    item.click();
                }

            };

            expect(jQuery('.divmanazerpopup h3').text()).to.be('Suodata sarakkeen arvoja');

            jQuery('.filter-select').prop('selectedIndex', 2);
            jQuery('.filter-input1').val(10);
            jQuery('.divmanazerpopup input.primary').click();

            var gridPlugin = statsModule.gridPlugin;
            var filterSuccess = false;
            var groups = gridPlugin.grid.getData().getGroups();
            var filteredMunicipalitiesCount = 0;
            for (var i = 0; i < groups.length; i++) {
                var group = groups[i];
                if(group.groupingKey == 'checked') {
                    filterSuccess = true;
                    var rows = group.rows;
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        if(row['indicator42011total'] < 10) {
                            filterSuccess = false;
                            break;
                        } else {
                            filteredMunicipalitiesCount++;
                        }
                    };
                    break;        
                }
            };

            expect(filterSuccess).to.be(true);
            expect(statsModule.getState().municipalities.length).to.be(filteredMunicipalitiesCount); 
        });



        // OBS! This should be the last test case since we're removing the layer.
        it('should exit the mode when a statistics layer gets removed', function(done) {
            var statsView = statsModule.plugins['Oskari.userinterface.View'];
            var removeLayerSpy = sinon.spy(statsModule, '_afterMapLayerRemoveEvent');
            var exitModeSpy = sinon.spy(statsView, 'prepareMode');

            // Remove the layer
            var builder = sandbox.getRequestBuilder('RemoveMapLayerRequest');
            var request = builder(testLayerId);
            sandbox.request(statsModule, request);

            setTimeout(function() {
                expect(removeLayerSpy.callCount).to.be(1);
                expect(exitModeSpy.callCount).to.be.greaterThan(0);
                expect(exitModeSpy.calledWith(false)).to.be.ok();

                removeLayerSpy.restore();
                exitModeSpy.restore();
                done();
            }, 1000);
        });

    });

// TODO write test to:
// open up statsgrid, then select an indicator
// add another indicator
// and change indicator order by clicking header
// remove indicator to verify delete works
});
