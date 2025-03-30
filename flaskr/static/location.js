let map;


async function goToIndex(position) {
    window.location.href = '/?lat='+position.lat+'&long='+position.lng
}
async function initMap() {
    // Request needed libraries.
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const map = new Map(document.getElementById("map"), {
        center: {lat:0.0, lng:0.0},
        zoom: 14,
        mapId: "4504f8b37365c3d0",
    });
    infoWindow.setPosition(pos);
    infoWindow.setContent("Location found.");
    infoWindow.open(map);
    
    const infoWindow = new InfoWindow();
    const draggableMarker = new AdvancedMarkerElement({
        map,
        position: pos,
        gmpDraggable: true,
        title: "This marker is draggable.",
    });
    navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        
        
        infoWindow,setCenter(pos)
        draggableMarker.setCenter(pos)
        map.setCenter(pos);


        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        },
      );

    
    
    
  
    draggableMarker.addListener("dragend", (event) => {
      
      const position = draggableMarker.position;
      goToIndex(position)
      infoWindow.close();
      infoWindow.setContent(`Pin dropped at: ${position.lat}, ${position.lng}`);
      infoWindow.open(draggableMarker.map, draggableMarker);
      
    });
  }

initMap();