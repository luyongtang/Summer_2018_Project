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
	console.log(result);
	a.loadMap();
	a.loadMarkers(result);
	a.fitBounds();
}

// To defined a new object called GoogleMap
function GoogleMap (mapId, fetched_data) {
    // Attribute
    this.mapId = "";
	this.map;
	var myBounds = new google.maps.LatLngBounds();
	// default center
	var mapProp = {
		center: new google.maps.LatLng(45.497266, -73.579023),
		zoom: 11,
	};
	this.markers=[];
	//Constructor
	if(mapId){
		this.mapId=mapId;
	}
	//Methods
	// setter
	this.setMap = function(mapId){
		if(mapId){
			this.mapId=mapId;
		}
		else{
			this.mapId="";
		}
	}
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
	this.loadMarkers=function(stories){
		//console.log(stories);
		var myPosition; 
		if(this.map){
			var marker;
			var i;
			for(i=0; i<stories.length;i++){
				myPosition = new google.maps.LatLng(stories[i].lat,stories[i].lng);
				myBounds.extend(myPosition);
				marker = new google.maps.Marker({
					position: myPosition,
					map:this.map
				});
				this.markers.push(marker);
			}(marker,i)
			console.log(this.markers);
		}
		else{
			console.log("GoogleMap Error: map has not been loaded");
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
