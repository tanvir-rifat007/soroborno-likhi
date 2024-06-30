import * as tf from "@tensorflow/tfjs-node-gpu";
import fs from "node:fs";

const trainUrl = new URL("./data/train", import.meta.url).pathname;
const testUrl = new URL("./data/test", import.meta.url).pathname;

let trainData, testData;

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
    labels: tf.oneHot(tf.tensor1d(trainData[1], "int32"), 11).toFloat(),
  };
};

export const getTestData = () => {
  return {
    images: tf.concat(testData[0]),
    labels: tf.oneHot(tf.tensor1d(testData[1], "int32"), 11).toFloat(),
  };
};
