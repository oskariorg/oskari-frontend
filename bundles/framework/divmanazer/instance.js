/**
 * @class Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance
 *
 * Default DIV Manager implementation handles menu like and detached DIVs
 * handles hiding showing DIVS.
 * Draggability is enabled in top-border element when DIV is detached
 *
 */
Oskari.clazz.define('Oskari.userinterface.bundle.ui.UserInterfaceBundleInstance',

    /**
     * @method init called on constructing this instance
     */

    function () {
        this.sandbox = null;

        /**
         * @property requestHandlers
         */
        this.requestHandlers = {};

        this.extensions = [];
        this.extensionsByName = {};

        /**
         * @property compiledTemplates
         *
         * HTML templates 'compiled' with jQuery - HTML code in static property templates
         */
        this.compiledTemplates = {};

        /**
         * @property flyoutContainer (document.body)
         */
        this.flyoutContainer = null;

        /**
         * @property tileContainer (#menubar)
         */
        this.tileContainer = null;

        /**
         * @property flyoutZIndexBase
         */
        this.flyoutZIndexBase = 20000;

        /**
         * @property menubarContainerId
         */
        this.menubarContainerId = '#menubar';
    }, {

        getName: function () {
            return 'userinterface.DivManazer';
        },

        init: function (sandbox) {

        },

        getExtensionByName: function (name) {
            return this.extensionsByName[name];
        },

        /**
         * @method getSandbox
         */
        getSandbox: function () {
            return this.sandbox;
        },

        /**
         * @method start
         *
         * implements BundleInstance start methdod
         *
         * creates tile and flyout compiledTemplates
         * creates and registers request handlers
         *
         */
        start: function () {
            /*
             * setup templates
             */
            this.compileTemplates();

            /*
             * setup requests and handlers
             */
            var me = this,
                conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);

            me.sandbox = sandbox;

            me.flyoutContainer = jQuery(document.body);

            me.tileContainer = jQuery(me.menubarContainerId);
            me.tileContainer.addClass('oskari-tile-container');

            me.sandbox.register(me);

            me.requestHandlers.add = Oskari.clazz.create(
                'Oskari.userinterface.bundle.ui.request.AddExtensionRequestHandler',
                me
            );
            me.requestHandlers.remove = Oskari.clazz.create(
                'Oskari.userinterface.bundle.ui.request.RemoveExtensionRequestHandler',
                me
            );
            me.requestHandlers.update = Oskari.clazz.create(
                'Oskari.userinterface.bundle.ui.request.UpdateExtensionRequestHandler',
                me
            );

            sandbox.requestHandler(
                'userinterface.AddExtensionRequest',
                me.requestHandlers.add
            );
            sandbox.requestHandler(
                'userinterface.RemoveExtensionRequest',
                me.requestHandlers.remove
            );
            sandbox.requestHandler(
                'userinterface.UpdateExtensionRequest',
                me.requestHandlers.update
            );

            me.requestHandlers.modal = Oskari.clazz.create(
                'Oskari.userinterface.bundle.ui.request.ModalDialogRequestHandler',
                me
            );
            sandbox.requestHandler(
                'userinterface.ModalDialogRequest',
                me.requestHandlers.modal
            );

            /* removed for some reason or another */
            // sandbox.registerAsStateful(me.mediator.bundleId, me);
        },

        /**
         * @method update
         *
         * implements bundle instance update method
         */
        update: function () {

        },

        /**
         * @method stop
         * implements bundle instance stop method
         * removes request handlers
         */
        stop: function () {
            this.sandbox.requestHandler(
                'userinterface.UpdateExtensionRequest',
                null
            );

            this.sandbox.removeRequestHandler(
                'userinterface.RemoveExtensionRequest',
                this.requestHandlers.remove
            );

            this.sandbox.removeRequestHandler(
                'userinterface.AddExtensionRequest',
                this.requestHandlers.add
            );

            this.sandbox.removeRequestHandler(
                'userinterface.ModalDialogRequest',
                this.requestHandlers.modal
            );

            // this.sandbox.unregisterStateful(this.mediator.bundleId);

            this.sandbox.unregister(this);
            this.started = false;
        },
        getMapdivOffset: function () {
            var mapdiv = jQuery('#mapdiv');
            return {
                'top': mapdiv.offset().top,
                'left': mapdiv.offset().left
            };
        },
        /**
         * HTML templates
         */
        templates: {

            /* menu tile */
            'Oskari.userinterface.Tile':
                '<div class="oskari-tile oskari-tile-closed">' +
                '    <div class="oskari-tile-title"></div>' +
                '    <div class="oskari-tile-status"></div>' +
                '</div>',

            /* view */
            'Oskari.userinterface.View': '<div class="oskari-view"></div>'

        },

        /**
         * @method compileTemplates
         *
         * creates jQuery template to be cloned to any menubar Tiles
         */
        compileTemplates: function () {
            /**
             * Templates
             */
            var me = this;

            me.compiledTemplates['Oskari.userinterface.Tile'] = jQuery(
                me.templates['Oskari.userinterface.Tile']
            );

            me.compiledTemplates['Oskari.userinterface.View'] = jQuery(
                me.templates['Oskari.userinterface.View']
            );
        },

        /**
         * @method addExtension
         *
         * adds extension to Oskari DIV Manager in response to a
         * AddExtensionRequest
         */
        addExtension: function (extension) {
            var me = this,
                plugins,
                extensions,
                extensionsByName,
                extensionInfo,
                count,
                name,
                flyoutPlugin,
                el,
                tilePlugin,
                tile,
                viewPlugin,
                view;

            extension.startExtension();

            plugins = extension.getPlugins();

            extensions = me.extensions;
            extensionsByName = me.extensionsByName;

            extensionInfo = {
                state: 'close',
                extension: extension,
                draggable: null,
                draggableTarget: null,
                draggableHandle: null,
                viewState: {},
                extensionUpdatedEvent: null,
                plugins: {}
            };

            extensionInfo.extensionUpdatedEvent = Oskari.eventBuilder('userinterface.ExtensionUpdatedEvent')(extension, extensionInfo.state);

            count = extensions.length;
            name = extension.getName();

            flyoutPlugin = plugins['Oskari.userinterface.Flyout'];
            if (flyoutPlugin !== null && flyoutPlugin !== undefined) {
                const flyout = me.createFlyout(extension, flyoutPlugin, count, extensionInfo);
                const flyoutElem = flyout.getElement();
                const contentElem = flyout.getContent();

                flyoutPlugin.setEl(contentElem.get(), flyoutElem);

                me.flyoutContainer.append(flyoutElem);

                flyoutPlugin.startPlugin();

                extensionInfo.plugins['Oskari.userinterface.Flyout'] = {
                    plugin: flyoutPlugin,
                    flyout,
                    el: flyoutElem
                };
            }

            tilePlugin = plugins['Oskari.userinterface.Tile'];
            tile = null;
            if (tilePlugin !== null && tilePlugin !== undefined) {
                tile = me.createTile(extension, tilePlugin, count, extensionInfo);

                tilePlugin.startPlugin();

                tile.fadeIn(200);

                me.tileContainer.append(tile);
            }

            viewPlugin = plugins['Oskari.userinterface.View'];
            view = null;
            if (viewPlugin !== null && viewPlugin !== undefined) {
                view = me.createView(extension, viewPlugin, count, extensionInfo);
                el = view;
                viewPlugin.setEl(el.get());
                viewPlugin.startPlugin();
            }

            /*
             * store these for further usage
             */

            if (tilePlugin) {
                extensionInfo.plugins['Oskari.userinterface.Tile'] = {
                    plugin: tilePlugin,
                    el: tile
                };
            }
            if (viewPlugin) {
                extensionInfo.plugins['Oskari.userinterface.View'] = {
                    plugin: viewPlugin,
                    el: view
                };
            }

            extensions.push(extensionInfo);
            extensionsByName[name] = extensionInfo;

            return extensionInfo;
        },

        /**
         * @method _applyDraggableToFlyout
         * applies draggable handle to flyouts title bar
         */
        _applyDraggableToFlyout: function (flyout, extensionInfo, cls) {
            const me = this;
            const handle = flyout.children(cls).get()[0];
            const flyoutTarget = flyout.get()[0];
            const useHelper = false;
            let el;
            let helperFn;
            if (useHelper) {
                // note! useHelper is always false
                // not sure why this is here...
                helperFn = function () {
                    el = jQuery('<div />');

                    el.css('width', flyout.css('width'));
                    el.css('height', flyout.css('height'));
                    el.css('border', '2px solid rgba(0,0,0,.5)');
                    el.css('z-index', flyout.css('z-index'));

                    return el;
                };
            }
            extensionInfo.draggableHandle = handle;
            extensionInfo.draggableTarget = flyoutTarget;

            extensionInfo.draggable = jQuery(flyout).draggable({
                handle: jQuery(handle),
                helper: useHelper ? helperFn : null,
                scroll: false,
                stack: '.oskari-flyout',
                create: function (event, ui) {},

                start: function () {
                    if (useHelper) {
                        flyout.css('display', 'none');
                    }
                },

                drag: function () {

                },

                stop: function (event, ui) {
                    var viewState;
                    if (useHelper) {
                        flyout.css('top', ui.helper.css('top'));
                        flyout.css('left', ui.helper.css('left'));
                    }
                    me.shuffleZIndices(flyout);
                    if (useHelper) {
                        flyout.css('display', '');
                    }
                    viewState = me.getFlyoutViewState(flyout, 'detach');

                    extensionInfo.viewState = viewState;
                    me.notifyExtensionViewStateChange(extensionInfo);
                }
            });
        },

        /**
         * @method createTile
         *
         * creates menubar tile using the tile template
         */
        createTile: function (extension, plugin, count, extensionInfo) {
            var me = this,
                // container = jQuery('#menubar'),
                tile = this.compiledTemplates['Oskari.userinterface.Tile'].clone(true, true),
                tilePlugin = extension.plugins['Oskari.userinterface.Tile'],
                title = tile.children('.oskari-tile-title'),
                tileClick = function () {
                    // plugin.setExtensionState();
                    tile.off('click');
                    if (tilePlugin.clickHandler) {
                        tilePlugin.clickHandler(extensionInfo.state);
                    } else {
                        me.getSandbox().postRequestByName(
                            'userinterface.UpdateExtensionRequest', [extension, 'toggle']
                        );
                    }
                    window.setTimeout(
                        function () {
                            tile.on('click', tileClick);
                        },
                        500
                    );
                };
            // status;
            title.append(plugin.getTitle());
            // status = tile.children('.oskari-tile-status');

            tile.on('click', tileClick);

            plugin.setEl(tile.get());

            return tile;
        },

        /**
         * @method createFlyout
         *
         * creates flyout DIV using the ExtraFlyout extension
         * adds a bunch of tools to the DIV toolbar, sets default position and makes flyout draggable
         *
         */
        createFlyout: function (extension, plugin, count, extensionInfo) {
            var me = this;
            const { top, left } = this.getFlyoutDefaultPositions().attach;
            var flyoutOpts = {
                isExtension: true,
                top: parseInt(top),
                left: parseInt(left)
            };
            const flyout = Oskari.clazz.create('Oskari.userinterface.extension.ExtraFlyout', plugin.getTitle(), flyoutOpts);
            const elem = flyout.getElement();

            const toolage = {
                attach: elem.find('.oskari-flyouttool-attach'),
                detach: elem.find('.oskari-flyouttool-detach'),
                minimize: elem.find('.oskari-flyouttool-minimize'),
                restore: elem.find('.oskari-flyouttool-restore'),
                close: elem.find('.oskari-flyouttool-close'),
                help: elem.find('.oskari-flyouttool-help')
            };

            toolage.detach.on('click', function () {
                me.getSandbox().postRequestByName(
                    'userinterface.UpdateExtensionRequest',
                    [extension, 'detach']
                );
            });
            toolage.attach.on('click', function () {
                me.getSandbox().postRequestByName(
                    'userinterface.UpdateExtensionRequest',
                    [extension, 'attach']
                );
            });
            toolage.minimize.on('click', function () {
                me.getSandbox().postRequestByName(
                    'userinterface.UpdateExtensionRequest',
                    [extension, 'minimize']
                );
            });
            toolage.restore.on('click', function () {
                me.getSandbox().postRequestByName(
                    'userinterface.UpdateExtensionRequest',
                    [extension, 'restore']
                );
            });
            toolage.close.on('click', function () {
                me.getSandbox().postRequestByName(
                    'userinterface.UpdateExtensionRequest',
                    [extension, 'close']
                );
            });
            toolage.help.on('click', function () {
                me.getSandbox().postRequestByName(
                    'userguide.ShowUserGuideRequest',
                    [{
                        placement: 'bottom',
                        el: toolage.help,
                        extension: extension.getName(),
                        toggle: true
                    }]
                );
            });
            return flyout;
        },

        /**
         * @method createFlyout
         *
         * creates flyout DIV using the flyout template adds a bunch
         * of tools to the DIV toolbar
         *
         */
        createView: function (extension, plugin, count, extensionInfo) {
            var me = this,
                view = me.compiledTemplates['Oskari.userinterface.View'].clone(true, true);

            return view;
        },

        /**
         * @method removeExtension TBD
         */
        removeExtension: function (extension) {
            /*
             * to-do:
             * - remove tile
             * - remove flyout
             */

            var me = this,
                extensions = me.extensions,
                extensionsByName = this.extensionsByName,
                extensionInfo = extensionsByName[extension.getName()],
                // extensionState = extensionInfo.state,
                flyoutInfo = extensionInfo.plugins['Oskari.userinterface.Flyout'],
                flyoutPlugin,
                flyout,
                ops,
                closeOp,
                tileInfo,
                // tilePlugin,
                tile,
                after,
                n,
                len;

            if (flyoutInfo) {
                flyoutPlugin = flyoutInfo.plugin;
                flyout = flyoutInfo.el;

                ops = this.flyoutOps;
                closeOp = ops.close;

                closeOp.apply(this, [flyout, flyoutPlugin, extensionInfo]);

                flyout.remove();
            }

            tileInfo = extensionInfo.plugins['Oskari.userinterface.Tile'];
            if (tileInfo) {
                // tilePlugin = tileInfo.plugin;
                tile = tileInfo.el;

                tile.remove();
            }

            extensionsByName[extension.getName()] = null;

            after = [];

            for (n = 0, len = extensions.length; n < len; n += 1) {
                if (extensions[n] !== extensionInfo) {
                    after.push(extensions[n]);
                }
            }

            me.extensions = after;

            extension.stopExtension();
        },

        /**
         * @method updateExtension updates extension state
         *
         */
        updateExtension: function (extension, request) {
            var me = this,
                extensions = me.extensions,
                i,
                extensionsByName,
                extensionInfo,
                extensionState,
                state,
                ops,
                op,
                flyoutInfo,
                closeOp,
                n,
                otherExtensionInfo,
                otherState,
                plgnfo,
                otherFlyoutInfo,
                otherFlyoutPlugin,
                otherFlyout,
                otherTileInfo,
                otherTile,
                flyoutPlugin,
                flyout,
                tileInfo,
                tile,
                viewInfo,
                viewPlugin,
                view,
                len;

            if (!extension) {
                // if extension not spesified, do it for all
                for (i = 0; i < extensions.length; i += 1) {
                    this.updateExtension(extensions[i].extension, request);
                }
                return;
            }
            extensionsByName = this.extensionsByName;
            extensionInfo = extensionsByName[extension.getName()];
            if (!extensionInfo) {
                // tried to control non-existing extension
                return;
            }
            extensionState = extensionInfo.state;

            state = request.getState();

            if (state === 'toggle') {
                if (extensionState === 'close') {
                    state = 'attach';
                } else if (extensionState === 'attach') {
                    state = 'close';
                } else if (extensionState === 'detach') {
                    state = 'minimize';
                } else if (extensionState === 'minimize') {
                    state = 'restore';
                } else if (extensionState === 'restore') {
                    state = 'minimize';
                } else if (extensionState === 'hide') {
                    state = 'attach';
                }
            }

            flyoutInfo = extensionInfo.plugins['Oskari.userinterface.Flyout'];

            /* opening extension 'attached' closes previously attachily opened extensions (tile, flyout) */
            if (state === 'attach') {
                ops = me.flyoutOps;
                closeOp = ops.close;
                for (n = 0, len = extensions.length; n < len; n += 1) {
                    otherExtensionInfo = extensions[n];
                    if (otherExtensionInfo === extensionInfo) {
                        continue;
                    }
                    if (otherExtensionInfo.state !== 'attach' && otherExtensionInfo.state !== 'hide') {
                        continue;
                    }

                    otherState = 'close';

                    plgnfo = otherExtensionInfo.plugins;
                    otherFlyoutInfo = plgnfo['Oskari.userinterface.Flyout'];
                    if (otherFlyoutInfo) {
                        otherFlyoutPlugin = otherFlyoutInfo.plugin;
                        otherFlyout = otherFlyoutInfo.el;
                        closeOp.apply(this, [otherFlyout, otherFlyoutPlugin, otherExtensionInfo]);
                    }
                    otherTileInfo = plgnfo['Oskari.userinterface.Tile'];
                    if (otherTileInfo) {
                        otherTile = otherTileInfo.el;
                        me.applyTransition(otherTile, otherState, me.tileTransitions);
                    }
                    otherExtensionInfo.state = otherState;
                    me.notifyExtensionViewStateChange(otherExtensionInfo);
                }
            }
            var extLocation = function (request, me, axis) {
                if (request.getExtensionLocation().top || request.getExtensionLocation().left) {
                    me.origExtensionLocation = {};
                }
                if (me.origExtensionLocation) {
                    if (request.getExtensionLocation()[axis]) {
                        me.origExtensionLocation[axis] = jQuery(flyoutInfo.el).css(axis);
                        jQuery(flyoutInfo.el).css(axis, request.getExtensionLocation()[axis] + 'px');
                    } else if (me.origExtensionLocation[axis]) {
                        jQuery(flyoutInfo.el).css(axis, me.origExtensionLocation[axis]);
                    }
                }
            };

            /* let's transition flyout if one exists */
            if (flyoutInfo) {
                flyoutPlugin = flyoutInfo.plugin;
                flyout = flyoutInfo.el;
                if (state === 'attach') {
                    extLocation(request, me, 'top');
                    extLocation(request, me, 'left');
                    // if flyout plugin has a lazyRender created, use it.
                    if (flyoutPlugin.lazyRender) {
                        flyoutPlugin.lazyRender();
                    }
                }

                /**
                 * do the op for this extension
                 */
                ops = me.flyoutOps;
                op = ops[state];
                op.apply(
                    this,
                    [flyout, flyoutPlugin, extensionInfo, extensions]
                );
            }

            /* let's transition menu tile if one exists */
            tileInfo = extensionInfo.plugins['Oskari.userinterface.Tile'];
            if (tileInfo) {
                tile = tileInfo.el;

                me.applyTransition(tile, state, me.tileTransitions);
            }

            /* let's transition menu tile if one exists */
            viewInfo = extensionInfo.plugins['Oskari.userinterface.View'];
            if (viewInfo) {
                viewPlugin = viewInfo.plugin;
                view = viewInfo.el;

                ops = me.viewOps;
                op = ops[state];
                if (op) {
                    op.apply(
                        this,
                        [view, viewPlugin, extensionInfo, extensions]
                    );
                }
            }

            extensionInfo.state = state;

            me.notifyExtensionViewStateChange(extensionInfo);
        },

        /**
         * @method notifyExtensionViewStateChange
         */
        notifyExtensionViewStateChange: function (extensionInfo) {
            var evt = extensionInfo.extensionUpdatedEvent;

            evt.setViewState(extensionInfo.state);
            evt.setViewInfo(extensionInfo.viewState);

            this.sandbox.notifyAll(evt, true);
        },
        getFlyoutDefaultPositions: function () {
            return {
                detach: {
                    left: '212px',
                    top: '50px'
                },
                attach: {
                    left: this.getMapdivOffset().left,
                    top: '30px'
                }
            };
        },
        /*
         * @static @property validStates
         */
        validStates: {
            attach: {
                attach: true,
                detach: false,
                close: false,
                minimize: false,
                restore: false,
                drawer: false,
                sidebar: false
            },
            detach: {
                attach: false,
                detach: true,
                close: false,
                minimize: false,
                restore: false,
                drawer: false,
                sidebar: false
            },
            minimize: {
                attach: true,
                detach: true,
                close: false,
                minimize: true,
                restore: false,
                drawer: false,
                sidebar: false
            },
            restore: {
                attach: false,
                detach: true,
                close: false,
                minimize: false,
                restore: true,
                drawer: false,
                sidebar: false
            },
            close: {
                attach: false,
                detach: false,
                close: true,
                minimize: false,
                restore: false,
                drawer: false,
                sidebar: false
            },
            drawer: {
                attach: false,
                detach: false,
                close: false,
                minimize: false,
                restore: false,
                drawer: true,
                sidebar: false
            },
            sidebar: {
                attach: false,
                detach: false,
                close: false,
                minimize: false,
                restore: false,
                drawer: false,
                sidebar: true
            }
        },
        /**
         * @static @property tileTransitions
         * CSS transitions for menu tiles
         */
        tileTransitions: {
            attach: {
                'oskari-tile-attached': true,
                'oskari-tile-detached': false,
                'oskari-tile-closed': false
            },
            detach: {
                'oskari-tile-attached': false,
                'oskari-tile-detached': true,
                'oskari-tile-minimized': false,
                'oskari-tile-closed': false
            },
            minimize: {
                'oskari-tile-minimized': true,
                'oskari-tile-closed': false,
                'oskari-tile-detached': false
            },
            restore: {
                'oskari-tile-minimized': false,
                'oskari-tile-detached': true
            },
            close: {
                'oskari-tile-closed': true,
                'oskari-tile-attached': false,
                'oskari-tile-detached': false
            }
        },

        /**
         * @static @property flyoutTransitions
         * CSS transitions for flyouts
         */
        flyoutTransitions: {
            attach: {
                'oskari-attached': true,
                'oskari-detached': false,
                'oskari-closed': false,
                'oskari-hidden': false
            },
            detach: {
                'oskari-attached': false,
                'oskari-detached': true,
                'oskari-closed': false
            },
            minimize: {
                'oskari-minimized': true,
                'oskari-closed': false,
                'oskari-detached': false
            },
            restore: {
                'oskari-minimized': false,
                'oskari-closed': false,
                'oskari-detached': true,
                'oskari-attached': false
            },
            close: {
                'oskari-closed': true,
                'oskari-minimized': false,
                'oskari-detached': false,
                'oskari-attached': false,
                'oskari-hidden': false
            },
            hide: {
                'oskari-attached': true,
                'oskari-detached': false,
                'oskari-closed': false,
                'oskari-hidden': true
            }

        },

        /**
         * @method applyTransition
         * adds and removes CSS classes from element
         *
         */
        applyTransition: function (obj, state, transitions) {
            var transition = transitions[state],
                t;

            if (!transition) {
                return;
            }
            for (t in transition) {
                if (transition.hasOwnProperty(t)) {
                    if (transition[t]) {
                        obj.addClass(t);
                    } else {
                        obj.removeClass(t);
                    }
                }
            }
        },

        /**
         * @method getFlyoutViewState
         *
         */
        getFlyoutViewState: function (flyout, state) {
            var viewState = {
                left: flyout.css('left'),
                top: flyout.css('top'),
                width: flyout.width(),
                height: flyout.height(),
                'z-index': flyout.css('z-index'),
                viewState: state
            };
            return viewState;
        },

        /**
         * @static @property flyoutOps a set of (jQuery) operations to be
         *           performed on flyout to
         *           show/hide/minimize/restore/attach/detach
         */
        flyoutOps: {
            /** @method detach */
            detach: function (el, flyoutPlugin, extensionInfo, extensions) {
                const flyout = extensionInfo.plugins['Oskari.userinterface.Flyout'].flyout;
                flyout.bringToTop();

                let { left, top } = extensionInfo.viewState;
                const { attach, detach } = this.getFlyoutDefaultPositions();
                if ((!left || !top) || (left === attach.left && top === attach.top)) {
                    flyout.move(parseInt(detach.left), parseInt(detach.top));
                }

                /*
                 * with style
                 */
                this.applyTransition(el, 'detach', this.flyoutTransitions);
                extensionInfo.viewState = this.getFlyoutViewState(el, 'detach');
            },

            /** @method attach */
            attach: function (el, flyoutPlugin, extensionInfo, extensions) {
                const flyout = extensionInfo.plugins['Oskari.userinterface.Flyout'].flyout;
                flyout.bringToTop();
                /*
                 * with style
                 */
                this.applyTransition(el, 'attach', this.flyoutTransitions);
                extensionInfo.viewState = this.getFlyoutViewState(el, 'attach');

                if (flyoutPlugin.onOpen) {
                    flyoutPlugin.onOpen();
                }
            },

            /** @method minimize */
            minimize: function (el, flyoutPlugin, extensionInfo) {
                this.applyTransition(el, 'minimize', this.flyoutTransitions);
                extensionInfo.viewState = this.getFlyoutViewState(el, 'minimize');
            },

            /** @method restore */
            restore: function (el, flyoutPlugin, extensionInfo) {
                const flyout = extensionInfo.plugins['Oskari.userinterface.Flyout'].flyout;
                flyout.bringToTop();
                this.applyTransition(el, 'restore', this.flyoutTransitions);
            },

            /** @method close */
            close: function (el, flyoutPlugin, extensionInfo) {
                extensionInfo.viewState = {
                    viewState: 'close'
                };
                this.applyTransition(el, 'close', this.flyoutTransitions);

                if (flyoutPlugin.onClose) {
                    flyoutPlugin.onClose();
                }
            },
            /**
             * @method hide
             * Only attached flyout can be set hidden
             */
            hide: function (el, flyoutPlugin, extensionInfo) {
                if (extensionInfo.viewState.viewState !== 'attach') {
                    return;
                }
                this.applyTransition(el, 'hide', this.flyoutTransitions);
                extensionInfo.viewState = this.getFlyoutViewState(el, 'hide');
            }
        },

        /**
         * @static
         * @property flyoutOps a set of (jQuery) operations to be
         *           performed on flyout to
         *           show/hide/minimize/restore/attach/detach
         */
        viewOps: {
            /** @method detach */
            view: function (flyout, flyoutPlugin, extensionInfo, extensions) {},
            /** @method close */
            close: function (flyout, flyoutPlugin, extensionInfo) {}
        },

        /**
         * @method setState
         *
         * restores state from state snapshot
         *
         * @param {Object} state bundle state as JSON
         */
        setState: function (state) {
            var me = this,
                divmanazerState = state,
                e,
                extensionInfo,
                restoredState;

            if (!divmanazerState) {
                return;
            }

            for (e in me.extensionsByName) {
                if (me.extensionsByName.hasOwnProperty(e)) {
                    extensionInfo = me.extensionsByName[e];
                    restoredState = divmanazerState.extensionStatesByName[e];
                    if (restoredState) {
                        extensionInfo.state = restoredState.state;
                        extensionInfo.viewState = restoredState.viewState || {};
                    }
                }
            }

            /* let's not Bundles may not have been loaded */
            /* me.restoreExtensionViewStates(); */
        },

        /**
         * @method getState
         *
         * builds a state snapshot
         *
         * @return {Object} bundle state as JSON
         */
        getState: function () {
            var me = this,
                divmanazerState,
                e,
                extensionInfo;
            me.refreshExtensionViewStates();

            divmanazerState = {
                extensionStatesByName: {}
            };

            for (e in me.extensionsByName) {
                if (me.extensionsByName.hasOwnProperty(e)) {
                    extensionInfo = me.extensionsByName[e];
                    divmanazerState.extensionStatesByName[e] = {
                        state: extensionInfo.state,
                        viewState: extensionInfo.viewState
                    };
                }
            }

            return divmanazerState;
        },

        /**
         * @method applyState
         *
         * called after all bundles go will restore view states
         *
         */
        applyState: function () {
            var me = this;
            me.restoreExtensionViewStates();
        },

        /**
         * @method refreshExtensionStates
         * moves state to cache
         */
        refreshExtensionViewStates: function () {
            var me = this,
                e,
                extensionInfo,
                flyoutInfo,
                // flyoutPlugin,
                flyout,
                viewState;

            for (e in me.extensionsByName) {
                if (me.extensionsByName.hasOwnProperty(e)) {
                    extensionInfo = me.extensionsByName[e];

                    flyoutInfo = extensionInfo.plugins['Oskari.userinterface.Flyout'];
                    if (flyoutInfo) {
                        // flyoutPlugin = flyoutInfo.plugin;
                        flyout = flyoutInfo.el;

                        viewState = me.getFlyoutViewState(
                            flyout,
                            extensionInfo.state
                        );

                        extensionInfo.viewState = viewState;
                    }
                }
            }
        },

        /**
         * @method restoreExtensionViewStates
         */
        restoreExtensionViewStates: function () {
            var me = this,
                ops = me.flyoutOps,
                extensions = me.extensions,
                e,
                extensionInfo,
                // extension,
                flyoutInfo,
                flyoutPlugin,
                flyout,
                viewState,
                op,
                tileInfo,
                // tilePlugin,
                tile;

            for (e in me.extensionsByName) {
                if (me.extensionsByName.hasOwnProperty(e)) {
                    extensionInfo = me.extensionsByName[e];
                    // extension = extensionInfo.extension;

                    flyoutInfo = extensionInfo.plugins['Oskari.userinterface.Flyout'];
                    if (flyoutInfo) {
                        flyoutPlugin = flyoutInfo.plugin;
                        flyout = flyoutInfo.el;

                        viewState = extensionInfo.viewState;
                        flyout.removeAttr('style');
                        flyout.css('left', viewState.left);
                        flyout.css('top', viewState.top);
                        flyout.width(viewState.width);
                        flyout.height(viewState.height);
                        flyout.css('z-index', viewState['z-index']);

                        op = ops[extensionInfo.state];
                        /* me.getSandbox().postRequestByName('userinterface.UpdateExtensionRequest', [extension, viewState]); */
                        op.apply(
                            me,
                            [flyout, flyoutPlugin, extensionInfo, extensions]
                        );
                    }
                    tileInfo = extensionInfo.plugins['Oskari.userinterface.Tile'];
                    if (tileInfo) {
                        // tilePlugin = tileInfo.plugin;
                        tile = tileInfo.el;

                        me.applyTransition(
                            tile,
                            extensionInfo.state,
                            me.tileTransitions
                        );
                    }
                }
            }
        },

        /**
         * @method _toggleMapWindowFullScreen
         * Sends a request to toggle between the normal and the full screen view
         * of the map window.
         */
        _toggleMapWindowFullScreen: function () {
            var me = this,
                reqBuilder = Oskari.requestBuilder(
                    'MapFull.MapWindowFullScreenRequest'
                );

            if (reqBuilder) {
                me.sandbox.request(me.getName(), reqBuilder());
            }
        },

        /**
         *
         * @method shuffleZIndexes
         *
         * called after dragStop (or updateExtension) to restore some reasonable z-indexes
         * as well as bump the requested flyout on top of others
         *
         */
        shuffleZIndices: function (toTop) {
            var me = this,
                // extensions = me.extensions,
                zarray = [],
                zprops = {},
                zextns = {},
                zflyout = {},
                min = this.flyoutZIndexBase,
                idx,
                e,
                extensionInfo,
                // extension,
                flyoutInfo,
                // flyoutPlugin,
                flyout,
                zIndex,
                n;

            for (e in me.extensionsByName) {
                if (me.extensionsByName.hasOwnProperty(e)) {
                    extensionInfo = me.extensionsByName[e];
                    // extension = extensionInfo.extension;
                    flyoutInfo = extensionInfo.plugins['Oskari.userinterface.Flyout'];
                    if (flyoutInfo) {
                        // flyoutPlugin = flyoutInfo.plugin;
                        flyout = flyoutInfo.el;
                        zIndex = flyout.css('z-index');

                        zarray.push(zIndex);
                        idx = String(zIndex);
                        zprops[idx] = zIndex;
                        zflyout[idx] = flyout;
                        zextns[idx] = extensionInfo;
                    }
                }
            }

            zarray.sort();

            for (n = 0; n < zarray.length; n += 1) {
                idx = zarray[n];
                zprops[idx] = min + n;

                zflyout[idx].css('z-index', zprops[zarray[n]]);
            }

            /*
             * finally bump the requested flyout to top
             */
            toTop.css('z-index', min + zarray.length + 2);
        },
        ieFixClasses: [{
            min: 400,
            max: 599,
            cls: 'oskari-flyoutcontentcontainer_IE_400_599'
        }, {
            min: 600,
            max: 799,
            cls: 'oskari-flyoutcontentcontainer_IE_600_799'
        }, {
            min: 800,
            max: 999,
            cls: 'oskari-flyoutcontentcontainer_IE_800_999'
        }, {
            min: 1000,
            max: 1199,
            cls: 'oskari-flyoutcontentcontainer_IE_1000_1199'
        }, {
            min: 1200,
            max: 1399,
            cls: 'oskari-flyoutcontentcontainer_IE_1200_1399'
        }, {
            min: 1400,
            max: 9999,
            cls: 'oskari-flyoutcontentcontainer_IE_1400'
        }]

    }, {
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module',
            'Oskari.userinterface.Stateful'
        ]
    }
);
