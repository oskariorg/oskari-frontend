/**
 * @class Oskari.mapframework.bundle.guidedtour.GuidedTourBundleInstance
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
 bundlePath : '/<path to>/packages/framework/bundle/'
 }
 },
 "Require-Bundle-Instance" : []
 },
 instanceProps : {}
 }
 */
Oskari.clazz.define(
    "Oskari.framework.bundle.guidedtour.GuidedTourBundleInstance",
    
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
         * Returns JSON presentation of bundles localization data for 
         * current language. If key-parameter is not given, returns 
         * the whole localization data.
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
            // Check cookie 'pti_tour_seen'. Value '1' means that tour 
            // is not to be started
            // jQuery cookie plugin: 
            //   resources/framework/bundle/guidedtour/js/jquery.cookie.js 
            //   github.com/carhartl/jquery-cookie/
            if (jQuery.cookie('pti_tour_seen') != '1') {
                var me = this;
                // Should this not come as a param?
                var sandbox = Oskari.$('sandbox');
                this.sandbox = sandbox;
                this.localization = Oskari.getLocalization(this.getName());
                // register to sandbox as a module
                sandbox.register(me);                
                me._startGuide();
            }
        },
        _startGuide : function() {
            var me = this;
            this.guideStep = 0;
            var pn = 'Oskari.userinterface.component.Popup';
            var dialog = Oskari.clazz.create(pn);
            dialog.makeDraggable();
            dialog.addClass('guidedtour');
            this._showGuideContentForStep(this.guideStep, dialog);
        },
        
        _guideSteps : [
            {
                appendTourSeenCheckbox : true,

                setScope : function(inst) {
                    this.ref = inst;
                },
                getTitle : function() {
                    return this.ref.getLocalization('page1').title;
                },
                getContent : function() {
                    var me = this.ref;
                    var loc = me.getLocalization('page1');
                    var content = jQuery('<div></div>');
                    content.append(this.ref.getLocalization('page1').message);
                    return content;
                }
            }, {
                setScope : function(inst) {
                    this.ref = inst;
                },
                getTitle : function() {
                    return '' +
                        this.ref.getLocalization('page2').title + 
                        '<span>1/8</span>';
                },
                getContent : function() {
                    var me = this.ref;
                    me._openExtension('Search');
                    var loc = me.getLocalization('page2');
                    var content = jQuery('<div></div>');
                    content.append(loc.message);
                    var linkTemplate = jQuery('<a href="#"></a>');
                    var openLink = linkTemplate.clone();
                    openLink.append(loc.openLink);
                    openLink.bind('click', 
                                  function() {
                                      me._openExtension('Search');
                                      openLink.hide();
                                      closeLink.show();
                                  });
                    var closeLink = linkTemplate.clone();
                    closeLink.append(loc.closeLink);
                    closeLink.bind('click', 
                                   function() {
                                       me._closeExtension('Search');
                                       openLink.show();
                                       closeLink.hide();
                                   });
                    content.append('<br /><br />');
                    content.append(openLink);
                    content.append(closeLink);
                    closeLink.show();
                    openLink.hide();
                    return content;
                } //,
                // getPositionRef : function() {
                //   var loc = this.ref.getLocalization('page2');
                //   var tt = "'" + loc.tileText + "'";
                //   var sel = "div.oskari-tile-title:contains(" + tt + ")";
                //   return jQuery(sel);
                // },
                // positionAlign : 'right',                
            }, {
                setScope : function(inst) {
                    this.ref = inst;
                },
                getTitle : function() {
                    var p3 = this.ref.getLocalization('page3').title;
                    return  p3 + '<span>2/8</span>';                    
                },
                getContent : function() {
                    var me = this.ref;
                    me._openExtension('LayerSelector');
                    var loc = me.getLocalization('page3');
                    var content = jQuery('<div></div>');
                    content.append(loc.message);
                    var linkTemplate = jQuery('<a href="#"></a>');
                    var openLink = linkTemplate.clone();
                    openLink.append(loc.openLink);
                    openLink.bind('click', 
                                  function() {
                                      me._openExtension('LayerSelector');
                                      openLink.hide();
                                      closeLink.show();
                                  });
                    var closeLink = linkTemplate.clone();
                    closeLink.append(loc.closeLink);
                    closeLink.bind('click', 
                                   function() {
                                       me._closeExtension('LayerSelector');
                                       openLink.show();
                                       closeLink.hide();
                                   });
                    content.append('<br><br>');
                    content.append(openLink);
                    content.append(closeLink);
                    closeLink.show();
                    openLink.hide();
                    return content;
                } //,
                // getPositionRef : function() {
                //     var loc = this.ref.getLocalization('page3');
                //     var sel = 
                //     return jQuery("div.oskari-tile-title:contains('" + 
                //                   loc.tileText + "')");
                // },
                // positionAlign : 'right'                
            }, {
                setScope : function(inst) {
                    this.ref = inst;
                },
                getTitle : function() {
                    var p4 = this.ref.getLocalization('page4').title;
                    return p4 + '<span>3/8</span>';
                },
                getContent : function() {
                    var me = this.ref;
                    me._openExtension('LayerSelection');
                    var loc = me.getLocalization('page4');
                    var content = jQuery('<div></div>');
                    content.append(loc.message);
                    var linkTemplate = jQuery('<a href="#"></a>');
                    var openLink = linkTemplate.clone();
                    openLink.append(loc.openLink);
                    openLink.bind('click', 
                                  function() {
                                      me._openExtension('LayerSelection');
                                      openLink.hide();
                                      closeLink.show();
                                  });
                    var closeLink = linkTemplate.clone();
                    closeLink.append(loc.closeLink);
                    closeLink.bind('click', 
                                   function() {
                                       me._closeExtension('LayerSelection');
                                       openLink.show();
                                       closeLink.hide();
                                   });
                    content.append('<br><br>');
                    content.append(openLink);
                    content.append(closeLink);
                    closeLink.show();
                    openLink.hide();
                    return content;
                } //,
                // getPositionRef : function() {
                //     var loc = this.ref.getLocalization('page4');
                //     return jQuery("div.oskari-tile-title:contains('" + 
                //                   loc.tileText + "')");
                // },
                // positionAlign : 'right'*/                
            }, {
                setScope : function(inst) {
                    this.ref = inst;
                },
                getTitle : function() {
                    var p5 = this.ref.getLocalization('page5').title; 
                    return p5 + '<span>4/8</span>';
                },
                getContent : function() {
                    var me = this.ref;
                    me._openExtension('PersonalData');
                    var loc = me.getLocalization('page5');
                    var content = jQuery('<div></div>');
                    content.append(loc.message);
                    var linkTemplate = jQuery('<a href="#"></a>');
                    var openLink = linkTemplate.clone();
                    openLink.append(loc.openLink);
                    openLink.bind('click', 
                                  function() {
                                      me._openExtension('PersonalData');
                                      openLink.hide();
                                      closeLink.show();
                                  });
                    var closeLink = linkTemplate.clone();
                    closeLink.append(loc.closeLink);
                    closeLink.bind('click', 
                                   function() {
                                       me._closeExtension('PersonalData');
                                       openLink.show();
                                       closeLink.hide();
                                   });
                    content.append('<br><br>');
                    content.append(openLink);
                    content.append(closeLink);
                    closeLink.show();
                    openLink.hide();
                    return content;
                } //,
                // getPositionRef : function() {
                //     var loc = this.ref.getLocalization('page5');
                //     return jQuery("div.oskari-tile-title:contains('" + 
                //                   loc.tileText + "')");
                // },
                // positionAlign : 'right'                
            }, {
                setScope : function(inst) {
                    this.ref = inst;
                },
                getTitle : function() {
                    var p6 = this.ref.getLocalization('page6').title;
                    return p6 + '<span>5/8</span>';
                },
                getContent : function() {
                    var me = this.ref;
                    me._openExtension('Publisher');
                    var loc = me.getLocalization('page6');
                    var content = jQuery('<div></div>');
                    content.append(loc.message);
                    var linkTemplate = jQuery('<a href="#"></a>');
                    var openLink = linkTemplate.clone();
                    openLink.append(loc.openLink);
                    openLink.bind('click', 
                                  function() {
                                      me._openExtension('Publisher');
                                      openLink.hide();
                                      closeLink.show();
                                  });
                    var closeLink = linkTemplate.clone();
                    closeLink.append(loc.closeLink);
                    closeLink.bind('click', 
                                   function() {
                                       me._closeExtension('Publisher');
                                       openLink.show();
                                       closeLink.hide();
                                   });
                    content.append('<br><br>');
                    content.append(openLink);
                    content.append(closeLink);
                    closeLink.show();
                    openLink.hide();
                    return content;
                } //),
                // getPositionRef : function() {
                //     var loc = this.ref.getLocalization('page6');
                //     return jQuery("div.oskari-tile-title:contains('" + 
                //                   loc.tileText + "')");
                // },
                // positionAlign : 'right'*/                
            }, {
                setScope : function(inst) {
                    this.ref = inst;
                },
                getTitle : function() {
                    var p7 = this.ref.getLocalization('page7').title;
                    return p7 + '<span>6/8</span>';
                },
                getContent : function() {
                    var me = this.ref;
                    me._closeExtension('Publisher');
                    var loc = me.getLocalization('page7');
                    var content = jQuery('<div></div>');
                    content.append(loc.message);
                    return content;
                },
                getPositionRef : function() {
                    return jQuery("#toolbar");
                },
                positionAlign : 'right'
                
            }, {
                setScope : function(inst) {
                    this.ref = inst;
                },
                getTitle : function() {
                    var p8 = this.ref.getLocalization('page8').title;
                    return p8 + '<span>7/8</span>';
                },
                getContent : function() {
                    var me = this.ref;
                    var loc = me.getLocalization('page8');
                    var content = jQuery('<div></div>');
                    content.append(loc.message);
                    return content;
                },
                getPositionRef : function() {
                    return jQuery(".panbuttonDiv");
                },
                positionAlign : 'left'
                
            }, {
                appendTourSeenCheckbox : true,

                setScope : function(inst) {
                    this.ref = inst;
                },
                getTitle : function() {
                    var p9 = this.ref.getLocalization('page9').title;
                    return p9 + '<span>8/8</span>';
                },
                getContent : function() {
                    var me = this.ref;
                    var loc = me.getLocalization('page9');
                    var content = jQuery('<div></div>');
                    content.append(loc.message);
                    return content;
                },
                getPositionRef : function() {
                    return jQuery(".pzbDiv");
                },
                positionAlign : 'left'                
            }
        ],
        
        _showGuideContentForStep : function(stepIndex, dialog) {
            var step = this._guideSteps[stepIndex];
            step.setScope(this);
            var buttons = this._getDialogButton(dialog);
            var title = step.getTitle();
            var content = step.getContent();
            if (step.appendTourSeenCheckbox) {                 
                content.append('<br><br>');
                var checkboxTemplate = 
                    jQuery('<input type="checkbox" '
                           + 'name="pti_tour_seen" '
                           + 'id="pti_tour_seen" '
                           + 'value="1">');
                var checkbox = checkboxTemplate.clone();
                var labelTemplate = 
                    jQuery('<label for="pti_tour_seen"></label>');
                var label = labelTemplate.clone();
                label.append(this.getLocalization('tourseen').label);
                checkbox.bind(
                    'change', 
                    function() {
                        if (jQuery(this).attr('checked')) {
                            // Set cookie not to show guided tour again
                            jQuery.cookie(
                                "pti_tour_seen", "1", { expires: 365 }
                            );
                        } else {
                            // Revert to show guided tour on startup
                            jQuery.cookie(
                                "pti_tour_seen", "0", { expires: 1 }
                            );
                        }
                    });
                content.append(checkbox);
                content.append('&nbsp;');
                content.append(label);
            }
            dialog.show(title, content, buttons);
            if(step.getPositionRef) {
                dialog.moveTo(step.getPositionRef(), step.positionAlign);
            } else {
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
            var rn = 'userinterface.UpdateExtensionRequest';
            this.sandbox.postRequestByName(rn, [extension, 'attach']);
        },
        _closeExtension : function(name) {
            var extension = this._getFakeExtension(name);
            var rn = 'userinterface.UpdateExtensionRequest';
            this.sandbox.postRequestByName(rn, [extension, 'close']);
        },
        _getDialogButton : function(dialog) {
            var me = this;
            var buttons = [];
            var closeTxt = '!button.close!';
            if (this.localization &&
                this.localization.button &&
                this.localization.button.previous) {
                closeTxt = this.localization.button.close;
            }
            var closeBtn = dialog.createCloseButton(closeTxt);
            buttons.push(closeBtn);
            
            if (this.guideStep > 1) {
                var bn = 'Oskari.userinterface.component.Button';
                var prevBtn = Oskari.clazz.create(bn);
                var prevTxt = '!button.previous!';
                if (this.localization &&
                    this.localization.button &&
                    this.localization.button.previous) {
                    prevTxt = this.localization.button.previous;
                }
                prevBtn.setTitle(prevTxt);
                prevBtn.setHandler(
                    function() {
                        me.guideStep--;
                        me._showGuideContentForStep(me.guideStep, dialog);
                    }
                );
                buttons.push(prevBtn);    
            }
            
            if (this.guideStep == 0) {
                var bn = 'Oskari.userinterface.component.Button';
                var startBtn = Oskari.clazz.create(bn);
                var startTxt = '!button.start!';
                if (this.localization &&
                    this.localization.button &&
                    this.localization.button.start) {
                    startTxt = this.localization.button.start;
                }
                startBtn.setTitle(startTxt);
                startBtn.setHandler(
                    function() {
                        me.guideStep++;
                        me._showGuideContentForStep(me.guideStep, dialog);
                    }
                );
                buttons.push(startBtn);
            }
            // check this._guideSteps.length <> 
            // this.guideStep and return next or finish?
            else if (this.guideStep < this._guideSteps.length - 1) {
                var bn = 'Oskari.userinterface.component.Button';
                var nextBtn = Oskari.clazz.create(bn);
                var nextTxt = '!button.next!';
                if (this.localization &&
                    this.localization.button &&
                    this.localization.button.start) {
                    nextTxt = this.localization.button.next;
                }               
                nextBtn.setTitle(nextTxt);
                nextBtn.setHandler(
                    function() {
                        me.guideStep++;
                        me._showGuideContentForStep(me.guideStep, dialog);
                    }
                );
                buttons.push(nextBtn);
                // custom class for positioned popups
                dialog.addClass('bluetitle');
            }
            else if (this.guideStep == this._guideSteps.length - 1) {
                var finishTxt = '!button.finish!';
                if (this.localization &&
                    this.localization.button &&
                    this.localization.button.start) {
                    finishTxt = this.localization.button.finish;
                }               
                var finishBtn = dialog.createCloseButton(finishTxt);
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
                var ret = handler.apply(this, [event]);
                if (ret) { 
                    return ret; 
                }
            }
            return null;
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
    }
);