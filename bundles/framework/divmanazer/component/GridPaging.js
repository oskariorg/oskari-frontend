/**
 * @class Oskari.userinterface.component.Grid
 *
 * Includes paging functionalities of Oskari.userinterface.component.Grid
 */
Oskari.clazz.category(
    'Oskari.userinterface.component.Grid',
    'paging',
    {
        /* Current page. Used to keep track current page when sorting cols */
        _currentPage: {},
        /**
         * @method  @private _changePage  Change page
         * @param  {Object} groupHeader group header
         */
        _changePage: function(groupHeader){
            var me = this;

            if(me._groupingHeaders && groupHeader.attr('data-group-cols')) {
                var page = Number(groupHeader.attr('data-page'));
                var groupIndex = groupHeader.attr('data-header-index');
                me._currentPage[groupIndex] = page;
                var maxCols = Number(groupHeader.attr('data-max-cols'));
                var maxPages = Number(groupHeader.attr('data-max-page'));
                var groupCols = Number(groupHeader.attr('data-group-cols'));
                var groupStartCol = Number(groupHeader.attr('data-start-col'));
                var table = groupHeader.parents('table');
                var next = groupHeader.find('.paging.next');
                var previous = groupHeader.find('.paging.previous');
                var c;

                // hide grouping cols
                for(var i=groupStartCol;i<groupCols+groupStartCol;i++){
                    var content = table.find('tr th:not(.grouping):nth-child('+i+') ,td:not(.grouping):nth-child('+i+')');
                    content.hide();
                }

                var pagingHandler = function(groupHeader, data) {
                    var headerIndex = Number(groupHeader.attr('data-header-index'));
                    var header = me._groupingHeaders[headerIndex];
                    // If header has paging handler then do it
                    if(typeof header.pagingHandler === 'function') {
                        header.pagingHandler(groupHeader.find('.title'), data);
                    }
                    // otherwise show default text, for example: "2-4/5"
                    else if(!header.text) {
                        groupHeader.find('.title').html(data.visible.start + '-' + data.visible.end + '/' + data.count);
                    }
                };

                // Check buttons visibility
                var checkPagingButtonsVisiblity = function(){
                    var page = Number(groupHeader.attr('data-page'));
                    var next = groupHeader.find('.paging.next');
                    var previous = groupHeader.find('.paging.previous');
                    next.removeClass('hidden');
                    previous.removeClass('hidden');
                    if(page===1) {
                        previous.addClass('hidden');
                    } else if(page === Number(groupHeader.attr('data-max-page'))){
                        next.addClass('hidden');
                    }
                };

                var visibleCols = Array.apply(null, {length: groupCols}).map(Number.call, Number);

                // Get visible cols and shows them
                // If page is first then show only first cols
                if(page === 1) {
                    visibleCols = visibleCols.slice(0, maxCols);
                }
                // else page is latest
                else if (page === maxPages) {
                    visibleCols = visibleCols.slice(Math.max(groupCols - maxCols, 1));
                }
                // else page is between first and latest
                else {
                    visibleCols = visibleCols.slice((page-1) * maxCols, page * maxCols);
                }

                // Show page cols
                visibleCols.forEach(function(element){
                    var colIndex = element + groupStartCol;
                    var currentColEl = table.find('tr th:nth-child(' + colIndex + '):not(.grouping),td:nth-child(' + colIndex + '):not(.grouping)');
                    currentColEl.show();
                });


                if(visibleCols.length < groupCols) {
                    pagingHandler(groupHeader, {
                        visible: {
                            start: visibleCols[0] + 1,
                            end: visibleCols[visibleCols.length-1] + 1
                        },
                        count: groupCols,
                        page: page,
                        maxPages: maxPages
                    });

                    checkPagingButtonsVisiblity();
                }


            }
        },
        /**
         * @method  @private_checkPaging Check table paging
         * @param  {Object} table jQuery table dom
         */
        _checkPaging: function(table){
            var me = this;
            if(me._groupingHeaders) {
                // Paging handlers
                var prevHandler = function(evt) {
                    evt.stopPropagation();
                    var groupHeader = jQuery(this).parents('th.grouping');
                    var page = Number(groupHeader.attr('data-page')) - 1;
                    if(page < 1) {
                        page = 1;
                    }
                    groupHeader.attr('data-page', page);
                    me._changePage(groupHeader);
                };

                var nextHandler = function(evt) {
                    evt.stopPropagation();
                    var groupHeader = jQuery(this).parents('th.grouping');
                    var page = Number(groupHeader.attr('data-page')) + 1;
                    if(page > groupHeader.attr('data-max-page')) {
                        page = groupHeader.attr('data-max-page');
                    }
                    groupHeader.attr('data-page', page);
                    me._changePage(groupHeader);
                };
                table.find('th.grouping').each(function(i,el){
                    var groupHeader = jQuery(this);
                    var groupCols = groupHeader.attr('colspan') ?  Number(groupHeader.attr('colspan')) :  1;
                    var maxCols = groupHeader.attr('data-max-cols');
                    var next = groupHeader.find('.paging.next');
                    var previous = groupHeader.find('.paging.previous');
                    if(!!maxCols && groupCols > maxCols){
                        if(me._groupingHeaders.length > 1 && i === 0) {
                            next.addClass('hidden');
                        } else if(me._groupingHeaders.length > 1 && i > 0) {
                            previous.addClass('hidden');
                        }

                        var maxPage = (groupCols - (groupCols % maxCols)) / maxCols;
                        if(groupCols % maxCols > 0) {
                            maxPage += 1;
                        }
                        groupHeader.attr('data-group-cols', groupCols);
                        groupHeader.attr('data-max-page', maxPage);
                        groupHeader.attr('data-page', maxPage);

                        var groupIndex = groupHeader.attr('data-header-index');

                        // Bind events
                        next.unbind('click');
                        next.bind('click', nextHandler);
                        previous.unbind('click');
                        previous.bind('click', prevHandler);

                        if(me._currentPage[groupIndex]) {
                            groupHeader.attr('data-page', me._currentPage[groupIndex]);
                            // release current page information
                            delete me._currentPage[groupIndex];
                        }

                        me._changePage(groupHeader);
                    } else {
                        next.remove();
                        previous.remove();
                    }
                });
            }
        },
        /**
         * @method  @private _selectActivePage Select active to visible page
         */
        _selectActivePage: function(){
            var me = this;
            // Safety checks
            if(!this.table || !me._groupingHeaders) {
                return;
            }
            var selected = this.table.find('th.selected');
            if(!selected.is(':visible')) {
                var colIndex = this.table.find('tr th:not(.grouping)').index(selected);
                var cols = 0;

                // Resolve wanted page to visible
                selected.parent().parent().find('tr.grouping th').each(function(){
                    var groupHeader = jQuery(this);
                    if(!groupHeader.attr('colspan')){
                        cols++;
                    } else {
                        cols += Number(groupHeader.attr('colspan'));
                    }
                    var maxCols = Number(groupHeader.attr('data-max-cols'));
                    var groupStartCol = Number(groupHeader.attr('data-start-col'));

                    // Founded matching group header
                    if(colIndex < cols && colIndex + 1 >= groupStartCol && !!maxCols) {
                        // resolve wanted page
                        var wantedPage = (colIndex - (colIndex % maxCols)) / maxCols;
                        if(colIndex % maxCols > 0) {
                            wantedPage += 1;
                        }
                        groupHeader.attr('data-page',wantedPage);
                        me._changePage(groupHeader);
                    }
                });
            }
        }
    }
);