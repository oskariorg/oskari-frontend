/**
 * @class Oskari.mapframework.bundle.personaldata.AccountTab
 * Renders the "personal data" tile.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.AccountTab',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.personaldata.PersonalDataBundleInstance} instance
 * 		reference to component that created the tile
 */
function(instance, localization) {
	this.instance = instance;
	this.template = jQuery('<div class="account"><div class="info"></div><div class="bottomlinks"></div></div>');
	this.loc = localization;
}, {
	getTitle : function() {
		return this.loc.title;
	},
	addTabContent : function(container) {
		var content = this.template.clone();
		container.append(content);
		this._createAccountTab(container);
	},
	
    _createAccountTab : function(container) {
        var me = this;
        var sandbox = me.instance.getSandbox();
        var fieldTemplate = jQuery('<div class="dataField"><div class="label"></div><div class="value"></div><br clear="all" /></div>');
        
        var user = sandbox.getUser();
        var localization = this.loc;
        var accountData = [
        {
        	label : localization.firstName,
        	value : user.getFirstName()
        },
        {
        	label : localization.lastName,
        	value : user.getLastName()
        },
        {
        	label : localization.nickName,
        	value : user.getNickName()
        },
        {
        	label : localization.email,
        	value : user.getLoginName()
        }
        ];
        var infoContainer = container.find('div.info');
        for(var i = 0; i < accountData.length; ++i) {
        	var data = accountData[i];
        	var fieldContainer = fieldTemplate.clone();
	    	fieldContainer.find('.label').html(data.label);
	    	fieldContainer.find('.value').html(data.value);
	        infoContainer.append(fieldContainer);
        }
        var bottomLinks = [
        {
        	label : localization.changeInfo,
        	href : localization.changeInfoUrl
        }
        ];
        var bottomLinksContainer = container.find('div.bottomlinks');
        for(var i = 0; i < bottomLinks.length; ++i) {
        	var data = bottomLinks[i];
        	var link = jQuery('<a href="' + data.href + '">' + data.label + '</a>&nbsp; ');
	        bottomLinksContainer.append(link);
        }
        
    }
});
