describe('Test Suite for StateHandler', function() {

	var stateHandlerModule = null,
		sandbox = null,
		appSetup = getStartupSequence(['openlayers-default-theme', 'mapfull', 'statehandler']),
		mapfullConf = getConfigForMapfull(),
		appConf = {
			"mapfull": mapfullConf,
			"statehandler": {
				"state": {},
				"conf": {
					"logUrl": "http://localhost:8080/logger"
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
			stateHandlerModule = sandbox.findRegisteredModuleInstance('StateHandler');
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
			localConf.statehandler.conf = {};
			startApplication(done, appSetup, localConf);
		});

		after(teardown);

		it('should not send mapmove logging', function(done) {
			var stateSpy = sinon.spy(stateHandlerModule, '_pushState');
			var logSpy = sinon.spy(stateHandlerModule, '_logState');
			moveMap(sandbox);
			// Waits for the map move to finish
			waitsFor(function() {
				return(stateSpy.callCount > 0);
			}, function() {
				// Verify the functions have been called twice
				expect(logSpy.callCount).to.be(0);

	            // clean up
	            stateSpy.restore();
	            logSpy.restore();
				done();
			}, "Waits for map to move", 30000);
		});
	});

	describe('Map move request logging', function() {

		before(startApplication);
		after(teardown);

		it("should send mapmove logging", function(done) {
			var stateSpy = sinon.spy(stateHandlerModule, '_pushState');
			var logSpy = sinon.spy(stateHandlerModule, '_logState');
			moveMap(sandbox);
			// Waits for the map move to finish
			waitsFor(function() {
				return(stateSpy.callCount > 0);
			}, function() {
				// Verify the functions have been called
				expect(logSpy.callCount).to.be.greaterThan(0);

	            // clean up
	            stateSpy.restore();
	            logSpy.restore();
				done();
			}, "Waits for map to move", 30000);
		});
	});
});