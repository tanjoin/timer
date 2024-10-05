class TimerView {

  constructor() { 
    this.is_running = false;
  }

  handleMouseMove() {
    document.getElementById("main").addEventListener("mousemove", (event) => {
      if (event.clientY >= document.getElementById("buttonarea").clientHeight && this.is_running) {
        document.getElementById("buttonarea").classList.add('move');
      } else {
        document.getElementById("buttonarea").classList.remove('move');
      }
    });
  }

  contentEditable(editable) {
    document.getElementById("min").contentEditable  = editable;
    document.getElementById("sec").contentEditable  = editable;  
  }

  setMin(text) {
    document.getElementById("min").innerText = text;
  }

  getMin() { 
    return document.getElementById("min").innerText;
  }

  getMinInt() {
    return parseInt(this.getMin());
  }

  setSec(text) {
    document.getElementById("sec").innerText = text;
  }

  getSec() {
    return document.getElementById("sec").innerText;
  }
  
  getSecInt() {
    return parseInt(this.getSec());
  }

  showStop() {
    document.getElementById("startOrStop").innerText = "Stop";
    this.is_running = true;
  }

  showStart() {
    document.getElementById("startOrStop").innerText = "Start";
    this.is_running = false;
  }

  switchButtonAreaMovement(is_move) {
    if (is_move) {
      document.getElementById("buttonarea").classList.add('move');
    } else {  
      document.getElementById("buttonarea").classList.remove('move');
    }
  }
}

class WindowController {
  focus() {
    window.focus();
  }

  launchUrl(url) { 
    window.open(url, '_blank');
  }

  getParam() {
    return new URLSearchParams(decodeURI(window.location.search));
  }

  setParam(key, value) {
    const searchParams = this.getParam();
    searchParams.set(key, value);
    window.history.replaceState(null, null, '?' + searchParams.toString());
  }
}

class TimerController {
  constructor() {
    if (TimerController.instance) {
      return TimerController.instance;
    }
    this.timer = undefined;
    this.target = undefined;
    this.old_min = undefined;
    this.old_sec = undefined;
    this.url = undefined;
    this.start = undefined;
    this.end = undefined;
    this.is_running = false;
    this.view = new TimerView();
    this.windowController = new WindowController();
    this.sound = new SoundController();
    TimerController.instance = this;
  }

  static onload() {
    const controller = new TimerController();
    const searchParams = new URLSearchParams(decodeURI(window.location.search));
    controller.setMinAndSecByParam(searchParams);
    controller.setUrlByParam(searchParams);
    controller.setTargetByParam(searchParams);
    controller.setupMouseover();
  }

  static onkeydown(event) {
    const controller = new TimerController();
    if (event.key === 's') {
      controller.toggleTimer();
    } else if (event.key === 'u') {
      controller.setUrlByUser(window.prompt("URL", controller.url));
    } else if (event.key === 't') {
      controller.setTargetByUser(window.prompt("何時まで？（HH:mm）", controller.target));
    }
  }

  static clickTimer() {
    const controller = new TimerController();
    controller.toggleTimer();
  }

  resetMinAndSec(min, sec) {
    if (min === undefined) {
      this.view.setMin(this.old_min);
    } else {
      this.view.setMin(`${min}`.padStart(2, "0"));
    }
    if (sec === undefined) {
      this.view.setSec(this.old_sec);
    } else {
      this.view.setSec(`${sec}`.padStart(2, "0"));
    }
  }

  toggleTimer() {
    if (this.timer) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.is_running = true;
    this.start = new Date();
    this.end = new Date();
    this.end.setMinutes(this.end.getMinutes() + this.view.getMinInt());
    this.end.setSeconds(this.end.getSeconds() + this.view.getSecInt());
    this.view.contentEditable(false);
    this.old_min = `${this.view.getMin()}`.padStart(2, "0");
    this.old_sec = `${this.view.getSec()}`.padStart(2, "0");
    this.view.showStop();
    this.timer = setInterval(() => this.countDown(), 1000);
    this.countDown();
    this.view.switchButtonAreaMovement(true);
    this.sound.playSilent();
  }

  stopTimer() {
    this.is_running = false;
    this.view.contentEditable(true);
    this.view.showStart();
    clearInterval(this.timer);
    this.timer = null;
    this.view.switchButtonAreaMovement(false);
  }

  setupMouseover() {
    this.view.handleMouseMove();
  }

