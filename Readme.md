<h1 align="center">
  3D - Cube
</h1>
<h4 align="center">
  <a href="https://ntuzer.github.io/3D-Cube/"><img src="https://res.cloudinary.com/kapor8heroes/image/upload/v1549481441/test/cube_small.png" alt="RubiksCube" width="200"></a>
  <br>
  <br>
  <a href="https://ntuzer.github.io/3D-Cube/">Live Demo</a> | An online Rubiks Cube built in Three.JS.
</h4>
<br>
<br>

## How To Play

1.  Clone and load the `index.html` file in your browser or visit the [Live Demo](https://ntuzer.github.io/3D-Cube/).
1.  Click and drag on the canvas to spin the cube.
1.  Right-click on any face to rotate in that direction.

<br>

## How It Works

The 3D-Cube is built using the Three.js library. There are 27 cubes rendered on the scene each representing a piece of the Rubik's Cube. The cubes are created with `THREE.BoxGeometry` and `THREE.Mesh`.

```js
boxGeometries = [];
for (var i = 0; i < 27; i++) {
  boxGeometries[i] = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
}
```

```js
cubes = [];
for (var i = 0; i < 27; i++) {
  cubes[i] = new THREE.Mesh(boxGeometries[i], cubeMaterials);
  cubes[i].position.x = 0;
  cubes[i].position.y = 0;
  cubes[i].position.z = 0;
  globalCubeState[i + 1] = cubes[i];
}
```

```js
scene = new THREE.Scene();
for (var i = 0; i < 27; i++) {
  scene.add(cubes[i]);
}
```

<br>

### User Interaction

Three Event Listeners on the page intercept mouse clicks to determine how to interact with the cube. When the user left-clicks on the Three.JS Scene two data points are taken, the `Date().getTime()` of the mouse movement and the `event.x` and `event.y`. The time is used to determine the speed of cube's rotation and the x and y are used to create a `Three.Vector` and `THREE.Quaternion` that determine the cube's direction of rotation.

```js
function onDocumentMouseUp(event) {
  if (
    new Date().getTime() - lastMoveTimestamp.getTime() >
    moveReleaseTimeDelta
  ) {
    deltaX = event.x - startPoint.x;
    deltaY = event.y - startPoint.y;
  }

  ...
}
```

When the user right-clicks the correct cube must be selected. This is accomplished by using `THREE.Raycaster` to get the closest intersected cube to scene's camera. With the correct cube selected, the appropriate movement is determined and the cube's faces get rotated.

```js
function handleClickedFace(event) {
  ...

  var ray = new THREE.Raycaster();
  ray.setFromCamera(mouse, camera);
  var intersects = ray.intersectObjects(scene.children);

  if (intersects.length === 0) return null;

  if (intersects.length > 0) {
    for (var i = 0; i < intersects.length; i++) {
      if (intersects[i].face.materialIndex > 0) {
        physicalFace = intersects[i].faceIndex;
        break;
      }
    }
  }

  ...
}
```

<br>

### Rotation

There are two kinds of rotation:

1.  The rotation of the cube on the canvas.
1.  Rotation of the faces around the cube.

Each cube has a local X, Y, and Z axis and as the faces are turned those axes change and are tracked to make sure that the cubes are rotated correctly after each click event. The direction of the cube's rotation is determined by calculating a quaternion using the mouse's position to create a `Three.Vector` and `THREE.Quaternion`.

```js
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
```

Finally in the `handleRotation` method, `setRotationFromQuaternion` is called on each of the selected cubes to change the position of the cube on the scene.

```js
function handleRotation() {
  rotateEndPoint = projectOnTrackball(deltaX, deltaY);
  var rotateQuaternion = rotateMatrix(rotateStartPoint, rotateEndPoint);

  cubes.forEach(function(cube) {
    var cubeQuaternion = cube.quaternion;
    cubeQuaternion.multiplyQuaternions(rotateQuaternion, cubeQuaternion);
    cubeQuaternion.normalize();
    cube.setRotationFromQuaternion(cubeQuaternion);
  });

  rotateEndPoint = rotateStartPoint;
}
```

<!-- <br> -->

<!-- ### Face Mapping

```js
  var str = "Hello World";
```
<br> -->

## Credits

- Cube rotation was inspired by defmech's work
  on object rotation with quaternion angles.
  [Repo](https://github.com/defmech/Three.js-Object-Rotation-with-Quaternion)

- Referenced stemkoski's tutorial on three.js 'Mouse Click'. [Repo](https://github.com/stemkoski/three.js)

<!-- ## YouTube

See it solved on [YouTube](https://youtu.be/???). -->

## License

MIT. Copyright (c) Rewel Garcia
