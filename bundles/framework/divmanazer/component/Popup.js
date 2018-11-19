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
        this.template = jQuery('<div class="divmanazerpopup"><h3 class="popupHeader"></h3><div class="popup-body"><div class="content"></div><div class="actions"></div></div></div>');
        this.templateButton = jQuery('<div class="button"><a href="JavaScript:void(0);"></a></div>');
        this.dialog = this.template.clone();
        this.overlay = null;
        this.__listeners = {
        };
        this._isVisible = false;
        // for preventing things going infinity with onClose() handlers. show() and close() use this.
        this._closingInProgress = false;
    }, {
        /**
         * @method show
         * Shows an info popup
         * @param {String} title
         * @param {String} message
         * @param {Oskari.userinterface.component.Button[]} buttons buttons to show on dialog
         */
        show: function (title, message, buttons) {
            this._closingInProgress = false;
            var me = this,
                contentDiv = this.dialog.find('div.content'),
                actionDiv = this.dialog.find('div.actions'),
                i,
                contentHeight,
                reasonableHeight,
                focusedButton = -1,
                screenWidth = window.innerWidth,
                screenHeight = window.innerHeight;
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
            } else if (!this.dialog.find('.close-icon')) {
                // if no actions, the user can click on popup to close it
                this.dialog.on('click', function () {
                    me.close(true);
                });
            } else {
                actionDiv.remove();
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

            this._isVisible = true;

            if (contentDiv.width() > screenWidth) {
                this.dialog.css('max-width', screenWidth + 'px');
            }
            if (this.dialog.outerHeight(true) > screenHeight) {
                contentDiv.css({
                    'max-height': this._getMaxHeights().content + 'px',
                    'overflow-y': 'auto'
                });
            }

            this._bringMobilePopupToTop();

            me.__notifyListeners('show');
        },
        /**
         * @method _getMaxHeights
         * Calculates max heights for popup and content.
         * @param {boolean} fromMapDiv calculates from mapdiv instead of window (optional)
         */
        _getMaxHeights: function (fromMapDiv) {
            var headerHeight = this.dialog.find('.popupHeader').first().outerHeight(true);
            var actionsHeight = this.dialog.find('.actions').outerHeight(true);
            var contentsMargin = 20;
            var popupMargins = 4;
            var margin = 20;
            var height;
            if (fromMapDiv === true) {
                height = Oskari.getSandbox().getMap().getHeight();
            } else {
                height = window.innerHeight;
            }

            return {
                content: height - headerHeight - actionsHeight - contentsMargin - margin - popupMargins,
                popup: height - margin
            };
        },

        /**
         * @method _mobileBringToTop
         * Adjusts the zIndex of this popup, in case there are other (mobile) popups open at the moment
         * TODO: get rid of this, once we have a mechanism of identifying and killing all other open popups reliably
         */
        _bringMobilePopupToTop: function () {
            var zIndex = 0;
            if (jQuery(this.dialog).hasClass('mobile-popup')) {
                var openPopups = jQuery('.mobile-popup');

                _.each(openPopups, function (openPopup) {
                    if (parseInt(jQuery(openPopup).css('z-index')) > zIndex) {
                        zIndex = parseInt(jQuery(openPopup).css('z-index')) + 1;
                    }
                });
            }
            if (zIndex && zIndex > 0) {
                this.dialog.css('z-index', zIndex);
            }
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

        setColourScheme: function (colourScheme) {
            if (colourScheme.bgColour) {
                this.dialog.find('h3.popupHeader').css({'background-color': colourScheme.bgColour});
            }

            if (colourScheme.titleColour) {
                this.dialog.find('h3.popupHeader').css({'color': colourScheme.titleColour});
            }

            if (colourScheme.iconCls) {
                var div = this.dialog.find('.icon-close');
                div.removeClass('icon-close icon-close:hover');
                div.addClass(colourScheme.iconCls + ' close-icon');
            }

            if (colourScheme.bodyBgColour) {
                this.dialog.find('.popup-body').css({'background-color': colourScheme.bodyBgColour});
            }

            /* buttons and actionlinks */
            if (colourScheme) {
                if (colourScheme.linkColour) {
                    this.dialog.find('span.infoboxActionLinks').find('a').css('color', colourScheme.linkColour);
                }
                if (colourScheme.buttonBgColour) {
                    this.dialog.find('span.infoboxActionLinks').find('input:button').css('background', 'none');
                    this.dialog.find('span.infoboxActionLinks').find('input:button').css('background-color', colourScheme.buttonBgColour);
                }
                if (colourScheme.buttonLabelColour) {
                    this.dialog.find('span.infoboxActionLinks').find('input:button').css('color', colourScheme.buttonLabelColour);
                }
            }
        },

        setFont: function (font) {
            this.dialog.find('h3.popupHeader').css({'font-family': font});
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
            if (label) {
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

            jQuery(header).after('<div class="icon-close icon-close:hover close-icon"></div>');
            this.dialog.find('.close-icon').on('click', function () {
                me.close(true);
            });
            this.dialog.off('click');
        },

        /**
         * @method close
         * Removes the popup after given time has passed
         * @param {Boolean} noAnimation true to close immediately (optional, defaults to fade out animation)
         */
        close: function (noAnimation) {
            if (this._closingInProgress) {
                return;
            }
            this._closingInProgress = true;
            var me = this;
            if (this.overlay) {
                this.overlay.close();
            }
            if (this.hasKeydownListener) {
                jQuery(this.dialog).off('keydown', this._stopKeydownPropagation);
            }
            if (noAnimation) {
                me.__notifyListeners('close');
                me.dialog.remove();
            } else {
                me.dialog.animate({
                    opacity: 0
                }, 500);
                setTimeout(function () {
                    me.dialog.remove();
                    me.__notifyListeners('close');
                }, 500);
            }
            this._isVisible = false;
        },
        isVisible: function () {
            return this._isVisible;
        },
        /**
         * @property alignment
         * Options for #moveTo() alignment parameter
         * @static
         */
        alignment: ['left', 'right', 'top', 'bottom', 'center'],
        /**
         * @method moveTo
         * Removes the popup after given time has passed
         * @param {jQuery} target - target element which the popup should point
         * @param {String} alignment - one of #alignment (optional, defaults to right)
         * @param {Boolean} noArrow - if true, arrow is not diplayed (optional, defaults to false)
         * @param {jQuery} topOffsetElement - if set, the popup top is set according to this element (optional, used with mobile popups when adjusting to container instead of the tool)
         */
        moveTo: function (target, alignment, noArrow, topOffsetElement) {
            var me = this,
                align = 'right',
                // get the position of the target element
                tar = jQuery(target),
                pos = tar.offset(),
                parent = jQuery(window);

            if (!tar || tar.length === 0 || !pos) {
                // couldn't find target - aborting
                return;
            }

            var windowHeight = jQuery(window).height(),
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
            } else if (align === 'center') {
                top = top + (targetHeight / 2) - (dialogHeight / 2);
                left = left + (targetWidth / 2) - (dialogWidth / 2);
            }

            top = Math.min(top, windowHeight - dialogHeight);

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

            // Check at if popup is outside screen from right
            if (parent.width() < (me.dialog.width() + left)) {
                left = parent.width() - me.dialog.width();
            }
            // Check at if popup is outside screen from bottom
            if (windowHeight < (me.dialog.outerHeight() + top)) {
                // set the popup top-position to be the original top position - amount which is outside of screen
                top = top - ((me.dialog.outerHeight() + top) - windowHeight);
            }

            // move dialog to correct location
            me.dialog.css({
                'left': left + 'px',
                'top': top + 'px',
                'margin-left': 0,
                'margin-top': 0
            });

            if (topOffsetElement) {
                me._adjustPopupTop(topOffsetElement);
            }
        },
        /**
         * @method @private _adjustPopupTop
         * Adjusts the top position of this popup according to the element provided
         * @param {jQuery} topOffsetElement
         *
         */
        _adjustPopupTop: function (topOffsetElement) {
            if (topOffsetElement) {
                var top = jQuery(topOffsetElement).offset().top,
                    height = jQuery(topOffsetElement).outerHeight(true),
                    popupTop = parseInt(top) + parseInt(height);
                this.dialog.css('top', popupTop + 'px');
            }
        },
        adjustHeight: function () {
            this.dialog.find('.content').css({
                'max-height': this._getMaxHeights().content,
                'overflow-y': 'auto'
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
            if (title) {
                this.dialog.find('h3').html(Oskari.util.sanitize(title));
            } else {
                jQuery(this.dialog).find('h3').remove();
            }
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
         * Add listener to be called when popup is shown
         * @param  {Function} callback function to call on show
         */
        onShow: function (callback) {
            this.__getListeners('show').push(callback);
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
                dragOptions = options || {
                    scroll: false,
                    handle: '.popupHeader'
                };
            me.dialog.css('position', 'absolute');
            me.dialog.draggable(dragOptions);
        },

        /**
         * @method adaptToMapSize
         * Makes dialog to adapt to mobile size screens and keeps it on the screen when screen size is changed
         * @param {Oskari.Sandbox} sandbox for registering events
         * @param {String} popupName any identifier for the popup. This is needed for listening events
         */
        adaptToMapSize: function (sandbox, popupName) {
            this.sandbox = sandbox;
            this.setName(popupName);

            this.eventHandlers = {
                MapSizeChangedEvent: function (evt) {
                    this._handleMapSizeChanges({width: evt.getWidth(), height: evt.getHeight()});
                }
            };

            this.onEvent = function (event) {
                var eventHandler = this.eventHandlers[event.getName()];
                if (eventHandler) {
                    eventHandler.apply(this, [event]);
                }
            };

            for (var p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    this.sandbox.registerForEventByName(this, p);
                }
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
         */
        _handleMapSizeChanges: function (size) {
            var me = this,
                popup = me.dialog,
                wWidth = window.innerWidth,
                wHeight = window.innerHeight,
                pWidth = popup.outerWidth(true),
                pHeight = popup.outerHeight(true),
                left = parseInt(popup[0].style.left),
                top = parseInt(popup[0].style.top),
                cHeight = popup.find('.content').outerHeight(true);
            // if content can be higher then adjust height
            if (cHeight < this._getMaxHeights().content) {
                this.adjustHeight();
            }
            /*
            //reset if left or top is out of the screen
            if (left < 0){
                popup.css('left','0px');
            }
            if (top < 0){
                popup.css('top','0px');
            }
            */
            // set max-height if popup would go out of screen
            // else if dialog ends up offscreen, move it back to the screen
            if (popup.outerHeight(true) > wHeight) {
                this.adjustHeight();
                popup.css('top', '10px');
            } else if (top > (wHeight - pHeight)) {
                popup.css({
                    'top': (wHeight - pHeight - 10) + 'px'
                });
            }

            // if dialog ends up offscreen, move it back to the screen
            if (left > (wWidth - pWidth)) {
                popup.css({
                    'left': (wWidth - pWidth - 10) + 'px'
                });
            }
        }
    });
