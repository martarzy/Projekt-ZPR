/// <reference path="message.ts" />
/// <reference path="view-changes.ts" />
/// <reference path="../model/model.ts" />
/// <reference path="../../lib/collections.d.ts" />

namespace controller {

    type EventHandler = (object: any) => void;

    export class ServerHandler {
        private handlers = new collections.Dictionary<string, EventHandler>();
        private colorManager_: model.Colors;

        constructor(private model: model.Model,
            private viewChanges_: ViewChanges,
            private userActions_: UserActions) {
            this.installHandlers();
            this.initialise();
        }

        private initialise() {
            this.colorManager_ = new model.Colors();
        }

        private installHandlers(): void {
            this.handlers.setValue(message.NameAccepted.message, this.nameAccepted);
            this.handlers.setValue(message.UserList.message, this.synchUsers);
            this.handlers.setValue(message.Start.message, this.gameStarts);
            this.handlers.setValue(message.PlayerMove.message, this.someoneMoved);
            this.handlers.setValue(message.NewTurn.message, this.newTurn);
            this.handlers.setValue(message.SetCash.message, this.setCash);
            this.handlers.setValue(message.UserBought.message, this.userBought);
            this.handlers.setValue(message.InvalidOperation.message, this.invalidOperation);
            this.handlers.setValue(message.UserBoughtHouse.message, this.userBoughtHouse);
            this.handlers.setValue(message.UserSoldHouse.message, this.userSoldHouse);
            this.handlers.setValue(message.UserMortgaged.message, this.userMortgagedField);
            this.handlers.setValue(message.UserUnmortgaged.message, this.userUnmortgagedField);
            this.handlers.setValue(message.Trade.message, this.tradeRequest);
            this.handlers.setValue(message.TradeAnswer.message, this.tradeAnswer);
            this.handlers.setValue(message.ChanceCard.message, this.chanceCard);
            this.handlers.setValue(message.DeclareBankruptcy.message, this.activeUserBankrupted);
            this.handlers.setValue(message.GameOver.message, this.gameOver);
        }

        handle(msgFromServer: any): void {
            this.handlers
                .getValue(msgFromServer[message.messageTitle])
                .call(this, msgFromServer);
        }

        private nameAccepted(object: any): void {
            if (!object[message.NameAccepted.decision]) {
                const errorMessage = object[message.NameAccepted.reason];
                this.viewChanges_.errorMessage(errorMessage);
                return;
            }
            this.viewChanges_.disableAllButtons();
            this.viewChanges_.showJoinModal(false);
        }

        private synchUsers(object: any): void {
            const usernames: string[] = object[message.UserList.usernamesList];
            this.model.users.removeAll();
            for (let i = 0; i < usernames.length; ++i)
                this.model.users.addNew(usernames[i], this.colorManager_.getColor(i));
            this.viewChanges_.enable(view.ViewElement.READY_BTN, usernames.length >= 2);
            this.updatePlayerList(this.model.users.getAll());
        }

        private gameStarts(object: any): void {
            this.model.board.placePawnsOnBoard(this.model.users.getAll());
            let playersDTO = this.playersToPlayersDTO(this.model.users.getAll());
            this.viewChanges_.startGame(playersDTO);
        }

        private someoneMoved(object: any): void {
            const username: string = object[message.PlayerMove.playerName];
            const rollResult: number = object[message.PlayerMove.movedBy];
            this.model.round.playerMoved = true;
            this.performMovement(username, rollResult);
        }

        private performMovement(username: string, rollResult: number) {
            this.model.board.movePawnBy(username, rollResult);

            const field = this.model.board.getField(username);
            this.viewChanges_.movePawn(username, field.id, this.doOnPawnMoveEnd.bind(this, field));
        }

        private updateModelIfInJail(username: string) {
            if (!this.model.users.isMyTurn()
                || !this.model.users.getMe().inJail)
                return;
            this.viewChanges_.enableButtonsForCashBelowZero();
            const me = this.model.users.getMe();
            const canPay = me.cash >= 50;
            const canUseCard = me.jailExitCards > 0;
            this.viewChanges_.showJailExitOptions(canPay, canUseCard);
        }

        private doOnPawnMoveEnd(field: model.Field): void {
            if (!this.model.users.isMyTurn())
                return;
            console.log("On pawn move");
            if (this.model.users.activeCash() >= 0)
                this.viewChanges_.enable(view.ViewElement.END_TURN_BTN, true);
            this.viewChanges_.enable(view.ViewElement.BUY_FIELD_BTN, field.isBuyable()
                                                                     && field.cost <= this.model.users.activeCash());
        }

        private newTurn(object: any): void {
            const newActive: string = object[message.NewTurn.activePlayer];
            this.model.users.setActive(newActive);
            this.model.round.reset();
            if (this.model.users.isMyTurn()) {
                this.viewChanges_.enableButtonsOnRoundStart();
                if (this.model.users.getMe().inJail)
                    this.updateModelIfInJail(this.model.users.myUsername());
            }                
            this.updatePlayerList(this.model.users.getAll());
        }

        private updatePlayerList(players: Array<model.Player>) {
            let toPrint = this.playersToPlayersDTO(this.model.users.getAll());
            this.viewChanges_.updatePlayerList(toPrint);
        }

        private playersToPlayersDTO(players: Array<model.Player>): Array<view.PlayerDTO> {
            return players.map(player => this.playerToPlayerDTO(player));
        }

        private playerToPlayerDTO(player: model.Player): view.PlayerDTO {
            let dto = new view.PlayerDTO();
            dto.username = player.username;
            dto.cash = player.cash;
            dto.active = this.model.users.activeUsername() === player.username;
            dto.color = player.color;
            return dto;
        }

