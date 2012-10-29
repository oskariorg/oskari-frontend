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
function() {
    this.template = jQuery('<div class="accordion"></div>');
    this.panels = [];
    this.ui = this.template.clone();
}, {
    /**
     * @method addPanel
     * Adds panel to this accordion
     * @param {Oskari.userinterface.component.AccordionPanel} panel
     */
    addPanel : function(panel) {
        this.panels.push(panel);
        panel.insertTo(this.ui);
    },
    /**
     * @method removePanel
     * Removes panel from this accordion
     * @param {Oskari.userinterface.component.AccordionPanel} pPanel
     */
    removePanel : function(pPanel) {
        var panel = null;
        for(var i = 0; i < this.panels.length; i++) {
            if(this.panels[i] === pPanel) {
                panel = this.panels[i];
                this.panels.splice(i, 1);
                break;
            }
        }
        if(panel) {
            panel.destroy();
            // notify components of layer removal
            return true;
        }
        return false;
    },
    removeAllPanels : function() {
        this.ui.empty();
        this.panels = [];
    },
    showPanels : function() {
        for(var i = 0; i < this.panels.length; i++) {
            this.panels[i].setVisible(true);
        }
    },
    hidePanels : function() {
        for(var i = 0; i < this.panels.length; i++) {
            this.panels[i].setVisible(false);
        }
    },
    /**
     * @method insertTo
     * Adds this accordion to given container.
     * @param {jQuery} container reference to DOM element
     */
    insertTo : function(container) {
        container.append(this.ui);
    },
    getContainer : function() {
        return this.ui;
    }
});
