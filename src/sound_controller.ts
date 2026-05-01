import { SoundModel } from './sound_model.js';

export class SoundController {

    private _model: SoundModel = new SoundModel();

    constructor() {
    }

    public playSound(): void {
        this._model.play();
    }

    public playPreSound(): void {
        this._model.playSilent();
    }
}