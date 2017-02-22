/**
 * @class Oskari.mapframework.bundle.asdiguidedtour.ASDIGuidedTourBundleInstance
 *
 * Add this to startupsequence to get this bundle started
 {
   bundlename : 'asdi-guided-tour',
   metadata : {
   "Import-Bundle" : {
   "asdi-guided-tour" : {
   bundlePath : '/Oskari/packages/asdi/bundle/'
   }
   }
   }
 }
 */
Oskari.clazz.define(
    'Oskari.framework.bundle.asdiguidedtour.BundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (locale) {
        this.sandbox = null;
        this._localization = null;
        this.mediator = null;
        this.guideStep = 0;
    },
    {
        /**
         * @static
         * @property __name
         */
        __name: 'asdi-guidedtour',

        /**
         * @method getName
         * Module protocol method
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method getTitle
         * Extension protocol method
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this._localization.title;
        },

        /**
         * @method getDescription
         * Extension protocol method
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this._localization.desc;
        },

        /**
         * @method getSandbox
         * Convenience method to call from Tile and Flyout
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },

        /**
         * @method update
         * BundleInstance protocol method
         */
        update: function () {},

        /**
         * @method start
         * BundleInstance protocol method
         */
        start: function () {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }

            // Check cookie 'pti_tour_seen'. Value '1' means that tour
            // is not to be started
            // jQuery cookie plugin:
            //   resources/framework/bundle/guidedtour/js/jquery.cookie.js
            //   github.com/carhartl/jquery-cookie/
            if (jQuery.cookie('pti_tour_seen') !== '1') {
                var me = this,
                    conf = me.conf, // Should this not come as a param?
                    sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                    sandbox = Oskari.getSandbox(sandboxName);
                me.sandbox = sandbox;
                // register to sandbox as a module
                sandbox.register(me);
                me._startGuide();
            }
        },
        _startGuide: function () {
            var me = this,
                pn = 'Oskari.userinterface.component.Popup',
                dialog = Oskari.clazz.create(pn);
            me.guideStep = 0;
            dialog.makeDraggable();
            dialog.addClass('guidedtour');
            me._showGuideContentForStep(me.guideStep, dialog);
        },

        _guideSteps: [{
            appendTourSeenCheckbox: true,

            setScope: function (inst) {
                this.ref = inst;
            },
            getTitle: function () {
                return this.ref._localization.page1.title;
            },
            getContent: function () {
                var content = jQuery('<div></div>');
                content.append(this.ref._localization.page1.message);
                return content;
            }
        },
        //PAGE1
         {
            setScope: function (inst) {
                this.ref = inst;
            },
            getTitle: function () {
                return '' +
                    this.ref._localization.page2.title +
                    '<span> 1/12</span>';
            },
            getContent: function () {
                var me = this.ref;
                me._openExtension('Search');
                var loc = me._localization.page2;
                var content = jQuery('<div></div>');
                content.append(loc.message);
                var linkTemplate = jQuery('<a href="#"></a>');
                var openLink = linkTemplate.clone();
                openLink.append(loc.openLink);
                openLink.bind('click',
                    function () {
                        me._openExtension('Search');
                        openLink.hide();
                        closeLink.show();
                    });
                var closeLink = linkTemplate.clone();
                closeLink.append(loc.closeLink);
                closeLink.bind('click',
                    function () {
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
            }
        },
        //PAGE2
          {
            setScope: function (inst) {
                this.ref = inst;
            },
            getTitle: function () {
                var p3 = this.ref._localization.page3.title;
                return p3 + '<span> 2/12</span>';
            },
            getContent: function () {
                var me = this.ref;
                me._openExtension('LayerSelector');
                var loc = me._localization.page3;
                var content = jQuery('<div></div>');
                content.append(loc.message);
                var linkTemplate = jQuery('<a href="#"></a>');
                var openLink = linkTemplate.clone();
                openLink.append(loc.openLink);
                openLink.bind('click',
                    function () {
                        me._openExtension('LayerSelector');
                        openLink.hide();
                        closeLink.show();
                    });
                var closeLink = linkTemplate.clone();
                closeLink.append(loc.closeLink);
                closeLink.bind('click',
                    function () {
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
            }
        },
        //PAGE3
          {
            setScope: function (inst) {
                this.ref = inst;
            },
            getTitle: function () {
                var p4 = this.ref._localization.page4.title;
                return p4 + '<span> 3/12</span>';
            },
            getContent: function () {
                var me = this.ref;
                me._openExtension('LayerSelection');
                var loc = me._localization.page4;
                var content = jQuery('<div></div>');
                content.append(loc.message);
                var linkTemplate = jQuery('<a href="#"></a>');
                var openLink = linkTemplate.clone();
                openLink.append(loc.openLink);
                openLink.bind('click',
                    function () {
                        me._openExtension('LayerSelection');
                        openLink.hide();
                        closeLink.show();
                    });
                var closeLink = linkTemplate.clone();
                closeLink.append(loc.closeLink);
                closeLink.bind('click',
                    function () {
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
            }
        },
        //PAGE4
        {
          setScope: function (inst) {
              this.ref = inst;
          },
          getTitle: function () {
              var p5 = this.ref._localization.page5.title;
              return p5 + '<span> 4/12</span>';
          },
          getContent: function () {
              var me = this.ref;
              me._openExtension('PersonalData');
              var loc = me._localization.page5;
              var content = jQuery('<div></div>');
              content.append(loc.message);
              var linkTemplate = jQuery('<a href="#"></a>');
              var openLink = linkTemplate.clone();
              openLink.append(loc.openLink);
              openLink.bind('click',
                  function () {
                      me._openExtension('PersonalData');
                      openLink.hide();
                      closeLink.show();
                  });
              var closeLink = linkTemplate.clone();
              closeLink.append(loc.closeLink);
              closeLink.bind('click',
                  function () {
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
          }
      },
        //PAGE5
        {
          setScope: function (inst) {
              this.ref = inst;
          },
          getTitle: function () {
              var p6 = this.ref._localization.page6.title;
              return p6 + '<span> 5/12</span>';
          },
          getContent: function () {
              var me = this.ref;
              me._openExtension('Publisher2');
              var loc = me._localization.page6;
              var content = jQuery('<div></div>');
              content.append(loc.message);
              var linkTemplate = jQuery('<a href="#"></a>');
              var openLink = linkTemplate.clone();
              openLink.append(loc.openLink);
              openLink.bind('click',
                  function () {
                      me._openExtension('Publisher2');
                      openLink.hide();
                      closeLink.show();
                  });
              var closeLink = linkTemplate.clone();
              closeLink.append(loc.closeLink);
              closeLink.bind('click',
                  function () {
                      me._closeExtension('Publisher2');
                      openLink.show();
                      closeLink.hide();
                  });
              content.append('<br><br>');
              content.append(openLink);
              content.append(closeLink);
              closeLink.show();
              openLink.hide();
              return content;
          }
      },
        //PAGE6
        {
          setScope: function (inst) {
              this.ref = inst;
          },
          getTitle: function () {
              var p7 = this.ref._localization.page7.title;
              return p7 + '<span> 6/12</span>';
          },
          getContent: function () {
              var me = this.ref;
              me._openExtension('maplegend');
              var loc = me._localization.page7;
              var content = jQuery('<div></div>');
              content.append(loc.message);
              var linkTemplate = jQuery('<a href="#"></a>');
              var openLink = linkTemplate.clone();
              openLink.append(loc.openLink);
              openLink.bind('click',
                  function () {
                      me._openExtension('maplegend');
                      openLink.hide();
                      closeLink.show();
                  });
              var closeLink = linkTemplate.clone();
              closeLink.append(loc.closeLink);
              closeLink.bind('click',
                  function () {
                      me._closeExtension('maplegend');
                      openLink.show();
                      closeLink.hide();
                  });
              content.append('<br><br>');
              content.append(openLink);
              content.append(closeLink);
              closeLink.show();
              openLink.hide();
              return content;
          }
      },
        //PAGE7
        {
          setScope: function (inst) {
              this.ref = inst;
          },
          getTitle: function () {
              var p8 = this.ref._localization.page8.title;
              return p8 + '<span> 7/12</span>';
          },
          getContent: function () {
              var me = this.ref;
              me._openExtension('userinterface.UserGuide');
              var loc = me._localization.page8;
              var content = jQuery('<div></div>');
              content.append(loc.message);
              var linkTemplate = jQuery('<a href="#"></a>');
              var openLink = linkTemplate.clone();
              openLink.append(loc.openLink);
              openLink.bind('click',
                  function () {
                      me._openExtension('userinterface.UserGuide');
                      openLink.hide();
                      closeLink.show();
                  });
              var closeLink = linkTemplate.clone();
              closeLink.append(loc.closeLink);
              closeLink.bind('click',
                  function () {
                      me._closeExtension('userinterface.UserGuide');
                      openLink.show();
                      closeLink.hide();
                  });
              content.append('<br><br>');
              content.append(openLink);
              content.append(closeLink);
              closeLink.show();
              openLink.hide();
              return content;
          }
      },
        //PAGE8
        {
            setScope: function (inst) {
                this.ref = inst;
            },
            getTitle: function () {
                var p9 = this.ref._localization.page9.title;
                return p9 + '<span> 8/12</span>';
            },
            getContent: function () {
                var me = this.ref;
                me._closeExtension('userinterface.UserGuide');
                var loc = me._localization.page9;
                var content = jQuery('<div></div>');
                content.append(loc.message);
                return content;
            },
            getPositionRef: function () {
                return jQuery('#toolbar');
            },
            positionAlign: 'right'
        },
        //PAGE9
        {
          setScope: function (inst) {
              this.ref = inst;
          },
          getTitle: function () {
              var p10 = this.ref._localization.page10.title;
              return p10 + '<span> 9/12</span>';
          },
          getContent: function () {
              var me = this.ref;
              var loc = me._localization.page10;
              var content = jQuery('<div></div>');
              content.append(loc.message);
              return content;
          },
          getPositionRef: function () {
              return jQuery('#login');
          },
          positionAlign: 'right'
        },
        //PAGE10
        {
          setScope: function (inst) {
              this.ref = inst;
          },
          getTitle: function () {
              var p11 = this.ref._localization.page11.title;
              return p11 + '<span> 10/12</span>';
          },
          getContent: function () {
              var me = this.ref;
              var loc = me._localization.page11;
              var content = jQuery('<div></div>');
              content.append(loc.message);
              return content;
          },
          getPositionRef: function () {
              return jQuery('.tool-pan');
          },
          positionAlign: 'right'
        },
        //PAGE11
        {
          setScope: function (inst) {
              this.ref = inst;
          },
          getTitle: function () {
              var p12 = this.ref._localization.page12.title;
              return p12 + '<span> 11/12</span>';
          },
          getContent: function () {
              var me = this.ref;
              var loc = me._localization.page12;
              var content = jQuery('<div></div>');
              content.append(loc.message);
              return content;
          },
          getPositionRef: function () {
              return jQuery('.pzbDiv');
          },
          positionAlign: 'left'
        },
        //PAGE12
        {
          appendTourSeenCheckbox: true,

          setScope: function (inst) {
              this.ref = inst;
          },
          getTitle: function () {
              var p13 = this.ref._localization.page13.title;
              return p13 + '<span> 12/12</span>';
          },
          getContent: function () {
              var me = this.ref;
              var loc = me._localization.page13;
              var content = jQuery('<div></div>');
              content.append(loc.message);
              return content;
          },
          getPositionRef: function () {
              return jQuery('.coordinatetool');
          },
          positionAlign: 'left'
        }],

        _showGuideContentForStep: function (stepIndex, dialog) {
            var step = this._guideSteps[stepIndex];
            step.setScope(this);
            var buttons = this._getDialogButton(dialog);
            var title = step.getTitle();
            var content = step.getContent();

            if(dialog.dialog.hasClass('right')){
              dialog.dialog.removeClass('right');
            }else{
              dialog.dialog.removeClass('left');
            }
            if (step.appendTourSeenCheckbox) {
                content.append('<br><br>');
                var checkboxTemplate =
                    jQuery('<input type="checkbox" ' + 'name="pti_tour_seen" ' + 'id="pti_tour_seen" ' + 'value="1">');
                var checkbox = checkboxTemplate.clone();
                var labelTemplate =
                    jQuery('<label for="pti_tour_seen"></label>');
                var label = labelTemplate.clone();
                label.append(this._localization.tourseen.label);
                checkbox.bind(
                    'change',
                    function () {
                        if (jQuery(this).attr('checked')) {
                            // Set cookie not to show guided tour again
                            jQuery.cookie(
                                'pti_tour_seen', '1', {
                                    expires: 365
                                }
                            );
                        } else {
                            // Revert to show guided tour on startup
                            jQuery.cookie(
                                'pti_tour_seen', '0', {
                                    expires: 1
                                }
                            );
                        }
                    });
                content.append(checkbox);
                content.append('&nbsp;');
                content.append(label);
            }
            dialog.show(title, content, buttons);
            if (step.getPositionRef) {
                dialog.moveTo(step.getPositionRef(), step.positionAlign);
            } else {
                dialog.resetPosition();
            }
        },
        _getFakeExtension: function (name) {
            return {
                getName: function () {
                    return name;
                }
            };
        },
        _openExtension: function (name) {
            var extension = this._getFakeExtension(name);
            var rn = 'userinterface.UpdateExtensionRequest';
            this.sandbox.postRequestByName(rn, [extension, 'attach']);
        },
        _closeExtension: function (name) {
            var extension = this._getFakeExtension(name);
            var rn = 'userinterface.UpdateExtensionRequest';
            this.sandbox.postRequestByName(rn, [extension, 'close']);
        },
        _getDialogButton: function (dialog) {
            var me = this,
                buttons = [],
                bn = 'Oskari.userinterface.component.Button',
                closeTxt = me._localization.button.close;
            var closeBtn = dialog.createCloseButton(closeTxt);
            closeBtn.setId('oskari_guidedtour_button_close');
            buttons.push(closeBtn);

            if (this.guideStep > 1) {
                var prevBtn = Oskari.clazz.create(bn);
                var prevTxt = me._localization.button.previous;
                prevBtn.setId('oskari_guidedtour_button_previous');
                prevBtn.setTitle(prevTxt);
                prevBtn.setHandler(
                    function () {
                        me.guideStep--;
                        me._showGuideContentForStep(me.guideStep, dialog);
                    }
                );
                buttons.push(prevBtn);
            }

            if (this.guideStep === 0) {
                var startBtn = Oskari.clazz.create(bn);
                var startTxt = me._localization.button.start;
                startBtn.setId('oskari_guidedtour_button_start');
                startBtn.setTitle(startTxt);
                startBtn.setHandler(
                    function () {
                        me.guideStep++;
                        me._showGuideContentForStep(me.guideStep, dialog);
                    }
                );
                buttons.push(startBtn);
            }
            // check this._guideSteps.length <>
            // this.guideStep and return next or finish?
            else if (this.guideStep < this._guideSteps.length - 1) {
                var nextBtn = Oskari.clazz.create(bn);
                var nextTxt = me._localization.button.next;
                nextBtn.setId('oskari_guidedtour_button_next');
                nextBtn.setTitle(nextTxt);
                nextBtn.setHandler(
                    function () {
                        me.guideStep++;
                        me._showGuideContentForStep(me.guideStep, dialog);
                    }
                );
                buttons.push(nextBtn);
                // custom class for positioned popups
                dialog.addClass('bluetitle');
            } else if (this.guideStep === this._guideSteps.length - 1) {
                var finishTxt = me._localization.button.finish;
                var finishBtn = dialog.createCloseButton(finishTxt);
                finishBtn.setId('oskari_guidedtour_button_finish');
                buttons.push(finishBtn);
            }
            return buttons;
        },
        /**
         * @method init
         * Module protocol method
         */
        init: function () {
            // headless module so nothing to return
            return null;
        },

        /**
         * @method onEvent
         * Module protocol method/Event dispatch
         */
        onEvent: function (event) {
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
        eventHandlers: {
            // not listening to any events
        },

        /**
         * @method stop
         * BundleInstance protocol method
         */
        stop: function () {
            // unregister module from sandbox
            this.sandbox.unregister(this);
        }
    }, {
        protocol: ['Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module'
        ]
    }
);
