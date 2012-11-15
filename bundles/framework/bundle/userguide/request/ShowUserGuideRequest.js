
/**
 * @class Oskari.framework.bundle.userguide.request.ShowUserGuideRequest
 * 
 *   
 */
Oskari.clazz
  .define(
    'Oskari.mapframework.bundle.userguide.request.ShowUserGuideRequest',
    function(conf) {
      var config = conf || {};
      this._creator = null;
      this._el = config.el;
      this._context = config.context;
      this._extension = config.extension;
      this._toggle = config.toggle;
      this._placement = config.placement;
      this._content = config.content;
    }, {
      __name : "userguide.ShowUserGuideRequest",
      getName : function() {
        return this.__name;
      },

      getUuid : function() {
        return this._uuid;
      },
      
      getContext: function() {
        return this._context;
      },

      getExtension: function() {
        return this._extension;
      },
      
      getEl: function() {
        return this._el;
      } ,
      isToggle: function() {
        return this._toggle;
      },
      getPlacement: function() {
        return this._placement;
      },
      getContent: function() {
        return this._content;
      }
      
    },
    
    {
      'protocol' : ['Oskari.mapframework.request.Request']
    });

/* Inheritance */
