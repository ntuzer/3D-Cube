window.log = function()
{
	if (this.console)
	{
		console.log(Array.prototype.slice.call(arguments));
	}
};

// Namespace
var Defmech = Defmech ||
{};

Defmech.RotationWithQuaternion = (function()
{
	'use_strict';

	var container;

	var camera, scene, renderer;

	var cube0, cube1, cube2,
			cube3, cube4, cube5,
			cube6, cube7, cube8,
			cube9, cube10, cube11,
			cube12, cube13, cube14,
			cube15, cube16, cube17,
			cube18, cube19, cube20,
			cube21, cube22, cube23,
			cube24, cube25, cube26;

	var mouseDown = false;
	var rotateStartPoint = new THREE.Vector3(0, 0, 1);
	var rotateEndPoint = new THREE.Vector3(0, 0, 1);

	var curQuaternion;
	var rotWorldMatrix;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	var rotationSpeed = 2;
	var lastMoveTimestamp,
		moveReleaseTimeDelta = 50;

	var startPoint = {
		x: 0,
		y: 0
	};

	var deltaX = 0,
		deltaY = 0;

	var setup = function()
	{
		container = document.createElement('div');
		document.body.appendChild(container);

		var info = document.createElement('div');
		info.style.position = 'absolute';
		info.style.top = '10px';
		info.style.width = '100%';
		info.style.textAlign = 'center';
		info.innerHTML = '3D - cube0';
		container.appendChild(info);

		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.y = 150;
		camera.position.z = 500;

		scene = new THREE.Scene();

		// Cube
		var size = 100;


		var transparent = new THREE.MeshLambertMaterial({
			vertexColors: THREE.FaceColors,
			overdraw: 1,
			transparent: true,
			opacity: 0
		});
		var white = new THREE.MeshBasicMaterial({
			overdraw: 1,
			transparent: false
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
		var cubeMaterial = [transparent, white, yellow, red, green, blue, orange];

		var boxGeometryW1R = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometryY2L = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometryR3T = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometryO4Bt = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometryB5F = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
			var boxGeometryG6Bk = new THREE.BoxGeometry(size, size, size, 3, 3, 3);

		for(var i = 0; i < 108; i++){
			boxGeometryW1R.faces[i].materialIndex = 0;
			boxGeometryY2L.faces[i].materialIndex = 0;
			boxGeometryR3T.faces[i].materialIndex = 0;
			boxGeometryO4Bt.faces[i].materialIndex = 0;
			boxGeometryB5F.faces[i].materialIndex = 0;
			boxGeometryG6Bk.faces[i].materialIndex = 0;
		}
		for (var i = 0; i < 108; i += 2)
		{
			var color;
			if(i < 18){
				color = 0xFF2000;
				boxGeometryW1R.faces[i].materialIndex = 1;
				boxGeometryW1R.faces[i + 1].materialIndex = 1;
				// debugger
				boxGeometryW1R.faces[i].color.setHex(0xff2000);
				boxGeometryW1R.faces[i + 1].color.setHex(color);

			} else if (i < 36){
				color = 0xFFFfff;
				boxGeometryY2L.faces[i].materialIndex = 0;
				boxGeometryY2L.faces[i + 1].materialIndex = 0;
				boxGeometryY2L.faces[i].color.setHex(color);
				// boxGeometryY2L.faces[i + 1].color.setHex(color);
			} else if (i < 54){
				// color = 0xFFF200;
				// boxGeometryY2L.faces[i].color.setHex(color);
				// boxGeometryY2L.faces[i + 1].color.setHex(color);
			} else if (i < 72){
				// color = 0xFFF200;
				// boxGeometryY2L.faces[i].color.setHex(color);
				// boxGeometryY2L.faces[i + 1].color.setHex(color);
			} else if (i < 90){
				// color = 0xFFF200;
				// boxGeometryY2L.faces[i].color.setHex(color);
				// boxGeometryY2L.faces[i + 1].color.setHex(color);
			} else {
			}
		}

		var cubeMaterial2 = new THREE.MeshBasicMaterial(
		{
			vertexColors: THREE.FaceColors,
			overdraw: 0.5,
			opacity: 1,
			transparent: true
		});


		var light = new THREE.PointLight( 0xfff200, 1, 100 );
		light.position.set( 50, 50, 50 );
		scene.add( light );

// CUBES!---------------------------------------------------------------
		cube0 = new THREE.Mesh(boxGeometryW1R, cubeMaterial);
			// cube1 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube2 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube3 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube4 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube5 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube6 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube7 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube8 = new THREE.Mesh(boxGeometry, cubeMaterial);
			cube9 = new THREE.Mesh(boxGeometryY2L, cubeMaterial);
			// cube10 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube11 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube12 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube13 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube14 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube15 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube16 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube17 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube18 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube19 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube20 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube21 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube22 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube23 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube24 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube25 = new THREE.Mesh(boxGeometry, cubeMaterial);
			// cube26 = new THREE.Mesh(boxGeometry, cubeMaterial);

		cube0.position.x = 0; // (0: -1, -1, -1)
			cube0.position.y = 0;
			cube0.position.z = 0;
			// cube1.position.x = 0; // (1: -1, -1, 0)
			// cube1.position.y = 0;
			// cube1.position.z = 0;
			// cube2.position.x = 0; // (2: -1, -1, 1)
			// cube2.position.y = 0;
			// cube2.position.z = 0;
			// cube3.position.x = 0; // (3: -1, 0, -1)
			// cube3.position.y = 0;
			// cube3.position.z = 0;
			// cube4.position.x = 0; // (4: -1, 0, 0)
			// cube4.position.y = 0;
			// cube4.position.z = 0;
			// cube5.position.x = 0; // (5: -1, 0, 1)
			// cube5.position.y = 0;
			// cube5.position.z = 0;
			// cube6.position.x = 0; // (6: -1, 1, -1)
			// cube6.position.y = 0;
			// cube6.position.z = 0;
			// cube7.position.x = 0; // (7: -1, 1, 0)
			// cube7.position.y = 0;
			// cube7.position.z = 0;
			// cube8.position.x = 0; // (8: -1, 1, 1)
			// cube8.position.y = 0;
			// cube8.position.z = 0;
			cube9.position.x = 0; // (9: 0, -1, -1)
			cube9.position.y = 0;
			cube9.position.z = 0;
			// cube10.position.x = 0; // (10: 0, -1, 0)
			// cube10.position.y = 0;
			// cube10.position.z = 0;
			// cube11.position.x = 0; // (11: 0, -1, 1)
			// cube11.position.y = 0;
			// cube11.position.z = 0;
			// cube12.position.x = 0; // (12: 0, 0, -1)
			// cube12.position.y = 0;
			// cube12.position.z = 0;
			// cube13.position.x = 0; // (13: 0, 0, 0)
			// cube13.position.y = 0;
			// cube13.position.z = 0;
			// cube14.position.x = 0; // (14: 0, 0, 1)
			// cube14.position.y = 0;
			// cube14.position.z = 0;
			// cube15.position.x = 0; // (15: 0, 1, -1)
			// cube15.position.y = 0;
			// cube15.position.z = 0;
			// cube16.position.x = 0; // (16: 0, 1, 0)
			// cube16.position.y = 0;
			// cube16.position.z = 0;
			// cube17.position.x = 0; // (17: 0, 1, 1)
			// cube17.position.y = 0;
			// cube17.position.z = 0;
			// cube18.position.x = 0; // (18: 1, -1, -1)
			// cube18.position.y = 0;
			// cube18.position.z = 0;
			// cube19.position.x = 0; // (19: 1, -1, 0)
			// cube19.position.y = 0;
			// cube19.position.z = 0;
			// cube20.position.x = 0; // (20: 1, -1, 1)
			// cube20.position.y = 0;
			// cube20.position.z = 0;
			// cube21.position.x = 0; // (21: 1, 0, -1)
			// cube21.position.y = 0;
			// cube21.position.z = 0;
			// cube22.position.x = 0; // (22: 1, 0, 0)
			// cube22.position.y = 0;
			// cube22.position.z = 0;
			// cube23.position.x = 0; // (23: 1, 0, 1)
			// cube23.position.y = 0;
			// cube23.position.z = 0;
			// cube24.position.x = 0; // (24: 1, 1, -1)
			// cube24.position.y = 0;
			// cube24.position.z = 0;
			// cube25.position.x = 0; // (25: 1, 1, 0)
			// cube25.position.y = 0;
			// cube25.position.z = 0;
			// cube26.position.x = 0; // (26: 1, 1, 1)
			// cube26.position.y = 0;
			// cube26.position.z = 0;

		scene.add(cube0)
			// scene.add(cube1)
			// scene.add(cube2)
			// scene.add(cube3)
			// scene.add(cube4)
			// scene.add(cube5)
			// scene.add(cube6)
			// scene.add(cube7)
			// scene.add(cube8)
			scene.add(cube9)
			// scene.add(cube10)
			// scene.add(cube11)
			// scene.add(cube12)
			// scene.add(cube13)
			// scene.add(cube14)
			// scene.add(cube15)
			// scene.add(cube16)
			// scene.add(cube17)
			// scene.add(cube18)
			// scene.add(cube19)
			// scene.add(cube20)
			// scene.add(cube21)
			// scene.add(cube22)
			// scene.add(cube23)
			// scene.add(cube24)
			// scene.add(cube25)
			// scene.add(cube26)

console.log('cube0',cube0);
	// CUBES!---------------------------------------------------------------

	// Plane (shadow)
				// var planeGeometry = new THREE.PlaneGeometry(200, 200);
				// planeGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
		    //
				// var planeMaterial = new THREE.MeshBasicMaterial(
				// {
				// 	color: 0xe0e0e0,
				// 	overdraw: 0.5
				// });
		    //
				// plane = new THREE.Mesh(planeGeometry, planeMaterial);
				// scene.add(plane);

		renderer = new THREE.CanvasRenderer();
		renderer.setClearColor(0xfffff); //BACKGROUND COLOR
		renderer.setSize(window.innerWidth, window.innerHeight);

		container.appendChild(renderer.domElement);

		document.addEventListener('mousedown', onDocumentMouseDown, false);

		window.addEventListener('resize', onWindowResize, false);

		animate();
	};

function onWindowResize()
{
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event)
{
	event.preventDefault();

	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);

	mouseDown = true;

	startPoint = {
		x: event.clientX,
		y: event.clientY
	};

	rotateStartPoint = rotateEndPoint = projectOnTrackball(0, 0);
}

function onDocumentMouseMove(event)
{
	deltaX = (event.x - startPoint.x) / 2;
	deltaY = (event.y - startPoint.y) / 2;

	handleRotation();

	startPoint.x = event.x;
	startPoint.y = event.y;

	lastMoveTimestamp = new Date();
}

function onDocumentMouseUp(event)
{
	if (new Date().getTime() - lastMoveTimestamp.getTime() > moveReleaseTimeDelta)
	{
		deltaX = event.x - startPoint.x;
		deltaY = event.y - startPoint.y;
	}

	mouseDown = false;

	document.removeEventListener('mousemove', onDocumentMouseMove, false);
	document.removeEventListener('mouseup', onDocumentMouseUp, false);
}

function projectOnTrackball(touchX, touchY)
{
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

function rotateMatrix(rotateStart, rotateEnd)
{
	axis = new THREE.Vector3()
	quaternion = new THREE.Quaternion();

	var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());

	if (angle)
	{
		axis.crossVectors(rotateStart, rotateEnd).normalize();
		angle *= rotationSpeed;
		quaternion.setFromAxisAngle(axis, angle);
	}
	return quaternion;
}

function clamp(value, min, max)
{
	return Math.min(Math.max(value, min), max);
}

function animate()
{
	requestAnimationFrame(animate);
	render();
}

function render()
{
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

function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiplySelf(object.matrix);        // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.getRotationFromMatrix(object.matrix, object.scale);
};

var handleRotation = function()
{
	rotateEndPoint = projectOnTrackball(deltaX, deltaY);

	var rotateQuaternion = rotateMatrix(rotateStartPoint, rotateEndPoint);
	curQuaternion = cube0.quaternion;
	curQuaternion.multiplyQuaternions(rotateQuaternion, curQuaternion);
	curQuaternion.normalize();
	cube0.setRotationFromQuaternion(curQuaternion);
	// cube9.setRotationFromQuaternion(curQuaternion);
	// rotateAroundWorldAxis(cube9, axis, 2)

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

document.onreadystatechange = function()
{
	if (document.readyState === 'complete')
	{
		Defmech.RotationWithQuaternion.init();
	}
};