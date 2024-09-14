let timer;
let old_min;
let old_sec;
let url;
let is_running = false;
let end;

window.onload = () => {
  const searchParams = new URLSearchParams(decodeURI(window.location.search));

  const min = searchParams.get('min') || searchParams.get('m');
  const sec = searchParams.get('sec') || searchParams.get('s');
  if (min !== null && sec !== null) {
    reset(min, sec);
  }

  if (searchParams.get('url') || searchParams.get('u')) {
    url = searchParams.get('url') || searchParams.get('u');
  }
  
  let target = searchParams.get('target') || searchParams.get('t');
  targetTime(target);
}

function targetTime(target) {
  if (target && target.includes(':')) {
    let d1 = new Date();
    d1.setHours(target.split(':')[0]);
    d1.setMinutes(target.split(':')[1]);
    let d2 = new Date();
    let diff = d1.getTime() - d2.getTime();
    reset(Math.floor(diff / 60000), Math.floor(diff / 1000) % 60);
  }
}

window.document.onkeydown = function(event) {
  if (event.key === 's') {
    clickTimer();
  } else if (event.key === 'u') {
    let userInput = window.prompt("URL", url);
    if (userInput && userInput.includes("http")) {
      url = userInput;
    }
  } else if (event.key === 't') {
    let userInput = window.prompt("何時まで？（HH:mm）");
    targetTime(userInput);
  }
}

document.getElementById("main").addEventListener("mousemove", function(event) {
  if (event.clientY >= document.getElementById("buttonarea").clientHeight && timer) {
    document.getElementById("buttonarea").classList.add('move');
  } else {
    document.getElementById("buttonarea").classList.remove('move');
  }
});

function onStart() {
  is_running = true;
  start = new Date();
  end = new Date();
  end.setMinutes(end.getMinutes() + parseInt(document.getElementById("min").innerText));
  end.setSeconds(end.getSeconds() + parseInt(document.getElementById("sec").innerText));
  document.getElementById("min").contentEditable  = false;
  document.getElementById("sec").contentEditable  = false;
  old_min = `${document.getElementById("min").innerText}`.padStart(2, "0");
  old_sec = `${document.getElementById("sec").innerText}`.padStart(2, "0");
  document.getElementById("startOrStop").innerText = "Stop";
  timer = setInterval("countDown()", 1000);
  countDown();
  document.getElementById("buttonarea").classList.add('move');
  silentSound();
}

function onStop() {
  is_running = false;
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
  if (is_running) {
    show((end.getTime() - new Date().getTime()) / 1000);
  }
}

function show(value) {
  var v = parseInt(value);
  document.getElementById("min").innerText = `${Math.max(Math.floor(v / 60), 0)}`.padStart(2, "0");
  document.getElementById("sec").innerText = `${Math.max(v % 60, 0)}`.padStart(2, "0");
  if (v <= 0 & is_running) {
    window.focus();
    onStop();
    if (url) {
      window.open(url, '_blank');
    }
    sound();
  }
}

function sound(callback) {
  var sound1 = new Audio("data:audio/wav;base64," + soundBase64);
  sound1.play();
  if (callback) {
    callback();
  }
}

function silentSound(callback) {
  var silent = new Audio(`data:audio/mp3;base64,${silentSoundBase64}`);
  silent.play();
  if (callback) {
    callback();
  }
}

function reset(min, sec) {
  if (min === undefined) {
    document.getElementById("min").innerText = old_min;
  } else {
    document.getElementById("min").innerText = `${min}`.padStart(2, "0");
  }
  if (sec === undefined) {
    document.getElementById("sec").innerText = old_sec;
  } else {
    document.getElementById("sec").innerText = `${sec}`.padStart(2, "0");
  }
}

