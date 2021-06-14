// browser-sync --start --server --files "*"
// console.clear()

var song
var fft

function preload() {
  song = loadSound('destiny.mp3')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT()
}

function draw() {
  background(50);
  stroke(255)
  noFill()

  var wave = fft.waveform()

  beginShape()
  for(var i = 0; i < width; i++) {
    var index = floor(map(i, 0, width, 0, wave.length))

    var x = i
    var y = wave[index] * 300 + height / 2

    // point(x, y)
    vertex(x, y)
  }
  endShape()
}

function mouseClicked() {
  if(song.isPlaying()) {
    song.pause()
  } else {
    song.play()
  }
}