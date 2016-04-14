/// <reference path="./clientEvent.ts" />
/// <reference path="../protocol.ts" />

namespace events {

    export class UsernameChoiceEvent extends ClientEvent {
        constructor(name: string) {
            super(protocol.UsernameChoice.message);
            this[protocol.UsernameChoice.name] = name;
        }
    }

    export class RollDiceEvent extends ClientEvent {
        constructor() {
            super(protocol.RollDice.message);
        }
    }

    export class UserIsReadyEvent extends ClientEvent {
        constructor() {
            super(protocol.UserIsReady.message);
        }
    }

}