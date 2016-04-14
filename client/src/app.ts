/// <reference path="./controller/controller.ts" />

window.onload = () => {
    const wsUri = "ws://localhost:8888/ws";
    const control = new controller.Controller(wsUri);

    // adding function from controller to html element
    const usernameField = <HTMLInputElement>document.getElementById("username");
    const usernameButton = document.getElementById("submit-username");

    usernameButton.onclick =
        (event: Event) => control.chooseName.bind(control, usernameField.value);
};