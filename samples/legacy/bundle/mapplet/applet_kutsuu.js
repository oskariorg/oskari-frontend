// funktiot, joita applet kutsuu

// avaa dokumentin 'url' ikkunaan 'ikkuna'
function avaa(url, ikkuna) {
	var url;
	var ikkuna;

	if (ikkuna == 'tulosteikkuna') {
		var tulosteikkuna = window
				.open(
						url,
						"tulosteikkuna",
						"width=600, height=440, left=30, top=30, location=no, menubar=yes, resizable=yes, scrollbars=yes, status=no, toolbar=no");
		tulosteikkuna.focus();
	} else if (ikkuna == 'infoikkuna') {
		var infoikkuna = window
				.open(
						url,
						"infoikkuna",
						"width=800, height=550, left=40, top=40, location=no, menubar=yes, resizable=yes, scrollbars=yes, status=yes, toolbar=yes");
		infoikkuna.focus();
	} else {
		window
				.open(
						url,
						ikkuna,
						"location=no, menubar=yes, resizable=yes, scrollbars=yes, status=yes, toolbar=yes");
	}
}

// kutsutaan klikattaessa kohdetta kartalta valintatyokalulla
function valitse(tunniste) {
	var tunniste;

	

}

// applet huomauttaa javaScriptilla..
function huomauta(msg) {
	alert(msg);
}

var overviewMapplet = null;
var mapMapplet = null;
// applet kayttaa viestin 'msg' valittamiseksi appletille 'to'
function sendMappletMsg(to, msg) {
	console.log("TO :"+to+" MSG:"+msg);
	
	if( !overviewMapplet )
		overviewMapplet = document.applets['overview'];
	if( !mapMapplet )
		mapMapplet = document.applets['map'];
	
	if (to == 'map' && mapMapplet) {
		mapMapplet.receiveMappletMsg("overview", msg);
	} else if (to == 'overview_xxx' ) {
		
		if( overviewMapplet )  
			overviewMapplet.receiveMappletMsg("map", msg);
		
		var mappletStateEvent = Oskari.clazz
					.create('Oskari.mapplet.event.MappletStateChangedEvent',msg);
		Oskari.$("sandbox").notifyAll(mappletStateEvent);
		console.log("dispatched LegacyEvent");
		
	}

}
