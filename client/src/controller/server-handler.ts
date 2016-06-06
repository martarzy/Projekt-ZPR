/// <reference path="message.ts" />
/// <reference path="view-changes.ts" />
/// <reference path="../model/model.ts" />
/// <reference path="../../lib/collections.d.ts" />

namespace controller {

    type EventHandler = (object: any) => void;

    /**
     * Handles messages coming from server. Stores map of handlers
     * and calls them depending on "message" property of obtained object.
     */
    export class ServerHandler {
        private handlers = new collections.Dictionary<string, EventHandler>();
        private playersColors_: model.Colors;

        /**
         * Initializes handlers and creates object managing colors
         * available to users.
         * @param model_
         * @param viewChanges_
         * @param userActions_
         */
        constructor(private model_: model.Model,
            private viewChanges_: ViewChanges,
            private userActions_: UserActions) {
            this.installHandlers();
            this.initialise();
        }

        private initialise() {
            this.playersColors_ = new model.Colors();
        }

        private installHandlers(): void {
            this.handlers.setValue(message.NameAccepted.message, this.nameAccepted);
            this.handlers.setValue(message.UserList.message, this.usersList);
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
            this.handlers.setValue(message.PlayerDisconnected.message, this.removeUser);
        }

        handle(msgFromServer: any): void {
            this.handlers
                .getValue(msgFromServer[message.messageTitle])
                .call(this, msgFromServer);
        }

        private doIfMyTurn(job: () => void) {
            if (this.isMyTurn())
                job.call(this);
        }

        private isMyTurn(): boolean {
            return this.model_.users.isMyTurn();
        }

        private nameAccepted(object: any): void {
            const nameWasAccepted: boolean = object[message.NameAccepted.decision];
            if (nameWasAccepted)
                this.viewChanges_.closeJoinModal();   
            else
                this.viewChanges_.displayErrorMessage(object[message.NameAccepted.reason]);
        }

        private usersList(object: any): void {
            const usernames: Array<string> = object[message.UserList.usernamesList];
            this.replacePlayers(usernames);
            this.updatePlayerList(this.model_.users.getAll());
            this.viewChanges_.enableReadyIf(usernames.length >= 2);
        }

        private replacePlayers(usernames: Array<string>): void {
            this.model_.users.removeAll();
            for (let i = 0; i < usernames.length; ++i)
                this.model_.users.addNew(usernames[i], this.playersColors_.getColor(i));
        }

        private updatePlayerList(players: Array<model.Player>) {
            const dtoData = this.model_.users.getAll().map(player => this.toPlayerDTO(player));
            this.viewChanges_.updatePlayersList(dtoData);
        }

        private toPlayerDTO(player: model.Player): view.PlayerDTO {
            let dto = new view.PlayerDTO();
            dto.username = player.username;
            dto.cash = player.cash;
            dto.active = this.model_.users.activeUsername() === player.username;
            dto.color = player.color;
            return dto;
        }

        private gameStarts(object: any): void {
            const players = this.model_.users.getAll();
            this.model_.board.placePawnsOnBoard(players);
            this.viewChanges_.startGame(players.map(player => this.toPlayerDTO(player)));
        }

        private newTurn(object: any): void {
            const newActive: string = object[message.NewTurn.activePlayer];
            this.model_.users.setActive(newActive);
            this.userActions_.updateVisibilityOfDynamicButtons();
            this.model_.round.reset();
            this.updatePlayerList(this.model_.users.getAll());
            this.doIfMyTurn(this.newTurnActiveOnly);
        }

        private newTurnActiveOnly(): void {
            this.viewChanges_.enableButtonsOnRoundStart();
            this.updateStateIfInJail(this.model_.users.myUsername());
        }

        private updateStateIfInJail(username: string) {
            if (!this.imInJail())
                return;
            this.viewChanges_.enableButtonsProvidingCash();
            const me = this.model_.users.getMe();
            const canPay = me.cash >= 50;
            const canUseCard = me.jailExitCards > 0;
            this.viewChanges_.showJailExitOptions(canPay, canUseCard);
        }

        private someoneMoved(object: any): void {
            const username: string = object[message.PlayerMove.playerName];
            const rollValue: Array<number> = object[message.PlayerMove.movedBy];
            this.viewChanges_.showRollResults(rollValue[0], rollValue[1]);
            this.performMovement(username, rollValue[0] + rollValue[1]);
        }

