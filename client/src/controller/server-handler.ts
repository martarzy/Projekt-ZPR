/// <reference path="message.ts" />
/// <reference path="view-changes.ts" />
/// <reference path="../model/model.ts" />
/// <reference path="../../lib/collections.d.ts" />

namespace controller {

    type EventHandler = (object: any) => void;

    export class ServerHandler {
        private handlers = new collections.Dictionary<string, EventHandler>();

        constructor(private model: model.Model, private viewChanges_: ViewChanges) {
            this.installHandlers();
        }

        // The install method could be exposed to public to simplify adding new handlers.
        // TODO bind may be omitted as handle uses call
        private installHandlers(): void {
            this.handlers.setValue(message.NameAccepted.message, this.nameAccepted.bind(this));
            this.handlers.setValue(message.UserList.message, this.synchUsers.bind(this));
            this.handlers.setValue(message.Start.message, this.gameStarts.bind(this));
            this.handlers.setValue(message.PlayerMove.message, this.someoneMoved.bind(this));
            this.handlers.setValue(message.NewTurn.message, this.newTurn.bind(this));
            this.handlers.setValue(message.SetCash.message, this.setCash.bind(this));
            this.handlers.setValue(message.UserBought.message, this.userBought.bind(this));
        }

        handle(msgFromServer: any): void {
            this.handlers
                .getValue(msgFromServer[message.messageTitle])
                .call(this, msgFromServer);
        }

        private nameAccepted(object: any): void {
            if (object[message.NameAccepted.decision])
                this.viewChanges_.show(ViewElement.JOIN_MODAL, false);
            const errorMessage = object[message.NameAccepted.reason];
            this.viewChanges_.errorMessage(errorMessage);
        }

        private synchUsers(object: any): void {
            const usernames: string[] = object[message.UserList.usernamesList];
            const alreadyStored = this.model.players.getUsernames();
            const newUsernames = usernames.filter(username => alreadyStored.indexOf(username) < 0);
            for (const username of newUsernames)
                this.model.players.addNewUser(username);
            if (usernames.length >= 2)
                this.viewChanges_.show(ViewElement.READY_BTN, true);
            else
                this.viewChanges_.show(ViewElement.READY_BTN, false);
            this.updatePlayerList(this.model.players.getPlayers());
        }

        private gameStarts(object: any): void {
            this.model.board.placePawnsOnBoard(this.model.players.getUsernames());
        }

        private someoneMoved(object: any): void {
            const username: string = object[message.PlayerMove.playerName];
            const rollResult: number = object[message.PlayerMove.movedBy];
            this.model.board.movePawn(username, rollResult);
            // TODO movePawn in view
            const field = this.model.board.getField(username);
            if (this.model.players.iAmActive()) {
                this.model.round.playerMoved();
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
            else
                this.viewChanges_.show(ViewElement.ROLL_BTN, false);
            this.updatePlayerList(this.model.players.getPlayers());
        }

        updatePlayerList(players: Array<model.Player>) {
            let toPrint = this.playersToPlayersDTO(this.model.players.getPlayers());
            this.viewChanges_.updatePlayerList(toPrint);
        }

        playersToPlayersDTO(players: Array<model.Player>): Array<view.PlayerDTO> {
            return players.map(player => this.playerToPlayerDTO(player));
        }

        private playerToPlayerDTO(player: model.Player): view.PlayerDTO {
            let dto = new view.PlayerDTO();
            dto.username = player.username;
            dto.cash = player.cash;
            dto.active = this.model.players.getActivePlayer() === player.username;
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
            this.model.board.getField(buyer).markAsBought(buyer);
            //TOCHECK Is setCash called by server after userBought
            //TODO update view
        }
    }

}
