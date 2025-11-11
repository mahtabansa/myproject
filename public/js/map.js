    
    function initializeMap(apiKey) {
    
    maptilersdk.config.apiKey = apiKey;
      
    const map = new maptilersdk.Map({
        container: 'map', // id of the div
        style: maptilersdk.MapStyle.STREETS, // map style
        center: listing.geometry.coordinates, // [longitude, latitude]
        zoom: 10,
    });

    const marker = new maptilersdk.Marker({
        color:"red",
    
    })
  .setLngLat(listing.geometry.coordinates)
  .addTo(map);


  
  const popup = new maptilersdk.Popup()
  .setLngLat(listing.geometry.coordinates)
  .setHTML( `<h4>${ listing.title } </h4> <br> exact location will be send after booking`)
  .setMaxWidth("200px")
  .addTo(map);

}