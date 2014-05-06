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

            	Oskari.getSandbox().findRegisteredModuleInstance("MainMapModule").updateSize();
                /*var sandbox = Oskari.getSandbox();

                 var layerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');

                 var wmts = Oskari.clazz.create('Oskari.mapframework.wmts.service.WMTSLayerService', layerService);

                 // SAMALTA PALVELIMELTA, jolloin ei tarvi HOST tietoa
                 //wmts.readWMTSCapabilites('elf', '/cgi-bin/elfmc/wmts?REQUEST=GetCapabilities', 'LAEA')
                 // TIEDOSTOSTA
                 wmts.readWMTSCapabilites('karttakuva', 'wmts.xml', 'ETRS-TM35FIN', function(layers,caps) {

                 sandbox.postRequestByName('AddMapLayerRequest', ['taustakartta', true]);

                 console.log("CAPS",caps);
                 window.caps = caps;
                 });

                 */
            	
            	/* TEMP to build a menu like tileset for this demo */
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
                    	
                    	jQuery(flyoutInfo.el).css("left",pos.left+"px");
                    	jQuery(flyoutInfo.el).css("top", (pos.top+bot)+"px");
                    		
                    }


                    extensionInfo.state = state;

                    me.notifyExtensionViewStateChange(extensionInfo);
                }});

            });
            
            
        }
    };
    downloadAppSetup(startApplication);
    downloadConfig(startApplication);

}); 