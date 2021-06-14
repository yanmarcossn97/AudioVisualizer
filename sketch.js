// browser-sync --start --server --files "*"
// console.clear()
// ffmpeg -r 30 -f image2 -s 540x540 -i "%07d.png" -vcodec libx264 -crf 17 -pix_fmt yuv420p output.mp4

var song
var fft
var particles = []
var img

// the frame rate
var fps = 60;

// the canvas capturer instance
var capturer = new CCapture({ format: 'png', framerate: fps });

function preload() {
  song = loadSound('destiny.mp3')
  img = loadImage('bg.jpg')
}

function setup() {
  createCanvas(960, 540); // this output a 1920x1080 res
  angleMode(DEGREES)
  rectMode(CENTER)
  imageMode(CENTER)
  fft = new p5.FFT(0.3)

  img.filter(BLUR, 12)

  // this is optional, but lets us see how the animation will look in browser.
  frameRate(fps);
}

// needed to subtract initial millis before first draw to 
var startMillis; 

function draw() {
  if (frameCount === 1) {
    // start the recording on the first frame
    // this avoids the code freeze which occurs if capturer.start is called
    // in the setup, since v0.9 of p5.js
    capturer.start();
  }

  if (startMillis == null) {
    startMillis = millis();
  }

  // duration in milliseconds
  var duration = 10000;

  // compute how far we are through the animation as a value between 0 and 1.
  var elapsed = millis() - startMillis;
  var t = map(elapsed, 0, duration, 0, 1);

  // if we have passed t=1 then end the animation.
  if (t > 1) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }

  // actually draw
  background(150);
  translate(width / 2, height / 2)

  fft.analyze()
  amp = fft.getEnergy(20, 200)

  push()
  if(amp > 230) {
    rotate(random(-0.5, 0.5))
  }

  image(img, 0, 0, width + 100, height + 100)
  pop()

  var alpha = map(amp, 0, 255, 180, 150)
  fill(0, alpha)
  noStroke()
  rect(0, 0, width, height)

  stroke(250)
  strokeWeight(3)
  noFill()

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

  var p = new Particle()
  particles.push(p)

  for(var i = particles.length - 1; i >= 0; i--) {
    if(!particles[i].edges()) {
      particles[i].update(amp > 230)
      particles[i].show()
    } else {
      particles.splice(i, 1)
    }
  }
  // end drawing code

  // handle saving the frame
  console.log('capturing frame');
  capturer.capture(document.getElementById('defaultCanvas0'));
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

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250)
    this.vel = createVector(0, 0)
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001))
    this.w = random(3, 5)
    this.color = [random(200, 255), random(150, 200), random(150, 200)]
  }

  update(cond) {
    this.vel.add(this.acc)
    this.pos.add(this.vel)

    if(cond) {
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }

  edges() {
    if(this.pos.x < -width / 2 || this.pos.x > width /2 || 
    this.pos.y < -height / 2 || this.pos.y > height / 2) {
      return true
    } else {
        return false
    }
  }

  show() {
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.w)
  }
}