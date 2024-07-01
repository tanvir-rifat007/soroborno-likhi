let clickX = [];
let clickY = [];
let clickDrag = [];
let paint;
const labels = {
  a: "অ",
  b: "আ",
  c: "ই",
  d: "ঈ",
  e: "উ",
  f: "ঊ",
  g: "ঋ",
  h: "এ",
  i: "ঐ",
  j: "ও",
  k: "ঔ",
};
const canvas = document.getElementsByTagName("canvas")[0];
const context = canvas.getContext("2d");
const link = document.getElementById("download-link");

export const resetCanvas = () => {
  clickX = [];
  clickY = [];
  clickDrag = [];
  paint = false;
};

export const displayPrediction = (label) => {
  const prediction = labels[label];
  const predictionParagraph = document.getElementsByClassName("prediction")[0];
  predictionParagraph.textContent = prediction;
  return prediction;
};

const addClick = (x, y, dragging) => {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
};

const redraw = () => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

  context.strokeStyle = "#000000";
  context.lineJoin = "round";
  context.lineWidth = 5;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < clickX.length; i++) {
    context.beginPath();
    if (clickDrag[i] && i) {
      context.moveTo(clickX[i - 1], clickY[i - 1]);
    } else {
      context.moveTo(clickX[i] - 1, clickY[i]);
    }
    context.lineTo(clickX[i], clickY[i]);
    context.closePath();
    context.stroke();
  }
};

const getTouchPos = (canvasDom, touchEvent) => {
  const rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top,
  };
};

const handleMouseDown = (e) => {
  paint = true;
  addClick(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
  redraw();
};

const handleMouseMove = (e) => {
  if (paint) {
    addClick(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, true);
    redraw();
  }
};

const handleMouseUp = () => {
  paint = false;
};

const handleTouchStart = (e) => {
  paint = true;
  const touchPos = getTouchPos(canvas, e);
  addClick(touchPos.x, touchPos.y);
  redraw();
  e.preventDefault();
};

const handleTouchMove = (e) => {
  if (paint) {
    const touchPos = getTouchPos(canvas, e);
    addClick(touchPos.x, touchPos.y, true);
    redraw();
  }
  e.preventDefault();
};

const handleTouchEnd = () => {
  paint = false;
};

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);
canvas.addEventListener("touchend", handleTouchEnd, false);

link.addEventListener(
  "click",
  function () {
    link.href = canvas.toDataURL();
    link.download = "drawing.png";
  },
  false
);

export const clearRect = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

export const getCanvas = () => {
  return canvas;
};