var soundBase64 = "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//////UmaEADJhGYqICr0SQsF4xFd9WCS27MBCAcD309S9qA1LYJtz4yFbUMaqhAS1KB41N6////Uy2/7k0XikO8KeQ+pQcvF5f//6v///rNDQjBQodYA0KcTJc2b//4v//XRJbbiA/AOL5P3uRxLQ41VmBKPLejbzyh//tSxDIACX0XS6CmixFJoqk0NdGauG4EHxZKikqSlf9//s9qv0SfHQKUAcqAGki5y8brLxv//tV/+r/+cKZJizRZYDEId5ieWd3f/5P/+lUAd3eYcADFAAA/6hls4g8qQaE9deqq9MNSCHsHgDPYrpLE+eqf///1Lv/RMh1jIBdwGHhAZMGGXh9l8kUyX///////rHKD2RFQQ+B5RRNyWKh9oBbdsgGMBwOf2BsymlcSklp4MKN4D2DakWEuwHqi8asieWgv///2dkG/mBRFAA3/+1LEQIAKSRlB5dJVATeh6XQX0WJIANUyKGZ88T7//+r////Omw/jPkwCI6VBX//+z6P3qpJLdtAH4BwOpkBHKsLZUAaOnS4cx1JenfO1ePgMEvMi6aXZD/6v+u2r+xGEoJ0AJBg7MLjWaKOof/9b//pP/+fMS4NcSAMvqRTPu//9vf/0WaAMMAAb8i/KhZ+8mK0ZJXDiliuxRIFwGZoEaanm1v///qWupa/0iaHEHTAYhKAc6G+Txqxie///////UcLA6hjx7BzYiZIS//+////7UsROAgoFFUmgsosRNKHodBZRYvuqADF04BmAB+nRo3YNUKqZjxc+9nadxMw2y5Q6Ravv1J///+v/pGBDRN4x4AAwDG+QOAaAsMFKEVKAsBLf//////nCTFzCMg6oSIgYggRc+MEnFgAAVneAAEQQybqSBJ/NUjdnMSDiOA9sD09g8QsgvpXQf//+vd3r11OUB1iwBqkAKSAfZENSJE2JQq///////qJQhpXDeAhEgYIyHBETLhTSAEBlh5IARAAAPnau88wEY0JIwFcRzMeN//tSxF0ASkEVN4PukklAIud8BFDga5C2JLoOETVAGszMv2z///+lfX6jQjCJibyGgsfBWaIELY7TQh3//////+fSGwLCBIkDQWHBiEJdLwEonnAEj0sb0KqIAyexQgoxoV7BkMyhSk600Y8lZL5Zyg////V6/UiVjQQHDIIGSqADwRHBTJ0jiaN///////5ZMxSA5gEh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E4hvo0jfMG10S+bnycQQL5mk71f2P0/5gggZg+CAJn//9IIAMPggAz4If///+Aw+Cf0AAAEAGzMzMwEAgICAgICAgICuXLl1mlx0ZLeaJQJASAkDYSjExWra1rWtrWta1rWrWta1rWtrWta1rNMrTExMT11pcKigoKb//kCgoK74QUNVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVf/7UsTngEwpDx9C7rJBYZ9kaotQAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tSxOiAFP0xJbj6AAFNlGVrhsABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=";

var silentSoundBase64 = `SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYxLjEuMTAwAAAAAAAAAAAAAAD/+0DA
AAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAkAAAReAEFBQUFBQUFBQUFBWVlZ
WVlZWVlZWVlxcXFxcXFxcXFxcYiIiIiIiIiIiIiIoKCgoKCgoKCgoKC4uLi4uLi4
uLi4uNDQ0NDQ0NDQ0NDQ6Ojo6Ojo6Ojo6Oj//////////////wAAAABMYXZjNjEu
My4AAAAAAAAAAAAAAAAkA8wAAAAAAAAEXqDB1H0AAAAAAP/7EMQAA8AAAaQAAAAg
AAA0gAAABExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVV//sQxCmD
wAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVV
VVX/+xDEUwPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFN
RTMuMTAwVVVVVf/7EMR8g8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVV//sQxKYDwAABpAAAACAAADSAAAAEVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xDEz4PAAAGkAAAAIAAANIAAAARV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EMTWA8AAAaQAAAAg
AAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxNYD
wAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVX/+xDE1gPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVQ==`;