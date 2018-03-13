/*
Code for cube rotation was based on and heavily altered from defmech's work
on object rotation with quaternion angles.
https://github.com/defmech/Three.js-Object-Rotation-with-Quaternion

Also referenced but did not use stemkoski's tutorial on three.js 'Mouse Click'
https://github.com/stemkoski/three.js
http://stemkoski.github.io/Three.js/Mouse-Click.html
*/

import { cubes } from '../faces.js';

// Namespace
var RubiksCube = RubiksCube || {};

RubiksCube.RotationWithQuaternion = (function() {
	'use_strict';

//*******************
	var cubeState;  //*
//*******************

	var facesSTATE;
	var cubeSTATE;
	var container;
	var camera, scene, renderer;
	var cube1, cube2, cube3,
			cube4, cube5,
			cube6, cube7, cube8,
			cube9, cube10, cube11,
			cube12, cube13, cube14,
			cube15, cube16, cube17,
			cube18, cube19, cube20,
			cube21, cube22, cube23,
			cube24, cube25, cube26, cube27;
	var mouseDown = false;
	var mouse = new THREE.Vector2();
	var rotateStartPoint = new THREE.Vector3(0, 0, 1);
	var rotateEndPoint = new THREE.Vector3(0, 0, 1);
	var cur1Quaternion,
			cur2Quaternion,
			cur3Quaternion,
			cur4Quaternion,
			cur5Quaternion,
			cur6Quaternion,
			cur7Quaternion,
			cur8Quaternion,
			cur9Quaternion,
			cur10Quaternion,
			cur11Quaternion,
			cur12Quaternion,
			cur13Quaternion,
			cur14Quaternion,
			cur15Quaternion,
			cur16Quaternion,
			cur17Quaternion,
			cur18Quaternion,
			cur19Quaternion,
			cur20Quaternion,
			cur21Quaternion,
			cur22Quaternion,
			cur23Quaternion,
			cur24Quaternion,
			cur25Quaternion,
			cur26Quaternion,
			cur27Quaternion;

	var ray = new THREE.Raycaster();
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	var rotationSpeed = 2;
	var lastMoveTimestamp = new Date();
	var moveReleaseTimeDelta = 50;
	var startPoint = {
		x: 0,
		y: 0
	};
	var deltaX = 0,
			deltaY = 0;

	var ROTATION_TYPES = {
		1:{}
	};




	var setup = function() {

		facesSTATE = {1:[12, 13, 88, 89, 58, 59],
								  2:[14, 15, 64, 65],
								  3:[16, 17, 70, 71, 102, 103],
								  4:[6, 7, 82, 83],
								  5:[8, 9],
								  6:[10, 11, 96, 97],
								  7:[0, 1, 76, 77, 52, 53],
								  8:[2, 3, 46, 47],
								  9:[4, 5, 40, 41, 90, 91],
								  10:[86, 87, 56, 57],
								  11:[62, 63],
								  12:[68, 69, 104, 105],
								  13:[80, 81],
								  14:[],
								  15:[98, 99],
								  16:[74, 75, 50, 51],
								  17:[44, 45],
								  18:[38, 39, 92, 93],
								  19:[34, 35, 54, 55, 84, 85],
								  20:[32, 33, 60, 61],
								  21:[30, 31, 66, 67, 106, 107],
								  22:[28, 29, 78, 79],
								  23:[26, 27],
								  24:[24, 25, 100, 101],
								  25:[22, 23, 48, 49, 72, 73],
								  26:[20, 21, 42, 43],
								  27:[18, 19, 36, 37, 94, 95]
								};

		cubeSTATE = {1: cube1, 2: cube2,
								 3: cube3, 4: cube4,
								 5: cube5, 6: cube6,
								 7: cube7, 8: cube8,
								 9: cube9, 10: cube10,
								 11: cube11, 12: cube12,
								 13: cube13, 14: cube14,
								 15: cube15, 16: cube16,
								 17: cube17, 18: cube18,
								 19: cube19, 20: cube20,
								 21: cube21, 22: cube22,
								 23: cube23, 24: cube24,
								 25: cube25, 26: cube26,
								 27: cube27
							 };

		container = document.createElement('div');
		container.style.display = 'flex';
		container.style.alignItems = 'center';
		container.style.height = 'fit-content';
		document.body.appendChild(container);

		// var info = document.createElement('div');
		// info.style.position = 'absolute';
		// info.style.top = '10px';
		// info.style.width = '100px';
		// info.style.textAlign = 'center';
		// info.innerHTML = '3D - cube0';
		// document.body.appendChild(info);

		var button = document.createElement('div');
		button.innerHTML = 'Rotate X'
		button.style.border = '1px solid black'
		button.style.padding = '10px';
		button.style.width = '70px';
		button.style.height = '20px';
		button.style.borderRadius = '6px';
		button.style.cursor = 'pointer';
		button.style.className = "button";
		button.style.background = 'lightgrey';
		container.appendChild(button);

		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.y = 50;
		camera.position.z = 500;

		scene = new THREE.Scene();
		// Cube size
		var size = 200;

		//cube materials
		var transparent = new THREE.MeshLambertMaterial({
			vertexColors: THREE.FaceColors,
			overdraw: 1,
			transparent: true,
			opacity: 0.01
		});
		var white = new THREE.MeshBasicMaterial({
			overdraw: 1,
			transparent: false,
			color: 0xffffff
		});
		var yellow = new THREE.MeshBasicMaterial({
			overdraw: 1,
			transparent: false,
			color: 0xfff200
		});
		var red = new THREE.MeshBasicMaterial({
			overdraw: 1,
			transparent: false,
			color: 0xff0000
		});
		var green = new THREE.MeshBasicMaterial({
			overdraw: 1,
			transparent: false,
			color: 0x28ff00
		});
		var blue = new THREE.MeshBasicMaterial({
			overdraw: 1,
			transparent: false,
			color: 0x00a0ff
		});
		var orange = new THREE.MeshBasicMaterial({
			overdraw: 1,
			transparent: false,
			color: 0xffb000
		});
		var cubeMaterial = [transparent, white, yellow, red, orange, blue, green];

		var boxGeometry1 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry2 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry3 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry4 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry5 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry6 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry7 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry8 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry9 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry10 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry11 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry12 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry13 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry14 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry15 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry16 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry17 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry18 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry19 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry20 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry21 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry22 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry23 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry24 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry25 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry26 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometry27 = new THREE.BoxGeometry(size, size, size, 3, 3, 3);

		//SET FACES
		var faceColorKey = {
		  1:{12:1, 13:1, 88:5, 89:5, 58:4, 59:4},
		  2:{14:1, 15:1, 64:4, 65:4},
		  3:{16:1, 17:1, 70:4, 71:4, 102:6, 103:6},
		  4:{6:1, 7:1, 82:5, 83:5},
		  5:{8:1, 9:1},
		  6:{10:1, 11:1, 96:6, 97:6},
		  7:{0:1, 1:1, 76:5, 77:5, 52:3, 53:3},
		  8:{2:1, 3:1, 46:3, 47:3},
		  9:{4:1, 5:1, 40:3, 41:3, 90:6, 91:6},
		  10:{86:5, 87:5, 56:4, 57:4},
		  11:{62:4, 63:4},
		  12:{68:4, 69:4, 104:6, 105:6},
		  13:{80:5, 81:5},
		  14:{},
		  15:{98:6, 99:6},
		  16:{74:5, 75:5, 50:3, 51:3},
		  17:{44:3, 45:3},
		  18:{38:3, 39:3, 92:6, 93:6},
		  19:{34:2, 35:2, 54:4, 55:4, 84:5, 85:5},
		  20:{32:2, 33:2, 60:4, 61:4},
		  21:{30:2, 31:2, 66:4, 67:4, 106:6, 107:6},
		  22:{28:2, 29:2, 78:5, 79:5},
		  23:{26:2, 27:2},
		  24:{24:2, 25:2, 100:6, 101:6},
		  25:{22:2, 23:2, 48:3, 49:3, 72:5, 73:5},
		  26:{20:2, 21:2, 42:3, 43:3},
		  27:{18:2, 19:2, 36:3, 37:3, 94:6, 95:6}
		}
 		for(var i = 0; i < 108; i++)
		{
			boxGeometry1.faces[i].materialIndex = 0;
			boxGeometry2.faces[i].materialIndex = 0;
			boxGeometry3.faces[i].materialIndex = 0;
			boxGeometry4.faces[i].materialIndex = 0;
			boxGeometry5.faces[i].materialIndex = 0;
			boxGeometry6.faces[i].materialIndex = 0;
			boxGeometry7.faces[i].materialIndex = 0;
			boxGeometry8.faces[i].materialIndex = 0;
			boxGeometry9.faces[i].materialIndex = 0;
			boxGeometry10.faces[i].materialIndex = 0;
			boxGeometry11.faces[i].materialIndex = 0;
			boxGeometry12.faces[i].materialIndex = 0;
			boxGeometry13.faces[i].materialIndex = 0;
			boxGeometry14.faces[i].materialIndex = 0;
			boxGeometry15.faces[i].materialIndex = 0;
			boxGeometry16.faces[i].materialIndex = 0;
			boxGeometry17.faces[i].materialIndex = 0;
			boxGeometry18.faces[i].materialIndex = 0;
			boxGeometry19.faces[i].materialIndex = 0;
			boxGeometry20.faces[i].materialIndex = 0;
			boxGeometry21.faces[i].materialIndex = 0;
			boxGeometry22.faces[i].materialIndex = 0;
			boxGeometry23.faces[i].materialIndex = 0;
			boxGeometry24.faces[i].materialIndex = 0;
			boxGeometry25.faces[i].materialIndex = 0;
			boxGeometry26.faces[i].materialIndex = 0;
			boxGeometry27.faces[i].materialIndex = 0;
		}
		var listBoxes = { 1: boxGeometry1,
											2: boxGeometry2,
											3: boxGeometry3,
											4: boxGeometry4,
											5: boxGeometry5,
											6: boxGeometry6,
											7: boxGeometry7,
											8: boxGeometry8,
											9: boxGeometry9,
											10: boxGeometry10,
											11: boxGeometry11,
											12: boxGeometry12,
											13: boxGeometry13,
											14: boxGeometry14,
											15: boxGeometry15,
											16: boxGeometry16,
											17: boxGeometry17,
											18: boxGeometry18,
											19: boxGeometry19,
											20: boxGeometry20,
											21: boxGeometry21,
											22: boxGeometry22,
											23: boxGeometry23,
											24: boxGeometry24,
											25: boxGeometry25,
											26: boxGeometry26,
											27: boxGeometry27
										};

		for(var i = 1; i < 28; i++) {
			let keys = Object.keys(faceColorKey[i]);
			for(var j = 0; j < keys.length; j++){
				listBoxes[i].faces[keys[j]].materialIndex = faceColorKey[i][keys[j]];
			}
		}

		// CUBES!---------------------------------------------------------------
		cube1 = new THREE.Mesh(boxGeometry1, cubeMaterial);
			cube2 = new THREE.Mesh(boxGeometry2, cubeMaterial);
			cube3 = new THREE.Mesh(boxGeometry3, cubeMaterial);
			cube4 = new THREE.Mesh(boxGeometry4, cubeMaterial);
			cube5 = new THREE.Mesh(boxGeometry5, cubeMaterial);
			cube6 = new THREE.Mesh(boxGeometry6, cubeMaterial);
			cube7 = new THREE.Mesh(boxGeometry7, cubeMaterial);
			cube8 = new THREE.Mesh(boxGeometry8, cubeMaterial);
			cube9 = new THREE.Mesh(boxGeometry9, cubeMaterial);
			cube10 = new THREE.Mesh(boxGeometry10, cubeMaterial);
			cube11 = new THREE.Mesh(boxGeometry11, cubeMaterial);
			cube12 = new THREE.Mesh(boxGeometry12, cubeMaterial);
			cube13 = new THREE.Mesh(boxGeometry13, cubeMaterial);
			cube14 = new THREE.Mesh(boxGeometry14, cubeMaterial);
			cube15 = new THREE.Mesh(boxGeometry15, cubeMaterial);
			cube16 = new THREE.Mesh(boxGeometry16, cubeMaterial);
			cube17 = new THREE.Mesh(boxGeometry17, cubeMaterial);
			cube18 = new THREE.Mesh(boxGeometry18, cubeMaterial);
			cube19 = new THREE.Mesh(boxGeometry19, cubeMaterial);
			cube20 = new THREE.Mesh(boxGeometry20, cubeMaterial);
			cube21 = new THREE.Mesh(boxGeometry21, cubeMaterial);
			cube22 = new THREE.Mesh(boxGeometry22, cubeMaterial);
			cube23 = new THREE.Mesh(boxGeometry23, cubeMaterial);
			cube24 = new THREE.Mesh(boxGeometry24, cubeMaterial);
			cube25 = new THREE.Mesh(boxGeometry25, cubeMaterial);
			cube26 = new THREE.Mesh(boxGeometry26, cubeMaterial);
			cube27 = new THREE.Mesh(boxGeometry27, cubeMaterial);

		cube1.position.x = 0;
			cube1.position.y = 0;
			cube1.position.z = 0;
			cube2.position.x = 0;
			cube2.position.y = 0;
			cube2.position.z = 0;
			cube3.position.x = 0;
			cube3.position.y = 0;
			cube3.position.z = 0;
			cube4.position.x = 0;
			cube4.position.y = 0;
			cube4.position.z = 0;
			cube5.position.x = 0;
			cube5.position.y = 0;
			cube5.position.z = 0;
			cube6.position.x = 0;
			cube6.position.y = 0;
			cube6.position.z = 0;
			cube7.position.x = 0;
			cube7.position.y = 0;
			cube7.position.z = 0;
			cube8.position.x = 0;
			cube8.position.y = 0;
			cube8.position.z = 0;
			cube9.position.x = 0;
			cube9.position.y = 0;
			cube9.position.z = 0;
			cube10.position.x = 0;
			cube10.position.y = 0;
			cube10.position.z = 0;
			cube11.position.x = 0;
			cube11.position.y = 0;
			cube11.position.z = 0;
			cube12.position.x = 0;
			cube12.position.y = 0;
			cube12.position.z = 0;
			cube13.position.x = 0;
			cube13.position.y = 0;
			cube13.position.z = 0;
			cube14.position.x = 0;
			cube14.position.y = 0;
			cube14.position.z = 0;
			cube15.position.x = 0;
			cube15.position.y = 0;
			cube15.position.z = 0;
			cube16.position.x = 0;
			cube16.position.y = 0;
			cube16.position.z = 0;
			cube17.position.x = 0;
			cube17.position.y = 0;
			cube17.position.z = 0;
			cube18.position.x = 0;
			cube18.position.y = 0;
			cube18.position.z = 0;
			cube19.position.x = 0;
			cube19.position.y = 0;
			cube19.position.z = 0;
			cube20.position.x = 0;
			cube20.position.y = 0;
			cube20.position.z = 0;
			cube21.position.x = 0;
			cube21.position.y = 0;
			cube21.position.z = 0;
			cube22.position.x = 0;
			cube22.position.y = 0;
			cube22.position.z = 0;
			cube23.position.x = 0;
			cube23.position.y = 0;
			cube23.position.z = 0;
			cube24.position.x = 0;
			cube24.position.y = 0;
			cube24.position.z = 0;
			cube25.position.x = 0;
			cube25.position.y = 0;
			cube25.position.z = 0;
			cube26.position.x = 0;
			cube26.position.y = 0;
			cube26.position.z = 0;
			cube27.position.x = 0;
			cube27.position.y = 0;
			cube27.position.z = 0;

		scene.add(cube1);
			scene.add(cube2);
			scene.add(cube3);
			scene.add(cube4);
			scene.add(cube5);
			scene.add(cube6);
			scene.add(cube7);
			scene.add(cube8);
			scene.add(cube9);
			scene.add(cube10);
			scene.add(cube11);
			scene.add(cube12);
			scene.add(cube13);
			scene.add(cube14);
			scene.add(cube15);
			scene.add(cube16);
			scene.add(cube17);
			scene.add(cube18);
			scene.add(cube19);
			scene.add(cube20);
			scene.add(cube21);
			scene.add(cube22);
			scene.add(cube23);
			scene.add(cube24);
			scene.add(cube25);
			scene.add(cube26);
			scene.add(cube27);

		// CUBES!---------------------------------------------------------------

		renderer = new THREE.CanvasRenderer();
		renderer.setClearColor(0xfffff); //BACKGROUND COLOR
		renderer.setSize(700, 700);
		document.getElementsByTagName('section')[0].appendChild(renderer.domElement);
		// var canvas = document.getElementsByTagName('canvas')[0];
		console.log(document.getElementsByTagName('canvas')[0]);
		document.getElementsByTagName('canvas')[0].addEventListener('mousedown', onDocumentMouseDown, false);
		document.getElementsByTagName('canvas')[0].addEventListener('contextmenu', getFace, false);
		button.addEventListener('click',() => {
			cube1.rotateY(-Math.PI / 2)
			cube3.rotateY(-Math.PI / 2)
			cube19.rotateY(-Math.PI / 2)
			cube21.rotateY(-Math.PI / 2)
			cube2.rotateY(-Math.PI / 2)
			cube10.rotateY(-Math.PI / 2)
			cube12.rotateY(-Math.PI / 2)
			cube20.rotateY(-Math.PI / 2)

		});
		// window.addEventListener('resize', onWindowResize, false);

		animate();
	}; //end initialize / setup

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {
	event.preventDefault();

	document.getElementsByTagName('canvas')[0].addEventListener('mousemove', onDocumentMouseMove, false);
	document.getElementsByTagName('canvas')[0].addEventListener('mouseup', onDocumentMouseUp, false);

	mouseDown = true;

	startPoint = {
		x: event.clientX,
		y: event.clientY
	};

	rotateStartPoint = rotateEndPoint = projectOnTrackball(0, 0);
}

function onDocumentMouseMove(event) {
	deltaX = (event.x - startPoint.x) / 2;
	deltaY = (event.y - startPoint.y) / 2;

	handleRotation();

	startPoint.x = event.x;
	startPoint.y = event.y;

	lastMoveTimestamp = new Date();
}

function onDocumentMouseUp(event) {
	if (new Date().getTime() - lastMoveTimestamp.getTime() > moveReleaseTimeDelta)
	{
		deltaX = event.x - startPoint.x;
		deltaY = event.y - startPoint.y;
	}

	mouseDown = false;

	document.getElementsByTagName('canvas')[0].removeEventListener('mousemove', onDocumentMouseMove, false);
	document.getElementsByTagName('canvas')[0].removeEventListener('mouseup', onDocumentMouseUp, false);

	// getFace(event);
}

function getFace(event){
		event.preventDefault();
		mouse.x = ((event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1;
		mouse.y = - ((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;

		var vector = new THREE.Vector3( mouse.x, mouse.y, 0 );
		vector.unproject(camera);
		ray.setFromCamera(mouse, camera);
		var intersects = ray.intersectObjects( scene.children );
		var selectedCube, selectedFace, selectedPoint;

		console.log(intersects);
		if ( intersects.length > 0 ) {
			for(var i = 0; i < intersects.length; i++)
				if (intersects[i].face.materialIndex > 0) {
					selectedCube = intersects[i].object;
					selectedFace = intersects[i].faceIndex;
					selectedPoint = intersects[i].point;
			}
		}

		console.log(selectedCube);
		console.log(selectedFace);
		console.log(cubes);


		determineRotationType(selectedCube, selectedFace);
		// finds the correct plane to

		// var center1 = getWorldPosition(cube1,[26, 27]);
		// var center2 = getWorldPosition(cube0,[8, 9]);
		// var vP = new THREE.Vector3(selectedPoint.x, selectedPoint.y, selectedPoint.z);
		// var v1 = new THREE.Vector3(center1.x, center1.y, center1.z);
		// var v2 = new THREE.Vector3(center2.x, center2.y, center2.z);
		// var dist1 = vP.distanceTo(v1);
		// var dist2 = vP.distanceTo(v2);
    //
		// console.log("cube1", dist1)
		// console.log("cube0", dist2);;

		//call rotate
}

function determineRotationType(cube, face){
	var cubeOfRotation = closestPlane(cube, face);

}

function closestPlane(cube, face){
	var cubeNum = cubeSTATE[cube];

}

function getWorldPosition(cubo, faces){
	var norm = new THREE.Matrix3().getNormalMatrix( cubo.matrixWorld );
	var world1 = cubo.geometry.faces[faces[0]].normal.clone().applyMatrix3(norm).normalize();
	var world2 = cubo.geometry.faces[faces[1]].normal.clone().applyMatrix3(norm).normalize();
	console.log(`${cubo.id}`,world1);
	return world1;
}

function projectOnTrackball(touchX, touchY) {
	var mouseOnBall = new THREE.Vector3();

	mouseOnBall.set(
		clamp(touchX / windowHalfX, -1, 1), clamp(-touchY / windowHalfY, -1, 1),
		0.0
	);

	var length = mouseOnBall.length();

	if (length > 1.0)
	{
		mouseOnBall.normalize();
	}
	else
	{
		mouseOnBall.z = Math.sqrt(1.0 - length * length);
	}

	return mouseOnBall;
}

function rotateMatrix(rotateStart, rotateEnd) {
	axis = new THREE.Vector3()
	quaternion = new THREE.Quaternion();

	var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());
	if (angle)
	{
		axis.crossVectors(rotateStart, rotateEnd).normalize();
		angle *= rotationSpeed;
		quaternion.setFromAxisAngle(axis, angle);
	}
	// console.log('quat', quaternion);
	return quaternion;
}

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	if (!mouseDown)
	{
		var drag = 0.95;
		var minDelta = 0.05;

		if (deltaX < -minDelta || deltaX > minDelta)
		{
			deltaX *= drag;
		}
		else
		{
			deltaX = 0;
		}

		if (deltaY < -minDelta || deltaY > minDelta)
		{
			deltaY *= drag;
		}
		else
		{
			deltaY = 0;
		}

		handleRotation();
	}

	renderer.render(scene, camera);
}

var handleRotation = function() {
	rotateEndPoint = projectOnTrackball(deltaX, deltaY);
	var rotateQuaternion = rotateMatrix(rotateStartPoint, rotateEndPoint);

	cur1Quaternion = cube1.quaternion;
		cur1Quaternion.multiplyQuaternions(rotateQuaternion, cur1Quaternion);
		cur1Quaternion.normalize();
		cube1.setRotationFromQuaternion(cur1Quaternion);

		cur2Quaternion = cube2.quaternion;
		cur2Quaternion.multiplyQuaternions(rotateQuaternion, cur2Quaternion);
		cur2Quaternion.normalize();
		cube2.setRotationFromQuaternion(cur2Quaternion);

		cur3Quaternion = cube3.quaternion;
		cur3Quaternion.multiplyQuaternions(rotateQuaternion, cur3Quaternion);
		cur3Quaternion.normalize();
		cube3.setRotationFromQuaternion(cur3Quaternion);

		cur4Quaternion = cube4.quaternion;
		cur4Quaternion.multiplyQuaternions(rotateQuaternion, cur4Quaternion);
		cur4Quaternion.normalize();
		cube4.setRotationFromQuaternion(cur4Quaternion);

		cur5Quaternion = cube5.quaternion;
		cur5Quaternion.multiplyQuaternions(rotateQuaternion, cur5Quaternion);
		cur5Quaternion.normalize();
		cube5.setRotationFromQuaternion(cur5Quaternion);

		cur6Quaternion = cube6.quaternion;
		cur6Quaternion.multiplyQuaternions(rotateQuaternion, cur6Quaternion);
		cur6Quaternion.normalize();
		cube6.setRotationFromQuaternion(cur6Quaternion);

		cur7Quaternion = cube7.quaternion;
		cur7Quaternion.multiplyQuaternions(rotateQuaternion, cur7Quaternion);
		cur7Quaternion.normalize();
		cube7.setRotationFromQuaternion(cur7Quaternion);

		cur8Quaternion = cube8.quaternion;
		cur8Quaternion.multiplyQuaternions(rotateQuaternion, cur8Quaternion);
		cur8Quaternion.normalize();
		cube8.setRotationFromQuaternion(cur8Quaternion);

		cur9Quaternion = cube9.quaternion;
		cur9Quaternion.multiplyQuaternions(rotateQuaternion, cur9Quaternion);
		cur9Quaternion.normalize();
		cube9.setRotationFromQuaternion(cur9Quaternion);

		cur10Quaternion = cube10.quaternion;
		cur10Quaternion.multiplyQuaternions(rotateQuaternion, cur10Quaternion);
		cur10Quaternion.normalize();
		cube10.setRotationFromQuaternion(cur10Quaternion);

		cur11Quaternion = cube11.quaternion;
		cur11Quaternion.multiplyQuaternions(rotateQuaternion, cur11Quaternion);
		cur11Quaternion.normalize();
		cube11.setRotationFromQuaternion(cur11Quaternion);

		cur12Quaternion = cube12.quaternion;
		cur12Quaternion.multiplyQuaternions(rotateQuaternion, cur12Quaternion);
		cur12Quaternion.normalize();
		cube12.setRotationFromQuaternion(cur12Quaternion);

		cur13Quaternion = cube13.quaternion;
		cur13Quaternion.multiplyQuaternions(rotateQuaternion, cur13Quaternion);
		cur13Quaternion.normalize();
		cube13.setRotationFromQuaternion(cur13Quaternion);

		cur14Quaternion = cube14.quaternion;
		cur14Quaternion.multiplyQuaternions(rotateQuaternion, cur14Quaternion);
		cur14Quaternion.normalize();
		cube14.setRotationFromQuaternion(cur14Quaternion);

		cur15Quaternion = cube15.quaternion;
		cur15Quaternion.multiplyQuaternions(rotateQuaternion, cur15Quaternion);
		cur15Quaternion.normalize();
		cube15.setRotationFromQuaternion(cur15Quaternion);

		cur16Quaternion = cube16.quaternion;
		cur16Quaternion.multiplyQuaternions(rotateQuaternion, cur16Quaternion);
		cur16Quaternion.normalize();
		cube16.setRotationFromQuaternion(cur16Quaternion);

		cur17Quaternion = cube17.quaternion;
		cur17Quaternion.multiplyQuaternions(rotateQuaternion, cur17Quaternion);
		cur17Quaternion.normalize();
		cube17.setRotationFromQuaternion(cur17Quaternion);

		cur18Quaternion = cube18.quaternion;
		cur18Quaternion.multiplyQuaternions(rotateQuaternion, cur18Quaternion);
		cur18Quaternion.normalize();
		cube18.setRotationFromQuaternion(cur18Quaternion);

		cur19Quaternion = cube19.quaternion;
		cur19Quaternion.multiplyQuaternions(rotateQuaternion, cur19Quaternion);
		cur19Quaternion.normalize();
		cube19.setRotationFromQuaternion(cur19Quaternion);

		cur20Quaternion = cube20.quaternion;
		cur20Quaternion.multiplyQuaternions(rotateQuaternion, cur20Quaternion);
		cur20Quaternion.normalize();
		cube20.setRotationFromQuaternion(cur20Quaternion);

		cur21Quaternion = cube21.quaternion;
		cur21Quaternion.multiplyQuaternions(rotateQuaternion, cur21Quaternion);
		cur21Quaternion.normalize();
		cube21.setRotationFromQuaternion(cur21Quaternion);

		cur22Quaternion = cube22.quaternion;
		cur22Quaternion.multiplyQuaternions(rotateQuaternion, cur22Quaternion);
		cur22Quaternion.normalize();
		cube22.setRotationFromQuaternion(cur22Quaternion);

		cur23Quaternion = cube23.quaternion;
		cur23Quaternion.multiplyQuaternions(rotateQuaternion, cur23Quaternion);
		cur23Quaternion.normalize();
		cube23.setRotationFromQuaternion(cur23Quaternion);

		cur24Quaternion = cube24.quaternion;
		cur24Quaternion.multiplyQuaternions(rotateQuaternion, cur24Quaternion);
		cur24Quaternion.normalize();
		cube24.setRotationFromQuaternion(cur24Quaternion);

		cur25Quaternion = cube25.quaternion;
		cur25Quaternion.multiplyQuaternions(rotateQuaternion, cur25Quaternion);
		cur25Quaternion.normalize();
		cube25.setRotationFromQuaternion(cur25Quaternion);

		cur26Quaternion = cube26.quaternion;
		cur26Quaternion.multiplyQuaternions(rotateQuaternion, cur26Quaternion);
		cur26Quaternion.normalize();
		cube26.setRotationFromQuaternion(cur26Quaternion);

		cur27Quaternion = cube27.quaternion;
		cur27Quaternion.multiplyQuaternions(rotateQuaternion, cur27Quaternion);
		cur27Quaternion.normalize();
		cube27.setRotationFromQuaternion(cur27Quaternion);

	rotateEndPoint = rotateStartPoint;
};



// PUBLIC INTERFACE
return {
	init: function()
	{
		setup();
	}
};
})();

document.onreadystatechange = function() {
	if (document.readyState === 'complete')
	{
		RubiksCube.RotationWithQuaternion.init();
	}
};
