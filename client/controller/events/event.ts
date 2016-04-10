/// <reference path="../protocol.ts" />

namespace events {

    import prot = protocols;

    export enum EventType {
        TO_EXECUTE,
        TO_SEND
    }

    export class Event {
        private type_: EventType;
        private message: string;

        constructor(type: EventType, message: string) {
            this.type_ = type;
            this.message = message;
        }

        get type(): EventType {
            return this.type_;
        }

        get title(): string {
            return this.message;
        }

        shouldBeSendToServer() {
            return this.type_ === EventType.TO_SEND;
        }

        toJson(): string {
            return JSON.stringify(this);
        }
    }

    class ClientEvent extends Event {
        constructor(message: string) {
            super(EventType.TO_SEND, message);
        }
    }

    export class UsernameChoiceEvent extends ClientEvent {
        constructor(name: string) {
            super(prot.UsernameChoice.message);
            this[prot.UsernameChoice.name] = name;
        }
    }

    export class RollDiceEvent extends ClientEvent {
        constructor() {
            super(prot.RollDice.message);
        }
    }

    export class UserIsReadyEvent extends ClientEvent {
        constructor() {
            super(prot.UserIsReady.message);
        }
    }

    export class ServerEventFactory {
        static createFrom(event: string): ServerEvent {
            const fromServer = JSON.parse(event);
            const eventToEnqueue = this.chooseSubclass(fromServer[prot.eventTitle]);
            for (const prop in fromServer)
                eventToEnqueue[prop] = fromServer[prop];
            return eventToEnqueue;
        }

        private static chooseSubclass(title: string): ServerEvent {
            switch (title) {
                case prot.UsernameValidation.message: return new UsernameValidationEvent();
                case prot.UsernamesObtained.message: return new UsernamesObtainedEvent();
                case prot.GameReset.message: return new GameResetEvent();
                case prot.GameStart.message: return new GameStartEvent();
                case prot.OtherPlayerMoved.message: return new OtherPlayerMovedEvent();
                case prot.NewTurn.message: return new NewTurnEvent();
                case prot.RollResult.message: return new RollResultEvent();
                default: throw `not existing subclass for message ${title}`;
            }
        }
    }

    export class ServerEvent extends Event {
        constructor(message: string) {
            super(EventType.TO_EXECUTE, message);
        }
    }

    export class UsernameValidationEvent extends ServerEvent {
        private valid: boolean

        constructor() {
            super(prot.UsernameValidation.message);
        }

        get isValid(): boolean {
            return this[prot.UsernameValidation.decision];
        }
    }


    export class RollResultEvent extends ServerEvent {
        constructor() {
            super(prot.RollResult.message);
        }

        getResult() {
            return this[prot.RollResult.result];
        }
    }

    export class NewTurnEvent extends ServerEvent {
        constructor() {
            super(prot.NewTurn.message);
        }

        getActivePlayer() {
            return this[prot.NewTurn.activePlayer];
        }
    }

    export class UsernamesObtainedEvent extends ServerEvent {
        constructor() {
            super(prot.UsernamesObtained.message);
        }

        getUsernames(): Array<string> {
            return this[prot.UsernamesObtained.info];
        }
    }

    export class OtherPlayerMovedEvent extends ServerEvent {
        constructor() {
            super(prot.OtherPlayerMoved.message);
        }

        getPlayerName() {
            return this[prot.OtherPlayerMoved.playerName];
        }

        movedBy() {
            return this[prot.OtherPlayerMoved.movedBy];
        }
    }

    export class GameStartEvent extends ServerEvent {
        constructor() {
            super(prot.GameStart.message);
        }
    }

    export class GameResetEvent extends ServerEvent {
        constructor() {
            super(prot.GameReset.message);
        }
    }
    
}