namespace model.player {

    export enum PlayerStatus {
        NOT_READY, READY, ACTIVE, WAITING
    }

    export class Player {
        constructor(
            private _name: string,
            private _status: PlayerStatus = PlayerStatus.NOT_READY) {
        }

        get name(): string {
            return this._name;
        }

        get status(): PlayerStatus {
            return this._status;
        }

        isReadyToPlay() {
            this._status = PlayerStatus.READY;
        }

        startsTurn() {
            this._status = PlayerStatus.ACTIVE;
        }

        endsTurn() {
            this._status = PlayerStatus.WAITING;
        }
    }

}