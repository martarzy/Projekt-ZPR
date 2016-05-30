namespace model {
    export enum ActionMode {
        NONE, BUILD, SELL, COLLATERALIZE
    }

    export class Round {
        private playerMoved_: boolean;
        private currentMode_: ActionMode;

        constructor() {
            this.reset();
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