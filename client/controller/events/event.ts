namespace events {

    export const protocol = protocols;

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

}