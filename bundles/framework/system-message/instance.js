/* Add this to startupsequence to get this bundle started
{
  bundlename : 'system-message',
  metadata : {
  "Import-Bundle" : {
  "system-message" : {
  bundlePath : '/Oskari/packages/framework/bundle/'
  }
  }
  }
}
*/
/*
Searches dom for element with id="oskari-system-messages", that is used for displaying messages.
*/
Oskari.clazz.define(
  'Oskari.framework.bundle.system-message.SystemBundleInstance',

  function () {
      this.sandbox = null;
      this.started = false;
      this._localization = null;
      this.messages = [];
      this.popupIsOpen = false;
      this.messageElement = null;
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
       getName: function () {
           return this.__name;
       },
      init : function() {},
      /**
       * @method setSandbox
       * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
       * Sets the sandbox reference to this component
       */
      setSandbox: function (sbx) {
          this.sandbox = sbx;
      },
      /**
       * @method getSandbox
       * @return {Oskari.mapframework.sandbox.Sandbox}
       */
      getSandbox: function () {
          return this.sandbox;
      },

      /**
       * @method update
       * implements BundleInstance protocol update method - does nothing atm
       */
      update: function () {
          var me = this;
      },
      /**
       * @method start
       *
       * implements BundleInstance start methdod
       *
       * creates and registers request handlers
       *
       */
      start: function () {
        var me = this;
        if ( me.started ) {
            return;
        }
        me.initDomElements();
        me.started = true;
        var sandbox = Oskari.getSandbox();
        me.setSandbox( sandbox );
        this.localization = Oskari.getLocalization( this.getName() );
        this.systemMessageService = this.createService( sandbox );
        sandbox.register( me );
        this.getMessages();

        // create request handlers
        me.showMessageRequestHandler = Oskari.clazz.create(
            'Oskari.framework.bundle.system.message.request.ShowMessageRequestHandler',
            me
        );
        // register request handlers
        sandbox.addRequestHandler(
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
      createService: function( sandbox ) {
          var systemMessageService = Oskari.clazz.create(
              'Oskari.framework.bundle.system.message.service.SystemMessageService',
              this
          );
          sandbox.registerService( systemMessageService );
          return systemMessageService;
      },
      getService: function() {
          return this.systemMessageService;
      },
      initDomElements: function(){
          var me = this;
          //Get reference to the div we use to show the messages
          this.messageElement = $('#oskari-system-messages');
          if(!this.messageElement.length){
            Oskari.log(me.getName()).warn('Could not find element with id #oskari-system-messages');
            return;
          }
          var icon = this.messageElement.find( "div.messageIcon");
          icon.on("click", this, function(e){
              e.data.showMessagesPopup( e.data.localization.title, e.data.messages );
          });
      },
      getMessages: function(){
        this.getService().getLayerStatus();
      },
      showStatusMessage: function(message){
        var me = this;
        if(!message && this.messages.length){
            message = this.messages[this.messages.length-1];
        }
        if(!message) {
          return;
        }
        var el = this.messageElement.find('.messagetext');
        el.text(message);
        setTimeout(function() {
          el.fadeOut(500);
        }, 5000);
      },
      /**
       * @public @method showMessage
       * Shows user a message with ok button
       *
       * @param {String} title popup title
       * @param {String} message popup message
       *
       */
      showMessagesPopup: function ( title, message ) {
        if(this.popupIsOpen){
          return;
        }
        var me = this;
        this.popupIsOpen = true;
          var dialog = Oskari.clazz.create(
              'Oskari.userinterface.component.Popup'
          );
          var btn = dialog.createCloseButton('OK');
          btn.setHandler(function() {
            dialog.close();
            me.popupIsOpen = false;
          });
          message = message.join("<br/>");
          dialog.show( title, message, [btn] );
          dialog.moveTo( jQuery( '.messageIcon' ), 'top', true );
      }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance']
    });
