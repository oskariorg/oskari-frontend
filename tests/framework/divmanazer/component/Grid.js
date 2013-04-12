// Might need refactoring
describe.only('Grid component', function() {
  var grid, titleText = 'title';
 


    describe('initialization', function() {
        it('should be defined', function() {
            expect(grid).to.be.ok();
        });

        it('should be found in DOM', function() {
            var $oskariGridTable = jQuery('.oskari-grid');
            expect($oskariGridTable.length).to.equal(1);
        });
        it('should have a column selector in DOM', function() {
            var $oskariGridSelector = jQuery('.column-selector');
            expect($oskariGridSelector.length).to.equal(1);
        });
    });


  beforeEach(function() {
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