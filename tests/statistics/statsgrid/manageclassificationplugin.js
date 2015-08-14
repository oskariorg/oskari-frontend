describe('Test Suite for statistics/statsgrid manage classification plugin', function() {
    var appSetup = null,
        appConf = null,
        sandbox = null,
        plugin = null,
        mapDiv;

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
            // Find handles to sandbox, stats bundle and classification plugin.
            sandbox = Oskari.getSandbox();

            var statsGrid = sandbox.findRegisteredModuleInstance('StatsGrid');
            plugin = statsGrid.classifyPlugin;

            var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            mapDiv = jQuery(mapModule.getMap().div);

            done();
        });
    };

    describe('classification plugin', function() {
        before(startApplication);

        after(teardown);

        it('should be defined', function() {
            expect(plugin).to.be.ok();
            expect(plugin.statsService).to.be.ok();
        });

        it('should have ui created', function() {
            var container = mapDiv.find('.manageClassificationPlugin');
            expect(container.length).to.be(1);
            expect(container.find('.classificationMethod').length).to.be(1);
            expect(container.find('.classCount').length).to.be(1);
        });

        it('should classify data', function() {
            var testLayer = 'thisOnlyNeedsToBeTruthful',
                testParams = {
                    'CUR_COL': 'foobar',
                    'COL_VALUES': [1.0, 2.3, 2.6, 3.6, 3.9, 6.0, 6.9, 8.3, 8.5, 8.6],
                    'VIS_CODES': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    'VIS_NAME': 'name',
                    'VIS_ATTR': 'attr'
                },
                visualizationStub = sinon.stub(plugin.statsService, 'sendVisualizationData'),
                getColorsStub = sinon.stub(plugin, '_getColors', function() {
                    return 'fff,eee,ddd,ccc,bbb';
                });

            plugin.element.find('.classificationMethod').find('.method').val('2');
            plugin.element.find('.classificationMethod').find('.classCount').find('#amount_class').val('5');
            plugin.element.find('.manualBreaks').find('input[name=breaksInput]').val();

            plugin._layer = testLayer;
            plugin._params = testParams;
            plugin.currentColorSet = 'seq';
            plugin.colorsetIndex = 0;
            plugin.colorsFlipped = false;

            // call tested function
            plugin.classifyData();
            // asserts
            expect(visualizationStub.callCount).to.be(1);
            expect(visualizationStub.calledWith(testLayer, {
                methodId: '2',
                numberOfClasses: 5,
                manualBreaksInput: '',
                colors: {
                    set: 'seq',
                    index: 0,
                    flipped: false
                },
                VIS_ID: -1,
                VIS_NAME: testParams.VIS_NAME,
                VIS_ATTR: testParams.VIS_ATTR,
                VIS_CLASSES: '1,2,3|4,5|6,7|8,9|10',
                VIS_COLORS: 'choro:fff|eee|ddd|ccc|bbb'
            })).to.be.ok();
            // cleanup
            visualizationStub.restore();
            getColorsStub.restore();
        });

        it('should set colors', function() {
            plugin.colorsets_div = null;
            plugin.colorsets_seq = null;
            plugin.colorsets_qual = null;

            plugin.setColors();

            expect(plugin.colorsets_div.length).to.be.greaterThan(0);
            expect(plugin.colorsets_seq.length).to.be.greaterThan(0);
            expect(plugin.colorsets_qual.length).to.be.greaterThan(0);
        });

        it('should set manual breaks', function() {
            var testData = [1.0, 2.3, 2.6, 3.6, 3.9, 6.0, 6.9, 8.3, 8.5, 8.6, 9.0, 9.5, 9.7];
            var gstats = new geostats(testData);
            var limits;

            jQuery('body').find('.classificationMethod').find('.method').val('4');
            jQuery('body').find('.classificationMethod').find('.manualBreaks').find('input')
                .val('1.0, 2.6, 6.0, 8.5');

            limits = plugin.setManualBreaks(gstats);

            expect(limits.length).to.be(4);
            expect(isNaN(limits[0])).to.be(false);
            expect(limits[0]).to.be(1.0);
            expect(gstats.ranges.join(',')).to.be('1 - 2.6,2.6 - 6,6 - 8.5');
        });
    });
});