const data = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  data.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSize = 50;
  const k = 10;

  _.range(0, 3).forEach((feature) => {
    const featureData = _.map(data, (row) => [row[feature], _.last(row)]);

    const [testData, trainingData] = splitData(
      minMax(featureData, 1),
      testSize
    );

    const accuracy = _.chain(testData)
      .filter(
        (dataPoint) =>
          knn(trainingData, _.initial(dataPoint), k) === _.last(dataPoint)
      )
      .size()
      .divide(testSize)
      .value();
    console.log("For feature:", feature, "Accuracy: ", accuracy);
  });
}

function knn(dataSet, point, k) {
  return _.chain(dataSet)
    .map((row) => {
      return [distance(_.initial(row), point), _.last(row)];
    })
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
  /* console.log(pointA, pointB); */
  return (
    _.chain(pointA)
      .zip(pointB)
      .map(([a, b]) => (a - b) ** 2)
      .sum()
      .value() ** 0.5
  );
}

function splitData(dataSet, testCount) {
  const shuffled = _.shuffle(dataSet);

  const testData = _.slice(shuffled, 0, testCount);
  const trainingData = _.slice(shuffled, testCount);

  return [testData, trainingData];
}

function minMax(data, featureCount) {
  const clonedData = [...data];

  for (let i = 0; i < featureCount; i++) {
    const columnData = clonedData.map((row) => row[i]);

    const max = _.max(columnData);
    const min = _.min(columnData);

    for (let n = 0; n < clonedData.length; n++) {
      clonedData[n][i] === (clonedData[n][i] - min) / (max - min);
    }
  }

  return clonedData;
}
