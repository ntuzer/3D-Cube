var toggleModal = function(e) {
  e.stopPropagation();
  var modal = document.getElementById("slideControls");
  var icon = document.getElementById("icon");

  if (icon.name === "ios-close") {
    icon.name = "open";
    icon.className = "open hydrated";
  } else {
    icon.name = "ios-close";
    icon.className = "close hydrated";
  }

  modal.className =
    modal.className === "slideControlsOpen"
      ? "slideControlsClosed"
      : "slideControlsOpen";
};
