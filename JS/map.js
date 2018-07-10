function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(45.497266, -73.579023),
        zoom: 18,
    };
    var map = new google.maps.Map($("#googleMap")[0], mapProp);
}