function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(45.497266, -73.579023),
        zoom: 18,
    };
    var map = new google.maps.Map($("#googleMap")[0], mapProp);
}

// To defined a new object called GoogleMap
function GoogleMap () {
    // Attribute
    this.id = "";

    // the constructor without parameters
    this.initWithoutID = function () {
        this.id = "googleMap"; // default id
    };
    // the constructor with one parameter
    this.initWithID = function (newID) {
        this.id = newID;
    };
    // setter
    this.setMap = function (newID) { 
        this.id = newID;
    };
    // .load() function
    this.load = function () {
        // I have no idea of this function for now. Please advise.
    };
}
