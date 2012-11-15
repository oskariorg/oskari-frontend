Oskari.clazz.category('Oskari.mapframework.core.Core', 'language-methods', {

    /**
     * Method for asking localized message
     * @deprecated Use new locale system instead
     *
     * @param {Object}
     *            messageKey that should give you localized test
     */
	getText : function(messageKey, params) {
		
		//return this._languageService.get(messageKey, params);
	},

    /**
     * Shows popup message with given title key and message key.
     * @deprecated Use new locale system instead
     *
     * @param title_key
     *            key for title
     * @param message_key
     *            key for actual message
     *
     * @param placeholders
     *            placeholders enable you to replace parts of
     *            message by replacing special strings inside
     *            message. placeholders are marked inside
     *            message using ##number## notation and these
     *            replacements should be given in an array for
     *            this method. For example givin calling
     *            showPopup('key', 'message', ['this is
     *            replacement 1', 'this is replacement 2']);
     *            method will replace ##0## with 'this is
     *            replacement 1' and ##1## with 'this is
     *            replacement 2'
     *
     */
	showPopupText : function(title_key, message_key, placeholders) {
		var languageService = this
				.getService('Oskari.mapframework.service.LanguageService');
		return languageService.showPopup(title_key, message_key, placeholders);
	}
});