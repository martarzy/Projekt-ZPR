/// <reference path="./controller.ts" />

window.onload = () => {
    const wsUri = 'ws://localhost:8888/ws';
    const controller = new logic.Controller();
    controller.connect(wsUri);
    
     //adding function from controller to html element
     document.getElementById('username').onclick =
        (event: MouseEvent) => controller.chooseName.call(controller, 'Julek');

    controller.start();
}