/**
 * @class Oskari.liikennevirasto.bundle.lakapa.StartupInfoBundleInstance
*
* Registers and starts the
* Oskari.liikennevirasto.bundle.lakapa.StartupInfoBundleInstance plugin for main map.
*/
Oskari.clazz.define('Oskari.liikennevirasto.bundle.lakapa.StartupInfoBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (locale) {
        this.sandbox = null;
        this._localization = locale;
        this.mediator = null;
        this.infosStep = 0;
    },
    {
        /**
         * @static
         * @property __name
         */
        __name: 'StartupInfoBundle',

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

            // Check cookie 'lakapa_info_seen'. Value '1' means that info
            // is not to be started
            // jQuery cookie plugin:
            //   resources/framework/bundle/startupinfo/js/jquery.cookie.js
            //   github.com/carhartl/jquery-cookie/
            if (jQuery.cookie('lakapa_info_seen') !== '1') {
                var me = this,
                    conf = me.conf, // Should this not come as a param?
                    sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                    sandbox = Oskari.getSandbox(sandboxName);
                me.sandbox = sandbox;
                // register to sandbox as a module
                sandbox.register(me);
                me._startInfo();
            }
        },
        _startInfo: function () {
            var me = this,
                pn = 'Oskari.userinterface.component.Popup',
                dialog = Oskari.clazz.create(pn);
            me.infoStep = 0;
            dialog.makeDraggable();
            dialog.addClass('startupinfo');
            me._showInfoContentForStep(me.infoStep, dialog);
        },

        _infoSteps: [{
            appendInfoSeenCheckbox: true,

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
        }],

        _showInfoContentForStep: function (stepIndex, dialog) {
            var step = this._infoSteps[stepIndex];
            step.setScope(this);
            var buttons = this._getDialogButton(dialog);
            var title = step.getTitle();
            var content = step.getContent();
            if (step.appendInfoSeenCheckbox) {
                content.append('<br><br>');
                var checkboxTemplate =
                    jQuery('<input type="checkbox" ' + 'name="lakapa_info_seen" ' + 'id="lakapa_info_seen" ' + 'value="1">');
                var checkbox = checkboxTemplate.clone();
                var labelTemplate =
                    jQuery('<label for="lakapa_info_seen"></label>');
                var label = labelTemplate.clone();
                label.append(this._localization.infoseen.label);
                checkbox.bind(
                    'change',
                    function () {
                        if (jQuery(this).attr('checked')) {
                            // Set cookie not to show info again
                            jQuery.cookie(
                                'lakapa_info_seen', '1', {
                                    expires: 365
                                }
                            );
                        } else {
                            // Revert to show info on startup
                            jQuery.cookie(
                                'lakapa_info_seen', '0', {
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
                bn,
                closeTxt = me._localization.button.close;
            var closeBtn = dialog.createCloseButton(closeTxt);
            dialog.onClose(function() {
            	me.sandbox.postRequestByName('ShowHelpRequest');
            });
            buttons.push(closeBtn);
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
            var me = this;
            var sandbox = me.sandbox();
            // unregister module from sandbox
            me.sandbox.unregister(me);
        }
    }, {
        protocol: ["Oskari.bundle.Bundle", "Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.ExtensionBundle"]
    }
);