const data = [];
const testSize = 100;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  data.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const [testData, trainingData] = splitData(data, testSize);

  _.range(1, 16).forEach((k) => {
    const accuracy = _.chain(testData)
      .filter((dataPoint) => knn(trainingData, testData[0], k) === dataPoint[3])
      .size()
      .divide(testSize)
      .value();
    console.log("Accuracy: ", k, accuracy);
  });
}

function knn(dataSet, point, k) {
  return _.chain(dataSet)
    .map((row) => [distance(row[0], point), row[3]])
    .sortBy((row) => row[0])
    .slice(0, k)
    .countBy((row) => row[1])
    .toPairs()
    .sortBy((row) => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function distance(pointA, pointB) {
  return Math.abs(pointA - pointB);
}

function splitData(dataSet, testCount) {
  const shuffled = _.shuffle(dataSet);

  const testData = _.slice(shuffled, 0, testCount);
  const trainingData = _.slice(shuffled, testCount);

  return [testData, trainingData];
}
