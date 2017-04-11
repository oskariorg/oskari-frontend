/**
 * @class Oskari.userinterface.component.ProgressBar
 *
 * Simple progressbar
 */
Oskari.clazz.define( 'Oskari.userinterface.component.ProgressBar',

  function(){
    this._progressBar = jQuery( '<div class="oskari-progressbar"></div>' );
    this._element = null;
  },{
    defaultColor : 'rgba( 0, 40, 190, 0.4 )',
    /**@method create
    *  creates a progressbar with data specified
    * @param {Object} progress, how much into our goal
    * @param {Object} goal, total number which to fill
    * @return {jQuery Element} a list with chosen applied
     */
    create: function(target) {
      this._element = this._progressBar.clone();
      this._element.css({
         position: 'absolute',
         top: 0,
         left: 0,
         height: '0.5%',
         background: this.defaultColor,
         width: 0,
         transition: 'width 250ms',
         zIndex:25000
      });
      var content = target;
      content.append( this._element );
      return this._element;
    },
    updateProgressBar: function( goal, current ) {
      if( goal === 0 ) {
        return;
      }
      var width = ( current / goal * 100 ).toFixed( 1 );
      this._element.css( { width: width+'%' } );
      if( width >= 100.0 ) {
          this.hide();
      }
    },
    setColor: function(color){
      this._element.css( { background: color } );
    },
    show: function() {
      this._element.css( { visibility: 'visible' } );
    },
    hide: function() {
      var me = this;
      setTimeout( function() {
        me._element.css( { visibility: 'hidden', width: 0, background: me.defaultColor } );
      }, 400 );
    }

});
