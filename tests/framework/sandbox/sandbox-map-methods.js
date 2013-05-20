describe.only('Test Suite for sandbox', function() {
	var appSetup = null,
		appConf = null,
		sandbox = null,
		testLayerId = 276;

	before(function() {
		// startup the oskari application with publisher bundle, 2 test layers and signed in user
		appSetup = getStartupSequence([
			'openlayers-default-theme',
			'mapfull',
			'divmanazer',
			'toolbar',
			'statsgrid']);

		var mapfullConf = getConfigForMapfull();
		// stats layer
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
		// set statslayer as selected
		mapfullConf.state.selectedLayers = [
			{"id":"base_35","opacity":"100"},
			{"id":"276","opacity":"80"}];

		// overwrite test wide appConf
		appConf = {
			"mapfull": mapfullConf,
			"statsgrid": {
				"state": {
					"indicators": [{
						"indicator": 7,
						"year": 2012,
						"gender": "total"
					}]
				},
				"conf": {
					"stateful": true,
					"viewClazz": "Oskari.statistics.bundle.statsgrid.StatsView",
					"sandbox": "sandbox",
					"name": "StatsGrid"
				}
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
			sandbox = Oskari.getSandbox(), statsModule = sandbox.findRegisteredModuleInstance('StatsGrid'), testLayer = sandbox.findMapLayerFromAllAvailable(testLayerId), viewPlugin = statsModule.plugins['Oskari.userinterface.View'];
			done();
		});
	};

	describe("Oskari sandbox should include indicators when selected statslayer", function() {
		before(startApplication);

		// Clear the DOM as testacular doesn't do it.
		after(teardown);

		it("should be setup correctly", function() {
			expect(testLayer).to.be.ok();
			expect(viewPlugin).to.be.ok();
		});

		it("should include indicators in map link parameters when there are selected indicators", function(done) {
			var fetchCallbackGridSpy = sinon.spy(viewPlugin, 'createMunicipalitySlickGrid'),
				fetchCallbackIndicatorSpy = sinon.spy(viewPlugin, 'createIndicatorsSelect');

			expect(testLayer).to.be.ok();
			expect(viewPlugin).to.be.ok();
			expect(fetchCallbackGridSpy.callCount).to.be(0);
			expect(fetchCallbackIndicatorSpy.callCount).to.be(0);

			sandbox.postRequestByName('StatsGrid.StatsGridRequest', [true, testLayer]);

			waitsFor(function() {
				return((fetchCallbackGridSpy.callCount > 0) && (fetchCallbackIndicatorSpy.callCount > 0));
			}, function() {
				var link = sandbox.generateMapLinkParameters();

				expect(link).to.contain("indicators");

				fetchCallbackGridSpy.restore();
				fetchCallbackIndicatorSpy.restore();
				done();
			}, "Waits for the stats grid mode request", 45000);
		});
	});
});