  // Initialize the map
  var map;
  function initialize() {
    var latlng = new google.maps.LatLng(30.0, 0.0);
    var myOptions = {
      zoom: 3,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      disableDefaultUI: true,
      draggable: true,
      keyboardShortcuts: false,
      scrollwheel: false
    };
    map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
  }  // Create and store markers in an array
  var markers = []
  var infowindow = new google.maps.InfoWindow({
    content: ''
  });

  function add_marker() {
    map.panTo(new google.maps.LatLng(document.getElementById("lat").value, document.getElementById("lon").value));
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(document.getElementById("lat").value, document.getElementById("lon").value),
      map: map,
      title: '',
      icon: 'charlie_xsmall.png'
    });

    // Populate infowindows with 'desc' field
    infowindow.content = document.getElementById("desc").value;
    infowindow.open(map, marker);
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });
    markers.push(marker);
    return marker;
  }

  function codeAddress() {
    var geocoder = new google.maps.Geocoder();
    var success=0;
    var address = document.getElementById("address").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        document.getElementById("lat").value = results[0].geometry.location.lat();
        document.getElementById("lon").value = results[0].geometry.location.lng();
        add_marker();
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  var json = []
  var jsArray = []
  var count = -1;


  function dbUpdate() {
    // clear all markers at the start of every cycle
    while(markers[0])
    {
      markers.pop().setMap(null);
    }
    // reset location count
    count = -1;
    // AJAX call
    $.get('jsonArray.php', function(data){
      json = data;
      jsArray = data;
    // call geocoding function
      panToSales();
    });
  }

  function panToSales() {

    var jsArrayLength = $.parseJSON(json).length;
    if (count != jsArrayLength-1) {
      count += 1;
      // set hidden fields with values from the JSON
      $("#address").val($.trim(JSON.stringify($.parseJSON(jsArray)[count].address)).replace(/[\[\]"',]{1}/gi,""));
      $("#desc").val("<center><p style=\"font-family:kulturista;color:#003366;font-size:20px;\">"+
      $.trim(JSON.stringify($.parseJSON(jsArray)[count].description)).replace(/[\[\]"',]{1}/gi,"") + "<br><img src=\"charlie_medium.png\" />");
      codeAddress();
      setTimeout("panToSales()", 3000);
    } else {
      // restart cycle
      dbUpdate();
    }
  }


  $(document).ready(function(){
    dbUpdate();
  });