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

  var version = getRequestParameter('build');
  
  var lang = getRequestParameter('lang');
  if (!lang) {
    lang = 'fi';
  }
  Oskari.setLang(lang);
  Oskari.setLoaderMode('');
  Oskari.setPreloaded(true);
  var appSetup;
  var appConfig;
  var wmsLayers;
  var municipality = getRequestParameter('municipality');

  var downloadConfig = function(notifyCallback) {
    jQuery.ajax({
      type : 'GET',
      dataType : 'json',
      url : 'js/config.json?v=' + version,
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
      url : 'js/appsetup.json?v=' + version,
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
    if (typeof municipality !== 'undefined') {
      $.ajax({
        type : "GET",
        url : "/proxy/wmscap?municipality=" + municipality + "&v=" + version,
        dataType : "json",
        beforeSend : function(x) {
          if (x && x.overrideMimeType) {
            x.overrideMimeType("application/j-son;charset=UTF-8");
          }
        },
        success : function(resp) {
          wmsLayers = resp;
          notifyCallback();
        },
        error : function() {
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
      
      var resolutions = getRequestParameter('resolutions');  

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
	  
      // check if it's production server
      var wmsUrl = "";
      switch (window.location.host) {
        case "www.lupapiste.fi":
        case "lupapiste.fi":
          wmsUrl = "//lupapiste.fi{wmsPath},//cdn.lupapiste.fi{wmsPath},//cdn2.lupapiste.fi{wmsPath}";
          break;
        case "qa.lupapiste.fi":
        case "www-qa.lupapiste.fi":
          wmsUrl = "//qa.lupapiste.fi{wmsPath},//cdn-qa.lupapiste.fi{wmsPath},//cdn2-qa.lupapiste.fi{wmsPath}";
          break;
        case "test.lupapiste.fi":
        case "www-test.lupapiste.fi":
          wmsUrl = "//test.lupapiste.fi{wmsPath},//cdn-test.lupapiste.fi{wmsPath},//cdn2-test.lupapiste.fi{wmsPath}";
          break;
        default:
          wmsUrl = "{wmsPath}";
      }

      // replace "wmsUrl" parameters to prevent blocking ajax calls to
      // www.lupapiste.fi by tile loading
      var layers = appConfig.mapfull.conf.layers;
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type == "wmslayer") {
          if (/^\/proxy/i.test(layers[i].wmsUrl))
            layers[i].wmsUrl = wmsUrl.replace(/\{wmsPath\}/g, layers[i].wmsUrl);
        } else if (layers[i].type == "base" || layers[i].type == "groupMap") {
          var sublayers = layers[i].subLayer;
          for (var j = 0; j < sublayers.length; j++) {
            if (sublayers[j].type == "wmslayer") {
              if (/^\/proxy/i.test(sublayers[j].wmsUrl))
                sublayers[j].wmsUrl = wmsUrl.replace(/\{wmsPath\}/g, sublayers[j].wmsUrl);
            }
          }
        }
      }

      if (!(coord === null || zoomLevel === null)) {
        /* This seems like a link start */
        var splittedCoord;

        /*
         * Coordinates can be splitted either with new "_" or
         * old "%20"
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
      
      if (resolutions !== null) {
    	      	  
          var splittedResolutions;
          
          //Resolutions can be splitted either with new "_" or old "%20"
          if (resolutions.indexOf("_") >= 0) {
            splittedResolutions = resolutions.split("_");
          } else {
            splittedResolutions = resolutions.split("%20");
          }
          
          var mapOptions = appConfig.mapfull.conf.mapOptions; 
          
          //Checking if mapOptions and resolutions arrays exist and create that ones if not
          mapOptions = (typeof mapOptions != 'undefined') ? mapOptions : [];
          mapOptions.resolutions = (typeof mapOptions.resolutions != 'undefined') ? mapOptions.resolutions : [];
          
    	  mapOptions.resolutions.length = 0;
          
          for (var i=0; i < splittedResolutions.length; i++) {
        	  mapOptions.resolutions.push(Number(splittedResolutions[i]));
          }
      }      

      switch(getRequestParameter('addPoint')) {
        case '0':
          appConfig["lupapiste-myplaces2"].conf.myplaces.point = false;
          break;
        case '1':
          appConfig["lupapiste-myplaces2"].conf.myplaces.point = true;
          break;
      }
      
      switch(getRequestParameter('addLine')) {
        case '0':
          appConfig["lupapiste-myplaces2"].conf.myplaces.line = false;
          break;
        case '1':
          appConfig["lupapiste-myplaces2"].conf.myplaces.line = true;
          break;
      }
      
      switch(getRequestParameter('addArea')) {
        case '0':
          appConfig["lupapiste-myplaces2"].conf.myplaces.area = false;
          break;
        case '1':
          appConfig["lupapiste-myplaces2"].conf.myplaces.area = true;
          break;
      }
	  
	  
      
      switch(getRequestParameter('addCircle')) {
        case '0':
          appConfig["lupapiste-myplaces2"].conf.myplaces.circle = false;
          break;
        case '1':
          appConfig["lupapiste-myplaces2"].conf.myplaces.circle = true;
          break;
      }
      
      switch(getRequestParameter('addEllipse')) {
        case '0':
          appConfig["lupapiste-myplaces2"].conf.myplaces.ellipse = false;
          break;
        case '1':
          appConfig["lupapiste-myplaces2"].conf.myplaces.ellipse = true;
          break;
      }
      
      var id = getRequestParameter('id');
      if(id) {
        appConfig.lupakartta.conf.id = id;
      }
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
