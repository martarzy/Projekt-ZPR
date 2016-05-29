/// <reference path="message.ts" />
/// <reference path="view-changes.ts" />
/// <reference path="../model/model.ts" />
/// <reference path="../../lib/collections.d.ts" />

namespace controller {

    type EventHandler = (object: any) => void;

    export class ServerHandler {
        private handlers = new collections.Dictionary<string, EventHandler>();
        private colorManager_: model.ColorManager;

        constructor(private model: model.Model, private viewChanges_: ViewChanges) {
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
            this.model.players.resetPlayers();
            for (let i = 0; i < usernames.length; ++i)
                this.model.players.addNewUser(usernames[i], this.colorManager_.getColor(i));
            if (usernames.length >= 2)
                this.viewChanges_.show(ViewElement.READY_BTN, true);
            else
                this.viewChanges_.show(ViewElement.READY_BTN, false);
            this.updatePlayerList(this.model.players.getPlayers());
        }

        private gameStarts(object: any): void {
            this.model.board.placePawnsOnBoard(this.model.players.getPlayers());
            let playersDTO = this.playersToPlayersDTO(this.model.players.getPlayers());
            this.viewChanges_.startGame(playersDTO);
        }

        private someoneMoved(object: any): void {
            const username: string = object[message.PlayerMove.playerName];
            const rollResult: number = object[message.PlayerMove.movedBy];
            this.model.board.movePawn(username, rollResult);
            const field = this.model.board.getField(username);
            this.viewChanges_.movePawn(username, field.id);
            console.log(field.id);
            if (this.model.players.iAmActive()) {
                this.model.round.playerMoved();
                // TODO unlock endOfTurn button
                if(!field.hasOwner
                    && field.cost <= this.model.players.getActivePlayerFunds()) {
                    //TODO unlockBuyButton
                }
            }
        }

        private newTurn(object: any): void {
            const newActive: string = object[message.NewTurn.activePlayer];
            this.model.players.setActivePlayer(newActive);
            this.model.round.reset();
            if (this.model.players.iAmActive())
                this.viewChanges_.show(ViewElement.ROLL_BTN, true);
            this.updatePlayerList(this.model.players.getPlayers());
        }

        private updatePlayerList(players: Array<model.Player>) {
            let toPrint = this.playersToPlayersDTO(this.model.players.getPlayers());
            this.viewChanges_.updatePlayerList(toPrint);
        }

        private playersToPlayersDTO(players: Array<model.Player>): Array<view.PlayerDTO> {
            return players.map(player => this.playerToPlayerDTO(player));
        }

        private playerToPlayerDTO(player: model.Player): view.PlayerDTO {
            let dto = new view.PlayerDTO();
            dto.username = player.username;
            dto.cash = player.cash;
            dto.active = this.model.players.getActivePlayer() === player.username;
            dto.color = player.color;
            return dto;
        }

        private setCash(object: any): void {
            const target: string = object[message.SetCash.target];
            const cash: number = object[message.SetCash.amount];
            this.model.players.setCash(target, cash);
            this.updatePlayerList(this.model.players.getPlayers());
        }

        private userBought(object: any): void {
            const buyer: string = object[message.UserBought.buyerName];
            this.model.board.buyField(buyer);
            //TODO update view
        }
    }

}
