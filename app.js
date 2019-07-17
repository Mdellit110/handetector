navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

//select everything in html
const video = document.querySelector("#video");
const audio = document.querySelector("#audio");
const canvas = document.querySelector("#canvas");
const indicator = document.querySelector("body");
const context = canvas.getContext("2d");
let model;

handTrack.startVideo(video).then(status => {
  if (status) {
    navigator.getUserMedia(
      { video: {} },
      stream => {
        video.srcObject = stream;
        runDetection();
      },
      err => console.log(err)
    );
  }
});
// load model

function runDetection() {
  model.detect(video).then(predictions => {
    console.log(predictions);
    if (predictions.length > 0) {
      indicator.style.background = "green";
      newScore = predictions[0];
      score.innerHTML = newScore.score;
    } else {
      indicator.style.background = "red";
    }
    requestAnimationFrame(runDetection);
  });
}

const modelParams = {
  flipHorizontal: true, // flip e.g for video
  imageScaleFactor: 0.7, // reduce input image size for gains in speed.
  maxNumBoxes: 20, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.8 // confidence threshold for predictions.
};

handTrack.load(modelParams).then(lmodel => {
  model = lmodel;
});
