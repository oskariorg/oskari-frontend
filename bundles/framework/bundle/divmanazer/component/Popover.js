/* ===========================================================
 * bootstrap-tooltip.js v2.0.3 (with popover)
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */
! function ($) {
    "use strict";

    /* TOOLTIP PUBLIC CLASS DEFINITION
     * =============================== */

    var Tooltip = function (element, options) {
        this.init('oskariTooltip', element, options);
    },
        Popover = function (element, options) {
            this.init('oskariPopover', element, options);
        };

    Tooltip.prototype = {

        constructor: Tooltip,
        init: function (type, element, options) {
            var eventIn, eventOut;

            this.type = type;
            this.$element = $(element);
            this.options = this.getOptions(options);
            this.enabled = true;

            if (this.options.trigger !== 'manual') {
                eventIn = this.options.trigger === 'hover' ? 'mouseenter' : 'focus';
                eventOut = this.options.trigger === 'hover' ? 'mouseleave' : 'blur';
                this.$element.on(eventIn, this.options.selector, $.proxy(this.enter, this));
                this.$element.on(eventOut, this.options.selector, $.proxy(this.leave, this));
            }
            if (this.options.selector) {
                this._options = $.extend(
                    {},
                    this.options,
                    {
                        trigger: 'manual',
                        selector: ''
                    }
                );
            } else {
                this.fixTitle();
            }
        },
        getOptions: function (options) {
            options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data());

            if (options.delay && typeof options.delay === 'number') {
                options.delay = {
                    show: options.delay,
                    hide: options.delay
                };
            }

            return options;
        },
        enter: function (e) {
            var self = $(e.currentTarget)[this.type](this._options).data(this.type);

            if (!self.options.delay || !self.options.delay.show) {
                return self.show();
            }
            clearTimeout(this.timeout);
            self.hoverState = 'in';
            this.timeout = setTimeout(function () {
                if (self.hoverState === 'in') {
                    self.show();
                }
            }, self.options.delay.show);
        },
        leave: function (e) {
            var self = $(e.currentTarget)[this.type](this._options).data(this.type);

            if (!self.options.delay || !self.options.delay.hide) {
                return self.hide();
            }
            clearTimeout(this.timeout);
            self.hoverState = 'out';
            this.timeout = setTimeout(function () {
                if (self.hoverState === 'out') {
                    self.hide();
                }
            }, self.options.delay.hide);
        },
        show: function () {
            var $tip, inside, pos, actualWidth, actualHeight, placement, tp;

            if (this.hasContent() && this.enabled) {
                $tip = this.tip();
                this.setContent();

                if (this.options.animation) {
                    $tip.addClass('fade');
                }
                placement = /*typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement*/
                    this.options.placement.apply(this.options.scope);
                inside = /in/.test(placement);

                $tip.remove().css({
                    top: 0,
                    left: 0,
                    display: 'block'
                }).appendTo(inside ? this.$element : document.body);
                pos = this.getPosition(inside);
                actualWidth = $tip[0].offsetWidth;
                actualHeight = $tip[0].offsetHeight;

                switch (inside ? placement.split(' ')[1] : placement) {
                case 'bottom':
                    tp = {
                        top: pos.top + pos.height,
                        left: pos.left + pos.width / 2 - actualWidth / 2
                    };
                    break;
                case 'top':
                    tp = {
                        top: pos.top - actualHeight,
                        left: pos.left + pos.width / 2 - actualWidth / 2
                    };
                    break;
                case 'left':
                    tp = {
                        top: pos.top + pos.height / 2 - actualHeight / 2,
                        left: pos.left - actualWidth
                    };
                    break;
                case 'right':
                    tp = {
                        top: pos.top + pos.height / 2 - actualHeight / 2,
                        left: pos.left + pos.width
                    };
                    break;
                }

                $tip.css(tp).addClass(placement).addClass('in');

            }
        },
        isHTML: function (text) {
            // html string detection logic adapted from jQuery
            return typeof text !== 'string' || (text.charAt(0) === "<" && text.charAt(text.length - 1) === ">" && text.length >= 3) || /^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(text);
        },
        setContent: function () {
            var $tip = this.tip(),
                title = this.getTitle();
            $tip.find('.oskari-tooltip-inner')[this.isHTML(title) ? 'html' : 'text'](title);
            $tip.removeClass('fade in top bottom left right');
        },
        hide: function () {
            var $tip = this.tip();

            $tip.removeClass('in');

            function removeWithAnimation() {
                var timeout = setTimeout(function () {
                    $tip.off($.support.transition.end).remove();
                }, 500);

                $tip.one($.support.transition.end, function () {
                    clearTimeout(timeout);
                    $tip.remove();
                });
            }
            $.support.transition && this.$tip.hasClass('fade') ? removeWithAnimation() : $tip.remove();
        },
        fixTitle: function () {
            var $e = this.$element;
            if ($e.attr('title') || typeof ($e.attr('data-original-title')) !== 'string') {
                $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title');
            }
        },
        hasContent: function () {
            return this.getTitle();
        },
        getPosition: function (inside) {
            return $.extend({}, (inside ? {
                top: 0,
                left: 0
            } : this.$element.offset()), {
                width: this.$element[0].offsetWidth,
                height: this.$element[0].offsetHeight
            });
        },
        getTitle: function () {
            return this.options.title.apply(this.options.scope);
        },
        tip: function () {
            return this.$tip = this.$tip || $(this.options.template);
        },
        validate: function () {
            if (!this.$element[0].parentNode) {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        },
        enable: function () {
            this.enabled = true;
        },
        disable: function () {
            this.enabled = false;
        },
        toggleEnabled: function () {
            this.enabled = !this.enabled;
        },
        toggle: function () {
            this[this.tip().hasClass('in') ? 'hide' : 'show']();
        },
        attach: function ($el) {
            this.$element = $el;
        }
    };

    /* TOOLTIP PLUGIN DEFINITION
     * ========================= */

    $.fn.oskariTooltip = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('oskariTooltip'),
                options = typeof option === 'object' && option;
            if (!data) {
                $this.data('oskariTooltip', (data = new Tooltip(this, options)));
            }
            if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    $.fn.oskariTooltip.Constructor = Tooltip;

    $.fn.oskariTooltip.defaults = {
        animation: true,
        placement: 'top',
        selector: false,
        template: '<div class="oskari-tooltip"><div class="oskari-tooltip-arrow"></div><div class="oskari-tooltip-inner"></div></div>',
        trigger: 'hover',
        title: '',
        delay: 0
    };

    /* POPOVER PUBLIC CLASS DEFINITION
     * =============================== */

    /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     * ========================================== */

    Popover.prototype = $.extend({}, $.fn.oskariTooltip.Constructor.prototype, {

        constructor: Popover,
        setContent: function () {
            var $tip = this.tip(),
                title = this.getTitle(),
                content = this.getContent();

            $tip.find('.oskari-popover-title')[this.isHTML(title) ? 'html' : 'text'](title);
            $tip.find('.oskari-popover-content > *')[this.isHTML(content) ? 'html' : 'text'](content);

            $tip.removeClass('fade top bottom left right in');
        },
        hasContent: function () {
            return this.getTitle() || this.getContent();
        },
        getContent: function () {
            return this.options.content.apply(this.options.scope);
        },
        tip: function () {
            if (!this.$tip) {
                this.$tip = $(this.options.template);
            }
            return this.$tip;
        }
    });

    /* POPOVER PLUGIN DEFINITION
     * ======================= */

    $.fn.oskariPopover = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('oskariPopover'),
                options = typeof option === 'object' && option;
            if (!data) {
                $this.data('oskariPopover', (data = new Popover(this, options)));
            }
            if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    $.fn.oskariPopover.Constructor = Popover;

    $.fn.oskariPopover.defaults = $.extend({}, $.fn.oskariTooltip.defaults, {
        placement: 'right',
        content: '',
        template: '<div class="oskari-popover"><div class="oskari-arrow"></div><div class="oskari-popover-inner"><h3 class="oskari-popover-title"></h3><div class="oskari-popover-content"><p></p></div></div></div>'
    });

    /**
     * @class Oskari.userinterface.component.Popover
     */
    Oskari.clazz.define('Oskari.userinterface.component.Popover',

        /**
         * @method create called automatically on construction
         * @static
         *
         */

        function (title, content) {
            this.title = title;
            this.content = content;
            this.$container = null;
            this.data = null;
            this.shown = false;
            this.placement = 'bottom';

        }, {
            templates: {
                "container": '<div class="oskari-popover-container"/>'
            },
            hide: function () {
                if (!this.shown) {
                    return;
                }
                this.shown = false;
                if (!this.data) {
                    return;
                }
                this.data.hide();
            },
            show: function () {
                if (this.shown) {
                    return;
                }
                if (!this.data) {
                    return;
                }
                this.data.show();
                this.shown = true;
            },
            attachTo: function (element) {
                var me = this;
                me.$container = $(element);
                if (!me.data) {
                    me.data = new Popover(element, {
                        'scope': me,
                        'title': me.getTitle,
                        'content': me.getContent,
                        'trigger': 'manual',
                        'placement': me.getPlacement
                    });

                } else {
                    me.data.attach(me.$container);
                }
                me.$container.data('oskariPopover', me.data);
            },
            getTitle: function () {
                return this.title;
            },
            getContent: function () {
                return this.content;
            },
            setContent: function (content, title) {
                var me = this;
                me.hide();
                me.content = content;
                if (title) {
                    me.title = title;
                }
                me.show();
            },
            setTitle: function (title, content) {
                var me = this;
                me.hide();
                me.title = title;
                if (content) {
                    me.content = content;
                }
                me.show();
            },
            setPlacement: function (p) {
                this.placement = p;
            },
            getPlacement: function () {
                return this.placement;
            }
        });

}(window.jQuery);
