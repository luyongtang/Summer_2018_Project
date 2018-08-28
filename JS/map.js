var app = angular.module('myApp', ['ngRoute']);
var data_result = {}; // the data received from the server
function myMap() {
	app.controller("map_box",function($scope,$http){
		/* Fetch data from the server*/
		$http.post("../json_result_set/json_result_set.php", JSON.stringify({"code":1})).then(
			function successCallback(response) {
				console.log(response);
				data_result = response.data;
				initialize(); // initialize the map with the data received
			},
			function errorCallBack(response) {
				console.error("The connection is not successful!");
			}
		);	
	});
}
// To initialize the google map
function initialize() {
	var myJMap = new JMap("googleMap");	
	var dataAssist = new DataAssist(data_result_mul.fetched_stories);
	var result = dataAssist.formatDuplicates();
	myJMap.loadMap();
	myJMap.setStories(result);
	myJMap.setCustomMarkersPath('../../documentation/numeric/','png'); // the path is temporary for testing
	myJMap.loadMarkers();
	myJMap.loadInfoWindows();
	myJMap.fitBounds();
	
	// debugging for the single marker
	myJMap.setSingleMarkerPath('../../documentation/point.png');
	myJMap.createSingleMarker(45.494822, -73.651221);
	myJMap.addSingleMarkerContent('<h1>Hello Test</h1>');
	myJMap.createSingleMarker(45.5470054,-73.7448496);
	myJMap.addSingleMarkerContent('<h1>Hello Test2</h1>');
	
	// Testing single circle
	myJMap.setSingleCirclePropeties('#FF0000',0.8, 2,'#7A7A7A',0.35,100);
	myJMap.createSingleCircle(45.494822, -73.651221);
	myJMap.createSingleCircle(45.5470054,-73.7448496);	
}