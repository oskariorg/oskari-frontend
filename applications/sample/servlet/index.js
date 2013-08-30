jQuery(document).ready(function() {
	Oskari.setLang('en');
	Oskari.setLoaderMode('dev');
	var appSetup = {};
	var appConfig;

	jQuery.ajax({
		type : 'GET',
		dataType : 'json',
		url : '/ajax/?action_route=GetAppSetup',
		beforeSend : function(x) {
			if (x && x.overrideMimeType) {
				x.overrideMimeType("application/j-son;charset=UTF-8");
			}
		},
		success : function(setup) {
			appSetup.startupSequence = setup.startupSequence;
			appConfig = setup.configuration;
			var app = Oskari.app;
			app.setApplicationSetup(appSetup);
			app.setConfiguration(appConfig);
			app.startApplication(function(startupInfos) {
				// all bundles have been loaded
			});
		}
	});

});