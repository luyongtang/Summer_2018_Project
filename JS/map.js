function myMap() {
	/*
    var map = new google.maps.Map($("#googleMap")[0], mapProp);
	*/
	var a = new GoogleMap("googleMap");
	var b = new GoogleMapAssit(data_result.fetched_stories);
	var result = b.formatDuplicates();
	console.log(result);
	a.loadMap();
	a.setMarkers(result);
	a.fitBounds();
}

// To defined a new object called GoogleMap
function GoogleMap (mapId) {
    // Attribute
    this.mapId = "";
	this.map;
	var myBounds = new google.maps.LatLngBounds();
	var mapProp = {
        center: new google.maps.LatLng(45.497266, -73.579023),
        zoom: 18,
    };
	//Constructor
	if(mapId){
		this.mapId=mapId;
		console.log(this.mapId);
	}
	//Methods
	// setter
	this.setMap = function(mapId){
		if(mapId){
			this.mapId=mapId;
			console.log(this.mapId);
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
	this.setMarkers=function(stories){
		var myPosition; 
		if(this.map){
			var marker;
			var i;
			for(i=0; i<stories.length;i++){
				myPosition = new google.maps.LatLng(stories[i].lat,stories[i].lng)
				myBounds.extend(myPosition);
				marker = new google.maps.Marker({
					position: myPosition,
					map:this.map
				})
			}(marker,i)
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
	this.stories=stories;
	var result = [];
	this.formatDuplicates=function(){
		var temp;
		stories.forEach(function (story){
			if(!exists(story.lat,story.lng)){
				temp = {
					lat:story.lat,
					lng:story.lng,
				};
				result.push(temp);
			}
		})
		//console.log(result);
		return result;
	};
	function exists(lat,lng){
		stories.forEach(function (story){
			if(stories.lat == lat && story.lng == lng){
				return true;
			}
		})
		return false
	}
}
