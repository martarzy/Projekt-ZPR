namespace model {
    export enum ActionMode {
        NONE, BUILD, SELL, MORTGAGE, UNMORTGAGE
    }

    export class Round {
        private playerMoved_: boolean;
        private currentMode_: ActionMode;

        constructor() {
            this.reset();
        }

        set mode(mode: ActionMode) {
            this.currentMode_ = mode;
        }

        get mode(): ActionMode {
            return this.currentMode_;
        }

        get movementPerformed(): boolean {
            return this.playerMoved_;
        }

        playerMoved() {
            this.playerMoved_ = true;
        }

        reset() {
            this.playerMoved_ = false;
            this.currentMode_ = ActionMode.NONE
        }
    }
}