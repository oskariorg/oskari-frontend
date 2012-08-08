/*
 <script src="http://spatialreference.org/ref/epsg/3067/proj4js/"></script>
        <script src="http://spatialreference.org/ref/epsg/900913/proj4js/"></script>
        <script src="http://spatialreference.org/ref/epsg/4326/proj4js/"></script>
        <script src="http://spatialreference.org/ref/epsg/3395/proj4js/"></script>
*/
(function(){
Proj4js.defs["EPSG:3067"] = "+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs";
Proj4js.defs["EPSG:3395"] = "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

})();
