/**
 * This bundle logs the map click coordinates to the console. This is a demonstration of using DefaultExtension.
 *
 * @class Oskari.elf.licencse.BundleInstance
 */
Oskari.clazz.define('Oskari.elf.license.BundleInstance',
/**
 * @method create called automatically on construction
 * @static
 */
function () {
    this._sandbox = null;
    this._locale = null;
    this._licenseInformationUrl = null;
    this.licenseService = null;
    this.prevBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
    this.nextBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
    this._dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    this._templates = {
        licenseDialog: jQuery('<div class="elf_license_dialog">' +
            '   <div class="elf_license_dialog_name"></div>' +
            '   <div class="elf_license_dialog_license_data">' +
            '      <div class="elf_license_dialog_description"></div>' +
            '      <div class="elf_license_dialog_licensemodels_title"></div>' +
            '      <div class="elf_license_dialog_licensemodels">' +            
            '      </div>' +
            '   <div class="help"></div>'+
            '   </div>' +
            '   <div class="elf_license_dialog_license_details">' +
            '   </div>' +
            '   <div class="elf_license_dialog_license_price">' +
            '   </div>' +
            '</div>'),
        licenseModel: jQuery('<div class="elf_license_model">' +
            '   <div class="elf_license_model_headers">' +
            '       <div class="elf_license_model_arrow icon-arrow-right"></div>' +
            '       <div class="elf_license_model_name"></div>' +
            '       <div class="elf_license_model_description"></div>' +
            '   </div>' +
            '</div>'),
        licenceModelDetails: jQuery('<div><div class="license_basic_data">' +
                '<div class="elf_name"></div>'+
            '</div>'+
            '<div class="license_user_data">'+
            '   <table class="elf_license_user_data_table"></table>' +
            '</div>' +
            '<div class="help"></div></div>'),
        licenceModelSummaryDetails: jQuery('<div><div class="license_basic_data">' +
                '<div class="name"></div>'+
                '<div class="header"></div>'+
            '</div>'+
            '<div class="license_user_data">'+
            '<table class="elf_license_user_data_table"></table>' +
            '</div>'+
            '<div class="price_summary"><span class="title"></span><span class="price"></span></div>'+
            '<div class="clear"></div>'+
            '<div class="help"></div>'+
            '</div>'),
        licenseUserData: jQuery('<tr><td class="elf_license_user_data_label"></td><td class="elf_license_user_data"></td></tr>'),
        licenseInput: jQuery('<div class="elf_license_input"></div>'),
        licenceConcludeSuccessMessage: jQuery('<div class="elf_license_success_message">'+
            '   <div class="headtitle"></div>'+
            '   <table>'+
            '       <tr>' +
            '           <td><div class="productid title"></div></td>'+
            '           <td><div class="productid value"></div></td>'+
            '       </tr>' +
            '       <tr>' +
            '           <td><div class="licenseid title"></div></td>'+
            '           <td><div class="licenseid value"></div></td>'+
            '       </tr>' +
            '       <tr>' +
            '           <td><div class="validto title"></div></td>'+
            '           <td><div class="validto value"></div></td>'+
            '       </tr>' +
            '   </table>'+
            '</div>')
    };
    this._dialogStep = null;
    this._validator = {
        number: null
    };
    this._metadata = null;
    this._paramEnumElement = null;
    this._paramDisplayElement = null;
    this._paramIntElement = null;
    this._paramTextElement = null;
    this._paramBlnElement = null;
    this._showsMessage = false;
    this._progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'elf-license',
    /**
     * Module protocol method
     *
     * @method getName
     */
    getName : function () {
        return this.__name;
    },
    eventHandlers: {
        
    },
    /**
     * DefaultExtension method for doing stuff after the bundle has started.
     * 
     * @method afterStart
     */
    afterStart: function (sandbox) {
        var me = this,
            conf = me.conf;
        
        me._locale =  this.getLocalization();
        me._sandbox = sandbox;

        // Activate metadata search results shows licence link
        me._activateMetadataSearchResultsShowLicenseLink();

        if (conf && conf.licenseInformationUrl) {
            me._licenseInformationUrl = conf.licenseInformationUrl;
        } else {
            me._licenseInformationUrl = sandbox.getAjaxUrl() +
                'action_route=ELFLicense';
        }

        // Create the license service
        me.licenseService = Oskari.clazz.create(
                'Oskari.elf.license.service.LicenseService',
                me, me._licenseInformationUrl);

        // Create validators
        me._validator.number = Oskari.clazz.create('Oskari.elf.license.validator.NumberValidator',me, false, true);
        
        // Create elements
        me._paramEnumElement = Oskari.clazz.create('Oskari.elf.license.elements.ParamEnumElement', me, me._validator);
        me._paramDisplayElement = Oskari.clazz.create('Oskari.elf.license.elements.ParamDisplayElement', me, me._validator);
        me._paramIntElement = Oskari.clazz.create('Oskari.elf.license.elements.ParamIntElement', me, me._validator);
        me._paramTextElement = Oskari.clazz.create('Oskari.elf.license.elements.ParamTextElement', me, me._validator);
        me._paramBlnElement = Oskari.clazz.create('Oskari.elf.license.elements.ParamBlnElement', me, me._validator);
    },
    /**
     * Activate metadata search results show license link
     * @method _activateMetadataSearchResultsShowLicenseLink
     * @private
     */
    _activateMetadataSearchResultsShowLicenseLink: function(){
        var me = this,
            reqBuilder = me._sandbox.getRequestBuilder('AddSearchResultActionRequest');

        if (reqBuilder) {
            var data = {
                actionElement: jQuery('<a href="javascript:void(0)"></a>'),
                callback: function(metadata) {
                    me._getLicenseInfo(metadata);
                },
                bindCallbackTo: null,
                actionTextElement: null,
                actionText: me._locale.getLicenseText,
                showAction: function(metadata) {
                    return metadata.license && metadata.license !== null;
                }
            };
            var request = reqBuilder(data);
            me._sandbox.request(me, request);
        }
    },
    /**
     * Get license information
     * @method _getLicenseInfo
     * @private
     * 
     * @param {Object} metadata metadata information
     */
    _getLicenseInfo: function(metadata) {
        var me = this;

        me._progressSpinner.insertTo(jQuery('.actionPlaceholder').parents('.oskari-flyoutcontent'));

        me._progressSpinner.start();

        me.licenseService.doLicenseInformationSearch({
            id: metadata.license
        }, function (response) {
            me._progressSpinner.stop();
            if (response) {
                if(response.userLicense && response.userLicense === true){
                    me._showLicenseDeactivateDialog(response, metadata);
                } else {
                    me._showLicenseSubscriptionInformationDialog(response, metadata);
                }
            } else {
                me._showMessage(me._locale.errors.cannotGetLicenseInformation.title, me._locale.errors.cannotGetLicenseInformation.message);
            }
        }, function () {
            me._progressSpinner.stop();
            me.getSandbox().printWarn('ELF license info failed', [].slice.call(arguments));
            me._showMessage(me._locale.errors.cannotGetLicenseInformation.title, me._locale.errors.cannotGetLicenseInformation.message);
        });
    },
    /**
     * Get price
     * @method _getPrice
     * @private
     */
    _getPrice: function() {
        var me = this,
            data = me._getLicenseInputValues();

        me._progressSpinner.start();

        me.licenseService.doGetPrice({
            data: data,
            id: jQuery('.license_basic_data').attr('data-id'),
            modelid: jQuery('.license_basic_data').attr('data-model-id')
        }, function (response) {
            me._progressSpinner.stop();
            if (response) {
                me._showLicenseOrderSummaryDialog(response);
            } else {
                me._showMessage(me._locale.errors.cannotGetLicensePrice.title, me._locale.errors.cannotGetLicensePrice.message);
            }
        }, function (response) {
            var errorMsg = null;
            me._progressSpinner.stop();
            me.getSandbox().printWarn('ELF license price failed', [].slice.call(arguments));
            if (response && response.responseText){
                errorMsg = JSON.parse(response.responseText);
            }
            if (errorMsg && errorMsg !== null && errorMsg.error && errorMsg.error !== null) {
                me._showMessage(me._locale.errors.cannotGetLicensePrice.title, errorMsg.error);
            } else {
               me._showMessage(me._locale.errors.cannotGetLicensePrice.title, me._locale.errors.cannotGetLicensePrice.message);
            }
        });
    },
    /**
     * Conclude license
     * @method _concludeLicense
     * @private
     */
    _concludeLicense: function() {
        var me = this,
            data = me._getLicenseInputValues(),
            msg = me._templates.licenceConcludeSuccessMessage.clone();

        msg.find('.headtitle').html(me._locale.dialog.conclude.title);
        msg.find('.productid.title').html(me._locale.dialog.conclude.productid);
        msg.find('.licenseid.title').html(me._locale.dialog.conclude.licenseid);
        msg.find('.validto.title').html(me._locale.dialog.conclude.validto);

        me._progressSpinner.start();

        me.licenseService.doConludeLicense({
            data: data,
            id: jQuery('.license_basic_data').attr('data-id'),
            modelid: jQuery('.license_basic_data').attr('data-model-id')
        }, function (response) {
            me._progressSpinner.stop();
            if (response) {
                //me._dialog.close();                
                msg.find('.productid.value').html(response.productId);
                msg.find('.licenseid.value').html(response.licenseId);
                msg.find('.validto.value').html(response.validTo);
                me._showMessage(me._locale.dialog.concludeSuccessTitle, msg, null, false, true);
            } else {
                me._showMessage(me._locale.errors.concludeNoResponse.title, me._locale.errors.concludeNoResponse.message);
            }
        }, function (response) {
            var errorMsg = null;
            me._progressSpinner.stop();
            me.getSandbox().printWarn('ELF license conclude failed', [].slice.call(arguments));
            if (response && response.responseText){
                errorMsg = JSON.parse(response.responseText);
            }
            if (errorMsg && errorMsg !== null && errorMsg.error && errorMsg.error !== null) {
                me._showMessage(me._locale.errors.failedConclude.title, errorMsg.error);
            } else {
               me._showMessage(me._locale.errors.failedConclude.title, me._locale.errors.failedConclude.message);
            }
        });
    },
    /**
     * Show message
     * @method _showMessage
     * @private
     *
     * @param {String} title message title
     * @param {String} message the message
     * @param {Integer} time the message fadeout time. Default 5000.
     * @param {Boolean} fadeout do fadeout
     */
    _showMessage: function(title, message, time, fadeout, showOk) {
        var me = this,
            dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            btn = dialog.createCloseButton(me._locale.buttons.ok);
            fadeoutTime = 5000,
            doFadeout = true,
            doButton = false;

        if(me._showsMessage === true) return;

        if(time && time !== null && !isNaN(time)) {
            fadeoutTime = time;
        }

        if(fadeout || fadeout !== null) {
            doFadeout = fadeout;
        }

        if(showOk && showOk !== null) {
            doButton = showOk;
        }

        me._showsMessage = true;

        if(doButton === false) {
            dialog.show(title, message);
        } else {
            dialog.show(title, message, [btn]);
        }

        dialog.onClose(function() {
           me._showsMessage = false;
        });

        if(doFadeout === true) {
            dialog.fadeout(fadeoutTime);
        }

    },
    /**
     * Show license deactivate information dialog
     * @method _showLicenseDeactivateDialog
     * @private
     *
     * @param {Object} data license information data
     * @param {Object} metadata the metadata
     */
    _showLicenseDeactivateDialog: function(data, metadata){
        var me = this,
            dialogContent = me._templates.licenseDialog.clone(),
            models = dialogContent.find('.elf_license_dialog_licensemodels'),
            title = dialogContent.find('.elf_license_dialog_licensemodels_title'),
            metadataTitle = '',
            cancelBtn = me._dialog.createCloseButton(this._locale.buttons.close),
            deactivateBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

        me._showLicenseModels();
        me._metadata = metadata;

        cancelBtn.addClass('elf_license_close_button');

        deactivateBtn.addClass('elf_license_deactivate_button');
        deactivateBtn.setTitle(me._locale.buttons.deactivate);
        deactivateBtn.setHandler(function(){
            me._deactivateLicense();
        });



        me._dialog.addClass('elf_license_dialog');
        dialogContent.find('.elf_license_dialog_name').html(data.name);
        dialogContent.find('.elf_license_dialog_description').html(data.description);
        title.removeClass('text');

        // If  founded models then shows them
        if(data.licenseModels.length > 0)  { 
            title.html(me._locale.dialog.licenseModelsTitle);
        }
        // If not found then shows message
        else {
            title.addClass('text');
            // If user has already logged in  then shows at no right to anyone license
            if (me._sandbox.getUser().isLoggedIn()) {
                title.html(me._locale.dialog.noRightToAnyLicenseModels);
            } 
            // Else if user has not logged in then show log in message
            else {
                title.html(me._locale.dialog.loginShort);
            }
        }

        metadataTitle = metadata.name;
        if(metadata.organization && metadata.organization !== null && metadata.organization !== ''){
            metadataTitle += ', ' + metadata.organization;
        }

        me._dialog.show(me._locale.dialog.licenseTitle + ' - ' + metadataTitle, dialogContent, [cancelBtn, deactivateBtn]);
        me._dialog.makeModal();

        me._progressSpinner.insertTo(jQuery('.elf_license_dialog'));

        // If there is orderer licensemodel then open it
        if(data.licenseModels.length == 1) {
            me._showLicenseDeactivateParams(data.licenseModels[0], data);
        }

    },
    /**
     * Show license deactivate params dialog
     * @method _showLicenseDeactivateParams
     * @private
     *
     * @param {Object} model license model
     * @param {Object} licenseData license data
     */
    _showLicenseDeactivateParams: function(model, licenseData) {
        var me = this,
            modelDetails = me._templates.licenceModelDetails.clone(),
            userData = modelDetails.find('.license_user_data'),
            licenseDetails = jQuery('.elf_license_dialog_license_details'),
            basicData = modelDetails.find('.license_basic_data'),
            closeButtonEl = jQuery('.elf_license_close_button'),
            deactivateButtonEl = jQuery('.elf_license_deactivate_button'),
            closeButtonMargin = closeButtonEl.outerWidth() - closeButtonEl.width();

        me._showLicenseDetails();
        licenseDetails.empty();

        modelDetails.find('.elf_name').html(model.name);
        modelDetails.find('.help').html(me._locale.dialog.help.orderDetails);

        basicData.attr('data-model-id', model.id);
        basicData.attr('data-id', licenseData.id);

        if(model.params.length>0) {
            var userDataTable = modelDetails.find('.elf_license_user_data_table');
            jQuery.each(model.params, function(index, param){
                var jQueryElement = me._getFormElement(param, true);
                if(jQueryElement !== null) userDataTable.append(jQueryElement);
            });
        }

        licenseDetails.append(modelDetails);

        closeButtonEl.css('margin-left',  deactivateButtonEl.outerWidth() + closeButtonMargin);
    },
    /**
     * Deactivate license. Shows confirmataion window by user and if user accept that then deactivate license.
     * @method _deactivateLicense
     * @private
     */
    _deactivateLicense: function(){
        var me = this,
            data = me._getLicenseInputValues();

            //console.dir(data);
/*
        me._progressSpinner.start();

        me.licenseService.doGetPrice({
            data: data,
            id: jQuery('.license_basic_data').attr('data-id'),
            modelid: jQuery('.license_basic_data').attr('data-model-id')
        }, function (response) {
            me._progressSpinner.stop();
            if (response) {
                me._showLicenseOrderSummaryDialog(response);
            } else {
                me._showMessage(me._locale.errors.cannotGetLicensePrice.title, me._locale.errors.cannotGetLicensePrice.message);
            }
        }, function (response) {
            var errorMsg = null;
            me._progressSpinner.stop();
            me.getSandbox().printWarn('ELF license price failed', [].slice.call(arguments));
            if (response && response.responseText){
                errorMsg = JSON.parse(response.responseText);
            }
            if (errorMsg && errorMsg !== null && errorMsg.error && errorMsg.error !== null) {
                me._showMessage(me._locale.errors.cannotGetLicensePrice.title, errorMsg.error);
            } else {
               me._showMessage(me._locale.errors.cannotGetLicensePrice.title, me._locale.errors.cannotGetLicensePrice.message);
            }
        });
*/
    },
    /**
     * Show license subscription information dialog
     * @method _showLicenseSubscriptionInformationDialog
     * @private
     *
     * @param {Object} data license information data
     * @param {Object} metadata the metadata
     */
    _showLicenseSubscriptionInformationDialog: function(data, metadata){
        var me = this,
            dialogContent = me._templates.licenseDialog.clone(),
            models = dialogContent.find('.elf_license_dialog_licensemodels'),
            title = dialogContent.find('.elf_license_dialog_licensemodels_title'),
            metadataTitle = '',
            cancelBtn = me._dialog.createCloseButton(this._locale.buttons.close);

        me._showLicenseModels();
        me._metadata = metadata;

        me.prevBtn.addClass('elf_license_previous_button');
        me.prevBtn.setTitle(me._locale.buttons.previous);
        me.prevBtn.setHandler(function(){
            me._goBack();
        });

        me.nextBtn.addClass('elf_license_next_button');
        me.nextBtn.setTitle(me._locale.buttons.next);
        me.nextBtn.setHandler(function(){
            me._goNext();
        });

        me._dialog.addClass('elf_license_dialog');
        dialogContent.find('.elf_license_dialog_name').html(data.name);
        dialogContent.find('.elf_license_dialog_description').html(data.description);
        title.removeClass('text');

        // If  founded models then shows them
        if(data.licenseModels.length > 0)  { 
            title.html(me._locale.dialog.licenseModelsTitle);
            dialogContent.find('.help').html(me._locale.dialog.help.info);
            jQuery.each(data.licenseModels, function(index, model){
                var modelEl = me._templates.licenseModel.clone();
                modelEl.bind('click', function(){
                    me._showLicenseParams(model, data);
                });

                modelEl.find('.elf_license_model_name').html(model.name);
                modelEl.find('.elf_license_model_description').html(model.description);
                models.append(modelEl);
            });
        }
        // If not found then shows message
        else {
            title.addClass('text');
            // If user has already logged in  then shows at no right to anyone license
            if (me._sandbox.getUser().isLoggedIn()) {
                title.html(me._locale.dialog.noRightToAnyLicenseModels);
            } 
            // Else if user has not logged in then show log in message
            else {
                title.html(me._locale.dialog.loginShort);
            }
        }


        metadataTitle = metadata.name;
        if(metadata.organization && metadata.organization !== null && metadata.organization !== ''){
            metadataTitle += ', ' + metadata.organization;
        }

        me._dialog.show(me._locale.dialog.licenseTitle + ' - ' + metadataTitle, dialogContent, [me.prevBtn, cancelBtn, me.nextBtn]);
        me._dialog.makeModal();

        me._progressSpinner.insertTo(jQuery('.elf_license_dialog'));

        // If there is only one licensemodel then open it
        if(data.licenseModels.length == 1) {
            me._showLicenseParams(data.licenseModels[0], data);
        }
    },
    /**
     * Go back
     * @method _goBack
     * @private
     */
    _goBack: function(){
        var me = this;
        me.nextBtn.setTitle(me._locale.buttons.next);
        if(me._dialogStep === null) return;
        if(me._dialogStep === 'step2') {
            me._showLicenseModels();
        } else if(me._dialogStep === 'step3') {
            me._showLicenseDetails();
        }
    },
    /**
     * Go next
     * @method _goNext
     * @private
     */
    _goNext: function(){
        var me = this;
        if(me._dialogStep === null) return;

        if(me._dialogStep === 'step2') {
            me._getPrice();
        } else if(me._dialogStep === 'step3') {
            me._concludeLicense();
        }

    },
    /**
     * Hide previous button
     * @method _hidePreviousButton
     * @private
     */
    _hidePreviousButton: function(){
        jQuery('.elf_license_previous_button').hide();
    },
    /**
     * Show previous button
     * @method _showPreviousButton
     * @private
     */
    _showPreviousButton: function(){
        jQuery('.elf_license_previous_button').show();
    },
    /**
     * Hide next button
     * @method _hideNextButton
     * @private
     */
    _hideNextButton: function(){
        jQuery('.elf_license_next_button').hide();
    },
    /**
     * Show next button
     * @method _showNextButton
     * @private
     */
    _showNextButton: function(){
        jQuery('.elf_license_next_button').show();
    },
    /**
     * Check buttons visibility
     * @method _checkButtonsVisibility
     * @private
     */
    _checkButtonsVisibility: function(){
        var me = this;
        if (me._dialogStep === null || me._dialogStep === 'step1') {
            me._hidePreviousButton();
            me._hideNextButton();
        } else {
            me._showPreviousButton();
            me._showNextButton();
        }
    },
    /**
     * Shows license models.
     * @method _showLicenseModels
     * @private
     */
    _showLicenseModels: function(){
        var me = this;
        me._dialogStep = 'step1';
        jQuery('.elf_license_dialog_license_details').hide();
        jQuery('.elf_license_dialog_license_data').show();
        jQuery('.elf_license_dialog_license_price').hide();
        me._checkButtonsVisibility();
    },
    /**
     * Shows license details.
     * @method _showLicenseDetails
     * @private
     */
    _showLicenseDetails: function(){
        var me = this;
        me._dialogStep = 'step2';
        jQuery('.elf_license_dialog_license_details').show();
        jQuery('.elf_license_dialog_license_data').hide();
        jQuery('.elf_license_dialog_license_price').hide();
        me._checkButtonsVisibility();
    },
    /**
     * Shows license price summary.
     * @method _showLicensePriceSummary
     * @private
     */
    _showLicensePriceSummary: function(){
        var me = this;
        me._dialogStep = 'step3';
        jQuery('.elf_license_dialog_license_price').show();
        jQuery('.elf_license_dialog_license_details').hide();
        jQuery('.elf_license_dialog_license_data').hide();
        me._checkButtonsVisibility();
    },
    /**
     * Show license order summary dialog
     * @method _showLicenseOrderSummaryDialog
     * @private
     *
     * @param {Object} model license model
     */
    _showLicenseOrderSummaryDialog: function(model){
        var me = this,
            licenseSummary = me._templates.licenceModelSummaryDetails.clone(),
            userData = licenseSummary.find('.license_user_data'),
            licensePrice = jQuery('.elf_license_dialog_license_price'),
            basicData = licenseSummary.find('.license_basic_data');

        me.nextBtn.setTitle(me._locale.buttons.conclude);

        me._showLicensePriceSummary();
        licensePrice.empty();

        licenseSummary.find('.name').html(model.name);
        licenseSummary.find('.header').html(me._locale.dialog.licenseSummaryTitle);
        licenseSummary.find('.price_summary .title').html(me._locale.dialog.priceTitle);
        licenseSummary.find('.help').html(me._locale.dialog.help.summary);
        licenseSummary.find('.price_summary .price').html(model.price + ' ' + me._locale.dialog.priceUnitEuro);

        basicData.attr('data-model-id', model.groupid);
        basicData.attr('data-id', model.id);

        if(model.params.length>0) {
            var userDataTable = licenseSummary.find('.elf_license_user_data_table');
            jQuery.each(model.params, function(index, param){
                var jQueryElement = me._getFormElement(param, true);
                if(jQueryElement !== null) userDataTable.append(jQueryElement);
            });
        }

        licensePrice.append(licenseSummary);
    },
     /**
     * Show license information params
     * @method _showLicenseParams
     * @private
     *
     * @param {Object} model license model
     * @param {Object} licenseData license data
     */
    _showLicenseParams: function(model, licenseData) {
        var me = this,
            modelDetails = me._templates.licenceModelDetails.clone(),
            userData = modelDetails.find('.license_user_data'),
            licenseDetails = jQuery('.elf_license_dialog_license_details'),
            basicData = modelDetails.find('.license_basic_data');

        me._showLicenseDetails();
        licenseDetails.empty();

        modelDetails.find('.elf_name').html(model.name);
        modelDetails.find('.help').html(me._locale.dialog.help.details);

        basicData.attr('data-model-id', model.id);
        basicData.attr('data-id', licenseData.id);

        if(model.params.length>0) {
            var userDataTable = modelDetails.find('.elf_license_user_data_table');
            jQuery.each(model.params, function(index, param){
                var jQueryElement = me._getFormElement(param);
                if(jQueryElement !== null) userDataTable.append(jQueryElement);
            });
        }

        licenseDetails.append(modelDetails);
    },
    /**
     * Get form element
     * @method _getFormElement
     * @private
     * 
     * @param {Object} param the license model param
     *
     * @return {Object} jQuery element object
     */
    _getFormElement: function(param, readOnly){
        var me = this,
            element = null,
            type = param.type;

        if (readOnly === null) {
            readOnly = false;
        }

        if (type === 'LicenseParamDisplay') {
            element = me._paramDisplayElement.getElement(param, readOnly);
        } else if (type === 'LicenseParamInt') {
            element = me._paramIntElement.getElement(param, readOnly);
        } else if (type === 'LicenseParamText') {
            element = me._paramTextElement.getElement(param, readOnly);
        } else if (type === 'LicenseParamBln') {
            element = me._paramBlnElement.getElement(param, readOnly);
        } else if (type === 'LicenseParamEnum') {
            element = me._paramEnumElement.getElement(param, readOnly);
        }

        return element;
    },
    /**
     * Get license input values
     * @method
     * @private
     *
     * @return {Object} license values
     */
    _getLicenseInputValues: function(){
        var values = [];
        jQuery('.elf_license_user_data div.elf_license_input:visible').each(function(){
            var element = jQuery(this),
                type = element.attr('data-element-type'),
                readOnly = element.attr('data-read-only');

            var value = {
                name: element.attr('data-name'),
                values: []
            };

            var inputValues = null;

            if(!readOnly || readOnly === false || readOnly === 'false') {
                if (type === 'int') {
                    inputValues = element.find('input').val();
                } else if (type === 'text') {
                    inputValues = element.find('input').val();
                } else if (type === 'boolean') {
                    inputValues = element.find('input').is(':checked');
                } else if (type === 'enum') {
                    inputValues = [];
                    element.find('input:checked').each(function(){
                        inputValues.push(jQuery(this).val());
                    });
                } else {
                    return;
                }
            } else {
                if (type === 'int') {
                    inputValues = element.find('div').attr('data-value');
                } else if (type === 'text') {
                    inputValues = element.find('div').attr('data-value');
                } else if (type === 'boolean') {
                    inputValues = element.find('div').attr('data-value');
                } else if (type === 'enum') {
                    inputValues = [];
                    element.find('li').each(function(){
                        inputValues.push(jQuery(this).attr('data-value'));
                    });
                } else {
                    return;
                }
            }

            value.values = inputValues;
            values.push(value);
        });
        return values;
    }
}, {
    "extend" : ["Oskari.userinterface.extension.DefaultExtension"]
});