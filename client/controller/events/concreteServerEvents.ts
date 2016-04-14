/// <reference path="./serverEvent.ts" />
/// <reference path="../protocol.ts" />

namespace events {

    export class UsernameValidationEvent extends ServerEvent {
        constructor() {
            super(protocol.UsernameValidation.message);
        }

        get isValid(): boolean {
            return this[protocol.UsernameValidation.decision];
        }
    }


    export class RollResultEvent extends ServerEvent {
        constructor() {
            super(protocol.RollResult.message);
        }

        getResult() {
            return this[protocol.RollResult.result];
        }
    }

    export class NewTurnEvent extends ServerEvent {
        constructor() {
            super(protocol.NewTurn.message);
        }

        getActivePlayer() {
            return this[protocol.NewTurn.activePlayer];
        }
    }

    export class UsernamesObtainedEvent extends ServerEvent {
        constructor() {
            super(protocol.UsernamesObtained.message);
        }

        getUsernames(): Array<string> {
            return this[protocol.UsernamesObtained.info];
        }
    }

    export class OtherPlayerMovedEvent extends ServerEvent {
        constructor() {
            super(protocol.OtherPlayerMoved.message);
        }

        getPlayerName() {
            return this[protocol.OtherPlayerMoved.playerName];
        }

        movedBy() {
            return this[protocol.OtherPlayerMoved.movedBy];
        }
    }

    export class GameStartEvent extends ServerEvent {
        constructor() {
            super(protocol.GameStart.message);
        }
    }

    export class GameResetEvent extends ServerEvent {
        constructor() {
            super(protocol.GameReset.message);
        }
    }

}