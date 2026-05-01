export class TimerView {
    private _main: HTMLElement | null;
    private _buttonArea: HTMLElement | null;
    private _min: HTMLElement | null;
    private _sec: HTMLElement | null;
    private _startOrStop: HTMLElement | null;

    private _urlSearchParamsCallback: TimerViewURLSearchParamsCallback | null;
    private _mouseMoveCallback: TimerViewMouseMoveCallback | null;
    private _buttonAreaClickCallback: TimerViewButtonAreaClickCallback | null;

    constructor() {
        this._main = document.getElementById('main');
        this._buttonArea = document.getElementById('buttonarea');
        this._min = document.getElementById('min');
        this._sec = document.getElementById('sec');
        this._startOrStop = document.getElementById('startorstop');

        this._urlSearchParamsCallback = null;
        this._mouseMoveCallback = null;
        this._buttonAreaClickCallback = null;

        this.bindMouseMoveEvent();
    }

    private bindButtonAreaClickEvent(): void {
        this._buttonArea?.addEventListener('click', () => {
            this._buttonAreaClickCallback?.();
        });
    }

    private bindMouseMoveEvent(): void {
        this._main?.addEventListener('mousemove', (event) => {
            if (this._buttonArea && `clientHeight` in this._buttonArea && event.clientX >= this._buttonArea.clientHeight) {
                this._mouseMoveCallback?.(true);
            } else {
                this._mouseMoveCallback?.(false);
            }
        });
    }

    public contentEditable(value: boolean): void {
        if (this._min) {
            this._min.contentEditable = value ? 'true' : 'false';
        }
        if (this._sec) {
            this._sec.contentEditable = value ? 'true' : 'false';
        }
    }

    set urlSearchParamsCallback(value: TimerViewURLSearchParamsCallback) {
        this._urlSearchParamsCallback = value;
        this._urlSearchParamsCallback(this.urlSearchParams);
    }

    set mouseMoveCallback(value: TimerViewMouseMoveCallback) {
        this._mouseMoveCallback = value;
    }

    set buttonAreaClickCallback(value: TimerViewButtonAreaClickCallback) {
        this._buttonAreaClickCallback = value;
        this.bindButtonAreaClickEvent();
    }

    get urlSearchParams(): URLSearchParams {
        return new URLSearchParams(window.location.search);
    }

    public setURLSearchParam(key: string, value: string): void {
        const searchParams = this.urlSearchParams;
        searchParams.set(key, value);
        window.history.replaceState(null, "", '?' + searchParams.toString());
    }

    get min(): number {
        return parseInt(this._min?.textContent || '0');
    }

    set min(value: number) {
        if (this._min) {
            this._min.textContent = value.toString().padStart(2, '0');
        }
    }

    get sec(): number {
        return parseInt(this._sec?.textContent || '0');
    }

    set sec(value: number) {
        if (this._sec) {
            this._sec.textContent = value.toString().padStart(2, '0');
        }
    }

    public showStart(): void {
        if (this._startOrStop) {
            this._startOrStop.textContent = 'Start';
        }
    }

    public showStop(): void {
        if (this._startOrStop) {
            this._startOrStop.textContent = 'Stop';
        }
    }

    public addMoveClass(): void {
        if (this._buttonArea) {
            this._buttonArea.classList.add('move');
        }
    }

    public removeMoveClass(): void {
        if (this._buttonArea) {
            this._buttonArea.classList.remove('move');
        }
    }

    public focus(): void {
        if (this._min) {
            window.focus();
        }
    }

    public launchUrl(url: string): void {
        window.open(url, '_blank');
    }
}

export interface TimerViewURLSearchParamsCallback {
    (searchParams: URLSearchParams): void;
}

export interface TimerViewMouseMoveCallback {
    (isHover: boolean): void;
}

export interface TimerViewButtonAreaClickCallback {
    (): void;
}