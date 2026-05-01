import { SoundModel } from './sound_model.js';
export class SoundController {
    constructor() {
        this._model = new SoundModel();
    }
    playSound() {
        this._model.play();
    }
    playPreSound() {
        this._model.playSilent();
    }
}
