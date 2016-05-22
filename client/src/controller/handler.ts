/// <reference path="message.ts" />
/// <reference path="../model/model.ts" />
/// <reference path="../../lib/collections.d.ts" />

namespace controller {

    type EventHandler = (object: any) => void;

    export class HandlerManager {
        private handlers = new collections.Dictionary<string, EventHandler>();

        constructor(private model: model.Model) {
            this.installHandlers();
        }

        // The install method could be exposed to public to simplify adding new handlers.
        private installHandlers(): void {
            this.handlers.setValue(message.UsernameValidation.message, this.nameAccepted.bind(this));
            this.handlers.setValue(message.UsernamesObtained.message, this.addNewUsers.bind(this));
            this.handlers.setValue(message.GameStart.message, this.gameStarts.bind(this));
            this.handlers.setValue(message.GameReset.message, this.gameResets.bind(this));
            this.handlers.setValue(message.OtherPlayerMoved.message, this.someoneMoved.bind(this));
            this.handlers.setValue(message.NewTurn.message, this.newTurn.bind(this));
            this.handlers.setValue(message.SetCash.message, this.setCash.bind(this));
        }

        handle(msgFromServer: any): void {
            this.handlers
                .getValue(msgFromServer[message.messageTitle])
                .call(this, msgFromServer);
        }

        private nameAccepted(object: any): void {
            this.model.players.addNewUser(this.model.players.getMyUsername());
        }

        private addNewUsers(object: any): void {
            const usernames: string[] = object[message.UsernamesObtained.usernamesList];
            const alreadyStored = this.model.players.getUsernames();
            const newUsernames = usernames.filter(username => alreadyStored.indexOf(username) < 0);
            for (const username of newUsernames)
                this.model.players.addNewUser(username);
        }

        private gameStarts(object: any): void {
            this.model.board.placePawnsOnBoard(this.model.players.getUsernames());
        }

        private gameResets(object: any): void {
            // no changes in model
        }

        private someoneMoved(object: any): void {
            const username: string = object[message.OtherPlayerMoved.playerName];
            const rollResult: number = object[message.OtherPlayerMoved.movedBy];
            this.model.board.movePawn(username, rollResult);
        }

        private newTurn(object: any): void {
            const newActive: string = object[message.NewTurn.activePlayer];
            this.model.players.setActivePlayer(newActive);
        }

        private setCash(object: any): void {
            const target: string = object[message.SetCash.target];
            const cash: string = object[message.SetCash.amount];
            // update model
        }
    }

}
