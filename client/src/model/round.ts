namespace model {
    export class Round {
        private playerMoved_ = false;

        get movementPerformed(): boolean {
            return this.playerMoved_;
        }

        playerMoved() {
            this.playerMoved_ = true;
        }

        reset() {
            this.playerMoved_ = false;
        }
    }
}