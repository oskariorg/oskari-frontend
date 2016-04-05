var hub = window.opener.hub;

jQuery(document).ready(function() {
  var getRequestParameter = function(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null) {
      return null;
    } else {
      return results[1];
    }
  };
  
  var lang = getRequestParameter('lang');
  if (!lang) {
    lang = 'fi';
  }
  Oskari.setLang(lang);
	Oskari.setLoaderMode('dev');
	var appSetup;
	var appConfig;
	var wmsLayers;

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
  var downloadCapabilities = function(notifyCallback) {
    var municipality = getRequestParameter('municipality');
    
    if (typeof municipality !== 'undefined') {
    $.ajax({
      type : "GET",
	  url : "/proxy/wmscap?municipality=" + municipality,
      dataType : "json",
      success : function(resp) {
        wmsLayers = resp;
        notifyCallback();
      },
      error : function(){
        wmsLayers = [];
        notifyCallback();
      }
    });
    } else {
      wmsLayers = [];
      notifyCallback();
    }
  };

	var startApplication = function() {
		// check that both setup and config are loaded
		// before actually starting the application
		if (appSetup && appConfig && wmsLayers) {
			var app = Oskari.app;
			app.setApplicationSetup(appSetup);
			
			var coord = getRequestParameter('coord');
      var zoomLevel = getRequestParameter('zoomLevel');

      if (!(coord === null || zoomLevel === null)) {
        /* This seems like a link start */
        var splittedCoord;

        /*
         * Coordinates can be splitted either with new "_" or old "%20"
         */
        if (coord.indexOf("_") >= 0) {
          splittedCoord = coord.split("_");
        } else {
          splittedCoord = coord.split("%20");
        }

        var longitude = splittedCoord[0];
        var latitude = splittedCoord[1];
        if (!(longitude === null || latitude === null)) {
          appConfig.mapfull.state.zoom = zoomLevel;
          appConfig.mapfull.state.east = longitude;
          appConfig.mapfull.state.north = latitude;
        }
      }
	  
	  //add layers based on response from the server
	  for (var i = 0; i < wmsLayers.length; i++) {
		var wmsLayer = wmsLayers[i];
		//clone the template
		var layerTemplate = JSON.parse(JSON.stringify(appConfig.mapfull.conf.template));
		
		//extend properties
		for (var prop in wmsLayer) {
			if (wmsLayer.hasOwnProperty(prop)) {
				layerTemplate[prop] = wmsLayer[prop];
			}
		}
		if (layerTemplate.name) {
			layerTemplate.inspire = layerTemplate.name[lang];
		}
		
		appConfig.mapfull.conf.layers.push(layerTemplate);
		
		//add layer to BackgroundLayerSelectionPlugin if needed
		if (wmsLayers[i].isBaseLayer) {
			jQuery.each(appConfig.mapfull.conf.plugins, function() {
			  if(this.id == "Oskari.mapframework.bundle.mapmodule.plugin.BackgroundLayerSelectionPlugin") {
				this.config.baseLayers.push("" + wmsLayers[i].id);
			  }
			});
		} else {
		    appConfig.mapfull.state.selectedLayers.push({ "id": wmsLayers[i].id, "hidden": true });
		}

	  }

      var municipality = getRequestParameter('municipality');
      if (typeof municipality !== 'undefined') {
        appConfig.lupakartta.conf.municipality = municipality;
      }
      if (typeof municipality !== 'undefined' && typeof wmsLayers !== 'undefined') {
        for (var i = 0; i < wmsLayers.length; i++) {
            if (wmsLayers[i].wmsName == municipality + "_asemakaavaindeksi") {
                appConfig.planbundle.conf.urbanPlans = true;
                break;
            }
        }
      }
      
			app.setConfiguration(appConfig);
			app.startApplication(function(startupInfos) {

			});
		}
	};
	downloadAppSetup(startApplication);
	downloadConfig(startApplication);
	downloadCapabilities(startApplication);
});
