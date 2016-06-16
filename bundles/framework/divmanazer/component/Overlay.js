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
    }, {
        /**
         * @method overlay
         * Overlays an element
         * @param {String} elementSelector, selector for element to overlay
         */
        overlay: function (elementSelector, addSpinner) {
            var me = this,
                targetSelector = elementSelector,
                targets;
            if (!targetSelector) {
                targetSelector = 'body';
            }
            targets = jQuery(targetSelector);
            me._overlays = _.map(targets, function (target) {
                return {
                  overlay: me.template.clone(),
                  target: jQuery(target)
                };
            });
            _.forEach(me._overlays, function (overlay) {
                overlay.target.append(overlay.overlay);
                if(addSpinner) {
                    var spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
                    spinner.insertTo(overlay.overlay);
                    spinner.start();
                    overlay.spinner = spinner;
                }
            });
            me._setupSizeAndLocation();
            _.forEach(me._overlays, function (overlay) {
                overlay.overlay.bind('click', function (event) {
                    event.preventDefault();
                });
            });
        },
        _setupSizeAndLocation: function () {
            var me = this;
            _.forEach(me._overlays, function (overlay) {
                overlay.overlay.css({
                    'left': '0px',
                    'top': '0px',
                    'width': overlay.target.width() + 'px',
                    'height': overlay.target.height() + 'px'
                });
            });
        },
        resize: function () {
            var me = this;
            _.forEach(me._overlays, function (overlay) {
                overlay.overlay.height(overlay.target.height());
                overlay.overlay.width(overlay.target.width());
            });
        },
        followResizing: function (useWindow) {
            var me = this;
            if (useWindow) {
                jQuery(window).resize(function () {
                    me.resize();
                });
            } else {
                this._resizingWorkaround = setTimeout(function () {
                    me.resize();
                    me.followResizing();
                }, 500);
            }
        },
        close: function () {
            var me = this;
            _.forEach(me._overlays, function (overlay) {
               overlay.overlay.remove();
               if(overlay.spinner) {
                    overlay.spinner.stop();
               }
            });
            if (this._resizingWorkaround) {
                clearTimeout(this._resizingWorkaround);
            }
            me.__notifyListeners('close');
        },

        bindClickToClose: function () {
            var me = this;
            _.forEach(me._overlays, function (overlay) {
                overlay.overlay.bind('click', function() {
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
        }
    });
