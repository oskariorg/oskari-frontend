/**
 * @class Oskari.catalogue.bundle.metadatafeedback.Flyout
 *
 * This shows a metadata feedback flyout.
 *
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadatafeedback.Flyout',

    /**
     * @static @method create called automatically on construction
     * Always extend this class, never use as is.
     *
     * @param {Object} instance
     * @param {Object} locale
     *
     */
    function (instance, locale) {
        this.instance = instance;
        this.locale = locale;
        this.container = null;
        this.state = null;
        this.tabsContainer = null;
        this.selectedTab = null;
        this.active = false;
        this.template = jQuery('<div class="userfeedback-values">' +
            '<div id="step-1">'+
                '<h2 class="StepTitle">'+this.locale.userFeedback.userFeedback+'</h2>'+
                '<p><label >'+this.locale.userFeedback.subject+':</label><input id="subject" name="subject" type="text" placeholder="'+this.locale.userFeedback.subjectPlaceholder+'" required />'+
                '</p>'+
                '<p>'+
                  '<label >'+this.locale.userFeedback.ratingScore+': </label>'+
                '</p>'+
                '<div id="raty-star">'+
                '</div>'+
                '<p><label >'+this.locale.userFeedback.ratingJustification+': </label><textarea id="justification" name="justification" maxlength="1000" class="span5" rows=4 required></textarea></p>'+
              '</div>'+
              '<div id="step-2">'+
                '<h2 class="StepTitle">'+this.locale.targetSpecification.targetSpecification+'</h2>'+
                '<fieldset>'+
                  '<legend><small>'+this.locale.targetSpecification.targetIdentification+'</small></legend>'+
                  '<p><label >'+this.locale.targetSpecification.targetCode+'</label><input id="primaryTargetCode" name="primaryTargetCode" value="ELF METADATA" readonly="true"/></p>'+
                  '<p><label >'+this.locale.targetSpecification.targetCodespace+'</label><input id="primaryTargetCodeSpace" name="primaryTargetCodespace" value="'+this.locale.targetSpecification.primaryTargetCodeSpaceNotDefined+'" readonly="true"/></p>'+
                  '<p><label >'+this.locale.targetSpecification.natureOfTarget+'</label>'+
                    '<select id="natureOfTarget" disabled="disabled">'+
                      '<option value="">'+this.locale.targetSpecification.natureOfTargetUnknown+'</option>'+
                      '<option value="attribute">'+this.locale.targetSpecification.natureOfTargetAttribute+'</option>'+
                      '<option value="activity">'+this.locale.targetSpecification.natureOfTargetActivity+'</option>'+
                      '<option value="document">'+this.locale.targetSpecification.natureOfTargetDocument+'</option>'+
                      '<option value="metadataDocument">'+this.locale.targetSpecification.natureOfTargetMetadataDocument+'</option>'+
                      '<option value="attributeType">'+this.locale.targetSpecification.natureOfTargetAttributeType+'</option>'+
                      '<option value="collectionHardware">'+this.locale.targetSpecification.natureOfTargetCollectionHardware+'</option>'+
                      '<option value="collectionSession">'+this.locale.targetSpecification.natureOfTargetCollectionSession+'</option>'+
                      '<option value="dataset">'+this.locale.targetSpecification.natureOfTargetDataset+'</option>'+
                      '<option value="series">'+this.locale.targetSpecification.natureOfTargetSeries+'</option>'+
                      '<option value="nonGeographicDataset">'+this.locale.targetSpecification.natureOfTargetNonGeographicDataset+'</option>'+
                      '<option value="dimensionGroup">'+this.locale.targetSpecification.natureOfTargetDimensionGroup+'</option>'+
                      '<option value="feature">'+this.locale.targetSpecification.natureOfTargetFeature+'</option>'+
                      '<option value="featureType">'+this.locale.targetSpecification.natureOfTargetFeatureType+'</option>'+
                      '<option value="propertyType">'+this.locale.targetSpecification.natureOfTargetPropertyType+'</option>'+
                      '<option value="fieldSession">'+this.locale.targetSpecification.natureOfTargetFieldsession+'</option>'+
                      '<option value="software">'+this.locale.targetSpecification.natureOfTargetSoftware+'</option>'+
                      '<option value="service">'+this.locale.targetSpecification.natureOfTargetService+'</option>'+
                      '<option value="model">'+this.locale.targetSpecification.natureOfTargetModel+'</option>'+
                      '<option value="title">'+this.locale.targetSpecification.natureOfTargetTitle+'</option>'+
                    '</select>'+
                  '</p>'+
                '</fieldset>'+
              '</div>'+
              '<div id="step-3">'+
              '<h2 class="StepTitle">'+this.locale.userInformation.userInformation+'</h2>'+
                '<fieldset>'+
                  '<legend><small>'+this.locale.userInformation.userDetails+'</small></legend>'+
                  '<p><label >'+this.locale.userInformation.userName+'</label><input id="username" name="username" type="text"/></p>'+
                  '<label >'+this.locale.userInformation.contactRole+'</label>'+
                  '<select  id="ciRole">'+
                    '<option value="user">'+this.locale.userInformation.ciRoleUser+'</option>'+
                    '<option value="resourceProvider">'+this.locale.userInformation.ciRoleResourceProvider+'</option>'+
                    '<option value="custodian">'+this.locale.userInformation.ciRoleCustodian+'</option>'+
                    '<option value="owner">'+this.locale.userInformation.ciRoleOwner+'</option>'+
                    '<option value="sponsor">'+this.locale.userInformation.ciRoleSponsor+'</option>'+
                    '<option value="distributor">'+this.locale.userInformation.ciRoleDistributor+'</option>'+
                    '<option value="originator">'+this.locale.userInformation.ciRoleOriginator+'</option>'+
                    '<option value="pointofContact">'+this.locale.userInformation.ciRolePointOfContact+'</option>'+
                    '<option value="principalInvestigator">'+this.locale.userInformation.ciRolePrincipalInvestigator+'</option>'+
                    '<option value="processor">'+this.locale.userInformation.ciRoleProcessor+'</option>'+
                    '<option value="publisher">'+this.locale.userInformation.ciRolePublisher+'</option>'+
                    '<option value="author">'+this.locale.userInformation.ciRoleAuthor+'</option>'+
                    '<option value="collaborator">'+this.locale.userInformation.ciRoleCollaborator+'</option>'+
                  '</select>'+
                '</fieldset>'+
              '</div>'+
              '<div>'+
              '<button class="btn save" type="button">'+this.locale.actionButtons.save+'</button>'+
              '<button class="btn cancel" type="button">'+this.locale.actionButtons.cancel+'</button>'+
              '</div>'+
          '</div>');
        // Resizability of the flyout
        this.resizable = true;
        // Is layout currently resizing?
        this.resizing = false;
        // The size of the layout has been changed (needed when changing tabs)
        this.resized = false;

    }, {
        setMetadata: function(metadata) {
          this._metadata = metadata;
        },
        getName: function () {
            return 'Oskari.catalogue.bundle.metadatafeedback.Flyout';
        },

        startPlugin: function () {
            var me = this;
            this.tabsContainer =
                Oskari.clazz.create('Oskari.userinterface.component.TabContainer',
                    this.locale['title']);
            var contents = jQuery(me.template);
            var imgDir = "/Oskari/bundles/elf/elf-metadatafeedback/resources/images/";
            var starOnImg = imgDir+"star-on.png";
            var starOffImg = imgDir+"star-off.png";
            var starHalfImg = imgDir+"star-half.png";
            contents.find("div#raty-star").raty({
                starOn: starOnImg,
                starOff: starOffImg,
                starHalf: starHalfImg
            });

            var saveBtn = contents.find("button.save");
            saveBtn.addClass('primary');
            saveBtn.click(function() {

              var params = me._getFieldValues();

              if (!params) {
                  me._showMessage(me.locale.errorPopup.title, me.locale.errorPopup.formValidationFailed);
              } else {

                me.instance.addFeedbackService.addFeedback(params, function(e) {
                    me._showMessage(me.locale.successPopup.title, me.locale.successPopup.savingTheFeedbackSuccesful);
                    me._resetForm();
                    //update the ratinginfo in the search result list.
                    me._metadata.rating = e[0].rating;
                    me.instance.updateMetadataRating(me._metadata);

                    me.instance.sandbox.postRequestByName(
                        'userinterface.UpdateExtensionRequest',
                        [me.instance, 'close']
                    );
                },
                function(e) {
                    me._showMessage(me.locale.errorPopup.title, me.locale.errorPopup.savingTheFeedbackFailed);
                    /*
                    me.instance.sandbox.postRequestByName(
                        'userinterface.UpdateExtensionRequest',
                        [me.instance, 'close']
                    );
                    */
                });

              }
            });

            var cancelBtn = contents.find("button.cancel");
            cancelBtn.click(function() {
                me._resetForm();
                me.instance.sandbox.postRequestByName(
                    'userinterface.UpdateExtensionRequest',
                    [me.instance, 'close']
                );
            });

            var el = me.getEl();
            el.append(contents);

            //prevent keypress f in textareas from toggling the full map
            jQuery('.userfeedback-values').find('textarea').on('keydown', function(e) {
              e.stopPropagation();
            });
        },

        stopPlugin: function () {
            var p;
            for (p in this.pages) {
                if (this.pages.hasOwnProperty(p)) {
                    this.pages[p].destroy();
                    delete this.pages[p];
                }
            }
            this.container.empty();
        },

        getTitle: function () {
            return this.locale['title'];
        },

        getDescription: function () {
            return this.locale['desc'];

        },

        getOptions: function () {

        },

        setState: function (state) {
            this.state = state;
        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            var me = this,
                flyout = jQuery(this.container);
            flyout.empty();

            var sandbox = this.instance.sandbox,
                dimReqBuilder = sandbox.getRequestBuilder('DimMapLayerRequest'),
                hlReqBuilder = sandbox.getRequestBuilder('HighlightMapLayerRequest');
            // if previous panel is undefined -> just added first tab
            // if selectedPanel is undefined -> just removed last tab
            this.tabsContainer.addTabChangeListener(function (previousPanel, selectedPanel) {
                var request;
                // sendout dim request for unselected tab
                if (previousPanel) {
                    request = dimReqBuilder(previousPanel.layer.getId());
                    sandbox.request(me.instance.getName(), request);
                }
                me.selectedTab = selectedPanel;
                if (selectedPanel) {
                    me.updateData(selectedPanel.layer);
                    // sendout highlight request for selected tab
                    if (me.active) {
                        request = hlReqBuilder(selectedPanel.layer.getId());
                        sandbox.request(me.instance.getName(), request);
                    }
                }
            });
            this.tabsContainer.insertTo(flyout);
        },

        /**
         * @method setContentState

         * restore state from store
         */
        setContentState: function (contentState) {
            this.contentState = contentState;
        },

        /**
         * @method getContentState
         *
         * get state for store
         */
        getContentState: function () {
            return this.contentState;
        },

        resetContentState: function () {
            this.contentState = {};
        },
        /**
         * @method _getFieldValues
         *
         * generate request json based on form values. Also do some elementarty validation (=check required fields)
         */
        _getFieldValues: function() {

          var formContainer = jQuery('.userfeedback-values');

          //give an id to the hidden input generated by the raty-plugin...one doesn't get set by the plugin itself.
          formContainer.find('[name=score]').attr('id', 'score');


          var inputs = formContainer.find(':input');
          var params = {};
          var validationOk = true;
          _.each(inputs, function(input) {

            if ($(input).attr('type') == 'button') {
              return;
            }
            /*remove red borders if any*/
            if ($(input).hasClass('input-error')) {
              $(input).removeClass('input-error');
            }

            var value = $(input).val();
            if ($(input).attr('required') !== undefined && (!value || value.length === 0)) {
              $(input).addClass('input-error');
              validationOk = false;
            }

            params[$(input).attr('id')] = $(input).val();
          });

          return validationOk ? params : validationOk;

        },
        /**
         * @method _resetForm
         * Reset form values after cancel or succesful save
         */
         _resetForm: function() {
             jQuery('.userfeedback-values').find(':input').val('');
         },

        /**
         * @method _showMessage
         * Shows user a message with ok button
         * @private
         * @param {String} title popup title
         * @param {String} message popup message
         */
        _showMessage: function (title, message) {
                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(this.locale.errorPopup.okButtonText);
            okBtn.addClass('primary');
            okBtn.setHandler(function () {
                dialog.close(true);
            });
            dialog.show(title, message, [okBtn]);
        }

    }, {
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    });
