/// <reference path="./event.ts" />

namespace events {

    export class ClientEvent extends Event {
        constructor(message: string) {
            super(EventType.TO_SEND, message);
        }
    }

}