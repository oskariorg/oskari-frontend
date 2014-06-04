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
    
    function startASDI(sandbox) {
    	
    	/* Menu like Tile & Flyouts */
    	
    	/* TEMP fix until one is pushed to trunk */
    	
    	Oskari.clazz.define("Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance",'tmp',{
        	
       	 /**
            * @method updateExtension updates extension state
            *
            */
           "updateExtension": function (extension, request) {
               var me = this,
                   extensions = me.extensions,
                   i,
                   extensionsByName,
                   extensionInfo,
                   extensionState,
                   state,
                   ops,
                   op,
                   flyoutInfo,
                   closeOp,
                   n,
                   otherExtensionInfo,
                   otherState,
                   plgnfo,
                   otherFlyoutInfo,
                   otherFlyoutPlugin,
                   otherFlyout,
                   otherTileInfo,
                   //otherTilePlugin,
                   otherTile,
                   flyoutPlugin,
                   flyout,
                   tileInfo,
                   //tilePlugin,
                   tile,
                   viewInfo,
                   viewPlugin,
                   view,
                   len;
               if (!extension) {
                   // if extension not spesified, do it for all
                   for (i = 0; i < extensions.length; i += 1) {
                       this.updateExtension(extensions[i].extension, request);
                   }
                   return;
               }
               extensionsByName = this.extensionsByName;
               extensionInfo = extensionsByName[extension.getName()];
               extensionState = extensionInfo.state;

               state = request.getState();

               if (state === 'toggle') {

                   if (extensionState === 'close') {
                       state = 'attach';
                   } else if (extensionState === 'attach') {
                       state = 'close';
                   } else if (extensionState === 'detach') {
                       state = 'minimize';
                   } else if (extensionState === 'minimize') {
                       state = 'restore';
                   } else if (extensionState === 'restore') {
                       state = 'minimize';
                   }

               }

               flyoutInfo = extensionInfo.plugins['Oskari.userinterface.Flyout'];

               /* opening  flyouts 'attached' closes previously attachily opened  flyout(s) */
               if (state === 'attach' && flyoutInfo) {
                   var extTop = null,
                       extLeft = null;

                   if (request.getExtensionLocation().top || request.getExtensionLocation().left) {
                       me.origExtensionLocation = {};
                   }

                  /* var extLocation = function (request, me, axis) {
                       if (me.origExtensionLocation) {
                           if (request.getExtensionLocation()[axis]) {
                               me.origExtensionLocation[axis] = jQuery(flyoutInfo.el).css(axis);
                               jQuery(flyoutInfo.el).css(axis, request.getExtensionLocation()[axis] + 'px');
                           } else if (me.origExtensionLocation[axis]) {
                               jQuery(flyoutInfo.el).css(axis, me.origExtensionLocation[axis]);
                           }
                       }
                   };
                   extLocation(request, me, 'top');
                   extLocation(request, me, 'left');*/

                   ops = me.flyoutOps;
                   closeOp = ops.close;
                   for (n = 0, len = extensions.length; n < len; n += 1) {
                       otherExtensionInfo = extensions[n];
                       if (otherExtensionInfo === extensionInfo) {
                           continue;
                       }

                       if (otherExtensionInfo.state !== 'attach') {
                           continue;
                       }

                       otherState = 'close';

                       plgnfo = otherExtensionInfo.plugins;
                       otherFlyoutInfo = plgnfo['Oskari.userinterface.Flyout'];
                       if (otherFlyoutInfo) {
                           otherFlyoutPlugin = otherFlyoutInfo.plugin;
                           otherFlyout = otherFlyoutInfo.el;

                           otherExtensionInfo.state = otherState;
                           closeOp.apply(this, [otherFlyout, otherFlyoutPlugin, otherExtensionInfo]);

                           me.notifyExtensionViewStateChange(otherExtensionInfo);
                       } else {
                           continue;
                       }

                       otherTileInfo = plgnfo['Oskari.userinterface.Tile'];
                       if (otherTileInfo) {
                           //otherTilePlugin = otherTileInfo.plugin;
                           otherTile = otherTileInfo.el;

                           me.applyTransition(otherTile, otherState, me.tileTransitions);

                       }
                   }
               }

               /* let's transition flyout if one exists */
               if (flyoutInfo) {
                   flyoutPlugin = flyoutInfo.plugin;
                   flyout = flyoutInfo.el;

                   //if flyout plugin has a lazyRender created, use it.
                   if (state === 'attach' && flyoutPlugin.lazyRender) {
                       flyoutPlugin.lazyRender();
                   }

                   /**
                    * do the op for this extension
                    */
                   ops = me.flyoutOps;
                   op = ops[state];
                   op.apply(this, [flyout, flyoutPlugin, extensionInfo, extensions]);

               }

               /* let's transition menu tile if one exists */
               tileInfo = extensionInfo.plugins['Oskari.userinterface.Tile'];
               if (tileInfo) {
                   //tilePlugin = tileInfo.plugin;
                   tile = tileInfo.el;

                   me.applyTransition(tile, state, me.tileTransitions);

               }

               /* let's transition menu tile if one exists */
               viewInfo = extensionInfo.plugins['Oskari.userinterface.View'];
               if (viewInfo) {
                   viewPlugin = viewInfo.plugin;
                   view = viewInfo.el;

                   ops = me.viewOps;
                   op = ops[state];
                   if (op) {
                       op.apply(this, [view, viewPlugin, extensionInfo, extensions]);
                   }
               }
               
               if( state === 'attach' && ( tileInfo && tileInfo.el && flyoutInfo && flyoutInfo.el ))  {
               	/* Let's open flyout to bottom & left relative to tile for this demo */
               	//console.log(tileInfo, flyoutInfo);
            	 	var pos = jQuery(tileInfo.el).position();
                   	var bot = jQuery(tileInfo.el).height();
                   	var rig = jQuery(tileInfo.el).width();
                   	var w = jQuery(flyoutInfo.el).width();
                   	var winw = jQuery( window ).width();
                   	
                   	var flytopos = {
                   		left: pos.left,
                   		top:  pos.top+bot
                   	};
                   	
                   	if( ( pos.left + w ) > winw ) {
                   		flytopos.left = pos.left + rig - w;  
                   	}  
                   	
                   	jQuery(flyoutInfo.el).css("left",flytopos.left+"px");
                   	jQuery(flyoutInfo.el).css("top", flytopos.top+"px");
                   	               		
               }


               extensionInfo.state = state;

               me.notifyExtensionViewStateChange(extensionInfo);
           }});

  


	    /* Map Restartability */
    	/* TEMP fix until one is pushed to trunk */
    	
    	Oskari.clazz.category("Oskari.mapframework.ui.module.common.MapModule",'restartability',{

    		_stopImpl: function () {
    		  this._removeRequestHandlersImpl(this._sandbox);
    		  this._map.destroy();
    		  this._map = null;
    		  this.started = false;
    		  return true;
    		        },

    		_removeRequestHandlersImpl: function (sandbox) {
    		            sandbox.removeRequestHandler('MapModulePlugin.MapLayerUpdateRequest', this.requestHandlers.mapLayerUpdateHandler);
    		            sandbox.removeRequestHandler('MapMoveRequest', this.requestHandlers.mapMoveRequestHandler);

    		},

    		restart: function(sandbox, mapDiv,projCode) {
    		  var sandbox = this._sandbox;
    		  this.stopPlugins(sandbox);
    		  this._stopImpl();
    		  this.started = false;
    		  this._sandbox = sandbox;
    		  this._options.srsName = projCode;

    		  this._map = this._createMapImpl();

    		  this._calculateScalesImpl(this._mapResolutions);
    		  var scales = this._calculateScalesFromResolutions(this._options.resolutions, this._map.units);
              this._mapScales = scales;

              this._createBaseLayer();


    		  //this._initImpl(sandbox, this._options, this._map);
    		  this.getMap().render(mapDiv);
    		   var pluginName;
    		            for (pluginName in this._pluginInstances) {
    		                if (this._pluginInstances.hasOwnProperty(pluginName)) {
    		                    //this.registerPlugin(this._pluginInstances[pluginName]);
    		                	this._pluginInstances[pluginName].setMapModule(this);
    		                }
    		            }
    		            this.start(sandbox);
    		            console.log(mapDiv);
    		            

    		}
    		});


    		Oskari.clazz.category("Oskari.mapframework.bundle.mapfull.MapFullBundleInstance",'restartability',{

    		  restart : function(projCode, newState) {
    			  
    		  var sandbox = this.sandbox,
    		  	  mapmodule = this.mapmodule,
    		  	  mapDiv = mapmodule.getMapElDom()

    		  var state = newState || this.getState();
    		  this._teardownState(mapmodule);

    		  //mapmodule.stop(sandbox);
    		//mapmodule._map = mapmodule.getMap().destroy();
    		//mapmodule.started = false;
    		  console.log("BEFORE",state);
    		  var newCenterP4 = null;
    		  
    		  if( !newState ) {
    			  var oldCenter = { lon: state.east, lat: state.north };
    		  
              	var oldProjectionProj4js = new Proj4js.Proj(state.srs),
              	  newProjectionProj4js = new Proj4js.Proj(projCode);
              	  newCenterP4 = new Proj4js.Point(oldCenter.lon, oldCenter.lat);
              	  Proj4js.transform(oldProjectionProj4js, newProjectionProj4js, newCenterP4);
              	  state.east = newCenterP4.x;
        		  state.north = newCenterP4.y;
        		  state.srs = projCode;
    		  } 
    		  
    		
    		  sandbox.getMap().setSrsName(projCode);
    		  console.log("AFTER", state);
    		  
    		  mapmodule.restart(sandbox, mapDiv,projCode);
    		  this.setState(state,false);
    		         
    		  
    		}
    	});
    		
    	/* ASDI Projection and hotspot selectors */
        /* TEMP fix  */
    	Oskari.clazz.category("Oskari.mapframework.bundle.mapfull.MapFullBundleInstance",'asdi',{
    		
    		templates: {
    			projselector: {
    				toolrow: '<div class="toolrow projselector" tbgroup="default-projchange"></div>',
    				tool: '<div class="projselector" />',
    				selector: '<select class="projselector" />'
    			},
    			hotsselector: {
    				toolrow: '<div class="toolrow hotsselector" tbgroup="default-hotspots"></div>',
    				tool: '<div class="hotsselector" />',
    				selector: '<select class="hotsselector" />'
    			}
    			
    			
    		},
    		
    		addProjChangeSelector: function (contEl,projs) {
        		/* mapfull */
        		var me = this;
        		
        		/* Projection Change UI */
        		var templates = this.templates.projselector,
        			projChangeRowEl = jQuery(templates.toolrow),
        			projChangeToolEl = jQuery(templates.tool),
        			projChangeSelectorEl = jQuery(templates.selector),
        			proj = sandbox.getMap().getSrsName()
        			
        			;
        		
        		_.each(projs,function(p) {
        			var opt = jQuery('<option class="projselector" />');
        			opt.attr('value',p);
        			if( p === proj ) {
        				opt.attr('selected','selected');
        			}
        			opt.append(p);
        			projChangeSelectorEl.append(opt);
        			
        		});
        		
        		projChangeSelectorEl.on('change',function() {
        			var projCode = jQuery(this).val(),
        				mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
        			jQuery.jGrowl(projCode,{
                   	 position: "bottom-right"
                    });
        			 
        			
        			me.restart(projCode);
        			
        		});
        		
        		
        		projChangeRowEl.append(projChangeToolEl);
        		projChangeToolEl.append(projChangeSelectorEl);
        		
        		contEl.append(projChangeRowEl);
        		
        		this.projChangeSelectorEl = projChangeSelectorEl;
        		
    		},    
    		addHotspotSelector: function(contEl, hotshots) {
    			var sandbox = this.getSandbox();
    				
    			
    			var me = this;
        		
        		/* Projection Change UI */
        		var templates = this.templates.hotsselector,
        			hotsChangeRowEl = jQuery(templates.toolrow),
        			hotsChangeToolEl = jQuery(templates.tool),
        			hotsChangeSelectorEl = jQuery(templates.selector)
        			;    			
    			
        		for( p in hotshots ) {
        			var opt = jQuery('<option class="hotsselector" />');
        			opt.attr('value',p);
        			opt.append(p);
        			hotsChangeSelectorEl.append(opt);        			
        		};
        		
        		hotsChangeSelectorEl.on('change',function() {
        			var hotsCode = jQuery(this).val(),
        			hotshots = Oskari.app.getConfiguration().asdi.conf.hotspots,
        			hots = hotshots[hotsCode]; 	
        			jQuery.jGrowl(hotsCode,{
                   	 position: "bottom-right"
                    });
        		
        			
        			me.restart(hots.srsName, hots);
        			if( me.projChangeSelectorEl ) {
        				me.projChangeSelectorEl.val(hots.srsName);
        			}
        		});
        		
        		hotsChangeRowEl.append(hotsChangeToolEl);
        		hotsChangeToolEl.append(hotsChangeSelectorEl);
        		contEl.append(hotsChangeRowEl);
        		
        		this.hotsChangeSelectorEl = hotsChangeSelectorEl;
    	}
   		});
    		
    
    	/* Apply */
    	var mapfull = Oskari.app.getBundleInstanceByName('mapfull'),
    		conf = Oskari.app.getConfiguration().asdi.conf,
    		projs = conf.projs,
    		hotshots = conf.hotspots;
    		
    	mapfull.addProjChangeSelector(jQuery("#toolbar"), projs);
    	mapfull.addHotspotSelector(jQuery("#toolbar"), hotshots);
    		
    		
    }
    

    var startApplication = function() {
        // check that both setup and config are loaded
        // before actually starting the application
        if (appSetup && appConfig) {
            var app = Oskari.app;
            app.setApplicationSetup(appSetup);
            app.setConfiguration(appConfig);
            app.startApplication(function(startupInfos) {
            	var sandbox = Oskari.getSandbox() ;
            	sandbox.findRegisteredModuleInstance("MainMapModule").updateSize();
               
            	startASDI(sandbox);
            
            });
        }
    };
    downloadAppSetup(startApplication);
    downloadConfig(startApplication);

}); 