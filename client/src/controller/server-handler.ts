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

        /**
         * Dispathes handler provided in the installHandlers method
         * by the value of the 'message' field.
         * @param msgFromServer
         */
        handle(msgFromServer: any): void {
            this.handlers
                .getValue(msgFromServer[message.messageTitle])
                .call(this, msgFromServer);
        }

        /**
         * Message specifying if proposed username is unique and correct ( not empty ).
         * If yes the modal with join message is closed. Otherwise the type of error
         * is displayed on the modal window.
         * @param object
         */
        private nameAccepted(object: any): void {
            const nameWasAccepted: boolean = object[message.NameAccepted.decision];
            if (nameWasAccepted)
                this.viewChanges_.closeJoinModal();   
            else
                this.viewChanges_.displayErrorMessage(object[message.NameAccepted.reason]);
        }

        /**
         * Message specifying the users in the game. The usernames are displayed on the
         * users list and added to model. If at least 2 players are on the list the "Ready"
         * button is enabled ( when all players press this button game starts ).
         * @param object
         */
        private usersList(object: any): void {
            const usernames: Array<string> = object[message.UserList.usernamesList];
            this.replacePlayers(usernames);
            this.updatePlayerList();
            this.viewChanges_.enableReadyIf(usernames.length >= 2);
        }

        /**
         * Removes players stored in model and adds those specified on the argument.
         * @param usernames usernames of players who need to be stored in model
         */
        private replacePlayers(usernames: Array<string>): void {
            this.model_.users.removeAll();
            for (let i = 0; i < usernames.length; ++i)
                this.model_.users.addNew(usernames[i], this.playersColors_.getColor(i));
        }

        /**
         * Converts all players from model to the DTO objects and passes the array
         * to the view changes class which changes the users displayed on the user list.
         */
        private updatePlayerList(): void {
            const dtoData = this.model_.users.getAll().map(player => this.toPlayerDTO(player));
            this.viewChanges_.updatePlayersList(dtoData);
        }

        /**
         * Converts given player to the DTO object.
         * @param player player to convert
         */
        private toPlayerDTO(player: model.Player): view.PlayerDTO {
            let dto = new view.PlayerDTO();
            dto.username = player.username;
            dto.cash = player.cash;
            dto.active = this.model_.users.activeUsername() === player.username;
            dto.color = player.color;
            return dto;
        }

        /**
         * Initializes the model ( creates pawn for each player in model ) and view.
         * @param object
         */
        private gameStarts(object: any): void {
            const players = this.model_.users.getAll();
            this.model_.board.placePawnsOnBoard(players);
            this.viewChanges_.startGame(players.map(player => this.toPlayerDTO(player)));
        }

        /**
         * Sets new active player. Changes the visibility of buttons on the
         * field card ( buy / sell / mortgage / unmortgage ). Resets data
         * stored in the round class ( counter of moving pawns excluded ).
         * Updates player list to distinguish new active. If the client is
         * active enables buttons available at the start of the round and
         * modify available possibilities if user is in jail.
         * @param object
         */
        private newTurn(object: any): void {
            const newActive: string = object[message.NewTurn.activePlayer];
            this.model_.users.setActive(newActive);
            this.userActions_.updateVisibilityOfDynamicButtons();
            this.model_.round.reset();
            this.updatePlayerList();
            this.doIfMyTurn(this.newTurnActiveOnly);
        }

        private newTurnActiveOnly(): void {
            this.viewChanges_.enableButtonsOnRoundStart();
            this.updateStateIfInJail(this.model_.users.myUsername());
        }

        /**
         * Enables buttons potentially providing cash to inprisoned user.
         * Enables buttons giving chance to exit jail if requirements
         * are met ( 50$ or available jail exit card).
         * @param username
         */
        private updateStateIfInJail(username: string): void {
            if (!this.imInJail())
                return;
            this.viewChanges_.enableButtonsProvidingCash();
            const me = this.model_.users.getMe();
            const canPay = me.cash >= 50;
            const canUseCard = me.jailExitCards > 0;
            this.viewChanges_.showJailExitOptions(canPay, canUseCard);
        }

        /**
         * Handles player's movement. Passes dices results to the view and calls
         * method responsible for movement.
         * @param object
         */
        private someoneMoved(object: any): void {
            const username: string = object[message.PlayerMove.playerName];
            const rollValue: Array<number> = object[message.PlayerMove.movedBy];
            this.viewChanges_.showRollResults(rollValue[0], rollValue[1]);
            this.performMovement(username, rollValue[0] + rollValue[1]);
        }

        /**
         * If other movement is currently in progress it tries once again with
         * 100 ms timeout ( chance cards "go to" and "move" must wait for standard
         * after roll move to finish ). It increases moves in progress counter stored
         * in round class. Sets the flag that player moved already in this turn to
         * disable roll button in the future. It disables end of turn button while pawn
         * is moving.
         * @param username moving player's username
         * @param rollResult sum of dices results
         */
        private performMovement(username: string, rollResult: number): void {
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

        /**
         * Callback triggered when moving pawn stops.
         * @param field
         */
        private doOnPawnMoveEnd(field: model.Field): void {
            --this.model_.round.movementCommands;
            if (this.model_.round.movementCommands !== 0)
                return;
            this.doIfMyTurn(() => this.doOnPawnMoveEndIfIAmActive(field));
        }
        
        private doOnPawnMoveEndIfIAmActive(field: model.Field) {
            if (!this.model_.round.playerMoved)
                return;
            this.viewChanges_.enableBuyFieldIf(this.fieldMayBeBought(field));
            this.viewChanges_.enableEndOfTurnIf(this.model_.users.activeCash() >= 0);
        }

        /**
         * Handles cash change. It is complicated and could be split to smaller functions.
         * Unfortunately cash change has crucial meaning for interface. It depends if
         * player is in jail or out of it. If he has negative cash and can sell, mortgage
         * and trade only. It could be rewritten better way in the future.
         * @param object
         */
        private setCash(object: any): void {
            const player: string = object[message.SetCash.target];
            const cash: number = object[message.SetCash.amount];

            const cashChangedSign = this.isMyTurn()
                                  && cash >= 0
                                  && this.model_.users.activeCash() < 0;

            this.model_.users.setCash(player, cash);
            this.updatePlayerList();

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
        private tradeRequest(object: any): void {
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

        /**
         * Changes ownership of traded fields in model and view. Clears temporary data
         * about trade in the round class. Enables buttons available after trade.
         * @param object
         */
        private tradeAnswer(object: any): void {
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

        /**
         * Changes owner of given fields and recolors them on the board.
         * @param ids fields changing owner
         * @param username new owner of fields specified in first argument
         */
        private changeOwnerAndRecolor(ids: Array<number>, username: string): void {
            this.model_.board.changeOwner(ids, username);
            this.recolorFields(ids, this.model_.users.get(username).color);
        }

        private recolorFields(ids: Array<number>, color: string): void {
            ids.forEach(f => this.viewChanges_.colorField(f, color));
        }

        /**
         * Most complicated method among the handlers. It could be changed to a map
         * whith 'furtherDispatchInfo' as a key. Handles chances cards and logs them in the view.
         * @param object
         */
        private chanceCard(object: any) {
            const furtherDispatchInfo: string = object[message.ChanceCard.action];
            const activeUsername = this.model_.users.activeUsername();
            switch (furtherDispatchInfo) {
                case "goto":
                    const field = object[message.ChanceCard.field];
                    this.moveTo(activeUsername, field);
                    this.logWithActiveUsername(`Otrzymał kartę szansy "Idź na pole ${field}"`);
                    break;
                case "move":
                    const move = object[message.ChanceCard.move];
                    this.performMovement(activeUsername, move);
                    this.logWithActiveUsername(`Otrzymał kartę szansy przesuwającą go o ${move}`);
                    break;
                case "getOut":
                    if (!this.isMyTurn())
                        return;
                    ++this.model_.users.get(activeUsername).jailExitCards;
                    this.logWithActiveUsername(`Otrzymał kartę szansy "Wyjdź z więzienia"`);
                    break;
                case "cash":
                    this.logWithActiveUsername(`Otrzymał kartę szansy zmieniającą jego stan konta o ${object[message.ChanceCard.cash]}`);
                    break;
                case "gotoJail":
                    if (this.model_.board.getField(this.model_.users.activeUsername()).id !== 30)
                        this.logWithActiveUsername(`Otrzymał kartę szansy "Idź do więzienia"`);
                    if (this.isMyTurn())
                        this.model_.users.getMe().inJail = true;
                    this.moveTo(activeUsername, model.Board.JAIL_FIELD_NUMBER);
                    break;
            }
            this.userActions_.updateVisibilityOfDynamicButtons();
        }

        /**
         * Logs given message in the history panel with the active username as the prefix.
         * @param message
         */
        private logWithActiveUsername(message: string) {
            this.viewChanges_.logMessage(`[ ${this.model_.users.activeUsername()} ]: ${message}`);
        }

        /**
         * Twin version of the performMovement. Differs only with method
         * of changing the field. It definitely should be merged with mentioned method
         * somehow. 
         * @param username player who moves
         * @param fieldId target field
         */
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
            this.logWithActiveUsername("Zbankrutował");
        }

        private gameOver(object: any) {
            this.viewChanges_.showGameOverScreen("Zwycięzcą został " + object[message.GameOver.winner] + "!");
        }

        private removeUser(object: any) {
            const username: string = object[message.PlayerDisconnected.player];
            this.model_.users.removeSingle(username);
            const cleared: Array<number> = this.model_.board.clearOwner(username);
            this.recolorFields(cleared, "white");
            this.updatePlayerList()
        }

        private doIfMyTurn(job: () => void) {
            if (this.isMyTurn())
                job.call(this);
        }

        /**
         * Utility method to shorten repeating check for my turn.
         */
        private isMyTurn(): boolean {
            return this.model_.users.isMyTurn();
        }

        private imInJail(): boolean {
            return this.model_.users.getMe().inJail;
        }

        private fieldMayBeBought(field: model.Field): boolean {
            return field.isBuyable()
                && field.fieldCost <= this.model_.users.activeCash();
        }
    }
}
