/**
 * @class Oskari.userinterface.component.Accordion
 * Provides a base layout/container for adding a set of
 * Oskari.userinterface.component.AccordionPanel.
 */
Oskari.clazz.define('Oskari.userinterface.component.Accordion',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        "use strict";
        this.template = jQuery('<div class="accordion"></div>');
        this.templateMsg = jQuery('<div class="accordionmsg"></div>');
        this.panels = [];
        this.ui = this.template.clone();
    }, {
        /**
         * @method addPanel
         * Adds panel to this accordion
         * @param {Oskari.userinterface.component.AccordionPanel} panel
         */
        addPanel: function (panel) {
            "use strict";
            // clear any message before adding panel
            this.removeMessage();

            this.panels.push(panel);
            panel.insertTo(this.ui);
        },
        /**
         * @method removePanel
         * Removes panel from this accordion
         * @param {Oskari.userinterface.component.AccordionPanel} pPanel
         */
        removePanel: function (pPanel) {
            "use strict";
            var panel = null,
                i;
            for (i = 0; i < this.panels.length; i += 1) {
                if (this.panels[i] === pPanel) {
                    panel = this.panels[i];
                    this.panels.splice(i, 1);
                    break;
                }
            }
            if (panel) {
                panel.destroy();
                // notify components of layer removal
                return true;
            }
            return false;
        },
        removeAllPanels: function () {
            "use strict";
            this.ui.empty();
            this.panels = [];
        },
        removeMessage: function () {
            "use strict";
            var msgContainer = this.ui.find("div.accordionmsg");
            if (msgContainer.length > 0) {
                msgContainer.remove();
            }
        },
        showMessage: function (message) {
            "use strict";
            this.removeMessage();

            var msgContainer = this.templateMsg.clone();
            msgContainer.append(message);
            this.ui.append(msgContainer);
        },
        showPanels: function () {
            "use strict";
            var i;
            for (i = 0; i < this.panels.length; i += 1) {
                this.panels[i].setVisible(true);
            }
        },
        hidePanels: function () {
            "use strict";
            var i;
            for (i = 0; i < this.panels.length; i += 1) {
                this.panels[i].setVisible(false);
            }
        },
        /**
         * @method insertTo
         * Adds this accordion to given container.
         * @param {jQuery} container reference to DOM element
         */
        insertTo: function (container) {
            "use strict";
            container.append(this.ui);
        },
        getContainer: function () {
            "use strict";
            return this.ui;
        }
    });