describe.only('Test Suite for statistics/statsgrid manage stats plugin', function() {
    var appSetup = null,
        appConf = null,
        statsModule = null,
        sandbox = null,
        plugin = null,
        gridContainer = null;

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
            // Find handles to sandbox and stats bundle.
            sandbox = Oskari.getSandbox();
            statsModule = sandbox.findRegisteredModuleInstance('StatsGrid');
            plugin = statsModule.gridPlugin;
            gridContainer = jQuery('<div id="testGrid"></div>');

            done();
        });
    };

    describe('statistics plugin', function() {
        // Region and indicator data for testing that functions get called with this as a param.
        var testData = ["zebra", "peacock", "hummingbird", "chameleon"];

        before(startApplication);

        after(teardown);

        afterEach(function() {
            gridContainer.empty();
        });

        it('should be defined', function() {
            expect(plugin).to.be.ok();
            expect(plugin.statsService).to.be.ok();
        });

        it('should prepare indicators when creating stats', function() {
            var stub = sinon.stub(plugin, 'prepareIndicatorParams');
            plugin.createStatsOut(gridContainer);
            expect(stub.callCount).to.be(1);
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
            var prevPublished = plugin._published;
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
            plugin._published = prevPublished;
        });

        it('should fetch sotka region data', function() {
            var prevState = plugin._state;
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
            expect(stateStub.calledWith(gridContainer, testState)).to.be(true);
            // cleanup
            statsServiceStub.restore();
            gridStub.restore();
            stateStub.restore();
            plugin._state = prevState;
        });

        it('should create the grid', function() {
            var prevLang = Oskari.getLang();
            Oskari.setLang('en');
            var testGridData = [
                {'category': 'KUNTA', 'id': 808, 'code': '091', 'title': {'en': 'TR-808'}},
                {'category': 'KUNTA', 'id': 303, 'code': '019', 'title': {'en': 'TB-303'}}
            ];
            // call tested function
            plugin.createMunicipalitySlickGrid(gridContainer, testGridData);
            // asserts
            expect(gridContainer.find('#municipalGrid').length).to.be(1);
            expect(plugin.grid).to.be.ok();
            // cleanup
            Oskari.setLang(prevLang);
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
        it.skip('should create the indicators selection', function() {
            var selContainer = jQuery('<div class="selectors-container"></div>');
            gridContainer.append(selContainer);
            var prevLang = Oskari.getLang();
            Oskari.setLang('en');
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
            Oskari.setLang(prevLang);
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
            var prevLang = Oskari.getLang();
            Oskari.setLang('en');
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
            Oskari.setLang(prevLang);
            clickedStub.restore();
        });

        it.skip('should create the demographics selection', function() {
            // TBI
        });

        it('should get data for one indicator and add it to state and grid', function() {
            var prevState = plugin._state;
            var prevIndicators = plugin.indicators;
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
            plugin._state = prevState;
            plugin.indicators = prevIndicators;
            statsServiceStub.restore();
            toGridStub.restore();
        });

        it('should add indicator data to grid', function() {

        });
    });
});