        private performMovement(username: string, rollResult: number) {
            if (this.model_.round.movementCommands > 0) {
                setTimeout(this.performMovement.bind(this, username, rollResult), 100);
                return;
            }
            ++this.model_.round.movementCommands;
            this.model_.board.movePawnBy(username, rollResult);
            this.doIfMyTurn(() => this.model_.round.playerMoved = true);
            const field = this.model_.board.getField(username);
            this.viewChanges_.disableButtonsWhilePawnIsMoving();
            this.viewChanges_.movePawn(username, field.id, this.doOnPawnMoveEnd.bind(this, field), rollResult > 0);
        }

        private doOnPawnMoveEnd(field: model.Field): void {
            --this.model_.round.movementCommands;
            if (this.model_.round.movementCommands !== 0)
                return;
            this.doIfMyTurn(() => this.doOnPawnMoveEndIfIAmActive(field));
        }

        private doOnPawnMoveEndIfIAmActive(field: model.Field) {
            // this condition checks if the active player hasn't changed
            if (!this.model_.round.playerMoved)
                return;
            this.viewChanges_.enableBuyFieldIf(this.fieldMayBeBought(field));
            this.viewChanges_.enableEndOfTurnIf(this.model_.users.activeCash() >= 0);
        }

        private imInJail(): boolean {
            return this.model_.users.getMe().inJail;
        }

        private fieldMayBeBought(field: model.Field): boolean {
            return field.isBuyable()
                && field.fieldCost <= this.model_.users.activeCash();
        }

        private setCash(object: any): void {
            const player: string = object[message.SetCash.target];
            const cash: number = object[message.SetCash.amount];

            const cashChangedSign = this.isMyTurn()
                                  && cash >= 0
                                  && this.model_.users.activeCash() < 0;

            this.model_.users.setCash(player, cash);
            this.updatePlayerList(this.model_.users.getAll());

            this.userActions_.updateVisibilityOfDynamicButtons();

            if ( !(this.isMyTurn() && player === this.model_.users.myUsername()) )
                return;
            // When player had to sell something because he didn't have 
            // other possibilities to exit jail.
            this.updateStateIfInJail(this.model_.users.myUsername());
            // Player must have positive cash on his account before end of turn.
            if (cash < 0)
                this.viewChanges_.enableButtonsProvidingCash();
            else if (cashChangedSign)
                this.viewChanges_.enableButtonsForAcceptableCash(this.model_.round.playerMoved);
            if (this.model_.round.movementCommands === 0)
                this.viewChanges_.enableBuyFieldIf(this.model_.board.enoughCashToBuyField(player, cash));
        }

        private userBought(object: any): void {
            const currentPlayer = this.model_.users.activeUsername();
            this.model_.board.buyField(currentPlayer);
            this.userActions_.updateVisibilityOfDynamicButtons();
            this.viewChanges_.disable(view.ID.BUY_FIELD);
            this.viewChanges_.colorField( this.model_.board.getField(currentPlayer).id,
                                       this.model_.users.activeColor() );
        }

        private invalidOperation(object: any): void {
            const error: string = object[message.InvalidOperation.error];
            console.log("ERROR: " + error);
        }

        private userBoughtHouse(object: any): void {
            const field: number = object[message.UserBoughtHouse.field];
            this.model_.board.buyHouseOn(field);
            this.userActions_.updateVisibilityOfDynamicButtons();
            this.viewChanges_.drawHousesOnField(field, this.model_.board.houseAmountOn(field));
        }

        private userSoldHouse(object: any): void {
            const field: number = object[message.UserSoldHouse.field];
            this.model_.board.sellHouseOn(field);
            this.userActions_.updateVisibilityOfDynamicButtons();
            this.viewChanges_.drawHousesOnField(field, this.model_.board.houseAmountOn(field));
        }

        private userMortgagedField(object: any): void {
            const field: number = object[message.UserMortgaged.field];
            this.model_.board.mortgageField(field);
            this.userActions_.updateVisibilityOfDynamicButtons();
            this.viewChanges_.mortgageField(field);
        }

        private userUnmortgagedField(object: any): void {
            const field: number = object[message.UserUnmortgaged.field];
            this.model_.board.unmortgageField(field);
            this.userActions_.updateVisibilityOfDynamicButtons();
            this.viewChanges_.unmortgageField(field);
        }

