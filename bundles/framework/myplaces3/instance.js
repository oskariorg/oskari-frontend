import './model/MyPlace';
// event is not listened anywhere
// TODO: we should remove the event since it was previously added to update personaldata listing
import './event/MyPlacesChangedEvent';

import './request/EditRequestHandler';
import './request/OpenAddLayerDialogHandler';

import './service/MyPlacesService';
import './ButtonHandler';

import { LOCALE_KEY } from './constants';
import { MyPlacesTab } from './MyPlacesTab';
import { MyPlacesHandler } from './handler/MyPlacesHandler';
import { DrawHandler } from './handler/DrawHandler';

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
        this.loc = Oskari.getMsg.bind(null, LOCALE_KEY);
        this.sandbox = null;
        this.buttons = undefined;
        this.myPlacesService = undefined;
        this.myPlacesHandler = null;
        this.drawHandler = null;
    }, {
        __name: 'MyPlaces3',

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
         * @method getService
         * Returns the my places main service
         * @return {Oskari.mapframework.bundle.myplaces3.service.MyPlacesService}
         */
        getService: function () {
            return this.myPlacesService;
        },
        getMyPlacesHandler: function () {
            return this.myPlacesHandler;
        },
        getDrawHandler: function () {
            return this.drawHandler;
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
        _addRequestHandlers: function () {
            const conf = this.conf || {};
            const sandbox = Oskari.getSandbox(conf.sandbox);

            const editRequestHandler = Oskari.clazz.create(
                'Oskari.mapframework.bundle.myplaces3.request.EditRequestHandler',
                sandbox,
                this
            );
            sandbox.requestHandler(
                'MyPlaces.EditPlaceRequest',
                editRequestHandler
            );
            sandbox.requestHandler(
                'MyPlaces.DeletePlaceRequest',
                editRequestHandler
            );
            sandbox.requestHandler(
                'MyPlaces.EditCategoryRequest',
                editRequestHandler
            );
            sandbox.requestHandler(
                'MyPlaces.DeleteCategoryRequest',
                editRequestHandler
            );
            sandbox.requestHandler(
                'MyPlaces.PublishCategoryRequest',
                editRequestHandler
            );

            const openAddLayerDialogHandler = Oskari.clazz.create(
                'Oskari.mapframework.bundle.myplaces3.request.OpenAddLayerDialogHandler',
                sandbox,
                this
            );
            sandbox.requestHandler(
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
            const conf = this.conf || {};
            const sandbox = Oskari.getSandbox(conf.sandbox);
            this.sandbox = sandbox;

            Oskari.log('MyPlaces3').debug('Initializing my places module...');

            // handles toolbar buttons related to my places
            this.buttons = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.ButtonHandler', this);
            this.buttons.start();

            const user = Oskari.user();
            if (!user.isLoggedIn()) {
                // guest users don't need anything else
                return;
            }

            sandbox.register(this);

            // back end communication
            this.myPlacesService = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.service.MyPlacesService', sandbox);
            this.myPlacesService.init();
            // init handlers
            this.myPlacesHandler = new MyPlacesHandler(this);
            this.drawHandler = new DrawHandler(this);
            // handles category related logic - syncs categories to my places map layers etc
            this._addRequestHandlers();

            this.addTab();
        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method - does nothing atm
         */
        stop: function () {
            this.sandbox = null;
        },
        setupModifyMode: function (type) {
            this.buttons.setupModifyMode(type);
        },
        addTab: function (appStarted) {
            const sandbox = Oskari.getSandbox();
            const myDataService = sandbox.getService('Oskari.mapframework.bundle.mydata.service.MyDataService');

            if (myDataService) {
                myDataService.addTab('myplaces', this.loc('tab.title'), MyPlacesTab, this.myPlacesHandler);
            } else if (!appStarted) {
                // Wait for the application to load all bundles and try again
                Oskari.on('app.start', () => {
                    this.addTab(true);
                });
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance']
    });
