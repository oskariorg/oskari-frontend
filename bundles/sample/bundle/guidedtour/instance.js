/**
 * @class Oskari.sample.bundle.guidedtour.GuidedTourBundleInstance
 *  
 * Add this to startupsequence to get this bundle started
 {
            title : 'guidedtour',
            fi : 'guidedtour',
            sv : '?',
            en : '?',
            bundlename : 'guidedtour',
            bundleinstancename : 'guidedtour',
            metadata : {
                "Import-Bundle" : {
                    "guidedtour" : {
                        bundlePath : '/<path to>/packages/sample/bundle/'
                    }
                },
                "Require-Bundle-Instance" : []
            },
            instanceProps : {}
        }
 */
Oskari.clazz.define("Oskari.sample.bundle.guidedtour.GuidedTourBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {

    this.sandbox = null;
    this._localization = null;
    this.mediator = null;
    this.guideStep = 0;
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'GuidedTour',

    /**
     * @method getName
     * Module protocol method
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getTitle 
     * Extension protocol method
     * @return {String} localized text for the title of the component 
     */
    getTitle : function() {
        return this.getLocalization('title');
    },
    /**
     * @method getDescription 
     * Extension protocol method
     * @return {String} localized text for the description of the component 
     */
    getDescription : function() {
        return this.getLocalization('desc');
    },

    /**
     * @method getSandbox
     * Convenience method to call from Tile and Flyout
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox : function() {
        return this.sandbox;
    },
        
    /**
     * @method update
     * BundleInstance protocol method
     */
    update : function() {
    },
    /**
     * @method getLocalization
     * Convenience method to call from Tile and Flyout
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
     * BundleInstance protocol method
     */
    start : function() {
        var me = this;
        // Should this not come as a param?
        var sandbox = Oskari.$('sandbox');
        this.sandbox = sandbox;

        this.localization = Oskari.getLocalization(this.getName());
        
        // register to sandbox as a module
        sandbox.register(me);
        
        me._startGuide();
    },
    _startGuide : function() {
        var me = this;
        this.guideStep = 0;
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        this._showGuideContentForStep(this.guideStep, dialog);
    },
    
    _guideSteps : [{
        setScope : function(inst) {
            this.ref = inst;
        },
        getTitle : function() {
            return this.ref.getLocalization('page1').title
        },
        getContent : function() {
            var me = this;
            var content = jQuery('<div></div>');
            content.append(this.ref.getLocalization('page1').message);
            return content;
        }
    },
    {
        setScope : function(inst) {
            this.ref = inst;
        },
        getTitle : function() {
            return this.ref.getLocalization('page2').title
        },
        getContent : function() {
            var me = this.ref;
            var loc = me.getLocalization('page2');
            var content = jQuery('<div></div>');
            content.append(loc.message);
            var linkTemplate = jQuery('<a href="#"></a>');
            var openLink = linkTemplate.clone();
            openLink.append(loc.openLink);
            openLink.bind('click', function() {
                me._openExtension('PersonalData');
            });
            var closeLink = linkTemplate.clone();
            closeLink.append(loc.closeLink);
            closeLink.bind('click', function() {
                me._closeExtension('PersonalData');
            });
            content.append(openLink);
            content.append(' - ');
            content.append(closeLink);
            return content;
        },
        getPositionRef : function() {
            var loc = this.ref.getLocalization('page2');
            return jQuery("div.oskari-tile-title:contains('" + loc.tileText + "')");
        },
        positionAlign : 'right'
        
    }
    ],
    
    _showGuideContentForStep : function(stepIndex, dialog) {
        var step = this._guideSteps[stepIndex];
        step.setScope(this);
        var buttons = this._getDialogButton(dialog);
        dialog.show(step.getTitle(), step.getContent(), buttons);
        if(step.getPositionRef) {
            dialog.moveTo(step.getPositionRef(), step.positionAlign);
        }
        else {
            dialog.resetPosition();
        }
    },
    _getFakeExtension : function(name) {
        return  {
            getName : function() { return name; }
        };
    },
    _openExtension : function(name) {
        var extension = this._getFakeExtension(name);
        this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'attach']);
    },
    _closeExtension : function(name) {
        var extension = this._getFakeExtension(name);
        this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'close']);
    },
    _getDialogButton : function(dialog) {
        var me = this;
        var buttons = [];
        var cancelBtn = dialog.createCloseButton('cancel');
        buttons.push(cancelBtn);
        
        
        if(this.guideStep != 0) {
            var prevBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            prevBtn.setTitle('previous');
            prevBtn.setHandler(function() {
                me.guideStep--;
                me._showGuideContentForStep(me.guideStep, dialog);
            });
            buttons.push(prevBtn);    
        }
        
        // check this._guideSteps.length <> this.guideStep and return next or finish?
        if(this.guideStep < this._guideSteps.length - 1) {
            var nextBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            nextBtn.setTitle('next');
            nextBtn.setHandler(function() {
                me.guideStep++;
                me._showGuideContentForStep(me.guideStep, dialog);
            });
            buttons.push(nextBtn);   
        }
        else if(this.guideStep == this._guideSteps.length - 1) {
            var finishBtn = dialog.createCloseButton('finished');
            buttons.push(finishBtn);
        }
        
        
        return buttons;
    },
    /**
     * @method init
     * Module protocol method
     */
    init : function() {
        // headless module so nothing to return
        return null;
    },
    
    /**
     * @method onEvent
     * Module protocol method/Event dispatch
     */
    onEvent : function(event) {
        var me = this;
        var handler = me.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [event]);
    },
    
    /**
     * @static
     * @property eventHandlers
     * Best practices: defining which 
     * events bundle is listening and how bundle reacts to them
     */
    eventHandlers : {
        // not listening to any events
    },

    /**
     * @method stop
     * BundleInstance protocol method
     */
    stop : function() {
        var me = this;
        var sandbox = me.sandbox();
        // unregister module from sandbox
        me.sandbox.unregister(me);
    }
}, {
    protocol : [ 'Oskari.bundle.BundleInstance', 
                 'Oskari.mapframework.module.Module']
});