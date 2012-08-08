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
		this._createAccount(container);
		
		
		/*
                jQuery.ajax({
                    type : 'POST',
                    url : 'http://demo.paikkatietoikkuna.fi/web/fi/kartta' 
                        + '?p_p_id=Portti2Map_WAR_portti2mapportlet' 
                        + '&p_p_lifecycle=1' 
                        + '&p_p_state=exclusive' 
                        + '&p_p_mode=view' 
                        + '&p_p_col_id=column-1' 
                        + '&p_p_col_count=1' 
                        + '&_Portti2Map_WAR_portti2mapportlet_fi.mml.baseportlet.CMD=ajax.jsp' 
                        + '&action_route=GetUserData',
                    success : function(responseText) {
                        var resp = eval('(' + responseText + ')');
                        jQuery(me.personalDataTab).find(".personaldata_first").text(resp.firstName);
                        jQuery(me.personalDataTab).find(".personaldata_last").text(resp.lastName);
                        jQuery(me.personalDataTab).find(".personaldata_login").text(resp.loginName);
                        jQuery(me.personalDataTab).find(".personaldata_nick").text(resp.nickName);
                    }
                });
                */
	},
	
    _createAccount : function(container) {
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
        	href : 'JavaScript:void(0);'
        },
        {
        	label : localization.changePassword,
        	href : 'JavaScript:void(0);'
        },
        {
        	label : localization.removeAccount,
        	href : 'JavaScript:void(0);'
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
