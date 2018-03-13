/*
Code for cube rotation was based on and heavily altered from defmech's work
on object rotation with quaternion angles.
https://github.com/defmech/Three.js-Object-Rotation-with-Quaternion

Also referenced but did not use stemkoski's tutorial on three.js 'Mouse Click'
https://github.com/stemkoski/three.js
http://stemkoski.github.io/Three.js/Mouse-Click.html
*/


// Namespace
var RubiksCube = RubiksCube || {};

RubiksCube.RotationWithQuaternion = (function() {
	'use_strict';

//*******************
	var cubeState;  //*
//*******************


	var faceState;
	var movements, facements;
	var face1, face3, face4, face6, face7, face9, face10, face12, face14, face15, face16, face17;
	var faceToMovement, faceToCube, cubeToFace;
	var direction;
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
	var move1, move3, move4, move6, move7, move9, move10, move12, move14, move15, move16, move17;
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

		// facesSTATE = {1:[12, 13, 88, 89, 58, 59],
		// 						  2:[14, 15, 64, 65],
		// 						  3:[16, 17, 70, 71, 102, 103],
		// 						  4:[6, 7, 82, 83],
		// 						  5:[8, 9],
		// 						  6:[10, 11, 96, 97],
		// 						  7:[0, 1, 76, 77, 52, 53],
		// 						  8:[2, 3, 46, 47],
		// 						  9:[4, 5, 40, 41, 90, 91],
		// 						  10:[86, 87, 56, 57],
		// 						  11:[62, 63],
		// 						  12:[68, 69, 104, 105],
		// 						  13:[80, 81],
		// 						  14:[],
		// 						  15:[98, 99],
		// 						  16:[74, 75, 50, 51],
		// 						  17:[44, 45],
		// 						  18:[38, 39, 92, 93],
		// 						  19:[34, 35, 54, 55, 84, 85],
		// 						  20:[32, 33, 60, 61],
		// 						  21:[30, 31, 66, 67, 106, 107],
		// 						  22:[28, 29, 78, 79],
		// 						  23:[26, 27],
		// 						  24:[24, 25, 100, 101],
		// 						  25:[22, 23, 48, 49, 72, 73],
		// 						  26:[20, 21, 42, 43],
		// 						  27:[18, 19, 36, 37, 94, 95]
		// 						};


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
			opacity: 0
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

			// cube1.id = 1;
			// console.log(cube1);
			// cube2.id = 2;
			// cube3.id = 3;
			// cube4.id = 4;
			// cube5.id = 5;
			// cube6.id = 6;
			// cube7.id = 7;
			// cube8.id = 8;
			// cube9.id = 9;
			// cube10.id = 10;
			// cube11.id = 11;
			// cube12.id = 12;
			// cube13.id = 13;
			// cube14.id = 14;
			// cube15.id = 15;
			// cube16.id = 16;
			// cube17.id = 17;
			// cube18.id = 18;
			// cube19.id = 19;
			// cube20.id = 20;
			// cube21.id = 21;
			// cube22.id = 22;
			// cube23.id = 23;
			// cube24.id = 24;
			// cube25.id = 25;
			// cube26.id = 26;
			// cube27.id = 27;





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


		cubeState = {
			1: cube1, 2: cube2,
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

		faceState = {
			0:0,
			1:1,
			2:2,
			3:3,
			4:4,
			5:5,
			6:6,
			7:7,
			8:8,
			9:9,
			10:10,
			11:11,
			12:12,
			13:13,
			14:14,
			15:15,
			16:16,
			17:17,
			18:18,
			19:19,
			20:20,
			21:21,
			22:22,
			23:23,
			24:24,
			25:25,
			26:26,
			27:27,
			28:28,
			29:29,
			30:30,
			31:31,
			32:32,
			33:33,
			34:34,
			35:35,
			36:36,
			37:37,
			38:38,
			39:39,
			40:40,
			41:41,
			42:42,
			43:43,
			44:44,
			45:45,
			46:46,
			47:47,
			48:48,
			49:49,
			50:50,
			51:51,
			52:52,
			53:53,
			54:54,
			55:55,
			56:56,
			57:57,
			58:58,
			59:59,
			60:60,
			61:61,
			62:62,
			63:63,
			64:64,
			65:65,
			66:66,
			67:67,
			68:68,
			69:69,
			70:70,
			71:71,
			72:72,
			73:73,
			74:74,
			75:75,
			76:76,
			77:77,
			78:78,
			79:79,
			80:80,
			81:81,
			82:82,
			83:83,
			84:84,
			85:85,
			86:86,
			87:87,
			88:88,
			89:89,
			90:90,
			91:91,
			92:92,
			93:93,
			94:94,
			95:95,
			96:96,
			97:97,
			98:98,
			99:99,
			100:100,
			101:101,
			102:102,
			103:103,
			104:104,
			105:105,
			106:106,
			107:107,
		}

		faceToMovement = {
		  0:14, 1:14, 2:16,
		  3:16, 4:12, 5:12,
		  6:9, 7:9, 8:99,
		  9:99, 10:10, 11:10,
		  12:7, 13:7, 14:15,
		  15:15, 16:17, 17:17,
		  18:17, 19:17, 20:15,
		  21:15, 22:12, 23:12,
		  24:9, 25:9, 26:99,
		  27:99, 28:10, 29:10,
		  30:7, 31:7, 32:16,
			33:16, 34:14, 35:14,
		  36:6, 37:6, 38:3,
		  39:3, 40:17, 41:17,
		  42:16, 43:16, 44:99,
		  45:99, 46:15, 47:15,
		  48:14, 49:14, 50:4,
		  51:4, 52:1, 53:1,
		  54:6, 55:6, 56:3,
		  57:3, 58:14, 59:14,
		  60:15, 61:15, 62:99,
			63:99, 64:16, 65:16,
		  66:17, 67:17, 68:4,
		  69:4,
		  70:1,
		  71:1,
		  72:6,
		  73:6,
		  74:3,
		  75:3,
		  76:12,
		  77:12,
		  78:9,
		  79:9,
		  80:99,
		  81:99,
		  82:10,
		  83:10,
		  84:7,
		  85:7,
		  86:4,
		  87:4,
		  88:1,
		  89:1,
		  90:1,
		  91:1,
		  92:4,
		  93:4,
		  94:12,
		  95:12,
		  96:9,
		  97:9,
		  98:99,
		  99:99,
		  100:10,
		  101:10,
		  102:7,
		  103:7,
		  104:3,
		  105:3,
		  106:6,
		  107:6,
		};

		faceToCube = {
			0:7, 1:7, 2:8, 3:8, 4:9, 5:9, 6:4, 7:4, 8:5, 9:5, 10:6, 11:6, 12:1,
			13:1, 14:2, 15:2, 16:3, 17:3, 18:27, 19:27, 20:26, 21:26, 22:25,
			23:25, 24:24, 25:24, 26:23, 27:23, 28:22, 29:22, 30:21, 31:21,
			32:20, 33:20, 34:19, 35:19, 36:27, 37:27, 38:18, 39:18, 40:9,
			41:9, 42:26, 43:26, 44:17, 45:17, 46:8, 47:8, 48:25, 49:25, 50:16,
			51:16, 52:7, 53:7, 54:19, 55:19, 56:10, 57:10, 58:1, 59:1, 60:20,
			61:20, 62:11, 63:11, 64:2, 65:2, 66:21, 67:21, 68:12, 69:12, 70:3,
			71:3, 72:25, 73:25, 74:16, 75:16, 76:7, 77:7, 78:22, 79:22, 80:13,
			81:13, 82:4, 83:4, 84:19, 85:19, 86:10, 87:10, 88:1, 89:1, 90:9,
			91:9, 92:18, 93:18, 94:27, 95:27, 96:6, 97:6, 98:15, 99:15, 100:24,
			101:24, 102:3, 103:3, 104:12, 105:12, 106:21, 107:21
		};

		cubeToFace = {
		  1:[12, 13, 88, 89, 58, 59],
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


		//direction
		var mathPi = Math.PI / 2;
		direction = {1:mathPi, 3:-mathPi, 4:mathPi, 6:-mathPi, 7:-mathPi, 9:-mathPi, 10:mathPi, 12:mathPi, 14:mathPi, 15:-mathPi, 16:mathPi, 17:-mathPi};

			//movements  THEORY is 3 becomes to 1
		//
		// move1    = {  3:1, 6:2, 9:3, 2:4, 5:5, 8:6, 1:7, 4:8, 7:9  };
		// 	move3  = { 10:12, 11:15, 12:18, 13:11, 14:14, 15:17, 16:10, 17:13, 18:16 };
		// 	move4  = { 10:16, 11:13, 12:10, 13:17, 14:14, 15:11, 16:18, 17:15, 18:12 };
		// 	move6  = { 25:19, 22:20, 19:21, 26:22, 23:23, 20:24, 27:25, 24:26, 21:27 };
		// 	move7  = { 19:1, 10:2, 1:3, 20:10, 11:11, 2:12, 21:19, 12:20, 3:21 };
		// 	move9  = { 22:4, 13:5, 4:6, 23:13, 14:14, 5:15, 24:22, 15:23, 6:24 };
		// 	move10 = { 6:4, 15:5, 24:6, 5:13, 14:14, 23:15, 4:22, 13:23, 22:24 };
		// 	move12 = { 9:7, 18:8, 27:9, 8:16, 17:17, 26:18, 7:25, 16:26, 25:27 };
		// 	move14 = { 7:1, 16:4, 25:7, 4:10, 13:13, 22:16, 1:19, 10:22, 19:25 };
		// 	move15 = { 20:2, 11:5, 2:8, 23:11, 14:14, 5:17, 26:20, 17:23, 8:26 };
		// 	move16 = { 8:2, 17:5, 26:8, 5:11, 14:14, 23:17, 2:20, 11:23, 20:26 };
		// 	move17 = { 21:3, 12:6, 3:9, 24:12, 15:15, 6:18, 27:21, 18:24, 9:27 };

		move1    = {  3:1, 6:2, 9:3, 2:4, 5:5, 8:6, 1:7, 4:8, 7:9  };
			move3  = { 10:12, 11:15, 12:18, 13:11, 14:14, 15:17, 16:10, 17:13, 18:16 };
			move4  = { 10:16, 11:13, 12:10, 13:17, 14:14, 15:11, 16:18, 17:15, 18:12 };
			move6  = { 25:19, 22:20, 19:21, 26:22, 23:23, 20:24, 27:25, 24:26, 21:27 };
			move7  = { 19:1, 10:2, 1:3, 20:10, 11:11, 2:12, 21:19, 12:20, 3:21 };
			move9  = { 22:4, 13:5, 4:6, 23:13, 14:14, 5:15, 24:22, 15:23, 6:24 };
			move10 = { 6:4, 15:5, 24:6, 5:13, 14:14, 23:15, 4:22, 13:23, 22:24 };
			move12 = { 9:7, 18:8, 27:9, 8:16, 17:17, 26:18, 7:25, 16:26, 25:27 };
			move14 = { 7:1, 16:4, 25:7, 4:10, 13:13, 22:16, 1:19, 10:22, 19:25 };
			move15 = { 20:2, 11:5, 2:8, 23:11, 14:14, 5:17, 26:20, 17:23, 8:26 };
			move16 = { 8:2, 17:5, 26:8, 5:11, 14:14, 23:17, 2:20, 11:23, 20:26 };
			move17 = { 21:3, 12:6, 3:9, 24:12, 15:15, 6:18, 27:21, 18:24, 9:27 };


		movements = { 1:move1, 3:move3, 4:move4, 6:move6, 7:move7, 9:move9, 10:move10, 12:move12, 14:move14, 15:move15, 16:move16, 17:move17 }

			//faceMap

		face1 = { 40:103, 41:102, 46:97, 47:96, 52:91, 53:90, 76:40,
			77:41, 82:46, 83:47, 88:52, 89:53, 58:76, 59:77, 64:82, 65:83,
			70:88, 71:89, 103:58, 102:59, 97:64, 96:65, 91:70, 90:71, 0:4,
			1:5, 2:10, 3:11, 4:16, 5:17, 6:2, 7:3, 8:8, 9:9, 10:14, 11:15,
			12:0, 13:1, 14:6, 15:7, 16:12, 17:13 };
			face3 = { 38:74, 39:75, 44:80, 45:81, 50:86, 51:87, 74:56,
				75:57, 80:62, 81:63, 86:68, 87:69, 56:105, 57:104, 62:99,
				63:98, 68:93, 69:92, 105:38, 104:39, 99:44, 98:45, 93:50,
				92:51 };
			face4 = { 38:105, 39:104, 44:99, 45:98, 50:93, 51:92, 74:38,
				75:39, 80:44, 81:45, 86:50, 87:51, 56:74, 57:75, 62:80,
				63:81, 68:86, 69:87, 105:56, 104:57, 99:62, 98:63, 93:68,
				92:69 };
			face6 = { 36:72, 37:73, 42:78, 43:79, 48:84, 49:85, 72:54,
				73:55, 78:60, 79:61, 84:66, 85:67, 54:107, 55:106, 60:101,
				61:100, 66:95, 67:94, 107:36, 106:37, 101:42, 100:43,
				95:48, 94:49, 18:22, 19:23, 20:28, 21:29, 22:34, 23:35,
				24:20, 25:21, 26:26, 27:27, 28:32, 29:33, 30:18, 31:19,
				32:24, 33:25, 34:30, 35:31 };
			face7 = { 12:102, 13:103, 14:104, 15:105, 16:106, 17:107,
				102:30, 103:31, 104:32, 105:33, 106:34, 107:35, 30:84,
				31:85, 32:86, 33:87, 34:88, 35:89, 84:12, 85:13, 86:14,
				87:15, 88:16, 89:17, 54:58, 55:59, 56:64, 57:65, 58:70,
				59:71, 60:56, 61:57, 62:63, 63:62, 64:68, 65:69, 66:54,
				67:55, 68:60, 69:61, 70:66, 71:67 };
			face9 = { 6:96, 7:97, 8:98, 9:99, 10:100, 11:101, 96:24,
				97:25, 98:26, 99:27, 100:28, 101:29, 24:78, 25:79, 26:80,
				27:81, 28:82, 29:83, 78:6, 79:7, 80:8, 81:9, 82:10, 83:11 };
			face10 = { 6:78, 7:79, 8:80, 9:81, 10:82, 11:83, 96:6,
				97:7, 98:8, 99:9, 100:10, 101:11, 24:96, 25:97, 26:98,
				27:99, 28:100, 29:101, 78:24, 79:25, 80:26, 81:27,
				82:28, 83:29 };
			face12 = { 0:72, 1:73, 2:74, 3:75, 4:76, 5:77, 72:18, 73:19,
				74:20, 75:21, 76:22, 77:23, 18:90, 19:91, 20:92, 21:93,
				22:94, 23:95, 90:0, 91:1, 92:2, 93:3, 94:4, 95:5, 36:40,
				37:41, 38:46, 39:47, 40:52, 41:53, 42:38, 43:39, 44:44,
				45:45, 46:50, 47:51, 48:36, 49:37, 50:42, 51:43, 52:48,
				53:49 };
			face14 = { 0:59, 1:58, 6:57, 7:56, 12:55, 13:54, 59:35, 58:34,
				57:29, 56:28, 55:23, 54:22, 35:48, 34:49, 29:50, 28:51, 23:52,
				22:53, 48:0, 49:1, 50:6, 51:7, 52:12, 53:13, 72:76, 73:77,
				74:82, 75:83, 76:88, 77:89, 78:74, 79:75, 80:80, 81:81, 82:86,
				83:87, 84:72, 85:73, 86:78, 87:79, 88:84, 89:85 };
			face15 = { 2:42, 3:43, 8:44, 9:45, 14:46, 15:47, 42:33, 43:32,
				44:27, 45:26, 46:21, 47:20, 33:65, 32:64, 27:63, 26:62, 21:61,
				20:60, 65:2, 64:3, 63:8, 62:9, 61:14, 60:15 };
			face16 = { 2:65, 3:64, 8:63, 9:62, 14:61, 15:60, 42:2, 43:3,
				44:8, 45:9, 46:14, 47:15, 33:42, 32:43, 27:44, 26:45, 21:46,
				20:47, 65:33, 64:32, 63:27, 62:26, 61:21, 60:20 };
			face17 = { 4:36, 5:37, 10:38, 11:39, 16:40, 17:41, 36:31, 37:30,
				38:25, 39:24, 40:19, 41:18, 31:71, 30:70, 25:69, 24:68, 19:67,
				18:66, 71:4, 70:5, 69:10, 68:11, 67:16, 66:17, 90:94, 91:95,
				92:100, 93:101, 94:106, 95:107, 96:92, 97:93, 98:98, 99:99,
				100:104, 101:105, 102:90, 103:91, 104:96, 105:97, 106:102, 107:103 };
		facements = { 1:face1, 3:face3, 4:face4, 6:face6, 7:face7, 9:face9, 10:face10, 12:face12, 14:face14, 15:face15, 16:face16, 17:face17 }

		// console.log('initial cubeState');
		// console.log(cubeState[1].id);
		// console.log(cubeState[2].id);
		// console.log(cubeState[3].id);
		// console.log(cubeState[4].id);
		// console.log(cubeState[5].id);
		// console.log(cubeState[6].id);
		// console.log(cubeState[7].id);
		// console.log(cubeState[8].id);
		// console.log(cubeState[9].id);
		// console.log(cubeState[10].id);
		// console.log(cubeState[11].id);
		// console.log(cubeState[12].id);
		// console.log(cubeState[13].id);
		// console.log(cubeState[14].id);
		// console.log(cubeState[15].id);
		// console.log(cubeState[16].id);
		// console.log(cubeState[17].id);
		// console.log(cubeState[18].id);
		// console.log(cubeState[19].id);
		// console.log(cubeState[20].id);
		// console.log(cubeState[21].id);
		// console.log(cubeState[22].id);
		// console.log(cubeState[23].id);
		// console.log(cubeState[24].id);
		// console.log(cubeState[25].id);
		// console.log(cubeState[26].id);
		// console.log(cubeState[27].id);
		// CUBES!---------------------------------------------------------------

		renderer = new THREE.CanvasRenderer();
		renderer.setClearColor(0xfffff); //BACKGROUND COLOR
		renderer.setSize(700, 700);
		document.getElementsByTagName('section')[0].appendChild(renderer.domElement);
		// var canvas = document.getElementsByTagName('canvas')[0];
		document.getElementsByTagName('canvas')[0].addEventListener('mousedown', onDocumentMouseDown, false);
		document.getElementsByTagName('canvas')[0].addEventListener('contextmenu', getFace, false);
		// button.addEventListener('click',() => {
		// 	cube1.rotateZ(Math.PI / 2)
		// 	cube4.rotateZ(Math.PI / 2)
		// 	cube7.rotateZ(Math.PI / 2)
		// 	cube10.rotateZ(Math.PI / 2)
		// 	cube13.rotateZ(Math.PI / 2)
		// 	cube16.rotateZ(Math.PI / 2)
		// 	cube19.rotateZ(Math.PI / 2)
		// 	cube22.rotateZ(Math.PI / 2)
		// 	cube25.rotateZ(Math.PI / 2)
		//
		// });
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
		var physicalFace, globalFace, moveNum;

		// console.log(intersects);
		if ( intersects.length > 0 ) {
			for(var i = 0; i < intersects.length; i++){
				if (intersects[i].face.materialIndex > 0) {
					physicalFace = intersects[i].faceIndex;
					break;
				}
			}
		}

		globalFace = faceState[physicalFace];
		moveNum = faceToMovement[globalFace];


		rotateMovement(moveNum);
		cubeSwapper(movements[moveNum]);
		faceSwapper(facements[moveNum]);
// console.log('cubestate');
// // console.log(cubeState);
// console.log(cubeState[1].id);
// console.log(cubeState[2].id);
// console.log(cubeState[3].id);
// console.log(cubeState[4].id);
// console.log(cubeState[5].id);
// console.log(cubeState[6].id);
// console.log(cubeState[7].id);
// console.log(cubeState[8].id);
// console.log(cubeState[9].id);
// console.log(cubeState[10].id);
// console.log(cubeState[11].id);
// console.log(cubeState[12].id);
// console.log(cubeState[13].id);
// console.log(cubeState[14].id);
// console.log(cubeState[15].id);
// console.log(cubeState[16].id);
// console.log(cubeState[17].id);
// console.log(cubeState[18].id);
// console.log(cubeState[19].id);
// console.log(cubeState[20].id);
// console.log(cubeState[21].id);
// console.log(cubeState[22].id);
// console.log(cubeState[23].id);
// console.log(cubeState[24].id);
// console.log(cubeState[25].id);
// console.log(cubeState[26].id);
// console.log(cubeState[27].id);
}

function rotateMovement(numMove){
	if(numMove <= 6){
		rotateX(numMove);
	}else if (numMove <= 12) {
		rotateY(numMove);
	}else if (numMove <= 17) {
		rotateZ(numMove);
	}
}
function rotateX(numMove){
	var pi = direction[numMove];
	var hsh = movements[numMove];
	var k = Object.keys(hsh);
	// debugger
	cubeState[k[0]].rotateX(pi);
	cubeState[k[1]].rotateX(pi);
	cubeState[k[2]].rotateX(pi);
	cubeState[k[3]].rotateX(pi);
	cubeState[k[4]].rotateX(pi);
	cubeState[k[5]].rotateX(pi);
	cubeState[k[6]].rotateX(pi);
	cubeState[k[7]].rotateX(pi);
	cubeState[k[8]].rotateX(pi);
}

function rotateY(numMove){
	var pi = direction[numMove];
	var hsh = movements[numMove];
	var k = Object.keys(hsh);
	// debugger
	cubeState[k[0]].rotateY(pi);
	cubeState[k[1]].rotateY(pi);
	cubeState[k[2]].rotateY(pi);
	cubeState[k[3]].rotateY(pi);
	cubeState[k[4]].rotateY(pi);
	cubeState[k[5]].rotateY(pi);
	cubeState[k[6]].rotateY(pi);
	cubeState[k[7]].rotateY(pi);
	cubeState[k[8]].rotateY(pi);
}
function rotateZ(numMove){
	var pi = direction[numMove];
	var hsh = movements[numMove];
	var k = Object.keys(hsh);
	cubeState[k[0]].rotateZ(pi);
	cubeState[k[1]].rotateZ(pi);
	cubeState[k[2]].rotateZ(pi);
	cubeState[k[3]].rotateZ(pi);
	cubeState[k[4]].rotateZ(pi);
	cubeState[k[5]].rotateZ(pi);
	cubeState[k[6]].rotateZ(pi);
	cubeState[k[7]].rotateZ(pi);
	cubeState[k[8]].rotateZ(pi);
}


function cubeSwapper(hsh){
	var cSD = {};
	var keyz = Object.keys(hsh);

	Object.keys(cubeState).forEach(function(ky) {
	     cSD[ ky ] = cubeState[ ky ];
	});
	// debugger
	for (var i = 0; i<keyz.length; i++){
		cSD[keyz[i]] = cubeState[hsh[keyz[i]]];
		// v = hsh[v];
	}
	cubeState = cSD;


	// console.log(cubeState[1].id);
	// console.log(cubeState[2].id);
	// console.log(cubeState[3].id);
	// console.log(cubeState[4].id);
	// console.log(cubeState[5].id);
	// console.log(cubeState[6].id);
	// console.log(cubeState[7].id);
	// console.log(cubeState[8].id);
	// console.log(cubeState[9].id);
	// console.log(cubeState[10].id);
	// console.log(cubeState[11].id);
	// console.log(cubeState[12].id);
	// console.log(cubeState[13].id);
	// console.log(cubeState[14].id);
	// console.log(cubeState[15].id);
	// console.log(cubeState[16].id);
	// console.log(cubeState[17].id);
	// console.log(cubeState[18].id);
	// console.log(cubeState[19].id);
	// console.log(cubeState[20].id);
	// console.log(cubeState[21].id);
	// console.log(cubeState[22].id);
	// console.log(cubeState[23].id);
	// console.log(cubeState[24].id);
	// console.log(cubeState[25].id);
	// console.log(cubeState[26].id);
	// console.log(cubeState[27].id);
}



function faceSwapper(hsh){
	var fSD = {};
	var keyz = Object.keys(hsh);

	Object.keys(faceState).forEach(function(ky) {
	     fSD[ ky ] = faceState[ ky ];
	});


	for (var i = 0; i < keyz.length; i++){
		fSD[keyz[i]] = faceState[hsh[keyz[i]]];
		// v = hsh[v];
	}

	faceState = fSD;

}


function getWorldPosition(cubo, faces){
	var norm = new THREE.Matrix3().getNormalMatrix( cubo.matrixWorld );
	var world1 = cubo.geometry.faces[faces[0]].normal.clone().applyMatrix3(norm).normalize();
	var world2 = cubo.geometry.faces[faces[1]].normal.clone().applyMatrix3(norm).normalize();
	// console.log(`${cubo.id}`,world1);
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
