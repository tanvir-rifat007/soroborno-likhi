import * as tf from "@tensorflow/tfjs-node-gpu";
import { loadData, getTrainData, getTestData } from "./getData.js";

async function train() {
  loadData();

  const { images: trainImages, labels: trainLabels } = getTrainData();
  const { images: testImages, labels: testLabels } = getTestData();

  const model = tf.sequential();
  model.add(
    tf.layers.conv2d({
      inputShape: [28, 28, 4],
      filters: 32,
      kernelSize: [3, 3],
      activation: "relu",
    })
  );
  model.add(
    tf.layers.conv2d({
      filters: 32,
      kernelSize: [3, 3],
      activation: "relu",
    })
  );
  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
  model.add(tf.layers.dropout({ rate: 0.25 }));

  model.add(
    tf.layers.conv2d({
      filters: 64,
      kernelSize: [3, 3],
      activation: "relu",
    })
  );
  model.add(
    tf.layers.conv2d({
      filters: 64,
      kernelSize: [3, 3],
      activation: "relu",
    })
  );
  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
  model.add(tf.layers.dropout({ rate: 0.25 }));

  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 512, activation: "relu" }));
  model.add(tf.layers.dropout({ rate: 0.5 }));
  model.add(tf.layers.dense({ units: 11, activation: "softmax" }));

  const optimizer = tf.train.adam(0.001);
  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  model.summary();

  const history = await model.fit(trainImages, trainLabels, {
    batchSize: 64,
    epochs: 100,

    validationSplit: 0.3,
    callbacks: tf.node.tensorBoard("/tmp/test/2021222"), // using a tensorboard callback
  });

  const testResult = model.evaluate(testImages, testLabels);
  console.log("Test accuracy: ", testResult[1].dataSync()[0]);

  // Save the model
  await model.save("file://./model");
}

train();
