/**
 * @class Oskari.mapframework.bundle.myviews.MyViewsBundleInstance
 *
 * Main component and starting point for My Views -related cuntionality
 * 
 * See Oskari.mapframework.bundle.myviews.MyViewsBundle for bundle definition. 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myviews.MyViewsBundleInstance', 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.core = null;
    this.sandbox = null;
    this.started = false;
    this.templates = {};
    this.plugins = {};
    this.__modaldialog = null;
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'MyViews',
    /**
     * @method getName
     * @return {String} the name for the component 
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method setSandbox
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * Sets the sandbox reference to this component
     */
    setSandbox : function(sandbox) {
        this.sandbox = sandbox;
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
        if(key) {
            return this._localization[key];
        }
        return this._localization;
    },
    /**
     * @method start
     * implements BundleInstance protocol start methdod
     */
    start : function() {
        var me = this;
        if(me.started) {
            return;
        }        
        me.started = true;

        var sandbox = Oskari.$('sandbox');
        me.sandbox = sandbox;

        sandbox.register(me);
        for(var p in me.eventHandlers) {
            if (me.eventHandlers.hasOwnProperty(p)) {
                sandbox.registerForEventByName(me, p);
            }               
        }

        var builder = sandbox.getRequestBuilder('userinterface.AddExtensionRequest');
        var request = builder(this); 
        sandbox.request(this, request);

        me.draw();
    },
    /**
     * @method init
     * implements Module protocol init methdod - does nothing atm
     */
    init : function() {
        return null;
    },
    /**
     * @method update
     * implements BundleInstance protocol update method - does nothing atm
     */
    update : function() {
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if(!handler) {
            return;
        }
        return handler.apply(this, [event]);
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        MapClickedEvent : function(e) {
            var me = this;
            var wh = jQuery(window).height();
            var ww = jQuery(window).width();
            var mdElement = jQuery('<div class="modaldialog">' +
                   '<span class="modalmessage"></span><br />' + 
                   '<span class="modalyes modalclose">yes</span><br />' +
                   '<span class="modalno">no</span><br />' +
                   '</div>');
            var mdArgs = {
                minHeight : Math.floor(wh / 5),
                minWidth : Math.floor(ww / 4),
                position : [ e.getMouseY(), e.getMouseX() ],
                appendTo : jQuery('#mapdiv'),
                closeClass : 'modalclose',
                overlayId : 'modaloverlay',
                overlayCss : {
                    'background-color' : 'darkgrey',
                    'cursor' : 'wait'
                },
                containerId : 'modalcontainer',
                containerCss : {
                    'background-color' : 'white',
                    'border' : '1px solid',
                    'text-align' : 'center'
                },
                dataId : 'modaldata',
                dataCss : {
                    'color' : 'darkblue'
                },                  
                onShow : function(dialog) {
                    var modal = this;
                    jQuery('.modalmessage', dialog.data[0]).append('Confess!');
                    jQuery('.modalyes', dialog.data[0]).click(function() {
                        //modal.close();
                    });
                    jQuery('.modalno', dialog.data[0]).click(function() {
                        jQuery('.modalmessage', dialog.data[0]).append('!');
                    });
                }
            };
            me.showModalDialog(mdElement, mdArgs);
        }
    },
    /**
     * @method stop
     * implements BundleInstance protocol stop method
     */
    stop : function() {
        var sandbox = this.sandbox();
        for(var p in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                sandbox.unregisterFromEventByName(this, p);
            }
        }
        var builder = 
            sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest');
        var request = builder(this);
        sandbox.request(this, request);
        this.sandbox.unregister(this);
        this.started = false;
    },
    /**
     * @method startExtension
     * implements Oskari.userinterface.Extension protocol startExtension method
     */
    startExtension : function() {
    },
    /**
     * @method stopExtension
     * implements Oskari.userinterface.Extension protocol stopExtension method
     */
    stopExtension : function() {
    },
    /**
     * @method getPlugins
     * implements Oskari.userinterface.Extension protocol getPlugins method
     * @return {Object} references to flyout and tile
     */
    getPlugins : function() {
        return this.plugins;
    },
    /**
     * @method getTitle 
     * @return {String} localized text for the title of the component 
     */
    getTitle : function() {
        return this.getLocalization('title');
    },
    /**
     * @method getDescription 
     * @return {String} localized text for the description of the component 
     */
    getDescription : function() {
        return this.getLocalization('desc');
    },
    /**
     * @method createUi
     */
    draw : function() {
        var me = this;        
    },
    /**
     * @method showModalDialog
     * 
     * @param {element} element The jQuery element to use as the modal dialog
     * @param {object} config Config object:
     *  appendTo:        
     *      (String:'body') The jQuery selector to append the elements to.
     *  focus:
     *      (Boolean:true) Focus in the first visible, enabled element?
     *  opacity:         
     *      (Number:50) The opacity value for the overlay div, from 0 - 100
     *  overlayId:       
     *      (String:'simplemodal-overlay') The DOM element id for the overlay div
     *  overlayCss:      
     *      (Object:{}) The CSS styling for the overlay div
     *  containerId:     
     *      (String:'simplemodal-container') The DOM element id for the container div
     *  containerCss:    
     *      (Object:{}) The CSS styling for the container div
     *  dataId:          
     *      (String:'simplemodal-data') The DOM element id for the data div
     *  dataCss:         
     *      (Object:{}) The CSS styling for the data div
     *  minHeight:       
     *      (Number:null) The minimum height for the container
     *  minWidth:        
     *      (Number:null) The minimum width for the container
     *  maxHeight:       
     *      (Number:null) The maximum height for the container. If not specified, 
     *          the window height is used.
     *  maxWidth:        
     *      (Number:null) The maximum width for the container. If not specified, 
     *          the window width is used.
     *  autoResize:      
     *      (Boolean:false) Automatically resize the container if it exceeds the browser window dimensions?
     *  autoPosition:    
     *      (Boolean:true) Automatically position the container upon creation and on window resize?
     *  zIndex:          
     *      (Number: 1000) Starting z-index value
     *  close:           
     *      (Boolean:true) If true, closeHTML, escClose and overClose will be used if set.
     *                    If false, none of them will be used.
     *  closeHTML:       
     *      (String:'<a class="modalCloseImg" title="Close"></a>') The HTML for the default close link.
     *          SimpleModal will automatically add the closeClass to this element.
     *  closeClass:      
     *      (String:'simplemodal-close') The CSS class used to bind to the close event
     *  escClose:        
     *      (Boolean:true) Allow Esc keypress to close the dialog?
     *  overlayClose:    
     *      (Boolean:false) Allow click on overlay to close the dialog?
     *  fixed:           
     *      (Boolean:true) If true, the container will use a fixed position. If false, it will use a
     *          absolute position (the dialog will scroll with the page)
     *  position:        
     *      (Array:null) Position of container [top, left]. Can be number of pixels or percentage
     *  persist:         
     *      (Boolean:false) Persist the data across modal calls? Only used for existing
     *          DOM elements. If true, the data will be maintained across modal calls, if false,
     *          the data will be reverted to its original state.
     *  modal:           
     *      (Boolean:true) User will be unable to interact with the page below the modal 
     *          or tab away from the dialog. If false, the overlay, iframe, and certain events 
     *          will be disabled allowing the user to interact with the page below the dialog.
     *  onOpen:          
     *      (Function:null) The callback function used in place of SimpleModal's open
     *  onShow:          
     *      (Function:null) The callback function used after the modal dialog has opened
     *  onClose:         
     *      (Function:null) The callback function used in place of SimpleModal's close
     */
    showModalDialog : function(element, args) {
        jQuery(element).modal(args);
    }
}, {
    /**
     * @property {String[]} protocol
     * @static 
     */
    protocol : [ 'Oskari.bundle.BundleInstance', 
                 'Oskari.mapframework.module.Module', 
                 'Oskari.userinterface.Extension' ]
});
