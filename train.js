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
      filters: 16,
      kernelSize: 3,
      strides: 1,
      padding: "same",
      activation: "relu",
      kernelInitializer: "heNormal",
    })
  );
  model.add(
    tf.layers.maxPooling2d({
      poolSize: 2,
      strides: 2,
    })
  );

  model.add(
    tf.layers.conv2d({
      filters: 32,
      kernelSize: 3,
      strides: 1,
      padding: "same",
      activation: "relu",
    })
  );

  model.add(
    tf.layers.maxPooling2d({
      poolSize: 2,
      strides: 2,
    })
  );
  model.add(
    tf.layers.conv2d({
      filters: 64,
      kernelSize: 3,
      strides: 1,
      padding: "same",
      activation: "relu",
    })
  );
  model.add(
    tf.layers.maxPooling2d({
      poolSize: 2,
      strides: 2,
    })
  );

  // Flatten for connecting to deep layers
  model.add(tf.layers.flatten());

  // One hidden deep layer
  model.add(
    tf.layers.dense({
      units: 128,
      activation: "tanh",
    })
  );
  // Output
  model.add(
    tf.layers.dense({
      units: 11,
      activation: "softmax",
    })
  );

  const optimizer = tf.train.adam(0.001);
  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  model.summary();

  await model.fit(trainImages, trainLabels, {
    batchSize: 64,
    epochs: 100,

    validationData: [testImages, testLabels],

    validationSplit: 0.3,
    callbacks: tf.node.tensorBoard("/tmp/test/2021222"), // using a tensorboard callback
  });

  const testResult = model.evaluate(testImages, testLabels);
  console.log("Test accuracy: ", testResult[1].dataSync()[0]);

  // Save the model
  await model.save("file://./model");
}

train();
