describe('Test Suite for statistics/statsgrid manage stats plugin', function() {
    var appSetup = null,
        appConf = null,
        sandbox = null,
        plugin = null,
        lang = 'en',
        gridContainer = jQuery('<div id="testGrid"></div>');

    before(function() {

        appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull', 'divmanazer', 'toolbar', 'statsgrid']);

        var mapfullConf = getConfigForMapfull();

        // overwrite test wide appConf
        appConf = {
            "mapfull": mapfullConf,
            "toolbar": {
                conf: {}
            }
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
            Oskari.setLang(lang);
            // Find handles to sandbox and create the stats plugin.
            sandbox = Oskari.getSandbox();
            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            var statsService = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.StatisticsService', {sandbox: sandbox});
            sandbox.registerService(statsService);

            var locale = sandbox.findRegisteredModuleInstance('StatsGrid').getLocalization();
            plugin = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.plugin.ManageStatsPlugin', null, locale);
            mapModule.registerPlugin(plugin);
            mapModule.startPlugin(plugin);

            done();
        });
    };

    describe('UNIT TEST: statistics plugin', function() {
        // Region and indicator data for testing that functions get called with this as a param.
        var testData = ["zebra", "peacock", "hummingbird", "chameleon"];
        var testGridData = [
            {'category': 'KUNTA', 'id': 808, 'code': '091', 'title': {'en': 'TR-808'}},
            {'category': 'KUNTA', 'id': 303, 'code': '019', 'title': {'en': 'TB-303'}}
        ];
        var startState, startPublished, startIndicators, startLayer;

        before(function(done) {
            startApplication(function() {
                startState = plugin._state;
                startPublished = plugin._published;
                startIndicators = plugin.indicators;
                startLayer = plugin._layer;
                done();
            });
        });

        after(teardown);

        afterEach(function() {
            gridContainer.empty();
            plugin._state = startState;
            plugin._published = startPublished;
            plugin.indicators = startIndicators;
            plugin._layer = startLayer;
        });

        it('should be defined', function() {
            expect(plugin).to.be.ok();
            expect(plugin.statsService).to.be.ok();
        });

        it('should prepare indicators when creating stats', function() {
            var stub = sinon.stub(plugin, 'prepareIndicatorParams');
            // call tested function
            plugin.createStatsOut(gridContainer);
            // asserts
            expect(stub.callCount).to.be(1);
            // cleanup
            stub.restore();
        });

        it('should call to get both sotka indicators and data if not in published map mode', function() {
            var indicatorStub = sinon.stub(plugin, 'getSotkaIndicators');
            var regionStub = sinon.stub(plugin, 'getSotkaRegionData');
            // call tested function
            plugin.prepareIndicatorParams(gridContainer);
            // asserts
            expect(indicatorStub.callCount).to.be(1);
            expect(regionStub.callCount).to.be(1);
            expect(gridContainer.find('.selectors-container').length).to.be(1);
            // cleanup
            indicatorStub.restore();
            regionStub.restore();
        });

        it('should call to get only sotka data if in published map mode', function() {
            var indicatorStub = sinon.stub(plugin, 'getSotkaIndicators');
            var regionStub = sinon.stub(plugin, 'getSotkaRegionData');
            plugin._published = true;
            // call tested function
            plugin.prepareIndicatorParams(gridContainer);
            // asserts
            expect(indicatorStub.callCount).to.be(0);
            expect(regionStub.callCount).to.be(1);
            expect(gridContainer.find('.selectors-container').length).to.be(0);
            // cleanup
            indicatorStub.restore();
            regionStub.restore();
        });

        it('should fetch sotka region data', function() {
            var testState = plugin._state = {'state': 1};
            var statsServiceStub = sinon.stub(plugin.statsService, 'fetchStatsData', function(url, sCb, eCb) {
                sCb(testData);
            });
            var gridStub = sinon.stub(plugin, 'createMunicipalitySlickGrid');
            var stateStub = sinon.stub(plugin, 'loadStateIndicators');
            // call tested function
            plugin.getSotkaRegionData(gridContainer);
            // asserts
            expect(statsServiceStub.callCount).to.be(1);
            expect(gridStub.callCount).to.be(1);
            expect(gridStub.calledWith(gridContainer, testData)).to.be(true);
            expect(stateStub.callCount).to.be(1);
            expect(stateStub.calledWith(testState, gridContainer)).to.be(true);
            // cleanup
            statsServiceStub.restore();
            gridStub.restore();
            stateStub.restore();
        });

        it('should create the grid', function() {
            // call tested function
            plugin.createMunicipalitySlickGrid(gridContainer, testGridData);
            // asserts
            expect(gridContainer.find('#municipalGrid').length).to.be(1);
            expect(plugin.grid).to.be.ok();
        });

        it('should fetch sotka indicators data', function() {
            var statsServiceStub = sinon.stub(plugin.statsService, 'fetchStatsData', function(url, sCb, eCb) {
                sCb(testData);
            });
            var indicatorStub = sinon.stub(plugin, 'createIndicatorsSelect');
            // call tested function
            plugin.getSotkaIndicators(gridContainer);
            // asserts
            expect(statsServiceStub.callCount).to.be(1);
            expect(indicatorStub.callCount).to.be(1);
            expect(indicatorStub.calledWith(gridContainer, testData));
            // cleanup
            statsServiceStub.restore();
            indicatorStub.restore();
        });

        // Something's wrong with chosen.
        // It gives an error: "Cannot set property 'disabled' of undefined"
        // UPDATE:
        // Fixed /Oskari/libraries/chosen/chosen.jquery.js:374
        // --- this.container = $('#' + this.container_id);
        // +++ this.container = container_div;
        it('should create the indicators selection ui', function() {
            var selContainer = jQuery('<div class="selectors-container"></div>');
            gridContainer.append(selContainer);
            var indicData = [
                {'id': 42, 'title': {'en': 'The Answer'}},
                {'id': 666, 'title': {'en': 'Satanic rituals'}}
            ];
            var indicatorMetaStub = sinon.stub(plugin, 'getSotkaIndicatorMeta');
            // call tested function
            plugin.createIndicatorsSelect(gridContainer, indicData);
            // asserts
            expect(gridContainer.find('.selectors-container').find('.indicator-cont').length).to.be(1);
            // cleanup
            indicatorMetaStub.restore();
        });

        it('should fetch sotka indicators meta data', function() {
            var indicatorMeta = 'lulz';
            var statsServiceStub = sinon.stub(plugin.statsService, 'fetchStatsData', function(url, sCb, eCb) {
                sCb(indicatorMeta);
            });
            var indicatorInfoStub = sinon.stub(plugin, 'createIndicatorInfoButton');
            var indicatorDemographicStub = sinon.stub(plugin, 'createDemographicsSelects');
            // call tested function
            plugin.getSotkaIndicatorMeta(gridContainer, 'foo');
            // asserts
            expect(statsServiceStub.callCount).to.be(1);
            expect(indicatorInfoStub.callCount).to.be(1);
            expect(indicatorInfoStub.calledWith(gridContainer, indicatorMeta));
            expect(indicatorDemographicStub.callCount).to.be(1);
            expect(indicatorDemographicStub.calledWith(gridContainer, indicatorMeta)).to.be(true);
            // cleanup
            statsServiceStub.restore();
            indicatorInfoStub.restore();
            indicatorDemographicStub.restore();
        });

        it('should create indicator info button', function() {
            gridContainer.append(jQuery('<div class="indicator-cont"></div>'));
            var testIndicator = {
                'title': {'en': 'Terminators are coming'},
                'description': {'en': 'Creating SkyNet'},
                'organization': {
                    'title': {'en': 'Cyberdyne Systems Inc.'}
                }
            };
            var clickedStub = sinon.stub(plugin, 'showMessage');
            var infoIcon;
            // call tested function
            plugin.createIndicatorInfoButton(gridContainer, testIndicator);
            infoIcon = gridContainer.find('.indicator-cont').find('.icon-info');
            infoIcon.click();
            // asserts
            expect(infoIcon.length).to.be(1);
            expect(clickedStub.callCount).to.be(1);
            // cleanup
            clickedStub.restore();
        });

        it('should create the demographics selection ui', function() {
            var selContainer = jQuery('<div class="selectors-container"></div>');
            var testIndicator = {
                'range': {'start': 2000, 'end': 2009},
                'classifications': {
                    'sex': {'values': ['male', 'female', 'total']}
                },
                'id': 666
            };
            var fetchButton, removeButton;
            var fetchStub = sinon.stub(plugin, 'getSotkaIndicatorData');
            var removeStub = sinon.stub(plugin, 'removeIndicatorDataFromGrid');
            gridContainer.append(selContainer);
            // call tested function
            plugin.createDemographicsSelects(gridContainer, testIndicator);
            fetchButton = selContainer.find('.fetch-data');
            removeButton = selContainer.find('.remove-data');
            // asserts
            fetchButton.click();
            expect(fetchStub.callCount).to.be(1);
            removeButton.click();
            expect(removeStub.callCount).to.be(1);
            // cleanup
            fetchStub.restore();
            removeStub.restore();
        });

        it('should get data for one indicator and add it to state and grid', function() {
            plugin.indicators = [testData];
            plugin._state = {};
            var statsServiceStub = sinon.stub(plugin.statsService, 'fetchStatsData', function(url, sCb, eCb) {
                sCb(testData);
            });
            var toGridStub = sinon.stub(plugin, 'addIndicatorDataToGrid');
            var testIndicatorId = 303;
            var testGender = 'male';
            var testYear = 1997;

            // call tested function
            plugin.getSotkaIndicatorData(gridContainer, testIndicatorId, testGender, testYear);
            // asserts
            expect(statsServiceStub.callCount).to.be(1);
            expect(toGridStub.callCount).to.be(1);
            expect(toGridStub.calledWith(gridContainer, testIndicatorId, testGender, testYear, testData, testData));
            expect(plugin._state.indicators.length).to.be(1);
            // cleanup
            statsServiceStub.restore();
            toGridStub.restore();
        });

        it('should get unique column id for indicator', function() {
            var testIndicators = [
                {'id': 1, 'gender': 'male', 'year': 2000},
                {'id': 1, 'gender': 'male', 'year': 2000},
                {'id': 1, 'gender': 'male', 'year': 2001},
                {'id': 1, 'gender': 'female', 'year': 2000},
                {'id': 2, 'gender': 'male', 'year': 2000}
            ];
            var columnIds = [];
            // call tested function
            for (var i = 0; i < testIndicators.length; ++i) {
                var ind = testIndicators[i];
                var colId = plugin._getIndicatorColumnId(ind.id, ind.gender, ind.year);
                columnIds.push(colId);
            }
            // asserts
            expect(columnIds[0]).to.be(columnIds[1]); // The first two are the same.
            expect(columnIds[0]).not.to.be(columnIds[2]); // different 'year'
            expect(columnIds[0]).not.to.be(columnIds[3]); // different 'gender'
            expect(columnIds[0]).not.to.be(columnIds[4]); // different 'id'
        });

        it('should add an indicator to grid', function() {
            var indicatorId = 303,
                gender = 'total',
                year = 2000,
                data = {'primary value': 808.666},
                meta = {'title': {'en': 'Bohemian Rhapsody'}},
                silent = true,
                demographicsStub = sinon.stub(plugin, 'updateDemographicsButtons'),
                origColumnCount,
                newColumnCount;

            plugin.createMunicipalitySlickGrid(gridContainer, testGridData);
            origColumnCount = plugin.grid.getColumns().length;
            // call tested function
            plugin.addIndicatorDataToGrid(gridContainer, indicatorId, gender, year, data, meta, silent);
            newColumnCount = plugin.grid.getColumns().length;
            // asserts
            expect(origColumnCount + 1).to.be(newColumnCount);
            expect(demographicsStub.callCount).to.be(1);
            // cleanup
            demographicsStub.restore();
        });

        it('should remove an indicator from the grid', function() {
            var indicatorId = 303,
                gender = 'total',
                year = 2000,
                demographicsStub = sinon.stub(plugin, 'updateDemographicsButtons'),
                origColumnCount = plugin.grid.getColumns().length,
                newColumnCount;

            // call tested function
            plugin.removeIndicatorDataFromGrid(indicatorId, gender, year);
            newColumnCount = plugin.grid.getColumns().length;
            // asserts
            expect(origColumnCount - 1).to.be(newColumnCount);
            // cleanup
            demographicsStub.restore();
        });

        it('should create year selection ui', function() {
            var yearSelector;
            var startYear = 2000;
            var endYear = 2009;
            var demographicsStub = sinon.stub(plugin, 'updateDemographicsButtons');
            // call tested function
            yearSelector = plugin.getYearSelectorHTML(startYear, endYear);
            yearSelector.find('select').change();
            // asserts
            expect(yearSelector.find('option').length).to.be(10);
            expect(demographicsStub.callCount).to.be(1);
            // cleanup
            demographicsStub.restore();
        });

        it('should create the gender selection ui', function() {
            var genderSelector;
            var genderValues = ['male', 'female', 'total'];
            var demographicsStub = sinon.stub(plugin, 'updateDemographicsButtons');
            // call tested function
            genderSelector = plugin.getGenderSelectorHTML(genderValues);
            genderSelector.find('select').change();
            // asserts
            expect(genderSelector.find('option').length).to.be(genderValues.length);
            expect(demographicsStub.callCount).to.be(1);
            // cleanup
            demographicsStub.restore();
        });

        it('should send stats data', function() {
            plugin._state = {};
            var testLayer = {
                getWmsName: function() { return 'WmsName'; },
                getFilterPropertyName: function() { return 'testFilter'; }
            };
            plugin._layer = testLayer;
            var testColumn = {
                'field': 'corn_field',
                'id': 10
            };
            var statsServiceStub = sinon.stub(plugin.statsService, 'sendStatsData');
            var dataViewStub = sinon.stub(plugin.dataView, 'getItems', function() {
                return [{
                    'corn_field': 'Secret code',
                    'code': '0110101101010101'
                }];
            });
            var layerVisibilityStub = sinon.stub(plugin, '_setLayerVisibility');
            // call tested function
            plugin.sendStatsData(testColumn);
            // asserts
            expect(statsServiceStub.callCount).to.be(1);
            expect(statsServiceStub.calledWith(testLayer, {
                CUR_COL: testColumn,
                VIS_NAME: 'WmsName',
                VIS_ATTR: 'testFilter',
                VIS_CODES: ['0110101101010101'],
                COL_VALUES: ['Secret code']
            }));
            expect(layerVisibilityStub.callCount).to.be(1);
            // cleanup
            statsServiceStub.restore();
            dataViewStub.restore();
            layerVisibilityStub.restore();
        });

        it('should fetch sotka metadata for given indicators', function() {
            var testMetadata = [{'id': 1}, {'id': 2}];
            var testIndicators = [{'indicator': 1}, {'indicator': 2}];
            var testCb = sinon.spy();
            var i = 0;
            var metadataStub = sinon.stub(plugin.statsService, 'fetchStatsData', function(url, sCb, fCb) {
                sCb(testMetadata[i]);
                i++;
            });
            // call tested function
            plugin.getSotkaIndicatorsMeta(gridContainer, testIndicators, testCb);
            // asserts
            expect(metadataStub.callCount).to.be(testIndicators.length);
            expect(plugin.indicators.length).to.be(testIndicators.length);
            for (i = 0; i < plugin.indicators.length; ++i) {
                expect(plugin.indicators[i]).to.be(testMetadata[i]);
            }
            expect(testCb.callCount).to.be(1);
            // cleanup
            metadataStub.restore();
        });

        it('should fetch sotka data for given indicators', function() {
            var testIndicators = [
                {'indicator': 1, 'year': 1999, 'gender': 'male'},
                {'indicator': 2, 'year': 2999, 'gender': 'female'}
            ];
            var testReturnData = [
                [{'indicator': 1, 'year': 1999, 'gender': 'male'}],
                [{'indicator': 2, 'year': 2999, 'gender': 'female'}]
            ];
            var testCb = sinon.spy();
            var i = 0;
            var dataStub = sinon.stub(plugin.statsService, 'fetchStatsData', function(url, sCb, fCb) {
                sCb(testReturnData[i]);
                i++;
            });
            var addIndicatorStub = sinon.stub(plugin, 'addIndicatorDataToGrid');
            // call tested function
            plugin.getSotkaIndicatorsData(gridContainer, testIndicators, testCb);
            // asserts
            expect(dataStub.callCount).to.be(testIndicators.length);
            expect(addIndicatorStub.callCount).to.be(testIndicators.length);
            for (i = 0; i < testIndicators.length; ++i) {
                var ind = testIndicators[i];
                expect(addIndicatorStub.calledWith(
                    gridContainer, ind.indicator, ind.gender, ind.year, testReturnData[i], plugin.indicators[i], true
                )).to.be(true);
            }
            expect(testCb.callCount).to.be(1);
            // cleanup
            dataStub.restore();
            addIndicatorStub.restore();
        });

        it('should load indicators from a given state', function() {
            var testIndicators = [
                {'id': 1},
                {'id': 2}
            ];
            var testState = {
                'indicators': testIndicators,
                'currentColumn': '',
                'manualBreaksInput': '',
                'methodId': 1,
                'numberOfClasses': 5
            };
            var getMetaStub = sinon.stub(plugin, 'getSotkaIndicatorsMeta', function(cont, indicators, cb) {
                cb();
            });
            var getDataStub = sinon.stub(plugin, 'getSotkaIndicatorsData', function(cont, indicators, cb) {
                cb();
            });
            // call tested function
            plugin.loadStateIndicators(testState, gridContainer);
            // asserts
            expect(getMetaStub.callCount).to.be(1);
            expect(getMetaStub.calledWith(gridContainer, testState.indicators)).to.be.ok();
            expect(getDataStub.callCount).to.be(1);
            expect(getDataStub.calledWith(gridContainer, testState.indicators)).to.be.ok();
            // cleanup
            getMetaStub.restore();
            getDataStub.restore();
        });
    });
});