  setUrlByParam(searchParams) {
    const url = searchParams.get('url') || searchParams.get('u');
    if (url) {
      this.url = url;
    }
  }

  setMinAndSecByParam(searchParams) {
    const min = this.parseMinSearchParam(searchParams);
    const sec = this.parseSecSearchParam(searchParams);
    if (min !== null && sec !== null) {
      this.resetMinAndSec(min, sec);
    }
  }

  parseMinSearchParam(searchParams) {
    return searchParams.get('min') || searchParams.get('m');
  }

  parseSecSearchParam(searchParams) {
    return searchParams.get('sec') || searchParams.get('s');
  }

  updateTargetTime(target) {
    if (target && target.includes(':')) {
      this.target = target;
      let d1 = new Date();
      d1.setHours(target.split(':')[0]);
      d1.setMinutes(target.split(':')[1]);
      if (d1.getTime() < new Date().getTime()) {
        d1.setDate(d1.getDate() + 1);
      }
      let d2 = new Date();
      let diff = d1.getTime() - d2.getTime();
      this.resetMinAndSec(Math.floor(diff / 60000), Math.floor(diff / 1000) % 60);
      return true;
    }
    return false;
  }

  setTargetByUser(userInput) {
    if (setTargetTime(userInput)) {
      this.windowController.setParam('t', userInput);
    }
  }

  setTargetByParam(searchParams) {
    this.updateTargetTime(searchParams.get('target') || searchParams.get('t'));
  }

  setUrlByUser(userInput) {
    if (userInput && userInput.includes("http")) {
      this.url = userInput;
      this.windowController.setParam('u', userInput);
    }
  }

  countDown() {
    if (this.is_running) {
      this.show((this.end.getTime() - new Date().getTime()) / 1000);
    }
  }

  show(value) {
    var v = parseInt(value);
    this.view.setMin(`${Math.max(Math.floor(v / 60), 0)}`.padStart(2, "0"));
    this.view.setSec(`${Math.max(v % 60, 0)}`.padStart(2, "0"));
    if (v <= 0 & this.is_running) {
      this.windowController.focus();
      this.stopTimer();
      if (this.url) {
        this.windowController.launchUrl(this.url);
      }
      this.sound.play();
    }
  }
};

class SoundController {
  play(callback) {
    var sound1 = new Audio("data:audio/wav;base64," + SoundController.SOUNDBASE64);
    sound1.play();
    if (callback) {
      callback();
    }
  }

  playSilent(callback) {
    var silent = new Audio(`data:audio/mp3;base64,${SoundController.SILENTSOUNDBASE64}`);
    silent.play();
    if (callback) {
      callback();
    }
  }

