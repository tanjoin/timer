var timer;

document.getElementById("main").addEventListener("mousemove", function(event) {
  if (event.clientY >= document.getElementById("buttonarea").clientHeight && timer) {
    document.getElementById("buttonarea").classList.add('move');
  } else {
    document.getElementById("buttonarea").classList.remove('move');
  }
});

function onStart() {
  document.getElementById("min").contentEditable  = false;
  document.getElementById("sec").contentEditable  = false;
  document.getElementById("startOrStop").innerText = "Stop";
  timer = setInterval("countDown()", 1000);
  document.getElementById("buttonarea").classList.add('move');
}

function onStop() {
  document.getElementById("min").contentEditable  = true;
  document.getElementById("sec").contentEditable  = true;
  document.getElementById("startOrStop").innerText = "Start";
  clearInterval(timer);
  timer = null;
  document.getElementById("buttonarea").classList.remove('move');
}

function clickTimer() {
  if (timer) {
    onStop();
  } else {
    onStart();
  }
}

function countDown() {
  var min = document.getElementById("min").innerText;
  var sec = document.getElementById("sec").innerText;

  if (min === "" && sec === "") {
    reset();
    onStop();
    return;
  }
  if (min === "") {
    min = 0;
  }
  min = parseInt(min);
  if (sec === "") {
    sec = 0;
  }
  sec = parseInt(sec);

  if (min === 0 && sec === 0) {
    onStop();
    return;
  }

  show(min * 60 + sec - 1);
}

function show(value) {
  var v = parseInt(value);
  if (v <= 0) {
    reset();
    alert("時間です");
    onStop();
  }
  document.getElementById("min").innerText = ("0" + Math.floor(v / 60)).slice(-2);
  document.getElementById("sec").innerText = ("0" + v % 60).slice(-2);
}


function reset() {
  document.getElementById("min").innerText = "00";
  document.getElementById("sec").innerText = "00";

}
