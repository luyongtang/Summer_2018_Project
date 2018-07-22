//Correction to missing add-on
var app = angular.module('myApp', ['ngRoute']);
//use data_result as the result received from the server
//console.log(data_result);
app.controller("map_box",function($scope,$http){
	/* To be used later on once the file is uploaded to server.
	$http.post("JS/extract.json", JSON.stringify("{}")).then(
		function successCallback(response) {
			//console.log(response);
			console.log(response);
		},
		function errorCallBack(response) {
			console.log(response);
		}
	)
	*/
})


/*
// Start of Testing
var m1 = new GoogleMap ();
m1.initWithoutID();
console.log(m1.id);
var m2 = new GoogleMap ();
m2.initWithID('ABC');
console.group("m2.id before setting:");
console.log(m2.id);
console.groupEnd("m2.id before setting:");
m2.setMap('newID');
console.group("m2.id after setting:");
console.log(m2.id);
console.groupEnd("m2.id after setting:");
// End of Testing
*/
