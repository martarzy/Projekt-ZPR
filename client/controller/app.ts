/// <reference path="./controller.ts" />
/// <reference path="../model/model.ts" />

window.onload = () => {
    const wsUri = 'ws://localhost:8888/ws';
    const controller = new logic.Controller();
    controller.connect(wsUri);
    
    //adding function from controller to html element
    const usernameField = <HTMLInputElement>document.getElementById('username');
    const usernameButton = document.getElementById('submit-username');

    usernameButton.onclick =
        (event: Event) => {
            controller.chooseName.call(controller, usernameField.value);
        };

    controller.start();
}