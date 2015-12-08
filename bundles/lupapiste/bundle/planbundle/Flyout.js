/**
 * @class Oskari.lupapiste.bundle.planbundle.Flyout
 */
Oskari.clazz.define('Oskari.lupapiste.bundle.planbundle.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.lupapiste.bundle.planbundle.FlyoutHelloWorldBundleInstance}
 *          instance reference to component that created the flyout
 */
function(instance) {
  this.instance = instance;
  this.container = null;
  this.state = null;
  this.template = null;
  me = this;
}, {
  /**
   * @method getName
   * @return {String} the name for the component
   */
  getName : function() {
    return 'Oskari.lupapiste.bundle.planbundle.Flyout';
  },
  /**
   * @method setEl
   * @param {Object}
   *          el reference to the container in browser
   * @param {Number}
   *          width container size(?) - not used
   * @param {Number}
   *          height container size(?) - not used
   * 
   * Interface method implementation
   */
  setEl : function(el, width, height) {
    this.container = el[0];
    if (!jQuery(this.container).hasClass('planbundle')) {
      jQuery(this.container).addClass('planbundle');
    }
  },
  /**
   * @method startPlugin
   * 
   * Interface method implementation, assigns the HTML templates that will be
   * used to create the UI
   */
  startPlugin : function() {
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
   * @method getOptions Interface method implementation, does nothing atm
   */
  getOptions : function() {

  },
  /**
   * @method setState
   * @param {Object}
   *          state state that this component should use Interface method
   *          implementation, does nothing atm
   */
  setState : function(state) {
    this.state = state;
  },

  /**
   * @method createUI Creates the UI for a fresh start
   */
  createUI : function() {
    var sandbox = me.instance.getSandbox();

    // clear container
    var cel = jQuery(this.container);
    cel.empty();
    var content = this.template.clone();
    content.append(this.instance.getLocalization('flyout').instructions);
    cel.append(content);
  },
  
  search : function(x, y) {
    var container = jQuery(this.container);
    container.empty();
    if(this.instance.urbanPlans) {
      this.searchUrban(x,y);
    }
    if(this.instance.urbanPlansLiiteri) {
      this.searchUrbanLiiteri(x,y);
    }
    if(this.instance.generalPlans) {
      this.searchGeneral(x,y);
    }
  },
  
  searchGeneral : function(x,y) {
    var container = jQuery(this.container);
    var generalContainer = jQuery('<div id="generalPlans"><h4>' + this.instance.getLocalization('flyout').titleGeneral + '</h4></div>');
    container.append(generalContainer);
    var cel = jQuery('<div id="generalPlanResults"></div>');
    generalContainer.append(cel);
    cel.append(this.instance.getLocalization('flyout').searchingGeneral + "</br>");
    cel.append('<img src="' + Oskari.app.appConfig.lupakartta.conf.ajaxloader + '" />');
    jQuery.ajax({
      url : Oskari.app.appConfig.lupakartta.conf.ajaxurl + "/general-plan-urls-by-point",
      data : {
        "x" : x,
        "y" : y
      },
      dataType : "json",
      success : function(data) {
        cel.empty();
        var content = "";
        if (data.length > 0) {
          content = content + "<table>";
          content = content + "<tr><td>" + me.instance.getLocalization('flyout').id + 
          "</td><td>" + me.instance.getLocalization('flyout').nimi + 
          "</td><td>" + me.instance.getLocalization('flyout').tyyppi + 
          "</td><td>" + me.instance.getLocalization('flyout').oikeusvaik + 
          "</td><td>" + me.instance.getLocalization('flyout').pvm + 
          "</td><td>" + me.instance.getLocalization('flyout').lisatieto + 
          "</td><td>" + me.instance.getLocalization('flyout').link + "</td></tr>";
          for ( var item in data) {
            content = content + "<tr>";
            content = content + "<td>" + data[item].id + "</td>";
            content = content + "<td>" + data[item].nimi + "</td>";
            content = content + "<td>" + data[item].tyyppi + "</td>";
            content = content + "<td>" + data[item].oikeusvaik + "</td>";
            content = content + "<td>" + data[item].pvm + "</td>";
            content = content + "<td>" + data[item].lisatieto + "</td>";
            content = content + "<td><a target='_blank' href='/proxy/plandocument?id=" + data[item].id + "'>Pdf</a></td>";
            content = content + "</tr>";
          }
          content = content + "</table>";
          cel.append(content);
        } else {
          cel.empty();
          cel.append(me.instance.getLocalization('flyout').notfound);
        }
        cel.append("</br>");
        var button = jQuery("<button/>");
        button.text(me.instance.getLocalization('flyout').newsearch).click(function() {
          me.createUI();
          me.instance.isActive = true;
        });
        cel.append(button);
      },
      error : function(err) {
        cel.empty();
        cel.append(me.instance.getLocalization('flyout').error);
        cel.append("</br>");
        var button = jQuery("<button/>");
        button.text(me.instance.getLocalization('flyout').newsearch).click(function() {
          me.createUI();
          me.instance.isActive = true;
        });
        cel.append(button);
      }
    });
  },
  
  searchUrban : function(x, y) {
    var container = jQuery(this.container);
    var urbanContainer = jQuery('<div id="urbanPlans"><h4>' + this.instance.getLocalization('flyout').titleUrban + '</h4></div>');
    container.append(urbanContainer);
    var cel = jQuery('<div id="urbanPlanResults"></div>');
    urbanContainer.append(cel);
    cel.append(this.instance.getLocalization('flyout').searchingUrban + "</br>");
    cel.append('<img src="' + Oskari.app.appConfig.lupakartta.conf.ajaxloader + '" />');
    jQuery.ajax({
      url : Oskari.app.appConfig.lupakartta.conf.ajaxurl + "/plan-urls-by-point",
      data : {
        "x" : x,
        "y" : y,
        "municipality" : Oskari.app.appConfig.lupakartta.conf.municipality
      },
      dataType : "json",
      success : function(data) {
        cel.empty();
        var content = "";
        if (data.length > 0) {
          content = content + "<table>";
          content = content + "<tr><td>" + me.instance.getLocalization('flyout').id + "</td><td>" + me.instance.getLocalization('flyout').link + "</td></tr>";
          for ( var item in data) {
            content = content + "<tr>";
            content = content + "<td>" + data[item].kaavanro + "</td>";
            content = content + "<td><a target='_blank' href='" + data[item].linkki + "'>Pdf</a></td>";
            content = content + "</tr>";
          }
          content = content + "</table>";
          cel.append(content);
        } else {
          cel.empty();
          cel.append(me.instance.getLocalization('flyout').notfound);
        }
      },
      error : function(err) {
        cel.empty();
        cel.append(me.instance.getLocalization('flyout').error);
      }
    });
  },
  
  searchUrbanLiiteri : function(x, y) {
    var container = jQuery(this.container);
    var urbanContainer = jQuery('<div id="urbanPlansLiiteri"><h4>' + this.instance.getLocalization('flyout').titleUrbanLiiteri + '</h4></div>');
    container.append(urbanContainer);
    var cel = jQuery('<div id="urbanPlanLiiteriResults"></div>');
    urbanContainer.append(cel);
    cel.append(this.instance.getLocalization('flyout').searchingUrbanLiiteri + "</br>");
    cel.append('<img src="' + Oskari.app.appConfig.lupakartta.conf.ajaxloader + '" />');
    jQuery.ajax({
      url : Oskari.app.appConfig.lupakartta.conf.ajaxurl + "/plan-urls-by-point",
      data : {
        "x" : x,
        "y" : y,
        "municipality" : 'liiteri'
      },
      dataType : "json",
      success : function(data) {
        cel.empty();
        var content = "";
        if (data.length > 0) {
          content = content + "<table>";
          content = content + "<tr><td>" + me.instance.getLocalization('flyout').id + "</td><td>" + me.instance.getLocalization('flyout').link + "</td></tr>";
          for ( var item in data) {
            content = content + "<tr>";
            content = content + "<td>" + data[item].kaavanro + "</td><td>";
            if(typeof data[item].linkki === undefined || data[item].linkki === null || data[item].linkki.length === 0) {
              content = content + me.instance.getLocalization('flyout').notAvailable; 
            } else {
              content = content + "<a target='_blank' href='" + data[item].linkki + "'>Pdf</a>";
            }
            
            content = content + "</td></tr>";
          }
          content = content + "</table>";
          cel.append(content);
        } else {
          cel.empty();
          cel.append(me.instance.getLocalization('flyout').notfound);
        }
      },
      error : function(err) {
        cel.empty();
        cel.append(me.instance.getLocalization('flyout').error);
      }
    });
  }
}, {
  /**
   * @property {String[]} protocol
   * @static
   */
  'protocol' : [ 'Oskari.userinterface.Flyout' ]
});
