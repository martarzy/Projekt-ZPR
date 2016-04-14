/// <reference path="events/serverEvent.ts" />
/// <reference path="events/event.ts" />

namespace server {

    import Queue = collections.Queue;
    import Event = events.Event;

    export class SocketServer {
        private socket: WebSocket;
        // maybe just pass a function to pass events, like (ev: Event) => void
        private events: Queue<Event>;

        

        constructor(uri: string) {
            this.socket = new WebSocket(uri);
            this.registerHandlers();
        }

        private registerHandlers(): void {
            this.socket.onmessage = this.onMessage.bind(this);
        }

        private onMessage(event: MessageEvent): void {
            console.log("Obtained " + event.data);

            // probably needs to be moved somewhere else, maybe to enqueue method
            // of custom EventQueue class
            const eventToEnqueue = events.ServerEventFactory.createFrom(event.data);

            this.events.enqueue(eventToEnqueue);
        }

        addEventQueue(events: Queue<Event>) {
            this.events = events;
        }

        sendMessage(message: string): void {
            if (this.socketIsReady()) {
                this.socket.send(message);
            } else {
                this.delayMessage(message);
            }
        }

        private socketIsReady(): boolean {
            return this.socket.readyState === 1;
        }

        private delayMessage(message: string) {
            setTimeout(() => this.sendMessage(message), 1);
        }
    }

}