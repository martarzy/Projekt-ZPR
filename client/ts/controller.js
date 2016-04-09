/// <reference path="../Scripts/collections.ts" />
/// <reference path="server.ts" />
/// <reference path="event.ts" />
"use strict";
var logic;
(function (logic) {
    var Queue = collections.Queue;
    var Dict = collections.Dictionary;
    var EvType = events.EventType;
    var Controller = (function () {
        function Controller() {
            this.events = new Queue();
            this.handlers = new Dict();
            this.prepareHandlers();
        }
        Controller.prototype.connect = function (uri) {
            if (this.server == null) {
                this.server = new server.SocketServer(uri);
                this.server.addEventQueue(this.events);
            }
        };
        Controller.prototype.start = function () {
            if (this.mainLoopTimerID == null)
                this.mainLoopTimerID = setInterval(this.handleEvents.bind(this), 500);
        };
        Controller.prototype.stop = function () {
            if (this.mainLoopTimerID != null)
                clearTimeout(this.mainLoopTimerID);
        };
        // everything below should be moved to other controllers
        Controller.prototype.chooseName = function (name) {
            this.events.enqueue(new events.ChooseNameEvent(name));
        };
        Controller.prototype.rollDice = function () {
            this.events.enqueue(new events.RollDiceEvent());
        };
        Controller.prototype.playerIsReady = function (name) {
            this.events.enqueue(new events.PlayerReadyEvent());
        };
        Controller.prototype.handleEvents = function () {
            while (!this.events.isEmpty()) {
                var event_1 = this.events.dequeue();
                this.handleEvent(event_1);
            }
        };
        Controller.prototype.handleEvent = function (event) {
            if (event.type === EvType.TO_SEND)
                this.sendToServer(event.toJson());
            else {
                var handler = this.handlers.getValue(event.message);
                handler(event);
            }
        };
        Controller.prototype.sendToServer = function (event) {
            this.server.sendMessage(event);
        };
        Controller.prototype.prepareHandlers = function () {
            this.handlers.setValue('userList', this.nameAccepted.bind(this));
            this.handlers.setValue('nameAccepted', this.otherPlayersInfo.bind(this));
            this.handlers.setValue('start', this.gameStarts.bind(this));
            this.handlers.setValue('reset', this.gameResets.bind(this));
            this.handlers.setValue('rollResult', this.rolledValue.bind(this));
            this.handlers.setValue('anotherPlayerMove', this.someoneMoved.bind(this));
            this.handlers.setValue('yourTurn', this.myTurn.bind(this));
        };
        Controller.prototype.nameAccepted = function (event) {
            console.log(event.message);
            console.log('Was my name accepted? ' + event.isValid);
        };
        Controller.prototype.otherPlayersInfo = function (event) {
            console.log(event.message);
            console.log('Other players: ' + event['userList']);
        };
        Controller.prototype.gameStarts = function (event) {
            console.log('Game has started');
        };
        Controller.prototype.gameResets = function (event) {
            console.log('Game reseted');
        };
        Controller.prototype.rolledValue = function (event) {
            console.log('Rolled value is ' + event['rollResult']);
        };
        Controller.prototype.someoneMoved = function (event) {
            console.log(event['player'] + ' moved by ' + event['move']);
        };
        Controller.prototype.myTurn = function (event) {
            console.log('Its my turn now!');
        };
        return Controller;
    })();
    logic.Controller = Controller;
})(logic || (logic = {}));
//# sourceMappingURL=controller.js.map