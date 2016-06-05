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
         * Assigns onClick callback to the board fields.
         * @param serverUri uri string providing connection to server
         */
        constructor(serverUri: string) {
            this.createSocketConnection(serverUri);

            const viewChanges = new ViewChanges(this.view_);
            this.userActions_ = new UserActions(this.sendMessage.bind(this), this.model_, viewChanges);
            this.serverHandler_ = new ServerHandler(this.model_, viewChanges, this.userActions_);

            this.view_.assignFieldClickedCallback(this.userActions_.fieldClicked.bind(this.userActions_));
        }

        private createSocketConnection(uri: string): void {
            this.server_ = new SocketServer(uri, this.delegateMessageToHandler.bind(this));
        }
        
        /**
         * Exposes handlers of available user actions to allow bind
         * them with view buttons.
         */
        get userActions(): UserActions {
            return this.userActions_;
        }

        /**
         * Sends message to server via the SocketServer object.
         * @param objectToSend
         */
        sendMessage(objectToSend: any): void {
            const toSend = JSON.stringify(objectToSend);
            console.log("Client sent: " + toSend);
            this.server_.sendMessage(toSend);
        }

        private delegateMessageToHandler(message: any): void {
            console.log("Server sent: " + message);
            this.serverHandler_.handle(JSON.parse(message));
        }
    }

}
