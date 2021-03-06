﻿namespace controller {

    export type MessageConsumer = (message: any) => void;

    /**
     * Simple wrapper for WebSocket object. Provides sending messages
     * method and possibility of installing method called after message
     * receivement.
     */
    export class SocketServer {
        private socket: WebSocket;
        private onMessageCallback: MessageConsumer;

        constructor(uri: string, consumer: MessageConsumer) {
            this.socket = new WebSocket(uri);
            this.onMessageCallback = consumer;
            this.socket.onmessage = this.messageConsumerAdapter.bind(this);
        }

        messageConsumerAdapter(ev: MessageEvent): void {
            this.onMessageCallback(ev.data);
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

        private delayMessage(message: string): void {
            setTimeout(() => this.sendMessage(message), 1);
        }
    }

}