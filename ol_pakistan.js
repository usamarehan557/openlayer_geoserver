var pureCoverage = false
var format = 'image/png'
var bounds = [
  6779294.310947161,
  2717248.5924314223,
  8665451.873011257,
  4452637.588751792,
]
if (pureCoverage) {
  format = 'image/jpeg'
}
var map;
var dark_flag = 1;
var osmBasemap;
var mousePositionControl;
var worldTopo;
var worldImagery;

function callDefaultData() {
  create_MapObject();
  getXml();
  add_osm();
}

// ...................................................getting XML Data
function getXml() {
  var xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      myFunction(this);
      turn_on_default_layer(0);
    }
  }
  xhttp.open('GET', 'note.xml', true)
  xhttp.send()
}
// ...................................................Showing XML Data via Loop
function myFunction(xml) {
  // var xmlDoc = xml.responseXML;
  // var x = xmlDoc.getElementsByTagName('author')[2];
  // var y = x.childNodes[0];
  // var layername = y.nodeValue;
  // document.getElementById("demo").innerHTML = layername;
  var i, xmlDoc;

  var x, i, txt;
  xmlDoc = xml.responseXML;
  txt = '';
  x = xmlDoc.getElementsByTagName('title');
  for (i = 0; i < x.length; i++) {
    txt +=
      `<input type="checkbox" id="`+ i +`s" onchange="layer_switcher(this.value)" name="abc" value="` +
      i +
      // x[i].childNodes[0].nodeValue +
      `">&nbsp` +
      x[i].childNodes[0].nodeValue +
      `<br/>`;
      n = i;
      z = x[i].childNodes[0].nodeValue;
      popper(z, i);
      function popper(a, b) {
        custom_AddLayers(a, b);
      }
  }
  document.getElementById('demo').innerHTML = txt;
  // document.getElementById("demo").innerHTML =
  // xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
}


// ...................................................Switching image layers old
function layer_switcher(layer_id) {

  if (window["geoserved" + layer_id].getProperties().visible == true) {
    window["geoserved" + layer_id].setVisible(false);
  } else {
    window["geoserved" + layer_id].setVisible(true);
  }
  // var momo = window["geoserved" + layer_id].getProperties().visible;
  // // var mimi = momo.visible;
  // console.log(momo);
}

// ...................................................showing image layer
function custom_AddLayers(clayer, id) {
  // var geoserved = [];
  window["geoserved" + id] = new ol.layer.Image({
    visible: true,
    zIndex: 1,
    source: new ol.source.ImageWMS({
      ratio: 1,
      url: 'http://localhost:8081/geoserver/nyc/wms',
      params: {
        ID: id,
        FORMAT: format,
        VERSION: '1.1.1',
        STYLES: '',
        LAYERS: clayer,
        exceptions: 'application/vnd.ogc.se_inimage',
      },
    }),
  })
  map.addLayer(window["geoserved" + id]);
  window["geoserved" + id].setOpacity(0.5);
  window["geoserved" + id].setVisible(false);
  // var mparams = map.getLayers();
  // var params = window["geoserved" + id].getSource().getParams()
  // console.log(mparams);
  // console.log(params);
}

// ...................................................default basemap adder
function add_osm() {
  osmBasemap = new ol.layer.Tile({
    source: new ol.source.OSM(),
  })
  map.addLayer(osmBasemap);
}

function turn_on_default_layer(id) {
  // document.getElementById("flexSwitchCheckDefault").click();
  document.getElementById("0s").click();
  
}

// mapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmap


