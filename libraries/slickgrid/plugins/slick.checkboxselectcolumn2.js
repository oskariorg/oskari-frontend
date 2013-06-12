(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "CheckboxSelectColumn2": CheckboxSelectColumn
    }
  });


  function CheckboxSelectColumn(options) {
    var _grid;
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _selectedRowsLookup = {};
    var _defaults = {
      columnId: "_checkbox_selector",
      cssClass: null,
      toolTip: "Select/Deselect All",
      width: 30
    };

    var _options = $.extend(true, {}, _defaults, options);

    function init(grid) {
      _grid = grid;
      _handler
        .subscribe(_grid.onClick, handleClick)
        .subscribe(_grid.onHeaderClick, handleHeaderClick)
        .subscribe(_grid.onKeyDown, handleKeyDown);
    }

    function destroy() {
      _handler.unsubscribeAll();
    }

    function handleKeyDown(e, args) {
      if (e.which == 32) {
        if (_grid.getColumns()[args.cell].id === _options.columnId) {
          // if editing, try to commit
          if (!_grid.getEditorLock().isActive() || _grid.getEditorLock().commitCurrentEdit()) {
            toggleRowSelection(args.row);
          }
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    }

    function handleClick(e, args) {
      // clicking on a row select checkbox
      if (_grid.getColumns()[args.cell].id === _options.columnId && $(e.target).is(":checkbox")) {
        // if editing, try to commit
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }

_self.onSelectRowClicked.notify(args, e, _self);

// handle headerRowCheckbox
var dataView = _grid.getData(),
    groups = dataView.getGroups(),
    length = dataView.getItems().length,
    isAllChecked = false;
for(var key in groups) {
  var group = groups[key];
  if(group.count == length && $(e.target).is(":checked")){
    _grid.updateColumnHeader(_options.columnId, "<input type='checkbox' checked='checked'>", _options.toolTip);
    isAllChecked = true;
    break;
  }
}
if(!isAllChecked) {
  _grid.updateColumnHeader(_options.columnId, "<input type='checkbox'>", _options.toolTip);
}
//update data
_grid.getData().refresh();
//render all the rows (and checkboxes) again
_grid.invalidateAllRows();
_grid.render();

        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

    function handleHeaderClick(e, args) {
      if (args.column.id == _options.columnId && $(e.target).is(":checkbox")) {
        // if editing, try to commit
        if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }

        var items = _grid.getData().getItems();
        if ($(e.target).is(":checked")) {
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.sel = 'checked';
          }
        } else {
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.sel = 'empty';
          }
        }
//update data
_grid.getData().setItems(items);
_grid.getData().refresh();
//render all the rows (and checkboxes) again
_grid.invalidateAllRows();
_grid.render();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }

    function getColumnDefinition() {
      return {
        id: _options.columnId,
        name: "<input type='checkbox'>",
        toolTip: _options.toolTip,
        field: "sel",
        width: _options.width,
        resizable: false,
        sortable: false,
        cssClass: _options.cssClass,
        formatter: checkboxSelectionFormatter
      };
    }

    function checkboxSelectionFormatter(row, cell, value, columnDef, dataContext) {
      if (dataContext) {
return dataContext.sel == 'checked'
            ? "<input type='checkbox' checked='checked'>"
            : "<input type='checkbox'>";
      }
      return null;
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,

      "onSelectRowClicked": new Slick.Event(),

      "getColumnDefinition": getColumnDefinition
    });
  }
})(jQuery);