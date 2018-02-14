var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);

var light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);
var light1 = new THREE.PointLight(0xffffff, 0.5);
scene.add(light1);

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var rotWorldMatrix;
var boxGeometry = new THREE.BoxGeometry(1,1,1);

for (var i = 0; i < boxGeometry.faces.length; i += 2)
{

  var color = {
    h: (1 / (boxGeometry.faces.length)) * i,
    s: 0.5,
    l: 0.5
  };

  boxGeometry.faces[i].color.setHSL(color.h, color.s, color.l);
  boxGeometry.faces[i + 1].color.setHSL(color.h, color.s, color.l);

}
var cubeMaterial = new THREE.MeshBasicMaterial(
  {
    vertexColors: THREE.FaceColors,
    overdraw: 0.5
  });

var cube = new THREE.Mesh( boxGeometry, cubeMaterial );
scene.add( cube );

camera.position.set(0, 0, 5);

function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiplySelf(object.matrix);        // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.getRotationFromMatrix(object.matrix, object.scale);
}

function animate() {
  requestAnimationFrame( animate );
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  rotateAroundWorldAxis(cube, 0, 2)
  renderer.render( scene, camera );
}
animate();
