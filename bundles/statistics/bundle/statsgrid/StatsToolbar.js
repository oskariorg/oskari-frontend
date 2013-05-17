/**
 * @class Oskari.statistics.bundle.statsgrid.StatsToolbar
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.StatsToolbar', 
/**
 * @static constructor function
 * @param {Object} localization
 * @param {Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance} instance
 */
function(localization, instance) {
    this.toolbarId = 'statsgrid';
    this.instance = instance;
    this.localization = localization;
    this._createUI();
}, {
    show : function(isShown) {
        var showHide = isShown ? 'show' : 'hide';
        var sandbox = this.instance.getSandbox();
        sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, showHide]);
    },
    destroy : function() {
        var sandbox = this.instance.getSandbox();
        sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, 'remove']);
    },
    changeName: function(title) {
        var sandbox = this.instance.getSandbox();
        sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, 'changeName', title]);
    },
	/**
	 * @method _createUI
	 * sample toolbar for statistics functionality
	 */
	_createUI : function() {

        var view = this.instance.plugins['Oskari.userinterface.View'];
        var me = this;
        var sandbox = this.instance.getSandbox();
        sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, 'add', {
            title : me.localization.title,
            show : false,
            closeBoxCallback : function() {
                view.prepareMode(false);
                //view.showMode(false);
                //view.showContent(false);
            }
        }]);
/*
		var buttonGroup = 'myplacesx';
		var buttons = {
			'point' : {
				toolbarid : me.toolbarId,
				toolbartitle : 'Tilastonäkymä',
				iconCls : 'myplaces-draw-point',
				tooltip : '',
				sticky : true,
				callback : function() {

				}
			},
			'line' : {
                toolbarid : me.toolbarId,
				iconCls : 'myplaces-draw-line',
				tooltip : '',
				sticky : true,
				callback : function() {

				}
			},
			'area' : {
                toolbarid : me.toolbarId,
				iconCls : 'myplaces-draw-area',
				tooltip : '',
				sticky : true,
				callback : function() {

				}
			},
			'camera' : {
                toolbarid : me.toolbarId,
				iconCls : 'tool-save-view',
				tooltip : '',
				sticky : true,
				callback : function() {
					var sandbox = me.instance.getSandbox();

					var layerParameters = {
						FORMAT_OPTIONS : "antialias%3Aon",
						SLD : "http://tiaarnio.nls.fi/sotkaproto/lib/sldgen/sldgen.php?name=tilastoalueet:kunnat2013&attr=kuntakoodi&classes=170,235,250,280,288,295,304,318,440,475,499,545,599,753,755,766,893,946,035,049,052,091|143,149,151,152,178,186,217,218,233,236,245,257,275,300,319,322,399,400,403,407,408,433,434,445,478,480,481,529,538,540,543,577,578,581,584,611,616,623,631,687,691,704,710,738,746,783,834,845,849,858,892,905,918,921,924,925,927,942,009,010,018,019,060,082,086,092|102,106,109,142,145,148,164,165,169,172,177,181,202,208,213,230,261,271,283,287,312,316,317,418,425,430,441,444,476,484,489,503,505,534,561,562,593,598,619,620,635,636,638,684,743,758,761,765,768,778,781,790,791,838,844,846,848,853,895,922,926,934,977,981,005,050,051,077,099|103,105,108,174,176,204,214,224,226,239,248,254,256,260,265,272,284,297,301,402,413,423,483,495,507,535,536,560,567,576,580,595,604,608,618,625,630,680,681,683,694,700,702,734,739,748,777,837,857,859,863,889,890,936,980,989,016,046,069,078,079,081,098|111,139,140,146,167,171,179,205,211,216,232,244,246,255,273,276,286,291,305,309,398,405,420,426,436,442,491,494,500,504,508,532,541,563,592,607,609,614,626,678,686,696,698,707,732,749,759,762,831,832,886,911,931,935,972,061,071,090,097|153,182,240,241,249,263,285,290,320,410,416,422,498,531,564,601,615,624,689,729,740,747,751,785,850,851,854,887,908,915,976,992,047,075,084,020&vis=choro:edf8fb,ccece6,99d8c9,66c2a4,2ca25f,006d2c"
					};
					sandbox.requestByName(me.instance, 'MapModulePlugin.MapLayerUpdateRequest', ['999', true, layerParameters]);

				}
			},
			'back' : {
                toolbarid : me.toolbarId,
				iconCls : 'tool-history-back',
				tooltip : '',
				sticky : true,
				callback : function() {
					var elCenter = jQuery('.oskariui-center');
					 var elRight = jQuery('.oskariui-right');

					 elCenter.removeClass('span6');
					 elCenter.removeClass('span7');
					 elCenter.addClass('span5');
					 elRight.removeClass('span6');
					 elRight.removeClass('span5');
					 elRight.addClass('span7');

				}
			},
			'forward' : {
                toolbarid : me.toolbarId,
				toolbartitle : 'Tilastonäkymä',
				iconCls : 'tool-history-forward',
				tooltip : '',
				sticky : true,
				callback : function() {
					var elCenter = jQuery('.oskariui-center');
					 var elRight = jQuery('.oskariui-right');
					 elCenter.removeClass('span6');
					 elCenter.removeClass('span5');
					 elCenter.addClass('span7');
					 elRight.removeClass('span6');
					 elRight.removeClass('span7');
					 elRight.addClass('span5');
				}
			}
		};


		var requester = this.instance;
		var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');

		for(var tool in buttons ) {
			sandbox.request(requester, reqBuilder(tool, buttonGroup, buttons[tool]));
		}
*/
	}
});
