/**
 * @class Oskari.userinterface.component.Popup
 * Provides a popup window to replace alert
 */
Oskari.clazz.define('Oskari.userinterface.component.Overlay',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        "use strict";
        this.template = jQuery('<div class="oskarioverlay transparent"></div>');
        this._overlay = null;
        this._targetSelector = null;
        this._resizingWorkaround = null;
    }, {
        /**
         * @method overlay
         * Overlays an element
         * @param {String} elementSelector, selector for element to overlay
         */
        overlay: function (elementSelector) {
            "use strict";
            var me = this,
                target;
            me._overlay = this.template.clone();
            me._targetSelector = elementSelector;
            if (!this._targetSelector) {
                this._targetSelector = 'body';
            }
            target = jQuery(this._targetSelector);
            target.append(this._overlay);
            me._setupSizeAndLocation();
            me._overlay.bind('click', function (event) {
                event.preventDefault();
            });
        },
        _setupSizeAndLocation: function () {
            "use strict";
            var me = this,
                target = jQuery(this._targetSelector);
            me._overlay.css({
                'left': "0px",
                'top': "0px",
                'width': target.width() + 'px',
                'height': target.height() + 'px'
            });
        },
        resize: function () {
            "use strict";
            var tmp = jQuery(this._targetSelector);
            this._overlay.height(tmp.height());
            this._overlay.width(tmp.width());
        },
        followResizing: function (useWindow) {
            "use strict";
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
            "use strict";
            this._overlay.remove();
            if (this._resizingWorkaround) {
                clearTimeout(this._resizingWorkaround);
            }
        },
        bindClickToClose: function () {
            "use strict";
            var me = this;
            me._overlay.bind('click', function () {
                me.close();
            });
        }
    });
