/// <reference path="message.ts" />
/// <reference path="websocket.ts" />
/// <reference path="server-handler.ts" />
/// <reference path="user-actions.ts" />
/// <reference path="view-changes.ts" />

namespace controller {

    export class Controller {
        private server: SocketServer;
        private model: model.Model;
        private view: view.View;
        private serverHandler: ServerHandler;
        private userActions: UserActions;

        constructor(serverUri: string) {
            this.model = new model.Model();
            this.view = new view.View();

            const viewChanges = new ViewChanges(this.view);
            this.userActions = new UserActions(this.sendMessage.bind(this), this.model, viewChanges);
            this.serverHandler = new ServerHandler(this.model, viewChanges, this.userActions);

            this.view.assignFieldClickedCallback(this.userActions.fieldClicked.bind(this.userActions));
            this.createSocketConnection(serverUri);
        }

        get actionsMap(): UserActions {
            return this.userActions;
        }

        private createSocketConnection(uri: string): void {
            this.server = new SocketServer(uri, this.delegateMessageToHandler.bind(this));
        }

        sendMessage(toSend: any): void {
            console.log("Client sent: " + JSON.stringify(toSend));
            this.server.sendMessage(this.prepareToSend(toSend));
        }

        private prepareToSend(object: any): string {
            return JSON.stringify(object);
        }

        private delegateMessageToHandler(message: any): void {
            console.log("Server sent: " + message);
            this.serverHandler.handle(JSON.parse(message));
        }
    }

}
