/**
 * @class Oskari.userinterface.component.Badge
 */
Oskari.clazz
  .define('Oskari.userinterface.component.Badge',

	  /**
	   * @method create called automatically on construction
	   * @static
	   *
	   */
	  function() {
	    this.compiledTemplates = {};
	    this.compileTemplates();
	    this.ui = null;
	    this.container = null;
	  }, {
	    templates : {
	      "default" : '<span class="oskari-badge"></span>',
	      "success" : '<span class="oskari-badge oskari-badge-success"></span>',
	      "warning" : '<span class="oskari-badge oskari-badge-warning"></span>',
	      "important" : '<span class="oskari-badge oskari-badge-important"></span>',
	      "info" : '<span class="oskari-badge oskari-badge-info"></span>',
	      "success" : '<span class="oskari-badge oskari-badge-inverse"></span>'
	    },
	    compileTemplates : function() {
	      for(var p in this.templates ) {
		this.compiledTemplates[p] = jQuery(this.templates[p]);
	      }
	    },
	    insertTo : function(container) {
	      this.container = container;
	    },
	    setContent : function(pContent, status) {
	      if( this.ui ) {
		this.ui.remove();
		this.ui = null;
	      }
	      
	      var txtspan = this.compiledTemplates[status || 'default'].clone();
	      txtspan.append(pContent);
	      this.container.append(txtspan);
	      this.ui = txtspan;
	    },
	    hide : function() {
	      if( this.ui)  {
		this.ui.remove();
		this.ui = null;
	      }
	    }
	  });
