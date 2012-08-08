/**
 * @class Oskari.userinterface.component.AccordionPanel
 * 
 * Panel that can be added to Oskari.userinterface.component.Accordion.
 * TODO: close/open methods?
 */
Oskari.clazz.define('Oskari.userinterface.component.AccordionPanel',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.template = jQuery('<div class="accordion_panel">' + 
               '<div class="header">' +
               '</div>' + 
               '<div class="content">' +
               '</div>' +
        '</div>');
    this.title = null;
    this.content = null;
    this.html=this.template.clone();
    
    var header = this.html.find('div.header'); 
    header.click(function() {
        var panelDiv = jQuery(this).parent();
        var isOpen = panelDiv.hasClass('open');
        // panel is open -> close it
        if(isOpen) {
            panelDiv.removeClass('open');
            panelDiv.find('div.content').hide();
        }
        // panel is closed -> open it
        else {
            panelDiv.addClass('open');
            panelDiv.find('div.content').show();
        }
    });
    this.html.find('div.content').hide();
}, {
    /**
     * @method setTitle
     * Sets the panel title
     * @param {String} pTitle title for the panel
     */
    setTitle : function(pTitle) {
        this.title = pTitle;
        var header = this.html.find('div.header'); 
        header.append(this.title);
    },
    /**
     * @method setContent
     * Sets the panel content. 
     * This can be also done with #getContainer()
     * @param {jQuery} pContent reference to DOM element
     */
    setContent : function(pContent) {
        this.content = pContent;
        var content = this.html.find('div.content'); 
        content.append(this.content);
    },
    /**
     * @method destroy
     * Destroys the panel/removes it from document
     */
    destroy : function() {
        this.html.remove();
    },
    /**
     * @method getContainer
     * Returns this panels content container which can be populated. 
     * This can be also done with #setContent().
     * @return {jQuery} reference to this panels content DOM element
     */
    getContainer : function() {
        return this.html.find('div.content');
    },

    /**
     * @method insertTo
     * Adds this panel to given container.
     * Usually used by Oskari.userinterface.component.Accordion internally.
     * @param {jQuery} container reference to DOM element
     */
    insertTo : function(container) {
        container.append(this.html);
    }
});
