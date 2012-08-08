/**
 * 2009-09 janne.korhonen<at>maanmittauslaitos.fi
 * 
 * \LICENSE
 * 
 * 
 * Class: NLSFI.Worker.Scheduler
 * 
 * T�m� luokka k�skytt�� Worker luokkia .step() funktion kautta hakemaan lis��
 * kamaa.
 * 
 * T�h�n vois lis�t� try { } catch( err ) {}, jotta ei j�m�hd� ekaan
 * levinneeseen. TAI joku systeemi, ett� k�ytt�j� saisi tiedon ja voisi edet�
 * kuitenkin hommissaan. EI kuitenkaan laiteta alertia ja se pit�isi poistaa
 * my�s Workereist�.
 * 
 * 
 * 
 */

Oskari.clazz.define('Oskari.NLSFI.Worker.Scheduler',function() {
	
	/**
	 * Property: workers
	 * 
	 * Worker .step() rajapinnan toteuttavat luokat, joita opastetaan tekem��n
	 * JOTAKIN
	 */
	this.workers = null ;

	/**
	 * 
	 */
	this.workersStats = null;

	/**
	 * Property: t
	 * 
	 * Timer, joka luodaan setInterval() kutsulla
	 */

	this.t = null;

	/**
	 * Property: tquit flag, joka laitetaan lopettamaan steppaus loop
	 */
	this.tquit = false;

	/**
	 * setIntervallin todellinen toistonopeus
	 */
	this.queueInterval = 250;

	/**
	 * step kutsujen todellinen toistov�li
	 */
	this.queueSpeed = 1000;

	/**
	 * lastErrors viimeiset 16 virhett� on t�ss� tallessa
	 */

	this.lastErrors = [];
	

},{

	/**
	 * t�t� kutsutaan, kun hallitsematon virhe step() kutsussa ilmenee
	 */
	errorHandler : function(err) {
		window.alert(err.errorText);
	},

	/**
	 * t�t� kutsutaan, kun on edetty suorittamisessa
	 */
	stepHandler : function(workersStats) {
	},

	/**
	 * Method: initialize constructor
	 * 
	 */

	

	/**
	 * alustaa workersiin joukon Worker rajapinnan toteuttavia olioita
	 */
	create : function(wrkrs) {
		this.workers = wrkrs;
		this.workersStats = [];

		for ( var n = 0; n < this.workers.length; n++) {
			this.workers[n].errorHandler = this.errorHandler;
			this.workersStats.push(this.workers[n].stats);
		}
	},

	pushWorker : function(w) {
		w.errorHandler = this.errorHandler;
		this.workers.push(w);
		this.workersStats.push(w.stats);
	},

	setQueueSpeed : function(val) {
		this.queueSpeed = val;
	},

	/**
	 * setInterval aiheuttaa kutsun workereist� virheet laitetaan listaan
	 * talteen ja kutsutaan errorHandler functiota
	 * 
	 */
	callbackFunc : function() {

		for ( var r = 0; r < this.workers.length; r++) {
			var w = this.workers[r];
			if (w != null) {
				try {
					w.step();
				} catch (err) {
					if (this.lastErrors.length > 15)
						this.lastErrors.shift();
					var dte = new Date();
					var errJSON = {
						timestamp : dte,
						errorText : dte.toUTCString() + ": " + err
					};
					this.lastErrors.push(errJSON);
					this.errorHandler(errJSON);
				}
			}
		}
		this.stepHandler(this.workersStats);

	},

	/**
	 * t�ll� k�ynnistet��n taustatoiminnot
	 */
	startWorker : function() {
		var mediator = this;
		this.t = setInterval(function() {
			mediator.callbackFunc();
		}, this.queueInterval);
	},
	/**
	 * t�ll� lopetetaan taustatoiminnot
	 */
	stopWorker : function() {
		this.tquit = true;
		if (this.t != null)
			clearInterval(this.t);
	},

	CLASS_NAME : "NLSFI.Worker.Scheduler"
});
