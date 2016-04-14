/// <reference path="message.ts" />
/// <reference path="websocket.ts" />
/// <reference path="handler.ts" />

namespace controller {

    export class Controller {
        private model: model.Model;
        private handler: HandlerManager;
        private server: SocketServer;

        constructor(serverUri: string) {
            this.model = new model.Model();
            this.handler = new HandlerManager(this.model);
            this.createSocketConnection(serverUri);
        }

        private createSocketConnection(uri: string) {
            this.server = new SocketServer(uri, this.delegateMessageToHandler.bind(this));
        }

        private sendMessage(toSend: any) {
            this.server.sendMessage(toSend);
        }

        private delegateMessageToHandler(message: any): void {
            console.log(message);
            this.handler.handle(JSON.parse(message));
        }

        // Methods below could be moved to UserActions class.
        // The web browser would have access only to an instance 
        // of this class and it would be passed to controller.

        chooseName(name: string) {
            let toSend: any = { };
            toSend[message.messageTitle] = message.UsernameChoice.message;
            toSend[message.UsernameChoice.name] = name;
            this.model.players.setMyUsername(name);
            this.sendMessage(this.prepareToSend(toSend));
        }

        rollDice() {
            let toSend: any = {};
            toSend[message.messageTitle] = message.RollDice.message;
            this.sendMessage(this.prepareToSend(toSend));
        }

        playerIsReady() {
            let toSend: any = {};
            toSend[message.messageTitle] = message.UserIsReady.message;
            this.sendMessage(this.prepareToSend(toSend));
        }

        private prepareToSend(object: any): string {
            return JSON.stringify(object);
        }
    }

}