  static SILENTSOUNDBASE64 = `SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYxLjEuMTAwAAAAAAAAAAAAAAD/+0DA
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

  static SOUNDBASE64 = `SUQzBAAAAAAAfFRYWFgAAAASAAADbWFqb3JfYnJhbmQAcXQgIABUWFhYAAAAEQAAA21pbm
9yX3ZlcnNpb24AMABUWFhYAAAAGAAAA2NvbXBhdGlibGVfYnJhbmRzAHF0ICAAVF
NTRQAAAA8AAANMYXZmNTcuNzEuMTAwAAAAAAAAAAAAAAD/+0DAAAAAAAAAAAAAAA
AAAAAAAABJbmZvAAAADwAAACgAACFdAAsLEREYGBgeHiQkJCsrMTExNzc9PT1ERE
pKSlBQVlZWXV1jY2NpaW9vb3Z2fHx8goKIiIiPj5WVlZuboqKiqKiurq60tLu7u8
HBx8fHzc3U1NTa2uDg4Obm7e3t8/P5+fn//wAAAABMYXZjNTcuODkAAAAAAAAAAA
AAAAAkAkAAAAAAAAAhXVeKB+IAAAAAAP/7UMQAA8AAAaQAAAAgAAA0gAAABEAAAA
APp1HfdEAP93YFHWVyd7smWy0TnvTcmC2RAv/QMzdOHTjQJoG7xP380Mzc+wnwHA
BnxmgwWIh/ni+6C0wGAgG2DBY2MM3IqQz/035oZm5IHTYVuLnHGKIMqML/59CeL7
qRNzNwJAxxjIAiMgHAx3ASJiwCChiXv/+gaGZumm7Ldk3QWMuP5Oj4Lh0yIOThOD
tLQ4zAnf////N03Q////FADtJ8UGoIoJoJkKhXVmT13HQyqIADQg3/+1LEXYPAAA
GkAAAAIAAANIAAAATMC3PNACni26bgAWA9E/1zs3HBDGcLevikwtdRMBLsSC/GLE
sjGLE0cG7rXVxMMsbSDIpuX81KX/078esXv/O5nypYqR+xlSXn0UwpXJgfCMXrdu
N5f++rUdepYw5/7zt///9jCky3nWpYfxlcvs0/bdA5FJjm7rT6S3///f9/7X///9
pwGmSfsssM7QzohCSokbACJjYAACIZE9wV2/pHwCAfn5Q6qpGSIejjYGbuBQQN4S
aJInh4TOghNP/7UsS7gAAAAaQUAAAiocIdlxFAAOh5WOA2AAlQA7AnYaoaEHNVC0
rmRmQEdJFeYHdzqLaTiIfFO9Qvg0gbpGmhmeLAnBjGdZIYhs9eLPL4sQssa5PEUI
YHWHWdPEVJ1zdRF0VmxTNUDVY+qwtDIh/Ol0OiLbfrJkPhLtVb+fUAAAAAQWm21d
5o5SjY/PA6AMZQE+NX/rRp/q0uuVVniQUiWEfZpxSqqxduzs1cv////////3zF/u
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
4yFbUMaqhAS1KB41N6////Uy2/7k0XikO8KeQ+pQcvF5f//6v///rNDQjBQodYA0
KcTJc2b//4v//XRJbbiA/AOL5P3uRxLQ41VmBKPLejbzyh//tSxDIACX0XS6Cmix
FJoqk0NdGauG4EHxZKikqSlf9//s9qv0SfHQKUAcqAGki5y8brLxv//tV/+r/+cK
ZJizRZYDEId5ieWd3f/5P/+lUAd3eYcADFAAA/6hls4g8qQaE9deqq9MNSCHsHgD
PYrpLE+eqf///1Lv/RMh1jIBdwGHhAZMGGXh9l8kUyX///////rHKD2RFQQ+B5RR
NyWKh9oBbdsgGMBwOf2BsymlcSklp4MKN4D2DakWEuwHqi8asieWgv///2dkG/mB
RFAA3/+1LEQIAKSRlB5dJVATeh6XQX0WJIANUyKGZ88T7//+r////Omw/jPkwCI6
VBX//+z6P3qpJLdtAH4BwOpkBHKsLZUAaOnS4cx1JenfO1ePgMEvMi6aXZD/6v+u
2r+xGEoJ0AJBg7MLjWaKOof/9b//pP/+fMS4NcSAMvqRTPu//9vf/0WaAMMAAb8i
/KhZ+8mK0ZJXDiliuxRIFwGZoEaanm1v///qWupa/0iaHEHTAYhKAc6G+Txqxie/
//////UcLA6hjx7BzYiZIS//+////7UsROAgoFFUmgsosRNKHodBZRYvuqADF04B
mAB+nRo3YNUKqZjxc+9nadxMw2y5Q6Ravv1J///+v/pGBDRN4x4AAwDG+QOAaAsM
FKEVKAsBLf//////nCTFzCMg6oSIgYggRc+MEnFgAAVneAAEQQybqSBJ/NUjdnMS
DiOA9sD09g8QsgvpXQf//+vd3r11OUB1iwBqkAKSAfZENSJE2JQq///////qJQhp
XDeAhEgYIyHBETLhTSAEBlh5IARAAAPnau88wEY0JIwFcRzMeN//tSxF0ASkEVN4
PukklAIud8BFDga5C2JLoOETVAGszMv2z///+lfX6jQjCJibyGgsfBWaIELY7TQh
3//////+fSGwLCBIkDQWHBiEJdLwEonnAEj0sb0KqIAyexQgoxoV7BkMyhSk600Y
8lZL5Zyg////V6/UiVjQQHDIIGSqADwRHBTJ0jiaN///////5ZMxSA5gEhpFQJBx
H5dL8EBFVnggAwAMhakTW7s02t/ckldDO/q7fkExRLBuKLrKODkw3RZ3///9H1/l
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
xMT11pcKigoKb//kCgoK74QUNVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVf/7Us
TngEwpDx9C7rJBYZ9kaotQAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVV//tSxOiAFP0xJbj6AAFNlGVrhsABVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=`;
}

window.onload = TimerController.onload;
window.document.onkeydown = TimerController.onkeydown;
