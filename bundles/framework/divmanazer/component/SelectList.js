/**
 * @class Oskari.userinterface.component.Select
 *
 * Simple select using jQuery chosen
 */
Oskari.clazz.define('Oskari.userinterface.component.SelectList',

  function(){
    this._option = jQuery('<option></option>');
    this._selectTemplate = jQuery('<div class="oskari-select">'+
                                  '<select></select>'+
                                  '</div>');
  },{
    /**@method createSelectWithData
    *  creates a select with data specified
    * @param {Object} data, needs to have the keys id and title to construct a list
    * @param {Object} options
    * @return {jQuery Element} a list with chosen applied
     */
    createSelectWithData: function(data, options){
      var select = this._selectTemplate.clone();
      //append empty options so we can use the placeholder
      var emptyoption = this._option.clone();
      select.find('select').append(emptyoption);

      for(var i = 0; i<data.length; i++){
        // datakey needs to be parsed to suit all incoming data
        var dataKey = data[i];
        var option = this._option.clone();
        if(!dataKey.id && !dataKey.title){
          option.val(dataKey).text(dataKey);
        }
        option.val(dataKey.id).text(dataKey.title);
        select.find('select').append(option);
      }
      return this.makeChosen(select, options);
    },
    /**@method makeChosen
    *  applies jQuery chosen to specidied element
    * @param {element} el
     */
    makeChosen: function(el, options){
      el.find('select').chosen({
          width: options.width,
          no_results_text: options.no_results_text,
          placeholder_text: options.placeholder_text,
          disable_search_threshold: options.disable_search_threshold ? options.disable_search_threshold : 10,
          allow_single_deselect : options.allow_single_deselect ? options.allow_single_deselect : false
      });
      return el;
    },
    /**@method adjustChosen
    *  checks if the dropdown needs to show up or down
    * @param {element} select
     */
    adjustChosen: function(select){
      var selected = $(select).find('select');
      //check parent element(s) to apply overflow visible if needed
      selected.on('chosen:showing_dropdown', function () {

          jQuery(this).parents('div').each(function() {
              var el = jQuery(this);
              if(!el.hasClass('oskari-flyoutcontentcontainer')) {
                  el.css('overflow', 'visible');
              }
          });
      });
      // determine which way the dropdown should open
        selected.on('chosen:showing_dropdown', function(event, params) {
           var chosen_container = $( event.target ).next( '.chosen-container' );
           var dropdown = chosen_container.find( '.chosen-drop' );
           var dropdown_top = dropdown.offset().top - $(window).scrollTop();
           var dropdown_height = dropdown.height();
           var viewport_height = $(window).height();

         if ( dropdown_top + dropdown_height > viewport_height ) {
            chosen_container.addClass( 'chosen-drop-up' );
         }
      });
      selected.on('chosen:hiding_dropdown', function(event, params) {
         $( event.target ).next( '.chosen-container' ).removeClass( 'chosen-drop-up' );
      });
    }
  },
  {
      extend: ['Oskari.userinterface.component.FormComponent']
  }
);
