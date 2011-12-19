$(document).ready(function(){
	$('#map_canvas').css({
		width: $(window).width(),
		height: $(window).height() - $('.topbar').height() - $('.mainfooter').height() - $('.mainsubfooter').height() - 70
	});
	map_initialize();
});
var styles = [
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      { hue: "#00aaff" },
      { saturation: 32 },
      { gamma: 0.01 },
      { lightness: -99 }
    ]
  },{
    elementType: "geometry",
    stylers: [
      { hue: "#ff0000" },
      { saturation: 67 },
      { lightness: -76 },
      { gamma: 2 }
    ]
  },{
    elementType: "labels",
    stylers: [
      { visibility: "on" },
      { gamma: 0.85 },
      { lightness: -59 },
      { saturation: 99 },
      { hue: "#ffffff" }
    ]
  }
];
var map;
var marker;
var infoWindow;
var address;
var url;
var info;

function map_initialize() {
	var myOptions = { zoom: 4, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles };
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	infoWindow = new google.maps.InfoWindow();
	
	var geo = new google.maps.Geocoder();
	geo.geocode({'address' : 'Ottawa, Ontario' }, function(results, status) {
		map.setCenter(results[0].geometry.location);
	});
	
	info = "<div style='color:#000000;font-size:14px;'>I Live Here! Canada's Capital!</div>";
	
	address = 'Ottawa, Ontario, Canada';
	
	makemarker(info, address);
};

function makemarker( info, address ) {
	var geocoder = new google.maps.Geocoder();
	
	geocoder.geocode({ 'address': address }, function(results, status) {
		if( status == google.maps.GeocoderStatus.OK ) {
			marker = new google.maps.Marker({
				map:map,
				clickable: true,
				position: results[0].geometry.location
			});
			
			makeInfoWindow(marker, info);
		} else {
			//not success
		}
	});
};

function makeInfoWindow(marker, info) {
	google.maps.event.addListener(marker, "click", function(event) {
		infoWindow.setContent(info);
		infoWindow.open(map, marker);
	});
};