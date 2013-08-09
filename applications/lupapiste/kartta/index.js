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
			// For some braindead reason success and error callbacks won't
			// work for downloadAppSetup, even though they worked for downloadConfig.
			complete: function(xhr, status) {
				if (status === 'error' || !xhr.responseText) {
					console.log("error ", xhr);
				} else {
					appSetup = xhr.responseText;
					appSetup = JSON.parse(appSetup);
				}
			}
			// success : function(appSetup) {
			// 	console.log("appsetup");
			// 	appSetup = appSetup;
			// 	notifyCallback();
			// },
			// error : function(jqXHR, textStatus, errorThrown) {
			// 	console.log("jqXHR ", jqXHR);
			// 	console.log("textStatus ", textStatus);
			// 	console.log("errorThrown ", errorThrown);
			// }
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

	//event demot
	jQuery("#button1").click(function() {
		//jQuery("#eventMessages").trigger("center",[parseInt(jQuery("#inputx").val(),10), parseInt(jQuery("#inputy").val(),10)]);
		hub.send("documents-map", {
			clear : jQuery("#checkbox1").is(":checked"),
			data : [{
				id : new Date().getTime(),
				location : {
					x : parseInt(jQuery("#inputx").val(), 10),
					y : parseInt(jQuery("#inputy").val(), 10)
				},
				events : {
					click : function(e) {
						jQuery("#eventMessages").html("click<br/>" + jQuery("#eventMessages").html())
					}
				}
			}]
		});
		return false;
	});
	jQuery("#button2").click(function() {
		//jQuery("#eventMessages").trigger("center",[parseInt(jQuery("#inputx").val(),10), parseInt(jQuery("#inputy").val(),10)]);
		hub.send("documents-map", {
			clear : jQuery("#checkbox1").is(":checked"),
			data : [{
				id : "11",
				location : {
					x : parseInt(jQuery("#inputx").val(), 10),
					y : parseInt(jQuery("#inputy").val(), 10)
				},
				events : {
					click : function(e) {
						jQuery("#eventMessages").html("click11<br/>" + jQuery("#eventMessages").html())
					}
				}
			}, {
				id : "22",
				location : {
					x : parseInt(jQuery("#inputx").val(), 10) - 1000 + Math.random() * 2000,
					y : parseInt(jQuery("#inputy").val(), 10) - 1000 + Math.random() * 2000
				},
				events : {
					click : function(e) {
						jQuery("#eventMessages").html("click22<br/>" + jQuery("#eventMessages").html())
					}
				}
			}, {
				id : "33",
				location : {
					x : parseInt(jQuery("#inputx").val(), 10) - 1000 + Math.random() * 2000,
					y : parseInt(jQuery("#inputy").val(), 10) - 1000 + Math.random() * 2000
				},
				events : {
					click : function(e) {
						jQuery("#eventMessages").html("click33<br/>" + jQuery("#eventMessages").html())
					}
				}
			}, {
				id : "44",
				location : {
					x : parseInt(jQuery("#inputx").val(), 10) - 1000 + Math.random() * 2000,
					y : parseInt(jQuery("#inputy").val(), 10) - 1000 + Math.random() * 2000
				},
				events : {
					click : function(e) {
						jQuery("#eventMessages").html("click44<br/>" + jQuery("#eventMessages").html())
					}
				}
			}, {
				id : "55",
				location : {
					x : parseInt(jQuery("#inputx").val(), 10) - 1000 + Math.random() * 2000,
					y : parseInt(jQuery("#inputy").val(), 10) - 1000 + Math.random() * 2000
				},
				events : {
					click : function(e) {
						jQuery("#eventMessages").html("click55<br/>" + jQuery("#eventMessages").html())
					}
				}
			}]
		});
		return false;
	});
	jQuery("#piirra").click(function() {
		//jQuery("#eventMessages").trigger("piirra");
		hub.send("inforequest-map-start", {
			drawMode : 'point',
			clear : jQuery("#checkbox1").is(":checked")
		});
		return false;
	});
	jQuery("#tyhjenna").click(function() {
		//jQuery("#eventMessages").trigger("tyhjenna");
		hub.send("map-clear-request");
		return false;
	});
	hub.subscribe("map-initialized", function(e) {
		jQuery("#eventMessages").html("map-initilized<br/>" + jQuery("#eventMessages").html())
	});
	hub.subscribe("inforequest-map-click", function(e) {
		jQuery("#eventMessages").html("inforequest-map-click (" + e.data.kunta.kuntanimi_fi + " " + e.data.kunta.kuntanumero + "," + e.data.location.x + "," + e.data.location.y + ")<br/>" + jQuery("#eventMessages").html())
	});
});
