/**
 * @class Oskari.mapframework.bundle.myplaces3.MyPlacesBundleInstance
 *
 * My places functionality
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.myplaces3.MyPlacesBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.loc = Oskari.getMsg.bind(null, 'MyPlaces3');
        this.sandbox = null;
        this.buttons = undefined;
        this.categoryHandler = undefined;
        this.myPlacesService = undefined;
        this.idPrefix = 'myplaces';
        this.finishedDrawing = false;
        this.editPlace = false;
    }, {
        __name: 'MyPlaces3',

        __drawStyle:{
            draw : {
                fill : {
                    color: 'rgba(35, 216, 194, 0.3)'
                },
                stroke : {
                    color: 'rgba(35, 216, 194, 1)',
                    width: 2
                },
                image : {
                    radius: 4,
                    fill: {
                        color: 'rgba(35, 216, 194, 0.7)'
                    }
                }
            },
            modify : {
                fill : {
                    color: 'rgba(0, 0, 238, 0.3)'
                },
                stroke : {
                    color: 'rgba(0, 0, 238, 1)',
                    width: 2
                },
                image : {
                  radius: 4,
                    fill: {
                        color: 'rgba(0,0,0,1)'
                    }
                }
            }
        },
        getDrawStyle: function (){
            return this.__drawStyle;
        },
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        getEditPlaceName: function () {
            return this.editPlaceName;
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
         * @method getService
         * Returns the my places main service
         * @return {Oskari.mapframework.bundle.myplaces3.service.MyPlacesService}
         */
        getService: function () {
            return this.myPlacesService;
        },

        isFinishedDrawing: function(){
            return this.finishedDrawing;
        },
        setIsFinishedDrawing: function(bln){
            this.finishedDrawing = !!bln;
        },
        isEditPlace: function(){
            return this.editPlace;
        },
        setIsEditPlace: function(bln){
            this.editPlace = !!bln;
        },

        /**
         * @method myPlaceSelected
         * Place was selected
         * @param {} event
         */
        myPlaceSelected: function () {
            // cleanup
            // ask toolbar to select default tool
            var toolbarRequest = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest')();
            this.sandbox.request(this, toolbarRequest);
            this.editPlace = false;
            this.getMainView().cleanupDrawingVariables();
        },

        /**
         * @method getCategoryHandler
         * Returns reference to the category handler
         * @return {Oskari.mapframework.bundle.myplaces3.CategoryHandler}
         */
        getCategoryHandler: function () {
            return this.categoryHandler;
        },
        /**
         * @method getMainView
         * Returns reference to the main view
         * @return {Oskari.mapframework.bundle.myplaces3.view.MainView}
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
        _addRequestHandlers: function() {
            var me = this,
                conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);

            var editRequestHandler = Oskari.clazz.create(
                'Oskari.mapframework.bundle.myplaces3.request.EditRequestHandler',
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

            var openAddLayerDialogHandler = Oskari.clazz.create(
                'Oskari.mapframework.bundle.myplaces3.request.OpenAddLayerDialogHandler',
                sandbox,
                me
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

            Oskari.log('MyPlaces3').debug("Initializing my places module...");

            // handles toolbar buttons related to my places
            this.buttons = Oskari.clazz.create("Oskari.mapframework.bundle.myplaces3.ButtonHandler", this);
            this.buttons.start();

            var user = Oskari.user();
            if (!user.isLoggedIn()) {
                // guest users don't need anything else
                return;
            }

            sandbox.register(me);
            // handles category related logic - syncs categories to my places map layers etc
            this.categoryHandler = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.CategoryHandler', this);
            this.categoryHandler.start();

            // handles my places insert form etc
            this.view = Oskari.clazz.create("Oskari.mapframework.bundle.myplaces3.view.MainView", this);
            this.view.start();

            me._addRequestHandlers();

            this.tab = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.MyPlacesTab', this);

            this.tab.initContainer();
            // binds tab to events
            if (this.tab.bindEvents) {
                this.tab.bindEvents();
            }

            // back end communication
            this.myPlacesService = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService', sandbox);
            // register service so personal data can access it
            this.sandbox.registerService(this.myPlacesService);
            // init loads the places/categories
            this.myPlacesService.init();

            if(!sandbox.hasHandler('PersonalData.AddTabRequest')) {
                return;
            }
            var addAsFirstTab = true;
            var reqBuilder = Oskari.requestBuilder('PersonalData.AddTabRequest');
            var req = reqBuilder(
                    this.tab.getTitle(),
                    this.tab.getContent(),
                    addAsFirstTab,
                    me.idPrefix);
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
                    'Oskari.mapframework.bundle.myplaces3.view.CategoryForm',
                    me
                ),
                categoryHandler = Oskari.clazz.create(
                    "Oskari.mapframework.bundle.myplaces3.CategoryHandler",
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

            var form = categoryForm.getForm();
            dialog.show(
                me.loc('tab.addCategory'),
                form,
                buttons
            );
            form.find('input[data-name=categoryname]').focus();
            // Move dialog next to layer select
            if (originator) {
                dialog.moveTo(originator, side);
            }
            // Disable rest of UI
            dialog.makeModal();
            categoryForm.start();
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance']
    });
