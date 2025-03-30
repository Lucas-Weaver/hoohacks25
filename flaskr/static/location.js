let map;
let pos;

async function goToIndex(position) {
    window.location.href = '/?lat='+position.lat+'&long='+position.lng
}
async function initMap() {
    // Request needed libraries.
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const map = new Map(document.getElementById("map"), {
        center: {lat:54,lng:54},
        zoom: 14,
        mapId: "4504f8b37365c3d0",
    });
   
    const draggableMarker = new AdvancedMarkerElement({
        map,
        position: {lat:54,lng:54},
        gmpDraggable: true,
        title: "This marker is draggable.",
    });

    
    function success(position){
        pos = {lat:position.coords.latitude, lng:position.coords.longitude}
        draggableMarker.position = pos;
        
        map.setCenter(pos);
    }
    function error(error){
        console.log("something went wrong");
    }
    navigator.geolocation.getCurrentPosition(success,error)
    console.log(pos)
    
    

    
    

  
    draggableMarker.addListener("dragend", (event) => {
      
      const position = draggableMarker.position;
      goToIndex(position)
      infoWindow.close();
      infoWindow.setContent(`Pin dropped at: ${position.lat}, ${position.lng}`);
      infoWindow.open(draggableMarker.map, draggableMarker);
      
    });
  }

initMap();