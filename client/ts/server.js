var server;
(function (server) {
    var SocketServer = (function () {
        function SocketServer(uri) {
            this.socket = new WebSocket(uri);
            this.registerHandlers();
        }
        SocketServer.prototype.registerHandlers = function () {
            this.socket.onmessage = this.onMessage.bind(this);
        };
        SocketServer.prototype.onMessage = function (event) {
            console.log('Enqueueing ' + event.data);
            this.events.enqueue(JSON.parse(event.data));
        };
        SocketServer.prototype.addEventQueue = function (events) {
            this.events = events;
        };
        SocketServer.prototype.sendMessage = function (message) {
            if (this.socketIsReady())
                this.socket.send(message);
            else
                this.delayMessage(message);
        };
        SocketServer.prototype.socketIsReady = function () {
            return this.socket.readyState == 1;
        };
        SocketServer.prototype.delayMessage = function (message) {
            var _this = this;
            setTimeout(function () { return _this.sendMessage(message); }, 1);
        };
        return SocketServer;
    })();
    server.SocketServer = SocketServer;
})(server || (server = {}));
//# sourceMappingURL=server.js.map