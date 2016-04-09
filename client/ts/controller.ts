/// <reference path="../Scripts/collections.ts" />
/// <reference path="protocol.ts" />
/// <reference path="server.ts" />
/// <reference path="event.ts" />

"use strict";

namespace logic {

    import prot = protocols;
    import Queue = collections.Queue;
    import Dict = collections.Dictionary;
    import Set = collections.Set;
    import Event = events.Event;
    import EvType = events.EventType;
    type EventQueue = Queue<Event>;
    type EventHandler = (ev: Event) => void;
    type HandlerMap = Dict<string, EventHandler>;

    export class Controller {
        private server: server.SocketServer;
        private mainLoopTimerID: number;
        private events: EventQueue;
        private handlers: HandlerMap;
        private players: Set<model.Player>;

        constructor() {
            this.events = new Queue<Event>();
            this.handlers = new Dict<string, EventHandler>();
            this.prepareHandlers();
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
            if (event.type === EvType.TO_SEND) {
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
            this.handlers.setValue(prot.PlayersConnected.message, this.otherPlayersInfo.bind(this));
            this.handlers.setValue(prot.GameStart.message, this.gameStarts.bind(this));
            this.handlers.setValue(prot.GameReset.message, this.gameResets.bind(this));
            this.handlers.setValue(prot.RollResult.message, this.rolledValue.bind(this));
            this.handlers.setValue(prot.OtherPlayerMoved.message, this.someoneMoved.bind(this));
            this.handlers.setValue(prot.MyTurn.message, this.myTurn.bind(this));
        }

        // everything below should be moved to other controllers
<<<<<<< HEAD
        // the UserActions class may be extracted 
=======
>>>>>>> b5c035b127be20beabaa885681d1f68477901c33

        chooseName(name: string) {
            this.events.enqueue(new events.UsernameChoiceEvent(name));
        }

        rollDice() {
            this.events.enqueue(new events.RollDiceEvent());
        }

        playerIsReady() {
            this.events.enqueue(new events.UserIsReadyEvent());
        } 

        private nameAccepted(event: events.UsernameValidationEvent) {
            console.log('Was my name accepted? ' + event.isValid);
        }

        private otherPlayersInfo(event: events.PlayersConnectedEvent) {
            console.log('Other players: ' + event.getUsersInfo());
        }

        private gameStarts(event: events.GameStartEvent) {
            console.log('Game has started');
        }

        private gameResets(event: events.GameResetEvent) {
            console.log('Game reseted');
        }

        private rolledValue(event: events.RollResultEvent) {
            console.log('Rolled value is ' + event.getResult());
        }

        private someoneMoved(event: events.OtherPlayerMovedEvent) {
            console.log(event.getPlayerName() + ' moved by ' + event.movedBy());
        }

        private myTurn(event: events.MyTurnEvent) {
            console.log('Its my turn now!');
        }

    }

}