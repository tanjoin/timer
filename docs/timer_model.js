export class TimerModel {
    constructor() {
        this._isRunning = false;
        this._contentEditable = false;
        this._min = 0;
        this._sec = 0;
        this._old_min = -1;
        this._old_sec = -1;
        this._contentEditableCallback = null;
        this._runningCallback = null;
        this._resetCallback = null;
        this._countDownCallback = null;
        this._startDate = null;
        this._endDate = null;
        this._timer = null;
        this._url = null;
        this._target = null;
    }
    // Getters and setters
    set urlSearchParams(value) {
        var _a;
        const minParam = value.get('min') || value.get('m');
        const secParam = value.get('sec') || value.get('s');
        const min = minParam === null ? NaN : parseInt(minParam, 10);
        const sec = secParam === null ? NaN : parseInt(secParam, 10);
        if (Number.isFinite(min) && Number.isFinite(sec)) {
            this._min = min;
            this._sec = sec;
            (_a = this._resetCallback) === null || _a === void 0 ? void 0 : _a.call(this, this._min, this._sec);
        }
        const url = value.get('url') || value.get('u');
        if (url !== null) {
            this.setUrlByUserInput(url);
        }
        const target = value.get('target') || value.get('t');
        if (target !== null) {
            this.updateTargetTime(target);
        }
    }
    get isRunning() {
        return this._isRunning;
    }
    set isRunning(value) {
        this._isRunning = value;
        if (this._runningCallback) {
            this._runningCallback(this._isRunning);
        }
    }
    get contentEditable() {
        return this._contentEditable;
    }
    set contentEditable(value) {
        this._contentEditable = value;
        if (this._contentEditableCallback) {
            this._contentEditableCallback(this._contentEditable);
        }
    }
    get min() {
        return this._min;
    }
    set min(value) {
        this._min = value;
    }
    get sec() {
        return this._sec;
    }
    set sec(value) {
        this._sec = value;
    }
    get old_min() {
        return this._old_min;
    }
    set old_min(value) {
        this._old_min = value;
    }
    get old_sec() {
        return this._old_sec;
    }
    set old_sec(value) {
        this._old_sec = value;
    }
    get url() {
        return this._url;
    }
    set url(value) {
        this._url = value;
    }
    get target() {
        return this._target;
    }
    // Callbacks
    set contentEditableCallback(value) {
        this._contentEditableCallback = value;
    }
    set runningCallback(value) {
        this._runningCallback = value;
    }
    set resetCallback(value) {
        this._resetCallback = value;
    }
    set countDownCallback(value) {
        this._countDownCallback = value;
    }
    // Methods
    stop() {
        if (this._timer) {
            clearInterval(this._timer);
        }
        this._timer = null;
    }
    start() {
        this._startDate = new Date();
        this._endDate = new Date();
        this._endDate.setMinutes(this._endDate.getMinutes() + this._min);
        this._endDate.setSeconds(this._endDate.getSeconds() + this._sec);
        this._old_min = this._min;
        this._old_sec = this._sec;
        this._timer = setInterval(() => {
            this.countDown();
        }, 1000);
        // 開始直後の1秒待ちをなくすために即時反映
        this.countDown();
    }
    setUrlByUserInput(userInput) {
        if (userInput.startsWith('http://') || userInput.startsWith('https://')) {
            this._url = userInput;
            return true;
        }
        return false;
    }
    updateTargetTime(target) {
        var _a;
        const matched = target.match(/^(\d{1,2}):(\d{2})$/);
        if (!matched) {
            return false;
        }
        const hour = parseInt(matched[1], 10);
        const minute = parseInt(matched[2], 10);
        if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            return false;
        }
        this._target = target;
        const targetDate = new Date();
        targetDate.setHours(hour, minute, 0, 0);
        if (targetDate.getTime() < Date.now()) {
            targetDate.setDate(targetDate.getDate() + 1);
        }
        const diffSeconds = Math.floor((targetDate.getTime() - Date.now()) / 1000);
        this._min = Math.floor(diffSeconds / 60);
        this._sec = Math.max(diffSeconds % 60, 0);
        (_a = this._resetCallback) === null || _a === void 0 ? void 0 : _a.call(this, this._min, this._sec);
        return true;
    }
    countDown() {
        var _a;
        if (this._isRunning && this._endDate) {
            const diff = (this._endDate.getTime() - new Date().getTime()) / 1000;
            const min = Math.max(Math.floor(diff / 60), 0);
            const sec = Math.max(Math.floor(diff % 60), 0);
            (_a = this._countDownCallback) === null || _a === void 0 ? void 0 : _a.call(this, min, sec);
        }
    }
}
