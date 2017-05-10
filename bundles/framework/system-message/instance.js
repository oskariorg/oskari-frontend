/* Add this to startupsequence to get this bundle started
Oskari.app.playBundle(
{
  bundlename : 'system-message',
  metadata : {
  "Import-Bundle" : {
  "system-message" : {
  bundlePath : '/Oskari/packages/framework/bundle/'
  }
  }
  }
});
*/
/*
Searches dom for element with id="oskari-system-messages", that is used for displaying messages.
*/
Oskari.clazz.define(
    'Oskari.framework.bundle.system-message.SystemBundleInstance',

    function() {
        this._messageField = jQuery('<div class="messagetext"></div>');
        this._messageContainer = jQuery('<div class="message-container">'+
                                        '<div class="iconFlip">' +
                                        '<a href="#"><div class="messageIcon front"></div></a>' +
                                        '<div class="iconBack back"></div>'+
                                        '</div>'+
                                        '</div>');
        this.sandbox = null;
        this.started = false;
        this._localization = null;
        this.messages = [];
        this.popupIsOpen = false;
        this.messageElement = null;
        this._dialog = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'system-message',

        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function() {
            return this.__name;
        },
        init: function() {},
        /**
         * @method setSandbox
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function(sbx) {
            this.sandbox = sbx;
        },
        /**
         * @method getSandbox
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function() {
            return this.sandbox;
        },
        /**
         * @method start
         *
         * implements BundleInstance start methdod
         *
         * creates and registers request handlers
         *
         */
        start: function(sandbox) {
            var me = this;
            var canBeStarted = me.initDomElements();
            if(!canBeStarted) {
                // element not found
                return;
            }
            me.setSandbox(sandbox || Oskari.getSandbox());
            this.localization = Oskari.getLocalization(this.getName());
            this.systemMessageService = this.createService(sandbox);
            me.getSandbox().register(me);
            this.getMessages();

            // create request handlers
            me.showMessageRequestHandler = Oskari.clazz.create(
                'Oskari.framework.bundle.system.message.request.ShowMessageRequestHandler',
                me
            );
            // register request handlers
            sandbox.requestHandler(
                'ShowMessageRequest',
                me.showMessageRequestHandler
            );
        },
        /**
         * Creates the system-message service and registers it to the sandbox.
         *
         * @method createService
         * @param  {Oskari.mapframework.sandbox.Sandbox} sandbox
         * @return {Oskari.mapframework.bundle.system-message.SystemMessageService}
         */
        createService: function(sandbox) {
            var systemMessageService = Oskari.clazz.create(
                'Oskari.framework.bundle.system.message.service.SystemMessageService',
                this
            );
            sandbox.registerService(systemMessageService);
            return systemMessageService;
        },
        getService: function() {
            return this.systemMessageService;
        },
        /**
         * @public @method initDomElements
         * Creates reference to DOM elements of the bundle
         *
         * @return {Boolean} returns true if elements found, else false
         */
        initDomElements: function() {
            var me = this;
            var container = me._messageContainer.clone();
            var field = me._messageField.clone();
            //Get reference to the div we use to show the messages
            this.messageElement = jQuery('#oskari-system-messages');
            this.messageElement.append(container, field);
            if (!this.messageElement.length) {
                Oskari.log(me.getName()).warn('Could not find element with id #oskari-system-messages');
                return false;
            }
            var icon = this.messageElement.find("div.messageIcon");
            icon.on("click", this, function(e) {
                e.data.showMessagesPopup(e.data.localization.title, e.data.messages);
            });
            return true;
        },
        getMessages: function() {
            this.getService().getStatusMessages();
        },
        /**
         * @public @method showStatusMessage
         * Shows the newest status message in the sidebar
         *
         * @param {String} message element message
         *
         */
         showStatusMessage: function(message) {
            var me = this;
            me.toggleIcon();
            if (!message && this.messages.length) {
                message = this.messages[this.messages.length - 1];
            }
            if (!message) {
                return;
            }
            var el = this.messageElement.find('.messagetext');
            el.show();
            el.text(message);
            setTimeout(function(){
              el.hide();
            },3000);
            if(this.messages.length === 0){
              el.empty();
            }
        },
        /**
         * @public @method toggleIcon
         * controls the visibility of the icon informing about messages
         *
         */
        toggleIcon: function(){
          var container = this.messageElement.find('div.message-container');
          if(this.messages.length > 0 && !container.hasClass('.flip')){
              container.addClass("flip");
          }
          if(this.messages.length === 0 && container.hasClass('flip')){
            container.toggleClass("flip");
          }
        },
        /**
         * @public @method showMessagesPopup
         * Shows user a message with ok button
         *
         * @param {String} title popup title
         * @param {String} message popup message
         *
         */
        showMessagesPopup: function(title, message) {
            if (this.popupIsOpen) {
                this._dialog.close(true);
                this.popupIsOpen = false;
                return;
            }
            var me = this;
            this.popupIsOpen = true;
            this._dialog = Oskari.clazz.create(
                'Oskari.userinterface.component.Popup'
            );
            var btn = this._dialog.createCloseButton('OK');
            btn.setHandler(function() {
                me._dialog.close();
                me.popupIsOpen = false;
            });
            message = message.join("<br/>");
            this._dialog.show(title, message, [btn]);
            this._dialog.moveTo(jQuery('.messageIcon'), 'top', true);
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance']
    });
