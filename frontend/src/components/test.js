import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = props => {
  const mapRef = useRef();
  
  const { center, zoom } = props;

  var markers = [
    {
        "title": 'Aksa Beach',
        "lat": '19.1759668',
        "lng": '72.79504659999998',
        "description": 'Aksa Beach is a popular beach and a vacation spot in Aksa village at Malad, Mumbai.'
    },
    {
        "title": 'Juhu Beach',
        "lat": '19.0883595',
        "lng": '72.82652380000002',
        "description": 'Juhu Beach is one of favourite tourist attractions situated in Mumbai.'
    },
    {
        "title": 'Girgaum Beach',
        "lat": '18.9542149',
        "lng": '72.81203529999993',
        "description": 'Girgaum Beach commonly known as just Chaupati is one of the most famous public beaches in Mumbai.'
    },
    {
        "title": 'Jijamata Udyan',
        "lat": '18.979006',
        "lng": '72.83388300000001',
        "description": 'Jijamata Udyan is situated near Byculla station is famous as Mumbai (Bombay) Zoo.'
    },
    {
        "title": 'Sanjay Gandhi National Park',
        "lat": '19.2147067',
        "lng": '72.91062020000004',
        "description": 'Sanjay Gandhi National Park is a large protected area in the northern part of Mumbai city.'
    }
    ];

  useEffect(() => {
      console.log("Maps")
    const map = new window.google.maps.Map(mapRef.current, {
      center: new window.google.maps.LatLng(markers[0].lat, markers[0].lng),
     // zoom: zoom
    });

    var latlngbounds = new window.google.maps.LatLngBounds();

    for (var i = 0; i < markers.length; i++) {
      var data = markers[i]
      var myLatlng = new window.google.maps.LatLng(data.lat, data.lng);
      var marker = new window.google.maps.Marker({
          position: myLatlng,
          map: map,
          title: data.title
      });

      latlngbounds.extend(marker.position);

      var infoWindow = new window.google.maps.InfoWindow();
    
      
      

      (function (marker, data) {
        window.google.maps.event.addListener(marker, "click", function (e) {
            //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
            infoWindow.setContent("<div style = 'width:200px;min-height:40px'>" + data.description + "</div>");
            infoWindow.open(map, marker);
        });
    })(marker, data);
    
    }

    var bounds = new window.google.maps.LatLngBounds();
 
        //Center map and adjust Zoom based on the position of all markers.
        map.setCenter(latlngbounds.getCenter());
        map.fitBounds(latlngbounds);
  
  }, [center, zoom]);  


  return (
    <div>
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
    
    </div>
  );
};

export default Map;
