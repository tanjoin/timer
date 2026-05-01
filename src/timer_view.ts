export class TimerView {
    private readonly _main: HTMLElement | null;
    private readonly _buttonArea: HTMLElement | null;
    private readonly _min: HTMLElement | null;
    private readonly _sec: HTMLElement | null;
    private readonly _startOrStop: HTMLElement | null;

    mouseMoveCallback: ((isHover: boolean) => void) | null = null;
    buttonAreaClickCallback: (() => void) | null = null;

    private readonly _handleMouseMove = (event: MouseEvent): void => {
        if (this._buttonArea && event.clientY <= this._buttonArea.clientHeight) {
            this.mouseMoveCallback?.(true);
        } else {
            this.mouseMoveCallback?.(false);
        }
    };

    private readonly _handleClick = (): void => {
        this.buttonAreaClickCallback?.();
    };

    constructor() {
        this._main = document.getElementById('main');
        this._buttonArea = document.getElementById('buttonarea');
        this._min = document.getElementById('min');
        this._sec = document.getElementById('sec');
        this._startOrStop = document.getElementById('startOrStop');
    }

    activate(isRunning: boolean): void {
        this.contentEditable(!isRunning);
        if (isRunning) {
            this.showStop();
            this.addMoveClass();
        } else {
            this.showStart();
            this.removeMoveClass();
        }
        this._main?.addEventListener('mousemove', this._handleMouseMove);
        this._buttonArea?.addEventListener('click', this._handleClick);
    }

    deactivate(): void {
        this._main?.removeEventListener('mousemove', this._handleMouseMove);
        this._buttonArea?.removeEventListener('click', this._handleClick);
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

    public contentEditable(value: boolean): void {
        if (this._min) this._min.contentEditable = value ? 'true' : 'false';
        if (this._sec) this._sec.contentEditable = value ? 'true' : 'false';
    }

    public showStart(): void {
        if (this._startOrStop) this._startOrStop.textContent = 'Start';
    }

    public showStop(): void {
        if (this._startOrStop) this._startOrStop.textContent = 'Stop';
    }

    public addMoveClass(): void {
        this._buttonArea?.classList.add('move');
    }

    public removeMoveClass(): void {
        this._buttonArea?.classList.remove('move');
    }

    public focus(): void {
        window.focus();
    }

    public launchUrl(url: string): void {
        window.open(url, '_blank');
    }
}