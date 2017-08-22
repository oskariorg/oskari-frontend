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
    'Oskari.framework.bundle.guidedtour.GuidedTourBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (locale) {
        this.sandbox = null;
        this._localization = locale;
        this.mediator = null;
        this.guideStep = 0;
        this._dialog = null;
        this._guideSteps = [];
    },
    {
        /**
         * @static
         * @property __name
         */
        __name: 'GuidedTour',

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
                    sandboxName = (conf ? conf.sandbox : 'sandbox'),
                    sandbox = Oskari.getSandbox(sandboxName);
                // register to sandbox as a module
                sandbox.register(me);
                // register request handlers
                sandbox.requestHandler(
                    'Guidedtour.AddToGuidedTourRequest',
                    Oskari.clazz.create('Oskari.framework.bundle.guidedtour.AddToGuidedTourRequestHandler', me)
                );
                me.sandbox = sandbox;

                me._startGuide();
            }
        },
        _startGuide: function () {
            var me = this,
                pn = 'Oskari.userinterface.component.Popup',
                dialog = Oskari.clazz.create(pn);
            me.guideStep = 0;
            me._initSteps();
            me._dialog = dialog;
            dialog.makeDraggable();
            dialog.addClass('guidedtour');
            me._showGuideContentForStep(me.guideStep, dialog);
        },

        _initSteps: function() {
            var me = this;
            var delegate = {
                bundleName: me.getName(),
                priority: 0,
                getTitle: function () {
                    return me._localization.page1.title;
                },
                getContent: function () {
                    var content = jQuery('<div></div>');
                    content.append(me._localization.page1.message);
                    return content;
                }
            };
            this.addStep(delegate);
        },

        addStep: function(delegate){
            var me = this;
            if(this.conf && this.conf.steps) {
                // step ordering
                var stepSpec = this.conf.steps;
                var index = stepSpec.map(function(s){return s.bundleName;}).indexOf(delegate.bundleName);
                if(delegate.bundleName !== me.getName()) {
                    if(index < 0) {
                        return;
                    }
                    delegate.priority = index + 1;
                }

                // custom content
                if(index >= 0) {
                    var content = stepSpec[index].content;
                    var reRenderTarget = null;
                    if(content){
                        delegate.getContent = function() { // empty placeholder while loading
                            reRenderTarget = jQuery('<div></div>');
                            return reRenderTarget;
                        };
                        this._getGuideContent(content, function(success, response){
                            if(success){
                                delegate.getContent = function() {return jQuery('<div>' + response.body + '</div>');};
                                if(reRenderTarget) {
                                    reRenderTarget.prepend(response.body);
                                }
                                delegate.getTitle = function() {return response.title;};
                            } else {
                                Oskari.log(me.getName()).error('Failed to load guided tour content for step "' +  stepSpec[index].bundleName + '" with tags: ' + content);
                            }
                        });
                    }
                }
            }
            if(typeof delegate.priority === 'number') {
                var priorities = this._guideSteps.map(function(d){return d.priority;});
                var insertLocation = _.sortedIndex(priorities, delegate.priority);
                this._guideSteps.splice(insertLocation, 0, delegate);
                if(this.guideStep >= insertLocation && this._guideSteps.length !== 1) { // correct current location
                    this.guideStep++;
                }
            } else {
                delegate.priority = this._guideSteps[this._guideSteps.length-1].priority + 1;
                this._guideSteps.push(delegate);
            }

            if(this._dialog) {
                this._showGuideContentForStep(this.guideStep, this._dialog);
            }
        },

        _showGuideContentForStep: function (stepIndex, dialog) {
            var step = this._guideSteps[stepIndex];
            if(step.show) {
                step.show();
            }
            var buttons = this._getDialogButton(dialog);
            var title = step.getTitle() +  (stepIndex > 0 ? '<span>' + stepIndex + '/' + (this._guideSteps.length-1) + '</span>' : '');
            var content = step.getContent();
            if(typeof step.getLinks === 'function' && step.getLinks() !== null) {
                var links = step.getLinks();
                content.append('<br /><br />');
                links.forEach(function(l){content.append(l);});
            }
            if (stepIndex === 0 || stepIndex === this._guideSteps.length - 1) {
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
        _moveGuideStep: function(delta, dialog){
            var currentStep = this._guideSteps[this.guideStep];
            if(currentStep.hide) {
                currentStep.hide();
            }
            this.guideStep += delta;
            this._showGuideContentForStep(this.guideStep, dialog);
        },
        _getDialogButton: function (dialog) {
            var me = this,
                buttons = [],
                bn = 'Oskari.userinterface.component.Button',
                closeTxt = me._localization.button.close;

            if(this.guideStep !== this._guideSteps.length - 1){
                var closeBtn = dialog.createCloseButton(closeTxt);
                closeBtn.setId('oskari_guidedtour_button_close');
                buttons.push(closeBtn);
            }

            if (this.guideStep > 1) {
                var prevBtn = Oskari.clazz.create(bn);
                var prevTxt = me._localization.button.previous;
                prevBtn.setId('oskari_guidedtour_button_previous');
                prevBtn.setTitle(prevTxt);
                prevBtn.setHandler(
                    function () {
                        me._moveGuideStep(-1, dialog);
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
                        me._moveGuideStep(1, dialog);
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
                        me._moveGuideStep(1, dialog);
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
        },
        _getGuideContent: function(tags, callback){
            var me = this;
            jQuery.ajax({
                url: me.sandbox.getAjaxUrl() + 'action_route=GetArticlesByTag',
                data: {
                    tags: tags
                },
                type: 'GET',
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                success: function (resp) {
                    if (resp && resp.articles[0] && resp.articles[0].content) {
                        callback(true, resp.articles[0].content);
                    } else {
                        callback(false);
                    }
                },
                error: function () {
                    callback(false);
                }
            });
        }
    }, {
        protocol: ['Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module'
        ]
    }
);