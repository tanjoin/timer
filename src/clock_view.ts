export class ClockView {
    private readonly _min: HTMLElement | null;
    private readonly _sec: HTMLElement | null;
    private readonly _startOrStop: HTMLElement | null;
    private readonly _buttonArea: HTMLElement | null;
    private readonly _main: HTMLElement | null;

    hoverCallback: ((isHover: boolean) => void) | null = null;
    clickCallback: (() => void) | null = null;

    private readonly _handleMouseMove = (event: MouseEvent): void => {
        if (this._buttonArea && event.clientY <= this._buttonArea.clientHeight) {
            this.hoverCallback?.(true);
        } else {
            this.hoverCallback?.(false);
        }
    };

    private readonly _handleClick = (): void => {
        this.clickCallback?.();
    };

    constructor() {
        this._min = document.getElementById('min');
        this._sec = document.getElementById('sec');
        this._startOrStop = document.getElementById('startOrStop');
        this._buttonArea = document.getElementById('buttonarea');
        this._main = document.getElementById('main');
    }

    activate(): void {
        if (this._min) this._min.contentEditable = 'false';
        if (this._sec) this._sec.contentEditable = 'false';
        this.showLabel('');
        this.removeMoveClass();
        this.showCurrentTime();
        this._main?.addEventListener('mousemove', this._handleMouseMove);
        this._buttonArea?.addEventListener('click', this._handleClick);
    }

    deactivate(): void {
        this._main?.removeEventListener('mousemove', this._handleMouseMove);
        this._buttonArea?.removeEventListener('click', this._handleClick);
    }

    showCurrentTime(): void {
        const now = new Date();
        if (this._min) this._min.textContent = now.getHours().toString().padStart(2, '0');
        if (this._sec) this._sec.textContent = now.getMinutes().toString().padStart(2, '0');
    }

    showLabel(label: string): void {
        if (this._startOrStop) this._startOrStop.textContent = label;
    }

    addMoveClass(): void {
        this._buttonArea?.classList.add('move');
    }

    removeMoveClass(): void {
        this._buttonArea?.classList.remove('move');
    }
}
