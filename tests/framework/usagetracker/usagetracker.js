describe('Test Suite for UsageTracker', function() {

	var module = null,
		sandbox = null,
		appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull', 'usagetracker']),
		mapfullConf = getConfigForMapfull(),
		appConf = {
			"mapfull": mapfullConf,
			"usagetracker": {
				"state": {},
				"conf": {
					"logUrl" : "http://localhost:8080/logger",
					"events" : ["AfterMapMoveEvent",
						        "AfterMapLayerAddEvent",
						        "AfterMapLayerRemoveEvent",
						        "MapLayerVisibilityChangedEvent"]
				}
			}
		};

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
			// Find handles to sandbox and statehandler module
			sandbox = Oskari.$("sandbox");
			module = sandbox.findRegisteredModuleInstance('UsageTracker');
			done();
		});
	};

	function moveMap(sandbox) {
		sandbox.postRequestByName('MapMoveRequest', [378797, 6677846, 9]);
	}

	describe('Map move request should not log', function() {

		before(function(done) {
			// clone the original setting
			var localConf = jQuery.extend(true, {}, appConf);
			// overwrite conf to check nothing is sent
			localConf.usagetracker.conf = {};
			startApplication(done, appSetup, localConf);
		});

		after(teardown);

		it('should not have any event handlers', function(done) {
			// Note! function variables do not show when console.logging. Use looping to detect available variables.
			var handlers = module.eventHandlers;
			var length = 0;
			for (var h in handlers) {
				length += 1;
			}
			expect(length).to.be(0);
			done();
		});
	});

	describe('Map move request logging', function() {

		before(startApplication);
		after(teardown);

		it('should have all 4 configured event handlers', function() {
			var handlers = module.eventHandlers,
				length = 0;

			// Note! function variables do not show when console.logging. Use looping to detect available variables.
			for (var h in handlers) {
				length += 1;
			}

			expect(length).to.be(4);
		});

		it('should call logState after "AfterMapMoveEvent" event', function(done) {
			this.timeout(1); // set timeout to ensure the test fails quickly if _logState is not called

			var logSpy = sinon.stub(module, '_logState', function(e) {
				logSpy.restore();
				// The test will timeout and fail if not called. Calling done will make the test pass.
				done();
			});

			var event = sandbox.getEventBuilder('AfterMapMoveEvent')(517280, 6873538, 9, false, 5669.2944);
	        sandbox.notifyAll(event);
		});

		it('should call logState after "AfterMapLayerAddEvent" event', function(done) {
			this.timeout(1); // set timeout to ensure the test fails quickly if _logState is not called

			var logSpy = sinon.stub(module, '_logState', function(e) {
				logSpy.restore();
				// The test will timeout and fail if not called. Calling done will make the test pass.
				done();
			});

			var layer = sandbox.findMapLayerFromAllAvailable('base_35'),
				event = sandbox.getEventBuilder('AfterMapLayerAddEvent')(layer, false, false);
	        sandbox.notifyAll(event);
		});

		it('should call logState after "AfterMapLayerRemoveEvent" event', function(done) {
			this.timeout(1); // set timeout to ensure the test fails quickly if _logState is not called

			var logSpy = sinon.stub(module, '_logState', function(e) {
				logSpy.restore();
				// The test will timeout and fail if not called. Calling done will make the test pass.
				done();
			});

			var layer = sandbox.findMapLayerFromAllAvailable('base_35'),
				event = sandbox.getEventBuilder('AfterMapLayerRemoveEvent')(layer);
	        sandbox.notifyAll(event);
		});

		it('should call logState after "MapLayerVisibilityChangedEvent" event', function(done) {
			this.timeout(1); // set timeout to ensure the test fails quickly if _logState is not called

			var logSpy = sinon.stub(module, '_logState', function(e) {
				logSpy.restore();
				// The test will timeout and fail if not called. Calling done will make the test pass.
				done();
			});

	        var event = sandbox.getEventBuilder('MapLayerVisibilityChangedEvent')(null, false, false);
	        sandbox.notifyAll(event);
		});

	});
});