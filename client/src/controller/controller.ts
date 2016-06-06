/// <reference path="message.ts" />
/// <reference path="websocket.ts" />
/// <reference path="server-handler.ts" />
/// <reference path="user-actions.ts" />
/// <reference path="view-changes.ts" />

namespace controller {

    /**
     * Creates components required to start the game.
     * Provides communication between client and server
     * via websockets.
     */
    export class Controller {
        private model_ = new model.Model();
        private view_ = new view.View();

        private server_: SocketServer;
        private serverHandler_: ServerHandler;
        private userActions_: UserActions;

        /**
         * Connects with the websockets with uri given as a parameter.
         * Creates model, view and handlers of user's actions and server responses.
         * @param serverUri uri string providing connection to server
         */
        constructor(serverUri: string) {
            const viewChanges = new ViewChanges(this.view_);
            this.server_ = new SocketServer(serverUri, this.delegateMessageToHandler.bind(this));
            this.userActions_ = new UserActions(this.sendMessage.bind(this), this.model_, this.view_, viewChanges);
            this.serverHandler_ = new ServerHandler(this.model_, viewChanges, this.userActions_);
        }

        /**
         * Sends message to server via the SocketServer object.
         * @param objectToSend
         */
        sendMessage(objectToSend: any): void {
            const toSend = JSON.stringify(objectToSend);
            this.server_.sendMessage(toSend);
        }

        private delegateMessageToHandler(message: any): void {
            this.serverHandler_.handle(JSON.parse(message));
        }
    }

}
