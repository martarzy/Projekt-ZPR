/// <reference path="./controller.ts" />
window.onload = function () {
    var wsUri = 'ws://localhost:8888/ws';
    var controller = new logic.Controller();
    controller.connect(wsUri);
    //adding function from controller to html element
    document.getElementById('username').onclick =
        function (event) { return controller.chooseName.call(controller, 'Julek'); };
    controller.start();
};
//# sourceMappingURL=app.js.map