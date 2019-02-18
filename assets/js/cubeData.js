var CubeData = function() {
  "use_strict";

  var cubes,
    cubeMaterials,
    boxGeometries,
    faceColorKey,
    globalCubeState,
    globalFaceState,
    faceToMovement,
    globalFaceToCube,
    cubeToFace,
    xyzState,
    movementPolarity,
    edgePolarity,
    edgeToGlobalFace,
    centerMappingByMovement,
    centerState,
    cubeMovementToDirection,
    movementToCubes,
    direction,
    movements,
    facements;

  var transparent = new THREE.MeshLambertMaterial({
    vertexColors: THREE.FaceColors,
    overdraw: 1,
    transparent: true,
    opacity: 0
  });

  cubeMaterials = [transparent];
  for (var i = 0; i < 6; i++) {
    var cmColors = ["white", "yellow", "red", "orange", "blue", "green"];
    for (var j = 0; j < 9; j++) {
      var url =
        "https://raw.githubusercontent.com/ntuzer/3D-Cube/master/assets/images/textures/" +
        cmColors[i] +
        (j + 1) +
        ".gif";
      var texture = new THREE.TextureLoader().load(url);
      var meshMaterial = new THREE.MeshBasicMaterial({ map: texture });
      cubeMaterials.push(meshMaterial);
    }
  }

  // Cube Size
  var size = 200;

  boxGeometries = [];
  for (var i = 0; i < 27; i++) {
    boxGeometries[i] = new THREE.BoxGeometry(size, size, size, 3, 3, 3);
  }

  //SET FACES
  faceColorKey = {
    "1": { "12": 7, "13": 7, "58": 30, "59": 30, "88": 45, "89": 45 },
    "2": { "14": 8, "15": 8, "64": 33, "65": 33 },
    "3": { "16": 9, "17": 9, "70": 36, "71": 36, "102": 52, "103": 52 },
    "4": { "6": 4, "7": 4, "82": 42, "83": 42 },
    "5": { "8": 5, "9": 5 },
    "6": { "10": 6, "11": 6, "96": 49, "97": 49 },
    "7": { "0": 1, "1": 1, "52": 27, "53": 27, "76": 39, "77": 39 },
    "8": { "2": 2, "3": 2, "46": 24, "47": 24 },
    "9": { "4": 3, "5": 3, "40": 21, "41": 21, "90": 46, "91": 46 },
    "10": { "56": 29, "57": 29, "86": 44, "87": 44 },
    "11": { "62": 32, "63": 32 },
    "12": { "68": 35, "69": 35, "104": 53, "105": 53 },
    "13": { "80": 41, "81": 41 },
    "14": {},
    "15": { "98": 50, "99": 50 },
    "16": { "50": 26, "51": 26, "74": 38, "75": 38 },
    "17": { "44": 23, "45": 23 },
    "18": { "38": 20, "39": 20, "92": 47, "93": 47 },
    "19": { "34": 18, "35": 18, "54": 28, "55": 28, "84": 43, "85": 43 },
    "20": { "32": 17, "33": 17, "60": 31, "61": 31 },
    "21": { "30": 16, "31": 16, "66": 34, "67": 34, "106": 54, "107": 54 },
    "22": { "28": 15, "29": 15, "78": 40, "79": 40 },
    "23": { "26": 14, "27": 14 },
    "24": { "24": 13, "25": 13, "100": 51, "101": 51 },
    "25": { "22": 12, "23": 12, "48": 25, "49": 25, "72": 37, "73": 37 },
    "26": { "20": 11, "21": 11, "42": 22, "43": 22 },
    "27": { "18": 10, "19": 10, "36": 19, "37": 19, "94": 48, "95": 48 }
  };

  //Set all faces to transparent
  for (var i = 0; i < 108; i++) {
    for (var j = 0; j < 27; j++) {
      boxGeometries[j].faces[i].materialIndex = 0;
    }
  }

  //Set each face to color
  for (i = 0; i < 27; i++) {
    var keys = Object.keys(faceColorKey[i + 1]);
    for (var j = 0; j < keys.length; j++) {
      boxGeometries[i].faces[keys[j]].materialIndex =
        faceColorKey[i + 1][keys[j]];
    }
  }

  // CUBES!---------------------------------------------------------------
  globalCubeState = {};
  cubes = [];
  for (var i = 0; i < 27; i++) {
    cubes[i] = new THREE.Mesh(boxGeometries[i], cubeMaterials);
    cubes[i].position.x = 0;
    cubes[i].position.y = 0;
    cubes[i].position.z = 0;
    globalCubeState[i + 1] = cubes[i];
  }

  globalFaceState = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15,
    16: 16,
    17: 17,
    18: 18,
    19: 19,
    20: 20,
    21: 21,
    22: 22,
    23: 23,
    24: 24,
    25: 25,
    26: 26,
    27: 27,
    28: 28,
    29: 29,
    30: 30,
    31: 31,
    32: 32,
    33: 33,
    34: 34,
    35: 35,
    36: 36,
    37: 37,
    38: 38,
    39: 39,
    40: 40,
    41: 41,
    42: 42,
    43: 43,
    44: 44,
    45: 45,
    46: 46,
    47: 47,
    48: 48,
    49: 49,
    50: 50,
    51: 51,
    52: 52,
    53: 53,
    54: 54,
    55: 55,
    56: 56,
    57: 57,
    58: 58,
    59: 59,
    60: 60,
    61: 61,
    62: 62,
    63: 63,
    64: 64,
    65: 65,
    66: 66,
    67: 67,
    68: 68,
    69: 69,
    70: 70,
    71: 71,
    72: 72,
    73: 73,
    74: 74,
    75: 75,
    76: 76,
    77: 77,
    78: 78,
    79: 79,
    80: 80,
    81: 81,
    82: 82,
    83: 83,
    84: 84,
    85: 85,
    86: 86,
    87: 87,
    88: 88,
    89: 89,
    90: 90,
    91: 91,
    92: 92,
    93: 93,
    94: 94,
    95: 95,
    96: 96,
    97: 97,
    98: 98,
    99: 99,
    100: 100,
    101: 101,
    102: 102,
    103: 103,
    104: 104,
    105: 105,
    106: 106,
    107: 107
  };

  faceToMovement = {
    0: 14,
    1: 14,
    2: 16,
    3: 16,
    4: 12,
    5: 12,
    6: 9,
    7: 9,
    8: 99,
    9: 99,
    10: 10,
    11: 10,
    12: 7,
    13: 7,
    14: 15,
    15: 15,
    16: 17,
    17: 17,

    18: 17,
    19: 17,
    20: 15,
    21: 15,
    22: 12,
    23: 12,
    24: 9,
    25: 9,
    26: 99,
    27: 99,
    28: 10,
    29: 10,
    30: 7,
    31: 7,
    32: 16,
    33: 16,
    34: 14,
    35: 14,

    36: 6,
    37: 6,
    38: 3,
    39: 3,
    40: 17,
    41: 17,
    42: 16,
    43: 16,
    44: 99,
    45: 99,
    46: 15,
    47: 15,
    48: 14,
    49: 14,
    50: 4,
    51: 4,
    52: 1,
    53: 1,

    54: 6,
    55: 6,
    56: 3,
    57: 3,
    58: 14,
    59: 14,
    60: 15,
    61: 15,
    62: 99,
    63: 99,
    64: 16,
    65: 16,
    66: 17,
    67: 17,
    68: 4,
    69: 4,
    70: 1,
    71: 1,

    72: 6,
    73: 6,
    74: 3,
    75: 3,
    76: 12,
    77: 12,
    78: 9,
    79: 9,
    80: 99,
    81: 99,
    82: 10,
    83: 10,
    84: 7,
    85: 7,
    86: 4,
    87: 4,
    88: 1,
    89: 1,

    90: 1,
    91: 1,
    92: 4,
    93: 4,
    94: 12,
    95: 12,
    96: 9,
    97: 9,
    98: 99,
    99: 99,
    100: 10,
    101: 10,
    102: 7,
    103: 7,
    104: 3,
    105: 3,
    106: 6,
    107: 6
  };

  globalFaceToCube = {
    0: 7,
    1: 7,
    2: 8,
    3: 8,
    4: 9,
    5: 9,
    6: 4,
    7: 4,
    8: 5,
    9: 5,
    10: 6,
    11: 6,
    12: 1,
    13: 1,
    14: 2,
    15: 2,
    16: 3,
    17: 3,
    18: 27,
    19: 27,
    20: 26,
    21: 26,
    22: 25,
    23: 25,
    24: 24,
    25: 24,
    26: 23,
    27: 23,
    28: 22,
    29: 22,
    30: 21,
    31: 21,
    32: 20,
    33: 20,
    34: 19,
    35: 19,
    36: 27,
    37: 27,
    38: 18,
    39: 18,
    40: 9,
    41: 9,
    42: 26,
    43: 26,
    44: 17,
    45: 17,
    46: 8,
    47: 8,
    48: 25,
    49: 25,
    50: 16,
    51: 16,
    52: 7,
    53: 7,
    54: 19,
    55: 19,
    56: 10,
    57: 10,
    58: 1,
    59: 1,
    60: 20,
    61: 20,
    62: 11,
    63: 11,
    64: 2,
    65: 2,
    66: 21,
    67: 21,
    68: 12,
    69: 12,
    70: 3,
    71: 3,
    72: 25,
    73: 25,
    74: 16,
    75: 16,
    76: 7,
    77: 7,
    78: 22,
    79: 22,
    80: 13,
    81: 13,
    82: 4,
    83: 4,
    84: 19,
    85: 19,
    86: 10,
    87: 10,
    88: 1,
    89: 1,
    90: 9,
    91: 9,
    92: 18,
    93: 18,
    94: 27,
    95: 27,
    96: 6,
    97: 6,
    98: 15,
    99: 15,
    100: 24,
    101: 24,
    102: 3,
    103: 3,
    104: 12,
    105: 12,
    106: 21,
    107: 21
  };

  cubeToFace = {
    1: [12, 13, 88, 89, 58, 59],
    2: [14, 15, 64, 65],
    3: [16, 17, 70, 71, 102, 103],
    4: [6, 7, 82, 83],
    5: [8, 9],
    6: [10, 11, 96, 97],
    7: [0, 1, 76, 77, 52, 53],
    8: [2, 3, 46, 47],
    9: [4, 5, 40, 41, 90, 91],
    10: [86, 87, 56, 57],
    11: [62, 63],
    12: [68, 69, 104, 105],
    13: [80, 81],
    14: [],
    15: [98, 99],
    16: [74, 75, 50, 51],
    17: [44, 45],
    18: [38, 39, 92, 93],
    19: [34, 35, 54, 55, 84, 85],
    20: [32, 33, 60, 61],
    21: [30, 31, 66, 67, 106, 107],
    22: [28, 29, 78, 79],
    23: [26, 27],
    24: [24, 25, 100, 101],
    25: [22, 23, 48, 49, 72, 73],
    26: [20, 21, 42, 43],
    27: [18, 19, 36, 37, 94, 95]
  };

  xyzState = {};
  (function() {
    xyzState[globalCubeState[1].uuid] = { x: "xp", y: "yn", z: "zp" };
    xyzState[globalCubeState[2].uuid] = { x: "xp", y: "yn", z: "zzpz" }; //edge
    xyzState[globalCubeState[3].uuid] = { x: "xp", y: "yn", z: "zn" };
    xyzState[globalCubeState[4].uuid] = { x: "xp", y: "yzpp", z: "zp" }; //edge
    xyzState[globalCubeState[5].uuid] = { x: "xc", y: "yc", z: "zc" }; //center
    xyzState[globalCubeState[6].uuid] = { x: "xp", y: "yzpn", z: "zn" }; //edge
    xyzState[globalCubeState[7].uuid] = { x: "xp", y: "yp", z: "zp" };
    xyzState[globalCubeState[8].uuid] = { x: "xp", y: "yp", z: "zzpp" }; //edge
    xyzState[globalCubeState[9].uuid] = { x: "xp", y: "yp", z: "zn" };
    xyzState[globalCubeState[10].uuid] = { x: "xznp", y: "yn", z: "zp" }; //edge
    xyzState[globalCubeState[11].uuid] = { x: "xc", y: "yc", z: "zc" }; //center
    xyzState[globalCubeState[12].uuid] = { x: "xznn", y: "yn", z: "zn" }; //edge
    xyzState[globalCubeState[13].uuid] = { x: "xc", y: "yc", z: "zc" }; //center
    xyzState[globalCubeState[14].uuid] = { x: "xz", y: "yz", z: "zz" }; //hidden
    xyzState[globalCubeState[15].uuid] = { x: "xc", y: "yc", z: "zc" }; //center
    xyzState[globalCubeState[16].uuid] = { x: "xzpp", y: "yp", z: "zp" }; //edge
    xyzState[globalCubeState[17].uuid] = { x: "xc", y: "yc", z: "zc" }; //center
    xyzState[globalCubeState[18].uuid] = { x: "xzpn", y: "yp", z: "zn" }; //edge
    xyzState[globalCubeState[19].uuid] = { x: "xn", y: "yn", z: "zp" };
    xyzState[globalCubeState[20].uuid] = { x: "xn", y: "yn", z: "zznn" }; //edge
    xyzState[globalCubeState[21].uuid] = { x: "xn", y: "yn", z: "zn" };
    xyzState[globalCubeState[22].uuid] = { x: "xn", y: "yznp", z: "zp" }; //edge
    xyzState[globalCubeState[23].uuid] = { x: "xc", y: "yc", z: "zc" }; //center
    xyzState[globalCubeState[24].uuid] = { x: "xn", y: "yznn", z: "zn" }; //edge
    xyzState[globalCubeState[25].uuid] = { x: "xn", y: "yp", z: "zp" };
    xyzState[globalCubeState[26].uuid] = { x: "xn", y: "yp", z: "zznp" }; //edge
    xyzState[globalCubeState[27].uuid] = { x: "xn", y: "yp", z: "zn" };
  })();

  movementPolarity = {
    1: true,
    3: false,
    4: true,
    6: false,
    7: false,
    9: false,
    10: true,
    12: true,
    14: true,
    15: false,
    16: true,
    17: false
  };

  edgePolarity = {
    2: true,
    3: true,
    6: false,
    7: false,
    10: true,
    11: true,
    14: false,
    15: false,
    20: false,
    21: false,
    24: false,
    25: false,
    28: true,
    29: true,
    32: true,
    33: true,
    38: false,
    39: false,
    42: true,
    43: true,
    46: false,
    47: false,
    50: true,
    51: true,
    56: false,
    57: false,
    60: false,
    61: false,
    64: true,
    65: true,
    68: true,
    69: true,
    74: false,
    75: false,
    78: false,
    79: false,
    82: true,
    83: true,
    86: true,
    87: true,
    92: true,
    93: true,
    96: false,
    97: false,
    100: true,
    101: true,
    104: false,
    105: false
  };

  edgeToGlobalFace = {
    3: { 10: 56, 12: 104, 16: 74, 18: 38 },
    4: { 10: 86, 12: 68, 16: 50, 18: 92 },
    9: { 4: 6, 6: 96, 22: 78, 24: 24 },
    10: { 4: 82, 6: 10, 22: 28, 24: 100 },
    15: { 2: 14, 8: 46, 20: 60, 26: 20 },
    16: { 2: 64, 8: 2, 20: 32, 26: 42 }
  };

  centerMappingByMovement = {
    //for any given cubeNumber and any given direction, for that mapping the
    //key is incomingCube's cardinal direction and the
    //value is the cube being updated's new cardinal direction ??

    5: {
      // 5 N GOES TO 11 N || 5N GOES TO 17S
      1: { N: "W", S: "E", E: "N", W: "S", X: "X" },
      15: { N: "N", S: "S", E: "E", W: "W", X: "X" },
      9: { N: "N", S: "S", E: "E", W: "W", X: "X" },
      10: { N: "N", S: "S", E: "E", W: "W", X: "X" },
      16: { N: "S", S: "N", E: "W", W: "E", X: "X" }
    },
    11: {
      7: { N: "W", S: "E", E: "N", W: "S", X: "X" },
      16: { N: "N", S: "S", E: "E", W: "W", X: "X" },
      3: { N: "E", S: "W", E: "S", W: "N", X: "X" },
      4: { N: "W", S: "E", E: "N", W: "S", X: "X" },
      15: { N: "S", S: "N", E: "W", W: "E", X: "X" }
    },
    13: {
      14: { N: "W", S: "E", E: "N", W: "S", X: "X" },
      10: { N: "N", S: "S", E: "E", W: "W", X: "X" },
      4: { N: "W", S: "E", E: "N", W: "S", X: "X" },
      3: { N: "W", S: "E", E: "N", W: "S", X: "X" },
      9: { N: "N", S: "S", E: "E", W: "W", X: "X" }
    },
    15: {
      17: { N: "W", S: "E", E: "N", W: "S", X: "X" },
      9: { N: "N", S: "S", E: "E", W: "W", X: "X" },
      3: { N: "E", S: "W", E: "S", W: "N", X: "X" },
      4: { N: "E", S: "W", E: "S", W: "N", X: "X" },
      10: { N: "N", S: "S", E: "E", W: "W", X: "X" }
    },
    17: {
      12: { N: "W", S: "E", E: "N", W: "S", X: "X" },
      15: { N: "S", S: "N", E: "W", W: "E", X: "X" },
      4: { N: "E", S: "W", E: "S", W: "N", X: "X" },
      3: { N: "W", S: "E", E: "N", W: "S", X: "X" },
      16: { N: "N", S: "S", E: "E", W: "W", X: "X" }
    },
    23: {
      6: { N: "W", S: "E", E: "N", W: "S", X: "X" },
      16: { N: "S", S: "N", E: "W", W: "E", X: "X" },
      10: { N: "N", S: "S", E: "E", W: "W", X: "X" },
      9: { N: "N", S: "S", E: "E", W: "W", X: "X" },
      15: { N: "N", S: "S", E: "E", W: "W", X: "X" }
    }
  };

  centerState = {
    5: {
      N: true,
      S: false,
      E: true,
      W: false,
      X: true
    },
    11: {
      N: true,
      S: false,
      E: true,
      W: false,
      X: false
    },
    13: {
      N: false,
      S: true,
      E: true,
      W: false,
      X: true
    },
    15: {
      N: true,
      S: false,
      E: true,
      W: false,
      X: false
    },
    17: {
      N: false,
      S: true,
      E: true,
      W: false,
      X: true
    },
    23: {
      N: false,
      S: true,
      E: true,
      W: false,
      X: false
    }
  };

  cubeMovementToDirection = {
    //Get direction from cube and movement
    // for example cMTD[11][3], for cube 11 and movement 3, ["W", 15] => incoming cube is 15
    5: {
      1: ["X", 5],
      15: ["S", 17],
      9: ["W", 15],
      10: ["E", 13],
      16: ["N", 11]
    },
    11: {
      7: ["X", 11],
      16: ["N", 23],
      4: ["E", 13],
      3: ["W", 15],
      15: ["S", 5]
    },
    13: {
      14: ["X", 13],
      10: ["E", 23],
      4: ["S", 17],
      3: ["N", 11],
      9: ["W", 5]
    },
    15: {
      17: ["X", 15],
      9: ["W", 23],
      3: ["S", 17],
      4: ["N", 11],
      10: ["E", 5]
    },
    17: {
      12: ["X", 17],
      15: ["N", 23],
      4: ["E", 15],
      3: ["W", 13],
      16: ["S", 5]
    },
    23: {
      6: ["X", 23],
      16: ["S", 17],
      10: ["E", 15],
      9: ["W", 13],
      15: ["N", 11]
    }
  };

  movementToCubes = {
    1: [5],
    3: [11, 13, 15, 17],
    4: [11, 13, 15, 17],
    6: [23],
    7: [11],
    9: [5, 13, 15, 23],
    10: [5, 13, 15, 23],
    12: [17],
    14: [13],
    15: [5, 11, 17, 23],
    16: [5, 11, 17, 23],
    17: [15]
  };

  //direction
  var mathPi = Math.PI / 2;
  direction = {
    1: mathPi,
    3: -mathPi,
    4: mathPi,
    6: -mathPi,
    7: -mathPi,
    9: -mathPi,
    10: mathPi,
    12: mathPi,
    14: mathPi,
    15: -mathPi,
    16: mathPi,
    17: -mathPi
  };

  var move1 = { 3: 1, 6: 2, 9: 3, 2: 4, 5: 5, 8: 6, 1: 7, 4: 8, 7: 9 };
  var move3 = {
    10: 12,
    11: 15,
    12: 18,
    13: 11,
    14: 14,
    15: 17,
    16: 10,
    17: 13,
    18: 16
  };
  var move4 = {
    10: 16,
    11: 13,
    12: 10,
    13: 17,
    14: 14,
    15: 11,
    16: 18,
    17: 15,
    18: 12
  };
  var move6 = {
    25: 19,
    22: 20,
    19: 21,
    26: 22,
    23: 23,
    20: 24,
    27: 25,
    24: 26,
    21: 27
  };
  var move7 = {
    19: 1,
    10: 2,
    1: 3,
    20: 10,
    11: 11,
    2: 12,
    21: 19,
    12: 20,
    3: 21
  };
  var move9 = {
    22: 4,
    13: 5,
    4: 6,
    23: 13,
    14: 14,
    5: 15,
    24: 22,
    15: 23,
    6: 24
  };
  var move10 = {
    6: 4,
    15: 5,
    24: 6,
    5: 13,
    14: 14,
    23: 15,
    4: 22,
    13: 23,
    22: 24
  };
  var move12 = {
    9: 7,
    18: 8,
    27: 9,
    8: 16,
    17: 17,
    26: 18,
    7: 25,
    16: 26,
    25: 27
  };
  var move14 = {
    7: 1,
    16: 4,
    25: 7,
    4: 10,
    13: 13,
    22: 16,
    1: 19,
    10: 22,
    19: 25
  };
  var move15 = {
    20: 2,
    11: 5,
    2: 8,
    23: 11,
    14: 14,
    5: 17,
    26: 20,
    17: 23,
    8: 26
  };
  var move16 = {
    8: 2,
    17: 5,
    26: 8,
    5: 11,
    14: 14,
    23: 17,
    2: 20,
    11: 23,
    20: 26
  };
  var move17 = {
    21: 3,
    12: 6,
    3: 9,
    24: 12,
    15: 15,
    6: 18,
    27: 21,
    18: 24,
    9: 27
  };

  movements = {
    1: move1,
    3: move3,
    4: move4,
    6: move6,
    7: move7,
    9: move9,
    10: move10,
    12: move12,
    14: move14,
    15: move15,
    16: move16,
    17: move17
  };

  //faceMap
  //THEORY global face at KEY BECOMES physical face that is stored at global VALUE location
  var face1 = {
    40: 103,
    41: 102,
    46: 97,
    47: 96,
    52: 91,
    53: 90,
    76: 40,
    77: 41,
    82: 46,
    83: 47,
    88: 52,
    89: 53,
    58: 76,
    59: 77,
    64: 82,
    65: 83,
    70: 88,
    71: 89,
    103: 58,
    102: 59,
    97: 64,
    96: 65,
    91: 70,
    90: 71,
    0: 4,
    1: 5,
    2: 10,
    3: 11,
    4: 16,
    5: 17,
    6: 2,
    7: 3,
    8: 8,
    9: 9,
    10: 14,
    11: 15,
    12: 0,
    13: 1,
    14: 6,
    15: 7,
    16: 12,
    17: 13
  };
  var face3 = {
    38: 74,
    39: 75,
    44: 80,
    45: 81,
    50: 86,
    51: 87,
    74: 56,
    75: 57,
    80: 62,
    81: 63,
    86: 68,
    87: 69,
    56: 105,
    57: 104,
    62: 99,
    63: 98,
    68: 93,
    69: 92,
    105: 38,
    104: 39,
    99: 44,
    98: 45,
    93: 50,
    92: 51
  };
  var face4 = {
    38: 105,
    39: 104,
    44: 99,
    45: 98,
    50: 93,
    51: 92,
    74: 38,
    75: 39,
    80: 44,
    81: 45,
    86: 50,
    87: 51,
    56: 74,
    57: 75,
    62: 80,
    63: 81,
    68: 86,
    69: 87,
    105: 56,
    104: 57,
    99: 62,
    98: 63,
    93: 68,
    92: 69
  };
  var face6 = {
    36: 72,
    37: 73,
    42: 78,
    43: 79,
    48: 84,
    49: 85,
    72: 54,
    73: 55,
    78: 60,
    79: 61,
    84: 66,
    85: 67,
    54: 107,
    55: 106,
    60: 101,
    61: 100,
    66: 95,
    67: 94,
    107: 36,
    106: 37,
    101: 42,
    100: 43,
    95: 48,
    94: 49,
    18: 22,
    19: 23,
    20: 28,
    21: 29,
    22: 34,
    23: 35,
    24: 20,
    25: 21,
    26: 26,
    27: 27,
    28: 32,
    29: 33,
    30: 18,
    31: 19,
    32: 24,
    33: 25,
    34: 30,
    35: 31
  };
  var face7 = {
    12: 102,
    13: 103,
    14: 104,
    15: 105,
    16: 106,
    17: 107,
    102: 30,
    103: 31,
    104: 32,
    105: 33,
    106: 34,
    107: 35,
    30: 84,
    31: 85,
    32: 86,
    33: 87,
    34: 88,
    35: 89,
    84: 12,
    85: 13,
    86: 14,
    87: 15,
    88: 16,
    89: 17,
    54: 58,
    55: 59,
    56: 64,
    57: 65,
    58: 70,
    59: 71,
    60: 56,
    61: 57,
    62: 63,
    63: 62,
    64: 68,
    65: 69,
    66: 54,
    67: 55,
    68: 60,
    69: 61,
    70: 66,
    71: 67
  };
  var face9 = {
    6: 96,
    7: 97,
    8: 98,
    9: 99,
    10: 100,
    11: 101,
    96: 24,
    97: 25,
    98: 26,
    99: 27,
    100: 28,
    101: 29,
    24: 78,
    25: 79,
    26: 80,
    27: 81,
    28: 82,
    29: 83,
    78: 6,
    79: 7,
    80: 8,
    81: 9,
    82: 10,
    83: 11
  };
  var face10 = {
    6: 78,
    7: 79,
    8: 80,
    9: 81,
    10: 82,
    11: 83,
    96: 6,
    97: 7,
    98: 8,
    99: 9,
    100: 10,
    101: 11,
    24: 96,
    25: 97,
    26: 98,
    27: 99,
    28: 100,
    29: 101,
    78: 24,
    79: 25,
    80: 26,
    81: 27,
    82: 28,
    83: 29
  };
  var face12 = {
    0: 72,
    1: 73,
    2: 74,
    3: 75,
    4: 76,
    5: 77,
    72: 18,
    73: 19,
    74: 20,
    75: 21,
    76: 22,
    77: 23,
    18: 90,
    19: 91,
    20: 92,
    21: 93,
    22: 94,
    23: 95,
    90: 0,
    91: 1,
    92: 2,
    93: 3,
    94: 4,
    95: 5,
    36: 40,
    37: 41,
    38: 46,
    39: 47,
    40: 52,
    41: 53,
    42: 38,
    43: 39,
    44: 44,
    45: 45,
    46: 50,
    47: 51,
    48: 36,
    49: 37,
    50: 42,
    51: 43,
    52: 48,
    53: 49
  };
  var face14 = {
    0: 59,
    1: 58,
    6: 57,
    7: 56,
    12: 55,
    13: 54,
    59: 35,
    58: 34,
    57: 29,
    56: 28,
    55: 23,
    54: 22,
    35: 48,
    34: 49,
    29: 50,
    28: 51,
    23: 52,
    22: 53,
    48: 0,
    49: 1,
    50: 6,
    51: 7,
    52: 12,
    53: 13,
    72: 76,
    73: 77,
    74: 82,
    75: 83,
    76: 88,
    77: 89,
    78: 74,
    79: 75,
    80: 80,
    81: 81,
    82: 86,
    83: 87,
    84: 72,
    85: 73,
    86: 78,
    87: 79,
    88: 84,
    89: 85
  };
  var face15 = {
    2: 42,
    3: 43,
    8: 44,
    9: 45,
    14: 46,
    15: 47,
    42: 33,
    43: 32,
    44: 27,
    45: 26,
    46: 21,
    47: 20,
    33: 65,
    32: 64,
    27: 63,
    26: 62,
    21: 61,
    20: 60,
    65: 2,
    64: 3,
    63: 8,
    62: 9,
    61: 14,
    60: 15
  };
  var face16 = {
    2: 65,
    3: 64,
    8: 63,
    9: 62,
    14: 61,
    15: 60,
    42: 2,
    43: 3,
    44: 8,
    45: 9,
    46: 14,
    47: 15,
    33: 42,
    32: 43,
    27: 44,
    26: 45,
    21: 46,
    20: 47,
    65: 33,
    64: 32,
    63: 27,
    62: 26,
    61: 21,
    60: 20
  };
  var face17 = {
    4: 36,
    5: 37,
    10: 38,
    11: 39,
    16: 40,
    17: 41,
    36: 31,
    37: 30,
    38: 25,
    39: 24,
    40: 19,
    41: 18,
    31: 71,
    30: 70,
    25: 69,
    24: 68,
    19: 67,
    18: 66,
    71: 4,
    70: 5,
    69: 10,
    68: 11,
    67: 16,
    66: 17,
    90: 94,
    91: 95,
    92: 100,
    93: 101,
    94: 106,
    95: 107,
    96: 92,
    97: 93,
    98: 98,
    99: 99,
    100: 104,
    101: 105,
    102: 90,
    103: 91,
    104: 96,
    105: 97,
    106: 102,
    107: 103
  };
  facements = {
    1: face1,
    3: face3,
    4: face4,
    6: face6,
    7: face7,
    9: face9,
    10: face10,
    12: face12,
    14: face14,
    15: face15,
    16: face16,
    17: face17
  };

  return {
    cubes: cubes,
    cubeMaterials: cubeMaterials,
    boxGeometries: boxGeometries,
    faceColorKey: faceColorKey,
    globalCubeState: globalCubeState,
    globalFaceState: globalFaceState,
    faceToMovement: faceToMovement,
    globalFaceToCube: globalFaceToCube,
    cubeToFace: cubeToFace,
    xyzState: xyzState,
    movementPolarity: movementPolarity,
    edgePolarity: edgePolarity,
    edgeToGlobalFace: edgeToGlobalFace,
    centerMappingByMovement: centerMappingByMovement,
    centerState: centerState,
    cubeMovementToDirection: cubeMovementToDirection,
    movementToCubes: movementToCubes,
    direction: direction,
    movements: movements,
    facements: facements
  };
};

var cubeData = new CubeData();
