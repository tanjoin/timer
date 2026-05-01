export class ClockModel {
    constructor() {
        this._target = null;
        this._targetReached = false;
    }
    get target() {
        return this._target;
    }
    get targetReached() {
        return this._targetReached;
    }
    setTarget(target) {
        const matched = target.match(/^(\d{1,2}):(\d{2})$/);
        if (!matched)
            return false;
        const hour = parseInt(matched[1], 10);
        const minute = parseInt(matched[2], 10);
        if (hour < 0 || hour > 23 || minute < 0 || minute > 59)
            return false;
        this._target = target;
        this._targetReached = false;
        return true;
    }
    // 目標時刻に到達したか確認。初めて到達した場合のみ true を返す
    checkTargetReached() {
        if (!this._target || this._targetReached)
            return false;
        const now = new Date();
        const matched = this._target.match(/^(\d{1,2}):(\d{2})$/);
        if (!matched)
            return false;
        const h = parseInt(matched[1], 10);
        const m = parseInt(matched[2], 10);
        if (now.getHours() === h && now.getMinutes() === m) {
            this._targetReached = true;
            return true;
        }
        return false;
    }
    resetTargetReached() {
        this._targetReached = false;
    }
}
