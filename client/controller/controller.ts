/// <reference path="../Scripts/collections.ts" />
/// <reference path="../model/model.ts" />
/// <reference path="protocol.ts" />
/// <reference path="server.ts" />
/// <reference path="events/Event.ts" />

"use strict";

namespace logic {

    import prot = protocols;
    import Queue = collections.Queue;
    import Dict = collections.Dictionary;
    import Event = events.Event;
    type EventQueue = Queue<Event>;
    type EventHandler = (ev: Event) => void;
    type HandlerMap = Dict<string, EventHandler>;

    export class Controller {
        private server: server.SocketServer;
        private model: model.Model;
        private mainLoopTimerID: number;
        private events: EventQueue;
        private handlers: HandlerMap;
        private myUsername: string;

        constructor() {
            this.events = new Queue<Event>();
            this.handlers = new Dict<string, EventHandler>();
            this.prepareHandlers();
            this.model = new model.Model();
        }

        connect(uri: string): void {
            if (this.server == null) {
                this.server = new server.SocketServer(uri);
                this.server.addEventQueue(this.events);
            }        
        }

        start(): void {
            if (this.mainLoopTimerID == null)
                this.mainLoopTimerID = setInterval(this.handleEvents.bind(this), 500);
        }

        stop(): void {
            if (this.mainLoopTimerID != null)
                clearTimeout(this.mainLoopTimerID);
        }

        private handleEvents() {
            while (!this.events.isEmpty()) {
                let event: Event = this.events.dequeue();
                this.handleEvent(event);
            }
        }

        private handleEvent(event: Event) {
            if (event.shouldBeSendToServer()) {
                console.log('Enqueueing');
                console.log(event);
                this.sendToServer(event.toJson());
            }                
            else {
                const handler = this.handlers.getValue(event.title);
                handler(event);
            }    
        }

        private sendToServer(event: string) {
            this.server.sendMessage(event);
        }

        private prepareHandlers(): void {
            this.handlers.setValue(prot.UsernameValidation.message, this.nameAccepted.bind(this));
            this.handlers.setValue(prot.UsernamesObtained.message, this.otherPlayersInfo.bind(this));
            this.handlers.setValue(prot.GameStart.message, this.gameStarts.bind(this));
            this.handlers.setValue(prot.GameReset.message, this.gameResets.bind(this));
            this.handlers.setValue(prot.RollResult.message, this.rolledValue.bind(this));
            this.handlers.setValue(prot.OtherPlayerMoved.message, this.someoneMoved.bind(this));
            this.handlers.setValue(prot.NewTurn.message, this.newTurn.bind(this));
        }

        // everything below should be moved to other controllers
        // the UserActions class may be extracted 

        chooseName(name: string) {
            this.myUsername = name;
            this.events.enqueue(new events.UsernameChoiceEvent(name));
        }

        rollDice() {
            this.events.enqueue(new events.RollDiceEvent());
        }

        playerIsReady() {
            this.events.enqueue(new events.UserIsReadyEvent());
        } 

        private nameAccepted(event: events.UsernameValidationEvent) {
            this.model.updateUserList([this.myUsername]);
        }

        private otherPlayersInfo(event: events.UsernamesObtainedEvent) {
            this.model.updateUserList(event.getUsernames());
        }

        private gameStarts(event: events.GameStartEvent) {
            this.model.gameStarted();
        }

        private gameResets(event: events.GameResetEvent) {
            console.log('Game reseted');
        }

        private rolledValue(event: events.RollResultEvent) {
            this.model.movePawn(this.myUsername, event.getResult());
        }

        private someoneMoved(event: events.OtherPlayerMovedEvent) {
            this.model.movePawn(event.getPlayerName(), event.movedBy());
        }

        private newTurn(event: events.NewTurnEvent) {
            this.model.updateTurn(event.getActivePlayer());
        }

    }

}