/**
 * @class Oskari.userinterface.component.Overlay
 * Provides an Overlay panel
 */
Oskari.clazz.define('Oskari.userinterface.component.Overlay',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.template = jQuery('<div class="oskarioverlay transparent"></div>');
        this._overlays = null;
        this._resizingWorkaround = null;
        this.__listeners = {};
        this._baseZIndex = 100000;
    }, {
        /**
         * @method overlay
         * Overlays an element
         * @param {String} elementSelector, selector for element to overlay
         */
        overlay: function (elementSelector, addSpinner) {
            const me = this;
            const targetSelector = elementSelector || 'body';
            this._overlays = [];
            jQuery(targetSelector).each(function () {
                me._overlays.push({
                    overlay: me.template.clone(),
                    target: jQuery(this)
                });
            });
            this._overlays.forEach(overlay => {
                overlay.target.append(overlay.overlay);
                if (addSpinner) {
                    var spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
                    spinner.insertTo(overlay.overlay);
                    spinner.start();
                    overlay.spinner = spinner;
                }
            });
            me._setupSizeAndLocation();
            this._overlays.forEach(overlay => {
                overlay.overlay.on('click', function (event) {
                    event.preventDefault();
                });
            });
        },
        _setupSizeAndLocation: function () {
            this._overlays.forEach(overlay => {
                overlay.overlay.css({
                    'left': '0px',
                    'top': '0px',
                    'width': overlay.target.width() + 'px',
                    'height': overlay.target.height() + 'px'
                });
            });
        },
        resize: function () {
            this._overlays.forEach(overlay => {
                overlay.overlay.height(overlay.target.height());
                overlay.overlay.width(overlay.target.width());
            });
        },
        followResizing: function (useWindow) {
            var me = this;
            if (useWindow) {
                jQuery(window).on('resize', function () {
                    me.resize();
                });
            } else {
                this._resizingWorkaround = setTimeout(function () {
                    me.resize();
                    me.followResizing();
                }, 500);
            }
        },
        getZIndexForModal: function () {
            return this._baseZIndex + 1;
        },
        close: function () {
            var me = this;
            this._overlays.forEach(overlay => {
                overlay.overlay.remove();
                if (overlay.spinner) {
                    overlay.spinner.stop();
                }
            });
            if (this._resizingWorkaround) {
                clearTimeout(this._resizingWorkaround);
            }
            me.__notifyListeners('close');
        },

        bindClickToClose: function () {
            const me = this;
            this._overlays.forEach(overlay => {
                overlay.overlay.on('click', function () {
                    me.close();
                });
            });
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
            const listeners = this.__listeners[type];
            if (!listeners) {
                return;
            }
            listeners.forEach(cb => cb(event));
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
        }
    });
