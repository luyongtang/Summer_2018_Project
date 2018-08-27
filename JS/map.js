var app = angular.module('myApp', ['ngRoute']);
var data_result = {}; // the data received from the server

function myMap() {
	app.controller("map_box",function($scope,$http){
		/* To be used later on once the file is uploaded to server.*/
		$http.post("../json_result_set/json_result_set.php", JSON.stringify({"code":1})).then(
			function successCallback(response) {
				console.log(response);
				data_result = response.data;
				initialize(); // initialize the map with the data received
			},
			function errorCallBack(response) {
				console.log("The connection is not successful!");
			}
		);
		
		
	});
}
// To initialize the google map
function initialize() {
	var a = new GoogleMap("googleMap");	
	var b = new GoogleMapAssit(data_result_mul.fetched_stories);
	var result = b.formatDuplicates();
	console.log("To be used AAAAAAAAA");
	console.log(result);
	a.loadMap();
	a.setStories(result);
	a.setCustomMarkersPath('../../documentation/numeric/','png'); // the path is temporary for testing
	a.loadMarkers();
	a.loadInfoWindows();
	a.fitBounds();

	// debugging for the single marker
	a.setSingleMarkerPath('../../documentation/point.png');
	a.createSingleMarker(45.494822, -73.651221);
	a.addSingleMarkerContent('<h1>Hello Test</h1>');
}
// To defined a new object called GoogleMap
function GoogleMap (mapId, fetched_data) {
    // Attribute
    this.mapId = "";
	this.map;
	this.stories;
	this.customMarkersPath; // the path to the images of markers
	this.markerFileType; // the file type of the iamges of markers
	this.iterationType; // there are two types of iteration for the markers: "alphabet" and "numeric"
	this.singleMarker;
	this.singleMarkerIconPath;
	var myBounds = new google.maps.LatLngBounds();
	// default center
	var mapProp = {
		center: new google.maps.LatLng(45.497266, -73.579023),
		zoom: 11,
	};
	this.markers=[];
	//for some reason it is var
	var infoWindows=[];
	//Constructor
	if(mapId){
		this.mapId=mapId;
	}
	//Methods
	// setters
	this.setMap = function(mapId){
		if(mapId){
			this.mapId=mapId;
		}
		else{
			this.mapId="";
		}
	}
	this.setStories = function(stories){
		this.stories=stories;
	}
 
	/**
	 * Configuration of the icons of custom markers
	 * @param  {string} path Directory to the icon images
	 * @param  {string} fileType The file type of the icon images
	 * @param  {string} iterType Iteration type of the increament
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
	 * @param  {string} iconPath Derectory to the icon image of single marker 
	 */
	this.setSingleMarkerPath = function (iconPath) {
		this.singleMarkerIconPath = iconPath;
	};

	/**
	 * Create a new single marker
	 * @param  {number} lat The latitude of the newly created marker
	 * @param  {number} lng The longitude of the newly created marker
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
			var marker = new google.maps.Marker({
				position: markerPosition,
				map: this.map,
				icon: this.singleMarkerIconPath,
			});
			this.singleMarker = marker;
		} else {
			console.error('variable \'singleMarkerIconPath\' is not set!');
			return false;
		}		
	};

	/**
	 * Add a new info window for the new single marker
	 * @param  {string} displayCode The content to be displayed in the info window 
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
		this.fitBounds(); // re-adjust the bounds to include the new marker
	};

	//place map
	this.loadMap=function(){
		if(this.mapId){
			myMap=$("#"+this.mapId)[0];
			this.map = new google.maps.Map(myMap, mapProp);
		}
		else{
			console.log("GoogleMap Error: mapId is not set");
		}
	}

	
	//SetMarkers
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
	//Set Center
	this.setCenter = function(lat, lng){
		if(this.map){
			var myCenter = new google.maps.LatLng(lat, lng);

			this.map.setCenter(myCenter);

		}
		else{
			console.log("GoogleMap Error: map has not been loaded");
		}
	}
	this.fitBounds = function(){
		this.map.fitBounds(myBounds);
	}
	/*
    // the constructor without parameters
    this.initWithoutID = function () {
        this.id = "googleMap"; // default id
    };
    // the constructor with one parameter
    this.initWithID = function (newID) {
        this.id = newID;
    };
	*/
}
function GoogleMapAssit(stories){
	console.log(stories);
	
	this.stories=stories;
	var result = [];
	this.formatDuplicates=function(){
		var temp;
		var obj;
		stories.forEach(function (story){
			index = exists(story.lat,story.lng);
			if(index<0){
				temp = {
					lat:story.lat,
					lng:story.lng,
					stories:[]
				};
				delete story.lat;
				delete story.lng;
				temp.stories.push(story);
				result.push(temp);
			}
			else{
				delete story.lat;
				delete story.lng;
				result[index].stories.push(story);
			}
		});
		//console.log(result);
		return result;
	};
	function exists(lat,lng){
		for(var i=0; i<result.length;i++){
			if(result[i].lat==lat && result[i].lng==lng){
				return i;
			}
		}
		return -1;
	}
}
