/**
 * @class Oskari.liikennevirasto.bundle.lakapa.BasketBundle.Flyout
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.lakapa.BasketBundle.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.livi.bundle.LiviBasketBundleInstance} instance
 *    reference to component that created the flyout
 */
function(instance) {
    this.instance = instance;
    this.container = null;
    this.state = null;
    this._locale = null;
	this.template = null;
	this._sandbox = null;
	this.templateBasketDatas = jQuery('<div id="lakapa-basket-datas"></div>');
	this.templateBasketInputs = jQuery('<div id="lakapa-basket-inputs"><div id="lakapa-basket-inputs-container">'+
			'<h3 class="lakapa-basket-header" id="lakapa-basket-input-header"></h3>' +
			'<table><tr><td><span id="lakapa-basket-input-name"></span></td>'+
			'<td><input type="text" class="lakapa-basket-input" id="lakapa-basket-name"></input></td>'+
			'</tr>'+
			'<tr><td><span id="lakapa-basket-input-organization"></span></td>'+
			'<td><input type="text" class="lakapa-basket-input" id="lakapa-basket-organization"></input><input type="checkbox" id="lakapa-basket-private-user"><span id="lakapa-basket-input-private-user"></span></td>'+
			'</tr>'+
			'<tr><td><span id="lakapa-basket-input-email"></span></td>'+
			'<td><input type="text" class="lakapa-basket-input" id="lakapa-basket-email"></input></td>'+
			'</tr>'+
			'<tr><td><span id="lakapa-basket-input-email2"></span></td>'+
			'<td><input type="text" class="lakapa-basket-input" id="lakapa-basket-email2"></input></td>'+
			'</tr></table><div style="margin-top:5px;"><span id="lakapa-basket-input-required_fields"></span></div>'+
			'<div class="lakapa-basket-info-saving-data"></div>'+
			'<div class="lakapa-basket-info-saving-data-url"></div>'+
			'</div></div>');
	this.templateBasketTools = jQuery('<div id="lakapa-basket-tools"><div class="normal-conditions-wrapper"><span class="normal-conditions-span"></span>  <a class="normal-conditions-link" target="_blank" href="http://sundayissue.fi"></a><label class="normal-conditions-label"></label></div> '+
			'<a href="#" id="lakapa-basket-next" class="lakapa-basket-button lakapa-basket-next"></a><a class="lakapa-basket-button" id="lakapa-basket-empty-all" href="#"></a></div>');
	
	this.templateBasketTools2 = jQuery('<div id="lakapa-basket-tools2"><a class="lakapa-basket-button" id="lakapa-basket-previous" href="#"></a><a href="#" id="lakapa-basket-load-all" class="lakapa-basket-button lakapa-basket-load-all"></a></div>');
	
	this.templateBasketItem = jQuery('<div class="lakapa-basket-data">'
			+'<div class="lakapa-basket-title"><div class="lakapa-basket-title-layer-name"></div><div class="icon-close lakapa-basket-title-close"></div><div class="lakapa-basket-title-clear"></div></div>'
			+'<div class="lakapa-basket-content">'
			+'<div class="lakapa-basket-content-transport-title"></div>'
			+'<div class="lakapa-basket-content-transport-content"></div>'
			+'<div class="lakapa-basket-content-cropping"></div>'
			+'<div class="lakapa-basket-content-cropping-content"></div>'						
			+'<div class="lakapa-basket-content-bbox"></div>'
			+'<div class="lakapa-basket-content-bbox-content"></div>'
			+'<div class="lakapa-basket-content-special-conditions"></div>'
			+'</div>'
			+'</div>');
	this.templateBasketLoadingOverlay = jQuery('<div id="lakapa-basket-loading-overlay"></div>');
	this.templateBasketLoading = jQuery('<div id="lakapa-basket-loading-container"><div class="lakapa-basket-loading-text"></div><div class="lakapa-basket-loading-image"></div></div>');
	this._pendingAjaxQuery = {
        	busy: false,
        	jqhr: null,
        	timestamp: null
    };
}, {
	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
    getName : function() {
        return 'Oskari.liikennevirasto.bundle.lakapa.BasketBundle.Flyout';
    },
	/**
	 * @method setEl
	 * @param {Object} el 
	 * 		reference to the container in browser
	 * @param {Number} width 
	 * 		container size(?) - not used
	 * @param {Number} height 
	 * 		container size(?) - not used 
	 * 
	 * Interface method implementation
	 */
    setEl : function(el, width, height) {
        this.container = jQuery(el);
		if(!jQuery(this.container).hasClass('lakapa-basket')) {
			jQuery(this.container).addClass('lakapa-basket');
		}
    },
	/**
	 * @method startPlugin 
	 * 
	 * Interface method implementation, assigns the HTML templates that will be used to create the UI 
	 */
    startPlugin : function() {
		var me = this;
		this.template = jQuery('<div></div>');
    },
	/**
	 * @method stopPlugin 
	 * 
	 * Interface method implementation, does nothing atm 
	 */
	stopPlugin : function() {

	},
	/**
	 * @method refresh
	 * @public
	 */
	refresh: function(){
		var me = this;
		me.checkButtonsStates();
		jQuery('.lakapa-basket-show-on-map').each(function(){
			jQuery(this).removeClass('hide');
			jQuery(this).text(me._locale.showOnMapTitle);
		});
		me.showBasketContent();
	},
	/**
	 * @method getTitle 
	 * @return {String} localized text for the title of the flyout 
	 */
	getTitle : function() {
		return this.instance.getLocalization('flyouttitle');
	},
	/**
	 * @method getDescription 
	 * @return {String} localized text for the description of the flyout 
	 */
	getDescription : function() {
		return this.instance.getLocalization('desc');
	},
	/**
	 * @method getOptions 
	 * Interface method implementation, does nothing atm 
	 */
	getOptions : function() {

	},
	/**
	 * @method setState 
	 * @param {Object} state
	 * 		state that this component should use
	 * Interface method implementation, does nothing atm 
	 */
	setState : function(state) {
        var me = this;
        this.state = state;
        me.showBasketUserContent();
        me.emptyUserDetails();        
		me.showBasketContent();
		me.clear();
        var parent = me.container.parents('.oskari-flyout');
        if(parent.hasClass('oskari-detached') || parent.hasClass('oskari-attached')){
            parent.find('.oskari-flyouttool-close').trigger('click');
        }
		
	},
	/**
	 * Empty user details.
	 * @method emptyUserDetails
	 * @private
	 */
	emptyUserDetails: function(){
	    jQuery('#lakapa-basket-name').val('');
	    jQuery('#lakapa-basket-organization').val('');
	    jQuery('#lakapa-basket-organization').removeAttr('disabled');
	    jQuery('#lakapa-basket-email').val('');
	    jQuery('#lakapa-basket-email2').val('');
	    jQuery('#lakapa-basket-private-user').prop('checked', false);
	},
	/**
	 * @method showBasketContent
	 */
	showBasketContent: function(){
		jQuery('#lakapa-basket-inputs').hide();
		jQuery('#lakapa-basket-tools2').hide();
		jQuery('#lakapa-basket-tools').show();        		
		jQuery('#lakapa-basket-datas').show();
	},
	/**
	 * @method showBasketUserContent
	 */
	showBasketUserContent: function(){
		jQuery('#lakapa-basket-inputs').show();
		jQuery('#lakapa-basket-tools2').show();
		jQuery('#lakapa-basket-tools').hide();        		
		jQuery('#lakapa-basket-datas').hide();
	},
	/**
	 * @method checkUserDetails
	 * @return true if all is ok, other false
	 */
	checkUserDetails: function(){
		var allOk = true;
		
		var name = jQuery('#lakapa-basket-name').val();
		var organization = jQuery('#lakapa-basket-organization').val();
		var email = jQuery('#lakapa-basket-email').val();
		var email2 = jQuery('#lakapa-basket-email2').val();
		var privateUser = jQuery('#lakapa-basket-private-user').is(':checked');
		
		if(name.length==0 || (organization.length == 0 && privateUser == false) || email.length == 0 || email2.length == 0 || email != email2){
			allOk = false;
		} else {
			var nameValid = name.match(/^[a-zåäö\- |A-ZÅÄÖ\- ]{1,}$/);
			var organizationValid = true;
			var emailValid = email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
			
			if(!nameValid || !organizationValid || !emailValid){
				allOk = false;
			}
		}
		
		
		return allOk;
	},
	/**
	 * @method createUI
	 * Creates the UI for a fresh start
	 */
    createUI : function() {
        var me = this;
        var sandbox = me.instance.getSandbox();
        me._sandbox = sandbox;
        me._locale = me.instance.getLocalization('flyout');
        
		// clear container
		var cel = jQuery(me.container);
		cel.empty();
        var content = me.template.clone();
        cel.append(content);
        
        var basketDatas = me.templateBasketDatas.clone();
        var basketTools = me.templateBasketTools.clone();
        var basketTools2 = me.templateBasketTools2.clone();
        var basketInputs = me.templateBasketInputs.clone();
        basketInputs.find('#lakapa-basket-input-header').html(me._locale.input_title);
        basketInputs.find('#lakapa-basket-input-name').html(me._locale.input_name);
        basketInputs.find('#lakapa-basket-input-organization').html(me._locale.input_organization);
        basketInputs.find('#lakapa-basket-input-private-user').html(me._locale.input_private_user);
        basketInputs.find('#lakapa-basket-input-email').html(me._locale.input_email);
        basketInputs.find('#lakapa-basket-input-email2').html(me._locale.input_email2);
        basketInputs.find('#lakapa-basket-input-required_fields').html(me._locale.input_info);
        basketInputs.find('.lakapa-basket-info-saving-data').html(me._locale.userdata_save_info);
        if(me.instance.conf.userdataSaveInfoUrl !== null && me.instance.conf.userdataSaveInfoUrl != ''){
            basketInputs.find('.lakapa-basket-info-saving-data-url').html(                
                    '<a href="'+me.instance.conf.userdataSaveInfoUrl+'" target="_blank">' + me._locale.userdata_save_info_url_title + '</a>'
            );
        } else {
            basketInputs.find('.lakapa-basket-info-saving-data-url').html(                
                    '<a href="#">' + me._locale.userdata_save_info_url_title + '</a>'
            );
        }
        
        /*basketTools.find('.normal-conditions-span').text(me._locale.normal_conditions);
        basketTools.find('.normal-conditions-link').text(me._locale.normal_conditions_link);
        basketTools.find('.normal-conditions-link').attr("href",me.instance.conf.normalConditions);
        basketTools.find('.normal-conditions-label').html('<input type="checkbox" class="normal-conditions-chk">'+me._locale.accept_normal_conditions);*/
        
        basketTools.find('#lakapa-basket-empty-all').html(me._locale.buttonEmpty);
        basketTools.find('#lakapa-basket-empty-all').unbind('click');
        basketTools.find('#lakapa-basket-empty-all').bind('click', function(){
        	me._sandbox.postRequestByName('ClearBasketRequest', []);
        	me._sandbox.postRequestByName('ShowBoundingBoxRequest', [null]);
        	//jQuery(".normal-conditions-chk").attr("checked",false);
        	me.checkButtonsStates();
        });
        
        basketTools.find('#lakapa-basket-next').html(me._locale.buttonNext);        
        basketTools.find('#lakapa-basket-next').unbind('click');
        basketTools.find('#lakapa-basket-next').bind('click', function(){
        	if(!jQuery(this).hasClass('disabled')){
        		var needCheckConditions = me.needCheckSpecialConditions();
        		if(needCheckConditions==true){
        			me._sandbox.postRequestByName('ShowMessageRequest', [me._locale.check_special_conditions_title, me._locale.check_special_conditions_message]);
        		} /*else if(!jQuery(".normal-conditions-chk").is(':checked')){
        			me._sandbox.postRequestByName('ShowMessageRequest', [me._locale.check_normal_conditions_title, me._locale.check_normal_conditions_message]);
        		} */else {
        			me.showBasketUserContent();
        		}
        	}
        	
        });
        
        // Basket tools2
        basketTools2.find('#lakapa-basket-previous').html(me._locale.buttonPrevious);        
        basketTools2.find('#lakapa-basket-previous').unbind('click');
        basketTools2.find('#lakapa-basket-previous').bind('click', function(){
        	me.showBasketContent();
        });
        
        basketTools2.find('#lakapa-basket-load-all').html(me._locale.buttonLoadAll);        
        basketTools2.find('#lakapa-basket-load-all').unbind('click');
        basketTools2.find('#lakapa-basket-load-all').bind('click', function(){
        	var userDetails = me.checkUserDetails();
        	if(!jQuery(this).hasClass('disabled')){
        		if(userDetails == true){
        			me.loadBasketItem(jQuery(this));
        		} else {
        			me._sandbox.postRequestByName('ShowMessageRequest', [me._locale.check_user_details_title, me._locale.check_user_details_message]);
        		}
        	}        	
        });
        
        content.addClass('lakapa-basket-main-div');
        content.append(basketDatas);
        content.append(basketInputs);
    	content.append(basketTools);
    	content.append(basketTools2);
    	
    	jQuery('#lakapa-basket-private-user').unbind('change');
        jQuery('#lakapa-basket-private-user').bind('change',function() {
            if(jQuery(this).is(':checked')) {
                jQuery('#lakapa-basket-organization').attr('disabled','disabled');        
            } else {
                jQuery('#lakapa-basket-organization').removeAttr('disabled');
            }
        });
    	
    	me.checkButtonsStates();
    	me.showBasketContent();

    },
    /**
     * @method clear
     * @public
     * Clears basket
     */
    clear: function(){
    	var me = this;
    	jQuery('#lakapa-basket-datas').empty();
    	//jQuery('.normal-conditions-chk').prop('checked', false );
    	me.checkButtonsStates();
    },
    /**
     * @method needCheckSpecialConditions
     * @param el
     * @return true if user have not accept special conditions, other false
     */
    needCheckSpecialConditions: function(){
    	var checkSpecialConditions = false;
    	
    	jQuery('.lakapa-basket-data').each(function(){
	    	var parent = jQuery(this);
			var details = {
				croppingMode: parent.attr('data-cropping-mode'),
				transport: parent.attr('data-transport'),
				layer: parent.attr('data-layer-name'),
				bbox: {
					left: parent.attr('data-bbox-left'),
					bottom: parent.attr('data-bbox-bottom'),
					right: parent.attr('data-bbox-right'),
					top: parent.attr('data-bbox-top')
				},
				specialConditionsLink: parent.attr('data-special-conditions-link'),
				isSpecialConditions: false,
				isAcceptSpecialConditions: false,
				croppingUrl: parent.attr('data-cropping-url'),
				croppingLayer: parent.attr('data-cropping-layer'),
				wmsUrl: parent.attr('data-layer-wmsurl'),
				sessionKeys: parent.attr('data-session-keys')
			};
			if(details.specialConditionsLink!=null && details.specialConditionsLink!=''){
				details.isSpecialConditions = true;
			} else {
				details.specialConditionsLink = '';
			}
			
			if(details.isSpecialConditions==true){
				details.isAcceptSpecialConditions = parent.find('.special-conditions-chk').is(':checked');
				if(details.isAcceptSpecialConditions==false){
					checkSpecialConditions = true;
				}
			}		
    	});
    	return checkSpecialConditions;
    },
    /**
     * @method loadBasketItem
     * @param el
     */
    loadBasketItem: function(el){
    	var me = this;
    	var downloadDetails = [];
    	var checkSpecialConditions = false;
    	
    	jQuery('.lakapa-basket-data').each(function(){
	    	var parent = jQuery(this);
			var details = {
				croppingMode: parent.attr('data-cropping-mode'),
				transport: parent.attr('data-transport'),
				layer: parent.attr('data-layer-name'),
				bbox: {
					left: parent.attr('data-bbox-left'),
					bottom: parent.attr('data-bbox-bottom'),
					right: parent.attr('data-bbox-right'),
					top: parent.attr('data-bbox-top')
				},
				specialConditionsLink: parent.attr('data-special-conditions-link'),
				isSpecialConditions: false,
				isAcceptSpecialConditions: false,
				croppingUrl: parent.attr('data-cropping-url'),
				croppingLayer: parent.attr('data-cropping-layer'),
				wmsUrl: parent.attr('data-layer-wmsurl'),
				sessionKeys: parent.attr('data-session-keys')
			};
			if(details.specialConditionsLink!=null && details.specialConditionsLink!=''){
				details.isSpecialConditions = true;
			} else {
				details.specialConditionsLink = '';
			}
			
			if(details.isSpecialConditions==true){
				details.isAcceptSpecialConditions = parent.find('.special-conditions-chk').is(':checked');
				if(details.isAcceptSpecialConditions==false){
					checkSpecialConditions = true;
				}
			}
			downloadDetails.push(details);
		
    	});
    	var strDownloadDetails = JSON.stringify(downloadDetails);
    	
    	var userDetails = {    	
        		name: jQuery('#lakapa-basket-name').val(),
        		organization: jQuery('#lakapa-basket-organization').val(),
        		email: jQuery('#lakapa-basket-email').val(),	
        		privateUser: jQuery('#lakapa-basket-private-user').is(':checked')
        };
    	var strUserDetails = JSON.stringify(userDetails);
    	
    	var name = jQuery('#lakapa-basket-name').val();
		var organization = jQuery('#lakapa-basket-organization').val();
		var email = jQuery('#lakapa-basket-email').val();	
		var privateUser = jQuery('#lakapa-basket-private-user').is(':checked');
    	
    	
		var loadingText = me.templateBasketLoading.clone();
		loadingText.find('.lakapa-basket-loading-text').html(me._locale.loadingText);
    	el.after(loadingText);
    	
		var dte = new Date();
        var dteMs = dte.getTime();
        
        if( me._pendingAjaxQuery.busy && me._pendingAjaxQuery.timestamp &&  
            	dteMs - me._pendingAjaxQuery.timestamp < 500 ) {
            	me._sandbox.printDebug("[LakapaBasket] Save last selected region NOT SENT (time difference < 500ms)");
            	return; 
        }
		me._cancelAjaxRequest();
        me._startAjaxRequest(dteMs);
        
        var ajaxUrl = me._sandbox.getAjaxUrl(); 
        
        jQuery.ajax({
            beforeSend : function(x) {            	
            	me._pendingAjaxQuery.jqhr = x;
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/json;charset=UTF-8");
                }
            },
            success : function(resp) {
            	me._finishAjaxRequest();
            	var okHandler = function(){
            		me._sandbox.postRequestByName('RefreshLiviBasketRequest', []);
            		if(jQuery('.lakapa-basket-tile').hasClass('oskari-tile-attached')){
            			jQuery('.lakapa-basket-tile').trigger('click');
            		}
            	};
            	me._sandbox.postRequestByName('ShowMessageRequest', [me._locale.download_details_email_sended_title, me._locale.download_details_email_sended_message, okHandler]);
            },
            error : function() {
            	me._finishAjaxRequest();
                me._notifyAjaxFailure();
            },
            always: function() {
            	me._finishAjaxRequest();
            },
            complete: function() {
            	me._finishAjaxRequest();
            },
            data : {
                downloadDetails : strDownloadDetails,
                lang: Oskari.getLang(),
                userDetails: strUserDetails
            },
            type : 'POST',
            dataType : 'json',
            url : ajaxUrl + 'action_route=DownloadAll'
        });
        
        
    },
    /**
     * @method checkButtonsStates
     * @private
     */
    checkButtonsStates: function(){
    	var me = this;
    	var basketItems = jQuery('.lakapa-basket-data').length;
    	
    	if(basketItems>0){
    		jQuery('#lakapa-basket-empty-all').removeClass('disabled');
    		jQuery('#lakapa-basket-next').removeClass('disabled');
    	}
    	else{
    		jQuery('#lakapa-basket-empty-all').addClass('disabled');
    		jQuery('#lakapa-basket-next').addClass('disabled');
    	}
    },
    /**
     * @method _getSpecialConditions
     * @private
     * @param {Object} layer
     * @param {String} transport
     * @param {String} identifier
     */
    _getSpecialConditions: function(layer, transport, identifier){
    	var me = this;
    	var specialConditionsLink = '';
    	try{
    		var curTransport = me.instance.conf.specialConditions[transport];
    		var curLang = curTransport[Oskari.getLang()];
    		if(identifier==null){
    			specialConditionsLink = curLang[layer.getWmsName()];
    		} else {
    			specialConditionsLink = curLang[identifier];
    		}
    	} catch(err){
    	}    	
    	return specialConditionsLink;
    },
    /**
     * @method _getLayerName
     * @private
     * @param layerId
     * @returns {String}
     */
    _getLayerName: function(layerId){
    	var me = this;
    	var name = '';
    	var layer = me._sandbox.findMapLayerFromAllAvailable(layerId);
    	if(layer!=null){
    		name = layer.getName();
    	}
    	return name;
    },
    /**
     * @method _getLayerByName
     * @private
     * @param layerId
     * @returns {Object}
     */
    _getLayerByName: function(layerId){
    	var me = this;
    	var layer = me._sandbox.findMapLayerFromAllAvailable(layerId);
    	return layer;
    },
    /**
     * @method addToBasket
     * Add selected layers to basket
     * @param {Object} bbox, cropping bbox
     * @param {Array} layers, selected layers
     * @param {String} croppingMode, cropping mode
     * @param {String} transport, transport
     * @param {String} identifier
     * @param {Array} features
     */
    addToBasket: function(bbox, layers,croppingMode,transport,identifier, features){
    	var me = this;
    	var left = 0;
		var bottom = 0;
		var right = 0;
		var top = 0;
    	if(identifier==null && bbox!=null){    	
    		left = Math.floor(bbox.left);
    		bottom = Math.floor(bbox.bottom);
    		right = Math.floor(bbox.right);
    		top = Math.floor(bbox.top);
    	}
    	
    	var boundings = {
    		left: left,
    		bottom:bottom,
    		right:right,
    		top:top
    	};    	
    	
    	for(var i=0;i<layers.length;i++){
    		var layer = layers[i];
    		var layerName = '';
    		try{
    			layerName = layer.getName();
    		} catch(err){}
    		
    		var specialConditionsLink = me._getSpecialConditions(layer,'road',identifier);
    		var specialConditions = false;
    		if(specialConditionsLink){
    			if(specialConditionsLink!=''){
    				specialConditions = true;
    			}
    		}
    		
    		var basketItem = me.templateBasketItem.clone();
    		
    		basketItem.attr('data-transport', transport);
    		if(identifier=='digiroad'){
    			if(layer.feature.attributes.livimaakunta=='full-finland'){
    				basketItem.attr('data-layer-name', 'full-finland');
    			} else {
    				basketItem.attr('data-layer-name', layer.name);
    			}
    			basketItem.attr('data-layer-wmsurl', '');
    		} else {
    			basketItem.attr('data-layer-name', layer.getWmsName());
    			var wmsUrl = layer.getWmsUrls();
        		basketItem.attr('data-layer-wmsurl', wmsUrl[0]);
    		}
    		
    		basketItem.attr('data-bbox-left', left);
    		basketItem.attr('data-bbox-bottom', bottom);
    		basketItem.attr('data-bbox-right', right);
    		basketItem.attr('data-bbox-top', top);    		
    		basketItem.attr('data-special-conditions-link', specialConditionsLink);
    		
    		var croppingText = me._locale['cropping_selection_'+croppingMode];
    		if(identifier==null){
	    		if(croppingMode!='newreqular' && croppingMode!='lastreqular' && croppingMode!='mapextent'){
	    			croppingText = me._getLayerName(croppingMode);
	    			basketItem.attr('data-cropping-mode', 'polygon');
	    			var layer = me._getLayerByName(croppingMode);
	    			basketItem.attr('data-cropping-layer', layer.getWmsName());
	    			var wmsUrls = layer.getWmsUrls();
	    			basketItem.attr('data-cropping-url', wmsUrls[0]);
	    			
	    		} else {
	    			basketItem.attr('data-cropping-mode', 'regtangle');
	    			basketItem.attr('data-cropping-url', '');
	    			basketItem.attr('data-cropping-layer', '');
	    		}
	    		basketItem.attr('data-file-size', 0);
	    		basketItem.attr('data-identifier', '');
    		} else {
    			basketItem.attr('data-cropping-mode', identifier);
    			basketItem.attr('data-cropping-url', '');
    			basketItem.attr('data-cropping-layer', layer.name);
    			basketItem.attr('data-file-size', layer.feature.attributes.livitiedostokoko);
    			basketItem.attr('data-identifier', identifier);
    		}
    		
    		if(specialConditions){
    			basketItem.find('.lakapa-basket-title-close').after('<div class="special-conditions-info"></div>');
    			basketItem.find('.special-conditions-info').attr('title', me._locale.special_conditions_tooltip);
    		}
    		if(identifier==null){
    			basketItem.find('.lakapa-basket-title-layer-name').html(layerName);
    		} else if(identifier == 'digiroad') {    		    
    			basketItem.find('.lakapa-basket-title-layer-name').html(layer.name + ' - ' + identifier + ' ' + me.instance.conf.digiroadPublished);
    		}
    		else {
                basketItem.find('.lakapa-basket-title-layer-name').html(layer.name + ' - ' + identifier);
            }
    		basketItem.find('.lakapa-basket-content-cropping').html('<span class="lakapa-basket-data-title">' +me._locale.croppingTitle + '</span>:');
    		basketItem.find('.lakapa-basket-content-cropping-content').html(croppingText);
    		
    		basketItem.find('.lakapa-basket-content-transport-title').html('<span class="lakapa-basket-data-title">' +me._locale.transport_title + '</span>:');
    		basketItem.find('.lakapa-basket-content-transport-content').html(me._locale['transport_'+transport]);
    		
    		basketItem.find('.lakapa-basket-content-bbox').html('<span class="lakapa-basket-data-title">'+ me._locale.croppingBBOXTitle + '</span>:');
    		if(identifier==null){
    			if(features==null){
    				basketItem.find('.lakapa-basket-content-bbox-content').html(left+','+bottom+','+right+','+top + ' (<a class="lakapa-basket-show-on-map" href="#">'+me._locale.showOnMapTitle+'</a>)');
    			} else {
    				basketItem.find('.lakapa-basket-content-bbox-content').html(me._locale.selection_on_map + ' (<a class="lakapa-basket-show-on-map" href="#">'+me._locale.showOnMapTitle+'</a>)');
    			}
    		} else {
    			if(basketItem.attr('data-layer-name')=='full-finland'){
					basketItem.find('.lakapa-basket-content-bbox-content').html(me._locale.selection_full_finland);
					basketItem.find('.lakapa-basket-content-cropping').remove();
				} else {
					basketItem.find('.lakapa-basket-content-bbox-content').html(me._locale.selection_on_map + ' (<a class="lakapa-basket-show-on-map" href="#">'+me._locale.showOnMapTitle+'</a>)');
				}
    		}
    		basketItem.find('.lakapa-basket-next').html(me._locale.buttonNext);
    		
    		if(identifier==null){
    			if(features==null){
    				basketItem.find('.lakapa-basket-show-on-map').bind('click',function(){    					
    					if(jQuery(this).hasClass('hide')){
    						jQuery(this).removeClass('hide');
    						jQuery(this).text(me._locale.showOnMapTitle);
    						me._sandbox.postRequestByName('HideSelectionRequest', []);
    					} else {
        					jQuery('.lakapa-basket-show-on-map').each(function(){
        	    				jQuery(this).removeClass('hide');
        	    				jQuery(this).text(me._locale.showOnMapTitle);
        	    			});
    						
    						jQuery(this).addClass('hide');
    						jQuery(this).text(me._locale.hideOnMapTitle);
    						me._sandbox.postRequestByName('ShowBoundingBoxRequest', [boundings]);	
    					}
    				});
    				basketItem.attr('data-session-keys', '');
    			} else {
    				basketItem.find('.lakapa-basket-show-on-map').bind('click',function(){    					
    					if(jQuery(this).hasClass('hide')){
    						jQuery(this).removeClass('hide');
    						jQuery(this).text(me._locale.showOnMapTitle);
    						me._sandbox.postRequestByName('HideSelectionRequest', []);
    					} else {
        					jQuery('.lakapa-basket-show-on-map').each(function(){
        	    				jQuery(this).removeClass('hide');
        	    				jQuery(this).text(me._locale.showOnMapTitle);
        	    			});
        					
    						jQuery(this).addClass('hide');
    						jQuery(this).text(me._locale.hideOnMapTitle);
    						me._sandbox.postRequestByName('ShowFeatureRequest', [features]);
    					}
    				});
    				
    				var sessions = [];
    				for(var s=0;s<features.length;s++){
    					var f = features[s];
    					var sessio = f.attributes.livi_sessio_tunnus;
    					sessions.push(sessio);
    				}
    				var stringSessions = sessions.join(',');
    				basketItem.attr('data-session-keys', stringSessions);
    			}
    		} else {
    		    basketItem.find('.lakapa-basket-show-on-map').bind('click',function(){                        
                    if(jQuery(this).hasClass('hide')){
                        jQuery(this).removeClass('hide');
                        jQuery(this).text(me._locale.showOnMapTitle);
                        me._sandbox.postRequestByName('HideSelectionRequest', []);
                    } else {
                        jQuery('.lakapa-basket-show-on-map').each(function(){
                            jQuery(this).removeClass('hide');
                            jQuery(this).text(me._locale.showOnMapTitle);
                        });
                        var features = [];
                        features.push(layer.feature);
                        jQuery(this).addClass('hide');
                        jQuery(this).text(me._locale.hideOnMapTitle);
                        me._sandbox.postRequestByName('ShowFeatureRequest', [features]);
                    }
                });
    		    
    		    basketItem.attr('data-session-keys', '');
    		    
    		}
    		
    		if(!specialConditions){
    			basketItem.find('.lakapa-basket-content-special-conditions').html('<span class="lakapa-basket-data-title">' + 
    					me._locale.specialConditionsTitle + '</span>: <span class="lakapa-basket-special-conditions-no">' + 
    					'<a target="_blank" rel="license" href="http://creativecommons.org/licenses/by/4.0/">' +
    					'<img alt="Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/80x15.png" />' +
    					'</a><br />' +
    					me._locale.specialConditionsNo +
    					'<a target="_blank" rel="license" href="http://creativecommons.org/licenses/by/4.0/">'+me._locale.specialConditionsNo2+'</a>.' +
    					'</span>');
    			
    			//
    		} else {
    			basketItem.find('.lakapa-basket-content-special-conditions').html('<span class="lakapa-basket-data-title">' + 
    					me._locale.specialConditionsTitle + '</span>: <a href="'+specialConditionsLink+'" target="_blank">'+me._locale.specialConditionsYes+'</a>' +
    					'<label class="special-conditions-label"><input class="special-conditions-chk" type="checkbox">'+me._locale.accept_special_conditions+'</label>'
    			
    			);
    		}
    		
    		basketItem.find('.lakapa-basket-title-close').bind('click',function(){
    			jQuery(this).parent().parent().remove();
    			me._sandbox.postRequestByName('RefreshBasketRequest', []);
			});
    		jQuery('#lakapa-basket-datas').append(basketItem);
    	}
    	me.checkButtonsStates();
    	me.showBasketContent();
    },
    /**
     * @method _notifyAjaxFailure
     * @private
     * Notify ajax failure 
     */
    _notifyAjaxFailure: function() {
    	 var me = this;
    	 me._sandbox.printDebug("[LiviBasket] AJAX failed");
    },
    /**
     * Get fileSizes
     * @param identifier
     * @returns {Number}
     */
    getFilesSizes: function(identifier){
    	var fileSize = 0;
    	jQuery('.lakapa-basket-data').each(function(){
    		if(jQuery(this).attr('data-identifier')==identifier){
    			fileSize += parseFloat(jQuery(this).attr('data-file-size'));
    		}
    	});
    	return fileSize;
    },
    /**
     * @method _isAjaxRequestBusy
     * @private
     * Check at if ajax request is busy
     * @return {Boolean} true if ajax request is busy, else false
     */
    _isAjaxRequestBusy: function() {
    	var me = this;
    	return me._pendingAjaxQuery.busy;
    },
    /**
     * @method _cancelAjaxRequest
     * @private
     * Cancel ajax request 
     */
    _cancelAjaxRequest: function() {
    	var me = this;
    	if( !me._pendingAjaxQuery.busy ) {
    		return;
    	}
    	var jqhr = me._pendingAjaxQuery.jqhr;
    	me._pendingAjaxQuery.jqhr = null;
    	if( !jqhr) {
    		return;
    	}    	
    	this._sandbox.printDebug("[LakapaBasket] Abort jqhr ajax request");
    	jqhr.abort();
    	jqhr = null;
    	me._pendingAjaxQuery.busy = false;
    },
    /**
     * @method _starAjaxRequest
     * @private
     * Start ajax request 
     */
    _startAjaxRequest: function(dteMs) {
    	var me = this;
		me._pendingAjaxQuery.busy = true;
		me._pendingAjaxQuery.timestamp = dteMs;
		var overlay = me.templateBasketLoadingOverlay.clone();
		var loadingText = me.templateBasketLoading.clone();
		me._sandbox.postRequestByName('ToggleTransportSelectorRequest', [false]);
		loadingText.find('.lakapa-basket-loading-text').html(me._locale.loadingText);
		jQuery('.lakapa-basket').append(overlay);
    },
    /**
     * @method _finishAjaxRequest
     * @private
     * Finish ajax request 
     */
    _finishAjaxRequest: function() {
    	var me = this;
    	me._pendingAjaxQuery.busy = false;
        me._pendingAjaxQuery.jqhr = null;
        jQuery('#lakapa-basket-loading-overlay').remove();
        jQuery('#lakapa-basket-loading-container').remove();
        me._sandbox.postRequestByName('ToggleTransportSelectorRequest', [true]);
        this._sandbox.printDebug("[LakapaBasket] finished jqhr ajax request");
    },
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
    'protocol' : ['Oskari.userinterface.Flyout']
});
