namespace message {

    export const messageTitle = "message";

    export class MyName {
        static get message(): string {
            return "myName";
        }

        static get name(): string {
            return "myName";
        }
    }

    export class NameAccepted {
        static get message(): string {
            return "nameAccepted";
        }

        static get decision(): string {
            return "valid";
        }

        static get reason(): string {
            return "error";
        }
    }

    export class Ready {
        static get message(): string {
            return "ready";
        }
    }

    export class RollDice {
        static get message(): string {
            return "rollDice";
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

    export class UserList {
        static get message(): string {
            return "userList";
        }

        static get usernamesList(): string {
            return "userList";
        }
    }

    export class PlayerMove {
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

    export class Start {
        static get message(): string {
            return "start";
        }
    }

    export class SetCash {
        static get message(): string {
            return "setCash";
        }

        static get target(): string {
            return "player";
        }

        static get amount(): string {
            return "cash";
        }
    }

    export class BuyField {
        static get message(): string { return "buyField"; }
    }

    export class EndOfTurn {
        static get message(): string { return "endOfTurn"; }
    }

    export class UserBought {
        static get message(): string { return "userBought"; }
        static get buyerName(): string { return "username"; }
    }

}