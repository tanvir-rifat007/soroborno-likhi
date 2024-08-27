import * as tf from "@tensorflow/tfjs-node-gpu";
import fs from "node:fs";

const trainUrl = new URL("./data/train", import.meta.url).pathname;
const testUrl = new URL("./data/test", import.meta.url).pathname;

let trainData, testData;

function shuffleCombo(array, array2) {
  let counter = array.length;
  console.assert(array.length === array2.length);
  let temp, temp2;
  let index = 0;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    index = (Math.random() * counter) | 0;
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    temp = array[counter];
    temp2 = array2[counter];
    array[counter] = array[index];
    array2[counter] = array2[index];
    array[index] = temp;
    array2[index] = temp2;
  }
}

export function getData(dirUrl) {
  const imageTensors = [];
  const labels = [];

  const files = fs.readdirSync(dirUrl);

  for (let i = 0; i < files.length; i++) {
    const filePath = `${dirUrl}/${files[i]}`;
    const buffer = fs.readFileSync(filePath);
    let imageTensor = tf.node
      .decodeImage(buffer)
      .resizeNearestNeighbor([28, 28])
      .expandDims()
      .toFloat()
      .div(tf.scalar(255.0)); // Normalizing images

    imageTensors.push(imageTensor);

    const label = files[i].split("-")[1].split(".")[0];

    const labelMap = {
      a: 0,
      b: 1,
      c: 2,
      d: 3,
      e: 4,
      f: 5,
      g: 6,
      h: 7,
      i: 8,
      j: 9,
      k: 10,
    };
    labels.push(labelMap[label]);
  }

  // shuffleCombo(imageTensors, labels);

  return [imageTensors, labels];
}

export const loadData = () => {
  console.log("Loading data...");
  trainData = getData(trainUrl);
  testData = getData(testUrl);
  console.log("Data loaded successfully!");
};

export const getTrainData = () => {
  return {
    images: tf.concat(trainData[0]),
    labels: tf.oneHot(trainData[1], 11),
  };
};

export const getTestData = () => {
  return {
    images: tf.concat(testData[0]),
    labels: tf.oneHot(testData[1], 11),
  };
};
