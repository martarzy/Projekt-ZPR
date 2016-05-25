/// <reference path="message.ts" />
/// <reference path="../model/model.ts" />
/// <reference path="../view/view.ts" />
/// <reference path="../../lib/collections.d.ts" />

namespace controller {

    type EventHandler = (object: any) => void;

    export class HandlerManager {
        private handlers = new collections.Dictionary<string, EventHandler>();

        constructor(private model: model.Model, private view: view.View) {
            this.installHandlers();
        }

        // The install method could be exposed to public to simplify adding new handlers.
        private installHandlers(): void {
            this.handlers.setValue(message.NameAccepted.message, this.nameAccepted.bind(this));
            this.handlers.setValue(message.UserList.message, this.synchUsers.bind(this));
            this.handlers.setValue(message.Start.message, this.gameStarts.bind(this));
            this.handlers.setValue(message.PlayerMove.message, this.someoneMoved.bind(this));
            this.handlers.setValue(message.NewTurn.message, this.newTurn.bind(this));
            this.handlers.setValue(message.SetCash.message, this.setCash.bind(this));
        }

        handle(msgFromServer: any): void {
            this.handlers
                .getValue(msgFromServer[message.messageTitle])
                .call(this, msgFromServer);
        }

        private nameAccepted(object: any): void {
            if(object[message.NameAccepted.decision]) {
                this.model.players.addNewUser(this.model.players.getMyUsername());
                this.view.hideSignInWindow();
            }
            const errorMessage = object[message.NameAccepted.reason];
            this.view.showError(errorMessage);
        }

        private synchUsers(object: any): void {
            const usernames: string[] = object[message.UserList.usernamesList];
            const alreadyStored = this.model.players.getUsernames();
            const newUsernames = usernames.filter(username => alreadyStored.indexOf(username) < 0);
            for (const username of newUsernames)
                this.model.players.addNewUser(username);
            if(usernames.length >= 2)
                this.view.setActiveReadyButton();
            else
                this.view.setDisabledReadyButton();
        }

        private gameStarts(object: any): void {
            this.model.board.placePawnsOnBoard(this.model.players.getUsernames());
        }

        private someoneMoved(object: any): void {
            const username: string = object[message.PlayerMove.playerName];
            const rollResult: number = object[message.PlayerMove.movedBy];
            this.model.board.movePawn(username, rollResult);
        }

        private newTurn(object: any): void {
            const newActive: string = object[message.NewTurn.activePlayer];
            this.model.players.setActivePlayer(newActive);
            if(this.model.players.getMyUsername() === newActive)
                this.view.setActiveRollButton();
            else
                this.view.setDisabledRollButton();
        }

        private setCash(object: any): void {
            const target: string = object[message.SetCash.target];
            const cash: number = object[message.SetCash.amount];
            this.model.players.setCash(target, cash);
        }
    }

}
