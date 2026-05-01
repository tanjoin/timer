export class TimerModel {
    private _isRunning: boolean;
    private _contentEditable: boolean;
    private _min: number;
    private _sec: number;
    private _old_min: number;
    private _old_sec: number;
    private _startDate: Date | null;
    private _endDate: Date | null;
    private _timer: number | null;
    private _contentEditableCallback: TimerModelContentEditableCallback | null;
    private _runningCallback: TimerModelRunningCallback | null;
    private _resetCallback: TimerModelResetCallback | null;
    private _countDownCallback: TimerModelCountDownCallback | null;
    private _url: string | null;

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
    }

    // Getters and setters

    set urlSearchParams(value: URLSearchParams) {
        const min = value.get('min') || value.get('m') || '0';
        const sec = value.get('sec') || value.get('s') || '0';
        this._min = parseInt(min);
        this._sec = parseInt(sec);
        if (min && sec) {
            this._resetCallback?.(this._min, this._sec);
        }
    }

    get isRunning(): boolean {
        return this._isRunning;
    }

    set isRunning(value: boolean) {
        this._isRunning = value;
        if (this._runningCallback) {
            this._runningCallback(this._isRunning);
        }
    }

    get contentEditable(): boolean {
        return this._contentEditable;
    }

    set contentEditable(value: boolean) {
        this._contentEditable = value;
        if (this._contentEditableCallback) {
            this._contentEditableCallback(this._contentEditable);
        }
    }

    get min(): number {
        return this._min;
    }

    set min(value: number) {
        this._min = value;
    }

    get sec(): number {
        return this._sec;
    }

    set sec(value: number) {
        this._sec = value;
    }

    get old_min(): number {
        return this._old_min;
    }

    set old_min(value: number) {
        this._old_min = value;
    }

    get old_sec(): number {
        return this._old_sec;
    }

    set old_sec(value: number) {
        this._old_sec = value;
    }

    get url(): string | null {
        return this._url;
    }

    set url(value: string | null) {
        this._url = value;
    }

    // Callbacks

    set contentEditableCallback(value: TimerModelContentEditableCallback) {
        this._contentEditableCallback = value;
    }

    set runningCallback(value: TimerModelRunningCallback) {
        this._runningCallback = value;
    }

    set resetCallback(value: TimerModelResetCallback) {
        this._resetCallback = value;
    }

    set countDownCallback(value: TimerModelCountDownCallback) {
        this._countDownCallback = value;
    }

    // Methods

    public stop(): void {
        if (this._timer) {
            clearInterval(this._timer);
        }
        this._timer = null;
    }

    public start(): void {
        this._startDate = new Date();
        this._endDate = new Date();
        this._endDate.setMinutes(this._endDate.getMinutes() + this._min);
        this._endDate.setSeconds(this._endDate.getSeconds() + this._sec);
        this._old_min = this._min;
        this._old_sec = this._sec;
        this._timer = setInterval(() => {
            this.countDown();
        }, 1000);
    }

    private countDown(): void {
        if (this._isRunning && this._endDate) {
            let diff = (this._endDate.getTime() - new Date().getTime()) / 1000;
            let min = Math.max(Math.floor(diff / 60), 0);
            let sec = Math.max(Math.floor(diff % 60), 0);
            this._countDownCallback?.(min, sec);
        }
    }
}

export interface TimerModelContentEditableCallback {
    (value: boolean): void;
}

export interface TimerModelRunningCallback {
    (value: boolean): void;
}

export interface TimerModelResetCallback {
    (min: number, sec: number): void;
}

export interface TimerModelCountDownCallback {
    (min: number, sec: number): void;
}