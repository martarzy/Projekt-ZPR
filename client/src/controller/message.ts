/**
 * The only responsibility of this class is providing the names
 * of the properties appointed in the game protocol. Ex. myName message
 * has form of: { "message": "myName", "myName": "chosenUsername" }
 * where chosenUsername is set by the player. The controller uses it as:
 * @example obj[message.messageTitle] = message.MyName.message;
 */
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

    export class Trade {
        static get message(): string { return "trade"; }
        static get otherUsername(): string { return "otherUsername"; }
        static get offeredFields(): string { return "offeredFields"; }
        static get offeredCash(): string { return "offeredCash"; }
        static get demandedFields(): string { return "demandedFields"; }
        static get demandedCash(): string { return "demandedCash"; }
    }

    export class TradeAnswer {
        static get message(): string { return "tradeAcceptance"; }
        static get decision(): string { return "accepted"; }
    }

    /* Only one class for 4 protocol messages. Server dispatches
       message only by message field. */
    export class ChanceCard {
        static get message(): string { return "chance"; }
        static get action(): string { return "action"; }
        // GOTO
        static get field(): string { return "field"; }
        // MOVE
        static get move(): string { return "move"; }
        // CASH
        static get reason(): string { return "reason"; }
        static get cash(): string { return "cash"; }
    }

    export class GetOut {
        static get message(): string { return "getOut"; }
        static get method(): string { return "method"; }
    }

    export class DeclareBankruptcy {
        static get message(): string { return "declareBankruptcy"; }
    }

    export class GameOver {
        static get message(): string { return "gameOver"; }
    }
}