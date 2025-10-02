console.log("vis.js loaded");

//make the bike wheels spin

// variables from index.html
const frontWheel = document.getElementById('front-wheel');
const backWheel = document.getElementById('back-wheel');
const pedalArm = document.getElementById('pedal-arm');


// function to toggle wheel spin
function toggleSpin() {
  frontWheel.classList.toggle('spinning');
  backWheel.classList.toggle('spinning');
}

// attach click listeners to the pedal
pedalArm.addEventListener('click', toggleSpin);
