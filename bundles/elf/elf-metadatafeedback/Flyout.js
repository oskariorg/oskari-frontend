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
                '<p><label>'+this.locale.userFeedback.subject+':</label><input id="subject" name="subject" type="text" placeholder="'+this.locale.userFeedback.subjectPlaceholder+'" required readonly="true"/>'+
                '</p>'+
                '<p>'+
                  '<label>'+this.locale.userFeedback.ratingScore+': </label>'+
                '</p>'+
                '<div id="raty-star">'+
                '</div>'+
                '<p><label>'+this.locale.userFeedback.ratingJustification+': </label><textarea id="justification" name="justification" maxlength="1000" class="span5" rows=4 required></textarea></p>'+
              '</div>'+
              '<div id="step-2">'+
                '<h2 class="StepTitle">'+this.locale.targetSpecification.targetSpecification+'</h2>'+
                '<fieldset>'+
                  '<legend><small>'+this.locale.targetSpecification.targetIdentification+'</small></legend>'+
                  '<p><label>'+this.locale.targetSpecification.targetCode+'</label><input id="primaryTargetCode" name="primaryTargetCode" value="ELF METADATA" readonly="true"/></p>'+
                  '<p><label>'+this.locale.targetSpecification.targetCodespace+'</label><input id="primaryTargetCodeSpace" name="primaryTargetCodespace" value="'+this.locale.targetSpecification.primaryTargetCodeSpaceNotDefined+'" readonly="true"/></p>'+
                  '<p><label>'+this.locale.targetSpecification.natureOfTarget+'</label><input id="natureOfTarget" name="subject" type="text" required readonly="true"/></p>'+
                '</fieldset>'+
              '</div>'+
              '<div id="step-3">'+
              '<h2 class="StepTitle">'+this.locale.userInformation.userInformation+'</h2>'+
                '<fieldset>'+
                  '<legend><small>'+this.locale.userInformation.userDetails+'</small></legend>'+
                  '<p><label>'+this.locale.userInformation.userName+'</label><input id="username" name="username" type="text" readonly="true" required/></p>'+
                  '<label>'+this.locale.userInformation.contactRole+'</label>'+
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
        this._metadata = null;

    }, {
        getName: function () {
            return 'Oskari.catalogue.bundle.metadatafeedback.Flyout';
        },

        startPlugin: function () {
            var me = this,
                contents = jQuery(me.template),
                imgDir = "/Oskari/bundles/elf/elf-metadatafeedback/resources/images/",
                starOnImg = imgDir+"star-on.png",
                starOffImg = imgDir+"star-off.png",
                starHalfImg = imgDir+"star-half.png",
                saveBtn = contents.find("button.save"),
                cancelBtn = contents.find("button.cancel"),
                ratings = contents.find("div#raty-star"),
                el = me.getEl();

            me.tabsContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer', this.locale['title']);
            
            ratings.raty({
                starOn: starOnImg,
                starOff: starOffImg,
                starHalf: starHalfImg
            });

            saveBtn.addClass('primary');
            saveBtn.click(function() {
                var params = me._getFieldValues();
                if (!params) {
                    me._showMessage(me.locale.errorPopup.title, me.locale.errorPopup.formValidationFailed);
                } else {
                    me.instance.addFeedbackService.addFeedback(params, 
                      function(e) {
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
                      function() {
                          me._showMessage(me.locale.errorPopup.title, me.locale.errorPopup.savingTheFeedbackFailed);
                      });
                    }
            });

            cancelBtn.click(function() {
                me._resetForm();
                me.instance.sandbox.postRequestByName(
                    'userinterface.UpdateExtensionRequest',
                    [me.instance, 'close']
                );
            });

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
                flyout = jQuery(this.container),
                sandbox = this.instance.sandbox,
                dimReqBuilder = sandbox.getRequestBuilder('DimMapLayerRequest'),
                hlReqBuilder = sandbox.getRequestBuilder('HighlightMapLayerRequest');
            
            flyout.empty();

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
        * Update metadata feedback form.
        * @method updateFeedbackUI
        * 
        * @param {Object} metadata the metadata object
        */
        updateFeedbackUI: function(metadata){
            var me = this,
                el = me.getEl(),
                sandbox = this.instance.sandbox,
                user = sandbox.getUser();

            me._metadata = metadata;
            
            // Set subject
            el.find('input#subject').val(metadata.name);

            // Set the score based on the given value
            el.find('div#raty-star').raty('score',me._metadata.rating);

            // Set metadata id
            el.find('input#primaryTargetCode').val(me._metadata.id);

            // Set metadata codespace
            el.find('input#primaryTargetCodeSpace').val('ELF METADATA');

            // Set user name
            el.find('input#username').val(user.getNickName());

            // Set nature of target
            el.find('input#natureOfTarget').val(metadata.natureofthetarget);
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
              if (jQuery(input).attr('type') === 'button') {
                return;
              }
              
              /*remove red borders if any*/
              if (jQuery(input).hasClass('input-error')) {
                  jQuery(input).removeClass('input-error');
              }

              var value = jQuery(input).val();
              if (jQuery(input).attr('required') !== undefined && (!value || value.length === 0)) {
                  jQuery(input).addClass('input-error');
                  validationOk = false;
              }

              params[jQuery(input).attr('id')] = jQuery(input).val();
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
