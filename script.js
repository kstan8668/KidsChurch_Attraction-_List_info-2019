var marker;
var map;
var restaurantMarkers = [];
var infos = [];

var zooPos = {
    "lat" : 1.4043,
    "lon" : 103.7930
}

var birdparkPos = {
    "lat" : 1.3187,
    "lon" : 103.7064
}
var sentosaPos = {
    "lat" : 1.2494,
    "lon" : 103.8303
}
var scienceCentrePos = {
    "lat" : 1.3332,
    "lon" : 103.7362
}

var places = "/https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=500&type=restaurant&key=AIzaSyDWM6ZzO2d0TVFBS5bVsKbDp7FNnNJlZyk";
var params = {};


$("#zoo").click(function(){
    clearMarkers();
    position(zooPos); 
    params = {
        "location" : zooPos['lat'] + ", " + zooPos['lon']
    };
    searchPlacesAsync(params, searchPlacesCallback);
});
$("#birdpark").click(function(){
    clearMarkers();
    position(birdparkPos);
    params = {
        "location" : birdparkPos['lat'] + ", " + birdparkPos['lon']
    };
    searchPlacesAsync(params, searchPlacesCallback);
});
$("#sentosa").click(function(){
    clearMarkers();
    position(sentosaPos);
    params = {
        "location" : sentosaPos['lat'] + ", " + sentosaPos['lon']
    };
    searchPlacesAsync(params, searchPlacesCallback);
});
$("#sciencecentre").click(function(){
    clearMarkers();
    position(scienceCentrePos);
    params = {
        "location" : scienceCentrePos['lat'] + ", " + scienceCentrePos['lon']
    };
    searchPlacesAsync(params, searchPlacesCallback);
});

function initmap() {
    var styles = [{
        // stylers: [{
        //     saturation: -100
        // }]
    }];
    var styledMap = new google.maps.StyledMapType(styles, {
        name: "Styled Map"
    });
    var mapProp = {
        center: new google.maps.LatLng(3.165659, 101.611416),
        zoom: 17,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        overviewMapControl: false,
        rotateControl: true,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), mapProp);
  
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style')

    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        position: new google.maps.LatLng(3.167244, 101.612950),
        animation: google.maps.Animation.DROP,
        icon: 'https://i.ibb.co/wYXbT9b/678111-map-marker-50.png',
    });

    marker.setMap(map);
    map.panTo(marker.position);
}

function position(pos){
    myLatLng = new google.maps.LatLng(pos['lat'], pos['lon']);
    marker.setPosition(myLatLng);
    map.panTo(myLatLng);
}

google.maps.event.addDomListener(window, 'load', initmap);

//Calls Google Places API
function searchPlacesAsync(params, callback) {
    axios.get(places, {params})
        .then(function (response) {
            data = response.data.results;
            callback(data);
        });
}

//Callback for Google Places API
function searchPlacesCallback(response) {
    console.log(response);
    for(let i in response) {
        restaurant_loc = response[i].geometry.location;
        restaurant_name = response[i].name;
        restaurant_rating = response[i].rating;
        restaurant_add = response[i].vicinity;

        var icon = {
            url: 'https://cdn3.iconfinder.com/data/icons/map-markers-1/512/cafe-512.png', // url
            scaledSize: new google.maps.Size(40, 40), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };

        var marker = new google.maps.Marker({
            map: map,
            draggable: true,
            position: restaurant_loc,
            animation: google.maps.Animation.DROP,
            icon: icon,
        });

        var contentString = "<h5>"+ restaurant_name +"</h5>";

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        google.maps.event.addListener(marker,'click', (function(marker,contentString,infowindow){ 
            return function() {
                closeInfoWindow();
                infowindow.setContent(contentString);
                infowindow.open(map,marker);

                infos[0]=infowindow;
            };
        })(marker,contentString,infowindow));  

        restaurantMarkers.push(marker);

    }
}

function closeInfoWindow(){
 
    if(infos.length > 0){
  
       /* detach the info-window from the marker ... undocumented in the API docs */
       infos[0].set("marker", null);
  
       /* and close it */
       infos[0].close();
  
       /* blank the array */
       infos.length = 0;
    }
 }

//Clear existing markers for restaurants
function clearMarkers() {
    for (let i in restaurantMarkers) {
        restaurantMarkers[i].setMap(null);
    }
    restaurantMarkers = [];
}

/*
var contentString = "Hello";
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
    });


    https://cdn3.iconfinder.com/data/icons/map-markers-1/512/cafe-512.png
  
*/

//What to search:
//When picture is clicked, get nearby restaurants
//send query
//Information needed: type of place, 500m radius