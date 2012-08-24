/**
 * @class Oskari.userinterface.component.UIHelper
 * Generic UI helper methods
 */
Oskari.clazz.define('Oskari.userinterface.component.UIHelper',

/**
 * @method create called automatically on construction
 * @static
 */
function(sandbox) {
	this.sandbox = sandbox;
}, {
    /**
     * @method processHelpLinks
     * Processes given element and binds any element with 
     * "helptags" attribute with a popup showing the help article
     * @param {jQuery} content, element to scan
     * @param {String} errorMsg, message if help article is not found
     */
    processHelpLinks : function(content, errorMsg) {
    	if(!content) {
    		return;
    	}
    	var me = this;
        // TODO: move this to "UIUtil" or sth like that
        // Help popups (PORTTISK-812)
        var reqname = 'InfoBox.ShowInfoBoxRequest';
        var builder = me.sandbox.getRequestBuilder(reqname);
        content.find('[helptags]').each(function(i, e) {
            var btn = jQuery(e);
            var taglist = btn.attr("helptags");
            btn.bind('click', function(e) {
                jQuery.ajax({
                    url : me.sandbox.getAjaxUrl() + '&action_route=GetArticlesByTag&tags="' + taglist + '"',
                    type : 'GET',
                    dataType : 'json',
                    success : function(resp) {
                        var content = resp.articles[0].content;
                        var idx = content.indexOf("<![CDATA[");
                        if (idx >= 0) {
                            content = content.substring(idx + 9);
                        }
                        idx = content.indexOf("]]>");
                        if (idx >= 0) {
                            content = content.substring(0, idx);
                        }
                        var dialog = Oskari.clazz.create('Oskari.userinterface' + '.component.Popup');
                        var okBtn = dialog.createCloseButton("OK");
                        okBtn.addClass('primary');
                        dialog.show(me.loc.help, content, [okBtn]);
                        dialog.moveTo(btn, 'bottom');
                    },
                    error : function() {
                        alert(errorMsg);
                    }
                });
            });
        });
        // End help popups.
    }
});
