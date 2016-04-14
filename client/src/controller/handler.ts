﻿/// <reference path="message.ts" />
/// <reference path="../model/Model.ts" />
/// <reference path="../../scripts/collections.ts" />

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
        }

        handle(msgFromServer: any): void {
            this.handlers
                .getValue(msgFromServer[message.messageTitle])
                .call(this, msgFromServer);
        }

        private nameAccepted(object: any) {
            this.model.players.addNewUser(this.model.players.getMyUsername());
        }

        private addNewUsers(object: any) {
            const usernames: string[] = object[message.UsernamesObtained.usernamesList];
            const alreadyStored = this.model.players.getUsernames();
            const newUsernames = usernames.filter(username => alreadyStored.indexOf(username) < 0);
            for (const username of newUsernames)
                this.model.players.addNewUser(username);
        }

        private gameStarts(object: any) {
            this.model.board.placePawnsOnBoard(this.model.players.getUsernames());
        }

        private gameResets(object: any) {
            // no changes in model
        }

        private someoneMoved(object: any) {
            const username: string = object[message.OtherPlayerMoved.playerName];
            const rollResult: number = object[message.OtherPlayerMoved.movedBy];
            this.model.board.movePawn(username, rollResult);
        }

        private newTurn(object: any) {
            const newActive: string = object[message.NewTurn.activePlayer];
            this.model.players.setActivePlayer(newActive);
        }
    }

}