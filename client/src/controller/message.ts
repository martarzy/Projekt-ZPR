namespace message {

    export const messageTitle = "message";

    export class UsernameChoice {
        static get message(): string {
            return "myName";
        }

        static get name(): string {
            return "myName";
        }
    }

    export class UsernameValidation {
        static get message(): string {
            return "nameAccepted";
        }

        static get decision(): string {
            return "valid";
        }
    }

    export class UserIsReady {
        static get message(): string {
            return "ready";
        }
    }

    export class RollDice {
        static get message(): string {
            return "rollDice";
        }
    }

    export class RollResult {
        static get message(): string {
            return "rollResult";
        }

        static get result(): string {
            return "rollResult";
        }
    }

    export class NewTurn {
        static get message(): string {
            return "newTurn";
        }

        static get activePlayer(): string {
            return "player";
        }
    }

    export class UsernamesObtained {
        static get message(): string {
            return "userList";
        }

        static get info(): string {
            return "userList";
        }
    }

    export class OtherPlayerMoved {
        static get message(): string {
            return "playerMove";
        }

        static get playerName(): string {
            return "player";
        }

        static get movedBy(): string {
            return "move";
        }
    }

    export class GameReset {
        static get message(): string {
            return "reset";
        }
    }

    export class GameStart {
        static get message(): string {
            return "start";
        }
    }

}