// Might need refactoring
describe.only('Popup component', function() {
  var grid, titleText = 'title';
 
  

    describe('initialization', function() {
        it('should be defined', function() {
            expect(grid).to.be.ok();
        });

        it('should be found in DOM', function() {
            var $oskariGridTable = jQuery('.oskari-grid');
            expect($oskariGrid.length).to.equal(1);
        });
        it('should have a column selector in DOM', function() {
            var $oskariGridSelector = jQuery('.column-selector');
            expect($oskariGridSelector.length).to.equal(1);
        });
        it('should have a name visible in DOM', function() {
            var $name = jQuery('div.oskarifield').find('input').attr('name');
            expect($name).to.be(testName);
        });
        
    });






/*
                // if multiple featuredatas, we will have a "__featureName" field in "all" model -> rename it for ui
                grid.setColumnUIName('__featureName', this.instance.getLocalization('featureNameAll'));
                // set selection handler
                grid.addSelectionListener(function(pGrid, dataId) {
                    me._handleGridSelect(layer, dataId);
                });

                // set popup handler for inner data
                var showMore = this.instance.getLocalization('showmore');
                grid.setAdditionalDataHandler(showMore,
                    function(link, content) {
                        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        var okBtn = dialog.createCloseButton("OK");
                        okBtn.addClass('primary');
                        dialog.show(showMore, content, [okBtn]);
                        dialog.moveTo(link, 'bottom');
                });

                var visibleFields = [];
                // filter out certain fields
                for(var i = 0; i < fields.length; ++i) {
                    if(fields[i] != 'featureId' &&
                       fields[i] != 'qName') {
                           visibleFields.push(fields[i]);
                    }
                }
                grid.setVisibleFields(visibleFields);
                grid.setColumnSelector(true);
                grid.setResizableColumns(true);
*/


/*  it('should be found in DOM', function(){
    var popup = jQuery('div.divmanazerpopup');
    expect(popup.length).to.equal(1);
  });

  it('should have a title', function() {
    var popup = jQuery('div.divmanazerpopup');
    var title = popup.find('h3').html();
    expect(title).not.to.be(null);
    expect(title).to.equal('title'); // dialog.getTitle()
  });
*/

  beforeEach(function() {
debugger;
    var data = [
        {'row0': 0, 'row1':1,'row2':2,'row3':3},
        {'row0': 00, 'row1':11,'row2':22,'row3':33},
        {'row0': 000, 'row1':111,'row2':222,'row3':333},
        {'row0': 0000, 'row1':1111,'row2':2222,'row3':3333},
        {'row0': 00000, 'row1':11111,'row2':22222,'row3':33333}
    ];

    var gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
    gridModel.addData(data[0]);
    gridModel.addData(data[1]);
    gridModel.addData(data[2]);
    gridModel.addData(data[3]);
    gridModel.addData(data[4]);

    grid = Oskari.clazz.create('Oskari.userinterface.component.Grid', 'Grid test');

    grid.setDataModel(gridModel);    
    grid.setColumnUIName('__featureName', 'featureNameAll');
    var visibleFields = ['row1','row2','row3'];
    grid.setVisibleFields(visibleFields);
    grid.setColumnSelector(true);
    grid.setResizableColumns(true);

    grid.renderTo(jQuery('body'));
  });

  afterEach(function() {
        jQuery('body').children().remove();
    });
});