// import * as tfImage from "@teachablemachine/image";

import {
  clearRect,
  displayPrediction,
  getCanvas,
  resetCanvas,
} from "./utils.js";

let model, labelIdx;

const clearButton = document.getElementById("clear-button");
const predictButton = document.getElementById("check-button");

const URL = "https://teachablemachine.withgoogle.com/models/HOoA-AZ1B/";

clearButton.addEventListener("click", () => {
  resetCanvas();
  const predictionParagraph = document.getElementsByClassName("prediction")[0];
  predictionParagraph.textContent = "";
  clearRect();
});

// let model;
// const modelPath = "./model/model.json";

// const loadModel = async (path) => {
//   if (!model) model = await tf.loadLayersModel(path);
// };

// predictButton.onclick = () => {
//   const canvas = getCanvas();

//   const drawing = canvas.toDataURL();
//   const newImg = document.getElementsByClassName("imageToCheck")[0];
//   newImg.src = drawing;

//   newImg.onload = () => {
//     predict(newImg);
//   };

//   resetCanvas();
// };

// const predict = async (img) => {
//   img.width = 200;
//   img.height = 200;

//   const processedImg = await tf.browser.fromPixelsAsync(img, 4);
//   const resizedImg = tf.image.resizeNearestNeighbor(processedImg, [28, 28]);

//   const updatedImg = tf.cast(resizedImg, "float32");
//   let shape;
//   const predictions = await model
//     .predict(tf.reshape(updatedImg, (shape = [1, 28, 28, 4])))
//     .data();

//   const labelIdx = predictions.indexOf(Math.max(...predictions));
//   const labelText = displayPrediction(labelIdx);

//   console.log(labelText);
//   speakPrediction(labelText);
// };

// loadModel(modelPath);

const loadModel = async () => {
  const loadingContainer = document.getElementById("loading");
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  loadingContainer.innerText = `Loading...`;
  model = await tmImage.load(modelURL, metadataURL);

  loadingContainer.innerText = ``;

  return model;
};

predictButton.onclick = () => {
  const canvas = getCanvas();

  const drawing = canvas.toDataURL();
  const newImg = document.getElementsByClassName("imageToCheck")[0];
  newImg.src = drawing;

  newImg.onload = () => {
    predict(newImg);
  };

  resetCanvas();
};

loadModel().then((model) => {
  console.log("Model loaded successfully!");
  window.model = model;
});

const predict = async (img) => {
  img.width = 200;
  img.height = 200;

  console.log(img);

  const prediction = await model.predict(img);
  console.log(prediction);
  prediction.forEach((p) => {
    if (p.probability > 0.5) {
      labelIdx = p.className;
    }
  });
  console.log(labelIdx);
  const labelText = displayPrediction(labelIdx);

  console.log(labelText);
  speakPrediction(labelIdx);
};

const speakPrediction = (text) => {
  const audio = new Audio(`./audio/${text}.m4a`);
  audio.play();
};
