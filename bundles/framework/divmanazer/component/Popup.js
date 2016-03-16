/**
 * @class Oskari.userinterface.component.Popup
 * Provides a popup window to replace alert
 */
Oskari.clazz.define('Oskari.userinterface.component.Popup',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.template = jQuery('<div class="divmanazerpopup"><h3 class="popupHeader"></h3><div class="content"></div><div class="actions"></div></div>');
        this.templateButton = jQuery('<div class="button"><a href="JavaScript:void(0);"></a></div>');
        this.dialog = this.template.clone();
        this.overlay = null;
        this.isMobile = false;
        this._mobileDefs = {
            width: 320,
            height: 480
        };
        this.__listeners = {

        };
    }, {
        /**
         * @method show
         * Shows an info popup
         * @param {String} title
         * @param {String} message
         * @param {Oskari.userinterface.component.Button[]} buttons buttons to show on dialog
         */
        show: function (title, message, buttons) {
            var me = this,
                contentDiv = this.dialog.find('div.content'),
                actionDiv = this.dialog.find('div.actions'),
                i,
                contentHeight,
                reasonableHeight,
                focusedButton = -1;

            this.setTitle(title);
            this.setContent(message);

            // Remove previous buttons
            actionDiv.empty();
            if (buttons && buttons.length > 0) {
                for (i = 0; i < buttons.length; i += 1) {
                    buttons[i].insertTo(actionDiv);
                    if (buttons[i].isFocus()) {
                        focusedButton = i;
                    }
                }
            } else {
                // if no actions, the user can click on popup to close it
                this.dialog.bind('click', function () {
                    me.close(true);
                });
            }
            jQuery('body').append(this.dialog);
            if (focusedButton >= 0) {
                buttons[focusedButton].focus();
            }

            contentHeight = contentDiv.height();
            reasonableHeight = jQuery(document).height() * 0.6;
            if (contentHeight > reasonableHeight) {
                contentDiv.height(reasonableHeight);
                contentDiv.css('overflow-y', 'auto');
            }
            // center on screen
            me.dialog.css('margin-left', -(this.dialog.width() / 2) + 'px');
            me.dialog.css('margin-top', -(this.dialog.height() / 2) + 'px');

            // make popup to visible
            me.dialog.css('opacity', 1);
        },
        /**
         * @method fadeout
         * Removes the popup after given time has passed
         * @param {Number} timeout milliseconds
         */
        fadeout: function (timeout) {
            var me = this,
                timer = 3000;
            if (timeout) {
                timer = timeout;
            }
            setTimeout(function () {
                me.close();
            }, timer);
        },
        /**
         * @method addClass
         * Adds a class for formatting the popup
         * @param {String} pClass css class name
         */
        addClass: function (pClass) {
            this.dialog.addClass(pClass);
        },
        /**
         * @method createCloseButton
         * Convenience method that creates a close button with
         * given label that can be given to show() method
         * @param {String} label button label
         * @return {Oskari.userinterface.component.Button} button that closes the dialog
         */
        createCloseButton: function (label) {
            var me = this,
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CloseButton');
            if(label) {
                okBtn.setTitle(label);
            }
            okBtn.setHandler(function () {
                me.close(true);
            });
            return okBtn;
        },

        /**
        * @method createCloseIcon
         * Convenience method that creates a close icon to the right corner of popup header
         */
        createCloseIcon: function () {
            var me = this,
                header = this.dialog.find('h3');

            jQuery(header).after('<div class="icon-close icon-close:hover"></div>');
            this.dialog.find('.icon-close').on('click', function() {
                me.close(true);
            });

        },

        /**
         * @method close
         * Removes the popup after given time has passed
         * @param {Boolean} noAnimation true to close immediately (optional, defaults to fade out animation)
         */
        close: function (noAnimation) {
            var me = this;
            if (this.overlay) {
                this.overlay.close();
            }
            if (this.hasKeydownListener) {
                jQuery(this.dialog).off('keydown', this._stopKeydownPropagation);
            }
            if (noAnimation) {
                me.dialog.remove();
                me.__notifyListeners('close');
            } else {
                me.dialog.animate({
                    opacity: 0
                }, 500);
                setTimeout(function () {
                    me.dialog.remove();
                    me.__notifyListeners('close');
                }, 500);
            }
        },
        /**
         * @property alignment
         * Options for #moveTo() alignment parameter
         * @static
         */
        alignment: ['left', 'right', 'top', 'bottom'],
        /**
         * @method moveTo
         * Removes the popup after given time has passed
         * @param {jQuery} target - target element which the popup should point
         * @param {String} alignment - one of #alignment (optional, defaults to right)
         * @param {Boolean} noArrow - if true, arrow is not diplayed (optional, defaults to false)
         */
        moveTo: function (target, alignment, noArrow) {
            var me = this,
                align = 'right',
                //get the position of the target element
                tar = jQuery(target),
                pos = tar.offset();

            if (!tar || tar.length === 0 || !pos) {
                // couldn't find target - aborting
                return;
            }

            var windowWidth = jQuery(window).height(),
                windowHeight = jQuery(window).height(),
                targetWidth = tar.outerWidth(),
                targetHeight = tar.outerHeight(),
                dialogWidth = me.dialog.outerWidth(),
                dialogHeight = me.dialog.outerHeight(),
                left = pos.left,
                top = pos.top;
            if (alignment && jQuery.inArray(alignment, this.alignment) !== -1) {
                align = alignment;
            }

            if (align === 'right') {
                left = (left + targetWidth) + 5;
                top = top + (targetHeight / 2) - (dialogHeight / 2);
            } else if (align === 'left') {
                left = (left - dialogWidth) - 5;
                top = top + (targetHeight / 2) - (dialogHeight / 2);
            } else if (align === 'top') {
                top = (top - dialogHeight) - 5;
                left = left + (targetWidth / 2) - (dialogWidth / 2);
            } else if (align === 'bottom') {
                top = (top + targetHeight) + 5;
                left = left + (targetWidth / 2) - (dialogWidth / 2);
            }
            top = Math.min(top, windowHeight - dialogHeight);
            // TODO fix left like above
            if (left < 0) {
                left = 0;
            }
            if (top < 0) {
                top = 0;
            }
            // TODO: check for right and bottom as well

            if (!noArrow) {
                me.dialog.addClass('arrow');
            }
            me.dialog.addClass(alignment);
            //move dialog to correct location
            me.dialog.css({
                'left': left + 'px',
                'top': top + 'px',
                'margin-left': 0,
                'margin-top': 0
            });
        },
        /**
         * @method resetPosition
         * Resets any previous locations and centers the popup on screen
         */
        resetPosition: function () {
            var i;
            this.dialog.removeClass('arrow');
            for (i = 0; i < this.alignment.length; i += 1) {
                this.dialog.removeClass(this.alignment[i]);
            }
            this.dialog.removeAttr('style');
        },
        /**
         * @method makeModal
         * Creates an Oskari.userinterface.component.Overlay under
         * the popup to block user input outside the popup
         */
        makeModal: function () {
            var overlay = Oskari.clazz.create('Oskari.userinterface.component.Overlay');
            overlay.overlay('body');
            this.overlay = overlay;
            overlay.followResizing(true);
        },
        /**
         * @method stopKeypressPropagation
         * Stops keypress events from bubbling outside of popup
         */
        stopKeydownPropagation: function () {
            jQuery(this.dialog).keydown(this._stopKeydownPropagation);
            this.hasKeydownListener = true;
        },
        _stopKeydownPropagation: function (e) {
            e.stopPropagation();
        },
        setTitle: function (title) {
            this.dialog.find('h3').html(title);
        },
        getTitle: function () {
            return this.dialog.find('h3')[0].textContent;
        },
        setId: function (pId) {
            this.id = pId;
            if (this.dialog) {
                this.dialog.attr('id', pId);
            } else {
                Oskari.getSandbox().printWarn(
                    'Oskari.userinterface.component.Button.setId: No UI'
                );
            }
        },
        /**
         * @method setContent
         * Sets dialog content element
         * @param {HTML/DOM/jQueryObject}
         */
        setContent: function (content) {
            var contentEl = this.dialog.find('div.content');
            contentEl.empty();
            contentEl.append(content);
        },

        /**
         * @method getContent
         * Gets dialog content element
         * @return {String} dialog content
         */
        getContent: function () {
            return this.dialog.find('div.content')[0].textContent;
        },

        getJqueryContent: function () {
            return this.dialog.find('div.content');
        },

        /**
         * Add listener to be called when popup is closed
         * @param  {Function} callback function to call on close
         */
        onClose: function (callback) {
            this.__getListeners('close').push(callback);
        },
        /**
         * Clears any listeners (registered with onClose(callback)-function).
         */
        clearListeners: function () {
            var key;

            for (key in this.__listeners) {
                if (this.__listeners.hasOwnProperty(key)) {
                    this.__listeners[key] = null;
                    delete this.__listeners[key];
                }
            }
        },
        /**
         * Notifies all listeners of given type. Passes optional event object to callback
         * @param {String} type of listener ('close' for example)
         * @param {Object} event (optional)
         */
        __notifyListeners: function (type, event) {
            if (!type) {
                return;
            }
            if (!this.__listeners[type]) {
                return;
            }
            _.each(this.__listeners[type], function (cb) {
                cb(event);
            });
        },
        /**
         * Returns an array of listeners for given type.
         * @param {String} type of listener ('close' for example)
         */
        __getListeners: function (type) {
            if (!type) {
                return [];
            }
            if (!this.__listeners) {
                this.__listeners = {};
            }
            if (!this.__listeners[type] || !this.__listeners[type].push) {
                this.__listeners[type] = [];
            }
            return this.__listeners[type];
        },

        /**
         * @method makeDraggable
         * Makes dialog draggable with jQuery Event Drag plugin
         * @param options  optional options for draggable
         */
        makeDraggable: function (options) {
            var me = this,
                dragOptions = options ? options : {
                scroll: false
            };
            me.dialog.css('position', 'absolute');
            me.dialog.draggable(dragOptions);
        },

        /**
         * @method adaptToMapSize
         * Makes dialog to adapt to mobile size screens and keeps it on the screen when screen size is changed
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox for registering events
         * @param {String} popupName any identifier for the popup. This is needed for listening events
         */
        adaptToMapSize: function (sandbox, popupName) {
            this.sandbox = sandbox;
            this.setName(popupName);
            //check if the map is allready in mobile mode and adapt dialog size
            this._handleMapSizeChanges();

            this.eventHandlers = {
                MapSizeChangedEvent: function (evt) {
                    this._handleMapSizeChanges({width:evt.getWidth(), height:evt.getHeight()});
                }
            },

            this.onEvent = function (event) {
                var eventHandler = this.eventHandlers[event.getName()];
                if (eventHandler) eventHandler.apply(this, [event]);
            }

            for (var p in this.eventHandlers) {
                this.sandbox.registerForEventByName(this, p);
            }
        },

        /**
         * @method setName
         * Sets name for the popup that is listening mapSizeChangedEvent
         * @param {String} name Name for the popup
         */
        setName: function (name) {
            this._name = name;
        },

        /**
         * @method getName
         * Returns name of the popup that is listening mapSizeChangedEvent
         * @return {String} name of the popup
         */
        getName: function () {
            return this._name;
        },

        /**
         * @method  @private _handleMapSizeChanges handle map size changes
         * @param  {Object} size {width:100, height:200} (optional, if not given gets the map size from ???)
         * @param {Object} el jQuery element
         */
        _handleMapSizeChanges: function(size) {
            var me = this,
                popup = me.dialog;
                popupOffScreen = window.innerWidth - popup.width - popup[0].style['left'];

            // if dialog ends up offscreen, move it back to the screen
            if (parseInt(popup[0].style['left']) > (window.innerWidth - popup.width())) {
                popup.css({
                    'left': (window.innerWidth - popup.width() - 10) + 'px'
                });
            }
            if (parseInt(popup[0].style['top']) > (window.innerHeight - popup.height())) {
                popup.css({
                    'top': (window.innerHeight - popup.height() - 10) + 'px'
                });
            }

            // when dialog is opened check the size of  the screen
            if (!size) {
                var size = {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            }

            if (me.popupClass) {
                popup.removeClass(me.popupClass);
                me.popupClass = undefined;
            }
            // if screen is in mobile mode, change the size of the popup
            if (size.width < me._mobileDefs.width || size.height < me._mobileDefs.height) {
                if (size.width > size.height) {
                    popup.addClass('mobile-landscape');
                    me.popupClass = 'mobile-landscape';
                } else {
                    popup.addClass('mobile-portrait');
                    me.popupClass = 'mobile-portrait';
                }
            }
        }
    });
