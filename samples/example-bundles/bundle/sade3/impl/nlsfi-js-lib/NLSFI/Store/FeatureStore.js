/*
	Handles loading and unloading of Feature DATA using 
 	backendstore for data retrieval. MIGHT use HTML5 local datastore if available.
 	WILL use GeoExt FeatureStore.
 	
 	Implements (at least Simple Features) Schema Aware Cached Dataset to HTML5 db ? 
 	
 	Caches Features AND Geometries in HTML 5 db.
 	
 	MAY implement specialized NLSFI.Store.OpenLayers.Layer.Vector ?
 	
 	REPLACES current implementation which loads Features directly to OpenLayers Layers.
 	
 	This provides ON DEMAND access to Geometries to enable lightweight AND
 	Feature Set handling in Browser UIs.
 	
 	SHALL implement Paged Feature Subsets. Show n and next n ?
 	
 	zum Baseball
 	-	Request returns only featureId / gml:id OR REQUIRED ELEMENTS ONLY
 	-	CachedResponseDataSet requests feature geometries and further info ON DEMAND

	WFS REQUEST 
		-- CachedResponseDataSet 
			-- RandomAccess 
			-- Flush
			-- underflow()

	Store
		processRequest(WFS) : CachedDataSet
		
	CachedDataset
 		getFeature(x) : CACHED.OpenLayers.Feature.Vector
	 	getFeatureGeometryField(feat,geomName); ?
	 	subrequests...
*/