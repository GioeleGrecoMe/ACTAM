const c = new AudioContext();
const fadeIn = 0.001
const fadeOut = 0.1

const keys = "awsedftgyhujkolpòà+ù";
//harmonicGains = { 1: -37, 2: -27, 3: -39, 4: -28, 5: -40, 6: -34, 7: -50}
harmonicGains = { 1: -37, 2: -27, 3: -39, 4: -28, 5: -40, 6: -34, 7: -50, 8: -27, 9: -55, 10: -34, 12: -31, 14: -54, 18: -58, 20: -34, 22: -64, 24: -44, 26: -62, 28: -60, 30: -56, 32: -52, 34: -69, 36: -62, 38: -73, 40: -59, 42: -72, 44: -67, 48: -61, 50: -71, 52: -74, 56: -69, 60: -73, 64: -76 }

gains = {}
oscillators = {}

const global_context = {}

function resume_context() {
  c.resume();
}

document.body.onkeydown = function(e){
  noteNumber = keys.indexOf(e.key)
  if(e.repeat)
    return;
  for(var key in harmonicGains){
    console.log(key)
    generatePartial(noteNumber,key,harmonicGains[key])
  }
}

function generatePartial(position, partialNumber, db){
  if(!oscillators[position] || !gains[position]){
    gains[position] = {}
    oscillators[position] = {}
  }
  /*else if(gains[position][1].value <= 0.0000001){
    for(var key in oscillators[position])
      oscillator[position][key].stop()
    oscillators[position] = {}
  }*/
  if(!oscillators[position][partialNumber] || !gains[position][partialNumber]){
    osc = c.createOscillator();
    g = c.createGain();
    osc.connect(g);
    g.connect(c.destination);
    g.gain.value = 0;
    osc.frequency.value = 110*Math.pow(2, (position-9)/12)*partialNumber;
    osc.start()
    gains[position][partialNumber] = g;
    oscillators[position][partialNumber] = osc;
  }
  gains[position][partialNumber].gain.setTargetAtTime(Math.pow(10,db/20), c.currentTime, fadeIn);
  //console.log(gains)
}

document.body.onkeyup = function(e){
  stopPartial(keys.indexOf(e.key))
}

function stopPartial(position){
  for (const [key, value] of Object.entries(gains[position])) {
    value.gain.setTargetAtTime(0, c.currentTime, fadeOut)
  }
}
