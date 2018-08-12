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
	a.setCustomMarkersPath('../../documentation/alphabet/','png'); // the path is temporary for testing
	a.loadMarkers();
	a.loadInfoWindows();
	a.fitBounds();
}
// To defined a new object called GoogleMap
function GoogleMap (mapId, fetched_data) {
    // Attribute
    this.mapId = "";
	this.map;
	this.stories;
	this.customMarkersPath; // the path to the images of markers
	this.markerFileType; // the file type of the iamges of markers
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
	 * @param  {} path directory to the icon images
	 * @param  {} fileType the file type of the icon images
	 */
	this.setCustomMarkersPath = function (path,fileType) {
		if (!path) {
			console.log("No parameter \"path\"in function \"setCustomMarkersPath\"");
		} else if (!fileType) {
			console.log("No parameter \"fileType\"in function \"setCustomMarkersPath\"");
		} else {
			this.customMarkersPath = path;
			this.markerFileType = fileType;
		}
	};

	//place map
	this.loadMap=function(){
		if(this.mapId){
			myMap=$("#"+this.mapId)[0];
			this.map = new google.maps.Map(myMap, mapProp)
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
				iconPath = this.customMarkersPath+String.fromCharCode(65+iconOrder)+'s.'+this.markerFileType;				
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
