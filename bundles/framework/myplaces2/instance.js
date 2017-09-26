/**
 * @class Oskari.mapframework.bundle.myplaces2.MyPlacesBundleInstance
 *
 * My places functionality
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.myplaces2.MyPlacesBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces2');
        this.sandbox = null;
        this.buttons = undefined;
        this.categoryHandler = undefined;
        this.myPlacesService = undefined;
        this.featureNS = undefined;
        this.idPrefix = 'myplaces';
    }, {
        __name: 'MyPlaces2',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method showMessage
         * Shows user a message with ok button
         * @param {String} title popup title
         * @param {String} message popup message
         */
        showMessage: function (title, message) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
            okBtn.setHandler(function () {
                dialog.close(true);
            });
            dialog.makeModal();
            dialog.show(title, message, [okBtn]);
        },
        /**
         * @method forceDisable
         * Disables the functionality since something went wrong
         * (couldnt create default category)
         */
        forceDisable: function () {
            this.buttons.disableButtons();

            this.showMessage(this.loc('category.organization') + ' - ' +
            this.loc('notification.error.title'), this.loc('notification.error.generic'));
        },
        /**
         * @method enableGfi
         * Enables/disables the gfi functionality
         * @param {Boolean} blnEnable true to enable, false to disable
         */
        enableGfi: function (blnEnable) {
            var gfiReqBuilder = this.sandbox.getRequestBuilder(
                'MapModulePlugin.GetFeatureInfoActivationRequest'
            );
            if (gfiReqBuilder) {
                this.sandbox.request(this.buttons, gfiReqBuilder(blnEnable));
            }
        },
        /**
         * @method getService
         * Returns the my places main service
         * @return {Oskari.mapframework.bundle.myplaces2.service.MyPlacesService}
         */
        getService: function () {
            return this.myPlacesService;
        },
        /**
         * @method getDrawPlugin
         * Returns reference to the draw plugin
         * @return {Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin}
         */
        getDrawPlugin: function () {
            return this.view.drawPlugin;
        },
        /**
         * @method getCategoryHandler
         * Returns reference to the category handler
         * @return {Oskari.mapframework.bundle.myplaces2.CategoryHandler}
         */
        getCategoryHandler: function () {
            return this.categoryHandler;
        },
        /**
         * @method getMainView
         * Returns reference to the main view
         * @return {Oskari.mapframework.bundle.myplaces2.view.MainView}
         */
        getMainView: function () {
            return this.view;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {},
        /**
         * @method init
         * implements Module protocol init method
         */
        init: function () {},
        /**
         * @method  @private _addEventHandlers Add event handlers
         */
        _addRequestHandlers: function(){
            var me = this,
                conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);

            var editRequestHandler = Oskari.clazz.create(
                'Oskari.mapframework.bundle.myplaces2.request.EditRequestHandler',
                sandbox,
                me
            );
            var openAddLayerDialogHandler = Oskari.clazz.create(
                'Oskari.mapframework.bundle.myplaces2.request.OpenAddLayerDialogHandler',
                sandbox,
                me
            );
            sandbox.addRequestHandler(
                'MyPlaces.EditPlaceRequest',
                editRequestHandler
            );
            sandbox.addRequestHandler(
                'MyPlaces.DeletePlaceRequest',
                editRequestHandler
            );
            sandbox.addRequestHandler(
                'MyPlaces.EditCategoryRequest',
                editRequestHandler
            );
            sandbox.addRequestHandler(
                'MyPlaces.DeleteCategoryRequest',
                editRequestHandler
            );
            sandbox.addRequestHandler(
                'MyPlaces.PublishCategoryRequest',
                editRequestHandler
            );
            sandbox.addRequestHandler(
                'MyPlaces.OpenAddLayerDialogRequest',
                openAddLayerDialogHandler
            );
        },
        /**
         * @method start
         * implements BundleInstance protocol start methdod
         */
        start: function () {
            // Should this not come as a param?
            var me = this,
                conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);
            this.sandbox = sandbox;

            this.featureNS = conf ? conf.featureNS : null;
            if (!this.featureNS) {
                return;
            }

            sandbox.printDebug("Initializing my places module...");

            // handles toolbar buttons related to my places
            this.buttons = Oskari.clazz.create("Oskari.mapframework.bundle.myplaces2.ButtonHandler", this);
            this.buttons.start();

            var user = Oskari.user();
            if (!user.isLoggedIn()) {
                // guest users don't need anything else
                return;
            }

            sandbox.register(me);
            // handles category related logic - syncs categories to my places map layers etc
            this.categoryHandler = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.CategoryHandler', this);
            this.categoryHandler.start();

            var defaults = this._getCategoryDefaults(),
                actionUrl = this.conf.queryUrl;
            // Set max features to configured.
            var maxFeatures = (conf ? conf.maxFeatures : undefined);

            // back end communication
            this.myPlacesService = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.service.MyPlacesService',
                actionUrl, user.getUuid(), sandbox, defaults, this, {
                    maxFeatures: maxFeatures
                });
            // register service so personal data can access it
            this.sandbox.registerService(this.myPlacesService);
            // init loads the places/categories
            this.myPlacesService.init();

            // handles my places insert form etc
            this.view = Oskari.clazz.create("Oskari.mapframework.bundle.myplaces2.view.MainView", this);
            this.view.start();

            me._addRequestHandlers();

            this.tab = Oskari.clazz.create(
                'Oskari.mapframework.bundle.myplaces2.MyPlacesTab',
                this
            );

            this.tab.initContainer();
            // binds tab to events
            if (this.tab.bindEvents) {
                this.tab.bindEvents();
            }

            var title = this.tab.getTitle(),
                content = this.tab.getContent(),
                first = true,
                id = me.idPrefix,
                reqName = 'PersonalData.AddTabRequest',
                reqBuilder = sandbox.getRequestBuilder(reqName),
                req = reqBuilder(title, content, first, id);
            sandbox.request(this, req);
        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method - does nothing atm
         */
        stop: function () {
            this.sandbox = null;
        },

        openAddLayerDialog: function (originator, side) {
            // create popup
            // TODO popup doesn't block bg?
            var me = this,
                dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                ),
                categoryForm = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.myplaces2.view.CategoryForm',
                    me
                ),
                categoryHandler = Oskari.clazz.create(
                    "Oskari.mapframework.bundle.myplaces2.CategoryHandler",
                    me
                ),
                buttons = [],
                saveBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.SaveButton'
                ),
                cancelBtn = dialog.createCloseButton(me.loc('buttons.cancel'));

            saveBtn.setHandler(function () {
                var values = categoryForm.getValues(),
                    errors = categoryHandler.validateCategoryFormValues(values);

                if (errors.length !== 0) {
                    categoryHandler.showValidationErrorMessage(errors);
                    return;
                }
                var category = categoryHandler.getCategoryFromFormValues(values);
                categoryHandler.saveCategory(category);

                dialog.close();
                me.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
            });
            buttons.push(cancelBtn);
            buttons.push(saveBtn);

            // TODO add buttons
            var form = categoryForm.getForm();
            dialog.show(
                me.loc('tab.addCategory'),
                form,
                buttons
            );
            form.find('input[name=categoryname]').focus();
            // Move dialog next to layer select
            if (originator) {
                dialog.moveTo(originator, side);
            }
            // Disable rest of UI
            dialog.makeModal();
            categoryForm.start();
        },

        _getCategoryDefaults: function () {
            var defaults = {
                name: this.loc('category.defaultName'),
                point: {
                    shape: 1,
                    color: "000000",
                    size: 3
                },
                line: {
                    style: "",
                    cap: 0,
                    corner: 0,
                    width: 1,
                    color: "3233ff"
                },
                area: {
                    linestyle: "",
                    linecorner: 0,
                    linewidth: 1,
                    linecolor: "000000",
                    color: "ffde00",
                    fill: -1
                }
            };
            if (!this.conf) {
                return defaults;
            }
            if (!this.conf.defaults) {
                return defaults;
            }
            for (var prop in defaults) {
                if (this.conf.defaults[prop]) {
                    defaults[prop] = this.conf.defaults[prop];
                }
            }
            return defaults;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance']
    });
