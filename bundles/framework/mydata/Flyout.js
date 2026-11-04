import { MyDataView } from './view/MyDataView';
import { getReactRoot } from 'oskari-ui/components/window';

/**
 * @class Oskari.mapframework.bundle.mydata.Flyout
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mydata.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.mydata.MyDataBundleInstance} instance
     *     reference to component that created the flyout
     */

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.state = null;

        this.myDataView = new MyDataView(instance, () => this.update());
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.mydata.Flyout';
        },
        /**
         * @method setEl
         * @param {Object} el
         *     reference to the container in browser
         * @param {Number} width
         *     container size(?) - not used
         * @param {Number} height
         *     container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, flyout, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('mydata')) {
                jQuery(this.container).addClass('mydata');
            }
            if (!flyout.hasClass('mydata')) {
                flyout.addClass('mydata');
            }
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin: function () {
            this.myDataView.start();
            this.update();
        },
        /**
         * @method stopPlugin
         *
         * Releases the shared view when the legacy extension is removed.
         */
        stopPlugin: function () {
            this.myDataView.stop();
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the flyout
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },
        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {

        },
        /**
         * @method setState
         * @param {Object} state
         *     state that this component should use
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            this.state = state;
        },
        update: function () {
            getReactRoot(this.container).render(this.getContent());
        },
        getContent: function () {
            return this.myDataView.getContent();
        },
        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            this.update();
        },
        openProfileTab: function () {
            this.instance.openProfileTab();
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.userinterface.Flyout']
    });
