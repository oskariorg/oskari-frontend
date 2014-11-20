/**
 * @class Oskari.userinterface.component.ProgressSpinner
 *
 * Adaptation of MIT licensed Spinner
 *
 *  http://fgnass.github.com/spin.js/
 *
 */
Oskari.clazz.define('Oskari.userinterface.component.ProgressSpinner',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.container = undefined;
        this.opts = undefined;
    }, {
        /**
         * @static
         * @property __opts default opts for spinner
         */
        __opts: {
            // The number of lines to draw
            lines: 15,
            // The length of each line
            length: 0,
            // The line thickness
            width: 5,
            // The radius of the inner circle
            radius: 16,
            // Corner roundness (0..1)
            corners: 0,
            // The rotation offset
            rotate: 0,
            // #rgb or #rrggbb
            color: '#000',
            // Rounds per second
            speed: 0.6,
            // Afterglow percentage
            trail: 59,
            // Whether to render a shadow
            shadow: false,
            // Whether to use hardware acceleration
            hwaccel: false,
            // The CSS class to assign to the spinner
            className: 'spinner',
            // The z-index (defaults to 2000000000)
            zIndex: 2e9,
            // Top position relative to parent in px
            top: 'auto',
            // Left position relative to parent in px
            left: 'auto'
        },

        /**
         * @method insertTo
         * @param el jQuery element to append the spinner to
         * @param opts spinner options
         * @see  http://fgnass.github.com/spin.js/
         */
        insertTo: function (el, opts) {
            this.container = el;
            this.opts = opts || this.__opts;
        },

        /**
         * @method start
         * starts spinner spin
         */
        start: function () {
            var el = this.container,
                $el = $(el),
                data = $el.data(),
                Spinner = this._Spinner,
                opts = this.opts;

            if (data.spinner) {
                data.spinner.stop();
                delete data.spinner;
            }
            if (opts !== false) {
                data.spinner = new Spinner($.extend({
                    color: $el.css('color')
                }, opts)).spin($el.get()[0]);
            }
        },

        /**
         * @method stop
         * stops spinner spin
         */
        stop: function () {
            var el = this.container,
                $el,
                data;
            if (!el) {
                return;
            }
            $el = $(el);
            data = $el.data();
            if (data.spinner) {
                data.spinner.stop();
                delete data.spinner;
            }
        },
        _Spinner: (function (window, document) {
            //fgnass.github.com/spin.js#v1.2.8

            /**
             * Copyright (c) 2011 Felix Gnass [fgnass at neteye dot de]
             * Licensed under the MIT license
             */

            /* Vendor prefixes */
            var prefixes = ['webkit', 'Moz', 'ms', 'O'],
                /* Animation rules keyed by their name */
                animations = {},
                useCssAnimations,
                sheet,
                defaults = {
                    lines: 12, // The number of lines to draw
                    length: 7, // The length of each line
                    width: 5, // The line thickness
                    radius: 10, // The radius of the inner circle
                    rotate: 0, // Rotation offset
                    corners: 1, // Roundness (0..1)
                    color: '#000', // #rgb or #rrggbb
                    speed: 1, // Rounds per second
                    trail: 100, // Afterglow percentage
                    opacity: 1 / 4, // Opacity of the lines
                    fps: 20, // Frames per second when using setTimeout()
                    zIndex: 2e9, // Use a high z-index by default
                    className: 'spinner', // CSS class to assign to the element
                    top: 'auto', // center vertically
                    left: 'auto', // center horizontally
                    position: 'relative' // element position
                };

            /**
             * Utility function to create elements. If no tag name is given,
             * a DIV is created. Optionally properties can be passed.
             */
            function createEl(tag, prop) {
                var el = document.createElement(tag || 'div'),
                    n;

                for (n in prop) {
                    if (prop.hasOwnProperty(n)) {
                        el[n] = prop[n];
                    }
                }
                return el;
            }

            /**
             * Appends children and returns the parent.
             */
            function ins(parent) {
                var i, n;
                for (i = 1, n = arguments.length; i < n; i += 1) {
                    parent.appendChild(arguments[i]);
                }

                return parent;
            }

            /**
             * Insert a new stylesheet to hold the @keyframe or VML rules.
             */
            sheet = function () {
                var el = createEl('style', {
                    type: 'text/css'
                });
                ins(document.getElementsByTagName('head')[0], el);
                return el.sheet || el.styleSheet;
            }();

            /**
             * Creates an opacity keyframe animation rule and returns its name.
             * Since most mobile Webkits have timing issues with animation-delay,
             * we create separate rules for each line/segment.
             */
            function addAnimation(alpha, trail, i, lines) {
                var name = ['opacity', trail, ~~(alpha * 100), i, lines].join('-'),
                    start = 0.01 + i / lines * 100,
                    z = Math.max(1 - (1 - alpha) / trail * (100 - start), alpha),
                    prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase(),
                    pre = prefix && '-' + prefix + '-' || '';

                if (!animations[name]) {
                    sheet.insertRule('@' + pre + 'keyframes ' + name + '{' + '0%{opacity:' + z + '}' + start + '%{opacity:' + alpha + '}' + (start + 0.01) + '%{opacity:1}' + (start + trail) % 100 + '%{opacity:' + alpha + '}' + '100%{opacity:' + z + '}' + '}', sheet.cssRules.length);

                    animations[name] = 1;
                }
                return name;
            }

            /**
             * Tries various vendor prefixes and returns the first supported property.
             **/
            function vendor(el, prop) {
                var s = el.style,
                    pp,
                    i;

                if (s[prop] !== undefined) {
                    return prop;
                }
                prop = prop.charAt(0).toUpperCase() + prop.slice(1);
                for (i = 0; i < prefixes.length; i += 1) {
                    pp = prefixes[i] + prop;
                    if (s[pp] !== undefined) {
                        return pp;
                    }
                }
            }

            /**
             * Sets multiple style properties at once.
             */

            function css(el, prop) {
                var n;
                for (n in prop) {
                    if (prop.hasOwnProperty(n)) {
                        el.style[vendor(el, n) || n] = prop[n];
                    }
                }

                return el;
            }

            /**
             * Fills in default values.
             */

            function merge(obj) {
                var def,
                    n,
                    i;
                for (i = 1; i < arguments.length; i += 1) {
                    def = arguments[i];
                    for (n in def) {
                        if (def.hasOwnProperty(n)) {
                            if (obj[n] === undefined) {
                                obj[n] = def[n];
                            }
                        }
                    }
                }
                return obj;
            }

            /**
             * Returns the absolute page-offset of the given element.
             */

            function pos(el) {
                var o = {
                    x: el.offsetLeft,
                    y: el.offsetTop
                };
                while ((el = el.offsetParent)) {
                    o.x += el.offsetLeft;
                    o.y += el.offsetTop;
                }

                return o;
            }

            /** The constructor */

            function Spinner(o) {
                if (!this.spin) {
                    return new Spinner(o);
                }
                this.opts = merge(o || {}, Spinner.defaults, defaults);
            }


            Spinner.defaults = {};

            merge(Spinner.prototype, {
                spin: function (target) {
                    this.stop();
                    var self = this,
                        o = self.opts,
                        el = self.el = css(createEl(0, {
                            className: o.className
                        }), {
                            position: o.position,
                            width: 0,
                            zIndex: o.zIndex
                        }),
                        mid = o.radius + o.length + o.width,
                        ep, // element position
                        tp, // target position
                        i,
                        fps,
                        f,
                        ostep,
                        astep;

                    if (target) {
                        target.insertBefore(el, target.firstChild || null);
                        tp = pos(target);
                        ep = pos(el);
                        css(el, {
                            left: (o.left === 'auto' ? tp.x - ep.x + (target.offsetWidth >> 1) : parseInt(o.left, 10) + mid) + 'px',
                            top: (o.top === 'auto' ? tp.y - ep.y + (target.offsetHeight >> 1) : parseInt(o.top, 10) + mid) + 'px'
                        });
                    }

                    el.setAttribute('aria-role', 'progressbar');
                    self.lines(el, self.opts);

                    if (!useCssAnimations) {
                        // No CSS animation support, use setTimeout() instead
                        i = 0;
                        fps = o.fps;
                        f = fps / o.speed;
                        ostep = (1 - o.opacity) / (f * o.trail / 100);
                        astep = f / o.lines;
                        (function anim() {
                            var s,
                                alpha;
                            i += 1;
                            for (s = o.lines; s; s -= 1) {
                                alpha = Math.max(1 - (i + s * astep) % f * ostep, o.opacity);
                                self.opacity(el, o.lines - s, alpha, o);
                            }
                            self.timeout = self.el && setTimeout(anim, ~~(1000 / fps));
                        })();
                    }
                    return self;
                },
                stop: function () {
                    var el = this.el;
                    if (el) {
                        clearTimeout(this.timeout);
                        if (el.parentNode) {
                            el.parentNode.removeChild(el);
                        }
                        this.el = undefined;
                    }
                    return this;
                },
                lines: function (el, o) {
                    var i,
                        seg;

                    function fill(color, shadow) {
                        return css(createEl(), {
                            position: 'absolute',
                            width: (o.length + o.width) + 'px',
                            height: o.width + 'px',
                            background: color,
                            boxShadow: shadow,
                            transformOrigin: 'left',
                            transform: 'rotate(' + ~~(360 / o.lines * i + o.rotate) + 'deg) translate(' + o.radius + 'px' + ',0)',
                            borderRadius: (o.corners * o.width >> 1) + 'px'
                        });
                    }

                    for (i = 0; i < o.lines; i += 1) {
                        seg = css(createEl(), {
                            position: 'absolute',
                            top: 1 + ~(o.width / 2) + 'px',
                            transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
                            opacity: o.opacity,
                            animation: useCssAnimations && addAnimation(o.opacity, o.trail, i, o.lines) + ' ' + 1 / o.speed + 's linear infinite'
                        });

                        if (o.shadow) {
                            ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {
                                top: 2 + 'px'
                            }));
                        }
                        ins(el, ins(seg, fill(o.color, '0 0 1px rgba(0,0,0,.1)')));
                    }
                    return el;
                },
                opacity: function (el, i, val) {
                    if (i < el.childNodes.length) {
                        el.childNodes[i].style.opacity = val;
                    }
                }
            });

            /////////////////////////////////////////////////////////////////////////
            // VML rendering for IE
            /////////////////////////////////////////////////////////////////////////

            /**
             * Check and init VML support
             */
            (function () {

                function vml(tag, attr) {
                    return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr);
                }

                var ss = css(createEl('group'), {
                    behavior: 'url(#default#VML)'
                });

                if (!vendor(ss, 'transform') && ss.adj) {

                    // VML support detected. Insert CSS rule ...
                    sheet.addRule('.spin-vml', 'behavior:url(#default#VML)');

                    Spinner.prototype.lines = function (el, o) {
                        var r = o.length + o.width,
                            s = 2 * r,
                            margin,
                            g,
                            i;

                        function grp() {
                            return css(vml('group', {
                                coordsize: s + ' ' + s,
                                coordorigin: -r + ' ' + -r
                            }), {
                                width: s,
                                height: s
                            });
                        }

                        margin = -(o.width + o.length) * 2 + 'px';
                        g = css(grp(), {
                            position: 'absolute',
                            top: margin,
                            left: margin
                        });

                        function seg(i, dx, filter) {
                            ins(g, ins(css(grp(), {
                                rotation: 360 / o.lines * i + 'deg',
                                left: ~~dx
                            }), ins(css(vml('roundrect', {
                                    arcsize: o.corners
                                }), {
                                    width: r,
                                    height: o.width,
                                    left: o.radius,
                                    top: -o.width >> 1,
                                    filter: filter
                                }), vml('fill', {
                                    color: o.color,
                                    opacity: o.opacity
                                }), vml('stroke', {
                                    opacity: 0
                                }) // transparent stroke to fix color bleeding upon opacity change
                            )));
                        }

                        if (o.shadow) {
                            for (i = 1; i <= o.lines; i += 1) {
                                seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)');
                            }
                        }
                        for (i = 1; i <= o.lines; i += 1) {
                            seg(i);
                        }
                        return ins(el, g);
                    };

                    Spinner.prototype.opacity = function (el, i, val, o) {
                        var c = el.firstChild;
                        o = (o.shadow && o.lines) || 0;
                        if (c && i + o < c.childNodes.length) {
                            c = c.childNodes[i + o];
                            c = c && c.firstChild;
                            c = c && c.firstChild;
                            if (c) {
                                c.opacity = val;
                            }
                        }
                    };
                } else {
                    useCssAnimations = vendor(ss, 'animation');
                }
            })();

            return Spinner;
        })(window, document)
    });
