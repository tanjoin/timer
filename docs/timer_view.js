export class TimerView {
    constructor() {
        this.mouseMoveCallback = null;
        this.buttonAreaClickCallback = null;
        this._handleMouseMove = (event) => {
            var _a, _b;
            if (this._buttonArea && event.clientY <= this._buttonArea.clientHeight) {
                (_a = this.mouseMoveCallback) === null || _a === void 0 ? void 0 : _a.call(this, true);
            }
            else {
                (_b = this.mouseMoveCallback) === null || _b === void 0 ? void 0 : _b.call(this, false);
            }
        };
        this._handleClick = () => {
            var _a;
            (_a = this.buttonAreaClickCallback) === null || _a === void 0 ? void 0 : _a.call(this);
        };
        this._main = document.getElementById('main');
        this._buttonArea = document.getElementById('buttonarea');
        this._min = document.getElementById('min');
        this._sec = document.getElementById('sec');
        this._startOrStop = document.getElementById('startOrStop');
    }
    activate(isRunning) {
        var _a, _b;
        this.contentEditable(!isRunning);
        if (isRunning) {
            this.showStop();
            this.addMoveClass();
        }
        else {
            this.showStart();
            this.removeMoveClass();
        }
        (_a = this._main) === null || _a === void 0 ? void 0 : _a.addEventListener('mousemove', this._handleMouseMove);
        (_b = this._buttonArea) === null || _b === void 0 ? void 0 : _b.addEventListener('click', this._handleClick);
    }
    deactivate() {
        var _a, _b;
        (_a = this._main) === null || _a === void 0 ? void 0 : _a.removeEventListener('mousemove', this._handleMouseMove);
        (_b = this._buttonArea) === null || _b === void 0 ? void 0 : _b.removeEventListener('click', this._handleClick);
    }
    get min() {
        var _a;
        return parseInt(((_a = this._min) === null || _a === void 0 ? void 0 : _a.textContent) || '0');
    }
    set min(value) {
        if (this._min) {
            this._min.textContent = value.toString().padStart(2, '0');
        }
    }
    get sec() {
        var _a;
        return parseInt(((_a = this._sec) === null || _a === void 0 ? void 0 : _a.textContent) || '0');
    }
    set sec(value) {
        if (this._sec) {
            this._sec.textContent = value.toString().padStart(2, '0');
        }
    }
    contentEditable(value) {
        if (this._min)
            this._min.contentEditable = value ? 'true' : 'false';
        if (this._sec)
            this._sec.contentEditable = value ? 'true' : 'false';
    }
    showStart() {
        if (this._startOrStop)
            this._startOrStop.textContent = 'Start';
    }
    showStop() {
        if (this._startOrStop)
            this._startOrStop.textContent = 'Stop';
    }
    addMoveClass() {
        var _a;
        (_a = this._buttonArea) === null || _a === void 0 ? void 0 : _a.classList.add('move');
    }
    removeMoveClass() {
        var _a;
        (_a = this._buttonArea) === null || _a === void 0 ? void 0 : _a.classList.remove('move');
    }
    focus() {
        window.focus();
    }
    launchUrl(url) {
        window.open(url, '_blank');
    }
}
