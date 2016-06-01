/// <reference path="message.ts" />
/// <reference path="view-changes.ts" />
/// <reference path="../model/model.ts" />
/// <reference path="../../lib/collections.d.ts" />

namespace controller {

    type EventHandler = (object: any) => void;

    export class ServerHandler {
        private handlers = new collections.Dictionary<string, EventHandler>();
        private colorManager_: model.ColorManager;

        constructor(private model: model.Model,
                    private viewChanges_: ViewChanges,
                    private userActions_: UserActions) {
            this.installHandlers();
            this.initialise();
        }

        private initialise() {
            this.colorManager_ = new model.ColorManager();
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
        }

        handle(msgFromServer: any): void {
            this.handlers
                .getValue(msgFromServer[message.messageTitle])
                .call(this, msgFromServer);
        }

        private nameAccepted(object: any): void {
            if (object[message.NameAccepted.decision])
                this.viewChanges_.disableAllButtons();
            const errorMessage = object[message.NameAccepted.reason];
            this.viewChanges_.errorMessage(errorMessage);
        }

        private synchUsers(object: any): void {
            const usernames: string[] = object[message.UserList.usernamesList];
            this.model.playersModel.removeAllPlayer();
            for (let i = 0; i < usernames.length; ++i)
                this.model.playersModel.addNewUser(usernames[i], this.colorManager_.getColor(i));
            if (usernames.length >= 2)
                this.viewChanges_.enable(ViewElement.READY_BTN, true);
            else
                this.viewChanges_.enable(ViewElement.READY_BTN, false);
            this.updatePlayerList(this.model.playersModel.getPlayers());
        }

        private gameStarts(object: any): void {
            this.model.boardModel.placePawnsOnBoard(this.model.playersModel.getPlayers());
            let playersDTO = this.playersToPlayersDTO(this.model.playersModel.getPlayers());
            this.viewChanges_.startGame(playersDTO);
        }

        private someoneMoved(object: any): void {
            const username: string = object[message.PlayerMove.playerName];
            const rollResult: number = object[message.PlayerMove.movedBy];

            this.model.boardModel.movePawn(username, rollResult);

            const field = this.model.boardModel.getField(username);
            this.viewChanges_.movePawn(username, field.id, () => {
                if (this.model.playersModel.myTurnInProgress()) {
                    this.model.round.playerMoved();
                    this.viewChanges_.enable(ViewElement.END_TURN_BTN, true);
                    if (field.isBuyable()
                        && field.cost <= this.model.playersModel.activePlayerFunds()) {
                        this.viewChanges_.enable(ViewElement.BUY_FIELD_BTN, true);
                    }
                }
            });
        }

        private newTurn(object: any): void {
            const newActive: string = object[message.NewTurn.activePlayer];
            this.model.playersModel.changeActivePlayer(newActive);
            this.model.round.reset();
            if (this.model.playersModel.myTurnInProgress())
                this.viewChanges_.enableButtonsOnRoundStart();
            this.updatePlayerList(this.model.playersModel.getPlayers());
        }

        private updatePlayerList(players: Array<model.Player>) {
            let toPrint = this.playersToPlayersDTO(this.model.playersModel.getPlayers());
            this.viewChanges_.updatePlayerList(toPrint);
        }

        private playersToPlayersDTO(players: Array<model.Player>): Array<view.PlayerDTO> {
            return players.map(player => this.playerToPlayerDTO(player));
        }

        private playerToPlayerDTO(player: model.Player): view.PlayerDTO {
            let dto = new view.PlayerDTO();
            dto.username = player.username;
            dto.cash = player.cash;
            dto.active = this.model.playersModel.activePlayerUsername() === player.username;
            dto.color = player.color;
            return dto;
        }

        private setCash(object: any): void {
            const target: string = object[message.SetCash.target];
            const cash: number = object[message.SetCash.amount];
            this.model.playersModel.setCash(target, cash);
            this.updatePlayerList(this.model.playersModel.getPlayers());
        }

        private userBought(object: any): void {
            const currentPlayer = this.model.playersModel.activePlayerUsername();
            this.model.boardModel.buyField(currentPlayer);
            this.viewChanges_.colorField(this.model.boardModel.getField(currentPlayer).id,
                                         this.model.playersModel.activePlayerColor());
        }

        private invalidOperation(object: any): void {
            const error: string = object[message.InvalidOperation.error];
            console.log("ERROR: " + error);
        }

        private userBoughtHouse(object: any): void {
            const field: number = object[message.UserBoughtHouse.field];
            this.model.boardModel.buyHouseOn(field);
            this.viewChanges_.drawHousesOnField(field, this.model.boardModel.houseAmountOn(field));
            if (this.model.playersModel.myTurnInProgress())
                this.userActions_.activateBuildMode();
        }

        private userSoldHouse(object: any): void {
            const field: number = object[message.UserSoldHouse.field];
            this.model.boardModel.sellHouseOn(field);
            this.viewChanges_.drawHousesOnField(field, this.model.boardModel.houseAmountOn(field));
            if (this.model.playersModel.myTurnInProgress())
                this.userActions_.activateSellMode();
        }

        private userMortgagedField(object: any): void {
            const field: number = object[message.UserMortgaged.field];
            this.model.boardModel.mortgageField(field);
            this.viewChanges_.mortgageField(field);
            if (this.model.playersModel.myTurnInProgress())
                this.userActions_.activateMortageMode();
        }

        private userUnmortgagedField(object: any): void {
            const field: number = object[message.UserUnmortgaged.field];
            this.model.boardModel.unmortgageField(field);
            this.viewChanges_.unmortgageField(field);
            if (this.model.playersModel.myTurnInProgress())
                this.userActions_.activateUnmortageMode();
        }
    }

}
