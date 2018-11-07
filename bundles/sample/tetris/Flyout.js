/**
 * @class Oskari.sample.bundle.tetris.Flyout
 *
 */
Oskari.clazz.define('Oskari.sample.bundle.tetris.Flyout',

    /**
     * @static @method create called automatically on construction
     *
     * @param
     * {Oskari.sample.bundle.tetris.BundleInstance}
     * instance
     * Reference to component that created the tile
     *
     */
    function (instance) {
        this.instance = instance;
        this.container = null;
        this.state = null;
        this._templates = {
            tetris: jQuery('<div class="oskari__tetris"></div>')
        };
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.sample.bundle.tetris.Flyout';
        },

        /**
         * @public @method setEl
         * Interface method implementation
         *
         * @param {Object} el
         * Reference to the container in browser
         *
         */
        setEl: function (el) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('tetris')) {
                jQuery(this.container).addClass('tetris');
            }
        },

        /**
         * @public @method startPlugin
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         *
         *
         */
        startPlugin: function () {
            var elParent,
                elId;

            // set id to flyouttool-close
            elParent = this.container.parentElement.parentElement;
            elId = jQuery(elParent).find('.oskari-flyouttoolbar').find('.oskari-flyouttools').find('.oskari-flyouttool-close');
            elId.attr('id', 'oskari_tetris_flyout_oskari_flyouttool_close');
        },

        /**
         * @public @method stopPlugin
         * Interface method implementation, does nothing atm
         *
         *
         */
        stopPlugin: function () {

        },

        /**
         * @public @method getTitle
         *
         *
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },

        /**
         * @public @method getDescription
         *
         *
         * @return {String} localized text for the description of the flyout.
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },

        /**
         * @public @method getOptions
         * Interface method implementation, does nothing atm
         *
         *
         */
        getOptions: function () {

        },

        /**
         * @public @method setState
         * Interface method implementation, does nothing atm
         *
         * @param {Object} state
         * State that this component should use
         *
         */
        setState: function (state) {
            this.state = state;
        },

        /**
         * @public @method createUi
         * Creates the UI for a fresh start
         *
         *
         */
        createUi: function () {
            var me = this,
                container = jQuery(me.container),
                tetrisContainer = me._templates.tetris,
                loc = this.instance.getLocalization('flyout');

            container.empty();
            container.append(tetrisContainer);

            jQuery('.oskari__tetris').blockrain(
                {
                    playText: loc.playText,
                    playButtonText: loc.playButtonText,
                    gameOverText: loc.gameOverText,
                    restartButtonText: loc.restartButtonText,
                    scoreText: loc.scoreText,
                    theme: {
                        blocks: {
                            line: '#fa1e1e',
                            square: '#f1fa1e',
                            arrow: '#d838cb',
                            rightHook: '#f5821f',
                            leftHook: '#42c6f0',
                            rightZag: '#4bd838',
                            leftZag: '#fa1e1e'
                        }
                    }
                }
            );
        },

        /**
         * @method refresh
         * utitity to temporarily support rightjs sliders (again)
         */
        refresh: function () {

        }
    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: ['Oskari.userinterface.Flyout']
    }
);