        private setCash(object: any): void {
            const target: string = object[message.SetCash.target];
            const cash: number = object[message.SetCash.amount];

            const iAmNoLongerBelowZero = this.model.users.isMyTurn()
                && cash >= 0
                && this.model.users.activeCash() < 0;

            this.model.users.setCash(target, cash);
            this.updatePlayerList(this.model.users.getAll());

            if (!this.model.users.isMyTurn()
                || target !== this.model.users.myUsername())
                return;
            this.updateModelIfInJail(this.model.users.myUsername());
            if (this.model.users.getMe().cash < 0)
                this.viewChanges_.enableButtonsForCashBelowZero();
            if (iAmNoLongerBelowZero)
                this.viewChanges_.enableButtonsForCashAboveZero();
        }

        private userBought(object: any): void {
            const currentPlayer = this.model.users.activeUsername();
            this.model.board.buyField(currentPlayer);
            this.viewChanges_.colorField(this.model.board.getField(currentPlayer).id,
                                         this.model.users.activeColor());
        }

        private invalidOperation(object: any): void {
            const error: string = object[message.InvalidOperation.error];
            console.log("ERROR: " + error);
        }

        private userBoughtHouse(object: any): void {
            const field: number = object[message.UserBoughtHouse.field];
            this.model.board.buyHouseOn(field);
            this.viewChanges_.drawHousesOnField(field, this.model.board.houseAmountOn(field));
            this.enableModeIfMyTurn(this.userActions_.activateBuildMode);
        }

        private userSoldHouse(object: any): void {
            const field: number = object[message.UserSoldHouse.field];
            this.model.board.sellHouseOn(field);
            this.viewChanges_.drawHousesOnField(field, this.model.board.houseAmountOn(field));
            this.enableModeIfMyTurn(this.userActions_.activateSellMode);
        }

        private userMortgagedField(object: any): void {
            const field: number = object[message.UserMortgaged.field];
            this.model.board.mortgageField(field);
            this.viewChanges_.mortgageField(field);
            this.enableModeIfMyTurn(this.userActions_.activateMortgageMode);
        }

        private userUnmortgagedField(object: any): void {
            const field: number = object[message.UserUnmortgaged.field];
            this.model.board.unmortgageField(field);
            this.viewChanges_.unmortgageField(field);
            this.enableModeIfMyTurn(this.userActions_.activateUnmortgageMode);
        }

        private enableModeIfMyTurn(modeActivateCallback: () => void) {
            if (this.model.users.isMyTurn())
                modeActivateCallback.call(this.userActions_);
        }

        private tradeRequest(object: any) {
            const targetUsername: string = object[message.Trade.otherUsername];
            if (this.model.users.myUsername() !== targetUsername)
                return;
            const offeredFields: Array<number> = object[message.Trade.offeredFields];
            const demandedFields: Array<number> = object[message.Trade.demandedFields];
            const offeredCash: number = object[message.Trade.offeredCash]; 
            const demandedCash: number = object[message.Trade.demandedCash];
            this.viewChanges_.showTradeOffer(offeredCash, offeredFields, demandedCash, demandedFields);
            this.viewChanges_.enable(view.ViewElement.ACCEPT_OFFER_BTN, true);
            this.viewChanges_.enable(view.ViewElement.DECLINE_OFFER_BTN, true);
        }

        private tradeAnswer(object: any) {
            const decision: boolean = object[message.TradeAnswer.decision];
            if (decision) {
                this.changeOwnerAndRecolor(this.model.round.offeredFields, this.model.round.tradingWith);
                this.changeOwnerAndRecolor(this.model.round.demandedFields, this.model.users.myUsername());
            }
            if (!this.model.users.isMyTurn())
                return;
            this.viewChanges_.enableButtonsOnRoundStart();
            if (this.model.round.playerMoved)
                this.viewChanges_.enable(view.ViewElement.ROLL_BTN, false);
            decision ? this.viewChanges_.tradeSuccessful() :
                this.viewChanges_.tradeUnsuccessful();
        }

        private changeOwnerAndRecolor(ids: Array<number>, username: string): void {
            this.model.board.changeOwner(ids, username);
            this.recolorFields(ids, username);
        }

        private recolorFields(ids: Array<number>, username: string): void {
            ids.forEach(f => this.viewChanges_.colorField(f, this.model.users.get(username).color));
        }

        private chanceCard(object: any) {
            const furtherDispatchInfo: string = object[message.ChanceCard.action];
            const activeUsername = this.model.users.activeUsername();
            switch (furtherDispatchInfo) {
                case "goto":
                    this.moveTo(activeUsername, object[message.ChanceCard.field]);
                    break;
                case "move":
                    this.performMovement(activeUsername, object[message.ChanceCard.move]);
                    break;
                case "getOut":
                    if (!this.model.users.isMyTurn())
                        return;
                    ++this.model.users.get(activeUsername).jailExitCards;
                    break;
                case "cash":
                    // Currently hadled by server. It sends setCash message.
                    break;
                case "gotoJail":
                    if (this.model.users.isMyTurn())
                        this.model.users.getMe().inJail = true;
                    this.moveTo(activeUsername, model.Board.JAIL_FIELD_NUMBER);
                    break;
            }
        }

        private moveTo(username: string, fieldId: number) {
            this.model.board.movePawnOn(username, fieldId);
            const field: model.Field = this.model.board.getField(username);
            this.viewChanges_.movePawn(username, field.id, this.doOnPawnMoveEnd.bind(this, field));
        }

        private activeUserBankrupted(object: any) {
            // TODO
            console.log("Active user bankrupted handler");
        }

        private gameOver(object: any) {
            // TODO
            console.log("Game over handler");
        }
    }

}
