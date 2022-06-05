mapboxgl.accessToken = 'pk.eyJ1IjoianNhcndhdGUiLCJhIjoiY2t4NnI5ZjJyMDRucjJwcnl5NDh1Zml5cSJ9.qmI6QbbKDZ98r06dRnkSzQ';
var chloromap = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jsarwate/cl3uhu68k001f14n9t35kdhva',
    zoom: 6.5,
    center: [-85.5, 37.7]
});

chloromap.on("load", function () {
  chloromap.addLayer(
      {
        id: "us_states_elections_outline",
        type: "line",
        source: {
          type: "geojson",
          data: "data/statesElections.geojson",
        },
        paint: {
          "line-color": "#ffffff",
          "line-width": 0.7,
        },
      },
      "waterway-label" // Here's where we tell Mapbox where to slot this new layer
    ); 
chloromap.addLayer(
      {
        id: "us_states_elections",
        type: "fill",
        source: {
          type: "geojson",
          data: "data/statesElections.geojson",
        },
        paint: {
          "fill-color": [
            "match",
            ["get", "Winner"],
            "Donald J Trump", "#cf635d",
            "Joseph R Biden Jr", "#6193c7",
            "Other", "#91b66e",
            "#ffffff",
          ],
          "fill-outline-color": "#ffffff",
          "fill-opacity": [
            "step",
            ["get", "WnrPerc"],
            0.3,
            0.4,
            0.5,
            0.5,
            0.7,
            0.6,
            0.9,
          ],
        },
      },
     "us_states_elections_outline" // Here's where we tell Mapbox where to slot this new layer
    );

    chloromap.addLayer(
        {
          id: "us_counties_elections_outline",
          type: "line",
          source: {
            type: "geojson",
            data: "data/countiesElections.geojson",
          },
          paint: {
            "line-color": "#ffffff",
            "line-width": 0.25,
          },
        },
        "us_states_elections"
      );
      chloromap.addLayer(
        {
          id: "us_counties_elections",
          type: "fill",
          source: {
            type: "geojson",
            data: "data/countiesElections.geojson",
          },
          paint: {
            "fill-color": [
              "match",
              ["get", "Winner"],
              "Donald J Trump",
              "#cf635d",
              "Joseph R Biden Jr",
              "#6193c7",
              "Other",
              "#91b66e",
              "#ffffff",
            ],
            "fill-outline-color": "#000000",
            "fill-opacity": [
              "step",
              ["get", "WnrPerc"],
              0.3,
              0.4,
              0.5,
              0.5,
              0.7,
              0.6,
              0.9,
            ],
          },
        },
        "us_counties_elections_outline"
      );
  });

// Create the popup
chloromap.on('click', 'us_states_elections', function (e) {
    var stateName = e.features[0].properties.State;
    var winner = e.features[0].properties.Winner;
    var wnrPerc = e.features[0].properties.WnrPerc;
    var totalVotes = e.features[0].properties.Total;
    wnrPerc = (wnrPerc * 100).toFixed(0);
    totalVotes = totalVotes.toLocaleString();
    stateName = stateName.toUpperCase();
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h4>'+stateName+'</h4>'
            +'<h2>'+winner+'</h2>'
            + '<p>'+wnrPerc+'% - ('+totalVotes+' votes)</p>')
        .addTo(chloromap);
});
// Change the cursor to a pointer when the mouse is over the us_states_elections layer.
chloromap.on('mouseenter', 'us_states_elections', function () {
    map.getCanvas().style.cursor = 'pointer';
});
// Change it back to a pointer when it leaves.
chloromap.on('mouseleave', 'us_states_elections', function () {
    map.getCanvas().style.cursor = '';
});

chloromap.on('click', 'us_counties_elections', function (e) {
    var stateName = e.features[0].properties.State;
    var countyName = e.features[0].properties.County;
    var winner = e.features[0].properties.Winner;
    var wnrPerc = e.features[0].properties.WnrPerc;
    var totalVotes = e.features[0].properties.Total;
    wnrPerc = (wnrPerc * 100).toFixed(0);
    totalVotes = totalVotes.toLocaleString();
    stateName = stateName.toUpperCase();
    countyName = countyName.toUpperCase();
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h4>' + countyName + ' - ' + stateName + '</h4>'
            + '<h2>' + winner + '</h2>'
            + '<p>' + wnrPerc + '% - (' + totalVotes + ' votes)</p>')
        .addTo(chloromap);
});
chloromap.on('mouseenter', 'us_counties_elections', function () {
  chloromap.getCanvas().style.cursor = 'pointer';
});
chloromap.on('mouseleave', 'us_counties_elections', function () {
  chloromap.getCanvas().style.cursor = '';
});