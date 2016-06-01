namespace message {

    export const messageTitle = "message";

    export class MyName {
        static get message(): string { return "myName"; } 
        static get name(): string { return "myName"; }
    }

    export class NameAccepted {
        static get message(): string { return "nameAccepted"; }
        static get decision(): string { return "valid"; }
        static get reason(): string { return "error"; }
    }

    export class Ready {
        static get message(): string { return "ready"; }
    }

    export class RollDice {
        static get message(): string { return "rollDice"; }
    }

    export class NewTurn {
        static get message(): string {  return "newTurn"; }
        static get activePlayer(): string { return "player"; }
    }

    export class UserList {
        static get message(): string { return "userList";  }
        static get usernamesList(): string { return "userList"; }
    }

    export class PlayerMove {
        static get message(): string { return "playerMove"; }
        static get playerName(): string { return "player"; }
        static get movedBy(): string { return "move"; }
    }

    export class Start {
        static get message(): string { return "start"; }
    }

    export class SetCash {
        static get message(): string { return "setCash"; }
        static get target(): string { return "player"; }
        static get amount(): string { return "cash"; }
    }

    export class BuyField {
        static get message(): string { return "buyField"; }
    }

    export class EndOfTurn {
        static get message(): string { return "endOfTurn"; }
    }

    export class UserBought {
        static get message(): string { return "userBought"; }
        static get username(): string { return "username"; }
    }

    export class InvalidOperation {
        static get message(): string { return "invalidOperation"; }
        static get error(): string { return "error"; }
    }

    export class BuyHouse {
        static get message(): string { return "buyHouse"; }
        static get field(): string { return "field"; }
    }

    export class SellHouse {
        static get message(): string { return "sellHouse"; }
        static get field(): string { return "field"; }
    }

    export class MortgageField {
        static get message(): string { return "TODO"; }
        static get field(): string { return "field"; }
    }

    export class UserBoughtHouse {
        static get message(): string { return "userBoughtHouse"; }
        static get field(): string { return "field"; }
    }

    export class UserSoldHouse {
        static get message(): string { return "userSoldHouse"; }
        static get field(): string { return "field"; }
    }

    export class Mortgage {
        static get message(): string { return "mortgage"; }
        static get field(): string { return "field"; }
    }

    export class UserMortgaged {
        static get message(): string { return "userMortgaged"; }
        static get field(): string { return "field"; }
    }

    export class UnmortgageField {
        static get message(): string { return "unmortgage"; }
        static get field(): string { return "field"; }
    }

    export class UserUnmortgaged {
        static get message(): string { return "userUnmortgaged"; }
        static get field(): string { return "field"; }
    }
}