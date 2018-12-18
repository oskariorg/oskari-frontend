Oskari.registerLocalization({
    'lang': 'en',
    'key': 'StatsGrid',
    'value': {
        'tile': {
            'title': 'Thematic maps',
            'search': 'Search data',
            'table': 'Table',
            'diagram': 'Bar chart'
        },
        'flyout': {
            'title': 'Thematic maps'
        },
        'dataProviderInfoTitle': 'Indicators',
        'layertools': {
            'table_icon': {
                'tooltip': 'Move to thematic maps',
                'title': 'Thematic maps'
            },
            'diagram_icon': {
                'tooltip': 'Show data in diagram',
                'title': 'Diagram'
            },
            'statistics': {
                'tooltip': 'Move to thematic maps',
                'title': 'Statistics'
            }
        },
        'panels': {
            'newSearch': {
                'title': 'SEARCH DATA',
                'seriesTitle': 'Time series',
                'datasourceTitle': 'Data source',
                'indicatorTitle': 'Indicator',
                'regionsetTitle': 'Regional division filter (optional)',
                'seriesLabel': 'Get data as time series',
                'selectDatasourcePlaceholder': 'Select data source',
                'selectIndicatorPlaceholder': 'Select data',
                'selectRegionsetPlaceholder': 'Select regionset',
                'noResults': 'No results found matching',
                'refineSearchLabel': 'Specify contents of the examined data',
                'refineSearchTooltip1': 'You will get more options after choosing data provider and data.',
                'refineSearchTooltip2': '',
                'addButtonTitle': 'Get contents of data',
                'clearButtonTitle': 'Clear',
                'defaultPlaceholder': 'Select value',
                'selectionValues': {
                    'sex': {
                        'placeholder': 'Select gender',
                        'male': 'Male',
                        'female': 'Female',
                        'total': 'Altogether'
                    },
                    'year': {
                        'placeholder': 'Select year'
                    },
                    'regionset': {
                        'placeholder': 'Select areal division'
                    }
                },
                'noRegionset': 'No area selected'
            }
        },
        'statsgrid': {
            'title': 'SEARCHED DATA',
            'noResults': 'No data selected',
            'noValues': 'No values for the selected data',
            'areaSelection': {
                'title': 'AREAL DIVISION',
                'info': 'Redefine areal division for data from dropdown list'
            },
            'source': 'Indicator',
            'orderBy': 'Sort',
            'orderByAscending': 'Sort ascending',
            'orderByDescending': 'Sort descending',
            'removeSource': 'Remove data'
        },
        'legend': {
            'title': 'Classification',
            'noActive': 'Data was not selected, select data to see map classification.',
            'noEnough': 'The data is too small to be classified, try different data or change limitings.',
            'noData': 'Data is not available for the selected point in time.',
            'cannotCreateLegend': 'Legend cannot be created by chosen values, try different values.'
        },
        'series': {
            'speed': {
                'label': 'Animation speed',
                'fast': 'Fast',
                'normal': 'Normal',
                'slow': 'Slow'
            }
        },
        'diagram': {
            'title': 'Diagram'
        },
        'parameters': {
            'sex': 'Gender',
            'year': 'Year',
            'Vuosi': 'Year',
            'regionset': 'Regional division',
            'from': 'from',
            'to': 'to'
        },
        'datatable': 'Table',
        'published': {
            'showMap': 'Show map',
            'showTable': 'Show table'
        },
        'classify': {
            'classify': 'Classification',
            'classifymethod': 'Classification method',
            'classes': 'Class division',
            'methods': {
                'jenks': 'Natural intervals',
                'quantile': 'Quantiles',
                'equal': 'Equal intervals',
                'manual': 'Manual classification'
            },
            'manual': 'Manual interval classification',
            'manualPlaceholder': 'Separate values with commas.',
            'manualRangeError': 'Class breaks are erroneous. Class breaks must be between {min} - {max}. Separate values with commas. Use decimal point as separator mark. Correct class breaks and try again.',
            'nanError': 'Given value is not a number. Correct value and try again. Use decimal point as separator mark.',
            'infoTitle': 'Manual interval classification',
            'info': 'Give class breaks as numbers separated with comma. Use decimal point as separator mark. For example by entering "0, 10.5, 24, 30.2, 57, 73.1" you get five classes which values are between "0-10,5", "10,5-24", "24-30,2", "30,2-57" and "57-73,1". Indicator values which are smaller than lowest class break (in previous exaple 0) or bigger than highest class break (73,1) are not shown in the map. Class breaks must be between smallest and largest value of the indicator.',
            'mode': 'Class breaks',
            'modes': {
                'distinct': 'Continuous',
                'discontinuous': 'Discontinuous'
            },
            'editClassifyTitle': 'Modify classification',
            'classifyFieldsTitle': 'Classification values',
            'map': {
                'mapStyle': 'Map style',
                'choropleth': 'Choropleth map',
                'points': 'Point symbol map',
                'pointSize': 'Point size',
                'min': 'Minimum',
                'max': 'Maximum',
                'color': 'Color',
                'transparency': 'Transparency',
                'showValues': 'Show values',
                'fractionDigits': 'Decimal places'
            }
        },
        'colorset': {
            'button': 'Colors',
            'flipButton': 'Flip colors',
            'themeselection': 'Select colors for classes',
            'setselection': 'Distribution',
            'seq': 'Quantitative',
            'qual': 'Qualitative',
            'div': 'Diverging',
            'info2': 'Choose colors by clicking color scheme.',
            'cancel': 'Cancel'
        },
        'errors': {
            'title': 'Error',
            'indicatorListError': 'Error occurred in data provider search.',
            'indicatorListIsEmpty': "Data provider's data list is empty.",
            'indicatorMetadataError': 'Error occurred in data selection search.',
            'indicatorMetadataIsEmpty': 'There are no selections for the data.',
            'regionsetsIsEmpty': 'Area selections could not be fetched for chosen data.',
            'regionsDataError': 'Error occurred in area value search.',
            'regionsDataIsEmpty': 'Area values could not be fetched for chosen data.',
            'datasetSave': 'Error saving dataset.',
            'datasetDelete': 'Error deleting dataset.',
            'indicatorSave': 'Error saving indicator',
            'myIndicatorYearInput': 'Year field cannot be empty.',
            'myIndicatorRegionselect': 'Regionselect cannot be empty.',
            'myIndicatorDatasource': 'Datasource is empty.',
            'cannotDisplayAsSeries': 'Indicator cannot be inspected as a series.'
        },
        'datacharts': {
            'flyout': 'Searched data',
            'barchart': 'Bar chart',
            'linechart': 'Line chart',
            'table': 'Table',
            'desc': 'Table and graphs',
            'nodata': 'Indicators were not chosen',
            'indicatorVar': 'Variable to be shown in graph',
            'descColor': 'Color of the graph',
            'selectClr': 'Selected color',
            'clrFromMap': 'Colors by classification in the map',
            'chooseColor': 'Select color',
            'sorting': {
                'desc': 'Order',
                'name-ascending': 'Name ascending',
                'name-descending': 'Name descending',
                'value-ascending': 'Value ascending',
                'value-descending': 'Value descending'
            }
        },
        'filter': {
            'title': 'Filtering',
            'indicatorToFilter': 'Variable to be filtered',
            'condition': 'Condition',
            'value': 'Value',
            'variable': 'Variable',
            'conditionPlaceholder': 'Select condition',
            'greater': 'Greater than (>)',
            'greaterEqual': 'Greater than or equal to (>=)',
            'equal': 'Equal to (=)',
            'lessEqual': 'Less than or equal to (<=)',
            'lessThan': 'Less than (<)',
            'between': 'Between (exclusive)',
            'filter': 'Filter values',
            'desc': 'Filter by values',
            'filtered': 'Filtered values',
            'area': 'Filter by areas'
        },
        'layer': {
            'name': 'Areal division of thematic map',
            'inspireName': 'Thematic map',
            'organizationName': 'Thematic map'
        },
        'tab': {
            'title': 'Indicators',
            'edit': 'Edit',
            'delete': 'Delete',
            'grid': {
                'name': 'Name',
                'edit': 'Edit',
                'delete': 'Delete'
            },
            'popup': {
                'deletetitle': 'Delete Indicator',
                'deletemsg': 'You are deleting the indicator "{name}". Do you want to delete the indicator?',
                'deleteSuccess': 'Indicator removed'
            },
            'button': {
                'cancel': 'Cancel',
                'ok': 'OK'
            },
            'error': {
                'title': 'Error',
                'notfound': 'The indicator was not found.',
                'notdeleted': 'The indicator was not removed.'
            }
        },
        'userIndicators': {
            'flyoutTitle': 'Add new indicator',
            'buttonTitle': 'Add new indicator',
            'buttonAddIndicator': 'Add data',
            'panelGeneric': {
                'title': 'Indicator data',
                'formName': 'Name',
                'formDescription': 'Description',
                'formDatasource': 'Datasource'
            },
            'panelData': {
                'title': 'Statistical data'
            },
            'dialog': {
                'successTitle': 'Saved',
                'successMsg': 'The data has been saved. Add the indicator to the map using the statistics search functionality.'
            },
            'import': {
                'title': 'Import from the clipboard',
                'placeholder': 'Enter the indicators data here. Each row should contain a region and it\'s value. Enter the region\'s name or id. Use semicolon as a separator. Data can be imported in following formats: \n' +
                'Sample 1: Helsinki;1234 \n' +
                'Sample 2: 011;5678'
            },
            'notLoggedInTitle': 'Warning',
            'notLoggedInWarning': 'Without logging in the data cannot be saved and it will only be available until page reload. Log in before adding the indicator to preserve the data.',
            'modify': {
                'title': 'Indicator',
                'edit': 'Edit',
                'remove': 'Remove'
            }
        },
        'indicatorList': {
            'title': 'Indicators',
            'removeAll': 'Remove all',
            'emptyMsg': 'No selected indicators'
        },
        'sumo': {
            'placeholder': 'Select Here',
            'captionFormat': '{0} selected',
            'captionFormatAllSelected': 'All {0} selected!',
            'searchText': 'Search...',
            'noMatch': 'No results found matching "{0}"',
            'locale': ['OK', 'Cancel', 'Select All']
        }
    }
});
