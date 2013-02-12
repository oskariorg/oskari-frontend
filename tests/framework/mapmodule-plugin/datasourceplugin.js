describe('Test Suite for Data Source plugin', function() {
	var appSetup = {
		startupSequence: [{
			title: 'OpenLayers',
			fi: 'OpenLayers',
			sv: '?',
			en: 'OpenLayers',
			bundlename: 'openlayers-default-theme',
			bundleinstancename: 'openlayers-default-theme',
			metadata: {
				"Import-Bundle": {
					"openlayers-single-full": {
						bundlePath: 'Oskari/packages/framework/bundle/'
					}
				},
				"Require-Bundle-Instance": []
			},
			instanceProps: {}
		}, {
			title: 'Map',
			fi: 'Map',
			sv: '?',
			en: 'Map',
			bundlename: 'mapfull',
			bundleinstancename: 'mapfull',
			metadata: {
				"Import-Bundle": {
					"mapmodule-plugin": {
						bundlePath: 'Oskari/packages/framework/bundle/'
					}
				},
				"Require-Bundle-Instance": []
			},
			instanceProps: {}
		}]
	};

	var appConf = {
		"conf": {
			  "plugins": [{
                "id": "Oskari.mapframework.bundle.mapmodule.plugin.DataSourcePlugin"
            }]
		}
	};

	beforeEach(function(done) {
		setupOskari(appSetup, appCOnf, done);
	});

	afterEach(function() {
		// The Flyout is injected into the DOM and needs to be removed manually as testacular doesn't do that
		jQuery("body > div").remove();
	});

	describe('Bundle tests', function() {

		it('should correctly setup the DataSourcePlugin', function(done) {
			// Find handles to sandbox data source plugin
			var dsPlugin = Oskari.$("sandbox").findRegisteredModuleInstance("DataSourcePlugin");
				
			// Verify handles exist and have the functionality under test
			expect(sandbox).to.be.ok();
			expect(dsPlugin).to.be.ok();
			expect(dsPlugin.plugin.getName()).to.be('DataSourcePlugin');
			expect(dsPlugin.mapmodule.plugin.openDialog).to.be.ok();
			expect(dsPlugin.mapmodule.plugin.get_getLayers).to.be.ok();
			expect(dsPlugin.mapmodule.plugin.get_MetadataInfoCallback).to.be.ok();
			done();
		});

		// testing the pop-up, might need refactoring
		it('should render the selected layers in the popup', function(done) {
			var dialog;
			var titleText = 'title';
			 
			beforeEach(function() {
			    dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
				dialog.show(titleText, 'content');
			});

			afterEach(function() {
			dialog.close(true);
			});

			it('should be defined', function(){
				expect(dialog).to.be.ok();
			});

			it('should be found in DOM', function(){
				var popup = jQuery('div.divmanazerpopup');
			    expect(popup.length).to.equal(1);
			});

			it('should have a title', function() {
				var popup = jQuery('div.divmanazerpopup');
				var title = popup.find('h3').html();
			    	expect(title).not.to.be(null);
					expect(title).to.equal('title'); // dialog.getTitle()

			// To test if the link to the metadata works
			jQuery("div.icon-info").click();
			done();
		});
	});
});