        /**
         * Handles trade request message. Stores fields proposed to exchange in the model
         * as the trade answer is only yes/no.
         * @param object
         */
        private tradeRequest(object: any) {
            const targetUsername: string = object[message.Trade.otherUsername];

            const offeredFields: Array<number> = object[message.Trade.offeredFields];
            const requiredFields: Array<number> = object[message.Trade.demandedFields];
            this.model_.round.offeredFields = offeredFields;
            this.model_.round.demandedFields = requiredFields;
            this.model_.round.tradingWith = targetUsername;

            if (this.model_.users.myUsername() !== targetUsername)
                return;

            const offeredCash: number = object[message.Trade.offeredCash]; 
            const demandedCash: number = object[message.Trade.demandedCash];
            const tradeToPresent = new model.TradeOfferDTO(offeredCash, demandedCash, offeredFields, requiredFields);
            this.viewChanges_.displayTradeInfo(tradeToPresent);
            this.viewChanges_.enableTradeDecisions();
        }

        private tradeAnswer(object: any) {
            const decision: boolean = object[message.TradeAnswer.decision];
            if (decision) {
                this.changeOwnerAndRecolor(this.model_.round.offeredFields, this.model_.round.tradingWith);
                this.changeOwnerAndRecolor(this.model_.round.demandedFields, this.model_.users.activeUsername());
            }
            this.model_.round.offeredFields = [];
            this.model_.round.demandedFields = [];
            if(this.model_.round.tradingWith === this.model_.users.myUsername())
                this.userActions_.clearViewAfterTradeDecision();
            if (!this.isMyTurn())
                return;
            this.viewChanges_.enableButtonsOnRoundStart();
            if (this.model_.round.playerMoved) {
                this.viewChanges_.disable(view.ID.ROLL);
                this.viewChanges_.enable(view.ID.END_TURN);
            }                
        }

        private changeOwnerAndRecolor(ids: Array<number>, username: string): void {
            this.model_.board.changeOwner(ids, username);
            this.recolorFields(ids, this.model_.users.get(username).color);
        }

        private recolorFields(ids: Array<number>, color: string): void {
            ids.forEach(f => this.viewChanges_.colorField(f, color));
        }

        private chanceCard(object: any) {
            const furtherDispatchInfo: string = object[message.ChanceCard.action];
            const activeUsername = this.model_.users.activeUsername();
            switch (furtherDispatchInfo) {
                case "goto":
                    const field = object[message.ChanceCard.field];
                    this.moveTo(activeUsername, field);
                    this.logWithActiveUsername("Chance card: Go to " + field);
                    break;
                case "move":
                    const move = object[message.ChanceCard.move];
                    this.performMovement(activeUsername, move);
                    this.logWithActiveUsername("Chance card: Move by " + move);
                    break;
                case "getOut":
                    if (!this.isMyTurn())
                        return;
                    ++this.model_.users.get(activeUsername).jailExitCards;
                    this.logWithActiveUsername("Chance card: You obtain free jail exit card.");
                    break;
                case "cash":
                    this.logWithActiveUsername("Chance card: Cash changed by " + object[message.ChanceCard.cash]);
                    break;
                case "gotoJail":
                    if (this.isMyTurn())
                        this.model_.users.getMe().inJail = true;
                    this.moveTo(activeUsername, model.Board.JAIL_FIELD_NUMBER);
                    this.logWithActiveUsername("Chance card: Go to jail");
                    break;
            }
            this.userActions_.updateVisibilityOfDynamicButtons();
        }

        private logWithActiveUsername(message: string) {
            this.viewChanges_.logMessage(`[ ${this.model_.users.activeUsername()} ]: ${message}`);
        }

        private moveTo(username: string, fieldId: number) {
            if (this.model_.round.movementCommands > 0) {
                setTimeout(this.moveTo.bind(this, username, fieldId), 100);
                return;
            }
            ++this.model_.round.movementCommands;
            this.model_.board.movePawnOn(username, fieldId);
            const field: model.Field = this.model_.board.getField(username);
            this.viewChanges_.disableButtonsWhilePawnIsMoving();
            this.viewChanges_.movePawn(username, field.id, this.doOnPawnMoveEnd.bind(this, field));
        }

        private activeUserBankrupted(object: any) {
            // TODO
            console.log("Active user bankrupted handler");
        }

        private gameOver(object: any) {
            this.viewChanges_.showGameOverScreen("Winner is " + object[message.GameOver.winner] + " !");
        }

        private removeUser(object: any) {
            const username: string = object[message.PlayerDisconnected.player];
            this.model_.users.removeSingle(username);
            const cleared: Array<number> = this.model_.board.clearOwner(username);
            this.recolorFields(cleared, "white");
            this.updatePlayerList(this.model_.users.getAll())
        }
    }

}
