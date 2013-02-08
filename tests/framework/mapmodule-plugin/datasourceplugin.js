describe('Test Suite for Data Source plugin', function() {
	var appSetup = {
		startupSequence: [{
			title: 'Oskari DIV Manazer',
			fi: 'Oskari DIV Manazer',
			sv: '?',
			en: 'Oskari DIV Manazer',
			bundlename: 'divmanazer',
			bundleinstancename: 'divmanazer',
			metadata: {
				"Import-Bundle": {
					"divmanazer": {
						bundlePath: 'ignored/Oskari/packages/framework/bundle/'
					}
				},
				"Require-Bundle-Instance": []
			},
			instanceProps: {}
		}, {
			title: 'Aineistolähde',
			fi: 'Tietolähteet',
			sv: '?',
			en: '?',
			bundlename: 'datasource',
			bundleinstancename: 'DataSourcePlugin',
			metadata: {
				"Import-Bundle": {
					"mapmodule-plugin": {
						bundlePath: 'ignored/Oskari/packages/framework/bundle/'
					}
				},
				"Require-Bundle-Instance": []
			},
			instanceProps: {}
		}]
	};
	var appConf = {
		"mapmodule-plugin": {
			"conf": {
				"url": "/web/fi/kartta"
			}
		}
	};

	beforeEach(function(done) {
		setupOskari(appSetup, appConf, done);
	});

	afterEach(function() {
		// The Flyout is injected into the DOM and needs to be removed manually as testacular doesn't do that
		jQuery("body > div").remove();
	});

	describe('Bundle tests', function() {

		it('should setup correctly DataSourcePlugin', function(done) {
			// Find handles to sandbox, search module and flyout
			var sandbox = Oskari.$("sandbox"),
				dataSourceModule = sandbox.findRegisteredModuleInstance(''),
				dataSourcePlugin = dataSourceModule.plugins['Oskari.mapframework.bundle.mapmodule.plugin.DataSourcePlugin'];

			// Verify handles exist and have the functionality under test
			expect(sandbox).to.be.ok();
			expect(dataSourceModule).to.be.ok();
			expect(dataSourceModule.getName()).to.be('datasource');
			expect(dataSourceModule.service).to.be.ok();
			expect(dataSourceModule.service.getName()).to.be('DataSource');
			expect(dataSourceModule.service.openDialog).to.be.ok();
			expect(dataSourceModule.service.getMetadataInfoCallback).to.be.ok();
			expect(dataSourcePlugin).to.be.ok();
			done();
		});

		it.skip("should find 3 results when searching for 'helsinki'", function(done) {
			// In async tests, you can specify a timeout for failing the test
			// this.timeout(50);

			// Find handles to search module and flyout
			var searchModule = Oskari.$("sandbox").findRegisteredModuleInstance("Search");
			var searchFlyout = searchModule.plugins['Oskari.userinterface.Flyout'];

			// Spy renderResults and doSearch to verify functions have been called
			var searchRenderResultsSpy = sinon.spy(searchFlyout, '_renderResults');
			if(development) {
				// in development mode, use stub which is an extension of spy
				var doSearchSpy = sinon.stub(searchModule.service, 'doSearch', function(searchString, pass, fail) {
					pass({
						"totalCount": 3,
						"locations": [{
							"id": 0,
							"rank": 10,
							"lon": "388404.379",
							"village": "Helsinki",
							"name": "Helsinki",
							"zoomLevel": "6",
							"type": "Kunta, kaupunki",
							"lat": "6671584.135"
						}, {
							"id": 1,
							"rank": 30,
							"lon": "196195.249",
							"village": "Taivassalo",
							"name": "Helsinki",
							"zoomLevel": "8",
							"type": "Kyl&auml;, kaupunginosa tai kulmakunta",
							"lat": "6731824.771"
						}, {
							"id": 2,
							"rank": 40,
							"lon": "385788.852",
							"village": "Helsinki",
							"name": "Helsinki",
							"zoomLevel": "9",
							"type": "Rautatieliikennepaikka",
							"lat": "6672342.495"
						}]
					});
				});
			} else {
				var doSearchSpy = sinon.spy(searchModule.service, 'doSearch');
			}

			// Verify the functions haven't been called before we start
			expect(searchRenderResultsSpy.callCount).to.be(0);
			expect(doSearchSpy.callCount).to.be(0);

			// Insert 'Helsinki' as the search value and click 'Search'
			jQuery("div.searchContainer div.oskarifield input").val('Helsinki');
			jQuery("div.searchContainer input[type='button']").click();

			// Waits for searchFlyout to recieve results
			waitsFor(function() {
				return(searchFlyout.lastResult != null);
			}, function() {
				// Verify the functions have been called once
				expect(doSearchSpy.callCount).to.be(1);
				expect(searchRenderResultsSpy.callCount).to.be(1);

				// Check for the 3 search results
				expect(jQuery("div.searchContainer").find(".search_result tbody tr").length).to.be(3);
				done();
			}, "Waits for search flyout to recieve doSearch results", 30000);
		});

		it.skip("should show an error when searching for '' (empty string)", function(done) {
			// Find handles to search module and flyout
			var searchModule = Oskari.$("sandbox").findRegisteredModuleInstance("Search");
			var searchFlyout = searchModule.plugins['Oskari.userinterface.Flyout'];

			// Spy renderResults and doSearch to verify functions have been called
			var searchRenderResultsSpy = sinon.spy(searchFlyout, '_renderResults');
			// Stub doSearch to fail the search
			var doSearchStub = sinon.stub(searchModule.service, 'doSearch', function(searchString, pass, fail) {
				fail("cannot_be_empty");
			});

			// Verify the functions haven't been called before we start
			expect(searchRenderResultsSpy.callCount).to.be(0);
			expect(doSearchStub.callCount).to.be(0);

			// Insert 'Helsinki' as the search value and click 'Search'
			jQuery("div.searchContainer div.oskarifield input").val('');
			jQuery("div.searchContainer input[type='button']").click();

			// Verify search has been called and no results have been rendered
			expect(doSearchStub.callCount).to.be(1);
			expect(searchRenderResultsSpy.callCount).to.be(0);

			// Check for the error popup
			expect(jQuery("div.divmanazerpopup").find("h3").html()).to.contain("Virhe:");
			done();
		});
	});
});