function create_MapObject() {
  // mouse hover
  mousePositionControl = new ol.control.MousePosition({
    className: 'custom-mouse-position',
    target: document.getElementById('location'),
    coordinateFormat: ol.coordinate.createStringXY(5),
    undefinedHTML: '&nbsp;',
  })
  // projection
  var projection = new ol.proj.Projection({
    code: 'EPSG:3857',
    units: 'm',
    global: true,
  })
  // map
  map = new ol.Map({
    controls: ol.control
      .defaults({
        attribution: false,
      })
      .extend([mousePositionControl]),
    target: 'map',
    // layers: [worldImagery, basemap, worldTopo, geoserved],
    layers: [],
    view: new ol.View({
      projection: projection,
    }),
  })

// world imagery basemap
  worldImagery = new ol.layer.Tile({ 
    visible: false,
      source: new ol.source.XYZ({
        url:
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}/',
        maxZoom: 19,
      }),
    })
    map.addLayer(worldImagery);
    // worldImagery.setVisible(false);
    // var params = worldImagery.getProperties().visible;
    // console.log(params);

  // world topographic basemap
  worldTopo = new ol.layer.Tile({
  visible: false,
    source: new ol.source.XYZ({
      url:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}/',
      maxZoom: 19,
    }),
  })
  map.addLayer(worldTopo);

  // var vector = new VectorLayer({
  //   source: new VectorSource({
  //     url: 'test.geojson',
  //     format: new GeoJSON(),
  //   }),
  // })
  // map.addLayer(vector);



  // resolution changer
  map.getView().on('change:resolution', function (evt) {
    var resolution = evt.target.get('resolution')
    var units = map.getView().getProjection().getUnits()
    var dpi = 25.4 / 0.28
    var mpu = ol.proj.METERS_PER_UNIT[units]
    var scale = resolution * mpu * 39.37 * dpi
    if (scale >= 9500 && scale <= 950000) {
      scale = Math.round(scale / 1000) + 'K'
    } else if (scale >= 950000) {
      scale = Math.round(scale / 1000000) + 'M'
    } else {
      scale = Math.round(scale)
    }
    document.getElementById('scale').innerHTML = 'Scale = 1 : ' + scale
  })
  map.getView().fit(bounds, map.getSize());

  map.on('singleclick', function(evt) {
    // document.getElementById('nodelist').innerHTML = "Loading... please wait...";
    // var view = map.getView();
    // var viewResolution = view.getResolution();
    // var source = window["geoserved" + iid].get('visible') ? window["geoserved" + iid].getSource() : window["geoserved" + iid].getSource();
    // var url = source.getGetFeatureInfoUrl(
    //   evt.coordinate, viewResolution, view.getProjection(),
    //   {'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 50});
    // if (url) {
    //   document.getElementById('nodelist').innerHTML = '<iframe seamless src="' + url + '"></iframe>';
    map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
      console.log('clicked', layer);
    });
    
    // }
  });

  // map.on('click', function(e) {
  //   map.forEachLayerAtPixel(e.pixel, function(layer) {
  //     // log the LAYERS param of the WMS source
  //     console.log(layer.getSource().getParams().LAYERS);
  //   });
  // });


}
// let selected = null;
// const status = document.getElementById('status');

// map.on('singleclick', function (e) {
//   if (selected !== null) {
//     selected.setStyle(undefined);
//     selected = null;
//   }

//   map.forEachFeatureAtPixel(e.pixel, function (f) {
//     selected = f;
//     f.setStyle(highlightStyle);
//     return true;
//   });

//   if (selected) {
//     status.innerHTML = '&nbsp;Hovering: ' + selected.get('name');
//   } else {
//     status.innerHTML = '&nbsp;';
//   }
// });



// mapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmapmap

// basemap changer
function worldImg() {
  osmBasemap.set('visible', false);
  worldImagery.set('visible', true);
  worldTopo.set('visible', false)
}
function osmap() {
  osmBasemap.set('visible', true)
  worldImagery.set('visible', false)
  worldTopo.set('visible', false)
}
function topomap() {
  osmBasemap.set('visible', false)
  worldImagery.set('visible', false)
  worldTopo.set('visible', true)
}

// opacity changer
var slider = document.getElementById("myRange");
// var output = document.getElementById("demo");
// output.innerHTML = slider.value;
slider.oninput = function() {
  geoserved.setOpacity(this.value)
}


//  dark map function
function darkmap() {
  //change map color
  if (dark_flag == 1) {
    document.querySelector('canvas').style.filter="invert(100%)";
    dark_flag = 0;
  } else if (dark_flag == 0) {
    document.querySelector('canvas').style.filter="revert";
    dark_flag = 1;
  }
  // map.on('postcompose',function(e){
  //   document.querySelector('canvas').style.filter="invert(100%)";
  // });
}

function tester(num) {
  var params = window["geoserved" + num].getSource().getParams()
  console.log(params);
  window["geoserved" + num].setOpacity(0.5);
}

// var xhttp = new XMLHttpRequest();
// xhttp.onreadystatechange = function() {
//   // if (this.readyState == 4 && this.status == 200) {
//       myFunction(this);
//   // }
// };
// xhttp.open("GET", "note.xml", true);
// xhttp.send();

// function myFunction(xml) {
//     // var xmlDoc = xml.responseXML;
//     // var x = xmlDoc.getElementsByTagName('author')[2];
//     // var y = x.childNodes[0];
//     // var layername = y.nodeValue;
//     // document.getElementById("demo").innerHTML = layername;
//     var x, i, txt, xmlDoc;
//     xmlDoc = xml.responseXML;
//     txt = "";
//     x = xmlDoc.getElementsByTagName("title");
//     for (i = 0; i < x.length; i++) {
//         txt += x[i].childNodes[0].nodeValue + "<br>";
//     }
//     document.getElementById("demo").innerHTML = txt;
//     console.log(txt);
//     // document.getElementById("demo").innerHTML =
//     // xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
// }

// ...................................................custom basemap adder
// function custom_AddBaseMap(mapUrl, num) {
// var m_url = `"` + mapUrl + `"`;
//  window["basemap" + num] = new ol.layer.Tile({
//   // var basemap1 = new ol.layer.Tile({ 
//   visible: true,
//     source: new ol.source.XYZ({
//       url:
//       mapUrl,
//       maxZoom: 19,
//     }),
//   })
//   console.log("topo called", mapUrl);
//   map.addLayer(window["basemap" + num]);
//   window["basemap" + num].setVisible(false);
//   var params = window["basemap" + num].getProperties().visible;
//   console.log(params)
// }