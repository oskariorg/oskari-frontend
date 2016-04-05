jQuery(document).ready(function() {
	Oskari.setLang('fi');
	Oskari.setLoaderMode('dev');
	var appSetup;
	var appConfig;
    var wtf=''; // state, what are we doing now
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
	
	
	var kuntakysely = function(x,y) {

				jQuery.ajax({
				type : "POST",
				url : appConfig.ajaxurl + "/Kunta",
				data : "{'x':" + x + ",'y':" + y + "}",
				contentType : "application/json; charset=utf-8",
				dataType : "json",
				success : function(response) {
					var kuntatiedot = response.d;

					hub.send("inforequest-map-click", {
						data : {
							kunta : {
								kuntanumero : kuntatiedot.kuntanumero,
								kuntanimi_fi : kuntatiedot.kuntanimi_fi,
								kuntanimi_se : kuntatiedot.kuntanimi_se
							},
							location : {
								x : kuntatiedot.x,
								y : kuntatiedot.y
							}
						}
					});

				},
				failure : function(msg) {
					alert(msg);
				}
			});
			}
	
	jQuery("#bline").click(function() {
		jQuery("#eventMessages").html("bline<br/>" + jQuery("#eventMessages").html())
		hub.send("map-draw-start", {
				drawMode : 'line'
			});
		return false;
	});
	
	
	
	jQuery("#binfopoint").click(function() {
		jQuery("#eventMessages").html("binfopoint<br/>" + jQuery("#eventMessages").html())
			hub.send("map-draw-start", {
				drawMode : 'point'
			});
			wtf='kuntakysely';
		return false;
	});
	
		jQuery("#bpoint").click(function() {
		jQuery("#eventMessages").html("bpoint<br/>" + jQuery("#eventMessages").html())
		hub.send("map-draw-start", {
				drawMode : 'point'
			});
		return false;
	});
	
	jQuery("#bbox").click(function() {
		jQuery("#eventMessages").html("bbox<br/>" + jQuery("#eventMessages").html())
		hub.send("map-draw-start", {
				drawMode : 'box'
			});
		return false;
	});
	
	jQuery("#bpolygon").click(function() {
		jQuery("#eventMessages").html("bpolygon<br/>" + jQuery("#eventMessages").html())
		hub.send("map-draw-start", {
				drawMode : 'area'
			});
		return false;
	});
		jQuery("#bcircle").click(function() {
		jQuery("#eventMessages").html("bcircle<br/>" + jQuery("#eventMessages").html())
		hub.send("map-draw-start", {
				drawMode : 'circle'
			});
		return false;
	});
	
			jQuery("#bellipse").click(function() {
		jQuery("#eventMessages").html("bellipse<br/>" + jQuery("#eventMessages").html())
		hub.send("map-draw-start", {
				drawMode : 'ellipse'
			});
		return false;
	});
	
			jQuery("#brectangle").click(function() {
		jQuery("#eventMessages").html("brectangle<br/>" + jQuery("#eventMessages").html())
		hub.send("map-draw-start", {
				drawMode : 'rectangle'
			});
		return false;
	});

				jQuery("#bmapwindow").click(function() {
		jQuery("#eventMessages").html("bmapwindow<br/>" + jQuery("#eventMessages").html())
	
		hub.send("map-draw-start", {
				drawMode : 'mapwindow'
		});

		return false;
	});
	
	
	 jQuery("#bgetdrawing").click(function() {
		jQuery("#eventMessages").html("getdrawing<br/>" + jQuery("#eventMessages").html())
	
		hub.send("map-get-geometry-request", {
					});
		return false;
	});
	
		 jQuery("#bstopdrawing").click(function() {
		jQuery("#eventMessages").html("stopdrawing<br/>" + jQuery("#eventMessages").html())
	
		hub.send("map-stop-editing-request", {
					});
		return false;
	});
		
		jQuery("#bviewvectors").click(function() {
		jQuery("#eventMessages").html("bviewvectors<br/>" + jQuery("#eventMessages").html())

		hub.send("oskari-show-shapes", {
					drawing:   jQuery("#geomtextarea").val(),
					style: {fillColor: "#7F0886", fillOpacity: 0.35, strokeColor: "#7F0886"},
					clear: jQuery('#shall_we_clear_layer_first').is(':checked')
					});
		return false;
		//["POLYGON((439343 6905482, 439943 6905482, 439343 6905982, 439343 6905482))","POLYGON((440343 6905482, 440943 6905482, 440343 6905982, 440343 6905482))"]
	});				
		
			jQuery("#beditvectors").click(function() {
		jQuery("#eventMessages").html("beditvectors<br/>" + jQuery("#eventMessages").html())

		hub.send("map-draw-start", {
					drawing:   jQuery("#geomtextarea").val(),
					drawMode : 'area'
					});
		return false;
		//["POLYGON((439343 6905482, 439943 6905482, 439343 6905982, 439343 6905482))","POLYGON((440343 6905482, 440943 6905482, 440343 6905982, 440343 6905482))"]
	});			
	
		hub.subscribe("oskari-save-drawings", function(e) {
			alert(""+wtf+" I got a oskari-save-drawings event: " + e.data.drawing);
			if(wtf == 'kuntakysely'){
			// pyydettin piste kuntakysely� varten, joten kysyt��n kunta 
			kuntakysely(e.data.drawing.x + "," + e.data.drawing.y );
			}
			
	});
		hub.subscribe("inforequest-map-click", function(e) {
			alert("point ");
	});
	
	hub.subscribe("oskari-map-initialized", function(e) {
		jQuery("#eventMessages").html("map-initilized<br/>" + jQuery("#eventMessages").html())
	});
	hub.subscribe("inforequest-map-click", function(e) {
		jQuery("#eventMessages").html("inforequest-map-click (" + e.data.kunta + "," + e.data.location.x + "," + e.data.location.y + ")<br/>" + jQuery("#eventMessages").html())
	});
});
