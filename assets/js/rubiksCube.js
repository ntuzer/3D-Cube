var RubiksCube = RubiksCube || {};

RubiksCube = (function() {
  "use_strict";

  //*************************************************
  var globalCubeState = cubeData.globalCubeState; //*
  //*************************************************
  var cubes = cubeData.cubes;
  var globalFaceState = cubeData.globalFaceState;
  var xyzState = cubeData.xyzState;
  var edgeMap = cubeData.edgeMap;
  var edgePolarity = cubeData.edgePolarity;
  var edgeToGlobalFace = cubeData.edgeToGlobalFace;
  var movements = cubeData.movements;
  var facements = cubeData.facements;
  var movementPolarity = cubeData.movementPolarity;
  var faceToMovement = cubeData.faceToMovement;
  var globalFaceToCube = cubeData.globalFaceToCube;
  var cubeToFace = cubeData.cubeToFace;
  var cubeMovementToDirection = cubeData.cubeMovementToDirection;
  var centerState = cubeData.centerState;
  var centerMappingByMovement = cubeData.centerMappingByMovement;
  var centerPolarity = cubeData.centerPolarity;
  var movementToCubes = cubeData.movementToCubes;
  var direction = cubeData.direction;

  var container, camera, scene, enderer;
  var mouseDown = false;
  var mouse = new THREE.Vector2();
  var rotateStartPoint = new THREE.Vector3(0, 0, 1);
  var rotateEndPoint = new THREE.Vector3(0, 0, 1);
  var ray = new THREE.Raycaster();
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  var cubeRotationSpeed = 5;
  var lastMoveTimestamp = new Date();
  var moveReleaseTimeDelta = 50;
  var startPoint = {
    x: 0,
    y: 0
  };
  var deltaX = 0;
  var deltaY = 0;

  function setup() {
    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.y = 00;
    camera.position.z = 500;

    scene = new THREE.Scene();
    var color = new THREE.Color(0x95bfcb);
    // var texture = new THREE.TextureLoader().load("assets/images/backdrop.png");
    scene.background = color;

    for (let i = 0; i < 27; i++) {
      scene.add(cubes[i]);
    }

    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor(0xffffff); //BACKGROUND COLOR
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("rubiksCube").appendChild(renderer.domElement);

    document
      .getElementsByTagName("canvas")[0]
      .addEventListener("mousedown", onDocumentMouseDown, false);
    document
      .getElementsByTagName("canvas")[0]
      .addEventListener("contextmenu", handleClickedFace, false);

    window.addEventListener("resize", onWindowResize, false);
    animate();
  }

  function resetCubeData() {
    var newCubeData = new CubeData();

    globalCubeState = newCubeData.globalCubeState;
    cubes = newCubeData.cubes;
    globalFaceState = newCubeData.globalFaceState;
    xyzState = newCubeData.xyzState;
    edgeMap = newCubeData.edgeMap;
    edgePolarity = newCubeData.edgePolarity;
    edgeToGlobalFace = newCubeData.edgeToGlobalFace;
    movements = newCubeData.movements;
    facements = newCubeData.facements;
    movementPolarity = newCubeData.movementPolarity;
    faceToMovement = newCubeData.faceToMovement;
    globalFaceToCube = newCubeData.globalFaceToCube;
    cubeToFace = newCubeData.cubeToFace;
    cubeMovementToDirection = newCubeData.cubeMovementToDirection;
    centerState = newCubeData.centerState;
    centerMappingByMovement = newCubeData.centerMappingByMovement;
    centerPolarity = newCubeData.centerPolarity;
    movementToCubes = newCubeData.movementToCubes;
    direction = newCubeData.direction;
  }

  //local cube rotations:
  function handleClickedFace(event) {
    event.preventDefault(); //prevent contextmenu from popping up.
    //============== Calculate clicked face ==============
    mouse.x =
      ((event.clientX - renderer.domElement.offsetLeft) /
        renderer.domElement.clientWidth) *
        2 -
      1;
    mouse.y =
      -(
        (event.clientY - renderer.domElement.offsetTop) /
        renderer.domElement.clientHeight
      ) *
        2 +
      1;

    var vector = new THREE.Vector3(mouse.x, mouse.y, 0);
    vector.unproject(camera);
    ray.setFromCamera(mouse, camera);
    var intersects = ray.intersectObjects(scene.children);
    //====================================================

    var physicalFace, globalFace, globalCube, moveNum;

    if (intersects.length === 0) return null;

    if (intersects.length > 0) {
      for (var i = 0; i < intersects.length; i++) {
        if (intersects[i].face.materialIndex > 0) {
          physicalFace = intersects[i].faceIndex;
          break;
        }
      }
    }

    var arr = Object.keys(globalFaceState);
    for (i = 0; i < arr.length; i++) {
      if (globalFaceState[arr[i]] === physicalFace) {
        globalFace = arr[i];
        break;
      }
    }

    moveNum = faceToMovement[globalFace];
    globalCube = globalFaceToCube[globalFace];

    if (moveNum === 99) return;
    executeCubeTurn(moveNum);
  }

  function executeCubeTurn(moveNum) {
    rotateMovement(moveNum);
    updateCubeState(movements[moveNum]);
    updateFaceState(facements[moveNum]);
    updateCenterState(moveNum);
  }

  function rotateMovement(movementNumber) {
    if (movementNumber <= 6) {
      rotator(movementNumber, "x");
    } else if (movementNumber <= 12) {
      rotator(movementNumber, "y");
    } else if (movementNumber <= 17) {
      rotator(movementNumber, "z");
    }
  }

  function rotator(movementNumber, ltr) {
    var selectedCubes = movements[movementNumber];
    var keys = Object.keys(selectedCubes);

    for (var i = 0; i < 9; i++) {
      rotateHelper(globalCubeState[keys[i]], keys[i], ltr, movementNumber);
    }
  }

  function rotateHelper(cube, globalCubeNumber, ltr, movementNumber) {
    var pi = direction[movementNumber];
    var xyz = xyzState[cube.uuid];
    var tmpX = xyz.x;
    var tmpY = xyz.y;
    var tmpZ = xyz.z;
    var globalCube = globalCubeState[globalCubeNumber];
    var physicalFace, globalFace, polarity, movementDirection;
    var edge = false;
    var center = false;
    var corner = false;

    polarity = movementPolarity[movementNumber];

    var tester;
    switch (ltr) {
      case "x":
        tester = tmpX;
        break;
      case "y":
        tester = tmpY;
        break;
      case "z":
        tester = tmpZ;
        break;
    }

    // why did I do this?? => to refactor based on cube type??
    // if (centerState[globalCubeNumber]) center = true;
    // if (tester[1] === "z") edge = tester[2] === tester[3];

    //CORNERS
    if (tester === "xp") {
      if (pi < 0) pi *= -1;
      cube.rotateX(pi);
      // }else if (tester === 'xc'){
      // 	cube.rotateX(pi);
    } else if (tester === "xn") {
      if (pi > 0) pi *= -1;
      cube.rotateX(pi);
    } else if (tester === "yp") {
      if (pi < 0) pi *= -1;
      cube.rotateY(pi);
      // }else if (tester === 'yc'){
      // 	cube.rotateY(pi);
    } else if (tester === "yn") {
      if (pi > 0) pi *= -1;
      cube.rotateY(pi);
    } else if (tester === "zp") {
      if (pi < 0) pi *= -1;
      cube.rotateZ(pi);
      // }else if (tester === 'zc'){
      // 	cube.rotateZ(pi);
    } else if (tester === "zn") {
      if (pi > 0) pi *= -1;
      cube.rotateZ(pi);

      //CENTERS
    } else if (tester === "xc") {
      //check polarity of physicalFace against current movement polarity if same do nothing, else pi *= -1
      //based on movement gCube maps to what cube?
      movementDirection =
        cubeMovementToDirection[globalCubeNumber][movementNumber][0];
      if (centerState[globalCubeNumber][movementDirection] !== polarity)
        pi *= -1;
      cube.rotateX(pi);
    } else if (tester === "yc") {
      movementDirection =
        cubeMovementToDirection[globalCubeNumber][movementNumber][0];
      if (centerState[globalCubeNumber][movementDirection] !== polarity)
        pi *= -1;
      cube.rotateY(pi);
    } else if (tester === "zc") {
      movementDirection =
        cubeMovementToDirection[globalCubeNumber][movementNumber][0];
      if (centerState[globalCubeNumber][movementDirection] !== polarity)
        pi *= -1;
      cube.rotateZ(pi);

      //EDGES
    } else if (tester[0] === "x") {
      //movement# & globalCube# look up your globalFace and check your +/- against your physicalFace +/-
      // if same do pi if not pi *= -1
      globalFace = edgeToGlobalFace[movementNumber][globalCubeNumber];
      physicalFace = globalFaceState[globalFace];
      if (polarity !== edgePolarity[physicalFace]) pi *= -1;
      cube.rotateX(pi);
    } else if (tester[0] === "y") {
      globalFace = edgeToGlobalFace[movementNumber][globalCubeNumber];
      physicalFace = globalFaceState[globalFace];
      if (polarity !== edgePolarity[physicalFace]) pi *= -1;
      cube.rotateY(pi);
    } else if (tester[0] === "z") {
      globalFace = edgeToGlobalFace[movementNumber][globalCubeNumber];
      physicalFace = globalFaceState[globalFace];
      if (polarity !== edgePolarity[physicalFace]) pi *= -1;
      cube.rotateZ(pi);
    }

    updateXYZState(cube, ltr, tmpX, tmpY, tmpZ);
  }

  function updateXYZState(cube, ltr, tmpX, tmpY, tmpZ) {
    //will take moveNum
    if (ltr[0] === "x") {
      xyzState[cube.uuid].x = tmpX;
      xyzState[cube.uuid].y = tmpZ;
      xyzState[cube.uuid].z = tmpY;
    } else if (ltr[0] === "y") {
      xyzState[cube.uuid].x = tmpZ;
      xyzState[cube.uuid].y = tmpY;
      xyzState[cube.uuid].z = tmpX;
    } else if (ltr[0] === "z") {
      xyzState[cube.uuid].x = tmpY;
      xyzState[cube.uuid].y = tmpX;
      xyzState[cube.uuid].z = tmpZ;
    }
  }

  function updateCubeState(hsh) {
    var cSD = {};
    var keyz = Object.keys(hsh);

    Object.keys(globalCubeState).forEach(function(ky) {
      cSD[ky] = globalCubeState[ky];
    });

    for (var i = 0; i < keyz.length; i++) {
      cSD[keyz[i]] = globalCubeState[hsh[keyz[i]]];
    }

    globalCubeState = cSD;
  }

  function updateFaceState(hsh) {
    var fSD = {};
    var keyz = Object.keys(hsh);
    Object.keys(globalFaceState).forEach(function(ky) {
      fSD[ky] = globalFaceState[ky];
    });

    for (var i = 0; i < keyz.length; i++) {
      fSD[keyz[i]] = globalFaceState[hsh[keyz[i]]];
    }

    globalFaceState = fSD;
  }

  function updateCenterState(movementNumber) {
    var updatedCenterState = {};
    var cubesToUpdate;
    Object.keys(centerState).forEach(key => {
      updatedCenterState[key] = centerState[key];
    });

    cubesToUpdate = movementToCubes[movementNumber];

    for (var i = 0; i < cubesToUpdate.length; i++) {
      //cube to be updated takes incomingCubeNumber's nsew
      //and assigns it to assigns to itself
      //eg cTBU is cube 11, nCN is determined by looking up

      var cubeToBeUpdated = cubesToUpdate[i];
      var incomingCubeNumber =
        cubeMovementToDirection[cubeToBeUpdated][movementNumber][1];

      var newState = {};
      var currentState = centerState[cubeToBeUpdated];
      var incomingCubesState = centerState[incomingCubeNumber];
      var centerMappings =
        centerMappingByMovement[incomingCubeNumber][movementNumber];
      var cardinalDirections = Object.keys(centerMappings);

      for (var j = 0; j < cardinalDirections.length; j++) {
        var currentCardinalDirection = cardinalDirections[j];
        var incomingCardinalDirection =
          centerMappings[currentCardinalDirection];

        newState[incomingCardinalDirection] =
          centerState[incomingCubeNumber][currentCardinalDirection];
        // debugger;
      }
      // if (cubeToBeUpdated === 11 || cubeToBeUpdated === 11)
      // debugger;
      updatedCenterState[cubeToBeUpdated] = newState;
    }
    // debugger;
    centerState = updatedCenterState;
  }

  //global rotation methods below:
  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onDocumentMouseDown(event) {
    event.preventDefault(); //prevent contextmenu from popping up.

    document
      .getElementsByTagName("canvas")[0]
      .addEventListener("mousemove", onDocumentMouseMove, false);
    document
      .getElementsByTagName("canvas")[0]
      .addEventListener("mouseup", onDocumentMouseUp, false);

    mouseDown = true;

    startPoint = {
      x: event.clientX,
      y: event.clientY
    };

    rotateStartPoint = rotateEndPoint = projectOnTrackball(0, 0);
  }

  function onDocumentMouseMove(event) {
    rotateCube(event.x, event.y);
  }

  function rotateCube(x, y) {
    deltaX = (x - startPoint.x) / 2;
    deltaY = (y - startPoint.y) / 2;

    handleRotation();

    startPoint.x = x;
    startPoint.y = y;

    lastMoveTimestamp = new Date();
  }

  function onDocumentMouseUp(event) {
    if (
      new Date().getTime() - lastMoveTimestamp.getTime() >
      moveReleaseTimeDelta
    ) {
      deltaX = event.x - startPoint.x;
      deltaY = event.y - startPoint.y;
    }
    mouseDown = false;

    document
      .getElementsByTagName("canvas")[0]
      .removeEventListener("mousemove", onDocumentMouseMove, false);
    document
      .getElementsByTagName("canvas")[0]
      .removeEventListener("mouseup", onDocumentMouseUp, false);
  }

  function getWorldPosition(cubo, faces) {
    var norm = new THREE.Matrix3().getNormalMatrix(cubo.matrixWorld);
    var world1 = cubo.geometry.faces[faces[0]].normal
      .clone()
      .applyMatrix3(norm)
      .normalize();
    var world2 = cubo.geometry.faces[faces[1]].normal
      .clone()
      .applyMatrix3(norm)
      .normalize();
    return world1;
  }

  function projectOnTrackball(touchX, touchY) {
    var mouseOnBall = new THREE.Vector3();

    mouseOnBall.set(
      clamp(touchX / windowHalfX, -1, 1),
      clamp(-touchY / windowHalfY, -1, 1),
      0.0
    );

    var length = mouseOnBall.length();

    if (length > 1.0) {
      mouseOnBall.normalize();
    } else {
      mouseOnBall.z = Math.sqrt(1.0 - length * length);
    }

    return mouseOnBall;
  }

  function rotateMatrix(rotateStart, rotateEnd) {
    axis = new THREE.Vector3();
    quaternion = new THREE.Quaternion();

    var angle = Math.acos(
      rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length()
    );
    if (angle) {
      axis.crossVectors(rotateStart, rotateEnd).normalize();
      angle *= cubeRotationSpeed;
      quaternion.setFromAxisAngle(axis, angle);
    }
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
    if (!mouseDown) {
      //for momentum
      var drag = 0.95;
      var minDelta = 0.05;

      if (deltaX < -minDelta || deltaX > minDelta) {
        deltaX *= drag;
      } else {
        deltaX = 0;
      }

      if (deltaY < -minDelta || deltaY > minDelta) {
        deltaY *= drag;
      } else {
        deltaY = 0;
      }

      handleRotation();
    }

    renderer.render(scene, camera);
  }

  function handleRotation() {
    rotateEndPoint = projectOnTrackball(deltaX, deltaY);
    var rotateQuaternion = rotateMatrix(rotateStartPoint, rotateEndPoint);

    cubes.forEach(cube => {
      let cubeQuaternion = cube.quaternion;
      cubeQuaternion.multiplyQuaternions(rotateQuaternion, cubeQuaternion);
      cubeQuaternion.normalize();
      cube.setRotationFromQuaternion(cubeQuaternion);
    });

    rotateEndPoint = rotateStartPoint;
  }

  function manualRotate(direction, x, y) {
    x = x || 0;
    y = y || 0;
    switch (direction) {
      case "up":
        deltaX = 0;
        deltaY = -6.25;
        break;
      case "down":
        deltaX = 0;
        deltaY = 6.25;
        break;
      case "left":
        deltaX = -6.733333333333333;
        deltaY = 0;
        break;
      case "right":
        deltaX = 6.733333333333333;
        deltaY = 0;
        break;
      default:
        deltaX = x;
        deltaY = y;
    }

    handleRotation();
  }

  function setRotationSpeed(num) {
    cubeRotationSpeed = num;
  }

  function scramble() {
    var pattern = generateScramblePattern();
    pattern.forEach(function(moveNum) {
      executeCubeTurn(moveNum);
    });
  }

  function generateScramblePattern() {
    var moveNums = [1, 3, 4, 6, 7, 9, 10, 12, 14, 15, 16, 17];
    var result = [];
    var i = 0;
    while (i < 30) {
      var movement = Math.floor(Math.random() * 12);
      var reverseMove = Math.round(Math.random());

      result.push(moveNums[movement]);
      if (reverseMove) {
        result.push(moveNums[movement]);
        result.push(moveNums[movement]);
      }
      i++;
    }
    return result;
  }

  // PUBLIC INTERFACE
  return {
    init: function() {
      setup();
    },
    setRotationSpeed: function(e) {
      let num = e.srcElement.valueAsNumber;
      num = num || 1;
      if (num > 20) num = 20;

      cubeRotationSpeed = num;
    },
    setCubeSize: function(e) {
      let num = e.srcElement.valueAsNumber;
      num = num || 1;
      if (num > 20) num = 20;

      cubeRotationSpeed = num;
    },
    scramble: function(e) {
      scramble();
    },
    reset: function() {
      for (let i = 0; i < 27; i++) {
        scene.remove(cubes[i]);
      }
      resetCubeData();
      for (let i = 0; i < 27; i++) {
        scene.add(cubes[i]);
      }
      manualRotate("left");
    },
    manual: manualRotate
  };
})();
