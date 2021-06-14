// browser-sync --start --server --files "*"
// console.clear()

var song
var fft

function preload() {
  song = loadSound('destiny.mp3')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  fft = new p5.FFT()
}

function draw() {
  background(50);
  stroke(255)
  noFill()
  translate(width / 2, height / 2)

  var wave = fft.waveform()

  for(var t = -1; t <= 1; t += 2) {
    beginShape()
    for(var i = 0; i < 180; i += 0.5) {
      var index = floor(map(i, 0, 180, 0, wave.length - 1))

      var r = map(wave[index], -1, 1, 150, 350)

      var x = r * sin(i) * t
      var y = r * cos(i)

      // point(x, y)
      vertex(x, y)
    }
    endShape()
  }
}

function mouseClicked() {
  if(song.isPlaying()) {
    song.pause()
    noLoop()
  } else {
    song.play()
    loop()
  }
}