document.onreadystatechange = function() {
  if (document.readyState === "complete") {
    RubiksCube.init();
    RubiksCube.manual(null, -14, -8);
    RubiksCube.manual(null, -98, 5);
  }
};
