/// <reference path="protocol.ts" />

namespace events {

    import prot = protocols;

    export enum EventType {
        TO_EXECUTE,
        TO_SEND
    }

    export class ServerEventFactory {
        static createFrom(event: string): ServerEvent {
            const fromServer = JSON.parse(event);
            const eventToEnqueue = this.chooseSubclass(fromServer['message']);
            for (const prop in fromServer) {
                if (prop !== 'message')
                    eventToEnqueue[prop] = fromServer[prop];
            }
            return eventToEnqueue;
        }

        private static chooseSubclass(title: string): ServerEvent {
            switch (title) {
                case prot.UsernameValidation.message: return new UsernameValidationEvent();
                case prot.PlayersConnected.message: return new PlayersConnectedEvent();
                case prot.GameReset.message: return new GameResetEvent();
                case prot.GameStart.message: return new GameStartEvent();
                case prot.OtherPlayerMoved.message: return new OtherPlayerMovedEvent();
                case prot.MyTurn.message: return new MyTurnEvent();
                case prot.RollResult.message: return new RollResultEvent();
                default: throw { error: `not existing subclass for message ${title}` };
            }
        }
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

        toJson(): string {
            return JSON.stringify(this);
        }
    }

    class UserEvent extends Event {
        constructor(message: string) {
            super(EventType.TO_SEND, message);
        }
    }

    export class ServerEvent extends Event {
        constructor(message: string) {
            super(EventType.TO_EXECUTE, message);
        }
    }

    export class UsernameChoiceEvent extends UserEvent {
        constructor(name: string) {
            super(prot.UsernameChoice.message);
            this[prot.UsernameChoice.name] = name;
        }
    }

    export class UsernameValidationEvent extends ServerEvent {
        private valid: boolean

        constructor() {
            super(prot.UsernameValidation.message);
        }

        get isValid(): boolean {
            return this.valid;
        }
    }  

    export class RollDiceEvent extends UserEvent {
        constructor() {
            super(prot.RollDice.message);
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

    export class MyTurnEvent extends UserEvent {
        constructor() {
            super(prot.MyTurn.message);
        }
    }

    export class UserIsReadyEvent extends UserEvent {
        constructor() {
            super(prot.UserIsReady.message);
        }
    }

    export class PlayersConnectedEvent extends ServerEvent {
        constructor() {
            super(prot.PlayersConnected.message);
        }

        getUsersInfo() {
            return this[prot.PlayersConnected.info];
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