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

var toggleInstructions = function(e) {
  e.stopPropagation();
  var modal = document.getElementById("instructions");
  var instructionsContainer = document.getElementById("instructionsContainer");
  var instructionsHeader = document.getElementById("instructionsHeader");
  var closing = modal.className === "slideControlsOpen" ? true : false;
  var icon = document.getElementById("instruction-icon");

  if (closing) {
    modal.className = "slideControlsClosed";
    instructionsContainer.className = "sideHeader";
    instructionsHeader.innerText = "Instructions";
    instructionsContainer.style =
      "border-top-left-radius: 5px;border-top-right-radius: 5px";
    instructionsHeader.style =
      "border-top-left-radius: 5px;border-top-right-radius: 5px";

    icon.name = "open";
    icon.className = "open hydrated";
    icon.style = "transform: rotate(-90deg);";
  } else {
    modal.className = "slideControlsOpen";
    instructionsContainer.className = "instructions-container";
    instructionsHeader.innerText = "How To Play:";
    instructionsHeader.style =
      "border-top-left-radius: 0px;border-top-right-radius: 5px;";

    icon.name = "ios-close";
    icon.className = "close hydrated";
  }
};
