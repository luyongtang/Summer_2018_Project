/**
* Creating a new JMap object
* @param {string} mapId - [Optional] Id of the DIV or other HTML tag where Google Maps will loaded
*/
function JMap (mapId) {
    /** Attributes*/
    this.mapId = "";
	this.map;
	this.stories;
	this.customMarkersPath; // the path to the markers images
	this.markerFileType; // the file type of markers images (.png, jpg,..)
	this.iterationType; // there are two types of iteration for the markers: "alphabet" and "numeric"
	this.singleMarker;
	this.singleMarkerIconPath;
	var myBounds = new google.maps.LatLngBounds();
	/** Default Map Center - Montreal*/
	var mapProp = {
		center: new google.maps.LatLng(45.497266, -73.579023),
		zoom: 11,
	};
	this.markers=[];
	//for some reason it is var
	var infoWindows=[];
	this.singleCircleProperties={};
	this.singleCircle; 
	/** Constructor */
	if(mapId){
		this.mapId=mapId;
	}
	/**
	* Set the location of where Google Maps should be loaded in the Document
	* @param {string} mapId - ID of the DIV or other HTML tag where Google Maps should be loaded 
	*/
	this.setMap = function(mapId){
		if(mapId){
			this.mapId=mapId;
		}
		else{
			this.mapId="";
		}
	}
	/**
	* Set Center the center of the map
	* @param {number} lat - latitude of location
	* @param {number} lng - longitude of the location
	*/
	this.setCenter = function(lat, lng){
		if(this.map){
			var myCenter = new google.maps.LatLng(lat, lng);

			this.map.setCenter(myCenter);

		}
		else{
			console.log("GoogleMap Error: map has not been loaded");
		}
	}
	/**
	* Once the ID of DIV of other HTML tag is set, Google Map is loaded
	*/
	this.loadMap=function(){
		if(this.mapId){
			myMap=$("#"+this.mapId)[0];
			this.map = new google.maps.Map(myMap, mapProp);
		}
		else{
			console.log("GoogleMap Error: mapId is not set");
		}
	}
	/**
	* Set the stories/events to be used later on to load on Map
	* @param {JSON} stories -  The stories/events presented in a JSON format
	*/
	this.setStories = function(stories){
		this.stories=stories;
	}
	/**
	* Once the stories have been set, the markers can be loaded
	*/
	this.loadMarkers=function(){
		//console.log(stories);
		var myPosition; 
		if(this.map){
			var marker;
			var i;
			var infoWindow;
			var iconPath;
			var iconOrder = 0;
			for(i=0; i<this.stories.length;i++, iconOrder++){
				if (iconOrder > 25) {
					iconOrder = 0; // if there are more than 26 markers, the icons will be duplicated (temporary solution)
				}
				if (this.iterationType == 'numeric') {
					iconPath = this.customMarkersPath+String(iconOrder+1)+'s.'+this.markerFileType;
				} else {
					iconPath = this.customMarkersPath+String.fromCharCode(65+iconOrder)+'s.'+this.markerFileType;
				}				
				myPosition = new google.maps.LatLng(this.stories[i].lat,this.stories[i].lng);
				myBounds.extend(myPosition);
				marker = new google.maps.Marker({
					position: myPosition,
					map:this.map,
					icon: iconPath,
				});

				this.markers.push(marker);
			}(marker,i)
			
			console.log(this.markers);
		}
		else{
			console.log("GoogleMap Error: map has not been loaded");
		}
	}
	/**
	* Once the markes have been loaded, the InfoWindows can be loaded  right after
	*/
	this.loadInfoWindows = function(){
		var infoWindow;
		if(this.markers.length>0){
			for(i=0; i<this.stories.length;i++){
				infoWindow = new google.maps.InfoWindow({
					content:"Yes"+i
				});
				infoWindows.push(infoWindow);
				//closure property for multiple info window
				google.maps.event.addListener(this.markers[i], 'click',(fun)(this.markers[i],infoWindow));
			}(infoWindow)
		}
		else{
			console.log("GoogleMap Warning: markers have not been loaded or no stories exists");
		}
		
	}
	/**
	 * Configuration of the icons of custom markers
	 * @param  {string} path - Directory to the icon images
	 * @param  {string} fileType - The file type of the icon images
	 * @param  {string} iterType - Iteration type of the increament, "alphabet" or "numeric", default "numeric"
	 */
	this.setCustomMarkersPath = function (path, fileType, iterType) {
		if (!path) {
			console.log("No parameter \"path\"in function \"setCustomMarkersPath\"");
		} else if (!fileType) {
			console.log("No parameter \"fileType\"in function \"setCustomMarkersPath\"");
		} else if (!iterType) {
			this.customMarkersPath = path;
			this.markerFileType = fileType;
			this.iterationType = 'numeric'; // default option

		} else {
			this.customMarkersPath = path;
			this.markerFileType = fileType;
			this.iterationType = iterType;
		}
	};
	/**
	 * Configuration of the icons of single markers
	 * @param  {string} iconPath - directory to the icon image of single marker 
	 */
	this.setSingleMarkerPath = function (iconPath) {
		this.singleMarkerIconPath = iconPath;
	};
	/**
	 * Create a new single marker
	 * @param  {number} lat - The latitude of the newly created marker
	 * @param  {number} lng - The longitude of the newly created marker
	 */
	this.createSingleMarker = function (lat, lng) {
		if (lat && lng) {
			var markerPosition = new google.maps.LatLng(lat, lng);
		} else {
			console.error('Missing parameters in function \"createSingleMarker\"');
			return false;
		}
		if (this.setSingleMarkerPath) {
			myBounds.extend(markerPosition);
			if(this.singleMarker) this.singleMarker.setMap(null);
			this.singleMarker = new google.maps.Marker({
				position: markerPosition,
				map: this.map,
				icon: this.singleMarkerIconPath,
			});
		} else {
			console.error('variable \'singleMarkerIconPath\' is not set!');
			return false;
		}		
	};
	/**
	* Add an InfoWindow to the marker
	* @param {string} displayCode - Content of the InfoWindow, plain text with HTML
	*/
	this.addSingleMarkerContent = function (displayCode) {
		if (!displayCode) {
			console.error('Missing parameter in function \"addSingleMarkerContent\"');
		}
		var infoWindow = new google.maps.InfoWindow({
			content: displayCode
		});
		if (!this.map) {
			console.error('Error: this.map is not set!');
			return false;			
		} else if (!this.singleMarker) {
			console.error('Error: this.singleMarker is not set!');
			return false;
		}
		google.maps.event.addListener(this.singleMarker, 'click',(fun)(this.singleMarker,infoWindow));
		infoWindow.open(this.map, this.singleMarker);
		this.fitBounds();
	};
	/**
	* Set the properties of the Circle Object from Google Maps
	* @see https://developers.google.com/maps/documentation/javascript/examples/circle-simple
	* @param {string} strokeColor
	* @param {number} strokeOpacity
	* @param {number} strokeWeight 
	* @param {string} fillColor 
	* @param {number} fillOpacity  
	* @param {number} radius 
	*/
	this.setSingleCirclePropeties = function(strokeColor,strokeOpacity, strokeWeight, fillColor, fillOpacity, radius){
		this.singleCircleProperties={
			strokeColor: strokeColor,
            strokeOpacity: strokeOpacity,
            strokeWeight: strokeWeight,
            fillColor: fillColor,
            fillOpacity: fillOpacity,
			radius:radius
		}
	}
	/**
	* Add the Circle according to properties
	* @param {number} lat - latitude of the location where the circle will be placed
	* @param {number} lng - longitude of the location where the circle will be placed
	*/
	this.createSingleCircle=function(lat, lng){
		if(this.singleCircle) this.singleCircle.setMap(null);
		this.singleCircle = new google.maps.Circle(this.singleCircleProperties);
		console.log(this.singleCircle);
		var latlng_temp = new google.maps.LatLng({lat: lat, lng: lng});
		this.singleCircle.setCenter(latlng_temp);
		this.singleCircle.setMap(this.map);
	}
	function fun(marker,infoWindow){
		return function(){
			closeAllInfowWindow();
			infoWindow.open(this.map,marker);
		}
	}
	function closeAllInfowWindow(){
		for(var i =0; i<infoWindows.length;i++){
			infoWindows[i].close();
		}
	}
	this.fitBounds = function(){
		this.map.fitBounds(myBounds);
	}
}