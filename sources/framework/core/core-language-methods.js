Oskari.clazz.category('Oskari.mapframework.core.Core', 'language-methods', {

	getText : function(messageKey, params) {
		//this.printDebug(messageKey);
		//alert(messageKey);
		
		//return this._languageService.get(messageKey, params);
	},

	showPopupText : function(title_key, message_key, placeholders) {
		var languageService = this
				.getService('Oskari.mapframework.service.LanguageService');
		return languageService.showPopup(title_key, message_key, placeholders);
	}
});