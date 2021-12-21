var pureCoverage = false
// if this is just a coverage or a group of them, disable a few items,
// and default to jpeg format
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

// ...................................................getting XML Data
function getlayers() {
  var xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      myFunction(this)
      console.log('layers called')
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
  var x, i, txt, xmlDoc
  xmlDoc = xml.responseXML
  txt = ''
  x = xmlDoc.getElementsByTagName('title')
  for (i = 0; i < x.length; i++) {
    txt +=
      `<input type="checkbox" id="html" onchange="switcher(this.value)" name="abc" value="` +
      x[i].childNodes[0].nodeValue +
      `">&nbsp` +
      x[i].childNodes[0].nodeValue +
      `<br/>`
  }
  document.getElementById('demo').innerHTML = txt
  // document.getElementById("demo").innerHTML =
  // xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
}

// ...................................................Switching image layers
function switcher(layer) {
  console.log('switched')  

  var params = untiled.getSource().getParams()
  params.LAYERS = layer
  untiled.getSource().updateParams(params)
}

function tester() {
  let text = "Mr. nyc:Blue,nyc:Red has a blue house"
  let position = text.search("nyc:Red");
  console.log(position);
}

// ...................................................mouse hover
var mousePositionControl = new ol.control.MousePosition({
  className: 'custom-mouse-position',
  target: document.getElementById('location'),
  coordinateFormat: ol.coordinate.createStringXY(5),
  undefinedHTML: '&nbsp;',
})

// ...................................................default image layer
  var default_layer = 'nyc:pakistanPAK_adm0_3857';


// ...................................................showing image layer

// function layerAdder() {
  var untiled = new ol.layer.Image({
    source: new ol.source.ImageWMS({
      ratio: 1,
      url: 'http://localhost:8081/geoserver/nyc/wms',
      params: {
        FORMAT: format,
        VERSION: '1.1.1',
        STYLES: '',
        LAYERS: default_layer,
        exceptions: 'application/vnd.ogc.se_inimage',
      },
    }),
  })
// }


// ...................................................satellite image basemap
var worldImagery = new ol.layer.Tile({
  visible: false,
  source: new ol.source.XYZ({
    url:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19,
  }),
})

// ...................................................satellite image Topography basemap
var worldTopo = new ol.layer.Tile({
  visible: false,
  source: new ol.source.XYZ({
    url:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19,
  }),
})

// ...................................................stadia dark basemap
var Darkmap = new ol.layer.Tile({
  visible: false,
  source: new ol.source.XYZ({
    url:
      'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    maxZoom: 19,
  }),
})
// ...................................................Open layers basemap
var basemap = new ol.layer.Tile({
  source: new ol.source.OSM(),
})

// ...................................................projection
var projection = new ol.proj.Projection({
  code: 'EPSG:3857',
  units: 'm',
  global: true,
})
// ...................................................map
var map = new ol.Map({
  controls: ol.control
    .defaults({
      attribution: false,
    })
    .extend([mousePositionControl]),
  target: 'map',
  layers: [worldImagery, basemap, worldTopo, untiled],
  view: new ol.View({
    projection: projection,
  }),
})

var dark_flag = 1;


// ...................................................tile layer opacity

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  untiled.setOpacity(this.value)
}


// ...................................................resolution changer
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
map.getView().fit(bounds, map.getSize())


// ...................................................basemap changer
function worldImg() {
  basemap.set('visible', false)
  worldImagery.set('visible', true)
  worldTopo.set('visible', false)
}
function osmap() {
  basemap.set('visible', true)
  worldImagery.set('visible', false)
  worldTopo.set('visible', false)
}
function topomap() {
  basemap.set('visible', false)
  worldImagery.set('visible', false)
  worldTopo.set('visible', true)
}
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
