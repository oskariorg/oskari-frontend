jQuery(document).ready(function() {
  
	jQuery("#avaa").click(function() {
		window.open("fullmap.html?coord=404241_6693842&zoomLevel=10&municipality=" + jQuery("#municipality").val());
		return false;
	});
	jQuery("#full").click(function() {
	  window.open("../build/package/resources/public/oskari/fullmap.html?coord=404241_6693842&zoomLevel=10&build=" + Date.now() + "&municipality=" + jQuery("#municipality").val());
	  return false;
	});
	hub.subscribe("oskari-map-initialized", function(e) {
		jQuery("#eventMessages").html("map-initilized<br/>" + jQuery("#eventMessages").html());
		hub.send("oskari-show-shapes", {
		  clear : true,
		  drawings : [ {
		    id : "id",
		    name : "name",
		    description : "desc",
		    category : 123,
		  height : 5,
		    geometry : "POLYGON((404241.539 6693842.301,404270.039 6693780.051,404331.289 6693829.301,404241.539 6693842.301))"
		  } ]
		});
	});
  hub.subscribe("oskari-map-uninitialized", function(e) {
    jQuery("#eventMessages").html("map-uninitilized<br/>" + jQuery("#eventMessages").html())
  });
	hub.subscribe("inforequest-map-click", function(e) {
		jQuery("#eventMessages").html("inforequest-map-click (" + e.data.kunta.kuntanimi_fi + " " + e.data.kunta.kuntanumero + "," + e.data.location.x + "," + e.data.location.y + ")<br/>" + jQuery("#eventMessages").html())
	});
	hub.subscribe("oskari-save-drawings", function(e) {
		jQuery("#eventMessages").html("oskari-save-drawings (" + JSON.parse(e.data.drawings).length + ")<br/>" + jQuery("#eventMessages").html())
	});
});
