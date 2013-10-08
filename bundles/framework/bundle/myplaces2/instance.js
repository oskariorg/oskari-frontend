/**
 * @class Oskari.mapframework.bundle.myplaces2.MyPlacesBundleInstance
 * 
 * My places functionality
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplaces2.MyPlacesBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._localization = null;
    this.sandbox = null;
    this.buttons = undefined;
    this.categoryHandler = undefined;
    this.myPlacesService = undefined;
    this.featureNS = undefined;
    this.idPrefix = 'myplaces';
}, {
    __name : 'MyPlaces2',
    /**
     * @method getName
     * @return {String} the name for the component 
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getSandbox
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox : function() {
        return this.sandbox;
    },
    /**
     * @method getLocalization
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     * 
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     *      JSON object for complete data depending on localization
     *      structure and if parameter key is given
     */
    getLocalization : function(key) {
        if(!this._localization) {
            this._localization = Oskari.getLocalization(this.getName());
        }
        if (key) {
            if (this._localization &&
                this._localization[key]) {
                return this._localization[key];
            } else {
                return key;
            }
        }
        return this._localization;
    },
    /**
     * @method showMessage
     * Shows user a message with ok button
     * @param {String} title popup title
     * @param {String} message popup message
     */
    showMessage : function(title, message) {
        var loc = this.getLocalization();
    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    	var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
    	okBtn.setTitle(loc.buttons.ok);
    	okBtn.addClass('primary');
    	okBtn.setHandler(function() {
            dialog.close(true);
    	});
    	dialog.show(title, message, [okBtn]);
    },
    /**
     * @method forceDisable
     * Disables the functionality since something went wrong 
     * (couldnt create default category)
     */
    forceDisable : function() {
        this.buttons.disableButtons();
        var loc = this.getLocalization();
      
        this.showMessage(loc.category.organization + ' - ' +
             loc.notification.error.title, loc.notification.error.generic);
    },
    /**
     * @method enableGfi
     * Enables/disables the gfi functionality
     * @param {Boolean} blnEnable true to enable, false to disable
     */
    enableGfi : function(blnEnable) {
        var gfiReqBuilder = this.sandbox.getRequestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
        if(gfiReqBuilder) {
            this.sandbox.request(this.buttons, gfiReqBuilder(blnEnable));
        }
    },
    /**
     * @method getService
     * Returns the my places main service
     * @return {Oskari.mapframework.bundle.myplaces2.service.MyPlacesService}
     */
    getService : function() {
        return this.myPlacesService;
    },
    /**
     * @method getDrawPlugin
     * Returns reference to the draw plugin
     * @return {Oskari.mapframework.bundle.myplaces2.plugin.DrawPlugin}
     */
    getDrawPlugin : function() {
        return this.view.drawPlugin;
    },
    /**
     * @method getCategoryHandler
     * Returns reference to the category handler
     * @return {Oskari.mapframework.bundle.myplaces2.CategoryHandler}
     */
    getCategoryHandler : function() {
        return this.categoryHandler;
    },
    /**
     * @method getMainView
     * Returns reference to the main view
     * @return {Oskari.mapframework.bundle.myplaces2.view.MainView}
     */
    getMainView : function() {
        return this.view;
    },
    /**
     * @method update
     * implements BundleInstance protocol update method - does nothing atm
     */
    update : function() {
    },
    /**
     * @method start
     * implements BundleInstance protocol start methdod
     */
    start : function() {
        
        // Should this not come as a param?
        var me = this;
        var conf = me.conf ;
		var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
		var sandbox = Oskari.getSandbox(sandboxName);
        this.sandbox = sandbox;

        this.featureNS = conf ? conf.featureNS : null;
        if (!this.featureNS) {
            return;
        }

        sandbox.printDebug("Initializing my places module...");
        
        // handles toolbar buttons related to my places 
        this.buttons = Oskari.clazz.create("Oskari.mapframework.bundle.myplaces2.ButtonHandler", this);
        this.buttons.start();
        
        var user = sandbox.getUser();
        if(!user.isLoggedIn()) {
            // guest users don't need anything else
            return;
        }
        // handles category related logic - syncs categories to my places map layers etc
        this.categoryHandler = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.CategoryHandler', this);
        this.categoryHandler.start();        

        var defaults = this._getCategoryDefaults();
        
        var actionUrl = this.conf.queryUrl; 
        //'/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_Portti2Map_WAR_portti2mapportlet_fi.mml.baseportlet.CMD=ajax.jsp&myplaces=WFS';
        // this.conf.queryUrl; 
        // back end communication
        this.myPlacesService = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.service.MyPlacesService', 
            actionUrl, user.getUuid(), sandbox, defaults, this);
        // register service so personal data can access it
        this.sandbox.registerService(this.myPlacesService);
        // init loads the places/categories
        this.myPlacesService.init();
        
        // handles my places insert form etc
        this.view = Oskari.clazz.create("Oskari.mapframework.bundle.myplaces2.view.MainView", this);
        this.view.start();
        
        this.editRequestHandler = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.request.EditRequestHandler', sandbox, me);
        sandbox.addRequestHandler('MyPlaces.EditPlaceRequest', this.editRequestHandler);
        sandbox.addRequestHandler('MyPlaces.EditCategoryRequest', this.editRequestHandler);
        sandbox.addRequestHandler('MyPlaces.DeleteCategoryRequest', this.editRequestHandler);
        sandbox.addRequestHandler('MyPlaces.PublishCategoryRequest', this.editRequestHandler);
    },
    /**
     * @method stop
     * implements BundleInstance protocol stop method - does nothing atm
     */
    stop : function() {
        this.sandbox = null;
    },

    _getCategoryDefaults : function() {
         var defaults = {
             name: this.getLocalization('category').defaultName,
             point: {
                 shape: 1,
                 color: "000000",
                 size: 3
             },
             line: {
                 style: 0,
                 cap: 0,
                 corner: 0,
                 width: 1,
                 color: "000000"
             },
             area: {
                 linestyle: 0,
                 linecap: 0,
                 linecorner: 0,
                 linewidth: 1,
                 linecolor: "000000",
                 color: "ffde00",
                 fill: -1

             }
         };
         if (!this.conf) return defaults;
         if (!this.conf.defaults) return defaults;
         for (var prop in defaults) {
             if(this.conf.defaults[prop]) {
                 defaults[prop] = this.conf.defaults[prop];
             }
         }
         return defaults;
     },

    /**
     * Convert hexadecimal color values to decimal values (255,255,255)
     * Green: hexToRgb("#0033ff").g 
     * http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     *
     * @method hex
     * hexadecimal color value e.g. '#00ff99'
     */
    hexToRgb: function(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    /**
     * Convert rgb values to hexadecimal color values
     *
     * @method rgb
     * decimal color values e.g. 'rgb(255,0,0)'
     */
    rgbToHex: function(rgb) {
        if (rgb.charAt(0) === '#') return rgb.substring(1);
        var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        delete (parts[0]);
        for (var j = 1; j <= 3; ++j) {
            parts[j] = parseInt(parts[j]).toString(16);
            if (parts[j].length == 1) parts[j] = '0' + parts[j];
        }
        return parts.join('');
    }

}, {
    /**
     * @property {String[]} protocol
     * @static 
     */
    protocol : ['Oskari.bundle.BundleInstance']
});
