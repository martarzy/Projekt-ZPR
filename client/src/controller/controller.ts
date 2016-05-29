/// <reference path="message.ts" />
/// <reference path="websocket.ts" />
/// <reference path="server-handler.ts" />
/// <reference path="user-actions.ts" />
/// <reference path="view-changes.ts" />

namespace controller {

    export class Controller {
        private model: model.Model;
        private view: view.View;
        private handler: ServerHandler;
        private userActionsHandler: UserActions;
        private server: SocketServer;

        constructor(serverUri: string) {
            this.model = new model.Model();
            this.view = new view.View();
            const viewChanges = new ViewChanges(this.view);
            this.handler = new ServerHandler(this.model, viewChanges);
            this.userActionsHandler = new UserActions(this.sendMessage.bind(this), this.model, viewChanges);
            this.createSocketConnection(serverUri);
        }

        get actionsMap(): UserActions {
            return this.userActionsHandler;
        }

        private createSocketConnection(uri: string): void {
            this.server = new SocketServer(uri, this.delegateMessageToHandler.bind(this));
        }

        sendMessage(toSend: any): void {
            this.server.sendMessage(this.prepareToSend(toSend));
        }

        private prepareToSend(object: any): string {
            return JSON.stringify(object);
        }

        private delegateMessageToHandler(message: any): void {
            console.log(message);
            this.handler.handle(JSON.parse(message));
        }
    }

}
