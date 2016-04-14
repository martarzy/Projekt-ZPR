/// <reference path="./event.ts" />

namespace events {

    export class ServerEventFactory {
        static createFrom(event: string): ServerEvent {
            const fromServer = JSON.parse(event);
            const eventToEnqueue = this.chooseSubclass(fromServer[protocol.eventTitle]);
            for (const prop in fromServer)
                eventToEnqueue[prop] = fromServer[prop];
            return eventToEnqueue;
        }

        private static chooseSubclass(title: string): ServerEvent {
            switch (title) {
                case protocol.UsernameValidation.message: return new UsernameValidationEvent();
                case protocol.UsernamesObtained.message: return new UsernamesObtainedEvent();
                case protocol.GameReset.message: return new GameResetEvent();
                case protocol.GameStart.message: return new GameStartEvent();
                case protocol.OtherPlayerMoved.message: return new OtherPlayerMovedEvent();
                case protocol.NewTurn.message: return new NewTurnEvent();
                case protocol.RollResult.message: return new RollResultEvent();
                default: throw `not existing subclass for message ${title}`;
            }
        }
    }

    export class ServerEvent extends Event {
        constructor(message: string) {
            super(EventType.TO_EXECUTE, message);
        }
    }

}