jQuery(document).ready(function() {
	Oskari.setLang('en');
	Oskari.setLoaderMode('dev');
	var appSetup;
	var appConfig;

	var downloadConfig = function(notifyCallback) {
		jQuery.ajax({
			type : 'GET',
			dataType : 'json',
			url : 'config.json',
			beforeSend : function(x) {
				if (x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			success : function(config) {
				appConfig = config;
				notifyCallback();
			}
		});
	};
	var downloadAppSetup = function(notifyCallback) {
		jQuery.ajax({
			type : 'GET',
			dataType : 'json',
			url : 'appsetup.json',
			beforeSend : function(x) {
				if (x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			success : function(setup) {
				appSetup = setup;
				notifyCallback();
			}
		});
	};

	var startApplication = function() {
		// check that both setup and config are loaded
		// before actually starting the application
		if (appSetup && appConfig) {
			var app = Oskari.app;
			app.setApplicationSetup(appSetup);
			app.setConfiguration(appConfig);
			app.startApplication(function(startupInfos) {

			});
		}
	};
	downloadAppSetup(startApplication);
	downloadConfig(startApplication);

	jQuery("#300").click(function() {
		jQuery("#mapdiv").height(300);
		jQuery("#mapdiv").width(300);
		hub.send("map-update-size");
		return false;
	});

	jQuery("#500").click(function() {
		jQuery("#mapdiv").height(500);
		jQuery("#mapdiv").width(500);
		hub.send("map-update-size");
		return false;
	});

	jQuery("#700").click(function() {
		jQuery("#mapdiv").height(700);
		jQuery("#mapdiv").width(700);
		hub.send("map-update-size");
		return false;
	});

	jQuery("#900").click(function() {
		jQuery("#mapdiv").height(900);
		jQuery("#mapdiv").width(900);
		hub.send("map-update-size");
		return false;
	});

	hub.subscribe("map-initialized", function(e) {
		jQuery("#eventMessages").html("map-initilized<br/>" + jQuery("#eventMessages").html())
	});
	hub.subscribe("inforequest-map-click", function(e) {
		jQuery("#eventMessages").html("inforequest-map-click (" + e.data.kunta + "," + e.data.location.x + "," + e.data.location.y + ")<br/>" + jQuery("#eventMessages").html())
	});
});
