/**
 * @class Oskari.userinterface.component.Select
 *
 * Simple select using jQuery chosen
 */
Oskari.clazz.define('Oskari.userinterface.component.SelectList',

  function( id ) {
    this.id = id;
    this._option = jQuery('<option></option>');
    this._selectTemplate = jQuery('<div class="oskari-select">'+
                                  '<select></select>'+
                                  '</div>');
    this.element = null;
  },{
    /**@method create
    *  creates a select with data specified
    * @param {Object} data, needs to have the keys id and title to construct a list
    *   * cls - optional param in data which sets a class to the list element so you can ex. toggle visible items in a dropdown based on class.
    * @param {Object} options
    * @return {jQuery Element} a list with chosen applied
     */
    create: function( data, options ) {
      options.allowReset = options.allowReset === false ? options.allowReset : true;
      var select = this._selectTemplate.clone();
      this.element = select;
      if ( data === undefined ) {
        return this.makeChosen( select, options );
      }

      //append empty options so we can use the placeholder

      if ( options.allowReset ) {
        var emptyoption = this._option.clone();
        select.find('select').append(emptyoption);
      }

      for ( var i = 0; i<data.length; i++ ) {
        // datakey needs to be parsed to suit all incoming data
        var dataKey = data[i];
        var option = this._option.clone();

        if ( !dataKey.id && !dataKey.title ) {
          option.val( dataKey ).text( dataKey );
        }
        if(dataKey.cls) {
          option.addClass(dataKey.cls);
        }
        option.val(dataKey.id).text(dataKey.title);
        select.find('select').append(option);

      }
      return this.makeChosen( select, options );
    },
    /**@method makeChosen
    *  applies jQuery chosen to specidied element
    * @param {element} el
     */
    makeChosen: function( el, options ) {
      el.find( 'select' ).chosen({
          width: options.width,
          no_results_text: options.no_results_text,
          placeholder_text: options.placeholder_text,
          disable_search_threshold: options.disable_search_threshold ? options.disable_search_threshold : 10,
          allow_single_deselect : options.allow_single_deselect ? options.allow_single_deselect : false
      });
      return el;
    },
    /** @method selectFirstValue
    *   Select the first non-placeholder value
    */
    selectFirstValue: function () {
      var chosen = this.element.find('select');
      chosen.find('option:nth-child(2)').attr('selected', 'selected');
      this.update();
    },
    resetToPlaceholder: function() {
      var chosen = this.element.find('select');
      chosen.find('option:first-child').attr('selected', 'selected');
      this.update();
    },
    update: function() {
      this.element.find('select').trigger('chosen:updated');
    },
    /**  @method addOption appends a new option to the select
     *   @param { Object } object with keys id and title
     */

    addOption: function ( data ) {
        var chosen = this.element.find('select');
        var option = this._option.clone();
        option.val( data.id ).text( data.title );
        chosen.append( option );
        chosen.trigger('chosen:updated');
    },
    /**  @method removeOption removes an options where value mathces id
     *   @param { Object } object with keys id and title
     */
    removeOption: function ( id ) {
        var chosen = this.element.find('select');
        var options = chosen.find('option');
        var tobeRemoved = options.filter(function(index, opt) {
            return opt.value == id;
        });
        tobeRemoved.remove();
        chosen.trigger('chosen:updated');
    },
    /** @method updateOptions
    *   updates an already defined chosen with new data
    *   @param {data} data to apply
    */
    updateOptions: function( data ) {
      var me = this;
      var chosen = this.element.find('select');
      chosen.trigger('chosen:close');
      chosen.empty();
      //append empty options so we can use the placeholder
      if ( chosen.find('option').length === 0 ) {
        var emptyoption = this._option.clone();
        chosen.append( emptyoption );
      }
      if ( !this.element ) {
        this.element = select;
      }

      data.forEach( function( choice ) {
        var option = me._option.clone();
        option.val( choice.id ).text( choice.title );
        chosen.append( option );
      });
      this.update();

    },
    getId: function () {
      return this.id;
    },

    setValue: function ( value ) {
      if ( !this.element.find('select') ) {
        Oskari.log('Oskari.userinterface.component.SelectList').warn(" Couldn't set value, no element. Call create to initialize");
      }
      this.element.find('select').val( value );
      this.element.find('select').trigger('chosen:updated');
    },
    getValue: function () {
      if ( typeof this.element === 'undefined' ) {
        Oskari.log('Oskari.userinterface.component.SelectList').warn(" Couldn't get value, no element set");
        return;
      }
      return this.element.find( 'select' ).val();
    },

    /** @method adjustChosen
    *   adjusts the chosen direction according to the screen
    */
    adjustChosen: function() {
      var selected = this.element.find('select');
      //check parent element(s) to apply overflow visible if needed
      selected.on('chosen:showing_dropdown', function () {

          jQuery(this).parents('div').each( function () {
              var el = jQuery( this );
              if ( !el.hasClass('oskari-flyoutcontentcontainer') ) {
                  el.css('overflow', 'visible');
              }
          });
      });
      // determine which way the dropdown should open
        selected.on( 'chosen:showing_dropdown', function( event, params ) {
           var chosen_container = jQuery( event.target ).next( '.chosen-container' );
           var dropdown = chosen_container.find( '.chosen-drop' );
           var dropdown_top = dropdown.offset().top - jQuery( window ).scrollTop();
           var dropdown_height = dropdown.height();
           var viewport_height = jQuery( window ).height();

         if ( dropdown_top + dropdown_height > viewport_height ) {
            chosen_container.addClass( 'chosen-drop-up' );
         }
      });
      selected.on( 'chosen:hiding_dropdown', function( event, params ) {
         jQuery( event.target ).next( '.chosen-container' ).removeClass( 'chosen-drop-up' );
      });
    }
  },
  {
      extend: ['Oskari.userinterface.component.FormComponent']
  }
);
